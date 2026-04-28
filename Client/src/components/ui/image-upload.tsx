import { useMemo, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ImagePlus, X } from 'lucide-react';
import Image from 'next/image';

interface ImageUploadProps {
  value?: string | File;
  onChange: (value: File | string | undefined) => void;
  disabled?: boolean;
}

export function ImageUpload({ value, onChange, disabled }: ImageUploadProps) {
  const previewUrl = useMemo(() => {
    if (typeof value === 'string' && value !== '') return value;
    if (value instanceof File) return URL.createObjectURL(value);
    return null;
  }, [value]);

  useEffect(() => {
    return () => {
      if (value instanceof File && previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [value, previewUrl]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onChange(file);
    }
  };

  if (previewUrl) {
    return (
      <div className="relative w-full h-40 rounded-lg overflow-hidden border bg-muted">
        <Image src={previewUrl} alt="Preview" fill priority className="object-contain" />
        <Button
          type="button"
          onClick={() => onChange('')}
          variant="destructive"
          size="icon"
          className="absolute top-2 right-2 h-8 w-8"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center w-full">
      <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed rounded-lg cursor-pointer bg-muted/20 hover:bg-muted/50 transition-colors">
        <div className="flex flex-col items-center justify-center pt-5 pb-6">
          <ImagePlus className="w-8 h-8 mb-2 text-muted-foreground" />
          <p className="text-sm font-medium">Click to select image</p>
          <p className="text-xs text-muted-foreground mt-1">
            Image will be saved when you submit
          </p>
        </div>
        <input
          type="file"
          className="hidden"
          accept="image/*"
          onChange={handleFileChange}
          disabled={disabled}
        />
      </label>
    </div>
  );
}
