import { AppError } from "@/lib/errors/app-error";
import { mapApiError } from "@/lib/errors/api-error-mapper";
import { failure, Result, success } from "@/lib/result";
import { Product, ProductCreateInput, ProductUpdateInput } from "@/types/product";
import { productRepository } from "@/infrastructure/product/product.api.repository";

function mapProductError(error: unknown): AppError {
  return mapApiError(error, {
    conflictField: "sku",
    defaultConflictMessage: "Product SKU already exists",
    defaultNotFoundMessage: "Product not found",
    customMapper: ({ status, message }) => {
      if (
        status === 400 &&
        typeof message === "string" &&
        message.toLowerCase().includes("insufficient")
      ) {
        return {
          code: "VALIDATION_ERROR",
          message: "Cannot decrease stock: Insufficient stock levels",
          category: "domain",
          field: "quantity",
        };
      }
      return undefined;
    }
  });
}

export type ProductResult<T> = Result<T, AppError>;

export const productService = {
  async list(): Promise<ProductResult<Product[]>> {
    try {
      const products = await productRepository.findAll();
      return success(products);
    } catch (error: unknown) {
      return failure(mapProductError(error));
    }
  },

  async getById(id: string): Promise<ProductResult<Product>> {
    try {
      const product = await productRepository.getById(id);
      if (!product) {
        return failure({
          code: "NOT_FOUND",
          message: "Product not found",
          category: "application",
        });
      }
      return success(product);
    } catch (error: unknown) {
      return failure(mapProductError(error));
    }
  },

  async create(data: ProductCreateInput): Promise<ProductResult<Product>> {
    try {
      const name = (data.name ?? "").trim();
      if (name.length < 3) {
        return failure({
          code: "VALIDATION_ERROR",
          message: "Product name must be at least 3 characters",
          category: "domain",
          field: "name",
        });
      }

      const sku = (data.sku ?? "").trim().toUpperCase();
      if (!sku) {
        return failure({
          code: "VALIDATION_ERROR",
          message: "SKU is required",
          category: "domain",
          field: "sku",
        });
      }

      const skuRegex = /^[A-Z0-9-_]+$/;
      if (!skuRegex.test(sku)) {
        return failure({
          code: "VALIDATION_ERROR",
          message: "SKU must be alphanumeric (hyphens and underscores allowed)",
          category: "domain",
          field: "sku",
        });
      }

      if (data.status && data.status !== "active" && data.status !== "inactive") {
        return failure({
          code: "VALIDATION_ERROR",
          message: "Product status is invalid",
          category: "domain",
          field: "status",
        });
      }

      if (data.initialStock !== undefined && data.initialStock < 0) {
        return failure({
          code: "VALIDATION_ERROR",
          message: "Stock quantity cannot be negative",
          category: "domain",
          field: "initialStock",
        });
      }

      const payload: ProductCreateInput = {
        ...data,
        name,
        sku,
      };

      const product = await productRepository.create(payload);
      return success(product);
    } catch (error: unknown) {
      return failure(mapProductError(error));
    }
  },

  async update(id: string, data: ProductUpdateInput): Promise<ProductResult<Product>> {
    try {
      const updated = await productRepository.update(id, data);
      if (!updated) {
        return failure({
          code: "NOT_FOUND",
          message: "Product not found",
          category: "application",
        });
      }

      return success(updated);
    } catch (error: unknown) {
      return failure(mapProductError(error));
    }
  },

  async adjustStock(
    id: string,
    type: "increase" | "decrease",
    amount: number
  ): Promise<ProductResult<Product>> {
    try {
      if (amount <= 0) {
        return failure({
          code: "VALIDATION_ERROR",
          message: "Adjustment amount must be greater than zero",
          category: "application",
          field: "amount",
        });
      }

      const product = await productRepository.adjustStock(id, type, amount);
      return success(product);
    } catch (error: unknown) {
      return failure(mapProductError(error));
    }
  },
};