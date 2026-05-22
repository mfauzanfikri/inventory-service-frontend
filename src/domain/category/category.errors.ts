export class CategoryConflictError extends Error {
  readonly code = "CATEGORY_NAME_CONFLICT";

  constructor(message = "Category name already exists") {
    super(message);
    this.name = "CategoryConflictError";
  }
}

export class CategoryInfrastructureError extends Error {
  readonly code = "CATEGORY_INFRASTRUCTURE_ERROR";

  constructor(message = "Category service is unavailable") {
    super(message);
    this.name = "CategoryInfrastructureError";
  }
}
