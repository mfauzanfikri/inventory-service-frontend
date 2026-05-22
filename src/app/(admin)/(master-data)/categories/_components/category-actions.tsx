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
        variant="outline"
        onClick={() => onEdit(category)}
      >
        Edit
      </Button>

      <Button
        variant="destructive"
        onClick={() => onDelete(category)}
      >
        Delete
      </Button>
    </div>
  );
}