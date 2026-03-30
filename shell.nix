{ pkgs ? import <nixpkgs> {} }:

pkgs.mkShell {
  packages = with pkgs; [
    nodejs_20
  ];

  shellHook = ''
    export npm_config_cache="$PWD/.npm-cache"
    echo "Node $(node --version)"
    echo "Run: npm install && npm run build"
  '';
}
