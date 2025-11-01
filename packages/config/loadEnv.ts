import fs from "fs";
import path from "path";
import dotenv from "dotenv";

let loaded = false;

export function loadEnv() {
  if (loaded) return; // prevent double-loading

  // try to find .env or .env.local in the monorepo root
  const rootEnvPath = path.resolve(__dirname, "../../.env.local");
  const rootEnvFallback = path.resolve(__dirname, "../../.env");

  if (fs.existsSync(rootEnvPath)) {
    dotenv.config({ path: rootEnvPath });
  } else if (fs.existsSync(rootEnvFallback)) {
    dotenv.config({ path: rootEnvFallback });
  }

  loaded = true;
}
