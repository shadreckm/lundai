/**
 * LUNDAI Platform — Full Integration Validator
 * Tests every service connection and reports status
 */
import "dotenv/config";
import { createRequire } from "module";
import https from "https";
import http from "http";

const require = createRequire(import.meta.url);

// ── Helpers ───────────────────────────────────────────────────────────────────
const RESET  = "\x1b[0m";
const GREEN  = "\x1b[32m";
const RED    = "\x1b[31m";
const YELLOW = "\x1b[33m";
const CYAN   = "\x1b[36m";
const BOLD   = "\x1b[1m";
const DIM    = "\x1b[2m";

const ok   = (msg: string) => console.log(`  ${GREEN}✅ ${msg}${RESET}`);
const fail = (msg: string) => console.log(`  ${RED}❌ ${msg}${RESET}`);
const warn = (msg: string) => console.log(`  ${YELLOW}⚠️  ${msg}${RESET}`);
const info = (msg: string) => console.log(`  ${CYAN}ℹ️  ${msg}${RESET}`);
const dim  = (msg: string) => console.log(`  ${DIM}${msg}${RESET}`);
const section = (title: string) => {
  console.log(`\n${BOLD}${CYAN}━━━ ${title} ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${RESET}`);
};

const isPlaceholder = (val: string | undefined, ...keywords: string[]) => {
  if (!val) return true;
  return keywords.some(k => val.toLowerCase().includes(k.toLowerCase()));
};

const httpGet = (url: string, headers: Record<string, string> = {}): Promise<{ status: number; body: string }> =>
  new Promise((resolve, reject) => {
    const mod = url.startsWith("https") ? https : http;
    const options = {
      headers: headers
    };
    const req = mod.get(url, options, (res) => {
      let body = "";
      res.on("data", (d) => (body += d));
      res.on("end", () => resolve({ status: res.statusCode!, body }));
    });
    req.setTimeout(8000, () => { req.destroy(); reject(new Error("Timeout")); });
    req.on("error", reject);
  });

const sleep = (ms: number) => new Promise(r => setTimeout(r, ms));

// ── Report accumulator ────────────────────────────────────────────────────────
const report: { service: string; status: "ok" | "warn" | "fail" | "skip"; detail: string }[] = [];
const record = (service: string, status: "ok" | "warn" | "fail" | "skip", detail: string) => {
  report.push({ service, status, detail });
};

// ─────────────────────────────────────────────────────────────────────────────
// 1. ENVIRONMENT VARIABLES
// ─────────────────────────────────────────────────────────────────────────────
section("1. ENVIRONMENT VARIABLES");

const env = {
  NODE_ENV:              process.env.NODE_ENV,
  PORT:                  process.env.PORT,
  APP_URL:               process.env.APP_URL,
  DATABASE_URL:          process.env.DATABASE_URL,
  JWT_SECRET:            process.env.JWT_SECRET,
  GEMINI_API_KEY:        process.env.GEMINI_API_KEY,
  CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
  CLOUDINARY_API_KEY:    process.env.CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET,
  PAYCHANGU_SECRET_KEY:  process.env.PAYCHANGU_SECRET_KEY,
  TWILIO_ACCOUNT_SID:    process.env.TWILIO_ACCOUNT_SID,
  TWILIO_AUTH_TOKEN:     process.env.TWILIO_AUTH_TOKEN,
};

const mask = (v?: string) => {
  if (!v) return "(not set)";
  if (v.length <= 8) return "***";
  return v.substring(0, 4) + "****" + v.slice(-3);
};

const envChecks: [string, string | undefined, string[], string][] = [
  ["DATABASE_URL",          env.DATABASE_URL,          ["password@localhost", "your-"],  "Supabase connection string"],
  ["JWT_SECRET",            env.JWT_SECRET,            ["change-me", "your-"],           "JWT signing secret"],
  ["GEMINI_API_KEY",        env.GEMINI_API_KEY,        ["your-gemini"],                  "Google Gemini API key"],
  ["CLOUDINARY_CLOUD_NAME", env.CLOUDINARY_CLOUD_NAME, ["your-cloud"],                   "Cloudinary cloud name"],
  ["CLOUDINARY_API_KEY",    env.CLOUDINARY_API_KEY,    ["your-api-key"],                 "Cloudinary API key"],
  ["CLOUDINARY_API_SECRET", env.CLOUDINARY_API_SECRET, ["your-api-secret"],              "Cloudinary API secret"],
  ["PAYCHANGU_SECRET_KEY",  env.PAYCHANGU_SECRET_KEY,  ["your-paychangu"],               "PayChangu secret key"],
  ["TWILIO_ACCOUNT_SID",    env.TWILIO_ACCOUNT_SID,    ["your-twilio"],                  "Twilio Account SID"],
  ["TWILIO_AUTH_TOKEN",     env.TWILIO_AUTH_TOKEN,     ["your-twilio"],                  "Twilio Auth Token"],
];

