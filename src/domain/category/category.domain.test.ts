import { CategoryEntity } from "./category.entity";
import { CategoryName } from "./category-name";
import { CategoryDescription } from "./category-description";
import { CategoryConflictError, CategoryInfrastructureError } from "./category.errors";

describe("Category domain", () => {
  it("creates valid category entity", () => {
    const entity = CategoryEntity.create({
      id: "category-1",
      name: "Electronics",
      description: "Devices",
      status: "active",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    expect(entity.toJSON().name).toBe("Electronics");
  });

  it("validates category status", () => {
    expect(() =>
      CategoryEntity.create({
        id: "category-1",
        name: "Electronics",
        description: "Devices",
        status: "pending" as any,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      })
    ).toThrow("Category status is invalid");
  });

  it("validates category name", () => {
    expect(() => CategoryName.create("ab")).toThrow("at least 3");
  });

  it("validates category description", () => {
    expect(() => CategoryDescription.create(" ")).toThrow("required");
  });

  it("covers custom error constructors", () => {
    const conflict = new CategoryConflictError();
    expect(conflict.message).toBe("Category name already exists");
    expect(conflict.code).toBe("CATEGORY_NAME_CONFLICT");

    const infra = new CategoryInfrastructureError();
    expect(infra.message).toBe("Category service is unavailable");
    expect(infra.code).toBe("CATEGORY_INFRASTRUCTURE_ERROR");
  });
});
