// src/components/dashboard/add-category-dialog.tsx
"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { Category } from "@/lib/types";
import * as LucideIcons from "lucide-react";

interface AddCategoryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (values: Omit<Category, "id">) => void;
  categoryToEdit?: Category | null;
}

export function AddCategoryDialog({
  open,
  onOpenChange,
  onSubmit,
  categoryToEdit,
}: AddCategoryDialogProps) {
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const values = Object.fromEntries(formData.entries()) as {
      name: string;
      icon: string;
      color: string;
    };
    
    if (values.name && values.icon && values.color) {
      onSubmit(values);
    }
  };

  const iconNames = Object.keys(LucideIcons).filter(key => key !== 'createLucideIcon' && key !== 'LucideIcon');

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle className="font-headline">
              {categoryToEdit ? "Edit Category" : "Create Category"}
            </DialogTitle>
            <DialogDescription>
              Manage your spending categories.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input
                id="name"
                name="name"
                defaultValue={categoryToEdit?.name}
                className="col-span-3"
                required
              />
            </div>
             <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="color" className="text-right">
                Color
              </Label>
              <Input
                id="color"
                name="color"
                type="color"
                defaultValue={categoryToEdit?.color || '#FF6384'}
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
               <Label htmlFor="icon" className="text-right">
                Icon
              </Label>
              <select
                id="icon"
                name="icon"
                defaultValue={categoryToEdit?.icon}
                className="col-span-3 block w-full rounded-md border-input border bg-background p-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                required
              >
                <option value="" disabled>Select an icon</option>
                {iconNames.map(iconName => (
                    <option key={iconName} value={iconName}>{iconName}</option>
                ))}
              </select>
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">{categoryToEdit ? "Save Changes" : "Create Category"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
