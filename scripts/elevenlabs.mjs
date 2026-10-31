// Minimal ElevenLabs client: plain fetch, no SDK. The key comes from ELEVENLABS_API_KEY,
// read from the environment or from the .env file at the root of the repo.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

export const ROOT = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "..",
);
const BASE_URL = "https://api.elevenlabs.io";

const apiKey = () => {
  const envFile = path.join(ROOT, ".env");
  if (!process.env.ELEVENLABS_API_KEY && fs.existsSync(envFile)) {
    process.loadEnvFile(envFile);
  }
  const key = process.env.ELEVENLABS_API_KEY;
  if (!key) {
    throw new Error(
      "Falta ELEVENLABS_API_KEY. Copia .env.example como .env y pega tu clave " +
        "(elevenlabs.io > Developers > API Keys).",
    );
  }
  return key;
};

export const api = async (pathname, { method = "GET", json, query } = {}) => {
  const url = new URL(pathname, BASE_URL);
  for (const [name, value] of Object.entries(query ?? {})) {
    url.searchParams.set(name, String(value));
  }
  const headers = { "xi-api-key": apiKey() };
  if (json !== undefined) headers["content-type"] = "application/json";
  const res = await fetch(url, {
    method,
    headers,
    body: json === undefined ? undefined : JSON.stringify(json),
  });
  if (!res.ok) {
    throw new Error(
      `ElevenLabs ${method} ${pathname}: ${res.status} ${await res.text()}`,
    );
  }
  return res;
};

/** Credits used this month, or null if the key has no permission to read them. */
export const creditsUsed = async () => {
  try {
    const data = await (await api("/v1/user/subscription")).json();
    return { used: data.character_count, limit: data.character_limit };
  } catch {
    return null;
  }
};

export const logCredits = (before, after) => {
  if (!before || !after) return;
  console.log(
    `Créditos de ElevenLabs: ${after.used - before.used} gastados ` +
      `(${after.used} de ${after.limit} este mes). El contador puede tardar en actualizarse.`,
  );
};
