import { CategoryDescription, CategoryDomainRepository, CategoryEntity, CategoryName } from "@/domain/category";
import { AppError } from "@/lib/errors/app-error";
import { mapApiError } from "@/lib/errors/api-error-mapper";
import { failure, Result, success } from "@/lib/result";
import { Category, CategoryCreateInput, CategoryUpdateInput } from "@/types/category";
import { createApiCategoryRepository } from "@/infrastructure/category/category.api.repository";

function mapCategoryError(error: unknown): AppError {
  return mapApiError(error, {
    conflictField: "name",
    defaultConflictMessage: "Category name already exists",
    defaultNotFoundMessage: "Category not found",
  });
}

export type CategoryResult<T> = Result<T, AppError>;

export function createCategoryService(repository: CategoryDomainRepository) {
  return {
    async list(): Promise<CategoryResult<Category[]>> {
      try {
        const categories = await repository.findAll();
        const validated = categories.map((category) => CategoryEntity.create(category).toJSON());
        return success(validated);
      } catch (error: unknown) {
        return failure(mapCategoryError(error));
      }
    },

    async create(data: CategoryCreateInput): Promise<CategoryResult<Category>> {
      try {
        const payload: CategoryCreateInput = {
          name: CategoryName.create(data.name).toString(),
          description: CategoryDescription.create(data.description).toString(),
          status: data.status,
        };

        const category = await repository.create(payload);
        return success(CategoryEntity.create(category).toJSON());
      } catch (error: unknown) {
        return failure(mapCategoryError(error));
      }
    },

    async update(id: string, data: CategoryUpdateInput): Promise<CategoryResult<Category>> {
      try {
        const payload: CategoryUpdateInput = { ...data };

        if(payload.name !== undefined) {
          payload.name = CategoryName.create(payload.name).toString();
        }

        if(payload.description !== undefined) {
          payload.description = CategoryDescription.create(payload.description).toString();
        }

        const updated = await repository.update(id, payload);
        if(!updated) {
          return failure({
            code: "NOT_FOUND",
            message: "Category not found",
            category: "application",
          });
        }

        return success(CategoryEntity.create(updated).toJSON());
      } catch (error: unknown) {
        return failure(mapCategoryError(error));
      }
    },



    async getByName(name: string): Promise<CategoryResult<Category>> {
      try {
        const category = await repository.findByName(name);
        if(!category) {
          return failure({
            code: "NOT_FOUND",
            message: `Category with name ${name} not found`,
            category: "application",
            field: "name",
          });
        }

        return success(CategoryEntity.create(category).toJSON());
      } catch {
        return failure(infrastructureError());
      }
    },
  };
}

export const categoryService = createCategoryService(createApiCategoryRepository());
