import { chromium, expect } from "@playwright/test";
import path from "node:path";

const root = path.resolve("..");
const qualityCsv = path.join(root, "sample_data", "quality_sample.csv");
const qualityXlsx = path.join(root, "sample_data", "quality_sample.xlsx");
const salesXlsx = path.join(root, "sample_data", "sales_sample.xlsx");

async function analyze(page, filePath, mode, expected) {
  await page.goto("http://127.0.0.1:3000/free-scan", { waitUntil: "domcontentloaded" });
  await expect(page.getByRole("link", { name: "Download Sales Sample CSV" })).toBeVisible();
  await page.waitForTimeout(1500);
  await page.setInputFiles("#file", filePath);
  await page.selectOption("#mode", mode);
  await page.getByRole("button", { name: /Generate Free Report|Analyzing/ }).click();
  await expect(page.getByText(/Free scan complete|Full report unlocked/)).toBeVisible({ timeout: 60000 });
  await expect(page.getByText("Plain English")).toBeVisible();
  await expect(page.getByText("Roman Urdu", { exact: true })).toBeVisible();
  await expect(page.locator(".js-plotly-plot").first()).toBeVisible({ timeout: 60000 });
  if (expected) {
    await expect(page.getByText(expected.missing, { exact: true }).first()).toBeVisible();
    await expect(page.getByText(expected.duplicates, { exact: true }).first()).toBeVisible();
  }
}

const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({ acceptDownloads: true, viewport: { width: 1366, height: 900 } });
const page = await context.newPage();

await page.goto("http://127.0.0.1:3000", { waitUntil: "domcontentloaded" });
await expect(page.getByRole("heading", { name: "ReportDoctor.pk" })).toBeVisible();
await page.waitForTimeout(1500);
await page.getByRole("link", { name: /Generate Free Report/ }).click();
await expect(page).toHaveURL(/\/free-scan$/);

await analyze(page, qualityCsv, "General Data", { missing: "1", duplicates: "1" });
await analyze(page, qualityCsv, "Sales Data", { missing: "1", duplicates: "1" });
await analyze(page, salesXlsx, "Inventory Data", { missing: "0", duplicates: "0" });
await analyze(page, qualityXlsx, "Survey Data", { missing: "1", duplicates: "1" });

await page.fill("#unlock", "wrong-code");
await page.getByRole("button", { name: /Download PDF|Generating/ }).click();
await expect(page.getByText(/valid paid report unlock code/)).toBeVisible({ timeout: 60000 });

await page.fill("#unlock", "demo123");
const downloadPromise = page.waitForEvent("download", { timeout: 60000 });
await page.getByRole("button", { name: /Download PDF|Generating/ }).click();
const download = await downloadPromise;
const suggested = download.suggestedFilename();
if (!suggested.endsWith(".pdf")) {
  throw new Error(`Expected PDF download, got ${suggested}`);
}

await page.setViewportSize({ width: 390, height: 844 });
await page.goto("http://127.0.0.1:3000/free-scan", { waitUntil: "domcontentloaded" });
await expect(page.getByRole("heading", { name: "Excel/CSV Data Analyzer" })).toBeVisible();
await expect(page.getByRole("link", { name: "Download Sales Sample CSV" })).toBeVisible();

await browser.close();
console.log("browser-smoke passed");
