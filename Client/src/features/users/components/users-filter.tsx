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
import { SearchableCombobox } from '@/components/ui/searchable-combobox';
import { useMemo } from 'react';

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
  onOrgSearchChange: (value: string) => void;
  isOrgLoading?: boolean;
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
  onOrgSearchChange,
  isOrgLoading,
}: UsersFiltersProps) {
  const orgOptions = useMemo(() => [
    { value: 'ALL', label: 'All Organizations' },
    ...org.map((o) => ({ value: o.id, label: o.name })),
  ], [org]);
  return (
    <div className="flex flex-wrap gap-3 items-center">
      {/* Search */}
      <Input
        type="search"
        name="search"
        placeholder="Search name or email..."
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
        className="w-64 pl-6 shadow-sm"
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

      <SearchableCombobox
        items={orgOptions}
        value={selectedOrg}
        onChange={onOrgChange}
        onSearchChange={onOrgSearchChange}
        isLoading={isOrgLoading}
        placeholder="Organization"
        className="min-w-40 bg-secondary"
      />

      <Button
        variant="destructive"
        size="sm"
        type="reset"
        onClick={() => {
          onSearchChange('');
          onRoleChange('ALL');
          onStatusChange('ALL');
          onOrgChange('ALL');
          onOrgSearchChange('');
        }}
      >
        Reset
      </Button>
    </div>
  );
}
