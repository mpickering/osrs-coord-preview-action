import fs from "node:fs/promises";
import path from "node:path";
const COORDINATE_PATTERN = /^(-?\d+)\/(-?\d+)\/(-?\d+)$/;
export async function resolveCoordinatesPayload(options) {
    const coordinatesRaw = options.coordinatesRaw?.trim();
    const coordinatesFile = options.coordinatesFile?.trim();
    if (coordinatesRaw) {
        return coordinatesRaw;
    }
    if (!coordinatesFile) {
        throw new Error("One of the inputs 'coordinates' or 'coordinates-file' must be provided.");
    }
    const filePath = path.resolve(process.cwd(), coordinatesFile);
    let fileContents;
    try {
        fileContents = await fs.readFile(filePath, "utf8");
    }
    catch (error) {
        throw new Error(`Failed to read coordinates file '${coordinatesFile}': ${error.message}`);
    }
    const trimmed = fileContents.trim();
    if (!trimmed) {
        throw new Error(`Coordinates file '${coordinatesFile}' is empty.`);
    }
    return trimmed;
}
export function validateCoordinatesPayload(raw) {
    let parsed;
    try {
        parsed = JSON.parse(raw);
    }
    catch (error) {
        throw new Error(`Invalid coordinates JSON: ${error.message}`);
    }
    if (!Array.isArray(parsed) || parsed.length === 0) {
        throw new Error("The coordinates input must be a non-empty JSON array.");
    }
    for (const [index, entry] of parsed.entries()) {
        if (!entry || typeof entry !== "object") {
            throw new Error(`Coordinate item ${index + 1} must be an object.`);
        }
        const coordinate = entry.coordinate;
        if (typeof coordinate !== "string" || !COORDINATE_PATTERN.test(coordinate.trim())) {
            throw new Error(`Coordinate item ${index + 1} must include a valid coordinate string in x/y/plane form.`);
        }
    }
}
//# sourceMappingURL=input.js.map