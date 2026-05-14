import * as React from 'react';
import { ChevronDownIcon, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

interface DataItem {
  value: string;
  label: string;
}

interface SearchableComboboxProps {
  items: DataItem[];
  value: string;
  onChange: (value: string) => void;
  onSearchChange?: (search: string) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  emptyText?: string;
  isLoading?: boolean;
  className?: string;
}

export function SearchableCombobox({
  items,
  value,
  onChange,
  onSearchChange,
  placeholder = 'Select item...',
  searchPlaceholder = 'Search...',
  emptyText = 'No results found.',
  isLoading = false,
  className,
}: SearchableComboboxProps) {
  const [open, setOpen] = React.useState(false);

  // Find the label for the currently selected value
  const selectedLabel = items.find((item) => item.value === value)?.label;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn(' justify-between font-normal', className)}
        >
          <span className="truncate">
            {value === 'ALL'
              ? 'All Organizations'
              : selectedLabel || placeholder}
          </span>
          <ChevronDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-0 w-50">
        <Command shouldFilter={false}>
          <CommandInput
            placeholder={searchPlaceholder}
            onValueChange={onSearchChange}
          />
          <CommandList>
            {isLoading && (
              <div className="flex items-center justify-center py-6 text-sm text-muted-foreground">
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Searching...
              </div>
            )}
            {!isLoading && <CommandEmpty>{emptyText}</CommandEmpty>}
            <CommandGroup>
              {items.map((item) => (
                <CommandItem
                  key={item.value}
                  value={item.value}
                  data-checked={value === item.value}
                  onSelect={(currentValue) => {
                    onChange(currentValue);
                    setOpen(false);
                  }}
                >
                  {item.label}
    
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
