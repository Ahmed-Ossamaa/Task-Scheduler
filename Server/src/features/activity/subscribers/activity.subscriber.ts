import {
  EventSubscriber,
  EntitySubscriberInterface,
  InsertEvent,
  RemoveEvent,
  DataSource,
  SoftRemoveEvent,
} from 'typeorm';
import { Injectable, Logger } from '@nestjs/common';
import { ActivityLog } from '../entities/activity-log.entity';
import { ActionType } from '../types/activity-log-types';
import { User } from 'src/features/users/entities/user.entity';
import { Organization } from 'src/features/organizations/entities/organization.entity';

@Injectable()
@EventSubscriber()
export class ActivitySubscriber implements EntitySubscriberInterface {
  private readonly logger = new Logger(ActivitySubscriber.name);
  constructor(dataSource: DataSource) {
    dataSource.subscribers.push(this);
  }

  //Track Org and Users Tables
  private readonly trackedTables = ['organizations', 'users'];

  async afterInsert(event: InsertEvent<User | Organization>) {
    if (!this.trackedTables.includes(event.metadata.tableName)) return;

    const extraInfo = this.getEntityDetails(event.entity);
    const entityName =
      event.metadata.tableName === 'organizations' ? 'Organization' : 'User';

    const log = new ActivityLog();
    log.actionType = ActionType.CREATED;
    log.entityType = event.metadata.tableName;
    log.entityId = event.entity.id;
    log.details = `New ${entityName} created${extraInfo}`;

    await event.manager.save(ActivityLog, log);
  }

  /**
   * Triggered after a row is removed from  a table ( Users, Organizations ).
   * Creates an activity log entry with action type 'DELETED' and details about the deleted row.
   * @param event The remove event.
   */
  async afterRemove(event: RemoveEvent<User | Organization>) {
    if (!this.trackedTables.includes(event.metadata.tableName)) return;

    let deletedId: string | undefined;

    //entity?.id: if there is a fully loaded entity passed (for remove methods)
    if (event.entity?.id) {
      deletedId = event.entity.id;
      //entityId: if there is just an Id passed instead of a fully loaded entity
    } else if (typeof event.entityId === 'string') {
      deletedId = event.entityId;
    }

    // if there is no Id at all (undefined) or no id due to bulk delete
    if (!deletedId) {
      return;
    }

    const extraInfo = this.getEntityDetails(event.entity);

    const entityName =
      event.metadata.tableName === 'organizations' ? 'Organization' : 'User';

    const log = new ActivityLog();
    log.actionType = ActionType.DELETED;
    log.entityType = event.metadata.tableName;
    log.entityId = deletedId;
    log.details = `A ${entityName} was hard deleted${extraInfo}`;
    await event.manager.save(ActivityLog, log);
  }

  async afterSoftRemove(event: SoftRemoveEvent<User | Organization>) {
    if (!this.trackedTables.includes(event.metadata.tableName)) return;

    let deletedId: string | undefined;
    if (event.entity?.id) deletedId = event.entity.id;
    else if (typeof event.entityId === 'string') deletedId = event.entityId;

    // if there is no Id at all (undefined) or no id due to bulk delete
    if (!deletedId) {
      return;
    }

    const extraInfo = this.getEntityDetails(event.entity);

    const entityName =
      event.metadata.tableName === 'organizations' ? 'Organization' : 'User';

    const log = new ActivityLog();
    log.actionType = ActionType.ARCHIVED;
    log.entityType = event.metadata.tableName;
    log.entityId = deletedId;
    log.details = `A ${entityName} was soft deleted${extraInfo}`;

    await event.manager.save(ActivityLog, log);
  }

  private getEntityDetails(entity: unknown): string {
    if (!entity) return '';
    // If its a User, return email and email
    if (entity instanceof User) {
      return ` (${entity.name} - ${entity.email})`;
    }
    // If its an Organization, return name
    if (entity instanceof Organization) {
      return ` (${entity.name})`;
    }
    return '';
  }
}
