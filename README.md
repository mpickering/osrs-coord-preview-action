# OSRS Coordinate Preview Action

This folder contains the standalone GitHub Action client for `osrs-coordinate-preview`.

## What it does

The action:

- accepts a batch JSON payload of OSRS coordinates
- sends that payload to a hosted renderer service
- writes local `manifest.json`, `comment.md`, and `summary.md` files
- optionally posts or updates a PR comment using `thollander/actions-comment-pull-request@v3`

It does not render locally. Local rendering remains in the main repo CLI and service code.

## Inputs

| Name | Type | Required | Notes |
| --- | --- | --- | --- |
| `coordinates` | `string` | Conditionally | JSON array of coordinate items. Takes precedence over `coordinates-file` when both are set. |
| `coordinates-file` | `string` | Conditionally | Relative or absolute path to a file containing the JSON array payload. |
| `renderer-url` | `string` | No | Full `POST /render` endpoint. Defaults to the public hosted service for this project. |
| `comment` | `boolean` | No | Enable PR comment creation/update. Default `false`. |
| `pr-number` | `string` | No | Pull request number to comment on. Useful outside direct PR-triggered workflows. |
| `github-token` | `string` | No | Token passed to the comment action when `comment` is `true`. Defaults to `${{ github.token }}`. |
| `output-dir` | `string` | No | Directory where `manifest.json`, `comment.md`, and `summary.md` are written. Default `.osrs-coordinate-preview`. |

Provide either `coordinates` or `coordinates-file`.

## Outputs

| Name | Description |
| --- | --- |
| `manifest_path` | Path to the generated local `manifest.json`. |
| `comment_body_path` | Path to the generated `comment.md` file used for PR commenting. |
| `summary_path` | Path to the generated `summary.md` file that can be reused or uploaded as an artifact. |
| `render_count` | Number of successful renders returned by the renderer. |
| `failed_count` | Number of failed renders returned by the renderer. |

## Example

```yaml
- uses: mpickering/osrs-coordinate-preview-action@v1
  with:
    coordinates: ${{ steps.coords.outputs.coordinates }}
    comment: "true"
    github-token: ${{ github.token }}
```

```yaml
- uses: mpickering/osrs-coordinate-preview-action@v1
  with:
    coordinates-file: .github/osrs/coordinates.json
    comment: "true"
    pr-number: 123
    github-token: ${{ github.token }}
```

```yaml
- id: previews
  uses: mpickering/osrs-coordinate-preview-action@v1
  with:
    coordinates-file: .github/osrs/coordinates.json

- uses: actions/upload-artifact@v4
  with:
    name: osrs-coordinate-preview-summary
    path: ${{ steps.previews.outputs.summary_path }}
```

## Development

```bash
npm install
npm test
npm run build
```

`npm run build` compiles the TypeScript sources and bundles the published action entrypoint into `dist/index.js`.
