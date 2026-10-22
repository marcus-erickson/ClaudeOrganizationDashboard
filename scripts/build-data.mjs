#!/usr/bin/env node
/*
 * Build data/live-data.js for the Claude Organization Dashboard.
 *
 * Pulls usage from the Claude Enterprise Analytics API, joins it with your
 * roster (who has a seat and their role) and, optionally, the shared
 * self-report sheet, then writes data/live-data.js. The dashboard loads that
 * file automatically in place of the sample data.
 *
 * Requires Node 18 or newer. No npm packages.
 *
 *   ANTHROPIC_ANALYTICS_KEY=sk-ant-... node scripts/build-data.mjs \
 *     --roster data/roster.csv \
 *     --reports data/self-reports.csv        (or --reports https://...csv)
 *
 * Options:
 *   --roster <path>     CSV with email,name,role[,status]. Required.
 *   --reports <path|url> CSV of shared self-reports (see docs/SETUP.md). Optional.
 *   --attendance <path> CSV of training attendance: date,session,email. Optional.
 *   --since YYYY-MM-DD  Start of the history. Default: launchDate in config.js.
 *   --end YYYY-MM-DD    Last day of the period. Default: two days ago (UTC),
 *                       the latest day the Analytics API usually has.
 *   --days <n>          Period length. Default: periodDays from config.js.
 *   --out <path>        Output file. Default: data/live-data.js
 *
 * Environment:
 *   ANTHROPIC_ANALYTICS_KEY  API key with the read:analytics scope. Only the
 *                            Primary Owner can create it (claude.ai >
 *                            Organization settings > API).
 *   ANALYTICS_BASE_URL       Override the API base (used for testing).
 */
import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const BASE = (process.env.ANALYTICS_BASE_URL || "https://api.anthropic.com/v1/organizations/analytics").replace(/\/$/, "");
const KEY = process.env.ANTHROPIC_ANALYTICS_KEY;

/* ---------- arguments and config ---------- */

function args() {
  const out = {};
  const a = process.argv.slice(2);
  for (let i = 0; i < a.length; i++) {
    if (a[i].startsWith("--")) { out[a[i].slice(2)] = a[i + 1] && !a[i + 1].startsWith("--") ? a[++i] : true; }
  }
  return out;
}

function loadBrowserFile(file, globalName) {
  const sandbox = { window: {} };
  vm.runInNewContext(fs.readFileSync(file, "utf8"), sandbox, { filename: file });
  return sandbox.window[globalName];
}

const opts = args();
const CONFIG = loadBrowserFile(path.join(ROOT, "config.js"), "COACHING_CONFIG");
if (!KEY) fail("Set ANTHROPIC_ANALYTICS_KEY to an API key with the read:analytics scope.");
if (!opts.roster) fail("Pass --roster with a CSV of email,name,role[,status]. See docs/SETUP.md.");

function fail(msg) { console.error("Error: " + msg); process.exit(1); }
function log(msg) { console.log(msg); }

/* ---------- dates ---------- */

const day = (d) => d.toISOString().slice(0, 10);
const addDays = (s, n) => { const d = new Date(s + "T00:00:00Z"); d.setUTCDate(d.getUTCDate() + n); return day(d); };
const days = Number(opts.days || CONFIG.periodDays || 30);
const END = opts.end || addDays(day(new Date()), -2);
const START = addDays(END, -(days - 1));
const PREV_END = addDays(START, -1);
const PREV_START = addDays(PREV_END, -(days - 1));
const API_FLOOR = "2026-01-01"; // the Analytics API has no engagement data before this day
const LAUNCH = [opts.since || CONFIG.launchDate || API_FLOOR, API_FLOOR].sort().pop();
const monthKey = (d) => d.slice(0, 7);
const monthStart = (m) => m + "-01";
const monthLast = (m) => { const d = new Date(m + "-01T00:00:00Z"); d.setUTCMonth(d.getUTCMonth() + 1); d.setUTCDate(0); return day(d); };
function monthsBetween(a, b) {
  const out = [];
  let m = monthKey(a);
  while (m <= monthKey(b)) { out.push(m); m = monthKey(addDays(monthLast(m), 1)); }
  return out;
}

