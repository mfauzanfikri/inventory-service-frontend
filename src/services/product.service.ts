import { ProductDomainRepository, ProductEntity, ProductName, ProductSKU } from "@/domain/product";
import { AppError } from "@/lib/errors/app-error";
import { mapApiError } from "@/lib/errors/api-error-mapper";
import { failure, Result, success } from "@/lib/result";
import { Product, ProductCreateInput, ProductUpdateInput } from "@/types/product";
import { createApiProductRepository } from "@/infrastructure/product/product.api.repository";

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

export function createProductService(repository: ProductDomainRepository) {
  return {
    async list(): Promise<ProductResult<Product[]>> {
      try {
        const products = await repository.findAll();
        const validated = products.map((product) => ProductEntity.create(product).toJSON());
        return success(validated);
      } catch (error: unknown) {
        return failure(mapProductError(error));
      }
    },

    async getById(id: string): Promise<ProductResult<Product>> {
      try {
        const product = await repository.getById(id);
        if (!product) {
          return failure({
            code: "NOT_FOUND",
            message: "Product not found",
            category: "application",
          });
        }
        return success(ProductEntity.create(product).toJSON());
      } catch (error: unknown) {
        return failure(mapProductError(error));
      }
    },

    async create(data: ProductCreateInput): Promise<ProductResult<Product>> {
      try {
        // Enforce pre-save domain invariant validation directly on inputs
        const normalizedName = ProductName.create(data.name).toString();
        const normalizedSku = ProductSKU.create(data.sku).toString();

        if (data.status && data.status !== "active" && data.status !== "inactive") {
          throw new Error("Product status is invalid");
        }

        if (data.initialStock !== undefined && data.initialStock < 0) {
          throw new Error("Stock quantity cannot be negative");
        }

        const payload: ProductCreateInput = {
          ...data,
          name: normalizedName,
          sku: normalizedSku,
        };

        const product = await repository.create(payload);
        return success(ProductEntity.create(product).toJSON());
      } catch (error: unknown) {
        return failure(mapProductError(error));
      }
    },

    async update(id: string, data: ProductUpdateInput): Promise<ProductResult<Product>> {
      try {
        const updated = await repository.update(id, data);
        if (!updated) {
          return failure({
            code: "NOT_FOUND",
            message: "Product not found",
            category: "application",
          });
        }

        return success(ProductEntity.create(updated).toJSON());
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

        const product = await repository.adjustStock(id, type, amount);
        return success(ProductEntity.create(product).toJSON());
      } catch (error: unknown) {
        return failure(mapProductError(error));
      }
    },
  };
}

export const productService = createProductService(createApiProductRepository());