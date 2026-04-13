import {
  EventSubscriber,
  EntitySubscriberInterface,
  InsertEvent,
  RemoveEvent,
  DataSource,
  SoftRemoveEvent,
  RecoverEvent,
} from 'typeorm';
import { Injectable, Logger } from '@nestjs/common';
import { ActivityLog } from '../entities/activity-log.entity';
import {
  ActionType,
  TrackedEntity,
  TrackedEvent,
} from '../types/activity-log-types';
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

  /**
   * Triggered after a new row is inserted into a tracked table (Users, Organizations).
   * Creates an activity log entry with action type 'CREATED' and details about the inserted row.
   * @param event The insert event.
   */
  async afterInsert(event: InsertEvent<TrackedEntity>) {
    if (!this.trackedTables.includes(event.metadata.tableName)) return;

    await this.logActivity(
      event,
      ActionType.CREATED,
      'created',
      event.entity?.id,
    );
  }

  /**
   * @deprecated this  will never be triggered for now
   * - (No hard delete for now & background job will take care of it using .delete())
   * @param event The remove event.
   */
  async afterRemove(event: RemoveEvent<TrackedEntity>) {
    if (!this.trackedTables.includes(event.metadata.tableName)) return;

    await this.logActivity(
      event,
      ActionType.DELETED,
      'permanently deleted by system cleanup',
      event.entity?.id ||
        (typeof event.entityId === 'string' ? event.entityId : undefined),
    );
  }

  /**
   * Triggered after a row is soft removed from a table (Users, Organizations).
   * Creates an activity log entry with action type 'ARCHIVED' and details about the soft removed row.
   * @param event - The soft remove event.
   */
  async afterSoftRemove(event: SoftRemoveEvent<TrackedEntity>) {
    if (!this.trackedTables.includes(event.metadata.tableName)) return;

    await this.logActivity(
      event,
      ActionType.ARCHIVED,
      'archived',
      event.entity?.id ||
        (typeof event.entityId === 'string' ? event.entityId : undefined),
    );
  }

  /**
   * Triggered after a soft removed row is recovered from a table ( Users, Organizations ).
   * Creates an activity log entry with action type 'RESTORED' and details about the recovered row.
   * @param event The recover event.
   */
  async afterRecover(event: RecoverEvent<TrackedEntity>) {
    if (!this.trackedTables.includes(event.metadata.tableName)) return;

    await this.logActivity(
      event,
      ActionType.RESTORED,
      'restored',
      event.entity?.id ||
        (typeof event.entityId === 'string' ? event.entityId : undefined),
    );
  }

  //..........Helper private methods............

  /**
   * Insterts an activity in the activity log table.
   * @param {TrackedEvent} event - The event that triggered the logging (insert, remove, etc).
   * @param {ActionType} actionType - The type of action that was performed.
   * @param {string} actionText - A descriptive text of the action that was performed.
   * @param {string} [targetId] - The ID of the entity that was affected by the action.
   */
  private async logActivity(
    event: TrackedEvent,
    actionType: ActionType,
    actionText: string,
    targetId?: string,
  ) {
    if (!targetId) return;

    const extraInfo = this.getEntityDetails(event.entity);
    const entityName =
      event.metadata.tableName === 'organizations' ? 'Organization' : 'User';

    const log = new ActivityLog();
    log.actionType = actionType;
    log.entityType = event.metadata.tableName;
    log.entityId = targetId;
    log.details = `${entityName} was ${actionText}${extraInfo}`;

    try {
      await event.manager.save(ActivityLog, log);
    } catch (error) {
      this.logger.error(
        `Failed to save activity log for ${entityName} ${targetId}`,
        error instanceof Error ? error.stack : error,
      );
    }
  }

  /**
   * Returns a string that contains details about the given entity.
   * - If the entity is a User, returns a string in the format "(name - email)".
   * - If the entity is an Organization, returns a string in the format "(name)".
   * - If the entity is null or undefined, returns an empty string.
   * @param entity The entity to get details from.
   */
  private getEntityDetails(entity: TrackedEntity | undefined | null): string {
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
