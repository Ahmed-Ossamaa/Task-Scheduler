'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { RotateCcw } from 'lucide-react';
import { MessagesTable } from './messages-table';
import { Button } from '@/components/ui/button';
import { useAdminArchivedMsgs, useRestoreMsg } from '../hooks/use-contact';
import { restorationPeriod } from '@/lib/utils';

export function ArchivedMessagesList() {
  const [page, setPage] = useState(1);

  const { data: messages, isLoading } = useAdminArchivedMsgs(page, 20);
  const { mutateAsync: restoreMessage, isPending: isRestoring } =
    useRestoreMsg();

  const handleRestore = async (id: string) => {
    try {
      await restoreMessage(id);
      toast.success('Message restored to active inbox');
    } catch {
      toast.error('Failed to restore message');
    }
  };

  return (
    <div className="flex flex-col space-y-4 pt-2">
      <p className="text-center">
        Archieved messages will be permenantly deleted after {' '}
        <span className="font-semibold text-red-500">{restorationPeriod}.</span>
      </p>
      <MessagesTable
        messages={messages?.data}
        isLoading={isLoading}
        actions={(message) => (
          <>
            <Button
              variant="ghost"
              size="icon"
              disabled={isRestoring}
              onClick={() => handleRestore(message.id)}
              className="text-green-600 hover:bg-green-600/10 h-8 w-8"
              title="Restore Message"
            >
              <RotateCcw className="h-4 w-4" />
            </Button>
          </>
        )}
      />

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
    </div>
  );
}
