// Investor Hub: sign-in by one-time link, pool dashboard, news, meetings, market.
// All values are inserted with textContent: nothing from the server is parsed as HTML.
(function () {
  var root = document.getElementById("hub");
  if (!root) return;
  var API = root.getAttribute("data-api");
  var params = new URLSearchParams(location.search);
  var DEMO = params.get("demo") === "1";
  var $ = function (id) { return document.getElementById(id); };
  var NS = "http://www.w3.org/2000/svg";
  var T = {}; try { T = JSON.parse(document.getElementById("i18n-js").textContent); } catch (e) {}
  function t(k, d) { return Object.prototype.hasOwnProperty.call(T, k) ? T[k] : d; }
  var LANG = document.documentElement.lang || "en";
  var LOC = { en: "en-GB", es: "es-MX", de: "de-DE" }[LANG] || "en-GB";

  function show(id) {
    ["hub-loading", "hub-login", "hub-dash"].forEach(function (x) { $(x).hidden = x !== id; });
  }
  function call(method, path, body) {
    return fetch(API + path, {
      method: method,
      credentials: "include",
      headers: body || method !== "GET" ? { "Content-Type": "application/json", "X-Requested-With": "hercoss" } : {},
      body: body ? JSON.stringify(body) : undefined
    }).then(function (r) {
      return r.json().catch(function () { return {}; }).then(function (j) {
        if (!r.ok) { var e = new Error(typeof j.detail === "string" ? j.detail : "Request failed"); e.status = r.status; throw e; }
        return j;
      });
    });
  }
  function eur(n) { return new Intl.NumberFormat(LOC, { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(n); }
  function money(n, cur) {
    return new Intl.NumberFormat(LOC, { style: "currency", currency: cur, maximumFractionDigits: 0 }).format(n);
  }
  function el(tag, cls, text) { var e = document.createElement(tag); if (cls) e.className = cls; if (text != null) e.textContent = text; return e; }
  function svgEl(tag, attrs) { var e = document.createElementNS(NS, tag); for (var k in attrs) e.setAttribute(k, attrs[k]); return e; }

  // ---------- pool ring ----------
  function ring(svg, shares, mine) {
    svg.textContent = "";
    var cx = 110, cy = 110, r = 84, C = 2 * Math.PI * r, total = shares.reduce(function (a, b) { return a + b; }, 0);
    svg.appendChild(svgEl("circle", { cx: cx, cy: cy, r: r, fill: "none", stroke: "#262d38", "stroke-width": 26 }));
    if (!total) return;
    // My share first, in orange; everyone else as anonymous blue/grey segments.
    var list = shares.slice(); var i = list.indexOf(mine); if (i >= 0) list.splice(i, 1);
    var segs = [{ v: mine, c: "#f2a03d" }].concat(list.map(function (v, k) { return { v: v, c: k % 2 ? "#3f6f99" : "#5b9bd5" }; }));
    var off = 0, gap = segs.length > 1 ? 2 : 0;
    segs.forEach(function (s) {
      if (!s.v) return;
      var len = Math.max(C * s.v / total - gap, 1);
      svg.appendChild(svgEl("circle", { cx: cx, cy: cy, r: r, fill: "none", stroke: s.c, "stroke-width": 26,
        "stroke-dasharray": len + " " + C, "stroke-dashoffset": -off, transform: "rotate(-90 110 110)" }));
      off += C * s.v / total;
    });
    var t1 = svgEl("text", { x: cx, y: cy - 4, "text-anchor": "middle", fill: "#e6e9ee", "font-size": 30, "font-weight": 700, "font-family": "ui-monospace, Menlo, monospace" });
    t1.textContent = (100 * mine / total).toLocaleString(LOC, { maximumFractionDigits: 1 }) + "%";
    svg.appendChild(t1);
    var t2 = svgEl("text", { x: cx, y: cy + 22, "text-anchor": "middle", fill: "#9aa4b2", "font-size": 12, "font-family": "ui-monospace, Menlo, monospace", "letter-spacing": 2 });
    t2.textContent = t("your_share", "YOUR SHARE");
    svg.appendChild(t2);
  }

  function spark(values, up) {
    var w = 160, h = 44, svg = svgEl("svg", { viewBox: "0 0 " + w + " " + h, class: "hub-spark", "aria-hidden": "true", preserveAspectRatio: "none" });
    if (!values || values.length < 2) return svg;
    var mn = Math.min.apply(null, values), mx = Math.max.apply(null, values), rg = mx - mn || 1;
    var pts = values.map(function (v, i) { return (i * w / (values.length - 1)).toFixed(1) + "," + (h - 4 - (v - mn) / rg * (h - 8)).toFixed(1); });
    var col = up ? "#6fcf97" : "#e07a6b";
    svg.appendChild(svgEl("polyline", { points: "0," + h + " " + pts.join(" ") + " " + w + "," + h, fill: col, opacity: 0.12, stroke: "none" }));
    svg.appendChild(svgEl("polyline", { points: pts.join(" "), fill: "none", stroke: col, "stroke-width": 2 }));
    return svg;
  }

  // ---------- render ----------
  var state = { cur: "EUR" };
  function render(d) {
    $("me-name").textContent = d.investor.name.split(" ")[0];
    $("me-since").textContent = d.investor.since;
    $("me-email").textContent = d.investor.email;
    $("d-name").textContent = d.investor.name;
    $("d-email").textContent = d.investor.email;
    $("d-phone").textContent = d.investor.phone || "–";
    $("d-country").textContent = d.investor.country || "–";
    $("in-pool").checked = d.investor.in_pool !== false;

    var p = d.pool;
    $("pool-mine").textContent = eur(p.my_eur);
    $("pool-total").textContent = eur(p.total_eur);
    $("pool-pct").textContent = (p.my_percent || 0).toLocaleString(LOC, { minimumFractionDigits: 1, maximumFractionDigits: 1 }) + " %";
    $("pool-pct").parentNode.lastChild.textContent = d.investor.in_pool === false ? t("pct_out", " (not counted: you opted out)") : t("pct_in", " of the pool is yours");
    $("pool-n").textContent = p.participants;
    $("pool-cur").textContent = money(p.by_currency.EUR.total, "EUR") + t("in_eur", " pledged in euros · ") + money(p.by_currency.MXN.total, "MXN") + t("in_mxn", " in pesos");
    $("pool-rate").textContent = t("rate_a", "MXN converted at ") + p.rate.mxn_per_eur.toLocaleString(LOC) + t("rate_b", " per EUR (") + p.rate.source + (p.rate.date ? ", " + p.rate.date : "") + ")";
    ring($("pool-ring"), p.shares_eur, p.my_eur);
    if (p.goal_eur) {
      $("pool-goal").hidden = false;
      $("goal-fill").style.width = Math.min(100, 100 * p.total_eur / p.goal_eur).toFixed(1) + "%";
      $("goal-txt").textContent = eur(p.total_eur) + t("goal_a", " of the ") + eur(p.goal_eur) + t("goal_b", " goal");
    }

    if (d.pledge) {
      $("my-pledge").textContent = money(d.pledge.amount, d.pledge.currency);
      var st = $("my-status");
      st.textContent = d.pledge.status === "confirmed" ? t("confirmed", "Confirmed") : t("pledged", "Pledged · non-binding");
      st.className = "estado " + (d.pledge.status === "confirmed" ? "hecho" : "curso");
      $("my-updated").textContent = t("updated", " updated ") + d.pledge.updated_at;
      state.cur = d.pledge.currency;
      document.querySelector("#pledge-form [name=amount]").value = d.pledge.amount;
    } else {
      $("my-pledge").textContent = t("no_pledge", "No pledge yet");
    }
    setCur(state.cur);

    // meetings
    var next = $("meet-next"), list = $("meet-list");
    next.textContent = ""; list.textContent = "";
    if (!d.meetings.length) {
      next.appendChild(el("p", "inv-small", t("no_meeting", "The next meeting will be announced here and by e-mail.")));
    }
    d.meetings.forEach(function (m, i) {
      var when = new Date(m.starts_at);
      var date = when.toLocaleString(LOC, { weekday: "long", day: "numeric", month: "long", hour: "2-digit", minute: "2-digit" });
      if (i === 0) {
        next.appendChild(el("p", "hub-big hub-date", date));
        next.appendChild(el("p", null, m.title));
        var days = Math.ceil((when - Date.now()) / 86400000);
        next.appendChild(el("p", "hub-sub", days > 1 ? t("in_days", "in {n} days").replace("{n}", days) : days === 1 ? t("tomorrow", "tomorrow") : t("today", "today")));
        var row = el("p");
        if (m.link) { var a = el("a", "button", t("join", "Join")); a.href = m.link; a.rel = "noopener"; a.target = "_blank"; row.appendChild(a); }
        var ics = el("a", "button secundario", t("add_cal", "Add to calendar"));
        ics.href = DEMO ? "#" : API + "/api/meetings/" + m.id + ".ics";
        row.appendChild(ics);
        next.appendChild(row);
      } else {
        list.appendChild(el("li", null, date + " · " + m.title));
      }
    });

    // news
    var news = $("news"); news.textContent = "";
    if (!d.news.length) news.appendChild(el("p", "inv-small", t("no_news", "No news yet.")));
    d.news.forEach(function (n) {
      var c = el("article", "hub-card hub-n");
      if (n.image_url && /^https:\/\//.test(n.image_url)) {
        var img = el("img"); img.src = n.image_url; img.alt = ""; img.loading = "lazy"; img.referrerPolicy = "no-referrer"; c.appendChild(img);
      }
      c.appendChild(el("p", "hub-k", new Date(n.published_at).toLocaleDateString(LOC, { day: "numeric", month: "long", year: "numeric" })));
      c.appendChild(el("h3", null, n.title));
      n.body.split(/\n\n+/).forEach(function (para) { c.appendChild(el("p", null, para)); });
      if (n.link && /^https:\/\//.test(n.link)) { var a = el("a", null, t("read_more", "Read more →")); a.href = n.link; c.appendChild(a); }
      news.appendChild(c);
    });
  }

  function renderMarket(m) {
    var box = $("market"); box.textContent = "";
    if (!m.items.length) box.appendChild(el("p", "inv-small", t("mkt_loading", "Market data is loading on the server; refresh in a minute.")));
    m.items.forEach(function (x) {
      var c = el("div", "hub-tick");
      var top = el("div", "hub-tick-top");
      top.appendChild(el("span", "hub-sym", x.symbol));
      top.appendChild(el("span", "hub-chg " + (x.change_1d >= 0 ? "up" : "down"), (x.change_1d >= 0 ? "+" : "") + x.change_1d.toLocaleString(LOC, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + "%"));
      c.appendChild(top);
      c.appendChild(el("p", "hub-name", x.name));
      c.appendChild(el("p", "hub-price", x.last.toLocaleString(LOC, { minimumFractionDigits: 2, maximumFractionDigits: 2 })));
      c.appendChild(spark(x.spark, x.change_1y >= 0));
      c.appendChild(el("p", "hub-1y " + (x.change_1y >= 0 ? "up" : "down"), t("one_year", "1 year") + " " + (x.change_1y >= 0 ? "+" : "") + x.change_1y.toLocaleString(LOC) + "%"));
      box.appendChild(c);
    });
    $("market-src").textContent = t("src", "Source: ") + m.source + t("not_advice", ". Not investment advice.");
  }

  function setCur(cur) {
    state.cur = cur;
    document.querySelectorAll("#pledge-form [data-cur]").forEach(function (b) { b.setAttribute("aria-selected", b.getAttribute("data-cur") === cur ? "true" : "false"); });
  }

  function load() {
    if (DEMO) { $("demo-banner").hidden = false; render(demoData()); renderMarket(demoMarket()); show("hub-dash"); return; }
    call("GET", "/api/me").then(function (d) {
      render(d); show("hub-dash");
      return call("GET", "/api/market").then(renderMarket).catch(function () {});
    }).catch(function (e) {
      show("hub-login");
      if (e.status !== 401) { $("login-msg").textContent = t("unreachable", "The Investor Hub is not reachable right now. Please try again later."); $("login-msg").className = "inv-msg err"; }
    });
  }

  // ---------- events ----------
  document.querySelectorAll("#pledge-form [data-cur]").forEach(function (b) { b.addEventListener("click", function () { setCur(b.getAttribute("data-cur")); }); });
  $("pledge-form").addEventListener("submit", function (e) {
    e.preventDefault();
    var a = parseFloat(this.elements.amount.value), msg = $("pledge-msg");
    if (!(a > 0)) { msg.textContent = t("enter_amount", "Enter an amount."); msg.className = "inv-msg err"; return; }
    if (DEMO) { msg.textContent = t("demo_nosave", "Demo: nothing is saved."); msg.className = "inv-msg ok"; return; }
    call("PUT", "/api/me/pledge", { amount: a, currency: state.cur }).then(function () {
      msg.textContent = t("updated_ok", "Updated."); msg.className = "inv-msg ok"; load();
    }).catch(function (err) { msg.textContent = err.message; msg.className = "inv-msg err"; });
  });
  $("login-form").addEventListener("submit", function (e) {
    e.preventDefault();
    var msg = $("login-msg");
    call("POST", "/api/auth/request", { email: this.elements.email.value.trim(), lang: LANG }).then(function () {
      msg.textContent = t("link_sent", "If this address is registered, a sign-in link is on its way."); msg.className = "inv-msg ok";
    }).catch(function (err) { msg.textContent = err.message; msg.className = "inv-msg err"; });
  });
  $("logout").addEventListener("click", function () {
    if (DEMO) { location.href = location.pathname; return; }
    call("POST", "/api/auth/logout", {}).finally(function () { show("hub-login"); });
  });
  $("in-pool").addEventListener("change", function () {
    if (DEMO) return;
    call("PUT", "/api/me/pool", { in_pool: this.checked }).then(load);
  });
  $("delete-1").addEventListener("click", function () { $("delete-confirm").hidden = false; this.hidden = true; });
  $("delete-no").addEventListener("click", function () { $("delete-confirm").hidden = true; $("delete-1").hidden = false; });
  $("delete-2").addEventListener("click", function () {
    if (DEMO) { $("delete-no").click(); return; }
    call("DELETE", "/api/me").then(function () { show("hub-login"); $("login-msg").textContent = t("deleted", "Your data has been deleted."); $("login-msg").className = "inv-msg ok"; });
  });

  // ---------- start: one-time link in the URL? ----------
  var token = params.get("token");
  if (token) {
    history.replaceState(null, "", location.pathname); // keep the token out of history and screenshots
    call("POST", "/api/auth/verify", { token: token }).then(load).catch(function (err) {
      show("hub-login"); $("login-msg").textContent = err.message; $("login-msg").className = "inv-msg err";
    });
  } else {
    load();
  }

  // ---------- demo data: the Luis / Daniel example ----------
  function demoData() {
    var d = new Date(); d.setDate(d.getDate() + 12); d.setHours(18, 0, 0, 0);
    var d2 = new Date(d); d2.setMonth(d2.getMonth() + 1);
    return {
      investor: { name: "Luis Perez", email: "lu••••@example.com", phone: "••••••••678", country: "Mexico", since: "2026-11-26" },
      pledge: { amount: 20000, currency: "MXN", status: "pledged", updated_at: "2026-11-26" },
      pool: { total_eur: 3000, my_eur: 1000, my_percent: 33.33, participants: 2, confirmed: 0,
        by_currency: { EUR: { total: 2000, count: 1 }, MXN: { total: 20000, count: 1 } },
        shares_eur: [2000, 1000], goal_eur: 250000, rate: { mxn_per_eur: 20, date: "", source: "demo" } },
      news: [
        { published_at: "2026-11-26T12:00:00Z", title: t("dn1_t", "NOC_512 heals itself in silicon"), body: t("dn1_b", "Our network on chip repaired itself around a dead switch 405,522 times in one hour on the FPGA board, in about 0.6 µs each time, without losing a single one of more than 160 billion data words."), image_url: null, link: null },
        { published_at: "2026-11-25T12:00:00Z", title: t("dn2_t", "RV128IMAC: hardware SHA-3 at 129 MB/s"), body: t("dn2_b", "A Linux program on our 128-bit RISC-V core now hashes at 129 MB/s with the SHA-3 engine, with no driver: from 33 MB/s to 129 MB/s in five days, every step measured on silicon."), image_url: null, link: null }
      ],
      meetings: [
        { id: 1, starts_at: d.toISOString(), minutes: 60, title: t("dm1", "Monthly investor meeting · December"), link: null },
        { id: 2, starts_at: d2.toISOString(), minutes: 60, title: t("dm2", "Monthly investor meeting · January"), link: null }
      ]
    };
  }
  function demoMarket() {
    function walk(seed, drift) { var v = 100, out = []; for (var i = 0; i < 60; i++) { seed = (seed * 9301 + 49297) % 233280; v *= 1 + drift + (seed / 233280 - 0.5) * 0.06; out.push(+v.toFixed(2)); } return out; }
    var rows = [["SOXX", "iShares Semiconductor ETF", 3, 0.004], ["NVDA", "NVIDIA", 5, 0.006], ["TSM", "TSMC", 7, 0.005], ["ASML", "ASML", 11, 0.001],
      ["AVGO", "Broadcom", 13, 0.005], ["AMD", "AMD", 17, 0.002], ["INTC", "Intel", 19, -0.002], ["IFX", "Infineon", 23, 0.001]];
    return { source: "DEMO", items: rows.map(function (r) {
      var s = walk(r[2], r[3]), last = s[s.length - 1];
      return { symbol: r[0], name: r[1], last: last, change_1d: +((last / s[s.length - 2] - 1) * 100).toFixed(2), change_1y: +((last / s[0] - 1) * 100).toFixed(1), spark: s };
    }) };
  }
})();
