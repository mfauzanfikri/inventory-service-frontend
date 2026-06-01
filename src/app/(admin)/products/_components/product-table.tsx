"use client";

import { useState } from "react";
import { DataTable } from "@/components/ui/data-table";
import { Product } from "@/types/product";
import { Category } from "@/types/category";
import { AddProductModal } from "./add-product-modal";
import { EditProductModal } from "./edit-product-modal";
import { AdjustStockModal } from "./adjust-stock-modal";
import { DeactivateProductModal } from "./deactivate-product-modal";
import { getColumns } from "./columns";
import { updateProductAction } from "../actions";
import { toast } from "sonner";

interface ProductTableProps {
  products: Product[];
  categories: Category[];
}

export function ProductTable({ products, categories }: ProductTableProps) {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const [editOpen, setEditOpen] = useState(false);
  const [adjustOpen, setAdjustOpen] = useState(false);
  const [deactivateOpen, setDeactivateOpen] = useState(false);
  const [togglingId, setTogglingId] = useState<string | null>(null);

  const columns = getColumns({
    onEdit: (product) => {
      setSelectedProduct(product);
      setEditOpen(true);
    },
    onAdjustStock: (product) => {
      setSelectedProduct(product);
      setAdjustOpen(true);
    },
    onDeactivate: (product) => {
      setSelectedProduct(product);
      setDeactivateOpen(true);
    },
    onActivate: async (product) => {
      try {
        setTogglingId(product.id);
        const result = await updateProductAction(product.id, { status: "active" });
        if (!result.ok) {
          toast.error(result.error.message || "Failed to activate product. Please try again.", {
            position: "top-center",
          });
          return;
        }
        toast.success(
          <span>
            Product <b className="font-bold">{product.name}</b> has been activated successfully
          </span>,
          { position: "top-center" }
        );
      } finally {
        setTogglingId(null);
      }
    },
    togglingId,
  });

  return (
    <>
      <div className="mb-1 flex justify-end">
        <AddProductModal categories={categories} />
      </div>

      <DataTable columns={columns} data={products} searchPlaceholder="Search products by Name or SKU..." />

      <EditProductModal
        open={editOpen}
        onOpenChange={setEditOpen}
        product={selectedProduct}
        categories={categories}
      />

      <AdjustStockModal
        open={adjustOpen}
        onOpenChange={setAdjustOpen}
        product={selectedProduct}
      />

      <DeactivateProductModal
        open={deactivateOpen}
        onOpenChange={setDeactivateOpen}
        product={selectedProduct}
      />
    </>
  );
}
