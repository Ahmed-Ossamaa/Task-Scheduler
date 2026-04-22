import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Loader2, Mail, MailOpen } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { formatDateTime } from '@/lib/utils';
import { ContactMessage } from '../types';

interface MessagesTableProps {
  messages: ContactMessage[] | undefined;
  isLoading: boolean;
  statusRender?: (message: ContactMessage) => React.ReactNode;
  actions?: (message: ContactMessage) => React.ReactNode;
}

export function MessagesTable({
  messages,
  isLoading,
  statusRender,
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
            <TableHead>Status</TableHead>
            <TableHead className="text-right pr-5">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell colSpan={5} className="h-24 text-center">
                <div className="flex justify-center items-center gap-2 text-muted-foreground">
                  <Loader2 className="h-4 w-4 animate-spin" /> Loading
                  messages...
                </div>
              </TableCell>
            </TableRow>
          ) : !messages || messages.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={5}
                className="h-24 text-center text-muted-foreground"
              >
                No messages found.
              </TableCell>
            </TableRow>
          ) : (
            messages.map((message) => (
              <TableRow key={message.id}>
                <TableCell className="pl-5">
                  <div className="flex flex-col">
                    <span className="font-medium text-foreground">
                      {message.name}
                    </span>
                    <span className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                      {message.status === 'Unread' ? (
                        <>
                          <Mail className="h-3 w-3" />
                          {message.email}
                        </>
                      ) : (
                        <>
                          <MailOpen className="h-3 w-3" />
                          {message.email}
                        </>
                      )}
                    </span>
                  </div>
                </TableCell>

                <TableCell>
                  <div className="max-w-62.5 truncate text-sm">
                    {message.subject}
                  </div>
                </TableCell>

                <TableCell className="text-sm text-muted-foreground">
                  {formatDateTime(message.createdAt, false)}
                </TableCell>

                <TableCell>
                  {statusRender?.(message) || (
                    <Badge
                      variant={
                        message.status === 'Unread' ? 'default' : 'secondary'
                      }
                    >
                      {message.status}
                    </Badge>
                  )}
                </TableCell>

                <TableCell className="text-right pr-5">
                  <div className="flex justify-end gap-2">
                    {actions && actions(message)}
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
