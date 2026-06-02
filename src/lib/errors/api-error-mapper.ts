import { AppError, getErrorCode, infrastructureError, unknownError } from "./app-error";

export interface ApiErrorMapperConfig {
  conflictField?: string;
  defaultConflictMessage?: string;
  defaultNotFoundMessage?: string;
  customMapper?: (context: {
    code?: string;
    status?: unknown;
    message?: unknown;
    details?: unknown;
  }) => AppError | undefined;
}

export function mapApiError(error: unknown, config: ApiErrorMapperConfig = {}): AppError {
  const code = getErrorCode(error);
  const status =
    typeof error === "object" && error !== null && "status" in error
      ? (error as { status?: unknown }).status
      : undefined;
  const message =
    typeof error === "object" && error !== null && "message" in error
      ? (error as { message?: unknown }).message
      : undefined;
  const details =
    typeof error === "object" && error !== null && "details" in error
      ? (error as { details?: unknown }).details
      : undefined;

  if (config.customMapper) {
    const customResult = config.customMapper({ code, status, message, details });
    if (customResult) return customResult;
  }

  // Handle local validation/domain Error instances (e.g. from Value Objects)
  if (error instanceof Error && !code && !status) {
    const localMessage = error.message;
    let field: string | undefined = undefined;

    if (localMessage.toLowerCase().includes("sku")) field = "sku";
    else if (localMessage.toLowerCase().includes("name")) field = "name";
    else if (localMessage.toLowerCase().includes("status")) field = "status";
    else if (localMessage.toLowerCase().includes("stock") || localMessage.toLowerCase().includes("quantity")) field = "quantity";

    return {
      code: "VALIDATION_ERROR",
      message: localMessage,
      category: "domain",
      field,
    };
  }

  if (
    code === "CONFLICT" ||
    code === "CATEGORY_NAME_CONFLICT" ||
    code === "PRODUCT_SKU_CONFLICT" ||
    status === 409
  ) {
    return {
      code: "CONFLICT",
      message: typeof message === "string" && message.length > 0 ? message : (config.defaultConflictMessage ?? "Conflict occurred"),
      category: "domain",
      field: config.conflictField,
    };
  }

  if (code === "NOT_FOUND" || status === 404) {
    return {
      code: "NOT_FOUND",
      message: typeof message === "string" && message.length > 0 ? message : (config.defaultNotFoundMessage ?? "Resource not found"),
      category: "domain",
    };
  }

  if (code === "INFRASTRUCTURE" || code === "INFRASTRUCTURE_ERROR") {
    return infrastructureError(typeof message === "string" && message.length > 0 ? message : undefined);
  }

  if (code === "VALIDATION_ERROR" || status === 400) {
    const field =
      typeof details === "object" &&
      details !== null &&
      !Array.isArray(details)
        ? Object.keys(details as Record<string, unknown>)[0]
        : undefined;

    return {
      code: "VALIDATION_ERROR",
      message: typeof message === "string" && message.length > 0 ? message : "Validation failed",
      category: "application",
      field,
    };
  }

  if (status === 500 || status === 502 || status === 503 || status === 504) {
    return infrastructureError(typeof message === "string" && message.length > 0 ? message : undefined);
  }

  return unknownError();
}
