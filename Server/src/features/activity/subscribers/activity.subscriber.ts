import {
  EventSubscriber,
  EntitySubscriberInterface,
  InsertEvent,
  RemoveEvent,
  DataSource,
} from 'typeorm';
import { Injectable } from '@nestjs/common';
import { ActivityLog } from '../entities/activity-log.entity';
import { ActionType } from '../types/activity-log-types';
import type { User } from 'src/features/users/entities/user.entity';
import type { Organization } from 'src/features/organizations/entities/organization.entity';

@Injectable()
@EventSubscriber()
export class ActivitySubscriber implements EntitySubscriberInterface {
  constructor(dataSource: DataSource) {
    dataSource.subscribers.push(this);
  }

  //Track Org and Users Tables
  private readonly trackedTables = ['organizations', 'users'];

  async afterInsert(event: InsertEvent<User | Organization>) {
    if (!this.trackedTables.includes(event.metadata.tableName)) return;

    const log = new ActivityLog();
    log.actionType = ActionType.CREATED;
    log.entityType = event.metadata.tableName;
    log.entityId = event.entity.id;
    log.details = `New ${event.metadata.tableName} was created.`;

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

    //entity?.id: if there is a fully loaded entity (for remove methods)
    if (event.entity?.id) {
      deletedId = event.entity.id;
      //entityId: if there is just an Id (for delete methods)
    } else if (typeof event.entityId === 'string') {
      deletedId = event.entityId;
    }

    // if there is no Id at all (undefined)
    if (!deletedId) {
      console.warn(
        `Could not log deletion for ${event.metadata.tableName}: ID missing`,
      );
      return;
    }
    const log = new ActivityLog();
    log.actionType = ActionType.DELETED;
    log.entityType = event.metadata.tableName;
    log.entityId = deletedId;
    log.details = `A/an ${event.metadata.tableName} was deleted.`;

    await event.manager.save(ActivityLog, log);
  }
}
