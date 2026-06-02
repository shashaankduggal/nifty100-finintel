import { spawn } from "node:child_process";
import { setTimeout as delay } from "node:timers/promises";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";
import { chromium } from "playwright";
import http from "node:http";

const currentDir = dirname(fileURLToPath(import.meta.url));
const frontendDir = resolve(currentDir, "..");
const designAssetsDir = resolve(frontendDir, "..", "design-assets");
const baseUrl = "http://127.0.0.1:4173";

function waitForServer(url, timeoutMs = 30000) {
  const startedAt = Date.now();

  return new Promise((resolvePromise, rejectPromise) => {
    const attempt = () => {
      http
        .get(url, (response) => {
          response.resume();
          if (response.statusCode && response.statusCode < 500) {
            resolvePromise();
            return;
          }
          if (Date.now() - startedAt > timeoutMs) {
            rejectPromise(new Error(`Timed out waiting for ${url}`));
            return;
          }
          setTimeout(attempt, 500);
        })
        .on("error", () => {
          if (Date.now() - startedAt > timeoutMs) {
            rejectPromise(new Error(`Timed out waiting for ${url}`));
            return;
          }
          setTimeout(attempt, 500);
        });
    };

    attempt();
  });
}

const server = spawn(
  process.platform === "win32" ? "npm.cmd" : "npm",
  ["run", "dev", "--", "--host", "127.0.0.1", "--port", "4173"],
  {
    cwd: frontendDir,
    stdio: "inherit",
    shell: process.platform === "win32",
  },
);

try {
  await waitForServer(`${baseUrl}/`);
  await delay(1000);

  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 1600 } });

  await page.goto(`${baseUrl}/`, { waitUntil: "networkidle" });
  await page.screenshot({ path: resolve(designAssetsDir, "phase-b-landing.png"), fullPage: true });

  await page.addInitScript(() => {
    sessionStorage.setItem("nifty100_access_token", "demo-access-token");
    sessionStorage.setItem("nifty100_refresh_token", "demo-refresh-token");
    sessionStorage.setItem(
      "nifty100_user",
      JSON.stringify({
        firstName: "Demo Analyst",
        role: "Research Lead",
      }),
    );
  });

  await page.goto(`${baseUrl}/dashboard`, { waitUntil: "networkidle" });
  await page.screenshot({
    path: resolve(designAssetsDir, "phase-b-dashboard.png"),
    fullPage: true,
  });

  await browser.close();
} finally {
  server.kill("SIGTERM");
}
