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
        className="bg-yellow-500 hover:bg-yellow-600"
        onClick={() => onEdit(category)}
      >
        Edit
      </Button>

      <Button
        type="button"
        className="bg-red-600 hover:bg-red-700"
        onClick={() => onDelete(category)}
      >
        Delete
      </Button>
    </div>
  );
}