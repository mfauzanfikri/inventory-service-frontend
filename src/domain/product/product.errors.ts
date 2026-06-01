export class ProductConflictError extends Error {
  readonly code = "PRODUCT_SKU_CONFLICT";

  constructor(message = "Product SKU already exists") {
    super(message);
    this.name = "ProductConflictError";
  }
}

export class ProductInfrastructureError extends Error {
  readonly code = "PRODUCT_INFRASTRUCTURE_ERROR";

  constructor(message = "Product service is unavailable") {
    super(message);
    this.name = "ProductInfrastructureError";
  }
}