/**
 * The single error type the REST API layer is permitted to throw. Every
 * function in `src/api/**` must guarantee this — never let a raw `Error`,
 * `TypeError` (from a failed `fetch`), or `SyntaxError` (from malformed
 * JSON) escape uncaught, because every consumer of `useQuery<T, ApiError>`
 * is relying on that contract being literally true, not just usually true.
 *
 * `status` is `0` for failures that never reached the server (DNS failure,
 * offline, CORS rejection) — there is no HTTP status code to report, but
 * callers branching on `status` still get a single numeric field to check
 * rather than having to `instanceof`-narrow further.
 */
export class ApiError extends Error {
  readonly status: number;

  constructor(message: string, status: number, options?: ErrorOptions) {
    super(message, options);
    this.name = "ApiError";
    this.status = status;
  }

  get isNotFound(): boolean {
    return this.status === 404;
  }

  get isNetworkFailure(): boolean {
    return this.status === 0;
  }

  get isServerError(): boolean {
    return this.status >= 500;
  }

  /**
   * Normalizes any value caught at an API-layer boundary into an
   * `ApiError`. This is what makes `ApiError | null` an honest type
   * instead of an aspirational one — every `catch` block in `src/api/**`
   * should route through this rather than re-throwing or wrapping
   * ad hoc, so there's exactly one place that decides how unknown
   * failures get classified.
   */
  static fromUnknown(cause: unknown, fallbackStatus = 0): ApiError {
    if (cause instanceof ApiError) return cause;

    if (cause instanceof Error) {
      return new ApiError(cause.message, fallbackStatus, { cause });
    }

    return new ApiError("An unknown error occurred", fallbackStatus, {
      cause,
    });
  }
}
