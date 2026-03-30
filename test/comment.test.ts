import test from "node:test";
import assert from "node:assert/strict";
import { buildCommentBody } from "../src/comment.js";
import { RenderManifest } from "../src/types.js";

test("buildCommentBody includes image urls", () => {
  const manifest: RenderManifest = {
    tileBaseUrl: "remote-renderer",
    generatedAt: new Date().toISOString(),
    renderCount: 1,
    failedCount: 0,
    items: [
      {
        status: "success",
        id: "step-1",
        label: "Step 1",
        coordinate: "3200/3200/0",
        source: "steps.json:4",
        resolved: { tileX: 12, tileY: 12, pixelX: 128, pixelY: 127 },
        imageUrl: "https://storage.googleapis.com/example-bucket/renders/hash/step-1.png"
      }
    ]
  };

  const body = buildCommentBody(manifest);
  assert.match(body, /Step 1/);
  assert.match(body, /storage\.googleapis\.com\/example-bucket/);
});
