export function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }

  if (typeof error === "string" || typeof error === "number") {
    return String(error);
  }

  return "An unknown error occurred";
}
