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
            comment: core.getBooleanInput("comment"),
            rendererUrl: core.getInput("renderer-url") || "https://osrs-coordinate-preview-nt7ywvsdgq-nw.a.run.app/render",
            token: core.getInput("github-token") || process.env.GITHUB_TOKEN,
            outputDir: core.getInput("output-dir") || ".osrs-coordinate-preview"
        });
    }
    catch (error) {
        core.setFailed(error.message);
    }
}
void main();
//# sourceMappingURL=main.js.map