#!/usr/bin/env node

/**
 * transform-tokens.js
 * Zet src/tokens/raw/variables.json om naar src/tokens/output/tokens.css
 * Gebruik: node scripts/transform-tokens.js
 */

import { readFileSync, writeFileSync, mkdirSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");

// --- helpers ---

function rgbaToHex({ r, g, b, a }) {
  const hex = (v) => Math.round(v).toString(16).padStart(2, "0");
  return a === 1
    ? `#${hex(r)}${hex(g)}${hex(b)}`
    : `rgba(${Math.round(r)}, ${Math.round(g)}, ${Math.round(b)}, ${a})`;
}

function isColor(val) {
  return (
    val !== null &&
    typeof val === "object" &&
    "r" in val &&
    "g" in val &&
    "b" in val &&
    "a" in val
  );
}

function toCustomProp(name) {
  return `--${name}`;
}

function formatValue(val) {
  if (isColor(val)) return rgbaToHex(val);
  if (typeof val === "number") return `${val}px`;
  return val;
}

function flattenGroup(obj, prefix = "") {
  const props = [];
  for (const [key, val] of Object.entries(obj)) {
    const fullKey = prefix ? `${prefix}-${key}` : key;
    if (isColor(val) || typeof val === "number") {
      props.push(`  ${toCustomProp(fullKey)}: ${formatValue(val)};`);
    } else if (typeof val === "object" && val !== null) {
      props.push(...flattenGroup(val, fullKey));
    }
  }
  return props;
}

// --- main ---

const rawPath = resolve(ROOT, "src/tokens/raw/variables.json");
const outPath = resolve(ROOT, "src/tokens/output/tokens.css");

// Parse — ondersteunt zowel gewone JSON als dubbel-escaped string
let raw = readFileSync(rawPath, "utf-8");
let data;
try {
  const parsed = JSON.parse(raw);
  data = typeof parsed === "string" ? JSON.parse(parsed) : parsed;
} catch (e) {
  console.error("❌ Kan variables.json niet parsen:", e.message);
  process.exit(1);
}

const lines = [];

lines.push("/* ===========================================");
lines.push("   Design Tokens — gegenereerd door transform-tokens.js");
lines.push("   Niet handmatig bewerken. Bron: src/tokens/raw/variables.json");
lines.push("   =========================================== */");
lines.push("");

// --- :root — alle tokens zonder mode-splitsing ---
lines.push(":root {");

// Color schemes (mode-1)
const colorSchemes = data["color-schemes"]?.["mode-1"] ?? {};
lines.push("");
lines.push("  /* Color Schemes */");
lines.push(...flattenGroup(colorSchemes));

// Primitives (mode-1)
const primitives = data["primitives"]?.["mode-1"] ?? {};
lines.push("");
lines.push("  /* Primitives */");
lines.push(...flattenGroup(primitives));

// UI Styles (mode-1)
const uiStyles = data["u-i-styles"]?.["mode-1"] ?? {};
lines.push("");
lines.push("  /* UI Styles */");
lines.push(...flattenGroup(uiStyles));

// Typography desktop (base)
const typoDesktop = data["typography"]?.["desktop"] ?? {};
lines.push("");
lines.push("  /* Typography — Desktop (base) */");
lines.push(...flattenGroup(typoDesktop));

// Spacing desktop (base)
const spacingDesktop = data["spacing-sizing"]?.["desktop"] ?? {};
lines.push("");
lines.push("  /* Spacing & Sizing — Desktop (base) */");
lines.push(...flattenGroup(spacingDesktop));

lines.push("}");
lines.push("");

// --- Mobile overrides via media query ---
const typoMobile = data["typography"]?.["mobile"] ?? {};
const spacingMobile = data["spacing-sizing"]?.["mobile"] ?? {};

lines.push("@media (max-width: 768px) {");
lines.push("  :root {");
lines.push("");
lines.push("    /* Typography — Mobile */");
lines.push(...flattenGroup(typoMobile).map((l) => "  " + l));
lines.push("");
lines.push("    /* Spacing & Sizing — Mobile */");
lines.push(...flattenGroup(spacingMobile).map((l) => "  " + l));
lines.push("");
lines.push("  }");
lines.push("}");
lines.push("");

// --- output schrijven ---
mkdirSync(dirname(outPath), { recursive: true });
writeFileSync(outPath, lines.join("\n"), "utf-8");

console.log(`✅ Tokens gegenereerd → ${outPath}`);
