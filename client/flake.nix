{
  description = "React + Vite Development Environment";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";
  };

  outputs = { nixpkgs, ... }:
    let
      system = "x86_64-linux";  # Options: x86_64-linux, aarch64-linux, x86_64-darwin, aarch64-darwin
      pkgs = nixpkgs.legacyPackages.${system};
    in
    {
      devShells.${system}.default = pkgs.mkShell {
        buildInputs = with pkgs; [
          nodejs_22  # Includes npm; LTS as of 2025
        ];

        shellHook = ''
          export NODE_ENV="development"

          # Create a stable symlink at .node so IDEs can be configured once to
          # find Node at a path that never changes even when nixpkgs updates
          if [ ! -L .node ] || [ "$(readlink .node)" != "${pkgs.nodejs_22}" ]; then
            ln -sfn ${pkgs.nodejs_22} .node
          fi

          if [ ! -f package.json ]; then
            echo ""
            echo "React + Vite environment ready  ($(node --version), npm $(npm --version))"
            echo ""
            echo "New project? Scaffold it with:"
            echo "  npm create vite@latest . -- --template react"
            echo "  npm install"
            echo "  npm run dev"
            echo ""
          else
            # Install node_modules only when package-lock.json (or package.json) has changed
            LOCK_FILE="package-lock.json"
            if [ ! -f "$LOCK_FILE" ]; then
              LOCK_FILE="package.json"
            fi
            LOCK_HASH=$(sha256sum "$LOCK_FILE" | cut -d' ' -f1)
            HASH_FILE="node_modules/.install_hash"

            if [ ! -d node_modules ] || [ ! -f "$HASH_FILE" ] || [ "$(cat $HASH_FILE)" != "$LOCK_HASH" ]; then
              echo "Installing dependencies..."
              npm install --silent
              echo "$LOCK_HASH" > "$HASH_FILE"
            fi

            echo "React + Vite environment ready  ($(node --version), npm $(npm --version))"
            echo "Use the 'Start Dev Server' task in VS Code to launch the app (http://localhost:5173)"
          fi
        '';
      };
    };
}
