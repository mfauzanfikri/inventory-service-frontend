import { createProductService } from "../product.service";
import { Product, ProductCreateInput, ProductUpdateInput } from "@/types/product";

describe("ProductService", () => {
  const mockRepository = {
    findAll: jest.fn(),
    getById: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    adjustStock: jest.fn(),
  };

  const service = createProductService(mockRepository);

  const mockCategory = {
    id: "cat-1",
    name: "Electronics",
    description: "Gadgets",
    status: "active" as const,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const mockProduct: Product = {
    id: "prod-1",
    name: "Smart Watch",
    sku: "WATCH-001",
    unitOfMeasure: "pcs",
    status: "active" as const,
    categoryId: "cat-1",
    category: mockCategory,
    stock: {
      quantity: 10,
      updatedAt: new Date(),
    },
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("returns list of products from repository", async () => {
    mockRepository.findAll.mockResolvedValue([mockProduct]);

    const result = await service.list();

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.data).toHaveLength(1);
      expect(result.data[0].name).toBe("Smart Watch");
    }
  });

  it("creates product successfully with valid inputs", async () => {
    mockRepository.create.mockResolvedValue(mockProduct);

    const result = await service.create({
      name: "Smart Watch",
      sku: "WATCH-001",
      unitOfMeasure: "pcs",
      categoryId: "cat-1",
      initialStock: 10,
      status: "active",
    });

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.data.sku).toBe("WATCH-001");
    }
  });

  it("fails product creation during pre-save checks if name is invalid", async () => {
    const result = await service.create({
      name: "ab", // invalid length
      sku: "WATCH-001",
      unitOfMeasure: "pcs",
      categoryId: "cat-1",
      initialStock: 10,
      status: "active",
    });

    expect(result.ok).toBe(false);
    expect(mockRepository.create).not.toHaveBeenCalled();
    if (!result.ok) {
      expect(result.error.code).toBe("UNKNOWN_ERROR");
    }
  });

  it("returns conflict error for unique SKU conflict from repository", async () => {
    const error = new Error("Conflict") as Error & { status?: number; code?: string };
    error.status = 409;
    error.code = "CONFLICT";
    mockRepository.create.mockRejectedValue(error);

    const result = await service.create({
      name: "Smart Watch",
      sku: "WATCH-001",
      unitOfMeasure: "pcs",
      categoryId: "cat-1",
      initialStock: 10,
      status: "active",
    });

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error.code).toBe("CONFLICT");
      expect(result.error.field).toBe("sku");
    }
  });

  it("updates product successfully", async () => {
    const updatedProduct = { ...mockProduct, name: "New Name" };
    mockRepository.update.mockResolvedValue(updatedProduct);

    const result = await service.update("prod-1", { name: "New Name" });

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.data.name).toBe("New Name");
    }
  });

  it("returns not found error when updating missing product", async () => {
    mockRepository.update.mockResolvedValue(null);

    const result = await service.update("missing-id", { name: "New Name" });

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error.code).toBe("NOT_FOUND");
    }
  });

  it("deletes product successfully", async () => {
    mockRepository.delete.mockResolvedValue(mockProduct);

    const result = await service.delete("prod-1");

    expect(result.ok).toBe(true);
  });

  it("adjusts stock successfully for increments", async () => {
    const incrementedProduct = {
      ...mockProduct,
      stock: { quantity: 15, updatedAt: new Date() },
    };
    mockRepository.adjustStock.mockResolvedValue(incrementedProduct);

    const result = await service.adjustStock("prod-1", "increase", 5);

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.data.stock.quantity).toBe(15);
    }
    expect(mockRepository.adjustStock).toHaveBeenCalledWith("prod-1", "increase", 5);
  });

  it("returns validation error for negative adjustment values", async () => {
    const result = await service.adjustStock("prod-1", "increase", -5);

    expect(result.ok).toBe(false);
    expect(mockRepository.adjustStock).not.toHaveBeenCalled();
    if (!result.ok) {
      expect(result.error.code).toBe("VALIDATION_ERROR");
      expect(result.error.field).toBe("amount");
    }
  });

  it("handles and maps concurrent stock decrement rejections correctly", async () => {
    const error = new Error("Insufficient stock levels") as Error & { status?: number };
    error.status = 400;
    mockRepository.adjustStock.mockRejectedValue(error);

    const result = await service.adjustStock("prod-1", "decrease", 15);

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error.code).toBe("VALIDATION_ERROR");
      expect(result.error.field).toBe("quantity");
      expect(result.error.message).toContain("Insufficient stock");
    }
  });
});
