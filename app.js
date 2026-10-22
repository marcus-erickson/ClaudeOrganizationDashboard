/*
 * Claude Organization Dashboard
 * Plain JavaScript, no build step and no dependencies. Reads:
 *   window.COACHING_CONFIG   (config.js)
 *   window.COACHING_PROGRAM  (data/program.js)
 *   window.COACHING_DATA     (data/sample-data.js, or data/live-data.js when present)
 */
(function () {
  "use strict";

  var C = window.COACHING_CONFIG;
  var P = window.COACHING_PROGRAM;
  var D = window.COACHING_DATA;
  var main = document.getElementById("main");

  if (!C || !P || !D) {
    main.innerHTML = '<div class="card"><h1>Dashboard data is missing</h1><p class="muted">Check that config.js, data/program.js and data/sample-data.js load next to index.html.</p></div>';
    return;
  }

  var T = C.thresholds;
  var WARN_FLAGS = ["pending", "inactive", "slowing", "oneShot", "noProjects", "noConnectors", "noSkills"];
  var FEATURES = ["Web search", "File uploads", "Artifacts", "Projects", "Company skills", "Connectors"];

  /* ---------- small helpers ---------- */

  function esc(v) {
    return String(v == null ? "" : v)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;").replace(/'/g, "&#39;");
  }
  function parseDay(s) { var p = s.split("-"); return new Date(Date.UTC(+p[0], +p[1] - 1, +p[2])); }
  function dayDiff(a, b) { return Math.round((parseDay(a) - parseDay(b)) / 86400000); }
  var MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  function fmtDay(s) { if (!s) return ""; var d = parseDay(s); return MONTHS[d.getUTCMonth()] + " " + d.getUTCDate(); }
  function addDays(s, n) { var d = parseDay(s); d.setUTCDate(d.getUTCDate() + n); return d.toISOString().slice(0, 10); }
  function pct(n, d) { return d ? Math.round((n / d) * 100) : 0; }
  function median(arr) {
    var a = arr.filter(function (x) { return typeof x === "number" && !isNaN(x); }).sort(function (x, y) { return x - y; });
    if (!a.length) return 0;
    var m = Math.floor(a.length / 2);
    return a.length % 2 ? a[m] : (a[m - 1] + a[m]) / 2;
  }
  function fmt1(n) { return (Math.round(n * 10) / 10).toFixed(1); }
  function initials(name) { return name.split(/\s+/).map(function (x) { return x[0] || ""; }).join("").slice(0, 2).toUpperCase(); }
  function fill(text, vars) {
    return String(text || "").replace(/\{(\w+)\}/g, function (m, k) { return vars[k] != null ? vars[k] : m; });
  }
  function lastActiveText(p) {
    if (p.status === "pending") return "Never";
    if (p.days == null) return "No activity";
    if (p.days <= 0) return "Today";
    if (p.days === 1) return "Yesterday";
    return p.days + " days ago";
  }
  function plural(n, one, many) { return n + " " + (n === 1 ? one : (many || one + "s")); }
  function textMatches(text, words) {
    var t = String(text || "").toLowerCase();
    return words.some(function (w) { return t.indexOf(String(w).toLowerCase()) !== -1; });
  }

  var store = {
    mem: {},
    get: function (k, dflt) {
      try { var v = window.localStorage.getItem(k); if (v != null) return JSON.parse(v); } catch (e) { /* storage unavailable */ }
      return this.mem[k] != null ? this.mem[k] : dflt;
    },
    set: function (k, v) {
      this.mem[k] = v;
      try { window.localStorage.setItem(k, JSON.stringify(v)); } catch (e) { /* storage unavailable */ }
    }
  };

  function toast(msg) {
    var old = document.querySelector(".toast");
    if (old) old.remove();
    var t = document.createElement("div");
    t.className = "toast";
    t.setAttribute("role", "status");
    t.textContent = msg;
    document.body.appendChild(t);
    setTimeout(function () { t.remove(); }, 3200);
  }
  function copyText(text, msg) {
    function fallback() {
      var ta = document.createElement("textarea");
      ta.value = text; ta.setAttribute("readonly", ""); ta.style.position = "fixed"; ta.style.opacity = "0";
      document.body.appendChild(ta); ta.select();
      try { document.execCommand("copy"); toast(msg); } catch (e) { toast("Copy failed. Select and copy manually."); }
      ta.remove();
    }
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(function () { toast(msg); }, fallback);
    } else { fallback(); }
  }

  /* ---------- model ---------- */

  var END = D.periodEnd;
  var START = D.periodStart || addDays(END, -(C.periodDays - 1));
  var EMAIL_TO_ID = {};

  var people = D.people.map(function (raw) {
    var p = Object.assign({}, raw);
    p.id = p.id || String(p.email || p.name).toLowerCase().replace(/[^a-z0-9]+/g, "-");
    EMAIL_TO_ID[String(p.email || "").toLowerCase()] = p.id;
    p.skillNames = p.skillNames || [];
    p.connectorNames = p.connectorNames || [];
    p.weeklyChats = p.weeklyChats || [];
    p.skills = p.skillNames.length;
    p.connectors = p.connectorNames.length || p.connectorCount || 0;
    p.days = p.lastActive ? Math.max(0, dayDiff(END, p.lastActive)) : null;
    p.mpc = p.chats ? p.messages / p.chats : 0;
    p.isPending = p.status === "pending";
    p.isActive = !p.isPending && p.chats > 0 && p.days != null && p.days < T.inactiveDays;
    p.steps = [p.chats > 0, p.projects > 0, p.connectors > 0, p.skills > 0, p.artifacts >= T.powerUserMinArtifacts];
    if (!p.isActive) { p.stage = 0; }
    else { p.stage = 1; for (var i = 1; i < 5; i++) { if (p.steps[i]) p.stage = i + 1; else break; } }
    p.stageName = p.isPending ? "Invite pending" : (p.stage === 0 ? "Inactive" : C.stages[p.stage - 1].name);
    p.weeklyActive = (p.weeklyChats[p.weeklyChats.length - 1] || 0) > 0;
    return p;
  });
  var byId = {};
  people.forEach(function (p) { byId[p.id] = p; });
  var active = people.filter(function (p) { return p.isActive; });

  // Champions: top N% of active people by chats who reached the minimum stage.
  var ranked = active.slice().sort(function (a, b) { return b.chats - a.chats; });
  var topN = Math.max(1, Math.ceil(active.length * T.championTopPct / 100));
  var topIds = {};
  ranked.slice(0, topN).forEach(function (p) { topIds[p.id] = true; });

  people.forEach(function (p) {
    var f = {};
    f.pending = p.isPending;
    f.inactive = !p.isPending && !p.isActive;
    f.slowing = p.isActive && p.prevChats >= T.slowingMinPriorChats && p.chats <= p.prevChats * (1 - T.slowingDropPct / 100);
    f.oneShot = p.isActive && p.chats >= T.oneShotMinChats && p.mpc < T.oneShotMaxMessagesPerChat;
    f.noProjects = p.isActive && p.projects === 0;
    f.noConnectors = p.isActive && p.connectors === 0;
    f.noSkills = p.isActive && p.skills === 0;
    f.champion = !!topIds[p.id] && p.stage >= T.championMinStage;
    p.flags = f;
    p.warnFlags = WARN_FLAGS.filter(function (k) { return f[k]; });
    p.needsCoaching = p.warnFlags.length > 0;
  });

  var METRICS = [
    { key: "chats", label: "Chats" },
    { key: "mpc", label: "Messages per chat", dec: true },
    { key: "projects", label: "Projects used" },
    { key: "artifacts", label: "Artifacts created" },
    { key: "skills", label: "Company skills run" },
    { key: "connectors", label: "Connectors used" }
  ];
  function medians(list) {
    var m = {};
    METRICS.forEach(function (x) { m[x.key] = median(list.map(function (p) { return p[x.key]; })); });
    return m;
  }
  var coMed = medians(active);
  var roleMed = {};
  var roles = [];
  people.forEach(function (p) { if (roles.indexOf(p.role) === -1) roles.push(p.role); });
  roles.forEach(function (r) {
    var list = active.filter(function (p) { return p.role === r; });
    roleMed[r] = list.length ? medians(list) : coMed;
  });

  // Self-reports in the current period, newest per person.
  var reports = [];
  var seenReport = {};
  (D.selfReports || []).slice().sort(function (a, b) { return a.date < b.date ? 1 : -1; }).forEach(function (r) {
    var key = String(r.email || r.name).toLowerCase();
    if (seenReport[key]) return;
    seenReport[key] = true;
    r.personId = EMAIL_TO_ID[String(r.email || "").toLowerCase()] || null;
    reports.push(r);
  });
  var reportByPerson = {};
  reports.forEach(function (r) { if (r.personId) reportByPerson[r.personId] = r; });

  function roleUsage(role, excludeId) {
    var peers = people.filter(function (p) { return p.role === role && p.id !== excludeId; });
    var counts = {};
    peers.forEach(function (p) {
      p.skillNames.forEach(function (s) { counts["s|" + s] = (counts["s|" + s] || 0) + 1; });
      p.connectorNames.forEach(function (s) { counts["c|" + s] = (counts["c|" + s] || 0) + 1; });
    });
    return Object.keys(counts).map(function (k) {
      return { kind: k[0] === "s" ? "Skill" : "Connector", name: k.slice(2), users: counts[k], of: peers.length };
    }).sort(function (a, b) { return b.users - a.users; });
  }

  function skillAdoption() {
    return (D.skills || C.companySkills || []).map(function (s) {
      var aud = s.audienceRoles && s.audienceRoles.length ? people.filter(function (p) { return s.audienceRoles.indexOf(p.role) !== -1; }) : people;
      var users = aud.filter(function (p) { return p.skillNames.indexOf(s.name) !== -1; }).length;
      var share = pct(users, aud.length);
      var audLabel = s.audienceRoles && s.audienceRoles.length ? s.audienceRoles.join(", ") : "Everyone";
      return { name: s.name, runs: s.runs, users: users, size: aud.length, share: share, audLabel: audLabel, low: share < T.lowSkillAdoptionPct };
    }).sort(function (a, b) { return b.share - a.share; });
  }

  function categoryTotals(list) {
    var totals = {};
    var work = 0, all = 0;
    list.forEach(function (r) {
      Object.keys(r.categories || {}).forEach(function (c) {
        var v = +r.categories[c] || 0;
        all += v;
        if (c === "Personal") return;
        var key = C.categories.indexOf(c) !== -1 ? c : "Other";
        totals[key] = (totals[key] || 0) + v;
        work += v;
      });
    });
    return { totals: totals, work: work, all: all };
  }

  /* ---------- shared bits ---------- */

  function seg(n, big) {
    var s = '<span class="seg' + (big ? " seg-lg" : "") + '" aria-hidden="true">';
    for (var i = 1; i <= 5; i++) s += '<span class="' + (i <= n ? "on" : "") + '"></span>';
    return s + "</span>";
  }
  function flagPills(p) {
    var h = "";
    if (p.flags.champion) h += '<span class="pill pill-accent">' + esc(P.coaching.champion.label) + "</span>";
    p.warnFlags.forEach(function (k) {
      var label = P.coaching[k].label;
      if (k === "inactive") label = p.days == null ? "No activity" : "Inactive " + p.days + " days";
      h += '<span class="pill pill-warn">' + esc(label) + "</span>";
    });
    return '<div class="chips" style="gap:4px">' + (h || '<span class="muted small">None</span>') + "</div>";
  }
  function bar(share, cls) {
    return '<div class="bar ' + (cls || "") + '"><span style="width:' + Math.max(0, Math.min(100, share)) + '%"></span></div>';
  }
  function thresholdVars() {
    var v = Object.assign({}, T);
    v.inactiveDays = T.inactiveDays;
    return v;
  }
  function emailsFor(list) {
    return list.map(function (p) { return p.email; }).filter(Boolean).join(", ");
  }
  function flagFilter(key) {
    if (key === "all") return function () { return true; };
    if (key === "coach") return function (p) { return p.needsCoaching; };
    if (key === "champ" || key === "champion") return function (p) { return p.flags.champion; };
    if (key === "idle") return function (p) { return p.flags.inactive || p.flags.pending; };
    if (key === "stage-0") return function (p) { return !p.isActive; };
    if (/^stage-\d$/.test(key)) { var n = +key.slice(6); return function (p) { return p.isActive && (n === 4 ? p.stage >= 4 : p.stage === n); }; }
    if (P.coaching[key]) return function (p) { return !!p.flags[key]; };
    if (key.indexOf("role:") === 0) { var r = key.slice(5); return function (p) { return p.role === r; }; }
    return function () { return true; };
  }
  function filterLabel(key) {
    if (P.coaching[key]) return P.coaching[key].label;
    if (/^stage-\d$/.test(key)) { var n = +key.slice(6); return n === 0 ? "Inactive or pending" : (n === 4 ? "Reusing and power users" : C.stages[n - 1].name); }
    if (key.indexOf("role:") === 0) return key.slice(5);
    return key;
  }

  /* ---------- views ---------- */

  function viewOverview() {
    var pending = people.filter(function (p) { return p.isPending; }).length;
    var weekly = people.filter(function (p) { return p.weeklyActive; }).length;
    var withP = active.filter(function (p) { return p.projects > 0; }).length;
    var withS = active.filter(function (p) { return p.skills > 0; }).length;
    var withC = active.filter(function (p) { return p.connectors > 0; }).length;
    var kpis = [
      ["Seats", people.length, plural(pending, "invite") + " pending"],
      ["Weekly active", weekly, pct(weekly, people.length) + "% of seats"],
      ["Messages per chat", fmt1(coMed.mpc), "Median of active people"],
      ["Using Projects", pct(withP, active.length) + "%", withP + " of " + active.length + " active people"],
      ["Using company skills", pct(withS, active.length) + "%", withS + " of " + active.length + " active people"],
      ["Using connectors", pct(withC, active.length) + "%", withC + " of " + active.length + " active people"],
      ["Self-reports shared", reports.length, pct(reports.length, people.length) + "% of seats this period"]
    ];
    var h = '<div class="page-head"><h1>' + esc(C.labels.overviewHeading) + "</h1><p>" + esc(C.labels.overviewSubheading) + "</p></div>";
    h += '<section aria-label="Key numbers" class="grid grid-kpi">' + kpis.map(function (k) {
      return '<div class="kpi"><div class="label">' + esc(k[0]) + '</div><div class="value">' + esc(k[1]) + '</div><div class="sub">' + esc(k[2]) + "</div></div>";
    }).join("") + "</section>";

    // Coaching queue
    var tv = thresholdVars();
    var keys = WARN_FLAGS.concat(["champion"]);
    var cards = keys.map(function (k) {
      var list = people.filter(function (p) { return p.flags[k]; });
      if (!list.length && k === "pending") return "";
      var q = P.coaching[k].queue;
      var good = k === "champion";
      return '<div class="subcard"><div class="card-title"><span class="count ' + (good ? "count-good" : "count-warn") + '">' + list.length + "</span>" + esc(P.coaching[k].label) + "</div>" +
        '<div class="small muted">' + esc(fill(q.signal, tv)) + "</div>" +
        '<div class="small"><span class="strong">Action: </span>' + esc(fill(q.action, tv)) + "</div>" +
        '<div class="actions" style="margin-top:auto">' +
        (list.length ? '<button type="button" class="btn btn-primary" data-action="copy-emails" data-filter="' + k + '" title="' + esc(q.cta) + ': copies the email addresses of everyone with this flag">Copy emails</button>' : "") +
        '<a class="btn" href="#/people?f=' + k + '">See people</a></div></div>';
    }).join("");
    h += '<section class="card" aria-labelledby="q-h"><div class="section-head"><h2 id="q-h">Coaching queue</h2><span class="note">Each card is a rule. Copy the emails to send the action to everyone at once, or open the list.</span></div><div class="grid grid-cards">' + cards + "</div></section>";

    // What people use Claude for
    var ct = categoryTotals(reports);
    var cats = Object.keys(ct.totals).map(function (c) { return { name: c, n: ct.totals[c], share: pct(ct.totals[c], ct.work) }; })
      .sort(function (a, b) { return b.n - a.n; });
    var maxShare = cats.length ? cats[0].share : 1;
    var usesBody = !reports.length
      ? '<div class="empty">No self-reports yet. Share the claude-self-report skill so people can send a summary of what they use Claude for.</div>'
      : cats.map(function (c) {
        var skill = C.categorySkills[c.name];
        var tag = skill ? '<span class="mono muted">' + esc(skill) + "</span>"
          : (c.name !== "Other" && c.share >= T.skillOpportunityMinSharePct ? '<span class="pill pill-warn">Skill opportunity</span>' : "");
        return '<div class="barrow"><span class="strong" style="font-weight:500">' + esc(c.name) + "</span>" +
          bar(Math.round(c.share / maxShare * 100)) + '<span class="small" style="text-align:right">' + c.share + '%</span><span class="tag">' + tag + "</span></div>";
      }).join("");
    h += '<section class="card" aria-labelledby="u-h"><div class="section-head"><h2 id="u-h">What people use Claude for</h2><span class="note">From ' +
      plural(reports.length, "self-report") + " covering " + ct.all + " chats (personal chats excluded). \"Skill opportunity\" marks common work with no shared skill yet.</span>" +
      '<a class="btn" href="#/uses">Use cases by role</a></div><div style="display:flex;flex-direction:column;gap:10px">' + usesBody + "</div></section>";

    // Skills + roles
    var sk = skillAdoption();
    var skillRows = sk.map(function (s) {
      var action = s.low ? "Low adoption. Demo it, fix it, or retire it." : "Healthy. Promote to people who haven't tried it.";
      return "<tr><td class=\"mono\">" + esc(s.name) + '</td><td><div style="display:flex;align-items:center;gap:8px">' + bar(s.share, "bar-sm") +
        '<span class="small">' + s.users + " of " + s.size + ' <span class="muted">(' + esc(s.audLabel) + ")</span></span></div></td>" +
        '<td class="num">' + esc(s.runs) + '</td><td class="small ' + (s.low ? "strong" : "text-2") + '" style="' + (s.low ? "color:var(--warn)" : "") + '">' + esc(action) + "</td></tr>";
    }).join("");
    var roleRows = roles.map(function (r) {
      var list = people.filter(function (p) { return p.role === r; });
      return { role: r, share: pct(list.filter(function (p) { return p.weeklyActive; }).length, list.length), n: list.length };
    }).sort(function (a, b) { return b.share - a.share; });
    var lowest = roleRows[roleRows.length - 1];
    h += '<div class="row"><section class="card grow" aria-labelledby="s-h"><div><h2 id="s-h">Company skills adoption</h2><p class="small muted" style="margin-top:4px">Share of each skill\'s intended audience who ran it this period. Counts only explicit runs, not installs.</p></div>' +
      '<div class="table-box"><table class="wide-600"><thead><tr><th scope="col">Skill</th><th scope="col">People using it</th><th scope="col" class="num">Runs</th><th scope="col">Suggested action</th></tr></thead><tbody>' + skillRows + "</tbody></table></div></section>" +
      '<section class="card side" aria-labelledby="t-h" style="gap:12px"><div><h2 id="t-h">Weekly active by role</h2><p class="small muted" style="margin-top:4px">Share of each role\'s seats active in the latest week.</p></div>' +
      roleRows.map(function (r) {
        return '<a class="teamrow" style="color:inherit;text-decoration:none" href="#/people?f=' + encodeURIComponent("role:" + r.role) + '"><span>' + esc(r.role) + " <span class=\"muted\">(" + r.n + ")</span></span>" + bar(r.share) + '<span style="text-align:right">' + r.share + "%</span></a>";
      }).join("") +
      (lowest ? '<p class="small text-2">Lowest: ' + esc(lowest.role) + '. <a href="#/training">See the training plan</a>.</p>' : "") + "</section></div>";
    return h;
  }

  var peopleState = { sort: "chats", dir: -1, q: "" };

  function peopleRows(filterKey) {
    var f = flagFilter(filterKey);
    var q = peopleState.q.toLowerCase();
    var list = people.filter(function (p) {
      return f(p) && (!q || (p.name + " " + p.role + " " + (p.email || "")).toLowerCase().indexOf(q) !== -1);
    });
    var k = peopleState.sort, dir = peopleState.dir;
    list.sort(function (a, b) {
      var x = a[k], y = b[k];
      if (k === "days") { x = x == null ? 9999 : x; y = y == null ? 9999 : y; }
      if (typeof x === "string") return x.localeCompare(y) * dir;
      return ((x || 0) - (y || 0)) * dir;
    });
    return list;
  }

  function peopleTableBody(list) {
    if (!list.length) return '<tr><td colspan="11" class="empty">Nobody matches this filter.</td></tr>';
    return list.map(function (p) {
      var r = reportByPerson[p.id];
      return "<tr><td style=\"white-space:nowrap\"><a class=\"strong\" href=\"#/person/" + encodeURIComponent(p.id) + "\">" + esc(p.name) + '</a><div class="small muted">' + esc(p.role) + "</div></td>" +
        '<td style="white-space:nowrap" class="text-2">' + esc(lastActiveText(p)) + "</td>" +
        '<td class="num">' + p.chats + '</td><td class="num">' + (p.chats ? fmt1(p.mpc) : "–") + '</td><td class="num">' + p.projects + "</td>" +
        '<td class="num">' + p.artifacts + '</td><td class="num">' + p.skills + '</td><td class="num">' + p.connectors + "</td>" +
        '<td class="small text-2" style="white-space:nowrap">' + (r ? "Shared " + esc(fmtDay(r.date)) : "Not yet") + "</td>" +
        '<td style="white-space:nowrap"><span style="display:inline-flex;align-items:center;gap:8px">' + seg(p.stage) + '<span class="small">' + esc(p.stageName) + "</span></span></td>" +
        "<td>" + flagPills(p) + "</td></tr>";
    }).join("");
  }

  var COLS = [
    ["name", "Person"], ["days", "Last active"], ["chats", "Chats", 1], ["mpc", "Msgs / chat", 1], ["projects", "Projects", 1],
    ["artifacts", "Artifacts", 1], ["skills", "Company skills", 1], ["connectors", "Connectors", 1], [null, "Self-report"], ["stage", "Stage"], [null, "Coaching flags"]
  ];

  function viewPeople(params) {
    var fk = params.f || "all";
    var std = [["all", "Everyone"], ["coach", "Needs coaching"], ["champ", "Champions"], ["idle", "Inactive seats"]];
    var chips = std.map(function (c) {
      var n = people.filter(flagFilter(c[0])).length;
      return '<button type="button" class="chip" data-action="filter" data-filter="' + c[0] + '" aria-pressed="' + (fk === c[0]) + '">' + esc(c[1]) + " (" + n + ")</button>";
    }).join("");
    if (std.map(function (c) { return c[0]; }).indexOf(fk) === -1) {
      chips += '<button type="button" class="chip" data-action="filter" data-filter="all" aria-pressed="true" title="Clear this filter">' + esc(filterLabel(fk)) + " (" + people.filter(flagFilter(fk)).length + ") ✕</button>";
    }
    var list = peopleRows(fk);
    var head = COLS.map(function (c) {
      var cls = c[2] ? ' class="num"' : "";
      if (!c[0]) return "<th scope=\"col\"" + cls + ">" + c[1] + "</th>";
      var sorted = peopleState.sort === c[0];
      var aria = sorted ? (peopleState.dir === 1 ? "ascending" : "descending") : "none";
      return "<th scope=\"col\"" + cls + ' aria-sort="' + aria + '"><button type="button" data-action="sort" data-key="' + c[0] + '">' + c[1] + (sorted ? (peopleState.dir === 1 ? " ▲" : " ▼") : "") + "</button></th>";
    }).join("");
    return '<div class="page-head"><h1>People</h1><p>Click anyone to open their coaching plan. Click a column heading to sort.</p></div>' +
      '<section class="card" aria-label="People list"><div style="display:flex;flex-wrap:wrap;align-items:center;gap:12px 16px">' +
      '<div class="chips" role="group" aria-label="Filter people">' + chips + "</div>" +
      '<div style="margin-left:auto;display:flex;flex-wrap:wrap;align-items:center;gap:8px"><label for="search" class="muted" style="font-weight:500">Search</label>' +
      '<input id="search" type="search" placeholder="Name or role" value="' + esc(peopleState.q) + '">' +
      '<button type="button" class="btn" data-action="copy-emails" data-filter="' + esc(fk) + '">Copy emails</button>' +
      '<button type="button" class="btn" data-action="export-csv" data-filter="' + esc(fk) + '">Export CSV</button></div></div>' +
      '<div class="table-box"><table class="wide-1100"><thead><tr>' + head + '</tr></thead><tbody id="people-body">' + peopleTableBody(list) + "</tbody></table></div>" +
      '<div class="small muted" id="people-count">Showing ' + list.length + " of " + people.length + " seats.</div></section>";
  }

  function planFor(p) {
    var ru = roleUsage(p.role, p.id).filter(function (u) { return u.kind === "Skill"; });
    var roleSkill = ru.length ? ru[0].name : ((D.skills || [])[0] || {}).name || "a company skill";
    var vars = Object.assign(thresholdVars(), {
      name: p.name, firstName: p.name.split(" ")[0], role: p.role, chats: p.chats, mpc: fmt1(p.mpc),
      days: p.days == null ? "30+" : p.days, roleSkill: roleSkill, roleSkillUsers: ru.length ? ru[0].users + " of " + ru[0].of : "others"
    });
    var keys = p.warnFlags.slice();
    if (p.flags.champion) keys.push("champion");
    return keys.map(function (k) {
      var t = P.coaching[k].plan;
      return { key: k, title: fill(t.title, vars), why: fill(t.why, vars), action: fill(t.action, vars), cta: fill(t.cta, vars) };
    });
  }

  function planText(p, plan) {
    var lines = ["Claude coaching plan: " + p.name + " (" + p.role + ")", "Stage: " + p.stageName, ""];
    plan.forEach(function (a, i) {
      lines.push((i + 1) + ". " + a.title);
      lines.push("   What we see: " + a.why);
      lines.push("   Next step: " + a.action);
    });
    return lines.join("\n");
  }

  function viewPerson(id) {
    var p = byId[id];
    if (!p) return '<div class="card"><h1>Person not found</h1><p><a href="#/people">Back to people</a></p></div>';
    var rm = roleMed[p.role] || coMed;
    var plan = planFor(p);
    var done = store.get("ccd:done:" + p.id, {});
    var notes = store.get("ccd:notes:" + p.id, []);
    var r = reportByPerson[p.id];

    var h = '<a href="#/people" class="btn btn-link" style="align-self:flex-start">← All people</a>';
    h += '<section class="card" aria-label="Person summary" style="flex-direction:row;flex-wrap:wrap;align-items:center;gap:20px 32px">' +
      '<div class="avatar" aria-hidden="true">' + esc(initials(p.name)) + "</div>" +
      '<div style="flex:1 1 280px"><h1 style="font-size:26px">' + esc(p.name) + '</h1><div class="muted" style="margin-top:2px">' + esc(p.role) + " · Last active " + esc(lastActiveText(p).toLowerCase()) + " · Self-report: " + (r ? "shared " + esc(fmtDay(r.date)) : "not shared") + "</div></div>" +
      '<div style="display:flex;flex-direction:column;gap:6px;min-width:220px"><div class="small muted" style="font-weight:500">Adoption stage</div><div style="display:flex;align-items:center;gap:10px">' + seg(p.stage, true) + '<span class="strong">' + esc(p.stageName) + " (" + p.stage + " of 5)</span></div></div>" +
      '<div class="actions">' +
      (p.email ? '<a class="btn btn-primary btn-lg" href="mailto:' + esc(p.email) + "?subject=" + encodeURIComponent("Getting more out of Claude") + "&body=" + encodeURIComponent(planText(p, plan)) + '">Email coaching note</a>' : "") +
      '<button type="button" class="btn btn-lg" data-action="copy-plan" data-id="' + esc(p.id) + '">Copy plan</button></div></section>';

    h += '<section class="card" aria-labelledby="lad-h"><h2 id="lad-h">Adoption ladder</h2><div class="grid grid-ladder">' + C.stages.map(function (s, i) {
      var ev = [
        p.chats ? p.chats + " chats this period" : "No chats this period",
        p.projects ? plural(p.projects, "Project") + " used" : "No Projects used",
        p.connectors ? (p.connectorNames.length ? p.connectorNames.join(", ") : plural(p.connectors, "connector")) : "No connectors used",
        p.skills ? p.skillNames.join(", ") : "No company skills run",
        p.artifacts + " artifacts created" + (p.steps[4] ? "" : " (needs " + T.powerUserMinArtifacts + ")")
      ][i];
      var ok = p.steps[i];
      return '<div class="ladder-step ' + (ok ? "done" : "todo") + '"><div style="display:flex;align-items:center;gap:8px">' +
        (ok ? '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="color:var(--accent)" role="img" aria-label="Reached"><path d="M20 6L9 17l-5-5"/></svg>'
          : '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="color:var(--muted)" role="img" aria-label="Not yet"><circle cx="12" cy="12" r="8"/></svg>') +
        '<span class="strong">' + (i + 1) + ". " + esc(s.step) + '</span></div><div class="small text-2">' + esc(s.desc) + '</div><div class="ev">' + esc(ev) + "</div></div>";
    }).join("") + "</div></section>";

    h += '<section aria-labelledby="met-h" style="display:flex;flex-direction:column;gap:12px"><div class="section-head"><h2 id="met-h">Compared with the company</h2><span class="note">Their number, then the median for active people company-wide and in their role.</span></div><div class="grid grid-kpi">' +
      METRICS.map(function (m) {
        var v = p[m.key], f = function (x) { return m.dec ? (x ? fmt1(x) : "–") : String(Math.round(x * 10) / 10); };
        var cmp = v > coMed[m.key] ? '<span class="compare" style="color:var(--accent-strong)">Above median</span>' : (v < coMed[m.key] ? '<span class="compare" style="color:var(--warn)">Below median</span>' : "");
        return '<div class="kpi"><div class="label">' + m.label + '</div><div style="display:flex;align-items:baseline;gap:8px"><span class="value" style="font-size:26px">' + f(v) + "</span>" + cmp + '</div><div class="sub">Company ' + f(coMed[m.key]) + " · Role " + f(rm[m.key]) + "</div></div>";
      }).join("") + "</div></section>";

    var doneCount = plan.filter(function (a) { return done[a.key]; }).length;
    var planHtml = plan.length ? plan.map(function (a, i) {
      var isDone = !!done[a.key];
      return '<div class="subcard"><div style="display:flex;flex-wrap:wrap;align-items:center;gap:8px 12px"><span class="small strong muted">Step ' + (i + 1) + '</span><span class="strong" style="font-size:15px;flex:1 1 240px">' + esc(a.title) + "</span>" +
        (isDone ? '<span class="pill pill-accent">Done</span>' : (a.key === "champion" ? '<span class="pill pill-accent">Opportunity</span>' : '<span class="pill pill-warn">Open</span>')) + "</div>" +
        '<div class="small text-2"><span class="strong">What we see: </span>' + esc(a.why) + '</div><div class="small text-2"><span class="strong">Suggested action: </span>' + esc(a.action) + "</div>" +
        '<div class="actions"><button type="button" class="btn" data-action="toggle-done" data-id="' + esc(p.id) + '" data-key="' + a.key + '">' + (isDone ? "Reopen" : "Mark done") + "</button></div></div>";
    }).join("") : '<div class="empty">No coaching flags this period. Consider asking ' + esc(p.name.split(" ")[0]) + " to help a teammate.</div>";

    var labels = [];
    for (var w = 0; w < 8; w++) labels.push(addDays(END, -7 * (8 - w) + 1));
    var wk = p.weeklyChats.length ? p.weeklyChats : [0, 0, 0, 0, 0, 0, 0, 0];
    var mx = Math.max.apply(null, wk.concat([1]));
    var chart = '<div class="chart" role="img" aria-label="Chats per week for the last ' + wk.length + ' weeks: ' + wk.join(", ") + '">' + wk.map(function (v, i) {
      return '<div class="col' + (i < wk.length - 4 ? " prev" : "") + '"><span>' + v + '</span><div style="height:' + Math.round(v / mx * 95) + 'px"></div></div>';
    }).join("") + '</div><div style="display:flex;justify-content:space-between" class="small muted"><span>' + esc(fmtDay(labels[0])) + "</span><span>" + esc(fmtDay(labels[7])) + '</span></div><div class="small muted">Lighter bars are the previous period.</div>';

    var ru = roleUsage(p.role, p.id).slice(0, 5);
    var ruHtml = ru.length ? ru.map(function (u) {
      var mine = u.kind === "Skill" ? p.skillNames.indexOf(u.name) !== -1 : p.connectorNames.indexOf(u.name) !== -1;
      return '<div style="display:flex;align-items:center;gap:10px"><span class="mono" style="flex:1 1 auto">' + esc(u.name) + '</span><span class="small muted">' + u.kind + '</span><span class="small strong" style="white-space:nowrap">' + u.users + " of " + u.of + "</span>" + (mine ? '<span class="pill pill-accent">Uses</span>' : '<span class="pill pill-muted">Not yet</span>') + "</div>";
    }).join("") : '<div class="small muted">Nobody else in this role yet.</div>';

    var rep = r ? (function () {
      var top = Object.keys(r.categories || {}).filter(function (c) { return c !== "Personal"; }).sort(function (a, b) { return r.categories[b] - r.categories[a]; }).slice(0, 3);
      return '<div class="small"><span class="strong">Top uses: </span>' + esc(top.join(", ")) + '</div><div class="small"><span class="strong">Repeats: </span>' + esc((r.topTasks || []).join("; ")) + '</div><div class="small"><span class="strong">Fell short: </span>' + esc(r.fellShort || "") + '</div><a href="#/report/' + encodeURIComponent(p.id) + '" class="small">See the full self-report</a>';
    })() : '<div class="small muted">Not shared this period. Use cases only show up when people choose to share.</div>';

    h += '<div class="row"><section class="card grow" aria-labelledby="plan-h"><div class="section-head"><h2 id="plan-h">Coaching plan</h2><span class="note">' + doneCount + " of " + plan.length + " done. Saved in this browser.</span></div>" + planHtml + "</section>" +
      '<div class="side"><section class="card" aria-labelledby="wk-h" style="gap:10px"><h2 id="wk-h">Chats per week</h2>' + chart + "</section>" +
      '<section class="card" aria-labelledby="rp-h" style="gap:8px"><h2 id="rp-h">From their self-report</h2>' + rep + "</section>" +
      '<section class="card" aria-labelledby="tm-h" style="gap:10px"><h2 id="tm-h">Others in this role use</h2>' + ruHtml + "</section>" +
      '<section class="card" aria-labelledby="nt-h" style="gap:10px"><h2 id="nt-h">Coaching notes</h2>' +
      (notes.length ? notes.map(function (n) { return '<div style="display:flex;gap:10px"><span class="small muted" style="min-width:52px">' + esc(fmtDay(n.date)) + '</span><span class="small">' + esc(n.text) + "</span></div>"; }).join("") : '<div class="small muted">No notes yet.</div>') +
      '<label for="note">Add a note</label><textarea id="note" rows="3" placeholder="What did you talk about?"></textarea>' +
      '<div class="actions"><button type="button" class="btn" data-action="save-note" data-id="' + esc(p.id) + '">Save note</button><span class="small muted" style="align-self:center">Notes stay in this browser.</span></div></section></div></div>';
    return h;
  }

  function heatTone(v) {
    if (v === 0) return ["var(--heat-0)", "var(--muted)"];
    if (v < 10) return ["var(--heat-1)", "var(--heat-ink-dark)"];
    if (v < 20) return ["var(--heat-2)", "var(--heat-ink-dark)"];
    if (v < 35) return ["var(--heat-3)", "var(--heat-ink-dark)"];
    return ["var(--heat-4)", "var(--heat-ink-light)"];
  }

  function viewUses() {
    var h = '<div class="page-head"><h1>Use cases and skill opportunities</h1><p>From ' + plural(reports.length, "shared self-report") + ". What each role uses Claude for, the tasks people repeat, and where Claude falls short. Use this to pick the next skills to build.</p></div>";
    if (!reports.length) return h + '<div class="card"><div class="empty">No self-reports yet. See skills/claude-self-report in the repository to roll out the opt-in self-report.</div></div>';

    // Heat map
    var cols = C.categories.slice();
    var hasOther = reports.some(function (r) { return Object.keys(r.categories || {}).some(function (c) { return c !== "Personal" && C.categories.indexOf(c) === -1; }); });
    if (hasOther) cols.push("Other");
    var best = null;
    var roleCount = {};
    reports.forEach(function (r) { roleCount[r.role] = (roleCount[r.role] || 0) + 1; });
    var roleNames = Object.keys(roleCount).sort(function (a, b) { return roleCount[b] - roleCount[a] || a.localeCompare(b); });
    var minReports = Math.max.apply(null, roleNames.map(function (r) { return roleCount[r]; })) >= 2 ? 2 : 1;
    var rowsHtml = roleNames.map(function (role) {
      var list = reports.filter(function (r) { return r.role === role; });
      var ct = categoryTotals(list);
      return '<tr><th scope="row">' + esc(role) + ' <span class="muted" style="font-weight:400">(' + list.length + ")</span></th>" + cols.map(function (c) {
        var v = pct(ct.totals[c] || 0, ct.work);
        if (!C.categorySkills[c] && c !== "Other" && c !== "Learning" && list.length >= minReports && (!best || v > best.v)) best = { v: v, role: role, c: c, n: list.length };
        var t = heatTone(v);
        return '<td style="background:' + t[0] + ";color:" + t[1] + '">' + (v ? v + "%" : "–") + "</td>";
      }).join("") + "</tr>";
    }).join("");
    h += '<section class="card" aria-labelledby="hm-h"><div class="section-head"><h2 id="hm-h">Use by role</h2><span class="note">Share of each role\'s reported work chats. Darker means more of their time. Number of reports in brackets.</span></div>' +
      '<div style="overflow-x:auto"><table class="heat wide-1000"><thead><tr><th scope="col" style="text-align:left">Role</th>' + cols.map(function (c) { return '<th scope="col">' + esc(C.categoryShortNames[c] || c) + "</th>"; }).join("") + "</tr></thead><tbody>" + rowsHtml + "</tbody></table></div>" +
      (best && best.v ? '<p class="small text-2">In ' + plural(best.n, "report") + " from " + esc(best.role) + " roles, " + best.v + "% of work chats are about " + esc(best.c.toLowerCase()) + ", and there is no shared skill for it yet.</p>" : "") + "</section>";

    // Repeated tasks
    var allTasks = [];
    reports.forEach(function (r) { (r.topTasks || []).forEach(function (t) { allTasks.push({ t: t, r: r }); }); });
    var matched = {};
    var themes = P.taskThemes.map(function (th, i) {
      var who = {};
      allTasks.forEach(function (x, j) { if (textMatches(x.t, th.match)) { who[x.r.email || x.r.name] = true; matched[j] = true; } });
      return Object.assign({}, th, { people: Object.keys(who).length, i: i });
    }).sort(function (a, b) {
      var ao = !a.skill && a.people >= T.taskOpportunityMinPeople, bo = !b.skill && b.people >= T.taskOpportunityMinPeople;
      if (ao !== bo) return ao ? -1 : 1;
      return b.people - a.people;
    });
    var unmatched = allTasks.filter(function (x, j) { return !matched[j]; }).map(function (x) { return x.t; });
    h += '<section class="card" aria-labelledby="tk-h"><div class="section-head"><h2 id="tk-h">Tasks people repeat</h2><span class="note">Each theme counts the people whose top tasks match it. Opportunities first. Edit the themes in data/program.js.</span></div>' +
      '<div class="table-box"><table class="wide-1000"><thead><tr><th scope="col">Task</th><th scope="col">Roles</th><th scope="col" class="num">People</th><th scope="col">Existing skill</th><th scope="col">Recommendation</th></tr></thead><tbody>' +
      themes.map(function (t) {
        var opp = !t.skill && t.people >= T.taskOpportunityMinPeople;
        return '<tr style="vertical-align:top"><td class="strong" style="font-weight:500">' + esc(t.task) + (opp ? ' <span class="pill pill-warn">Skill opportunity</span>' : "") + '</td><td class="text-2">' + esc(t.roles) + '</td><td class="num">' + t.people + "</td><td>" +
          (t.skill ? '<span class="mono">' + esc(t.skill) + "</span>" : '<span class="muted small">None yet</span>') + "</td><td>" + esc(t.rec) + "</td></tr>";
      }).join("") + "</tbody></table></div>" +
      (unmatched.length ? "<details><summary class=\"small strong\" style=\"cursor:pointer\">" + plural(unmatched.length, "reported task") + " don't match a theme yet</summary><ul class=\"list small text-2\" style=\"margin-top:8px\">" + unmatched.map(function (t) { return "<li>" + esc(t) + "</li>"; }).join("") + "</ul></details>" : "") + "</section>";

    // Shortfalls + pipeline
    var answers = reports.map(function (r) { return r.fellShort || ""; }).filter(function (a) { return a && !/nothing|n\/a|none/i.test(a); });
    var sMatched = {};
    var shorts = P.shortfallThemes.map(function (s) {
      var n = 0;
      answers.forEach(function (a, j) { if (textMatches(a, s.match)) { n++; sMatched[j] = true; } });
      return Object.assign({}, s, { n: n });
    }).filter(function (s) { return s.n > 0; }).sort(function (a, b) { return b.n - a.n; });
    var sUn = answers.filter(function (a, j) { return !sMatched[j]; });
    var lanes = P.pipelineStages.map(function (st) {
      var items = P.pipeline.filter(function (x) { return x.stage === st; });
      return '<div class="lane"><div><span class="strong">' + esc(st) + '</span> <span class="small muted">' + items.length + "</span></div>" + items.map(function (x) {
        return '<div class="item"><span class="mono strong">' + esc(x.name) + '</span><span class="small text-2">' + esc(x.note) + '</span><span class="small muted">Owner: ' + esc(x.owner || "TBD") + "</span></div>";
      }).join("") + "</div>";
    }).join("");
    h += '<div class="row"><section class="card side" aria-labelledby="sh-h" style="flex:1 1 420px;gap:12px"><div><h2 id="sh-h">Where Claude fell short</h2><p class="small muted" style="margin-top:4px">Themes from the self-report question. Most point to setup and training, not the tool.</p></div>' +
      (shorts.length ? shorts.map(function (s) { return '<div class="subcard" style="gap:6px;background:var(--surface)"><div style="display:flex;align-items:baseline;gap:10px"><span class="strong" style="flex:1 1 auto">' + esc(s.theme) + '</span><span class="small muted">' + plural(s.n, "person", "people") + '</span></div><div class="small text-2"><span class="strong">Fix: </span>' + esc(s.fix) + "</div></div>"; }).join("") : '<div class="small muted">No themes matched yet.</div>') +
      (sUn.length ? "<details><summary class=\"small strong\" style=\"cursor:pointer\">" + plural(sUn.length, "answer") + " don't match a theme</summary><ul class=\"list small text-2\" style=\"margin-top:8px\">" + sUn.map(function (t) { return "<li>" + esc(t) + "</li>"; }).join("") + "</ul></details>" : "") + "</section>" +
      '<section class="card grow" aria-labelledby="pp-h"><div class="section-head"><h2 id="pp-h">Skill pipeline</h2><span class="note">Ideas move right once a champion pilots them with their team. Edit in data/program.js.</span></div><div class="kanban">' + lanes + "</div></section></div>";
    return h;
  }

  function viewTraining() {
    var cohorts = [
      { key: "stage-0", label: "Inactive or not signed in", list: people.filter(function (p) { return !p.isActive; }), s: P.cohortSessions.inactive },
      { key: "stage-1", label: C.stages[0].name, list: active.filter(function (p) { return p.stage === 1; }), s: P.cohortSessions["1"] },
      { key: "stage-2", label: C.stages[1].name, list: active.filter(function (p) { return p.stage === 2; }), s: P.cohortSessions["2"] },
      { key: "stage-3", label: C.stages[2].name, list: active.filter(function (p) { return p.stage === 3; }), s: P.cohortSessions["3"] },
      { key: "stage-4", label: C.stages[3].name + " and " + C.stages[4].name.toLowerCase() + "s", list: active.filter(function (p) { return p.stage >= 4; }), s: P.cohortSessions["4"] }
    ];
    var h = '<div class="page-head"><h1>Training plan</h1><p>Group people by where they are on the adoption ladder, teach the next step, and use real examples from each role.</p></div>';
    h += '<section class="card" aria-labelledby="co-h"><h2 id="co-h">Cohorts by stage</h2><div class="grid" style="grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:12px">' + cohorts.map(function (c) {
      return '<div class="subcard"><div style="display:flex;align-items:baseline;gap:8px"><span style="font-size:26px;font-weight:700">' + c.list.length + '</span><span class="small muted">people</span></div><div class="strong">' + esc(c.label) + "</div>" +
        '<div class="small text-2"><span class="strong">Next session: </span>' + esc(c.s ? c.s.name : "TBD") + '</div><div class="small muted">' + esc(c.s ? c.s.length : "") + "</div>" +
        '<div class="actions" style="margin-top:auto">' + (c.list.length ? '<button type="button" class="btn btn-primary" data-action="copy-emails" data-filter="' + c.key + '">Copy emails</button>' : "") + '<a class="btn" href="#/people?f=' + c.key + '">See people</a></div></div>';
    }).join("") + "</div></section>";

    h += '<section class="card" aria-labelledby="tr-h"><div class="section-head"><h2 id="tr-h">Role tracks</h2><span class="note">Starter workflows taught with each role\'s own documents. Edit in data/program.js.</span></div><div class="grid grid-cards">' + P.tracks.map(function (t) {
      var list = people.filter(function (p) { return t.roles.indexOf(p.role) !== -1; });
      var up = list.filter(function (p) { return p.stage >= 3; }).length;
      return '<div class="subcard" style="background:var(--surface)"><div style="display:flex;flex-wrap:wrap;align-items:baseline;gap:4px 8px"><span class="strong" style="font-size:15px;flex:1 1 auto">' + esc(t.track) + "</span>" +
        (t.champion ? '<span class="small muted">Champion: ' + esc(t.champion) + "</span>" : '<span class="pill pill-warn">Champion needed</span>') + "</div>" +
        '<div class="small muted">' + plural(list.length, "person", "people") + " · " + up + " at stage 3 or above</div>" +
        '<ul class="list small text-2">' + t.items.map(function (i) { return "<li>" + esc(i) + "</li>"; }).join("") + '</ul><div class="small muted">' + esc(t.tip) + "</div></div>";
    }).join("") + "</div></section>";

    h += '<section class="card" aria-labelledby="se-h"><h2 id="se-h">Upcoming sessions</h2><div class="table-box"><table class="wide-600"><thead><tr><th scope="col">Date</th><th scope="col">Session</th><th scope="col">Audience</th><th scope="col">Host</th></tr></thead><tbody>' +
      P.sessions.map(function (s) { return '<tr><td style="white-space:nowrap">' + esc(s.date) + '</td><td class="strong" style="font-weight:500">' + esc(s.name) + '</td><td class="text-2">' + esc(s.audience) + '</td><td class="text-2">' + esc(s.host) + "</td></tr>"; }).join("") +
      "</tbody></table></div></section>";
    return h;
  }

  var reportShared = {};

  function tipFor(r) {
    var f = r.features || [];
    if (f.indexOf("Projects") === -1 && f.indexOf("File uploads") !== -1) return "You uploaded files in several chats. Put the documents you reuse in a Project once and every chat there can use them.";
    if (f.indexOf("Connectors") === -1) return "Connect the folder or tool you pull documents from, so Claude can read them without uploads.";
    if (f.indexOf("Company skills") === -1) return "Try a company skill built for your role. Ask your champion which one their team uses most.";
    return "You're using most of what Claude offers. Consider turning one of your repeated tasks into a skill for your team.";
  }

  function viewReport(id) {
    if (!reports.length) return '<div class="page-head"><h1>Self-report</h1></div><div class="card"><div class="empty">No self-reports yet.</div></div>';
    var r = (id && reportByPerson[id]) || reports[0];
    var key = r.email || r.name;
    var cats = Object.keys(r.categories || {}).map(function (c) { return { c: c, n: r.categories[c] }; }).sort(function (a, b) { return b.n - a.n; });
    var mx = cats.length ? cats[0].n : 1;
    var feats = r.features || [];
    var periodStart = addDays(r.date, -(C.periodDays - 1));
    var opts = reports.map(function (x) { return '<option value="' + esc(x.personId || "") + '"' + (x === r ? " selected" : "") + ">" + esc(x.name) + " (" + esc(x.role) + ")</option>"; }).join("");

    var h = '<div class="page-head"><h1>Self-report: what each person sees</h1><p>When someone runs the claude-self-report skill, Claude summarizes their own last ' + C.periodDays + " days and shows them this before anything is shared. Pick a report to preview it.</p></div>";
    h += '<div style="display:flex;align-items:center;gap:10px;flex-wrap:wrap"><label for="rep-pick">Report</label><select id="rep-pick" data-action="pick-report" style="min-height:40px">' + opts + "</select></div>";
    h += '<div class="row"><section class="card grow" aria-labelledby="ym-h" style="gap:16px"><div><h2 id="ym-h" style="font-size:20px">Your Claude month</h2><div class="small muted">' + esc(fmtDay(periodStart)) + " to " + esc(fmtDay(r.date)) + " · " + plural(r.chats, "chat") + (r.activeDays ? " on " + plural(r.activeDays, "day") : "") + "</div></div>" +
      '<div style="display:flex;flex-direction:column;gap:8px"><div class="small strong">What you used it for</div>' + cats.map(function (c) {
        return '<div style="display:grid;grid-template-columns:minmax(140px,220px) 1fr 36px;align-items:center;gap:10px"><span class="small">' + esc(c.c) + "</span>" + bar(Math.round(c.n / mx * 100)) + '<span class="small" style="text-align:right">' + c.n + "</span></div>";
      }).join("") + "</div>" +
      '<div style="display:flex;flex-direction:column;gap:8px"><div class="small strong">Features you used</div><div class="chips">' + FEATURES.map(function (f) {
        return feats.indexOf(f) !== -1 ? '<span class="pill pill-accent">' + esc(f) + "</span>" : '<span class="pill pill-muted">' + esc(f) + " (not used)</span>";
      }).join("") + "</div></div>" +
      '<div style="display:flex;flex-direction:column;gap:6px"><div class="small strong">Tasks you repeat</div><ul class="list small text-2">' + (r.topTasks || []).map(function (t) { return "<li>" + esc(t) + "</li>"; }).join("") + "</ul></div>" +
      '<div style="display:flex;flex-direction:column;gap:6px"><div class="small strong">Where Claude fell short this month</div><div class="small text-2">' + esc(r.fellShort || "") + "</div></div>" +
      '<div class="callout"><div class="small strong">One tip for next month</div><div class="small text-2">' + esc(tipFor(r)) + "</div></div>" +
      (reportShared[key]
        ? '<div class="callout callout-ok"><span class="strong" style="flex:1 1 auto">Added to the team sheet. Thanks, ' + esc(r.name.split(" ")[0]) + '.</span><button type="button" class="btn" data-action="share-report" data-key="' + esc(key) + '">Undo</button></div>'
        : '<div class="actions"><button type="button" class="btn btn-primary btn-lg" data-action="share-report" data-key="' + esc(key) + '">Share with my team</button><button type="button" class="btn btn-lg" disabled title="Preview only">Edit before sharing</button><button type="button" class="btn btn-lg" disabled title="Preview only">Keep private</button></div>') +
      "</section>";
    var shares = [["Category counts and features used", 1], ["Top 3 tasks, worded generically", 1], ["The \"fell short\" answer", 1], ["Chat titles or content", 0], ["Names of people, clients or jobs", 0], ["Anything in personal chats", 0]];
    var row = [["date", r.date], ["email", r.email], ["role", r.role], ["chats", r.chats], ["categories", cats.map(function (c) { return c.c + "=" + c.n; }).join("; ")], ["features", feats.join("; ")], ["top_tasks", (r.topTasks || []).join("; ")], ["fell_short", r.fellShort]];
    h += '<div class="side"><section class="card" aria-labelledby="pv-h" style="gap:10px"><h2 id="pv-h">What gets shared</h2>' + shares.map(function (s) {
      return '<div style="display:flex;gap:8px;align-items:flex-start" class="small">' + (s[1]
        ? '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="color:var(--accent);flex:none" role="img" aria-label="Shared"><path d="M20 6L9 17l-5-5"/></svg>'
        : '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" style="color:var(--warn);flex:none" role="img" aria-label="Never shared"><path d="M18 6L6 18M6 6l12 12"/></svg>') + "<span>" + esc(s[0]) + "</span></div>";
    }).join("") + "</section>" +
      '<section class="card" aria-labelledby="rw-h" style="gap:8px"><h2 id="rw-h">Row added to the sheet</h2>' + row.map(function (x) { return '<div class="kv"><span class="k">' + esc(x[0]) + "</span><span>" + esc(x[1]) + "</span></div>"; }).join("") + "</section></div></div>";
    return h;
  }

  function viewRules() {
    var tv = thresholdVars();
    var rules = [
      ["pending", "Invite sent and the person has never been active.", "roster status / users.last_activity_date"],
      ["inactive", "No activity for " + T.inactiveDays + "+ days.", "users.last_activity_date"],
      ["slowing", "Chats down " + T.slowingDropPct + "%+ from the previous period (if they had at least " + T.slowingMinPriorChats + ").", "chat_metrics.distinct_conversation_count (two periods)"],
      ["oneShot", "Under " + T.oneShotMaxMessagesPerChat + " messages per chat with " + T.oneShotMinChats + "+ chats.", "message_count ÷ distinct_conversation_count"],
      ["noProjects", "Active, with no Projects used.", "chat_metrics.distinct_projects_used_count"],
      ["noConnectors", "Active, with no connectors used.", "chat_metrics.distinct_connectors_used_count"],
      ["noSkills", "Active, with no runs of a company skill.", "skills endpoint grouped by user, company skills only"],
      ["champion", "Top " + T.championTopPct + "% of active people by chats, at stage " + T.championMinStage + " or above.", "users endpoint, ranked within the period"]
    ];
    var h = '<div class="page-head"><h1>Coaching rules and data</h1><p>Every flag comes from one rule. The thresholds live in config.js and are starting points to adjust once you see real usage.</p></div>';
    h += '<section class="card" aria-labelledby="rl-h"><h2 id="rl-h">Rules</h2><div class="table-box"><table class="wide-1000"><thead><tr><th scope="col">Flag</th><th scope="col">Triggered when</th><th scope="col">Data field</th><th scope="col">Suggested action</th></tr></thead><tbody>' +
      rules.map(function (r) {
        var good = r[0] === "champion";
        return '<tr style="vertical-align:top"><td style="white-space:nowrap"><span class="pill ' + (good ? "pill-accent" : "pill-warn") + '">' + esc(P.coaching[r[0]].label) + "</span></td><td>" + esc(r[1]) + '</td><td class="mono" style="font-size:12px">' + esc(r[2]) + "</td><td>" + esc(fill(P.coaching[r[0]].queue.action, tv)) + "</td></tr>";
      }).join("") +
      '<tr style="vertical-align:top"><td><span class="pill pill-warn">Low-adoption skill</span></td><td>A company skill used by under ' + T.lowSkillAdoptionPct + '% of its intended audience.</td><td class="mono" style="font-size:12px">skills.distinct_user_count</td><td>Demo it, fix it, or retire it.</td></tr>' +
      '<tr style="vertical-align:top"><td><span class="pill pill-warn">Skill opportunity</span></td><td>A category at ' + T.skillOpportunityMinSharePct + "%+ of reported chats with no skill, or a repeated task reported by " + T.taskOpportunityMinPeople + '+ people.</td><td class="mono" style="font-size:12px">Self-report sheet</td><td>Add it to the skill pipeline with a champion as owner.</td></tr>' +
      "</tbody></table></div></section>";
    h += '<section class="card" aria-labelledby="st-h"><h2 id="st-h">Adoption stages</h2><p class="small muted">A person\'s stage is the highest step reached in order this period. The ladder on each person\'s page also shows steps reached out of order.</p><div class="grid grid-ladder">' +
      C.stages.map(function (s, i) {
        var test = ["Had at least one chat", "Used at least one Project", "Used at least one connector", "Ran at least one company skill", "Created " + T.powerUserMinArtifacts + "+ artifacts"][i];
        return '<div class="subcard" style="background:var(--surface)"><div class="strong">' + (i + 1) + ". " + esc(s.name) + '</div><div class="small text-2">' + esc(s.desc) + '</div><div class="small muted">' + esc(test) + "</div></div>";
      }).join("") + "</div></section>";
    h += '<div class="row"><section class="card grow" aria-labelledby="src-h" style="gap:10px"><h2 id="src-h">Data sources</h2>' + [
      ["Analytics API: users", "Per-person chats, messages, Projects, artifacts, files, skills, connectors and last active date."],
      ["Analytics API: skills", "Runs and distinct users for each company skill, grouped by person."],
      ["Roster CSV", "Name, email, role and invite status for everyone with a seat."],
      ["Self-report sheet", "One row per shared self-report. Feeds use cases, repeated tasks and \"fell short\" themes."]
    ].map(function (s) { return '<div class="kv" style="flex-direction:column;gap:2px"><span class="strong mono" style="font-size:13px">' + esc(s[0]) + '</span><span class="text-2">' + esc(s[1]) + "</span></div>"; }).join("") +
      '<p class="small muted">Run scripts/build-data.mjs nightly to refresh. Analytics data runs about a day behind. See docs/SETUP.md.</p></section>' +
      '<section class="card side" aria-labelledby="pr-h" style="gap:10px"><h2 id="pr-h">What this does not show</h2><p class="small text-2">No chat content, titles or files. Use-case data comes only from self-reports people choose to share.</p><p class="small text-2">Tell people what is tracked before you launch. Coaching works better when nobody feels watched.</p></section></div>';
    return h;
  }

  /* ---------- routing ---------- */

  var TABS = [["overview", "Overview"], ["people", "People"], ["uses", "Use cases"], ["training", "Training"], ["report", "Self-report"], ["rules", "Rules"]];

  function parseRoute() {
    var hash = location.hash.replace(/^#\/?/, "");
    var q = hash.split("?");
    var parts = q[0].split("/");
    var params = {};
    (q[1] || "").split("&").forEach(function (kv) { if (!kv) return; var x = kv.split("="); params[decodeURIComponent(x[0])] = decodeURIComponent(x[1] || ""); });
    return { name: parts[0] || "overview", id: parts[1] ? decodeURIComponent(parts[1]) : null, params: params };
  }

  var lastRouteKey = null;
  function render() {
    var r = parseRoute();
    var tab = r.name === "person" ? "people" : r.name;
    document.getElementById("nav").innerHTML = TABS.map(function (t) {
      return '<a href="#/' + t[0] + '"' + (t[0] === tab ? ' aria-current="page"' : "") + ">" + t[1] + "</a>";
    }).join("");
    var html;
    if (r.name === "people") html = viewPeople(r.params);
    else if (r.name === "person") html = viewPerson(r.id);
    else if (r.name === "uses") html = viewUses();
    else if (r.name === "training") html = viewTraining();
    else if (r.name === "report") html = viewReport(r.id);
    else if (r.name === "rules") html = viewRules();
    else html = viewOverview();
    main.innerHTML = html;
    var person = r.name === "person" && byId[r.id];
    document.title = (person ? person.name + " · " : (TABS.filter(function (t) { return t[0] === tab; })[0] || TABS[0])[1] + " · ") + C.labels.title;
    var key = r.name + "/" + (r.id || "");
    if (key !== lastRouteKey) { window.scrollTo(0, 0); if (lastRouteKey !== null) main.focus({ preventScroll: true }); }
    lastRouteKey = key;
  }

  function rerenderPeopleBody() {
    var r = parseRoute();
    var list = peopleRows(r.params.f || "all");
    document.getElementById("people-body").innerHTML = peopleTableBody(list);
    document.getElementById("people-count").textContent = "Showing " + list.length + " of " + people.length + " seats.";
  }

  function csv(list) {
    var cols = ["name", "email", "role", "lastActive", "chats", "messages", "projects", "artifacts", "skills", "connectors", "stageName"];
    var lines = [cols.concat(["flags"]).join(",")];
    list.forEach(function (p) {
      var row = cols.map(function (c) { return p[c] == null ? "" : p[c]; });
      row.push(p.warnFlags.map(function (k) { return P.coaching[k].label; }).concat(p.flags.champion ? ["Champion"] : []).join("; "));
      lines.push(row.map(function (v) { v = String(v); return /[",\n]/.test(v) ? '"' + v.replace(/"/g, '""') + '"' : v; }).join(","));
    });
    return lines.join("\n");
  }

  document.addEventListener("click", function (e) {
    var el = e.target.closest("[data-action]");
    if (!el || el.tagName === "SELECT") return;
    var a = el.getAttribute("data-action");
    if (a === "filter") {
      location.hash = "#/people" + (el.dataset.filter === "all" ? "" : "?f=" + encodeURIComponent(el.dataset.filter));
    } else if (a === "sort") {
      var k = el.dataset.key;
      if (peopleState.sort === k) peopleState.dir = -peopleState.dir; else { peopleState.sort = k; peopleState.dir = (k === "name" || k === "days") ? 1 : -1; }
      render();
    } else if (a === "copy-emails") {
      var list = people.filter(flagFilter(el.dataset.filter));
      if (parseRoute().name === "people") list = peopleRows(el.dataset.filter);
      copyText(emailsFor(list), "Copied " + plural(list.length, "email address", "email addresses") + ".");
    } else if (a === "export-csv") {
      var rows = peopleRows(el.dataset.filter);
      var blob = new Blob([csv(rows)], { type: "text/csv" });
      var url = URL.createObjectURL(blob);
      var link = document.createElement("a");
      link.href = url; link.download = "claude-coaching-people-" + END + ".csv";
      document.body.appendChild(link); link.click(); link.remove();
      setTimeout(function () { URL.revokeObjectURL(url); }, 1000);
    } else if (a === "toggle-done") {
      var dk = "ccd:done:" + el.dataset.id, d = store.get(dk, {});
      d[el.dataset.key] = !d[el.dataset.key];
      store.set(dk, d);
      render();
    } else if (a === "save-note") {
      var ta = document.getElementById("note");
      var text = ta && ta.value.trim();
      if (!text) { toast("Write a note first."); return; }
      var nk = "ccd:notes:" + el.dataset.id, notes = store.get(nk, []);
      notes.unshift({ date: new Date().toISOString().slice(0, 10), text: text });
      store.set(nk, notes);
      render();
      toast("Note saved in this browser.");
    } else if (a === "copy-plan") {
      var p = byId[el.dataset.id];
      copyText(planText(p, planFor(p)), "Coaching plan copied.");
    } else if (a === "share-report") {
      reportShared[el.dataset.key] = !reportShared[el.dataset.key];
      render();
    }
  });

  document.addEventListener("change", function (e) {
    if (e.target.id === "rep-pick") location.hash = "#/report/" + encodeURIComponent(e.target.value);
  });
  document.addEventListener("input", function (e) {
    if (e.target.id === "search") { peopleState.q = e.target.value; rerenderPeopleBody(); }
  });

  // Header status
  var live = D.source === "live";
  document.getElementById("brand-title").textContent = C.labels.title;
  document.getElementById("data-status").innerHTML =
    '<span class="pill ' + (live ? "pill-accent" : "pill-muted") + '">' + (live ? "Live data" : "Sample data") + "</span>" +
    "<span>" + esc(D.orgName || C.orgName) + " · " + esc(fmtDay(START)) + " to " + esc(fmtDay(END)) + "</span>";

  window.addEventListener("hashchange", render);
  render();
})();
