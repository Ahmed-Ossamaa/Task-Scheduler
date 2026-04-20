'use client';

import { useRef } from 'react';
import { useAuthStore } from '@/features/auth/store/auth.store';
import { useUploadAvatar } from '@/features/users/hooks/use-users';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { getInitials } from '@/lib/utils';
import { Upload, Loader2 } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

export function AvatarUpload() {
  const user = useAuthStore((state) => state.user);
  const { mutate: uploadAvatar, isPending } = useUploadAvatar();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      uploadAvatar(file);
      event.target.value = '';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Profile Picture</CardTitle>
        <CardDescription>
          Update your avatar.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex items-center gap-6">
        <Avatar className="h-24 w-24 border">
          <AvatarImage src={user?.avatar as string} alt={user?.name} />
          <AvatarFallback className="text-2xl bg-primary/10 text-primary">
            {getInitials(user?.name)}
          </AvatarFallback>
        </Avatar>

        <div className="flex flex-col gap-2">
          <input
            type="file"
            accept="image/*"
            className="hidden"
            ref={fileInputRef}
            onChange={handleFileChange}
            disabled={isPending}
          />
          <Button
            variant="outline"
            onClick={() => fileInputRef.current?.click()}
            disabled={isPending}
          >
            {isPending ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Upload className="mr-2 h-4 w-4" />
            )}
            {isPending ? 'Uploading...' : 'Upload New Image'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
