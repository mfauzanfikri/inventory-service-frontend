import { createMockCategoryRepository } from "@/repositories/category/category.mock.repository";
import type { CategoryRepository } from "@/repositories/category/category.repository";

export function createCategoryService(
  repository: CategoryRepository = createMockCategoryRepository()
) {
  return {
    async getAll() {
      return repository.getAll();
    },
  };
}

export const categoryService = createCategoryService();