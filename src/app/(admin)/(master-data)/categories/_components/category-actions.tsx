"use client";

import { Button } from "@/components/ui/button";
import { Category } from "@/types/category";

interface CategoryActionsProps {
  category: Category;
  onEdit: (category: Category) => void;
  onDelete: (category: Category) => void;
}

export function CategoryActions({
                                  category,
                                  onEdit,
                                  onDelete,
                                }: CategoryActionsProps) {
  return (
    <div className="flex justify-center gap-1">
      <Button
        type="button"
        className="bg-blue-500 hover:bg-blue-700"
        onClick={() => onEdit(category)}
      >
        Edit
      </Button>

      <Button
        type="button"
        variant="destructive"
        onClick={() => onDelete(category)}
      >
        Delete
      </Button>
    </div>
  );
}