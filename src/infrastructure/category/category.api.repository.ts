import { Category, CategoryCreateInput, CategoryUpdateInput } from "@/types/category";
import { request } from "../http-client";

export const categoryRepository = {
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
};
