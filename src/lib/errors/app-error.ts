export type AppErrorCode =
  | "VALIDATION_ERROR"
  | "CONFLICT"
  | "NOT_FOUND"
  | "INFRASTRUCTURE_ERROR"
  | "UNKNOWN_ERROR";

export type AppErrorCategory = "domain" | "application" | "infrastructure" | "unknown";

export type AppError = {
  code: AppErrorCode;
  message: string;
  category: AppErrorCategory;
  field?: string;
  retryable?: boolean;
  details?: Record<string, unknown>;
};

export function getErrorCode(error: unknown): string | undefined {
  if(typeof error === "object" && error !== null && "code" in error) {
    const code = (error as { code?: unknown }).code;
    if(typeof code === "string") {
      return code;
    }
  }

  return undefined;
}

export function unknownError(message = "Something went wrong. Please try again."): AppError {
  return {
    code: "UNKNOWN_ERROR",
    message,
    category: "unknown",
    retryable: true,
  };
}

export function infrastructureError(message = "Service is currently unavailable."): AppError {
  return {
    code: "INFRASTRUCTURE_ERROR",
    message,
    category: "infrastructure",
    retryable: true,
  };
}
