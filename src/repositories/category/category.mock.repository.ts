import { CategoryDomainRepository } from "@/domain/category";
import { createInMemoryCategoryRepository } from "@/infrastructure/category/category.in-memory.repository";

export type CategoryRepository = CategoryDomainRepository;

export function createMockCategoryRepository(): CategoryRepository {
  return createInMemoryCategoryRepository();
}
