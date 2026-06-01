"use client";

import { Button } from "@/components/ui/button";
import { Category } from "@/types/category";
import { Spinner } from "@/components/ui/spinner";
import { Edit, Ban, Check } from "lucide-react";

interface CategoryActionsProps {
  category: Category;
  onEdit: (category: Category) => void;
  onDeactivate: (category: Category) => void;
  onActivate: (category: Category) => void;
  togglingId: string | null;
}

export function CategoryActions({
  category,
  onEdit,
  onDeactivate,
  onActivate,
  togglingId,
}: CategoryActionsProps) {
  const isToggling = togglingId === category.id;

  return (
    <div className="flex justify-center gap-2">
      <Button
        variant="outline"
        size="icon"
        className="h-8 w-8 text-amber-600 hover:text-amber-700"
        onClick={() => onEdit(category)}
        title="Edit Category"
        disabled={isToggling}
      >
        <Edit className="h-4 w-4" />
      </Button>

      {isToggling ? (
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8"
          disabled
        >
          <Spinner className="h-4 w-4" />
        </Button>
      ) : category.status === "active" ? (
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8 text-red-600 hover:text-red-700"
          onClick={() => onDeactivate(category)}
          title="Deactivate Category"
        >
          <Ban className="h-4 w-4" />
        </Button>
      ) : (
        <Button
          variant="outline"
          size="icon"
          className="h-8 w-8 text-green-600 hover:text-green-700"
          onClick={() => onActivate(category)}
          title="Activate Category"
        >
          <Check className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
}