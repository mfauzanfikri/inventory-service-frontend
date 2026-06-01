import { ProductDomainRepository, ProductEntity } from "@/domain/product";
import { AppError, getErrorCode, infrastructureError, unknownError } from "@/lib/errors/app-error";
import { failure, Result, success } from "@/lib/result";
import { Product, ProductCreateInput, ProductUpdateInput } from "@/types/product";
import { createApiProductRepository } from "@/infrastructure/product/product.api.repository";

function mapProductError(error: unknown): AppError {
  const code = getErrorCode(error);
  const status =
    typeof error === "object" && error !== null && "status" in error
      ? (error as { status?: unknown }).status
      : undefined;
  const message =
    typeof error === "object" && error !== null && "message" in error
      ? (error as { message?: unknown }).message
      : undefined;
  const details =
    typeof error === "object" && error !== null && "details" in error
      ? (error as { details?: unknown }).details
      : undefined;

  // Handle unique SKU conflicts (409)
  if (
    code === "PRODUCT_SKU_CONFLICT" ||
    code === "CONFLICT" ||
    status === 409
  ) {
    return {
      code: "CONFLICT",
      message: typeof message === "string" && message.length > 0 ? message : "Product SKU already exists",
      category: "domain",
      field: "sku",
    };
  }

  // Handle insufficient stock levels (400 Bad Request)
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

  if (code === "PRODUCT_NOT_FOUND" || code === "NOT_FOUND" || status === 404) {
    return {
      code: "NOT_FOUND",
      message: typeof message === "string" && message.length > 0 ? message : "Product not found",
      category: "domain",
    };
  }

  if (code === "INFRASTRUCTURE" || code === "INFRASTRUCTURE_ERROR") {
    return infrastructureError(typeof message === "string" && message.length > 0 ? message : undefined);
  }

  if (code === "VALIDATION_ERROR" || status === 400) {
    const field =
      typeof details === "object" &&
      details !== null &&
      !Array.isArray(details)
        ? Object.keys(details as Record<string, unknown>)[0]
        : undefined;

    return {
      code: "VALIDATION_ERROR",
      message: typeof message === "string" && message.length > 0 ? message : "Validation failed",
      category: "application",
      field,
    };
  }

  if (status === 500 || status === 502 || status === 503 || status === 504) {
    return infrastructureError(typeof message === "string" && message.length > 0 ? message : undefined);
  }

  return unknownError();
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
        // Enforce pre-save domain invariant validation
        const dummyProductForValidation: Product = {
          id: "temp",
          name: data.name,
          sku: data.sku,
          unitOfMeasure: data.unitOfMeasure,
          status: data.status ?? "active",
          categoryId: data.categoryId,
          category: {
            id: data.categoryId,
            name: "temp",
            description: "",
            status: "active",
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
          stock: {
            quantity: data.initialStock ?? 0,
            updatedAt: new Date(),
          },
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        ProductEntity.create(dummyProductForValidation);

        const product = await repository.create(data);
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