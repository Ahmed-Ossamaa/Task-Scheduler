'use client';

import { useState } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { CreateTaskForm } from './create-task-form';

export function CreateTaskDialog() {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          New Task
        </Button>
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-125">
        <DialogHeader>
          <DialogTitle>Create New Task</DialogTitle>
          <DialogDescription>
            Assign a new task to an employee in your organization.
          </DialogDescription>
        </DialogHeader>
        
        <CreateTaskForm onSuccess={() => setOpen(false)} />
        
      </DialogContent>
    </Dialog>
  );
}