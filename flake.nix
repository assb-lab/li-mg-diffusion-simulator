{
  description = "Development shell for Li-Mg Alloy Diffusion Simulator";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";
    rust-overlay.url = "github:oxalica/rust-overlay";
    systems.url = "github:nix-systems/default";
  };

  outputs =
    {
      self,
      nixpkgs,
      rust-overlay,
      systems,
    }:
    let
      eachSystem = nixpkgs.lib.genAttrs (import systems);
    in
    {
      devShells = eachSystem (
        system:
        let
          pkgs = import nixpkgs {
            inherit system;
            overlays = [ (import rust-overlay) ];
          };
          rustToolchain = pkgs.rust-bin.stable.latest.default.override {
            extensions = [
              "clippy"
              "rustfmt"
            ];
            targets = [ "wasm32-unknown-unknown" ];
          };
        in
        {
          default = pkgs.mkShell {
            packages = with pkgs; [
              git
              go
              nodejs_24
              openssl
              pkg-config
              pnpm
              rustToolchain
              wasm-pack
            ];

            shellHook = ''
              export COREPACK_ENABLE_DOWNLOAD_PROMPT=0
              echo "Li-Mg Alloy Diffusion Simulator dev shell"
              echo "Run: pnpm install && pnpm exec vp --help && pnpm wasm:build && pnpm dev"
              echo "Optional binary: pnpm binary:build:apple-silicon"
            '';
          };
        }
      );
    };
}
