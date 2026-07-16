#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT_DIR"

if ! command -v go >/dev/null 2>&1; then
  echo "error: go is required to build the Windows x86_64 binary" >&2
  exit 1
fi

pnpm wasm:build
pnpm --filter web build

mkdir -p bin
outfile="${ROOT_DIR}/bin/li-mg-diffusion-simulator-windows-x64.exe"

(
  cd apps/web
  CGO_ENABLED=0 GOOS=windows GOARCH=amd64 go build \
    -trimpath \
    -ldflags='-s -w' \
    -o "${outfile}" \
    .
)

echo "built ${outfile}"
echo "transfer to a Windows x86_64 machine and run the .exe"
