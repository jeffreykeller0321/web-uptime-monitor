/**
 * Configuration manager for Web Uptime Monitor
 */
function loadConfig() {
  const targetUrl = process.env.TARGET_URL || "";
  const timeoutMs = parseInt(process.env.TIMEOUT_MS || "120000", 10);
  const headless = process.env.HEADLESS !== "false";

  return {
    targetUrl,
    timeoutMs,
    headless,
    userAgent:
      process.env.USER_AGENT ||
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36"
  };
}

module.exports = { loadConfig };
