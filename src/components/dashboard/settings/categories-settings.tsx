// src/components/dashboard/settings/categories-settings.tsx
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, PlusCircle } from "lucide-react";
import type { Category } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { addDocument, updateDocument, deleteDocument } from "@/services/firestore";
import { AddCategoryDialog } from "../add-category-dialog";
import * as LucideIcons from 'lucide-react';
import { Card, CardDescription, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";

interface CategoriesSettingsProps {
  initialCategories: Category[];
}

export function CategoriesSettings({
  initialCategories,
}: CategoriesSettingsProps) {
  const { user } = useAuth();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [categoryToEdit, setCategoryToEdit] =
    useState<Category | null>(null);
  const { toast } = useToast();
  
  const categoriesPath = `users/${user?.uid}/categories`;

  const handleAddCategory = () => {
    setCategoryToEdit(null);
    setIsDialogOpen(true);
  };

  const handleEditCategory = (category: Category) => {
    setCategoryToEdit(category);
    setIsDialogOpen(true);
  };

  const handleDeleteCategory = async (id: string) => {
    try {
      await deleteDocument(categoriesPath, id);
      toast({ title: "Category deleted successfully." });
    } catch (error) {
      toast({ variant: "destructive", title: "Error deleting category." });
    }
  };

  const handleSubmit = async (values: Omit<Category, "id">) => {
    try {
      if (categoryToEdit) {
        await updateDocument(categoriesPath, categoryToEdit.id, values);
        toast({ title: "Category updated successfully." });
      } else {
        await addDocument(categoriesPath, values);
        toast({ title: "Category added successfully." });
      }
      setIsDialogOpen(false);
    } catch (error) {
       toast({ variant: "destructive", title: "Error saving category." });
    }
  };
  
  const Icon = ({ name }: { name: string }) => {
    const LucideIcon = (LucideIcons as any)[name];
    if (!LucideIcon) return null;
    return <LucideIcon className="h-5 w-5" />;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline">Categories</CardTitle>
        <CardDescription>
          Manage your expense and income categories.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Icon</TableHead>
                <TableHead>Color</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {initialCategories.map((category) => (
                  <TableRow key={category.id}>
                    <TableCell className="font-medium">
                      {category.name}
                    </TableCell>
                    <TableCell>
                      <Icon name={category.icon} />
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                          <div className="h-4 w-4 rounded-full" style={{ backgroundColor: category.color }}/>
                          {category.color}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => handleEditCategory(category)}
                          >
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleDeleteCategory(category.id)}
                            className="text-destructive"
                          >
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
         <AddCategoryDialog
          open={isDialogOpen}
          onOpenChange={setIsDialogOpen}
          onSubmit={handleSubmit}
          categoryToEdit={categoryToEdit}
        />
      </CardContent>
      <CardFooter className="border-t px-6 py-4">
        <Button onClick={handleAddCategory}>
          <PlusCircle className="mr-2 h-4 w-4" /> Add Category
        </Button>
      </CardFooter>
    </Card>
  );
}
