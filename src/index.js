const { loadConfig } = require("./config");
const { runMonitor } = require("./monitor");

async function main() {
  const config = loadConfig();
  console.log("[app] Starting synthetic availability runner...");
  try {
    const result = await runMonitor(config);
    console.log(`[app] Monitor completed successfully in ${result.duration}ms.`);
  } catch (err) {
    console.error(`[app] Probe execution failed: ${err.message}`);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = { main };
