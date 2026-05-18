'use client';

import { useRef } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { getInitials } from '@/lib/utils';
import { Upload, Loader2, Image as ImageIcon } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import Image from 'next/image';
import { useUploadOrgImage } from '../hooks/use-organizations';
import { toast } from 'sonner';

interface OrgBrandingUploadProps {
  logo: string | null;
  cover: string | null;
  name: string;
}

export function OrgBrandingUpload({
  logo,
  cover,
  name,
}: OrgBrandingUploadProps) {
  const { mutateAsync: uploadImage, isPending } = useUploadOrgImage();

  const logoInputRef = useRef<HTMLInputElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async(
    event: React.ChangeEvent<HTMLInputElement>,
    type: 'logo' | 'cover',
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;
    try {
      await uploadImage({ file, type });

      toast.success(`${type === 'logo' ? 'Logo' : 'Cover'} uploaded successfully!`);
      
    } catch {
      toast.error(`Failed to upload ${type}. Please try again.`);
    } finally {
      event.target.value = '';
    }

  };

  return (
    <Card className="border-border/50 shadow-sm">
      <CardHeader>
        <CardTitle>Branding & Media</CardTitle>
        <CardDescription>
          Update your company logo and cover photo.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-8">
        {/* Cover Img */}
        <div className="space-y-3">
          <span className="text-sm font-medium text-foreground">
            Cover Photo
          </span>
          <div className="relative h-65 w-full rounded-xl overflow-hidden bg-muted border border-dashed border-border flex items-center justify-center">
            {cover ? (
              <Image src={cover} alt="Cover" fill className="object-cover" />
            ) : (
              <ImageIcon className="w-10 h-10 text-muted-foreground/50" />
            )}

            <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
              <Button
                variant="secondary"
                onClick={() => coverInputRef.current?.click()}
                disabled={isPending}
              >
                {isPending ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Upload className="mr-2 h-4 w-4" />
                )}
                Change Cover
              </Button>
            </div>

            <input
              type="file"
              accept="image/*"
              className="hidden"
              ref={coverInputRef}
              onChange={(e) => handleFileChange(e, 'cover')}
              disabled={isPending}
            />
          </div>
        </div>

        {/* Logo */}
        <div className="space-y-3">
          <span className="text-sm font-medium text-foreground">
            Organization Logo
          </span>
          <div className="flex items-center gap-6">
            <Avatar className="h-24 w-24 border rounded-xl">
              <AvatarImage
                src={logo as string}
                alt={name}
                className="object-cover"
              />
              <AvatarFallback className="text-2xl bg-primary/10 text-primary rounded-xl">
                {getInitials(name)}
              </AvatarFallback>
            </Avatar>

            <div className="flex flex-col gap-2 min-w-0">
              <input
                type="file"
                accept="image/*"
                className="hidden"
                ref={logoInputRef}
                onChange={(e) => handleFileChange(e, 'logo')}
                disabled={isPending}
              />
              <Button
                variant="outline"
                onClick={() => logoInputRef.current?.click()}
                disabled={isPending}
              >
                {isPending ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Upload className="mr-2 h-4 w-4" />
                )}
                Upload Logo
              </Button>
              <p className="text-xs text-muted-foreground">
                Recommended size: 250x250px
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
