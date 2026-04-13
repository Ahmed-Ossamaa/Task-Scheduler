import { Organization } from 'src/features/organizations/entities/organization.entity';
import { User } from 'src/features/users/entities/user.entity';
import {
  InsertEvent,
  RecoverEvent,
  RemoveEvent,
  SoftRemoveEvent,
} from 'typeorm';

export enum ActionType {
  CREATED = 'CREATED',
  UPDATED = 'UPDATED',
  DELETED = 'DELETED',
  ARCHIVED = 'ARCHIVED',
  RESTORED = 'RESTORED',
}

export type TrackedEntity = User | Organization;

export type TrackedEvent =
  | InsertEvent<TrackedEntity>
  | RemoveEvent<TrackedEntity>
  | SoftRemoveEvent<TrackedEntity>
  | RecoverEvent<TrackedEntity>;
