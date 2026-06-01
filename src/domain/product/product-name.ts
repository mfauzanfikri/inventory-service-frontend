export class ProductName {
  private constructor(public readonly value: string) {
  }

  static create(raw: string): ProductName {
    const value = raw.trim() ?? '';

    if(value.length < 3) {
      throw new Error('Product name must be at least 3 characters');
    }

    return new ProductName(value);
  }

  toString(): string {
    return this.value;
  }
}