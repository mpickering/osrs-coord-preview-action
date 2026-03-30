# OSRS Coordinate Preview Action

This folder contains the standalone GitHub Action client for `osrs-coordinate-preview`.

It is intentionally self-contained so it can be moved into its own repository later.

## What it does

The action:

- accepts a batch JSON payload of OSRS coordinates
- sends that payload to a hosted renderer service
- writes a local `manifest.json`
- optionally posts or updates a PR comment using the hosted image URLs returned by the renderer

It does not render locally. Local rendering remains in the main repo CLI and service code.

## Inputs

| Name | Type | Required | Notes |
| --- | --- | --- | --- |
| `coordinates` | `string` | Yes | JSON array of coordinate items. |
| `renderer-url` | `string` | No | Full `POST /render` endpoint. Defaults to the public hosted service for this project. |
| `comment` | `boolean` | No | Enable PR comment creation/update. Default `false`. |
| `github-token` | `string` | No | Needed when `comment` is `true`. Usually `${{ github.token }}`. |
| `output-dir` | `string` | No | Directory where `manifest.json` is written. Default `.osrs-coordinate-preview`. |

## Outputs

| Name | Description |
| --- | --- |
| `manifest_path` | Path to the generated local `manifest.json`. |
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

## Development

```bash
cd github-action
npm install
npm test
npm run build
```
