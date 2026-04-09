export interface ErrorLog {
  id: string;
  statusCode: number;
  path: string;
  method: string;
  errorMessage: string;
  stackTrace: string | null;
  userId: string | null;
  createdAt: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  lastPage: number;
}


export enum ActionType {
  CREATED = 'CREATED',
  UPDATED = 'UPDATED',
  DELETED = 'DELETED',
}
export interface ActivityLog {
  id: string;
  actionType: ActionType;
  entityType: string;
  entityId: string;
  details: string;
  createdAt: string;
}

