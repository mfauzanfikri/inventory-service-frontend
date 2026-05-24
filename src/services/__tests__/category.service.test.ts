import { createCategoryService } from "../category.service";
import { CategoryCreateInput, CategoryUpdateInput } from "@/types/category";

describe("CategoryService", () => {
  const mockRepository = {
    findAll: jest.fn(),
    findByName: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  const service = createCategoryService(mockRepository);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("returns list from repository", async () => {
    const mockData = [{ id: "1", name: "Mock Cat", description: "Desc", status: "active" as const }];
    mockRepository.findAll.mockResolvedValue(mockData);

    const result = await service.list();

    expect(result.ok).toBe(true);
    if(result.ok) {
      expect(result.data).toEqual(mockData);
    }
  });

  it("creates category successfully", async () => {
    const mockData = { id: "1", name: "Electronics", description: "Devices", status: "active" as const };
    mockRepository.create.mockResolvedValue(mockData);

    const result = await service.create({
      name: "Electronics",
      description: "Devices",
      status: "active",
    });

    expect(result.ok).toBe(true);
    if(result.ok) {
      expect(result.data).toEqual(mockData);
    }
  });

  it("returns conflict result for duplicate create", async () => {
    const conflict = new Error("duplicate");
    (conflict as Error & { status?: number }).status = 409;
    mockRepository.create.mockRejectedValue(conflict);

    const result = await service.create({
      name: "Electronics",
      description: "Duplicate",
      status: "active",
    });

    expect(result.ok).toBe(false);
    if(!result.ok) {
      expect(result.error.code).toBe("CONFLICT");
      expect(result.error.field).toBe("name");
    }
  });

  it("updates category successfully", async () => {
    const mockData = { id: "1", name: "Electronics", description: "Devices", status: "inactive" as const };
    mockRepository.update.mockResolvedValue(mockData);

    const result = await service.update("1", {
      name: "Electronics",
      description: "Devices",
      status: "inactive",
    });

    expect(result.ok).toBe(true);
    if(result.ok) {
      expect(result.data).toEqual(mockData);
    }
  });

  it("returns not found result when update target is missing", async () => {
    mockRepository.update.mockResolvedValue(null);

    const result = await service.update("missing-id", { name: "Updated Name" });

    expect(result.ok).toBe(false);
    if(!result.ok) {
      expect(result.error.code).toBe("NOT_FOUND");
    }
  });

  it("maps repository HTTP 404 error to NOT_FOUND result", async () => {
    const error = new Error("Category not found") as Error & { status?: number; code?: string };
    error.status = 404;
    error.code = "NOT_FOUND";
    mockRepository.create.mockRejectedValue(error);

    const result = await service.create({
      name: "Electronics",
      description: "Devices",
      status: "active",
    });

    expect(result.ok).toBe(false);
    if(!result.ok) {
      expect(result.error.code).toBe("NOT_FOUND");
      expect(result.error.message).toContain("not found");
    }
  });

  it("returns success when deleting existing category", async () => {
    mockRepository.delete.mockResolvedValue({
      id: "target-id",
      name: "Deleted",
      description: "Deleted",
      status: "active",
    });

    const result = await service.delete("target-id");

    expect(result.ok).toBe(true);
  });

  it("returns not found result when delete target is missing", async () => {
    mockRepository.delete.mockResolvedValue(null);

    const result = await service.delete("missing-id");

    expect(result.ok).toBe(false);
    if(!result.ok) {
      expect(result.error.code).toBe("NOT_FOUND");
    }
  });

  it("returns infrastructure error when delete fails", async () => {
    const error = new Error("Connection failed") as Error & { status?: number };
    error.status = 500;
    mockRepository.delete.mockRejectedValue(error);

    const result = await service.delete("target-id");

    expect(result.ok).toBe(false);
    if(!result.ok) {
      expect(result.error.code).toBe("INFRASTRUCTURE_ERROR");
    }
  });

  it("maps repository HTTP 503 error to INFRASTRUCTURE_ERROR", async () => {
    const error = new Error("Service unavailable") as Error & { status?: number };
    error.status = 503;
    mockRepository.findAll.mockRejectedValue(error);

    const result = await service.list();

    expect(result.ok).toBe(false);
    if(!result.ok) {
      expect(result.error.code).toBe("INFRASTRUCTURE_ERROR");
    }
  });

  it("maps repository VALIDATION_ERROR to app validation result", async () => {
    const error = new Error("Validation failed") as Error & { code?: string; details?: unknown };
    error.code = "VALIDATION_ERROR";
    error.details = { name: ["name should not be empty"] };
    mockRepository.create.mockRejectedValue(error);

    const result = await service.create({
      name: "Electronics",
      description: "Devices",
      status: "active",
    });

    expect(result.ok).toBe(false);
    if(!result.ok) {
      expect(result.error.code).toBe("VALIDATION_ERROR");
      expect(result.error.field).toBe("name");
    }
  });

  it("maps repository VALIDATION_ERROR with null details correctly", async () => {
    const error = new Error("Validation failed") as Error & { code?: string; details?: unknown };
    error.code = "VALIDATION_ERROR";
    error.details = null;
    mockRepository.create.mockRejectedValue(error);

    const result = await service.create({
      name: "Electronics",
      description: "Devices",
      status: "active",
    });

    expect(result.ok).toBe(false);
    if(!result.ok) {
      expect(result.error.code).toBe("VALIDATION_ERROR");
      expect(result.error.field).toBeUndefined();
    }
  });

  it("gets category by name successfully", async () => {
    const mockData = { id: "1", name: "Electronics", description: "Devices", status: "active" as const };
    mockRepository.findByName.mockResolvedValue(mockData);

    const result = await service.getByName("Electronics");

    expect(result.ok).toBe(true);
    if(result.ok) {
      expect(result.data).toEqual(mockData);
    }
  });

  it("returns not found for getByName when category missing", async () => {
    mockRepository.findByName.mockResolvedValue(null);

    const result = await service.getByName("Missing");

    expect(result.ok).toBe(false);
    if(!result.ok) {
      expect(result.error.code).toBe("NOT_FOUND");
    }
  });

  it("maps generic error to unknownError inside mapCategoryError", async () => {
    const error = "some random string error";
    mockRepository.findAll.mockRejectedValue(error);

    const result = await service.list();

    expect(result.ok).toBe(false);
    if(!result.ok) {
      expect(result.error.code).toBe("UNKNOWN_ERROR");
    }
  });
});