let envIssues = 0;
for (const [key, val, placeholders, description] of envChecks) {
  if (!val) {
    warn(`${key}: NOT SET — ${description}`);
    envIssues++;
  } else if (isPlaceholder(val, ...placeholders)) {
    warn(`${key}: still a PLACEHOLDER value (${mask(val)}) — ${description}`);
    envIssues++;
  } else {
    ok(`${key}: configured (${mask(val)})`);
  }
}

info(`NODE_ENV = ${env.NODE_ENV || "development"}`);
info(`PORT     = ${env.PORT || "3000"}`);

if (envIssues === 0) {
  record("Environment", "ok", "All env vars configured");
} else {
  record("Environment", "warn", `${envIssues} variables not yet configured (still placeholder)`);
  console.log(`\n  ${YELLOW}Note: The app runs in mock mode for unconfigured services.${RESET}`);
}

// ─────────────────────────────────────────────────────────────────────────────
// 2. DATABASE (Supabase / PostgreSQL)
// ─────────────────────────────────────────────────────────────────────────────
section("2. DATABASE — Supabase/PostgreSQL");

const dbUrl = env.DATABASE_URL || "";
const isLocalDb = dbUrl.includes("localhost") || dbUrl.includes("127.0.0.1");
const isPlaceholderDb = isPlaceholder(dbUrl, "password@localhost", "your-") && !dbUrl.includes("supabase");
const isSupabase = dbUrl.includes("supabase");

