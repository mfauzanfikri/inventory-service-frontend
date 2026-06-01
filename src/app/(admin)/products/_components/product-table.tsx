"use client";

import { useState } from "react";
import { DataTable } from "@/components/ui/data-table";
import { Product } from "@/types/product";
import { Category } from "@/types/category";
import { AddProductModal } from "./add-product-modal";
import { EditProductModal } from "./edit-product-modal";
import { AdjustStockModal } from "./adjust-stock-modal";
import { DeleteProductModal } from "./delete-product-modal";
import { getColumns } from "./columns";

interface ProductTableProps {
  products: Product[];
  categories: Category[];
}

export function ProductTable({ products, categories }: ProductTableProps) {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const [editOpen, setEditOpen] = useState(false);
  const [adjustOpen, setAdjustOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const columns = getColumns({
    onEdit: (product) => {
      setSelectedProduct(product);
      setEditOpen(true);
    },
    onAdjustStock: (product) => {
      setSelectedProduct(product);
      setAdjustOpen(true);
    },
    onDelete: (product) => {
      setSelectedProduct(product);
      setDeleteOpen(true);
    },
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

      <DeleteProductModal
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        product={selectedProduct}
      />
    </>
  );
}
