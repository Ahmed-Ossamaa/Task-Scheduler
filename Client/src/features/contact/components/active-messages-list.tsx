'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { Mail, MailOpen, Trash2 } from 'lucide-react';
import { ContactMessage, MessageStatus } from '../types';
import {
  useAdminMsgs,
  useArchiveMsg,
  useUpdateMsgStatus,
} from '../hooks/use-contact';
import { MessagesTable } from './messages-table';
import { Button } from '@/components/ui/button';
import { AxiosError } from 'axios';
import { MessageDetailsDialog } from './message-details-dialog';
import { MessageFilters } from './message-filter';

export function ActiveMessagesList() {
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState<MessageStatus | 'ALL'>('ALL');
  const [sortBy, setSortBy] = useState<'createdAt' | 'status'>('createdAt');
  const [order, setOrder] = useState<'DESC' | 'ASC'>('DESC');
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);

  const { data: messages, isLoading } = useAdminMsgs({
    page,
    limit: 20,
    status: status === 'ALL' ? undefined : status,
    sortBy,
    order,
  });

  const { mutateAsync: updateStatus, isPending: isUpdating } = useUpdateMsgStatus();
  const { mutateAsync: archiveMessage, isPending: isArchiving } = useArchiveMsg();

  //toggle read status (read <--> unread)
  const toggleReadStatus = async (message: ContactMessage) => {
    const newStatus = message.status === 'Unread' ? 'Read' : 'Unread';
    try {
      await updateStatus({
        id: message.id,
        status: newStatus as MessageStatus,
      });
      toast.success(`Marked as ${newStatus}`);
    } catch {
      toast.error('Failed to update status');
    }
  };

//Archive (soft delete)
  const handleArchive = async (id: string) => {
    try {
      await archiveMessage(id);
      toast.success('Message archived');
    } catch (err) {
      const axiosError = err as AxiosError<{ message: string }>;
      const errorMessage = axiosError.response?.data.message;
      toast.error(errorMessage || 'Failed to archive message');
    }
  };

  //open msg details dialog  and mark msg as read
  const handleRowClick = (message: ContactMessage) => {
    setSelectedMessage(message);
    if (message.status === 'Unread') {
      updateStatus({ id: message.id, status: 'Read' });
    }
  };

  return (
    <div className="flex flex-col space-y-4">
      {/* Filters */}
      <MessageFilters
        status={status}
        onStatusChange={(v) => {
          setStatus(v);
          setPage(1); //reset page to 1
        }}
        sortBy={sortBy}
        onSortByChange={(v) => {
          setSortBy(v);
          setPage(1);
        }}
        order={order}
        onOrderChange={(val) => {
          setOrder(val);
          setPage(1);
        }}
      />

      <MessagesTable
        messages={messages?.data}
        isLoading={isLoading}
        onRowClick={handleRowClick}
        actions={(message) => (
          <>
            {/* Mark as Read/Unread */}
            <Button
              variant="ghost"
              size="icon"
              disabled={isUpdating}
              onClick={() => toggleReadStatus(message)}
              className="text-muted-foreground hover:text-foreground h-8 w-8"
              title={
                message.status === 'Unread' ? 'Mark as Read' : 'Mark as Unread'
              }
            >
              {message.status === 'Unread' ? (
                <MailOpen className="h-4 w-4" />
              ) : (
                <Mail className="h-4 w-4" />
              )}
            </Button>

            {/* Archive Button */}
            <Button
              variant="ghost"
              size="icon"
              disabled={isArchiving}
              onClick={() => handleArchive(message.id)}
              className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50"
              title="Archive Message"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </>
        )}
      />

      {/* Pagination */}
      <div className="flex items-center justify-end space-x-2 py-4">
        <Button
          variant="default"
          size="sm"
          onClick={() => setPage((old) => Math.max(old - 1, 1))}
          disabled={page === 1 || isLoading}
        >
          Previous
        </Button>
        <div className="text-sm text-muted-foreground font-medium px-2">
          Page {page} of {messages?.lastPage || 1}
        </div>
        <Button
          variant="default"
          size="sm"
          onClick={() => setPage((old) => old + 1)}
          disabled={!messages || page >= messages.lastPage || isLoading}
        >
          Next
        </Button>
      </div>
      <MessageDetailsDialog
        message={selectedMessage}
        isOpen={!!selectedMessage}
        onClose={() => setSelectedMessage(null)}
      />
    </div>
  );
}
