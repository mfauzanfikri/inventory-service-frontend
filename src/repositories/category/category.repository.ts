import { Category, CreateCategoryInput, UpdateCategoryInput } from "@/types/category";

export type CategoryRepository = {
  getAll(): Promise<Category[]>;
  create(data: CreateCategoryInput): Promise<Category>;
  update(id: string, data: UpdateCategoryInput): Promise<Category>;
  delete(id: string): Promise<void>;
};
