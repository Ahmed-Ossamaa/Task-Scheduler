import { Mail, Calendar, User } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { ContactMessage } from '../types';
import { formatDateTime } from '@/lib/utils';
import Link from 'next/link';

interface MessageDetailsDialogProps {
  message: ContactMessage | null;
  isOpen: boolean;
  onClose: () => void;
}

export function MessageDetailsDialog({ message, isOpen, onClose }: MessageDetailsDialogProps) {
  if (!message) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <div className="flex items-start justify-between pr-6">
            <DialogTitle className="text-xl font-bold">{message.subject}</DialogTitle>
            <Badge variant={message.status === 'Unread' ? 'default' : 'secondary'}>
              {message.status}
            </Badge>
          </div>
          <DialogDescription className="sr-only">
            Message details from {message.name}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          {/*details Section (Username, email, createdAt)*/}
          <div className="flex flex-col gap-3 p-4 bg-muted/50 rounded-lg text-sm border border-border/50">
            <div className="flex items-center gap-2 text-foreground">
              <User className="w-4 h-4 text-muted-foreground" />
              <span className="font-semibold">{message.name}</span>
            </div>
            <div className="flex items-center gap-2 text-foreground">
              <Mail className="w-4 h-4 text-muted-foreground" />
              <Link href={`mailto:${message.email}`} className="text-primary hover:underline">
                {message.email}
              </Link>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Calendar className="w-4 h-4" />
              {formatDateTime(message.createdAt, true)}
            </div>
          </div>

          {/* Msg Body */}
          <div className="p-4 bg-background border border-border/50 rounded-lg min-h-37.5 whitespace-pre-wrap text-sm leading-relaxed text-foreground">
            {message.message}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}