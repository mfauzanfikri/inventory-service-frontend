"use client";

import { useState } from "react";
import { DataTable } from "@/components/ui/data-table";
import { Category } from "@/types/category";
import { AddCategoryModal } from "./add-category-modal";
import { EditCategoryModal } from "./edit-category-modal";
import { DeactivateCategoryModal } from "./deactivate-category-modal";
import { getColumns } from "./columns";
import { updateCategoryAction } from "../actions";
import { toast } from "sonner";

interface CategoryTableProps {
  data: Category[];
}

export function CategoryTable({ data }: CategoryTableProps) {
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);

  const [editOpen, setEditOpen] = useState(false);
  const [deactivateOpen, setDeactivateOpen] = useState(false);
  const [togglingId, setTogglingId] = useState<string | null>(null);

  const columns = getColumns({
    onEdit: (category) => {
      setSelectedCategory(category);
      setEditOpen(true);
    },
    onDeactivate: (category) => {
      setSelectedCategory(category);
      setDeactivateOpen(true);
    },
    onActivate: async (category) => {
      try {
        setTogglingId(category.id);
        const result = await updateCategoryAction(category.id, { status: "active" });
        if (!result.ok) {
          toast.error(result.error.message || "Failed to activate category. Please try again.", {
            position: "top-center",
          });
          return;
        }
        toast.success(
          <span>
            Category <b className="font-bold">{category.name}</b> has been activated successfully
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
        <AddCategoryModal />
      </div>

      <DataTable columns={columns} data={data} />

      <EditCategoryModal
        open={editOpen}
        onOpenChange={setEditOpen}
        category={selectedCategory}
      />

      <DeactivateCategoryModal
        open={deactivateOpen}
        onOpenChange={setDeactivateOpen}
        category={selectedCategory}
      />
    </>
  );
}