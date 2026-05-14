import { Category } from "@/types/category";
import { categoryRepository } from "@/repositories/category.repository";

async function getAll(): Promise<Category[]> {
  return categoryRepository.getAll();
}

export const categoryService = {
  getAll,
};
