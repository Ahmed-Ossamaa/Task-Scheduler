import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { RoleFilterUI, StatusFilterUI } from '../types';
import { Button } from '@/components/ui/button';

interface Organization {
  id: string;
  name: string;
}

interface UsersFiltersProps {
  search: string;
  onSearchChange: (value: string) => void;

  role: RoleFilterUI;
  onRoleChange: (value: RoleFilterUI) => void;

  status: StatusFilterUI;
  onStatusChange: (value: StatusFilterUI) => void;

  org: Organization[];
  selectedOrg: string | 'ALL';
  onOrgChange: (value: string | 'ALL') => void;
}

export function UsersFilters({
  search,
  onSearchChange,
  role,
  onRoleChange,
  status,
  onStatusChange,
  org,
  selectedOrg,
  onOrgChange,
}: UsersFiltersProps) {
  return (
    <div className="flex flex-wrap gap-3 items-center">
      {/* Search */}
      <Input
        type="search"
        name="search"
        placeholder="Search name or email..."
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
        className="w-64"
      />

      {/* Role */}
      <Select value={role} onValueChange={onRoleChange}>
        <SelectTrigger size="default" className="bg-secondary">
          <SelectValue placeholder="Role" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="ALL">All Roles</SelectItem>
          <SelectItem value={'admin'}>Admin</SelectItem>
          <SelectItem value="manager">Manager</SelectItem>
          <SelectItem value="employee">Employee</SelectItem>
        </SelectContent>
      </Select>

      {/* Status */}
      <Select value={status} onValueChange={onStatusChange}>
        <SelectTrigger size="default" className="bg-secondary">
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="ALL">Status</SelectItem>
          <SelectItem value="active">Active</SelectItem>
          <SelectItem value="banned">Banned</SelectItem>
        </SelectContent>
      </Select>

      {/* Organization */}
      <Select value={selectedOrg} onValueChange={onOrgChange}>
        <SelectTrigger size="default" className="bg-secondary ">
          <SelectValue placeholder="Organization" />
        </SelectTrigger>
        <SelectContent position="popper" className="max-h-64! ">
          <SelectItem value="ALL">All Organizations</SelectItem>
          {org.map((organization) => (
            <SelectItem key={organization.id} value={organization.id}>
              {organization.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Button
        variant="destructive"
        size="sm"
        type="reset"
        onClick={() => {
          onSearchChange('');
          onRoleChange('ALL');
          onStatusChange('ALL');
          onOrgChange('ALL');
        }}
      >
        Reset
      </Button>
    </div>
  );
}
