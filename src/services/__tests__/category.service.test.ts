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

  it("returns not found result when update target is missing", async () => {
    mockRepository.update.mockResolvedValue(null);

    const result = await service.update("missing-id", { name: "Updated Name" });

    expect(result.ok).toBe(false);
    if(!result.ok) {
      expect(result.error.code).toBe("NOT_FOUND");
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
});
