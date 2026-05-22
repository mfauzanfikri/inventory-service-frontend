import { CategoryDomainRepository, CategoryEntity, CategoryName, CategoryDescription } from "@/domain/category";
import { AppError, getErrorCode, infrastructureError, unknownError } from "@/lib/errors/app-error";
import { Result, failure, success } from "@/lib/result";
import { Category, CategoryCreateInput, CategoryUpdateInput } from "@/types/category";
import { createMockCategoryRepository } from "@/repositories/category/category.mock.repository";

function mapCategoryError(error: unknown): AppError {
  const code = getErrorCode(error);

  if(
    code === "CATEGORY_NAME_CONFLICT" ||
    (typeof error === "object" &&
      error !== null &&
      "status" in error &&
      (error as { status?: number }).status === 409)
  ) {
    return {
      code: "CONFLICT",
      message: "Category name already exists",
      category: "domain",
      field: "name",
    };
  }

  if(code === "CATEGORY_NOT_FOUND") {
    return {
      code: "NOT_FOUND",
      message: "Category not found",
      category: "domain",
    };
  }

  return unknownError();
}

export type CategoryResult<T> = Result<T, AppError>;

export function createCategoryService(repository: CategoryDomainRepository = createMockCategoryRepository()) {
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

    async delete(id: string): Promise<CategoryResult<void>> {
      try {
        const deleted = await repository.delete(id);
        if(!deleted) {
          return failure({
            code: "NOT_FOUND",
            message: "Category not found",
            category: "application",
          });
        }

        return success(undefined);
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

export const categoryService = createCategoryService();
