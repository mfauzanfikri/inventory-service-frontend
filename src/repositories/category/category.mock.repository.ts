import { CategoryDomainRepository } from "@/domain/category";
import { createInMemoryCategoryRepository } from "@/infrastructure/category/category.in-memory.repository";
import { createHttpCategoryRepository } from "@/infrastructure/category/category.http.repository";

export type CategoryRepository = CategoryDomainRepository;

export function createMockCategoryRepository(): CategoryRepository {
  if(process.env.CATEGORY_REPOSITORY_DRIVER === "http") {
    return createHttpCategoryRepository();
  }

  return createInMemoryCategoryRepository();
}
