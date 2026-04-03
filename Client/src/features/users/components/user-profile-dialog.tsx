import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { User } from '@/features/auth/types/user-interface';
import {
  MapPin,
  Phone,
  Mail,
  Building2,
  Venus,
  Mars,
  CalendarCheck2,
} from 'lucide-react';
import Image from 'next/image';
import { formatDateTime } from '@/lib/utils';

interface UserProfileDialogProps {
  user: User | null;
  isOpen: boolean;
  onClose: () => void;
}

export function UserProfileDialog({
  user,
  isOpen,
  onClose,
}: UserProfileDialogProps) {
  if (!user) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-100 pt-14">
        {/* Avatar */}
        <div className="absolute -top-12 left-1/2 -translate-x-1/2">
          <Avatar className="h-24 w-24 border-2 border-secondary/10 shadow-sm overflow-hidden">
            {user.avatar ? (
              <Image
                src={user?.avatar}
                alt={`${user?.name} avatar`}
                width={100}
                height={100}
                loading="lazy"
                className=" object-cover"
              />
            ) : (
              <AvatarFallback className="text-xl bg-primary/10 text-primary">
                {user.name.charAt(0)}
              </AvatarFallback>
            )}
          </Avatar>
        </div>

        {/* Header Info */}
        <DialogHeader className="text-center">
          <DialogTitle className="text-center text-xl font-bold text-primary">
            {user.name}
          </DialogTitle>
          <DialogDescription className="flex items-center justify-center gap-2 text-sm text-muted-foreground mt-1">
            <Mail className="h-3 w-3" />
            {user.email}
          </DialogDescription>
        </DialogHeader>

        {/*  Details */}
        <div className="mt-2 border-t pt-6 grid gap-4">
          <div className="flex items-center gap-3 text-sm">
            <Phone className="h-4 w-4 text-primary" />
            <span>{user.phone || 'No phone provided'}</span>
          </div>

          {user.gender && (
            <div className="flex items-center gap-3 text-sm">
              {user.gender === 'male' ? (
                <Mars className="h-4 w-4 text-blue-500" />
              ) : (
                <Venus className="h-4 w-4 text-purple-500" />
              )}
              <span>{user.gender}</span>
            </div>
          )}

          <div className="flex items-center gap-3 text-sm">
            <MapPin className="h-4 w-4 text-primary" />
            <span>{user.address || 'No address provided'}</span>
          </div>

          <div className="flex items-center gap-3 text-sm">
            <Building2 className="h-4 w-4 text-primary" />
            <span>{user.organization?.name || 'Unassigned'}</span>
          </div>

          <div className="flex items-center gap-3 text-sm">
            <CalendarCheck2 className="h-4 w-4 text-primary" />
            <span>{formatDateTime(user.createdAt)}</span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
