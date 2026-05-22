export class CategoryDescription {
  private constructor(private readonly value: string) {}

  static create(raw: string): CategoryDescription {
    const value = raw.trim();

    if(value.length === 0) {
      throw new Error("Category description is required");
    }

    return new CategoryDescription(value);
  }

  toString(): string {
    return this.value;
  }
}