if (!dbUrl || isPlaceholder(dbUrl, "your-")) {
  warn("DATABASE_URL not configured — skipping DB test");
  record("Database", "skip", "DATABASE_URL not configured");
} else {
  info(`Database host: ${isSupabase ? "Supabase (cloud)" : isLocalDb ? "Local PostgreSQL" : "Remote PostgreSQL"}`);
  
  let pg: any;
  try {
    pg = require("pg");
    const { Pool } = pg;
    const pool = new Pool({ 
      connectionString: dbUrl, 
      ssl: isSupabase ? { rejectUnauthorized: false } : false,
      connectionTimeoutMillis: 8000,
    });
    
    try {
      const client = await pool.connect();
      const result = await client.query("SELECT NOW() as now, current_database() as db");
      ok(`Connected to PostgreSQL database: ${result.rows[0].db}`);
      ok(`Server time: ${result.rows[0].now}`);
      
      // Check which schema tables exist
      const tablesResult = await client.query(`
        SELECT table_name FROM information_schema.tables 
        WHERE table_schema = 'public' 
        ORDER BY table_name;
      `);
      
      const REQUIRED_TABLES = ["users", "properties", "property_images", "inquiries", "transactions", "ai_search_logs", "whatsapp_messages"];
      const existingTables = tablesResult.rows.map((r: any) => r.table_name);
      
      if (existingTables.length === 0) {
        warn("No tables found in public schema — run `npm run db:push` to migrate");
        record("Database", "warn", "Connected but tables not migrated yet");
      } else {
        const missing = REQUIRED_TABLES.filter(t => !existingTables.includes(t));
        if (missing.length > 0) {
          warn(`Missing tables: ${missing.join(", ")} — run \`npm run db:push\``);
          record("Database", "warn", `Connected. Missing tables: ${missing.join(", ")}`);
        } else {
          ok(`All ${REQUIRED_TABLES.length} required tables exist: ${REQUIRED_TABLES.join(", ")}`);
          record("Database", "ok", "Connected + all tables present");
        }
        info(`Tables in DB: ${existingTables.join(", ")}`);
      }
      
      client.release();
      await pool.end();
    } catch (connErr: any) {
      fail(`Database connection failed: ${connErr.message}`);
      if (isLocalDb && isPlaceholderDb) {
        dim("      → This is expected: DATABASE_URL points to a local placeholder address.");
        dim("      → Update DATABASE_URL in .env with your real Supabase connection string.");
      }
      record("Database", "fail", connErr.message);
    }
  } catch (importErr: any) {
    fail(`pg module not found: ${importErr.message}`);
    record("Database", "fail", "pg module missing");
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// 3. AUTHENTICATION — JWT
// ─────────────────────────────────────────────────────────────────────────────
section("3. AUTHENTICATION — JWT");

const jwtSecret = env.JWT_SECRET || "";
if (isPlaceholder(jwtSecret, "change-me", "your-")) {
  warn("JWT_SECRET is still the placeholder value");
  warn("Using placeholder JWT secret — auth will work locally but is insecure");
  record("JWT Auth", "warn", "Placeholder secret (works locally, insecure for production)");
} else {
  try {
    const jwt = require("jsonwebtoken");
    const testPayload = { id: "test-user", email: "test@lundai.com", role: "student" };
    const token = jwt.sign(testPayload, jwtSecret, { expiresIn: "1h" });
    const decoded = jwt.verify(token, jwtSecret) as any;
    ok(`JWT sign + verify successful`);
    ok(`Payload round-trip: id=${decoded.id}, role=${decoded.role}`);
    dim(`      Token (first 40 chars): ${token.substring(0, 40)}…`);
    record("JWT Auth", "ok", "Sign and verify working");
  } catch (err: any) {
    fail(`JWT test failed: ${err.message}`);
    record("JWT Auth", "fail", err.message);
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. GOOGLE GEMINI AI
// ─────────────────────────────────────────────────────────────────────────────
section("4. AI SEARCH — Google Gemini");

const geminiKey = env.GEMINI_API_KEY || "";
if (isPlaceholder(geminiKey, "your-gemini")) {
  warn("GEMINI_API_KEY not configured — AI search will use keyword fallback");
  record("Gemini AI", "skip", "Not configured — keyword fallback active");
} else {
  try {
    info(`Sending test prompt to Gemini (gemini-2.0-flash)…`);
    const { GoogleGenAI } = await import("@google/genai");
    const ai = new GoogleGenAI({ apiKey: geminiKey });
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: [{ role: "user", parts: [{ text: 'Reply with exactly: {"status":"ok","service":"gemini"}' }] }],
    });
    const text = response.text?.trim() || "";
    ok(`Gemini API responded: ${text.substring(0, 80)}`);
    try {
      const parsed = JSON.parse(text.replace(/```json?\n?/g, "").replace(/```/g, "").trim());
      if (parsed.status === "ok") ok("Gemini JSON response parsed correctly");
    } catch { /* non-fatal */ }
    record("Gemini AI", "ok", "API connected and responding");
  } catch (err: any) {
    if (err.message?.includes("API_KEY_INVALID") || err.message?.includes("401")) {
      fail(`Invalid GEMINI_API_KEY: ${err.message}`);
      record("Gemini AI", "fail", "Invalid API key");
    } else if (err.message?.includes("ENOTFOUND") || err.message?.includes("fetch")) {
      fail(`Network error reaching Gemini API: ${err.message}`);
      record("Gemini AI", "fail", "Network unreachable");
    } else {
      fail(`Gemini test failed: ${err.message}`);
      record("Gemini AI", "fail", err.message);
    }
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// 5. CLOUDINARY
// ─────────────────────────────────────────────────────────────────────────────
section("5. MEDIA STORAGE — Cloudinary");

const cloudName = env.CLOUDINARY_CLOUD_NAME || "";
const cloudKey  = env.CLOUDINARY_API_KEY   || "";
const cloudSec  = env.CLOUDINARY_API_SECRET || "";

if (isPlaceholder(cloudName, "your-cloud") || isPlaceholder(cloudKey, "your-api-key")) {
  warn("Cloudinary credentials not configured — image upload will be skipped");
  record("Cloudinary", "skip", "Credentials not configured");
} else {
  try {
    const { v2: cloudinary } = await import("cloudinary");
    cloudinary.config({ cloud_name: cloudName, api_key: cloudKey, api_secret: cloudSec });
    const result = await cloudinary.api.ping();
    if ((result as any).status === "ok") {
      ok(`Cloudinary ping successful (cloud: ${cloudName})`);
      record("Cloudinary", "ok", `Connected to cloud: ${cloudName}`);
      
      // Test upload with a tiny SVG data URL
      info("Testing image upload with test SVG…");
      try {
        const uploadResult = await cloudinary.uploader.upload(
          "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAiIGhlaWdodD0iMTAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PHJlY3Qgd2lkdGg9IjEwIiBoZWlnaHQ9IjEwIiBmaWxsPSIjN2M1Y2ZjIi8+PC9zdmc+",
          { folder: "lundai-test", public_id: "validation-test" }
        );
        ok(`Test image uploaded: ${uploadResult.secure_url}`);
        await cloudinary.uploader.destroy(uploadResult.public_id);
        ok("Test image cleaned up");
        record("Cloudinary", "ok", "Upload + delete verified");
      } catch (uploadErr: any) {
        warn(`Upload test failed: ${uploadErr.message}`);
      }
    }
  } catch (err: any) {
    if (err.message?.includes("401") || err.message?.includes("Invalid credentials")) {
      fail(`Invalid Cloudinary credentials: ${err.message}`);
      record("Cloudinary", "fail", "Invalid credentials");
    } else {
      fail(`Cloudinary test failed: ${err.message}`);
      record("Cloudinary", "fail", err.message);
    }
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// 6. TWILIO (WhatsApp)
// ─────────────────────────────────────────────────────────────────────────────
section("6. WHATSAPP — Twilio");

const twilioSid   = env.TWILIO_ACCOUNT_SID || "";
const twilioToken = env.TWILIO_AUTH_TOKEN  || "";

if (isPlaceholder(twilioSid, "your-twilio") || isPlaceholder(twilioToken, "your-twilio")) {
  warn("Twilio credentials not configured — WhatsApp ingestion will be inactive");
  record("Twilio WhatsApp", "skip", "Credentials not configured");
} else {
  try {
    // Validate credentials via Twilio REST API without sending a message
    const auth = Buffer.from(`${twilioSid}:${twilioToken}`).toString("base64");
    const response = await httpGet(`https://api.twilio.com/2010-04-01/Accounts/${twilioSid}.json`, {
      Authorization: `Basic ${auth}`
    });
    
    if (response.status === 200) {
      const data = JSON.parse(response.body);
      ok(`Twilio account verified: ${data.friendly_name || twilioSid}`);
      ok(`Account status: ${data.status}`);
      record("Twilio WhatsApp", "ok", `Account: ${data.friendly_name}`);
    } else if (response.status === 401) {
      fail("Twilio credentials invalid (401 Unauthorized)");
      record("Twilio WhatsApp", "fail", "Invalid credentials");
    } else {
      warn(`Twilio returned status ${response.status}: ${response.body.substring(0, 100)}`);
      record("Twilio WhatsApp", "warn", `HTTP ${response.status}`);
    }
  } catch (err: any) {
    fail(`Twilio test failed: ${err.message}`);
    record("Twilio WhatsApp", "fail", err.message);
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// 7. PAYCHANGU
// ─────────────────────────────────────────────────────────────────────────────
section("7. PAYMENTS — PayChangu");

const paychanguKey = env.PAYCHANGU_SECRET_KEY || "";

if (isPlaceholder(paychanguKey, "your-paychangu")) {
  warn("PAYCHANGU_SECRET_KEY not configured — payments will use mock checkout");
  record("PayChangu", "skip", "Not configured — mock checkout active");
} else {
  try {
    // Ping PayChangu API to validate key
    const response = await fetch("https://api.paychangu.com/payment", {
      method: "GET",
      headers: { Authorization: `Bearer ${paychanguKey}`, "Content-Type": "application/json" },
    });
    if (response.status === 200 || response.status === 401 || response.status === 403) {
      if (response.status === 200) {
        ok("PayChangu API reachable and key valid");
        record("PayChangu", "ok", "API authenticated");
      } else {
        fail(`PayChangu returned ${response.status} — secret key may be invalid`);
        record("PayChangu", "fail", `HTTP ${response.status}`);
      }
    } else {
      warn(`PayChangu returned HTTP ${response.status}`);
      record("PayChangu", "warn", `HTTP ${response.status}`);
    }
  } catch (err: any) {
    warn(`PayChangu reachability test failed: ${err.message} (may be a network restriction)`);
    record("PayChangu", "warn", `Network: ${err.message}`);
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// 8. LOCAL SERVER HEALTH
// ─────────────────────────────────────────────────────────────────────────────
section("8. LOCAL SERVER — HTTP Health Checks");

const PORT = process.env.PORT || "3000";
const BASE = `http://localhost:${PORT}`;

const endpoints = [
  { name: "Health Check",    url: `${BASE}/health`,       expectedStatus: 200 },
  { name: "Listings API",    url: `${BASE}/api/listings`,  expectedStatus: 200 },
  { name: "Search API",      url: `${BASE}/api/search?q=room`, expectedStatus: 200 },
];

let serverRunning = false;

for (const ep of endpoints) {
  try {
    const res = await httpGet(ep.url);
    if (res.status === ep.expectedStatus) {
      ok(`${ep.name}: HTTP ${res.status} ✓`);
      try {
        const json = JSON.parse(res.body);
        if (ep.name === "Listings API") {
          dim(`     → ${json.total ?? json.data?.length ?? "?"} listings returned`);
        }
        if (ep.name === "Health Check") {
          dim(`     → status: ${json.status}, time: ${json.timestamp}`);
        }
      } catch { /* not JSON */ }
      serverRunning = true;
      record(ep.name, "ok", `HTTP ${res.status}`);
    } else {
      fail(`${ep.name}: expected ${ep.expectedStatus}, got ${res.status}`);
      record(ep.name, "fail", `HTTP ${res.status}`);
    }
  } catch (err: any) {
    if (err.message?.includes("ECONNREFUSED")) {
      fail(`${ep.name}: Server not running on port ${PORT} (ECONNREFUSED)`);
      record(ep.name, "fail", "Server not running");
    } else {
      fail(`${ep.name}: ${err.message}`);
      record(ep.name, "fail", err.message);
    }
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// FINAL REPORT
// ─────────────────────────────────────────────────────────────────────────────
console.log(`\n${BOLD}${CYAN}${"═".repeat(55)}${RESET}`);
console.log(`${BOLD}  LUNDAI PLATFORM — VALIDATION REPORT${RESET}`);
console.log(`${BOLD}${CYAN}${"═".repeat(55)}${RESET}\n`);

const statusIcon = { ok: `${GREEN}✅`, fail: `${RED}❌`, warn: `${YELLOW}⚠️ `, skip: `${DIM}⏭ ` };

for (const r of report) {
  console.log(`  ${statusIcon[r.status]}  ${BOLD}${r.service.padEnd(22)}${RESET} ${DIM}${r.detail}${RESET}`);
}

const oks    = report.filter(r => r.status === "ok").length;
const fails  = report.filter(r => r.status === "fail").length;
const warns  = report.filter(r => r.status === "warn").length;
const skips  = report.filter(r => r.status === "skip").length;

console.log(`\n  ${DIM}Summary: ${GREEN}${oks} OK${RESET}  ${RED}${fails} FAILED${RESET}  ${YELLOW}${warns} WARNINGS${RESET}  ${DIM}${skips} SKIPPED${RESET}`);

if (serverRunning) {
  console.log(`\n  ${GREEN}${BOLD}🚀 LUNDAI is OPERATIONAL at ${BASE}${RESET}`);
} else {
  console.log(`\n  ${RED}${BOLD}⚠️  Server not detected on port ${PORT}. Start with: npm run dev${RESET}`);
}

if (fails > 0) {
  console.log(`\n  ${YELLOW}Action needed:${RESET}`);
  report.filter(r => r.status === "fail").forEach(r => {
    console.log(`    • ${r.service}: ${r.detail}`);
  });
}

if (skips > 0) {
  console.log(`\n  ${DIM}Skipped services (add keys to .env to activate):${RESET}`);
  report.filter(r => r.status === "skip").forEach(r => {
    console.log(`    • ${r.service}`);
  });
}

console.log(`\n${BOLD}${CYAN}${"═".repeat(55)}${RESET}\n`);