/* ---------- CSV ---------- */

function parseCsv(text) {
  const rows = [];
  let row = [], field = "", q = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (q) {
      if (c === '"' && text[i + 1] === '"') { field += '"'; i++; }
      else if (c === '"') q = false;
      else field += c;
    } else if (c === '"') q = true;
    else if (c === ",") { row.push(field); field = ""; }
    else if (c === "\n" || c === "\r") {
      if (c === "\r" && text[i + 1] === "\n") i++;
      row.push(field); field = "";
      if (row.some((x) => x.trim() !== "")) rows.push(row);
      row = [];
    } else field += c;
  }
  row.push(field);
  if (row.some((x) => x.trim() !== "")) rows.push(row);
  if (!rows.length) return [];
  const head = rows[0].map((h) => h.trim().toLowerCase().replace(/\s+/g, "_"));
  return rows.slice(1).map((r) => Object.fromEntries(head.map((h, i) => [h, (r[i] || "").trim()])));
}

async function readSource(src) {
  if (/^https?:\/\//.test(src)) {
    const res = await fetch(src);
    if (!res.ok) fail(`Could not download ${src}: HTTP ${res.status}`);
    return res.text();
  }
  return fs.readFileSync(path.resolve(src), "utf8");
}

// Dates from Google Sheets can arrive as text (2026-10-22), as a US date
// (10/22/2026) or as a serial number (46317) if the column was formatted as a date.
function normalizeDate(v) {
  const s = String(v || "").trim();
  if (/^\d{4}-\d{2}-\d{2}/.test(s)) return s.slice(0, 10);
  if (/^\d{5}(\.\d+)?$/.test(s)) return addDays("1899-12-30", Math.floor(Number(s)));
  const m = s.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
  if (m) return `${m[3]}-${m[1].padStart(2, "0")}-${m[2].padStart(2, "0")}`;
  return "";
}

const splitList = (s) => String(s || "").split(/;|\|/).map((x) => x.trim()).filter(Boolean);

/* ---------- API ---------- */

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

let lastCall = 0;
async function api(pathname, params) {
  // Stay under the 60 requests per minute limit.
  const wait = lastCall + 1050 - Date.now();
  if (wait > 0) await sleep(wait);
  lastCall = Date.now();
  const qs = new URLSearchParams();
  for (const [k, v] of Object.entries(params)) {
    if (Array.isArray(v)) v.forEach((x) => qs.append(k, x));
    else if (v != null) qs.append(k, v);
  }
  const url = `${BASE}${pathname}?${qs}`;
  for (let attempt = 0; attempt < 4; attempt++) {
    const res = await fetch(url, { headers: { "x-api-key": KEY, "anthropic-version": "2023-06-01" } });
    if (res.status === 429) { await sleep((Number(res.headers.get("retry-after")) || 5) * 1000); continue; }
    const body = await res.text();
    if (!res.ok) {
      const err = new Error(`${pathname} returned HTTP ${res.status}: ${body.slice(0, 300)}`);
      err.status = res.status;
      throw err;
    }
    return JSON.parse(body);
  }
  throw new Error(`${pathname}: rate limited too many times`);
}

async function getAll(pathname, params) {
  const rows = [];
  let page = null;
  do {
    const res = await api(pathname, { ...params, limit: 1000, page });
    rows.push(...(res.data || []));
    page = res.next_page || null;
  } while (page);
  return rows;
}

const range = (start, end) => ({ starting_date: start, ending_date: addDays(end, 1) }); // ending_date is exclusive

/* ---------- metric helpers ---------- */

