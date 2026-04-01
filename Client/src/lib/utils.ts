import { TaskStatus } from '@/features/tasks/types';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatDateTime = (
  dateString?: string | null,
  full: boolean = true,
) => {
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
