<div align="center">

# 🌐 Web Uptime Monitor

**A high-reliability synthetic browser monitoring & automated availability engine powered by Playwright and GitHub Actions.**

[![Build Status](https://img.shields.io/badge/build-passing-brightgreen.svg?style=flat-square)](#)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D20.0.0-blue.svg?style=flat-square)](https://nodejs.org)
[![Playwright](https://img.shields.io/badge/playwright-v1.49.0-45ba4b.svg?style=flat-square)](https://playwright.dev)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](LICENSE)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](#contributing)

<p align="center">
  <a href="#key-features">Key Features</a> •
  <a href="#architecture">Architecture</a> •
  <a href="#quick-start">Quick Start</a> •
  <a href="#configuration">Configuration</a> •
  <a href="#automation">Automation</a> •
  <a href="#license">License</a>
</p>

</div>

---

## 📌 Overview

**Web Uptime Monitor** simulates real user navigation via headless browser sessions to accurately measure page availability, detect intermediate platform cold-starts, and record response times. Unlike simple ping or HTTP HEAD probes that often receive false positives from CDN edges, this engine evaluates actual DOM completion and JavaScript runtime health.

```
       [ Scheduled Trigger / Webhook ]
                     │
                     ▼
       ┌───────────────────────────┐
       │   Headless Chromium VM    │
       │  (Playwright Automation)  │
       └─────────────┬─────────────┘
                     │  Synthetic Navigation
                     ▼
       ┌───────────────────────────┐
       │   Target Web Application  │
       └─────────────┬─────────────┘
                     │  DOM Content & HTTP 200
                     ▼
       ┌───────────────────────────┐
       │  Availability Verification│
       └───────────────────────────┘
```

---

## ✨ Key Features

- **Real Browser Emulation**: Driven by headless Chromium with realistic navigation headers and Viewport metrics.
- **Cold-Start & Gateway Recovery**: Gracefully handles transitionary gateway screens (e.g., sleeping containers, staging wake-ups) with automated polling and interaction.
- **Deep DOM Assertion**: Asserts that core application elements are rendered and functional rather than relying purely on HTTP status codes.
- **Zero Infrastructure Footprint**: Runs seamlessly as a scheduled task inside standard GitHub Actions runners with no dedicated hosting required.

---

## 🚀 Quick Start

### 1. Installation

Clone this repository and install local dependencies:

```bash
git clone https://github.com/jeffreykeller0321/web-uptime-monitor.git
cd web-uptime-monitor
npm install
npx playwright install chromium
```

### 2. Local Execution

Run a single synthetic health check against a target URL:

```bash
TARGET_URL="https://example.com" npm start
```

### 3. Run Unit Tests

Execute test suite:

```bash
npm test
```

---

## ⚙️ Configuration

The monitor is configured via environment variables:

| Variable | Description | Default |
| :--- | :--- | :--- |
| `TARGET_URL` | The complete URL of the web endpoint to probe | *(Required)* |
| `TIMEOUT_MS` | Maximum duration to wait for full DOM readiness (ms) | `120000` |
| `HEADLESS` | Whether to run Chromium in headless mode | `true` |

---

## 🤖 Automation Workflow

This repository includes pre-configured GitHub Actions workflows in `.github/workflows/`:

- **`monitor.yml`**: Scheduled availability probing on a regular cadence (every 15 minutes) or manual trigger via `workflow_dispatch`.

To enable automated probes:
1. Navigate to **Settings > Secrets and variables > Actions**.
2. Add your `TARGET_URL` secret.
3. The scheduled workflow will automatically initiate synthetic runs.

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).
