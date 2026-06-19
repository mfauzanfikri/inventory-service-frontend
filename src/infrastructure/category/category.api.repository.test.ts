import { categoryRepository } from "./category.api.repository";

describe("categoryRepository", () => {
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

    const data = await categoryRepository.findAll();

    expect(data).toHaveLength(1);
    expect(data[0].name).toBe("Electronics");
  });

  it("falls back to raw payload if response is not standard envelope-based", async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => [{ id: "1", name: "Electronics Legacy", description: "Devices", status: "active" }],
    }) as unknown as typeof fetch;

    const data = await categoryRepository.findAll();

    expect(data).toHaveLength(1);
    expect(data[0].name).toBe("Electronics Legacy");
  });

  it("handles JSON parsing error on non-ok response status", async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: false,
      status: 500,
      statusText: "Internal Server Error",
      json: async () => {
        throw new Error("Invalid JSON");
      },
    }) as unknown as typeof fetch;

    await expect(categoryRepository.findAll()).rejects.toMatchObject({
      status: 500,
      message: "Internal Server Error",
    });
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

    await expect(
      categoryRepository.create({
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

  it("swallows HTTP 404 and returns null for findByName", async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: false,
      status: 404,
      statusText: "Not Found",
      json: async () => ({
        success: false,
        code: "NOT_FOUND",
        message: "Category not found",
      }),
    }) as unknown as typeof fetch;

    const result = await categoryRepository.findByName("Missing");

    expect(result).toBeNull();
  });

  it("swallows HTTP 404 and returns null for update", async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: false,
      status: 404,
      statusText: "Not Found",
      json: async () => ({
        success: false,
        code: "NOT_FOUND",
        message: "Category not found",
      }),
    }) as unknown as typeof fetch;

    const result = await categoryRepository.update("missing-id", { name: "Update" });

    expect(result).toBeNull();
  });

  it("rethrows non-404 errors in findByName and update", async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: false,
      status: 500,
      statusText: "Internal Error",
      json: async () => ({
        success: false,
        message: "Database failed",
      }),
    }) as unknown as typeof fetch;

    await expect(categoryRepository.findByName("ErrorName")).rejects.toMatchObject({ status: 500 });
    await expect(categoryRepository.update("id", { name: "Error" })).rejects.toMatchObject({ status: 500 });
  });

  it("resolves array message inside request error handling", async () => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: false,
      status: 400,
      statusText: "Bad Request",
      json: async () => ({
        message: ["Name is required", "Description should be string"],
      }),
    }) as unknown as typeof fetch;

    await expect(categoryRepository.findAll()).rejects.toMatchObject({
      status: 400,
      message: "Name is required",
    });
  });
});
