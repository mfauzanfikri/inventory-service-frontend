"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { Category } from "@/types/category";
import { updateCategoryAction } from "../actions";
import { toast } from "sonner";

interface DeactivateCategoryModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  category: Category | null;
}

export function DeactivateCategoryModal({
  open,
  onOpenChange,
  category,
}: DeactivateCategoryModalProps) {
  const [isDeactivating, setIsDeactivating] = useState(false);

  if(!category) return null;

  const handleDeactivate = async () => {
    try {
      setIsDeactivating(true);
      const result = await updateCategoryAction(category.id, { status: "inactive" });

      if(!result.ok) {
        toast.error(result.error.message || "Failed to deactivate category. Please try again.", {
          position: "top-center",
        });
        return;
      }

      toast.success(
        <span>
          Category <b className="font-bold">{category.name}</b> has been deactivated successfully
        </span>,
        { position: "top-center" }
      );

      onOpenChange(false);
    } finally {
      setIsDeactivating(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Deactivate Category</DialogTitle>
          <DialogDescription>
            Are you sure you want to deactivate <strong>{category.name}</strong>? 
            Existing products within this category will remain preserved.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isDeactivating}
          >
            Cancel
          </Button>

          <Button
            type="button"
            variant="destructive"
            onClick={handleDeactivate}
            disabled={isDeactivating}
          >
            {isDeactivating ? (
              <>
                <Spinner /> Deactivate
              </>
            ) : (
              "Deactivate"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
