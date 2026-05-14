import { createMockCategoryRepository } from "@/repositories/category/category.mock.repository";
import type { CategoryRepository } from "@/repositories/category/category.repository";
import { CreateCategoryInput, UpdateCategoryInput } from "@/types/category";

export function createCategoryService(
  repository: CategoryRepository = createMockCategoryRepository()
) {
  return {
    async getAll() {
      return repository.getAll();
    },
    async create(data: CreateCategoryInput) {
      return repository.create(data);
    },
    async update(id: string, data: UpdateCategoryInput) {
      return repository.update(id, data);
    },
    async delete(id: string) {
      return repository.delete(id);
    }
  };
}

export const categoryService = createCategoryService();