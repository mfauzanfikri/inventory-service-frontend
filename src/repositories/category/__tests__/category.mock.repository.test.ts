import { createMockCategoryRepository } from "../category.mock.repository";

function uniqueName(prefix: string): string {
  return `${prefix}-${Date.now()}-${Math.floor(Math.random() * 100000)}`;
}

describe("MockCategoryRepository", () => {
  const repository = createMockCategoryRepository();

  it("should return categories from findAll", async () => {
    const categories = await repository.findAll();

    expect(Array.isArray(categories)).toBe(true);
    expect(categories.length).toBeGreaterThan(0);
  });

  it("should return a category when findByName matches", async () => {
    const category = await repository.findByName("Electronics");

    expect(category).not.toBeNull();
    expect(category?.name).toBe("Electronics");
  });

  it("should return null when findByName has no match", async () => {
    const category = await repository.findByName(uniqueName("Missing Category"));

    expect(category).toBeNull();
  });

  it("should create a category", async () => {
    const name = uniqueName("Repo Create");

    const created = await repository.create({
      name,
      description: "Created in repository test",
      status: "active",
    });

    expect(created.name).toBe(name);
    expect(created.description).toBe("Created in repository test");
    expect(created.status).toBe("active");

    const found = await repository.findByName(name);
    expect(found).not.toBeNull();
    expect(found?.id).toBe(created.id);

    await repository.delete(created.id);
  });

  it("should throw conflict error when create name already exists", async () => {
    await expect(
      repository.create({
        name: "Electronics",
        description: "Duplicate",
        status: "active",
      })
    ).rejects.toMatchObject({ status: 409 });
  });

  it("should update a category when target exists", async () => {
    const name = uniqueName("Repo Update Source");
    const created = await repository.create({
      name,
      description: "Before update",
      status: "active",
    });

    const updated = await repository.update(created.id, {
      name: uniqueName("Repo Updated"),
      description: "After update",
      status: "inactive",
    });

    expect(updated).not.toBeNull();
    expect(updated?.id).toBe(created.id);
    expect(updated?.description).toBe("After update");
    expect(updated?.status).toBe("inactive");

    await repository.delete(created.id);
  });

  it("should throw conflict error when update name already exists", async () => {
    const source = await repository.create({
      name: uniqueName("Repo Conflict Source"),
      description: "Source",
      status: "active",
    });

    try {
      await expect(
        repository.update(source.id, { name: "Electronics" })
      ).rejects.toMatchObject({ status: 409 });
    } finally {
      await repository.delete(source.id);
    }
  });

  it("should return null when update target does not exist", async () => {
    const category = await repository.update("missing-id", { name: "Updated" });

    expect(category).toBeNull();
  });

  it("should delete a category when target exists", async () => {
    const created = await repository.create({
      name: uniqueName("Repo Delete"),
      description: "To be deleted",
      status: "active",
    });

    const deleted = await repository.delete(created.id);

    expect(deleted).not.toBeNull();
    expect(deleted?.id).toBe(created.id);

    const found = await repository.findByName(created.name);
    expect(found).toBeNull();
  });

  it("should return null when delete target does not exist", async () => {
    const category = await repository.delete("missing-id");

    expect(category).toBeNull();
  });
});
