"use client";

import { useState } from "react";
import { DataTable } from "@/components/ui/data-table";
import { Category } from "@/types/category";
import { AddCategoryModal } from "./add-category-modal";
import { EditCategoryModal } from "./edit-category-modal";
import { DeleteCategoryModal } from "./delete-category-modal";
import { getColumns } from "./columns";

interface CategoryTableProps {
  data: Category[];
}

export function CategoryTable({ data }: CategoryTableProps) {
  const [selectedCategory, setSelectedCategory] =
    useState<Category | null>(null);

  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const columns = getColumns({
    onEdit: (category) => {
      setSelectedCategory(category);
      setEditOpen(true);
    },
    onDelete: (category) => {
      setSelectedCategory(category);
      setDeleteOpen(true);
    },
  });

  return (
    <>
      <div className="mb-1 flex justify-end">
        <AddCategoryModal />
      </div>

      <DataTable columns={columns} data={data} />

      <EditCategoryModal
        open={editOpen}
        onOpenChange={setEditOpen}
        category={selectedCategory}
      />

      <DeleteCategoryModal
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        category={selectedCategory}
      />
    </>
  );
}