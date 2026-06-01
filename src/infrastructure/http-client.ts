export type ApiSuccess<T> = {
  success: true;
  message: string;
  data: T;
};

export type ApiFailure = {
  success: false;
  code?: string;
  message?: string;
  errors?: Record<string, string[]>;
  meta?: {
    timestamp: string;
    path: string;
  };
};

export type HttpRepositoryError = Error & {
  status?: number;
  code?: string;
  details?: unknown;
};

export function createHttpRepositoryError(
  message: string,
  status?: number,
  code?: string,
  details?: unknown
): HttpRepositoryError {
  const error = new Error(message) as HttpRepositoryError;
  error.status = status;
  error.code = code;
  error.details = details;
  return error;
}

function resolveBaseUrl(): string {
  return (
    process.env.BACKEND_API_URL ??
    process.env.NEXT_PUBLIC_BACKEND_API_URL ??
    "http://localhost:3001"
  );
}

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function isApiSuccess<T>(value: unknown): value is ApiSuccess<T> {
  return (
    isObject(value) &&
    value.success === true &&
    "data" in value
  );
}

function isApiFailure(value: unknown): value is ApiFailure {
  return isObject(value) && value.success === false;
}

export async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${resolveBaseUrl()}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
    cache: "no-store",
  });

  if (response.ok) {
    if (response.status === 204) {
      return undefined as T;
    }

    const payload = (await response.json()) as unknown;
    if (isApiSuccess<T>(payload)) {
      return payload.data;
    }

    // Backward-safe fallback if endpoint is not yet envelope-based.
    return payload as T;
  }

  let payload: unknown;
  try {
    payload = (await response.json()) as unknown;
  } catch {
    payload = undefined;
  }

  const failurePayload = isApiFailure(payload) ? payload : undefined;
  const payloadAsRecord = isObject(payload) ? payload : undefined;

  const message =
    (typeof failurePayload?.message === "string" && failurePayload.message) ||
    (typeof payloadAsRecord?.message === "string" && payloadAsRecord.message) ||
    (Array.isArray(payloadAsRecord?.message) ? String(payloadAsRecord.message[0]) : undefined) ||
    response.statusText ||
    "Request failed";

  const code =
    (typeof failurePayload?.code === "string" && failurePayload.code) ||
    (response.status === 404
      ? "NOT_FOUND"
      : response.status === 409
        ? "CONFLICT"
        : undefined);

  throw createHttpRepositoryError(
    message,
    response.status,
    code,
    failurePayload?.errors ?? payload,
  );
}
