"use client";

import { Button } from "@/components/ui/button";
import { Category } from "@/types/category";
import { Spinner } from "@/components/ui/spinner";

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
    <div className="flex justify-center gap-1">
      <Button
        variant="outline"
        onClick={() => onEdit(category)}
        disabled={isToggling}
      >
        Edit
      </Button>

      {isToggling ? (
        <Button
          variant="outline"
          disabled
          className="min-w-[85px]"
        >
          <Spinner className="h-4 w-4" />
        </Button>
      ) : category.status === "active" ? (
        <Button
          variant="destructive"
          onClick={() => onDeactivate(category)}
          className="min-w-[85px]"
        >
          Deactivate
        </Button>
      ) : (
        <Button
          variant="outline"
          onClick={() => onActivate(category)}
          className="bg-green-600 hover:bg-green-700 text-white hover:text-white border-transparent hover:border-transparent min-w-[85px]"
        >
          Activate
        </Button>
      )}
    </div>
  );
}