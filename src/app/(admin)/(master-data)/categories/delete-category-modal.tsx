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
import { deleteCategoryAction } from "./actions";
import { toast } from "sonner";

interface DeleteCategoryModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  category: Category | null;
}

export function DeleteCategoryModal(
  {
    open,
    onOpenChange,
    category,
  }: DeleteCategoryModalProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  if(!category) return null;

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      await deleteCategoryAction(category.id);

      const message = (
        <span>
          <b className="font-bold">{category.name}</b> category has been
          deleted
        </span>
      );

      toast.success(message, {
        position: "top-center",
      });

      onOpenChange(false);
    } catch (error) {
      toast.error("Failed to delete category. Please try again.", {
        position: "top-center",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Category</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete{" "}
            <strong>{category.name}</strong>?
          </DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isDeleting}
          >
            Cancel
          </Button>

          <Button
            type="button"
            variant="destructive"
            onClick={handleDelete}
            disabled={isDeleting}
          >
            {isDeleting ? (
              <>
                <Spinner /> Deleting...
              </>
            ) : (
              "Delete"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}