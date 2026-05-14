"use client";

import { useEffect } from "react";
import { Category } from "@/types/category";
import { Button } from "@/components/ui/button";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { z } from "zod";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { updateCategoryAction } from "./actions";

const statusOptions = ["active", "inactive"] as const;

const schema = z.object({
  name: z.string().min(3, "Name too short"),
  description: z.string().min(1, "Description is required"),
  status: z.enum(statusOptions, {
    error: "Please select a valid status",
  }),
});

type FormData = z.infer<typeof schema>;

interface EditCategoryModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  category: Category | null;
}

export function EditCategoryModal({
  open,
  onOpenChange,
  category,
}: EditCategoryModalProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  useEffect(() => {
    if (category && open) {
      reset({
        name: category.name,
        description: category.description,
        status: category.status,
      });
    }
  }, [category, open, reset]);

  if (!category) return null;

  const onSubmit = async (data: FormData) => {
    await updateCategoryAction(category.id, data);

    const message = (
      <span>
        <b className="font-bold">{data.name}</b> category has been updated
      </span>
    );

    toast.success(message, {
      position: "top-center",
    });

    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogHeader>
            <DialogTitle>Edit category</DialogTitle>
            <DialogDescription>
              Update the selected category information.
            </DialogDescription>
          </DialogHeader>

          <FieldGroup className="py-4">
            <Field data-invalid={!!errors.name}>
              <FieldLabel htmlFor="edit-category-name">Name</FieldLabel>
              <Input
                id="edit-category-name"
                {...register("name")}
                aria-invalid={!!errors.name}
              />
              {errors.name && <FieldError>{errors.name.message}</FieldError>}
            </Field>

            <Field data-invalid={!!errors.description}>
              <FieldLabel htmlFor="edit-category-description">
                Description
              </FieldLabel>
              <Textarea
                id="edit-category-description"
                {...register("description")}
                aria-invalid={!!errors.description}
              />
              {errors.description && (
                <FieldError>{errors.description.message}</FieldError>
              )}
            </Field>

            <Controller
              name="status"
              control={control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="edit-status">Status</FieldLabel>

                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger
                      id="edit-status"
                      aria-invalid={fieldState.invalid}
                    >
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>

                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                    </SelectContent>
                  </Select>

                  {fieldState.error && (
                    <FieldError>{fieldState.error.message}</FieldError>
                  )}
                </Field>
              )}
            />
          </FieldGroup>

          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </DialogClose>

            <Button type="submit">Save changes</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}