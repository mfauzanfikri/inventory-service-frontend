import { createApiCategoryRepository } from "./category.api.repository";

describe("createApiCategoryRepository", () => {
  const originalFetch = global.fetch;

  afterEach(() => {
    global.fetch = originalFetch;
    jest.restoreAllMocks();
  });

  it("parses success envelope and returns data", async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({
        success: true,
        message: "Categories retrieved successfully",
        data: [{ id: "1", name: "Electronics", description: "Devices", status: "active" }],
      }),
    }) as unknown as typeof fetch;

    const repository = createApiCategoryRepository();
    const data = await repository.findAll();

    expect(data).toHaveLength(1);
    expect(data[0].name).toBe("Electronics");
  });

  it("throws normalized error from failure envelope", async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: false,
      status: 409,
      statusText: "Conflict",
      json: async () => ({
        success: false,
        code: "CONFLICT",
        message: "Category already exists",
        errors: { name: ["already exists"] },
        meta: { timestamp: new Date().toISOString(), path: "/categories" },
      }),
    }) as unknown as typeof fetch;

    const repository = createApiCategoryRepository();

    await expect(
      repository.create({
        name: "Electronics",
        description: "Duplicate",
        status: "active",
      }),
    ).rejects.toMatchObject({
      status: 409,
      code: "CONFLICT",
      message: "Category already exists",
      details: { name: ["already exists"] },
    });
  });
});
