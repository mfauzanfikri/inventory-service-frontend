import { createMockCategoryRepository } from "@/repositories/category/category.mock.repository";
import type { CategoryRepository } from "@/repositories/category/category.repository";
import { Category, CategoryCreateInput, CategoryUpdateInput } from "@/types/category";

export class CategoryNotFoundError extends Error {
  readonly code = "CATEGORY_NOT_FOUND";

  constructor(message: string) {
    super(message);
    this.name = "CategoryNotFoundError";
  }
}

export class CategoryConflictError extends Error {
  readonly code = "CATEGORY_NAME_CONFLICT";

  constructor(message = "Category name already exists") {
    super(message);
    this.name = "CategoryConflictError";
  }
}

export class CategoryInfrastructureError extends Error {
  readonly code = "CATEGORY_INFRASTRUCTURE_ERROR";

  constructor(message = "Category service is unavailable") {
    super(message);
    this.name = "CategoryInfrastructureError";
  }
}

function extractStatus(error: unknown): number | undefined {
  if(typeof error === "object" && error !== null && "status" in error) {
    const status = (error as { status?: unknown }).status;
    if(typeof status === "number") {
      return status;
    }
  }

  return undefined;
}

function mapRepositoryError(error: unknown): never {
  const status = extractStatus(error);
  if(status === 409) {
    throw new CategoryConflictError();
  }

  if(error instanceof CategoryConflictError || error instanceof CategoryNotFoundError || error instanceof CategoryInfrastructureError) {
    throw error;
  }

  throw new CategoryInfrastructureError();
}

export function createCategoryService(
  repository: CategoryRepository = createMockCategoryRepository()
) {
  return {
    async getAll() {
      try {
        return await repository.findAll();
      } catch(error: unknown) {
        mapRepositoryError(error);
      }
    },
    async getByName(name: string): Promise<Category> {
      try {
        const category = await repository.findByName(name);
        if(!category) {
          throw new CategoryNotFoundError(`Category with name ${name} not found`);
        }

        return category;
      } catch(error: unknown) {
        if(error instanceof CategoryNotFoundError) {
          throw error;
        }

        mapRepositoryError(error);
      }
    },
    async create(data: CategoryCreateInput) {
      try {
        return await repository.create(data);
      } catch(error: unknown) {
        mapRepositoryError(error);
      }
    },
    async update(id: string, data: CategoryUpdateInput): Promise<Category> {
      try {
        const category = await repository.update(id, data);
        if(!category) {
          throw new CategoryNotFoundError(`Category with id ${id} not found`);
        }

        return category;
      } catch(error: unknown) {
        if(error instanceof CategoryNotFoundError) {
          throw error;
        }

        mapRepositoryError(error);
      }
    },
    async delete(id: string): Promise<void> {
      try {
        const category = await repository.delete(id);
        if(!category) {
          throw new CategoryNotFoundError(`Category with id ${id} not found`);
        }
      } catch(error: unknown) {
        if(error instanceof CategoryNotFoundError) {
          throw error;
        }

        mapRepositoryError(error);
      }
    }
  };
}

export const categoryService = createCategoryService();
