const COORDINATE_PATTERN = /^(-?\d+)\/(-?\d+)\/(-?\d+)$/;

export function validateCoordinatesPayload(raw: string): void {
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch (error) {
    throw new Error(`Invalid coordinates JSON: ${(error as Error).message}`);
  }

  if (!Array.isArray(parsed) || parsed.length === 0) {
    throw new Error("The coordinates input must be a non-empty JSON array.");
  }

  for (const [index, entry] of parsed.entries()) {
    if (!entry || typeof entry !== "object") {
      throw new Error(`Coordinate item ${index + 1} must be an object.`);
    }
    const coordinate = (entry as { coordinate?: unknown }).coordinate;
    if (typeof coordinate !== "string" || !COORDINATE_PATTERN.test(coordinate.trim())) {
      throw new Error(`Coordinate item ${index + 1} must include a valid coordinate string in x/y/plane form.`);
    }
  }
}
