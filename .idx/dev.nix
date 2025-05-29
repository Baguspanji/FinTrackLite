{ pkgs, ... }:

let
  # Match Node.js version with your GitHub Actions workflow and package.json engines (if specified)
  nodeVersion = 20;
  nodePackage = pkgs."nodejs-${toString nodeVersion}_x";
in
{
  # Defines the Nix channel to use for packages.
  # "stable-23.11" is a common choice, adjust if needed.
  channel = "stable-23.11";

  # Defines the packages to make available in the environment.
  # You can find more packages at https://search.nixos.org/packages
  packages = [
    nodePackage # Provides Node.js and npm
    pkgs.yarn   # Explicitly include Yarn
    # pkgs.genkit # If genkit CLI needs to be globally available (usually run via yarn scripts)
  ];

  # Defines commands that should be automatically run when the environment boots.
  # This installs dependencies using Yarn.
  start.command = ["yarn", "install", "--frozen-lockfile"];

  # Defines the processes (preview services) that should be started when the environment boots.
  previews = [
    {
      # Command to run the Next.js development server.
      # This matches the "dev" script in your package.json.
      command = ["yarn", "dev"];
      # Port for the Next.js app.
      port = 9002;
      # Label for this preview in the IDX UI.
      label = "Web App (Next.js)";
      # Set this to true if it's the primary preview to open.
      primary = true;
    },
    {
      # Command to run the Genkit development server (with watch mode).
      # This matches the "genkit:watch" script in your package.json.
      command = ["yarn", "genkit:watch"];
      # Default port for Genkit UI.
      port = 4000;
      # Label for this preview.
      label = "Genkit Dev UI";
      primary = false;
      # If Genkit outputs a specific URL to open, you might use:
      # manager = "web";
      # url = "http://localhost:4000"; # Or whatever Genkit outputs
    }
  ];

  # Environment variables to set in the workspace.
  # These can be used by your application or build scripts.
  env = {
    # NODE_ENV = "development";
    # Example: GEMINI_API_KEY = "your_api_key_here"; # Better to use IDX secrets for sensitive keys
  };

  # Recommended VS Code extensions for Next.js, TypeScript, Tailwind development.
  # extensions = [
  #   "dbaeumer.vscode-eslint",
  #   "esbenp.prettier-vscode",
  #   "bradlc.vscode-tailwindcss",
  #   "formulahendry.auto-rename-tag",
  #   "ms-vscode.vscode-typescript-next" # For latest TypeScript features in VS Code
  # ];

  # For more IDX configuration options, see: https://idx.dev/docs/config/available-keys
}
