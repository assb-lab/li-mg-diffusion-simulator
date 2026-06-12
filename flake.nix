{
  description = "Development shell for Li-Mg Alloy Diffusion Simulator";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";
    systems.url = "github:nix-systems/default";
  };

  outputs =
    {
      self,
      nixpkgs,
      systems,
    }:
    let
      eachSystem = nixpkgs.lib.genAttrs (import systems);
    in
    {
      devShells = eachSystem (
        system:
        let
          pkgs = import nixpkgs { inherit system; };
        in
        {
          default = pkgs.mkShell {
            packages = with pkgs; [
              cargo
              clippy
              nodejs_24
              openssl
              pkg-config
              pnpm
              rustc
              rustfmt
              wasm-pack
            ];

            shellHook = ''
              export COREPACK_ENABLE_DOWNLOAD_PROMPT=0
              echo "Li-Mg Alloy Diffusion Simulator dev shell"
              echo "Run: pnpm install && pnpm wasm:build && pnpm dev"
            '';
          };
        }
      );
    };
}

