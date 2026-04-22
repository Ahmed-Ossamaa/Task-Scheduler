import React from 'react';
import { ContactMessage } from '../types';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Loader2 } from 'lucide-react';
import { formatDateTime } from '@/lib/utils';

interface MessagesTableProps {
  messages: ContactMessage[] | undefined;
  isLoading: boolean;
  onRowClick?: (message: ContactMessage) => void;
  actions?: (message: ContactMessage) => React.ReactNode;
}

export function MessagesTable({
  messages,
  isLoading,
  onRowClick,
  actions,
}: MessagesTableProps) {
  return (
    <div className="rounded-md border bg-card">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="pl-5">Sender</TableHead>
            <TableHead>Subject</TableHead>
            <TableHead>Date</TableHead>
            <TableHead className="text-right pr-8">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell colSpan={4} className="h-24 text-center">
                <div className="flex justify-center items-center gap-2 text-muted-foreground">
                  <Loader2 className="h-4 w-4 animate-spin" /> Loading messages...
                </div>
              </TableCell>
            </TableRow>
          ) : !messages || messages.length === 0 ? (
            <TableRow>
              <TableCell colSpan={4} className="h-24 text-center text-muted-foreground">
                No messages found.
              </TableCell>
            </TableRow>
          ) : (
            messages.map((message) => {
              // Highlighting unread msgs
              const isUnread = message.status === 'Unread';
              const textClass = isUnread ? 'font-semibold text-foreground' : 'text-muted-foreground';

              return (
                <TableRow 
                  key={message.id}
                  onClick={() => onRowClick?.(message)}
                  className="cursor-pointer hover:bg-muted/50 transition-colors group"
                >
                  <TableCell className={`pl-5 ${textClass}`}>
                    <div className="flex flex-col">
                      <span>{message.name}</span>
                      <span className="text-xs opacity-70 mt-0.5">
                        {message.email}
                      </span>
                    </div>
                  </TableCell>
                  
                  <TableCell className={textClass}>
                    <div className="max-w-75 truncate">
                      {message.subject}
                    </div>
                  </TableCell>

                  <TableCell className={`text-sm ${textClass}`}>
                    {formatDateTime(message.createdAt, true)}
                  </TableCell>

                  <TableCell 
                    className="text-right pr-5"
                    onClick={(e) => e.stopPropagation()} // Prevent row click
                  >
                    <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      {actions && actions(message)}
                    </div>
                  </TableCell>
                </TableRow>
              );
            })
          )}
        </TableBody>
      </Table>
    </div>
  );
}