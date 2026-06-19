import { AppError, infrastructureError } from "@/lib/errors/app-error";
import { mapApiError } from "@/lib/errors/api-error-mapper";
import { failure, Result, success } from "@/lib/result";
import { Category, CategoryCreateInput, CategoryUpdateInput } from "@/types/category";
import { categoryRepository } from "@/infrastructure/category/category.api.repository";

function mapCategoryError(error: unknown): AppError {
  return mapApiError(error, {
    conflictField: "name",
    defaultConflictMessage: "Category name already exists",
    defaultNotFoundMessage: "Category not found",
  });
}

export type CategoryResult<T> = Result<T, AppError>;

export const categoryService = {
  async list(): Promise<CategoryResult<Category[]>> {
    try {
      const categories = await categoryRepository.findAll();
      return success(categories);
    } catch (error: unknown) {
      return failure(mapCategoryError(error));
    }
  },

  async create(data: CategoryCreateInput): Promise<CategoryResult<Category>> {
    try {
      const name = (data.name ?? "").trim();
      if (name.length < 3) {
        return failure({
          code: "VALIDATION_ERROR",
          message: "Category name must be at least 3 characters",
          category: "domain",
          field: "name",
        });
      }

      const payload: CategoryCreateInput = {
        name,
        description: (data.description ?? "").trim(),
        status: data.status,
      };

      const category = await categoryRepository.create(payload);
      return success(category);
    } catch (error: unknown) {
      return failure(mapCategoryError(error));
    }
  },

  async update(id: string, data: CategoryUpdateInput): Promise<CategoryResult<Category>> {
    try {
      const payload: CategoryUpdateInput = { ...data };

      if (payload.name !== undefined) {
        const name = payload.name.trim();
        if (name.length < 3) {
          return failure({
            code: "VALIDATION_ERROR",
            message: "Category name must be at least 3 characters",
            category: "domain",
            field: "name",
          });
        }
        payload.name = name;
      }

      if (payload.description !== undefined) {
        payload.description = payload.description.trim();
      }

      const updated = await categoryRepository.update(id, payload);
      if (!updated) {
        return failure({
          code: "NOT_FOUND",
          message: "Category not found",
          category: "application",
        });
      }

      return success(updated);
    } catch (error: unknown) {
      return failure(mapCategoryError(error));
    }
  },

  async getByName(name: string): Promise<CategoryResult<Category>> {
    try {
      const category = await categoryRepository.findByName(name);
      if (!category) {
        return failure({
          code: "NOT_FOUND",
          message: `Category with name ${name} not found`,
          category: "application",
          field: "name",
        });
      }

      return success(category);
    } catch {
      return failure(infrastructureError());
    }
  },
};
