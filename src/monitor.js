const { chromium } = require("playwright");

async function runMonitor(config) {
  const target = config.targetUrl;
  if (!target) {
    throw new Error("TARGET_URL is required");
  }

  const startTime = Date.now();

  const browser = await chromium.launch({
    headless: config.headless,
    args: [
      "--no-sandbox",
      "--disable-dev-shm-usage",
      "--disable-gpu",
      "--disable-software-rasterizer"
    ]
  });

  const context = await browser.newContext({
    userAgent: config.userAgent,
    viewport: { width: 1280, height: 720 }
  });

  const page = await context.newPage();
  const deadline = Date.now() + config.timeoutMs;
  let verified = false;

  try {
    while (Date.now() < deadline) {
      console.log("[probe] Connecting to target...");
      try {
        const resp = await page.goto(target, {
          timeout: 30000,
          waitUntil: "domcontentloaded"
        });
        const status = resp ? resp.status() : 0;
        const title = (await page.title()) || "";
        console.log(`[probe] Status: ${status} | Title: "${title}"`);

        // Handle gateway wake / cold-start screens
        const isGatewayWaking =
          title.toLowerCase().includes("waking") ||
          title.toLowerCase().includes("asleep") ||
          title.toLowerCase().includes("starting") ||
          status === 503;

        if (isGatewayWaking) {
          console.log("[probe] Intermediate gateway warming up. Awaiting initialization...");
          const wakeAction = page.locator('button:has-text("Wake"), a:has-text("Wake")');
          if ((await wakeAction.count()) > 0) {
            console.log("[probe] Acknowledging wake-up prompt...");
            await wakeAction.first().click().catch(() => {});
          }
          await page.waitForTimeout(8000);
          continue;
        }

        const body = (await page.innerText("body")) || "";
        const hasCore = body.includes('"http":"ok"') && body.includes('"redis":true');
        const isAsleepGate = body.includes('"status":"asleep"');
        if (isAsleepGate && !isGatewayWaking) {
          console.log('[probe] Blitz sleep gate detected (200 + asleep body). Holding visit to wake app...');
          await page.waitForTimeout(8000);
          continue;
        }
        if (status === 200 && hasCore) {
          const elapsed = Date.now() - startTime;
          console.log(`[probe] SUCCESS: Verified response in ${elapsed}ms`);
          console.log(`[probe] Response snippet: ${body.slice(0, 160).trim()}`);
          verified = true;
          break;
        }
      } catch (err) {
        console.log(`[probe] Network notice: ${err.message}`);
      }
      await page.waitForTimeout(4000);
    }
  } finally {
    await browser.close();
  }

  if (!verified) {
    const lastBody = (await page.innerText("body").catch(() => "")) || "";
    throw new Error(`Target failed to verify within the configured timeout window; last body: ${lastBody.slice(0, 200)}`);
  }

  return { verified, duration: Date.now() - startTime };
}

module.exports = { runMonitor };
