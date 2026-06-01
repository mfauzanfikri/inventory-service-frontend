"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { Product } from "@/types/product";
import { deleteProductAction } from "../actions";
import { toast } from "sonner";

interface DeleteProductModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product: Product | null;
}

export function DeleteProductModal({ open, onOpenChange, product }: DeleteProductModalProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  if (!product) return null;

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      const result = await deleteProductAction(product.id);

      if (!result.ok) {
        toast.error(result.error.message || "Failed to delete product. Please try again.", {
          position: "top-center",
        });
        return;
      }

      toast.success(
        <span>
          Product <b className="font-bold">{product.name}</b> has been deleted successfully
        </span>,
        { position: "top-center" }
      );

      onOpenChange(false);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Product</DialogTitle>
          <DialogDescription>
            Are you sure you want to permanently delete <strong>{product.name}</strong> (SKU: {product.sku})? 
            This action cannot be undone.
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
                <Spinner /> Delete
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