function chatBlock(row) {
  // Activity can be recorded under chat_metrics or, for people on the unified
  // Chat and Cowork experience, under chat_cowork_unified_metrics.chat.
  const a = row.chat_metrics || {};
  const b = (row.chat_cowork_unified_metrics && row.chat_cowork_unified_metrics.chat) || {};
  const n = (k) => (Number(a[k]) || 0) + (Number(b[k]) || 0);
  return {
    chats: n("distinct_conversation_count"),
    messages: n("message_count"),
    projects: n("distinct_projects_used_count"),
    artifacts: n("distinct_artifacts_created_count") + (Number(row.cowork_metrics && row.cowork_metrics.artifacts_created_count) || 0),
    files: n("distinct_files_uploaded_count"),
    connectors: n("distinct_connectors_used_count")
  };
}
const emailOf = (row) => String((row.user && row.user.email_address) || row.email_address || "").toLowerCase();
const userIdOf = (row) => (row.user && row.user.id) || row.user_id || (row.group && row.group.user_id) || null;

/* ---------- main ---------- */

async function main() {
  log(`Period ${START} to ${END} (previous ${PREV_START} to ${PREV_END}). History from ${LAUNCH}.`);

  const roster = parseCsv(await readSource(opts.roster));
  if (!roster.length || !("email" in roster[0])) fail("The roster needs at least an email column, plus name and role.");
  log(`Roster: ${roster.length} people`);

  log("Fetching user activity...");
  const cur = await getAll("/users", range(START, END));
  const prev = await getAll("/users", range(PREV_START, PREV_END));
  // Weekly history back to launch: gives the 8-week trend and each person's first active week.
  log("Fetching weekly history (about one request per second)...");
  const weekEnds = [];
  for (let wEnd = END; addDays(wEnd, -6) >= LAUNCH || weekEnds.length < 8; wEnd = addDays(wEnd, -7)) {
    if (addDays(wEnd, -6) < API_FLOOR) break;
    weekEnds.unshift(wEnd);
  }
  const weeks = [];
  for (const wEnd of weekEnds) weeks.push(await getAll("/users", range(addDays(wEnd, -6), wEnd)));

  // Monthly history since launch, for the Rollout tab.
  log("Fetching monthly history...");
  const MONTHS = monthsBetween(LAUNCH, END);
  const monthRows = [];
  const monthSkills = [];
  const companyNames = new Set((CONFIG.companySkills || []).map((s) => s.name));
  for (const m of MONTHS) {
    const a = [monthStart(m), LAUNCH].sort().pop();
    const b = [monthLast(m), END].sort()[0];
    monthRows.push(await getAll("/users", range(a, b)));
    monthSkills.push(await getAll("/skills", { ...range(a, b), "group_by[]": ["user_id"] }));
  }

  const idToEmail = {};
  for (const r of cur.concat(prev, ...weeks, ...monthRows)) { const id = userIdOf(r); const e = emailOf(r); if (id && e) idToEmail[id] = e; }

  log("Fetching skill usage...");
  const skillRows = await getAll("/skills", { ...range(START, END), "group_by[]": ["user_id"] });
  const skillsByEmail = {};
  const runs = {};
  for (const r of skillRows) {
    const name = r.skill_display_name || r.skill_name;
    if (!companyNames.has(name) && !companyNames.has(r.skill_name)) continue;
    const key = companyNames.has(name) ? name : r.skill_name;
    runs[key] = (runs[key] || 0) + (Number(r.invocation_count) || 0);
    const email = idToEmail[userIdOf(r)] || emailOf(r);
    if (!email) continue;
    (skillsByEmail[email] = skillsByEmail[email] || new Set()).add(key);
  }

  // Connector names per person are a nice-to-have. If the endpoint is not
  // available on your plan or its path differs, the dashboard falls back to
  // the per-person connector count from the users endpoint.
  const connectorsByEmail = {};
  try {
    const rows = await getAll("/connectors", { ...range(START, END), "group_by[]": ["user_id"] });
    for (const r of rows) {
      const email = idToEmail[userIdOf(r)] || emailOf(r);
      const name = r.connector_display_name || r.connector_name || r.name;
      if (email && name) (connectorsByEmail[email] = connectorsByEmail[email] || new Set()).add(name);
    }
  } catch (e) {
    log(`Note: skipped connector names (${e.message.split(":")[0]}). Connector counts still come from user activity.`);
  }

  const index = (rows) => Object.fromEntries(rows.map((r) => [emailOf(r), r]));
  const curBy = index(cur), prevBy = index(prev), weekBy = weeks.map(index), monthBy = monthRows.map(index);
  const monthSkillCount = monthSkills.map((rows) => {
    const by = {};
    for (const r of rows) {
      const name = r.skill_display_name || r.skill_name;
      if (!companyNames.has(name) && !companyNames.has(r.skill_name)) continue;
      const email = idToEmail[userIdOf(r)] || emailOf(r);
      if (email) (by[email] = by[email] || new Set()).add(name);
    }
    return by;
  });

  const known = new Set(roster.map((r) => r.email.toLowerCase()));
  const extra = cur.filter((r) => emailOf(r) && !known.has(emailOf(r))).map((r) => ({ email: emailOf(r), name: "", role: "Unassigned" }));
  if (extra.length) log(`Note: ${extra.length} active people are not in the roster and will show as "Unassigned".`);

  const people = roster.concat(extra).map((r) => {
    const email = r.email.toLowerCase();
    const c = curBy[email] ? chatBlock(curBy[email]) : chatBlock({});
    const p = prevBy[email] ? chatBlock(prevBy[email]) : chatBlock({});
    // last_activity_date is left out when the organization hasn't enabled
    // last-activity reporting. Fall back to the end of the last week with chats.
    let lastActive = (curBy[email] && curBy[email].last_activity_date) || (prevBy[email] && prevBy[email].last_activity_date) || null;
    if (!lastActive) {
      for (let i = weekBy.length - 1; i >= 0; i--) {
        if (weekBy[i][email] && chatBlock(weekBy[i][email]).chats > 0) { lastActive = [weekEnds[i], END].sort()[0]; break; }
      }
    }
    const status = /pending|invited/i.test(r.status || "") ? "pending" : "active";
    return {
      id: email.replace(/@.*/, "").replace(/[^a-z0-9]+/g, "-"),
      name: r.name || email.replace(/@.*/, "").replace(/[._]/g, " ").replace(/\b\w/g, (x) => x.toUpperCase()),
      email,
      role: r.role || "Unassigned",
      status,
      lastActive,
      chats: c.chats,
      prevChats: p.chats,
      messages: c.messages,
      projects: c.projects,
      artifacts: c.artifacts,
      filesUploaded: c.files,
      connectorCount: c.connectors,
      connectorNames: [...(connectorsByEmail[email] || [])],
      skillNames: [...(skillsByEmail[email] || [])],
      weeklyChats: weekBy.slice(-8).map((w) => (w[email] ? chatBlock(w[email]).chats : 0)),
      seatDate: r.seat_date ? r.seat_date.slice(0, 10) : null,
      firstActive: (() => { const i = weekBy.findIndex((w) => w[email] && chatBlock(w[email]).chats > 0); return i < 0 ? null : addDays(weekEnds[i], -6); })(),
      monthly: MONTHS.map((m, i) => {
        if (r.seat_date && r.seat_date.slice(0, 10) > monthLast(m)) return null;
        const b = monthBy[i][email] ? chatBlock(monthBy[i][email]) : chatBlock({});
        return [b.chats, b.messages, b.projects, b.connectors, monthSkillCount[i][email] ? monthSkillCount[i][email].size : 0, b.artifacts];
      })
    };
  });

  let selfReports = [];
  if (opts.reports) {
    const roleByEmail = Object.fromEntries(people.map((p) => [p.email, p.role]));
    const nameByEmail = Object.fromEntries(people.map((p) => [p.email, p.name]));
    selfReports = parseCsv(await readSource(opts.reports))
      .map((r) => ({ ...r, date: normalizeDate(r.date) }))
      .filter((r) => r.date && r.date >= addDays(START, -7) && r.date <= addDays(END, 7))
      .map((r) => {
        const email = String(r.email || "").toLowerCase();
        const categories = {};
        for (const part of splitList(r.categories)) {
          const m = part.match(/^(.*?)[=:]\s*(\d+)$/);
          if (m) categories[m[1].trim()] = Number(m[2]);
        }
        return {
          date: r.date.slice(0, 10),
          email,
          name: r.name || nameByEmail[email] || email,
          role: r.role || roleByEmail[email] || "Unassigned",
          chats: Number(r.chats) || 0,
          activeDays: Number(r.active_days) || null,
          categories,
          features: splitList(r.features),
          topTasks: splitList(r.top_tasks),
          fellShort: r.fell_short || "",
          hoursSaved: r.hours_saved === undefined || r.hours_saved === "" ? null : Number(r.hours_saved)
        };
      });
    log(`Self-reports: ${selfReports.length} in this period`);
  }

  let training = [];
  if (opts.attendance) {
    training = parseCsv(await readSource(opts.attendance))
      .map((r) => ({ ...r, date: normalizeDate(r.date) }))
      .filter((r) => r.date && r.email)
      .map((r) => ({ date: r.date, session: r.session || "Training session", email: r.email.toLowerCase() }));
    log(`Training attendance: ${training.length} rows`);
  }

  const skills = (CONFIG.companySkills || []).map((s) => ({ name: s.name, audienceRoles: s.audienceRoles || [], runs: runs[s.name] || 0 }));

  const data = {
    source: "live",
    orgName: CONFIG.orgName,
    periodStart: START,
    periodEnd: END,
    months: MONTHS,
    training,
    generatedAt: new Date().toISOString(),
    skills,
    people,
    selfReports
  };
  const out = path.resolve(opts.out || path.join(ROOT, "data", "live-data.js"));
  fs.writeFileSync(out, "/* Generated by scripts/build-data.mjs. Contains names and usage for your organization: do not commit. */\nwindow.COACHING_DATA = " + JSON.stringify(data, null, 1) + ";\n");
  log(`Wrote ${path.relative(process.cwd(), out)}: ${people.length} people, ${selfReports.length} self-reports.`);

  // Checks for a first run against a real organization. Anything marked with
  // "!" is worth a look before you trust the dashboard.
  const apiEmails = new Set(cur.concat(prev).map(emailOf).filter(Boolean));
  const matched = roster.filter((r) => apiEmails.has(r.email.toLowerCase())).length;
  const withLast = cur.filter((r) => r.last_activity_date).length;
  const skillHits = Object.keys(runs);
  const unknownSkills = [...new Set(skillRows.map((r) => r.skill_display_name || r.skill_name).filter((n) => !companyNames.has(n)))].slice(0, 8);
  const flag = (ok) => (ok ? "  ok " : "  !  ");
  log("\nChecks");
  log(`${flag(cur.length > 0)}${cur.length} people with activity this period`);
  log(`${flag(matched >= roster.length * 0.5)}${matched} of ${roster.length} roster emails matched activity in the last two periods`);
  log(`${flag(withLast > 0 || !cur.length)}last_activity_date ${withLast ? "present" : "missing; using weekly activity instead (accurate to the week)"}`);
  log(`${flag(skillHits.length > 0)}${skillHits.length} of ${companyNames.size} company skills found in skill usage${skillHits.length ? "" : ". Check the names in config.js companySkills"}`);
  if (unknownSkills.length) log(`       Other skills seen (not counted as company skills): ${unknownSkills.join(", ")}`);
  log(`${flag(people.some((p) => p.firstActive))}first active dates found for ${people.filter((p) => p.firstActive).length} people`);
}

main().catch((e) => fail(e.message));
