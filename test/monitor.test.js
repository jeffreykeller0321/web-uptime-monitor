const test = require("node:test");
const assert = require("node:assert");
const { loadConfig } = require("../src/config");

test("loadConfig reads TARGET_URL from environment", () => {
  process.env.TARGET_URL = "https://example.com";
  const cfg = loadConfig();
  assert.strictEqual(cfg.targetUrl, "https://example.com");
});

test("loadConfig defaults to 120000ms timeout", () => {
  delete process.env.TIMEOUT_MS;
  const cfg = loadConfig();
  assert.strictEqual(cfg.timeoutMs, 120000);
});

test("loadConfig defaults headless to true", () => {
  delete process.env.HEADLESS;
  const cfg = loadConfig();
  assert.strictEqual(cfg.headless, true);
});
