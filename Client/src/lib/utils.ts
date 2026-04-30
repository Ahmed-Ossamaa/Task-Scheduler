import { TaskStatus } from '@/features/tasks/types';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * - Format a date string into a human-readable format.
 * - If full is true, the date string will be formatted as:
 * "Month Day, Year, Hour:Minute AM/PM"
 * Otherwise, the date string will be formatted as:
 * "Month Day, Year"
 *
 * - If dateString is null or undefined, the function will return "-"
 *
 * @param {string | null} dateString The date string to format
 * @param {boolean} [full=true] Whether to include the time in the formatted string
 * @returns The formatted date string
 */
export const formatDateTime = (
  dateString?: string | null,
  full: boolean = true,
): string => {
  if (!dateString) return '-';
  if (full) {
    return new Date(dateString).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  } else {
    return new Date(dateString).toLocaleString('en-US', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  }
};


/**
 * Returns string representing the time elapsed
 * since the given date.
 * @param {string|Date} dateString - The date to calculate the time
 * elapsed from.
 */
export function timeAgo(dateString: string | Date): string {
  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.round((now.getTime() - date.getTime()) / 1000);
  const minutes = Math.round(seconds / 60);
  const hours = Math.round(minutes / 60);
  const days = Math.round(hours / 24);

  if (seconds < 60) return 'just now';
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days === 1) return 'Yesterday';
  if (days < 30) return `${days}d ago`;
  
  // Fallback for old date (months/ years)
  return date.toLocaleDateString(); 
}

export const getInitials = (name?: string) => {
  if (!name) return 'U';
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .substring(0, 2)
    .toUpperCase();
};

export const getTaskStatusInfo = (deadline: string | Date, status: string) => {
  //Completed Tasks
  if (status === TaskStatus.DONE)
    return {
      label: 'Done ✓',
      color: 'border-l-green-600',
      textColor: 'text-green-500 font-bold',
    };

  //Canceled Tasks
  if (status === TaskStatus.CANCELED)
    return {
      label: 'Canceled x',
      color: 'border-l-border',
      textColor: 'text-muted-foreground line-through',
    };

  //Pending Tasks

  const today = new Date();
  today.setHours(0, 0, 0, 0); // midnight

  const due = new Date(deadline);
  due.setHours(0, 0, 0, 0); // midnight

  const diffTime = due.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  //Overdue
  if (diffDays < 0) {
    return {
      label: 'Overdue',
      color: 'border-l-destructive',
      textColor: 'text-destructive font-bold',
    };
  }

  //Due Today
  if (diffDays === 0) {
    return {
      label: 'Due Today',
      color: 'border-l-primary',
      textColor: 'text-primary font-bold',
    };
  }

  //pending (upcoming tasks)
  const formattedDate = due.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });
  return {
    label: formattedDate,
    color: 'border-l-border',
    textColor: 'text-muted-foreground font-bold',
  };
};


export const restorationPeriod = ' 30 days'; 