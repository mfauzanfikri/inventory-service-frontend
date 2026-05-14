"use client";

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
import { Field, FieldGroup } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

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
  if (!category) return null;

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);

    const payload = {
      name: formData.get("name"),
      description: formData.get("description"),
      status: formData.get("status"),
    };

    console.log("Update category:", category.id, payload);

    // await categoryService.updateCategory(category.id, payload);

    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <form onSubmit={handleSubmit}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit category</DialogTitle>
            <DialogDescription>
              Update the selected category information.
            </DialogDescription>
          </DialogHeader>

          <FieldGroup>
            <Field>
              <Label htmlFor="edit-category-name">Name</Label>
              <Input
                id="edit-category-name"
                name="name"
                defaultValue={category.name}
                placeholder="Electronics"
                required
              />
            </Field>

            <Field>
              <Label htmlFor="edit-category-description">
                Description
              </Label>
              <Textarea
                id="edit-category-description"
                name="description"
                defaultValue={category.description ?? ""}
                placeholder="Devices and electronic items"
                required
              />
            </Field>

            <Field>
              <Label htmlFor="edit-category-status">Status</Label>
              <Select
                name="status"
                defaultValue={category.status}
              >
                <SelectTrigger
                  id="edit-category-status"
                  className="w-full"
                >
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>

                <SelectContent>
                  <SelectItem value="active">
                    Active
                  </SelectItem>
                  <SelectItem value="inactive">
                    Inactive
                  </SelectItem>
                </SelectContent>
              </Select>
            </Field>
          </FieldGroup>

          <DialogFooter>
            <DialogClose asChild>
              <Button
                type="button"
                variant="outline"
              >
                Cancel
              </Button>
            </DialogClose>

            <Button type="submit">
              Save changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  );
}