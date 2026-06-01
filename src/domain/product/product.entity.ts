import { Product } from "@/types/product";
import { ProductName } from "./product-name";
import { ProductSKU } from "./product-sku";

export class ProductEntity {
  private constructor(private readonly props: Product) {}

  static create(props: Product): ProductEntity {
    ProductName.create(props.name);
    ProductSKU.create(props.sku);

    if (props.status !== "active" && props.status !== "inactive") {
      throw new Error("Product status is invalid");
    }

    if (props.stock && props.stock.quantity < 0) {
      throw new Error("Stock quantity cannot be negative");
    }

    return new ProductEntity(props);
  }

  toJSON(): Product {
    return { ...this.props };
  }
}