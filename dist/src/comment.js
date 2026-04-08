const COMMENT_MARKER = "<!-- osrs-coordinate-preview -->";
const COMMENT_IMAGE_WIDTH = 220;
const COMMENT_IMAGE_HEIGHT = 220;
const PROJECT_REPO_URL = "https://github.com/mpickering/osrs-coord-preview-action";
export function buildCommentBody(manifest) {
    return [COMMENT_MARKER, buildSummaryBody(manifest)].join("\n");
}
export function buildSummaryBody(manifest) {
    const lines = [
        `## 🗺️ [OSRS coordinate preview](${PROJECT_REPO_URL})`,
        "",
        `Rendered ${pluralize(manifest.renderCount, "preview")}; ${pluralize(manifest.failedCount, "failure")}.`,
        "",
        "| Preview | Item | Coordinate | Source |",
        "| --- | --- | --- | --- |"
    ];
    for (const item of manifest.items) {
        const title = item.label ?? item.id;
        const source = item.source ?? "";
        const preview = item.status === "success" && item.imageUrl
            ? `<a href="${item.imageUrl}"><img src="${item.imageUrl}" alt="${escapeAttribute(title)}" width="${COMMENT_IMAGE_WIDTH}" height="${COMMENT_IMAGE_HEIGHT}" /></a>`
            : escapeCell(item.status === "failure" ? `failed: ${item.error}` : "");
        lines.push(`| ${preview} | ${escapeCell(title)} | ${escapeCell(item.coordinate)} | ${escapeCell(source)} |`);
    }
    return lines.join("\n");
}
function escapeCell(value) {
    return value.replace(/\|/g, "\\|").replace(/\n/g, " ");
}
function escapeAttribute(value) {
    return value.replace(/"/g, "&quot;");
}
function pluralize(count, noun) {
    return `${count} ${noun}${count === 1 ? "" : "s"}`;
}
//# sourceMappingURL=comment.js.map