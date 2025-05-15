export function validateQuery(query: string): void {
  if (!query || query.length < 2) {
    const error = new Error("Query must be at least 2 characters long.");
    (error as any).status = 400;
    throw error;
  }
}
