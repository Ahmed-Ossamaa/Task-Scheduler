import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { MessageStatus } from '../types';

interface MessageFiltersProps {
  status: MessageStatus | 'ALL';
  onStatusChange: (status: MessageStatus | 'ALL') => void;
  sortBy: 'createdAt' | 'status';
  onSortByChange: (sortBy: 'createdAt' | 'status') => void;
  order: 'DESC' | 'ASC';
  onOrderChange: (order: 'DESC' | 'ASC') => void;
}

export function MessageFilters({
  status,
  onStatusChange,
  sortBy,
  onSortByChange,
  order,
  onOrderChange,
}: MessageFiltersProps) {
  return (
    <div className="flex flex-wrap items-end gap-4 bg-card/50 p-4 rounded-xl border border-border/50">
      
      {/* Status Filter */}
      <div className="space-y-1.5">
        <label className="text-xs font-semibold tracking-wide text-muted-foreground uppercase pl-1">
          Show
        </label>
        <Select value={status} onValueChange={onStatusChange}>
          <SelectTrigger className="w-40 h-9 bg-background">
            <SelectValue placeholder="All Statuses" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All Messages</SelectItem>
            <SelectItem value="Unread">Unread</SelectItem>
            <SelectItem value="Read">Read</SelectItem>
          </SelectContent>
        </Select>
      </div>
    
      {/* Sort By Field (Date/Status) */}
      <div className="space-y-1.5 ">
        <label className="text-xs font-semibold tracking-wide text-muted-foreground uppercase pl-1 ">
          Sort By
        </label>
        <Select value={sortBy} onValueChange={onSortByChange}>
          <SelectTrigger className="w-40 h-9 bg-background">
            <SelectValue placeholder="Sort Field" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="createdAt">Date</SelectItem>
            <SelectItem value="status">Status</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Order Field (Asc/Desc) */}
      <div className="space-y-1.5">
        <label className="text-xs font-semibold tracking-wide text-muted-foreground uppercase pl-1">
          Order
        </label>
        <Select value={order} onValueChange={onOrderChange}>
          <SelectTrigger className="w-40 h-9 bg-background">
            <SelectValue placeholder="Order direction" />
          </SelectTrigger>
          <SelectContent>
            {/*  options change based on what is being sortde */}
            {sortBy === 'createdAt' ? (
              <>
                <SelectItem value="DESC">Newest First</SelectItem>
                <SelectItem value="ASC">Oldest First</SelectItem>
              </>
            ) : (
              <>
                <SelectItem value="DESC">Unread First</SelectItem>
                <SelectItem value="ASC">Read First</SelectItem>
              </>
            )}
          </SelectContent>
        </Select>
      </div>

    </div>
  );
}