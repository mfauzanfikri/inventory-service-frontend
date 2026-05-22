import { CategoryDomainRepository } from "@/domain/category";
import { Category, CategoryCreateInput, CategoryUpdateInput } from "@/types/category";

type HttpRepositoryError = Error & {
  status?: number;
  code?: string;
  details?: unknown;
};

function createHttpRepositoryError(
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
    "http://localhost:3000"
  );
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${resolveBaseUrl()}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
    cache: "no-store",
  });

  if(response.ok) {
    if(response.status === 204) {
      return undefined as T;
    }

    return (await response.json()) as T;
  }

  let payload: { message?: unknown; error?: unknown } | undefined;
  try {
    payload = (await response.json()) as { message?: unknown; error?: unknown };
  } catch {
    payload = undefined;
  }

  const message =
    (typeof payload?.message === "string" && payload.message) ||
    (Array.isArray(payload?.message) ? String(payload?.message[0]) : undefined) ||
    response.statusText ||
    "Request failed";

  const code =
    response.status === 404
      ? "NOT_FOUND"
      : response.status === 409
        ? "CONFLICT"
        : undefined;

  throw createHttpRepositoryError(message, response.status, code, payload);
}

export function createHttpCategoryRepository(): CategoryDomainRepository {
  return {
    async findAll(): Promise<Category[]> {
      return request<Category[]>("/categories");
    },

    async findByName(name: string): Promise<Category | null> {
      try {
        return await request<Category>(`/categories/name/${encodeURIComponent(name)}`);
      } catch(error: unknown) {
        if(typeof error === "object" && error !== null && "status" in error && (error as { status?: number }).status === 404) {
          return null;
        }

        throw error;
      }
    },

    async create(data: CategoryCreateInput): Promise<Category> {
      return request<Category>("/categories", {
        method: "POST",
        body: JSON.stringify(data),
      });
    },

    async update(id: string, data: CategoryUpdateInput): Promise<Category | null> {
      try {
        return await request<Category>(`/categories/${id}`, {
          method: "PATCH",
          body: JSON.stringify(data),
        });
      } catch(error: unknown) {
        if(typeof error === "object" && error !== null && "status" in error && (error as { status?: number }).status === 404) {
          return null;
        }

        throw error;
      }
    },

    async delete(id: string): Promise<Category | null> {
      try {
        await request<void>(`/categories/${id}`, {
          method: "DELETE",
        });

        return { id, name: "", description: "", status: "active" };
      } catch(error: unknown) {
        if(typeof error === "object" && error !== null && "status" in error && (error as { status?: number }).status === 404) {
          return null;
        }

        throw error;
      }
    },
  };
}
