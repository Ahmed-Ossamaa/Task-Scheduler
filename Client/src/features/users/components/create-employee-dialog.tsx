'use client';

import { useState } from 'react';
import { UserPlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { CreateEmployeeForm } from './create-employee-form';

export function CreateEmployeeDialog() {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2">
          <UserPlus className="h-4 w-4" />
          Add Employee
        </Button>
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-106.25">
        <DialogHeader>
          <DialogTitle>Add New Employee</DialogTitle>
          <DialogDescription>
            Create an account for a new team member. They will be added to your organization.
          </DialogDescription>
        </DialogHeader>
        
        <CreateEmployeeForm onSuccess={() => setOpen(false)} />
        
      </DialogContent>
    </Dialog>
  );
}