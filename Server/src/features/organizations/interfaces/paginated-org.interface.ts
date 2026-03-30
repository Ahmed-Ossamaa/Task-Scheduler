import { Organization } from '../entities/organization.entity';

export interface PaginatedOrg {
  data: Organization[];
  total: number;
  page: number;
  lastPage: number;
}
