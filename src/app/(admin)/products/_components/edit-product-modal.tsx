"use client";

import { useEffect } from "react";
import { Product, ProductUpdateInput } from "@/types/product";
import { Category } from "@/types/category";
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
} from "@/components/ui/dialog";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { z } from "zod";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { updateProductAction } from "../actions";

const schema = z.object({
  name: z.string().min(3, "Product name must be at least 3 characters"),
  unitOfMeasure: z.string().min(1, "Unit of measure is required"),
  categoryId: z.string().min(1, "Category must be selected"),
  status: z.enum(["active", "inactive"]),
});

type FormData = z.infer<typeof schema>;

interface EditProductModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product: Product | null;
  categories: Category[];
}

export function EditProductModal({
  open,
  onOpenChange,
  product,
  categories,
}: EditProductModalProps) {
  const activeCategories = categories.filter((c) => c.status === "active" || c.id === product?.categoryId);

  const {
    register,
    handleSubmit,
    formState: { errors, dirtyFields, isSubmitting },
    control,
    reset,
    setError,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  useEffect(() => {
    if (product && open) {
      reset({
        name: product.name,
        unitOfMeasure: product.unitOfMeasure,
        categoryId: product.categoryId,
        status: product.status,
      });
    }
  }, [product, open, reset]);

  if (!product) return null;

  const onSubmit = async (data: FormData) => {
    const changedFields: ProductUpdateInput = {};
    if (dirtyFields.name) changedFields.name = data.name;
    if (dirtyFields.unitOfMeasure) changedFields.unitOfMeasure = data.unitOfMeasure;
    if (dirtyFields.categoryId) changedFields.categoryId = data.categoryId;
    if (dirtyFields.status) changedFields.status = data.status;

    if (Object.keys(changedFields).length === 0) {
      onOpenChange(false);
      return;
    }

    const result = await updateProductAction(product.id, changedFields);

    if (!result.ok) {
      if (result.error.field === "name") {
        setError("name", { message: result.error.message });
        return;
      }

      toast.error(result.error.message || "Failed to update product. Please try again.", {
        position: "top-center",
      });
      return;
    }

    toast.success(
      <span>
        Product <b className="font-bold">{data.name}</b> has been updated successfully
      </span>,
      { position: "top-center" }
    );

    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogHeader>
            <DialogTitle>Edit Product</DialogTitle>
            <DialogDescription>
              Update information for the selected product. SKU is immutable and cannot be changed.
            </DialogDescription>
          </DialogHeader>

          <FieldGroup className="py-4">
            {/* SKU (Immutable, Read-Only / Disabled) */}
            <Field>
              <FieldLabel htmlFor="edit-sku">Product SKU (Immutable)</FieldLabel>
              <Input
                id="edit-sku"
                value={product.sku}
                disabled
                className="bg-muted text-muted-foreground select-none"
              />
            </Field>

            {/* Product Name */}
            <Field data-invalid={!!errors.name}>
              <FieldLabel htmlFor="edit-product-name">Product Name</FieldLabel>
              <Input
                id="edit-product-name"
                {...register("name")}
                aria-invalid={!!errors.name}
              />
              {errors.name && <FieldError>{errors.name.message}</FieldError>}
            </Field>

            {/* Unit of Measure */}
            <Field data-invalid={!!errors.unitOfMeasure}>
              <FieldLabel htmlFor="edit-unit-of-measure">Unit of Measure (UoM)</FieldLabel>
              <Input
                id="edit-unit-of-measure"
                {...register("unitOfMeasure")}
                aria-invalid={!!errors.unitOfMeasure}
              />
              {errors.unitOfMeasure && <FieldError>{errors.unitOfMeasure.message}</FieldError>}
            </Field>

            {/* Category selector */}
            <Controller
              name="categoryId"
              control={control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="edit-category">Category</FieldLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger id="edit-category" aria-invalid={fieldState.invalid}>
                      <SelectValue placeholder="Select active category" />
                    </SelectTrigger>
                    <SelectContent>
                      {activeCategories.map((c) => (
                        <SelectItem key={c.id} value={c.id}>
                          {c.name} {c.status === "inactive" ? "(Inactive)" : ""}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {fieldState.error && <FieldError>{fieldState.error.message}</FieldError>}
                </Field>
              )}
            />

            {/* Status Selector */}
            <Controller
              name="status"
              control={control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="edit-status">Status</FieldLabel>
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger id="edit-status" aria-invalid={fieldState.invalid}>
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
                  <Spinner /> Save changes
                </>
              ) : (
                "Save changes"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}