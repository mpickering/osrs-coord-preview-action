import * as core from "@actions/core";
import { runAction } from "./action.js";
import { resolveCoordinatesPayload } from "./input.js";

async function main() {
  try {
    const coordinatesRaw = await resolveCoordinatesPayload({
      coordinatesRaw: core.getInput("coordinates"),
      coordinatesFile: core.getInput("coordinates-file")
    });

    await runAction({
      coordinatesRaw,
      rendererUrl: core.getInput("renderer-url") || "https://osrs-coordinate-preview-nt7ywvsdgq-nw.a.run.app/render",
      outputDir: core.getInput("output-dir") || ".osrs-coordinate-preview"
    });
  } catch (error) {
    core.setFailed((error as Error).message);
  }
}

void main();
