import { CategoryDomainRepository } from "@/domain/category";
import { Category, CategoryCreateInput, CategoryUpdateInput } from "@/types/category";
import { request } from "../http-client";

export function createApiCategoryRepository(): CategoryDomainRepository {
  return {
    async findAll(): Promise<Category[]> {
      return request<Category[]>("/categories");
    },

    async findByName(name: string): Promise<Category | null> {
      try {
        return await request<Category>(`/categories/name/${encodeURIComponent(name)}`);
      } catch(error: unknown) {
        if(typeof error === "object" && error !== null && "status" in error && (error as { status?: number }).status === 404) {
          return null;
        }

        throw error;
      }
    },

    async create(data: CategoryCreateInput): Promise<Category> {
      return request<Category>("/categories", {
        method: "POST",
        body: JSON.stringify(data),
      });
    },

    async update(id: string, data: CategoryUpdateInput): Promise<Category | null> {
      try {
        return await request<Category>(`/categories/${id}`, {
          method: "PATCH",
          body: JSON.stringify(data),
        });
      } catch(error: unknown) {
        if(typeof error === "object" && error !== null && "status" in error && (error as { status?: number }).status === 404) {
          return null;
        }

        throw error;
      }
    },

    async delete(id: string): Promise<Category | null> {
      try {
        await request<void>(`/categories/${id}`, {
          method: "DELETE",
        });

        return {
          id,
          name: "",
          description: "",
          status: "active",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
      } catch(error: unknown) {
        if(typeof error === "object" && error !== null && "status" in error && (error as { status?: number }).status === 404) {
          return null;
        }

        throw error;
      }
    },
  };
}
