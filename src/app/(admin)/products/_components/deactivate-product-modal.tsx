"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { Product } from "@/types/product";
import { updateProductAction } from "../actions";
import { toast } from "sonner";

interface DeactivateProductModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product: Product | null;
}

export function DeactivateProductModal({ open, onOpenChange, product }: DeactivateProductModalProps) {
  const [isDeactivating, setIsDeactivating] = useState(false);

  if (!product) return null;

  const handleDeactivate = async () => {
    try {
      setIsDeactivating(true);
      const result = await updateProductAction(product.id, { status: "inactive" });

      if (!result.ok) {
        toast.error(result.error.message || "Failed to deactivate product. Please try again.", {
          position: "top-center",
        });
        return;
      }

      toast.success(
        <span>
          Product <b className="font-bold">{product.name}</b> has been deactivated successfully
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
          <DialogTitle>Deactivate Product</DialogTitle>
          <DialogDescription>
            Are you sure you want to deactivate <strong>{product.name}</strong> (SKU: {product.sku})? 
            This will soft-deactivate the product but preserve its stock history.
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
