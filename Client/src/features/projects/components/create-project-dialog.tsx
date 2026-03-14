'use client';

import { useState } from 'react';
import { FolderPlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { CreateProjectForm } from './create-project-form';

export function CreateProjectDialog() {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2">
          <FolderPlus className="h-4 w-4" />
          New Project
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-106.25">
        <DialogHeader>
          <DialogTitle>Create New Project</DialogTitle>
          <DialogDescription>
            Group related tasks together into a single project.
          </DialogDescription>
        </DialogHeader>
        <CreateProjectForm onSuccess={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  );
}
