#!/usr/bin/env node
/**
 * AnTrua UI convention gate — fail CI/local when agent/UI drifts from Attio rules.
 * Usage: node scripts/check-ui-conventions.mjs
 */
import { readdir, readFile, stat } from "node:fs/promises";
import path from "node:path";

const ROOT = process.cwd();
const SCAN_DIRS = ["app", "components", "lib"];
const EXTENSIONS = new Set([".ts", ".tsx", ".css", ".mjs", ".js"]);

/** Heuristic: common emoji / pictograph ranges (not exhaustive). */
const EMOJI_RE =
  /[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}\u{FE0F}\u{1F1E0}-\u{1F1FF}]/u;

const RULES = [
  {
    id: "no-gradient-utility",
    re: /\b(bg-gradient-to-|from-purple|to-purple|via-violet|bg-violet-|text-violet-|border-violet-)\b/,
    message: "Cấm gradient / violet-purple AI default utilities",
  },
  {
    id: "no-inter-font",
    re: /next\/font\/google.*Inter|from ['\"]next\/font\/google['\"].*Inter|\bInter\b.*subset|fontFamily:\s*['\"]Inter/,
    message: "Cấm Inter — dùng Geist/Satoshi (xem design-system/MASTER.md)",
  },
  {
    id: "no-lucide-default",
    re: /from ['\"]lucide-react['\"]/,
    message: "Cấm lucide-react — dùng @phosphor-icons/react hoặc @radix-ui/react-icons",
  },
  {
    id: "no-h-screen-shell",
    re: /\bh-screen\b/,
    message: "Cấm h-screen — dùng min-h-[100dvh]",
  },
  {
    id: "no-pure-black",
    re: /(?:bg|text|border)-\[#000(?:000)?\]|['\"]#000000['\"]/,
    message: "Cấm pure #000 — dùng #1C1D1F / zinc-950",
  },
];

async function walk(dir, out = []) {
  let entries;
  try {
    entries = await readdir(dir, { withFileTypes: true });
  } catch {
    return out;
  }
  for (const ent of entries) {
    const full = path.join(dir, ent.name);
    if (ent.isDirectory()) {
      if (ent.name === "node_modules" || ent.name === ".next") continue;
      await walk(full, out);
    } else if (EXTENSIONS.has(path.extname(ent.name))) {
      out.push(full);
    }
  }
  return out;
}

const issues = [];

for (const rel of SCAN_DIRS) {
  const abs = path.join(ROOT, rel);
  try {
    await stat(abs);
  } catch {
    continue;
  }
  const files = await walk(abs);
  for (const file of files) {
    const text = await readFile(file, "utf8");
    const relFile = path.relative(ROOT, file).replace(/\\/g, "/");

    for (const rule of RULES) {
      if (rule.re.test(text)) {
        issues.push({ file: relFile, id: rule.id, message: rule.message });
      }
    }

    // Skip CSS variable files lightly for emoji; still flag TSX string emoji
    if (/\.(tsx|ts|jsx|js)$/.test(file) && EMOJI_RE.test(text)) {
      issues.push({
        file: relFile,
        id: "no-emoji",
        message: "Phát hiện emoji — dùng Phosphor/Radix/SVG (AGENTS.md)",
      });
    }
  }
}

if (issues.length === 0) {
  console.log("[check-ui] OK — no convention violations in app/components/lib");
  process.exit(0);
}

console.error(`[check-ui] FAIL — ${issues.length} issue(s):\n`);
for (const i of issues) {
  console.error(`  [${i.id}] ${i.file}\n    ${i.message}`);
}
process.exit(1);
