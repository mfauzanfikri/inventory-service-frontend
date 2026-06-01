"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { z } from "zod";
import { Controller, DefaultValues, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Category } from "@/types/category";
import { createProductAction } from "../actions";

// Only active categories should be shown in dropdown (handled by parent page filtering)
interface AddProductModalProps {
  categories: Category[];
}

const schema = z.object({
  name: z.string().min(3, "Product name must be at least 3 characters"),
  sku: z
    .string()
    .min(1, "SKU is required")
    .regex(/^[A-Za-z0-9-_]+$/, "SKU must be alphanumeric (hyphens/underscores allowed)"),
  unitOfMeasure: z.string().min(1, "Unit of measure is required"),
  categoryId: z.string().min(1, "Category must be selected"),
  initialStock: z.coerce.number().int().nonnegative("Initial stock cannot be negative").default(0),
  status: z.enum(["active", "inactive"]),
});

type FormInput = z.input<typeof schema>;
type FormData = z.output<typeof schema>;

const defaultValues: DefaultValues<FormInput> = {
  name: "",
  sku: "",
  unitOfMeasure: "",
  categoryId: "",
  initialStock: 0,
  status: "active",
};

export function AddProductModal({ categories }: AddProductModalProps) {
  const [open, setOpen] = useState(false);
  const activeCategories = categories.filter((c) => c.status === "active");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    control,
    reset,
    setError,
  } = useForm<FormInput, unknown, FormData>({
    resolver: zodResolver(schema),
    defaultValues,
  });

  const onSubmit = async (data: FormData) => {
    const result = await createProductAction(data);

    if(!result.ok) {
      if(result.error.field === "sku") {
        setError("sku", { message: result.error.message });
        return;
      }
      if(result.error.field === "name") {
        setError("name", { message: result.error.message });
        return;
      }

      toast.error(result.error.message || "Failed to create product. Please try again.", {
        position: "top-center",
      });
      return;
    }

    const message = (
      <span>
        Product <b className="font-bold">{result.data.name}</b> (SKU: {result.data.sku}) has been created
      </span>
    );

    toast.success(message, {
      position: "top-center",
    });

    reset(defaultValues);
    setOpen(false);
  };

  const handleOpenChange = (nextOpen: boolean) => {
    setOpen(nextOpen);
    if(nextOpen) {
      reset(defaultValues);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button>Add Product</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogHeader>
            <DialogTitle>Add Product</DialogTitle>
            <DialogDescription>
              Register a new product with category details and optional initial inventory.
            </DialogDescription>
          </DialogHeader>

          <FieldGroup className="py-4">
            {/* Product Name */}
            <Field data-invalid={!!errors.name}>
              <FieldLabel htmlFor="product-name">Product Name</FieldLabel>
              <Input
                id="product-name"
                placeholder="e.g. Acme Widget"
                {...register("name")}
                aria-invalid={!!errors.name}
              />
              {errors.name && <FieldError>{errors.name.message}</FieldError>}
            </Field>

            {/* Product SKU */}
            <Field data-invalid={!!errors.sku}>
              <FieldLabel htmlFor="product-sku">SKU</FieldLabel>
              <Input
                id="product-sku"
                placeholder="e.g. WIDGET-001"
                {...register("sku")}
                aria-invalid={!!errors.sku}
              />
              {errors.sku && <FieldError>{errors.sku.message}</FieldError>}
            </Field>

            {/* Unit of Measure */}
            <Field data-invalid={!!errors.unitOfMeasure}>
              <FieldLabel htmlFor="unit-of-measure">Unit of Measure (UoM)</FieldLabel>
              <Input
                id="unit-of-measure"
                placeholder="e.g. pcs, box, kg"
                {...register("unitOfMeasure")}
                aria-invalid={!!errors.unitOfMeasure}
              />
              {errors.unitOfMeasure && <FieldError>{errors.unitOfMeasure.message}</FieldError>}
            </Field>

            {/* Category selection */}
            <Controller
              name="categoryId"
              control={control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="category-select">Category</FieldLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger id="category-select" aria-invalid={fieldState.invalid}>
                      <SelectValue placeholder="Select active category" />
                    </SelectTrigger>
                    <SelectContent>
                      {activeCategories.length === 0 ? (
                        <SelectItem value="_empty" disabled>
                          No active categories available
                        </SelectItem>
                      ) : (
                        activeCategories.map((c) => (
                          <SelectItem key={c.id} value={c.id}>
                            {c.name}
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                  {fieldState.error && <FieldError>{fieldState.error.message}</FieldError>}
                </Field>
              )}
            />

            {/* Initial Stock quantity */}
            <Field data-invalid={!!errors.initialStock}>
              <FieldLabel htmlFor="initial-stock">Initial Stock Quantity</FieldLabel>
              <Input
                id="initial-stock"
                type="number"
                placeholder="0"
                {...register("initialStock")}
                aria-invalid={!!errors.initialStock}
              />
              {errors.initialStock && <FieldError>{errors.initialStock.message}</FieldError>}
            </Field>

            {/* Status Selection */}
            <Controller
              name="status"
              control={control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="product-status">Status</FieldLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger id="product-status" aria-invalid={fieldState.invalid}>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                  {fieldState.error && <FieldError>{fieldState.error.message}</FieldError>}
                </Field>
              )}
            />
          </FieldGroup>

          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline" disabled={isSubmitting}>
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Spinner /> Save
                </>
              ) : (
                "Save"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}