export class ProductSKU {
  private constructor(private readonly value: string) {}

  static create(raw: string): ProductSKU {
    const value = raw?.trim().toUpperCase() ?? "";

    if (!value) {
      throw new Error("SKU is required");
    }

    // Restrict SKU format to alphanumeric, hyphens, and underscores
    const skuRegex = /^[A-Z0-9-_]+$/;
    if (!skuRegex.test(value)) {
      throw new Error("SKU must be alphanumeric (hyphens and underscores allowed)");
    }

    return new ProductSKU(value);
  }

  toString(): string {
    return this.value;
  }
}