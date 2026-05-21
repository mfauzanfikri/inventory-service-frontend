import { createMockCategoryRepository } from "../category.mock.repository";

describe("MockCategoryRepository", () => {
  const repository = createMockCategoryRepository();

  it("should return a category when findByName matches", async () => {
    const category = await repository.findByName("Electronics");

    expect(category).not.toBeNull();
    expect(category?.name).toBe("Electronics");
  });

  it("should return null when findByName has no match", async () => {
    const category = await repository.findByName("Missing Category");

    expect(category).toBeNull();
  });

  it("should return null when update target does not exist", async () => {
    const category = await repository.update("missing-id", { name: "Updated" });

    expect(category).toBeNull();
  });

  it("should return null when delete target does not exist", async () => {
    const category = await repository.delete("missing-id");

    expect(category).toBeNull();
  });
});
