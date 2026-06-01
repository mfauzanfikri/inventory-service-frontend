export class CategoryDescription {
  private constructor(private readonly value: string) {}

  static create(raw?: string): CategoryDescription {
    const value = (raw ?? "").trim();
    return new CategoryDescription(value);
  }

  toString(): string {
    return this.value;
  }
}
