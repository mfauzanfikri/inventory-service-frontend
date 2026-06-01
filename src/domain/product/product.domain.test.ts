import { ProductEntity } from "./product.entity";
import { ProductName } from "./product-name";
import { ProductSKU } from "./product-sku";
import { ProductConflictError, ProductInfrastructureError } from "./product.errors";

describe("Product domain", () => {
  const validCategory = {
    id: "cat-1",
    name: "Electronics",
    description: "Gadgets",
    status: "active" as const,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const validStock = {
    quantity: 10,
    updatedAt: new Date(),
  };

  it("creates valid product entity", () => {
    const entity = ProductEntity.create({
      id: "prod-1",
      name: "Smart Watch",
      sku: "WATCH-001",
      unitOfMeasure: "pcs",
      status: "active",
      categoryId: "cat-1",
      category: validCategory,
      stock: validStock,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    expect(entity.toJSON().name).toBe("Smart Watch");
    expect(entity.toJSON().sku).toBe("WATCH-001");
  });

  it("validates product status", () => {
    expect(() =>
      ProductEntity.create({
        id: "prod-1",
        name: "Smart Watch",
        sku: "WATCH-001",
        unitOfMeasure: "pcs",
        status: "pending" as any,
        categoryId: "cat-1",
        category: validCategory,
        stock: validStock,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
    ).toThrow("Product status is invalid");
  });

  it("validates product stock quantity cannot be negative", () => {
    expect(() =>
      ProductEntity.create({
        id: "prod-1",
        name: "Smart Watch",
        sku: "WATCH-001",
        unitOfMeasure: "pcs",
        status: "active",
        categoryId: "cat-1",
        category: validCategory,
        stock: { quantity: -5, updatedAt: new Date() },
        createdAt: new Date(),
        updatedAt: new Date(),
      })
    ).toThrow("Stock quantity cannot be negative");
  });

  it("validates product name is at least 3 characters", () => {
    expect(() => ProductName.create("ab")).toThrow("at least 3 characters");
  });

  it("validates product SKU is not empty", () => {
    expect(() => ProductSKU.create("")).toThrow("SKU is required");
  });

  it("validates product SKU alphanumeric constraints", () => {
    expect(() => ProductSKU.create("WATCH#001")).toThrow("SKU must be alphanumeric");
  });

  it("normalizes SKU value to uppercase", () => {
    const sku = ProductSKU.create("watch-001");
    expect(sku.toString()).toBe("WATCH-001");
  });

  it("covers custom error constructors", () => {
    const conflict = new ProductConflictError();
    expect(conflict.message).toBe("Product SKU already exists");
    expect(conflict.code).toBe("PRODUCT_SKU_CONFLICT");

    const infra = new ProductInfrastructureError();
    expect(infra.message).toBe("Product service is unavailable");
    expect(infra.code).toBe("PRODUCT_INFRASTRUCTURE_ERROR");
  });
});
