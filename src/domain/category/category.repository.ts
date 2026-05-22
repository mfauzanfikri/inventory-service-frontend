import { Category, CategoryCreateInput, CategoryUpdateInput } from "@/types/category";

export type CategoryDomainRepository = {
  findAll(): Promise<Category[]>;
  findByName(name: string): Promise<Category | null>;
  create(data: CategoryCreateInput): Promise<Category>;
  update(id: string, data: CategoryUpdateInput): Promise<Category | null>;
  delete(id: string): Promise<Category | null>;
};
