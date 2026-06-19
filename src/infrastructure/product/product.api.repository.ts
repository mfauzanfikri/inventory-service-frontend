import { Product, ProductCreateInput, ProductUpdateInput } from "@/types/product";
import { request } from "../http-client";

export const productRepository = {
  async findAll(): Promise<Product[]> {
    return request<Product[]>("/products");
  },

  async getById(id: string): Promise<Product | null> {
    try {
      return await request<Product>(`/products/${id}`);
    } catch (error: unknown) {
      if (
        typeof error === "object" &&
        error !== null &&
        "status" in error &&
        (error as { status?: number }).status === 404
      ) {
        return null;
      }
      throw error;
    }
  },

  async create(data: ProductCreateInput): Promise<Product> {
    return request<Product>("/products", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  async update(id: string, data: ProductUpdateInput): Promise<Product | null> {
    try {
      return await request<Product>(`/products/${id}`, {
        method: "PATCH",
        body: JSON.stringify(data),
      });
    } catch (error: unknown) {
      if (
        typeof error === "object" &&
        error !== null &&
        "status" in error &&
        (error as { status?: number }).status === 404
      ) {
        return null;
      }
      throw error;
    }
  },

  async adjustStock(
    id: string,
    type: "increase" | "decrease",
    amount: number
  ): Promise<Product> {
    return request<Product>(`/products/${id}/stock/${type}`, {
      method: "POST",
      body: JSON.stringify({ amount }),
    });
  },
};