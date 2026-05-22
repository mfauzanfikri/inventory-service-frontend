export type Result<T, E> =
  | { ok: true; data: T }
  | { ok: false; error: E };

export function success<T>(data: T): Result<T, never> {
  return { ok: true, data };
}

export function failure<E>(error: E): Result<never, E> {
  return { ok: false, error };
}

export function isFailure<T, E>(result: Result<T, E>): result is { ok: false; error: E } {
  return !result.ok;
}
