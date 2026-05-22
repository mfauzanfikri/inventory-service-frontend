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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { z } from "zod";
import { Controller, DefaultValues, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createCategoryAction } from "../actions";

const statusOptions = ["active", "inactive"] as const;

const schema = z.object({
  name: z.string().min(3, "Name too short"),
  description: z.string().min(1, "Description is required"),
  status: z.enum(statusOptions, {
    error: "Please select a valid status",
  }),
});

type FormData = z.infer<typeof schema>;

const defaultValues: DefaultValues<FormData> = {
  name: "",
  description: "",
  status: "" as "active",
};

export function AddCategoryModal() {
  const [open, setOpen] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    control,
    reset,
    setError,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues
  });

  const onSubmit = async (data: FormData) => {
    const result = await createCategoryAction(data);

    if(!result.ok) {
      if(result.error.field === "name") {
        setError("name", { message: result.error.message });
        return;
      }

      toast.error(result.error.message || "Failed to create category. Please try again.", {
        position: "top-center",
      });
      return;
    }

    const message = <span><b className="font-bold">{result.data.name}</b> category has been created</span>;

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
        <Button>Add Category</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogHeader>
            <DialogTitle>Add category</DialogTitle>
            <DialogDescription>
              Create a new category for grouping inventory items.
            </DialogDescription>
          </DialogHeader>
          <FieldGroup className="py-4">
            <Field data-invalid={!!errors.name}>
              <FieldLabel htmlFor="category-name">Name</FieldLabel>
              <Input
                id="category-name"
                {...register("name")}
                aria-invalid={!!errors.name}
              />
              {errors.name && (
                <FieldError>{errors.name.message}</FieldError>
              )}
            </Field>

            <Field data-invalid={!!errors.description}>
              <FieldLabel htmlFor="category-description">Description</FieldLabel>
              <Textarea
                id="category-description"
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
                  <FieldLabel htmlFor="status">Status</FieldLabel>

                  <Select
                    value={field.value}
                    onValueChange={field.onChange}
                  >
                    <SelectTrigger
                      id="status"
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
              <Button type="button" variant="outline" disabled={isSubmitting}>Cancel</Button>
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
