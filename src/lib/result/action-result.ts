import { AppError } from "@/lib/errors/app-error";

export type ActionResult<T> =
  | { ok: true; data: T }
  | { ok: false; error: AppError };
