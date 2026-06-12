# Li-Mg Alloy Diffusion Simulator

Li-Mg Alloy Diffusion Simulator は、Li-rich Li-Mg 合金負極中の 1D 化学拡散を計算し、拡散律速による利用率低下を可視化する Web アプリケーションです。

本プロジェクトは、Krauskopf et al., _Advanced Energy Materials_ 2019, DOI: `10.1002/aenm.201902568` の Li0.9Mg0.1 合金負極モデル、特に Figure 9 / Figure 10 の再現検討にインスパイアされた研究・教育用シミュレータです。論文そのものの公式実装ではありません。

## 何ができるか

- Li-Mg 合金負極内の濃度プロファイルを 1D 拡散モデルで計算する
- 膜厚、電流密度、拡散係数、温度などの入力条件を変更する
- Arrhenius 型の温度依存拡散係数を使ってシミュレーションする
- Krauskopf et al. 2019 Figure 9 風の電流密度別プロファイルを確認する
- Figure 10 風の温度・電流密度スイープで利用率の傾向を確認する
- Rust + WASM の数値コアを React UI から呼び出して計算する

恒久的な仕様の正本は [`docs/`](docs/) です。README は使い始めるための入口として維持します。

## 使い方

Nix flakes を使う場合は、開発シェルに入ってから依存関係をインストールします。

```bash
nix develop
pnpm install
pnpm wasm:build
pnpm dev
```

Nix を使わない場合は、ローカルに Node.js、pnpm、Rust toolchain、wasm-pack を用意してください。

依存関係をインストールします。

```bash
pnpm install
```

Rust/WASM 数値コアをビルドします。

```bash
pnpm wasm:build
```

Web アプリを起動します。

```bash
pnpm dev
```

起動後、Vite が表示するローカル URL をブラウザで開いてください。

## よく使うコマンド

```bash
pnpm dev
pnpm build
pnpm fmt
pnpm lint
pnpm test
pnpm test:coverage
pnpm wasm:build
```

Rust core を変更した場合は、以下も実行します。

```bash
cargo test --manifest-path packages/diffusion-core/Cargo.toml
cargo fmt --check --manifest-path packages/diffusion-core/Cargo.toml
cargo clippy --manifest-path packages/diffusion-core/Cargo.toml -- -D warnings
```

## 技術スタック

- Frontend: Vite React TypeScript
- Environment bootstrap: Vite Plus (`vp`)
- Package manager: pnpm
- Optional development environment: Nix flakes
- Test runner: Vitest
- Formatter: oxfmt
- Linter: oxlint
- Calculation core: Rust + wasm-bindgen + WASM

## ディレクトリ

```text
apps/web/                 React UI
packages/shared/          TypeScript domain types, units, validation
packages/diffusion-core/  Rust solver + WASM package
tests/                    Integration and acceptance tests
docs/                     SSOT specifications
.steering/                Iteration records
```

## 品質確認

コミット前の基本品質ゲートは以下です。

```bash
pnpm fmt
pnpm lint
pnpm test
pnpm test:coverage
```

まとめて確認する場合は以下を使えます。

```bash
pnpm check
```

## License

MIT ks250206 2026. See [`LICENSE`](LICENSE).
