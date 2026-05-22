import { CategoryEntity } from "./category.entity";
import { CategoryName } from "./category-name";
import { CategoryDescription } from "./category-description";

describe("Category domain", () => {
  it("creates valid category entity", () => {
    const entity = CategoryEntity.create({
      id: "category-1",
      name: "Electronics",
      description: "Devices",
      status: "active",
    });

    expect(entity.toJSON().name).toBe("Electronics");
  });

  it("validates category name", () => {
    expect(() => CategoryName.create("ab")).toThrow("at least 3");
  });

  it("validates category description", () => {
    expect(() => CategoryDescription.create(" ")).toThrow("required");
  });
});
