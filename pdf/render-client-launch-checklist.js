#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const { execFileSync } = require("child_process");

const ROOT = path.resolve(__dirname, "..");
const INPUT = path.join(__dirname, "client-launch-checklist.html");
const OUTPUT = path.join(ROOT, "public", "client-launch-checklist.pdf");

const CHROME_CANDIDATES = [
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  "/Applications/Chromium.app/Contents/MacOS/Chromium",
];

function resolveChrome() {
  const chrome = CHROME_CANDIDATES.find((candidate) => fs.existsSync(candidate));
  if (!chrome) {
    throw new Error("Chrome binary not found in standard macOS locations.");
  }
  return chrome;
}

function render() {
  if (!fs.existsSync(INPUT)) {
    throw new Error(`Input HTML not found: ${INPUT}`);
  }

  execFileSync(
    resolveChrome(),
    [
      "--headless=new",
      "--disable-gpu",
      "--hide-scrollbars",
      "--allow-file-access-from-files",
      "--run-all-compositor-stages-before-draw",
      "--virtual-time-budget=12000",
      "--no-pdf-header-footer",
      `--print-to-pdf=${OUTPUT}`,
      `file://${INPUT}`,
    ],
    { stdio: "inherit" },
  );

  const kb = (fs.statSync(OUTPUT).size / 1024).toFixed(1);
  console.log(`PDF saved: ${OUTPUT} (${kb} KB)`);
}

render();
