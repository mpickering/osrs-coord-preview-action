import fs from "node:fs/promises";
import path from "node:path";
import * as core from "@actions/core";
import { buildCommentBody, buildSummaryBody } from "./comment.js";
import { validateCoordinatesPayload } from "./input.js";
import { RenderManifest, RenderServiceResponse } from "./types.js";

export interface ActionOptions {
  coordinatesRaw: string;
  rendererUrl: string;
  outputDir: string;
}

export async function runAction(options: ActionOptions): Promise<void> {
  validateCoordinatesPayload(options.coordinatesRaw);

  const outputDir = path.resolve(process.cwd(), options.outputDir);
  await fs.mkdir(outputDir, { recursive: true });

  const manifest = await requestRemoteRender(options.rendererUrl, options.coordinatesRaw);
  const manifestPath = path.join(outputDir, "manifest.json");
  await fs.writeFile(manifestPath, JSON.stringify(manifest, null, 2));
  const commentBodyPath = path.join(outputDir, "comment.md");
  await fs.writeFile(commentBodyPath, buildCommentBody(manifest));
  const summaryPath = path.join(outputDir, "summary.md");
  await fs.writeFile(summaryPath, buildSummaryBody(manifest));

  core.setOutput("manifest_path", manifestPath);
  core.setOutput("comment_body_path", commentBodyPath);
  core.setOutput("summary_path", summaryPath);
  core.setOutput("render_count", String(manifest.renderCount));
  core.setOutput("failed_count", String(manifest.failedCount));
  core.summary.addHeading("OSRS coordinate previews");
  core.summary.addRaw(`Rendered ${manifest.renderCount} preview(s); ${manifest.failedCount} failure(s).`);
  await core.summary.write();

  if (manifest.failedCount > 0) {
    core.warning(`Failed to render ${manifest.failedCount} coordinate ${manifest.failedCount === 1 ? "preview" : "previews"}. See manifest and PR comment for details.`);
  }
}

async function requestRemoteRender(rendererUrl: string, coordinatesRaw: string): Promise<RenderManifest> {
  const response = await fetch(rendererUrl, {
    method: "POST",
    headers: {
      "content-type": "application/json"
    },
    body: coordinatesRaw
  });

  if (!response.ok) {
    throw new Error(`Renderer request failed: ${response.status} ${response.statusText}`);
  }

  const data = await response.json() as RenderServiceResponse;
  return {
    tileBaseUrl: "remote-renderer",
    generatedAt: new Date().toISOString(),
    renderCount: data.renderCount,
    failedCount: data.failedCount,
    items: data.items
  };
}
