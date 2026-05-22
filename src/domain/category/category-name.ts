export class CategoryName {
  private constructor(private readonly value: string) {}

  static create(raw: string): CategoryName {
    const value = raw.trim();

    if(value.length < 3) {
      throw new Error("Category name must be at least 3 characters");
    }

    return new CategoryName(value);
  }

  toString(): string {
    return this.value;
  }
}
