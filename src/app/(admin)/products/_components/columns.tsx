import { ColumnDef } from "@tanstack/react-table";
import { Product } from "@/types/product";
import { Button } from "@/components/ui/button";
import { ArrowUpDown, Edit, Sliders, Trash } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { capitalizeFirstLetter } from "@/lib/utils";

interface GetColumnsProps {
  onEdit: (product: Product) => void;
  onAdjustStock: (product: Product) => void;
  onDelete: (product: Product) => void;
}

export function getColumns({
  onEdit,
  onAdjustStock,
  onDelete,
}: GetColumnsProps): ColumnDef<Product>[] {
  return [
    {
      accessorKey: "name",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
    },
    {
      accessorKey: "sku",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          SKU
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
    },
    {
      accessorKey: "unitOfMeasure",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          UoM
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
    },
    {
      accessorKey: "stock.quantity",
      header: "Stock",
      cell: ({ row }) => {
        const qty = row.original.stock?.quantity ?? 0;
        let badgeColor = "bg-green-50 text-green-700 border-green-200 dark:bg-green-950/30 dark:text-green-400";
        if (qty === 0) {
          badgeColor = "bg-red-50 text-red-700 border-red-200 dark:bg-red-950/30 dark:text-red-400";
        } else if (qty <= 5) {
          badgeColor = "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/30 dark:text-amber-400";
        }
        return (
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${badgeColor}`}>
            {qty}
          </span>
        );
      },
    },
    {
      accessorKey: "category.name",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Category
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
    },
    {
      accessorKey: "status",
      header: ({ column }) => (
        <div className="text-center">Status</div>
      ),
      cell: ({ getValue }) => {
        const value = getValue<string>();
        return (
          <div className="text-center">
            <Badge variant={value === "active" ? "default" : "destructive"}>
              {capitalizeFirstLetter(value)}
            </Badge>
          </div>
        );
      },
    },
    {
      id: "actions",
      header: () => <div className="text-center">Actions</div>,
      cell: ({ row }) => {
        const product = row.original;
        return (
          <div className="flex items-center justify-center gap-2">
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 text-blue-600 hover:text-blue-700"
              onClick={() => onAdjustStock(product)}
              title="Adjust Stock"
            >
              <Sliders className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 text-amber-600 hover:text-amber-700"
              onClick={() => onEdit(product)}
              title="Edit Product"
            >
              <Edit className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 text-red-600 hover:text-red-700"
              onClick={() => onDelete(product)}
              title="Delete Product"
            >
              <Trash className="h-4 w-4" />
            </Button>
          </div>
        );
      },
    },
  ];
}