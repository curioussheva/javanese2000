#!/usr/bin/env node

/**
 * 📦 CuriousSheva WebView App Installer Manager (Plain JS)
 * Compatible with Termux + Node.js, no TypeScript or ts-node required.
 */

import fs from "fs";
import path from "path";
import readline from "readline";
import { execSync } from "child_process";

const APP_NAME = "WebViewApp";
const PUBLISHER = "CuriousSheva";
const BASE_DIR = process.cwd();

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function ask(question) {
  return new Promise((resolve) => rl.question(question, resolve));
}

function ensurePackageManagerCompatibility(projectDir) {
  const packageJsonPath = path.join(projectDir, "package.json");
  if (!fs.existsSync(packageJsonPath)) return;

  const pkg = JSON.parse(fs.readFileSync(packageJsonPath, "utf-8"));
  const hasPatch = Object.values(pkg.dependencies || {}).some(
    (dep) => typeof dep === "string" && dep.startsWith("patch:")
  );

  console.log("\n🔍 Checking package manager compatibility...");

  if (hasPatch) {
    console.log("⚠️ Detected Yarn patch protocol in dependencies.");
    try {
      execSync("yarn --version", { stdio: "ignore" });
      console.log("✅ Yarn is already installed.");
    } catch {
      console.log("📦 Installing Yarn globally...");
      execSync("npm install -g yarn", { stdio: "inherit" });
    }

    console.log("🧩 Running yarn install...");
    execSync("yarn install", { cwd: projectDir, stdio: "inherit" });
  } else {
    console.log("✅ No patch dependencies found. Running npm install...");
    execSync("npm install", { cwd: projectDir, stdio: "inherit" });
  }

  console.log("\n🧹 Clearing Expo cache...");
  try {
    execSync("npx expo start -c", { cwd: projectDir, stdio: "inherit" });
  } catch {
    console.warn("⚠️ Expo not started automatically. Run: npx expo start -c");
  }
}

function createStructure() {
  const dirs = [
    "app",
    "app/screens",
    "app/navigation",
    "app/components",
    "app/utils",
    "assets",
  ];
  dirs.forEach((d) => fs.mkdirSync(path.join(BASE_DIR, d), { recursive: true }));
  console.log("📁 Project structure created.");
}

function generateReadme() {
  const readme = `
# 📱 ${APP_NAME} Installer by ${PUBLISHER}

An Expo-powered WebView app generator with AdMob + Bookmark + Interactive demo.

---

## 🧭 Menu Options

| Option | Description |
|--------|-------------|
| Install | Create and configure the app |
| Update | Pull latest changes |
| Uninstall | Remove the app files |
| EAS Menu | Open EAS commands manually |
| Exit | Quit manager |

---

## ⚙️ Installation

\`\`\`bash
node install-webview-apps.js
\`\`\`

Then choose **Install WebViewApp** from the menu.

---

## 🧩 AdMob Setup

Uses **test IDs** by default.  
Replace with your own IDs in:
\`app/utils/admobConfig.js\`

---

## 📬 Contact

- 🌐 Facebook: [CuriousSheva](https://www.facebook.com/share/1BC9oPdjdP/)
- 📧 Email: [jadmiko@gmail.com](mailto:jadmiko@gmail.com)

---
`;
  fs.writeFileSync("README.md", readme);
  console.log("📝 README.md generated successfully.");
}

async function installApp() {
  console.log(`\n🚀 Installing ${APP_NAME}...`);
  createStructure();
  generateReadme();
  ensurePackageManagerCompatibility(BASE_DIR);
  console.log(`✅ ${APP_NAME} installation complete!`);
}

async function uninstallApp() {
  const confirm = await ask("⚠️ Are you sure you want to uninstall? (y/n): ");
  if (confirm.toLowerCase() === "y") {
    fs.rmSync(path.join(BASE_DIR, "app"), { recursive: true, force: true });
    console.log("🗑️ App files removed.");
  } else console.log("❌ Uninstall canceled.");
}

function updateApp() {
  console.log("📦 Updating dependencies...");
  execSync("npm update", { stdio: "inherit" });
  console.log("✅ Update complete.");
}

async function easMenu() {
  console.log("\n🔧 EAS Management Menu");
  console.log("1️⃣  Configure EAS");
  console.log("2️⃣  Build APK");
  console.log("3️⃣  Submit to Play Store");
  console.log("4️⃣  Return to main menu\n");

  const choice = await ask("Choose (1-4): ");
  switch (choice) {
    case "1":
      console.log("🧩 Run manually: npx eas build:configure");
      break;
    case "2":
      console.log("🏗️ Run manually: npx eas build -p android --profile preview");
      break;
    case "3":
      console.log("🚀 Run manually: npx eas submit -p android");
      break;
    default:
      console.log("↩️ Returning to main menu...");
  }
}

async function mainMenu() {
  console.log(`\n✨ ${PUBLISHER} WebView App Manager`);
  console.log("1️⃣  Install WebViewApp");
  console.log("2️⃣  Update App");
  console.log("3️⃣  Uninstall App");
  console.log("4️⃣  EAS Menu");
  console.log("5️⃣  Exit\n");

  const choice = await ask("Select option: ");

  switch (choice) {
    case "1":
      await installApp();
      break;
    case "2":
      updateApp();
      break;
    case "3":
      await uninstallApp();
      break;
    case "4":
      await easMenu();
      break;
    default:
      console.log("👋 Exiting...");
      rl.close();
      return;
  }

  mainMenu(); // Loop back to menu
}

mainMenu();
