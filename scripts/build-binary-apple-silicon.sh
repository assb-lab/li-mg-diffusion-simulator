#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

if ! command -v go >/dev/null 2>&1; then
  echo "error: go is required to build the Apple Silicon binary" >&2
  exit 1
fi

pnpm wasm:build
pnpm --filter web build

mkdir -p bin
outfile="${ROOT_DIR}/bin/li-mg-diffusion-simulator-apple-silicon"

(
  cd apps/web
  CGO_ENABLED=0 GOOS=darwin GOARCH=arm64 go build \
    -trimpath \
    -ldflags='-s -w' \
    -o "${outfile}" \
    .
)

echo "built ${outfile}"
echo "run: ${outfile}"
