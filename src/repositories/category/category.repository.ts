import { Category } from "@/types/category";

export type CategoryRepository = {
  getAll(): Promise<Category[]>;
};
