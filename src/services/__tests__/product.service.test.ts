import { productService } from "../product.service";
import { productRepository } from "@/infrastructure/product/product.api.repository";
import { Product } from "@/types/product";

jest.mock("@/infrastructure/product/product.api.repository", () => ({
  productRepository: {
    findAll: jest.fn(),
    getById: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    adjustStock: jest.fn(),
  },
}));

const mockRepository = productRepository as jest.Mocked<typeof productRepository>;

describe("ProductService", () => {
  const mockCategory = {
    id: "cat-1",
    name: "Electronics",
    description: "Gadgets",
    status: "active" as const,
    version: 1,
    createdAt: new Date().toISOString(),
    createdBy: "",
    updatedAt: new Date().toISOString(),
    updatedBy: "",
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
      version: 1,
      updatedAt: new Date(),
      updatedBy: "",
    },
    version: 1,
    createdAt: new Date(),
    createdBy: "",
    updatedAt: new Date(),
    updatedBy: "",
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("returns list of products from repository", async () => {
    mockRepository.findAll.mockResolvedValue([mockProduct]);

    const result = await productService.list();

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.data).toHaveLength(1);
      expect(result.data[0].name).toBe("Smart Watch");
    }
  });

  it("creates product successfully with valid inputs", async () => {
    mockRepository.create.mockResolvedValue(mockProduct);

    const result = await productService.create({
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
    const result = await productService.create({
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
      expect(result.error.code).toBe("VALIDATION_ERROR");
      expect(result.error.field).toBe("name");
    }
  });

  it("returns conflict error for unique SKU conflict from repository", async () => {
    const error = new Error("Conflict") as Error & { status?: number; code?: string };
    error.status = 409;
    error.code = "CONFLICT";
    mockRepository.create.mockRejectedValue(error);

    const result = await productService.create({
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

    const result = await productService.update("prod-1", { name: "New Name" });

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.data.name).toBe("New Name");
    }
  });

  it("returns not found error when updating missing product", async () => {
    mockRepository.update.mockResolvedValue(null);

    const result = await productService.update("missing-id", { name: "New Name" });

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error.code).toBe("NOT_FOUND");
    }
  });

  it("adjusts stock successfully for increments", async () => {
    const incrementedProduct = {
      ...mockProduct,
      stock: { quantity: 15, version: 2, updatedAt: new Date(), updatedBy: "" },
    };
    mockRepository.adjustStock.mockResolvedValue(incrementedProduct);

    const result = await productService.adjustStock("prod-1", "increase", 5);

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.data.stock.quantity).toBe(15);
    }
    expect(mockRepository.adjustStock).toHaveBeenCalledWith("prod-1", "increase", 5);
  });

  it("returns validation error for negative adjustment values", async () => {
    const result = await productService.adjustStock("prod-1", "increase", -5);

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

    const result = await productService.adjustStock("prod-1", "decrease", 15);

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error.code).toBe("VALIDATION_ERROR");
      expect(result.error.field).toBe("quantity");
      expect(result.error.message).toContain("Insufficient stock");
    }
  });
});
