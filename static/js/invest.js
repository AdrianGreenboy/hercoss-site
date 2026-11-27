// Invest page: register-interest form. Sends to the Hercoss API over HTTPS.
(function () {
  var form = document.getElementById("interest-form");
  if (!form) return;
  var T = {}; try { T = JSON.parse(document.getElementById("i18n-js").textContent); } catch (e) {}
  function t(k, d) { return Object.prototype.hasOwnProperty.call(T, k) ? T[k] : d; }
  var LANG = document.documentElement.lang || "en";
  var LOC = { en: "en-GB", es: "es-MX", de: "de-DE" }[LANG] || "en-GB";
  var api = form.getAttribute("data-api");
  var msg = document.getElementById("form-msg");
  var chips = document.getElementById("chips");
  var sign = document.getElementById("cur-sign");
  var amount = form.elements.amount;
  var currency = "EUR";
  var PRESETS = { EUR: [1000, 5000, 10000, 25000, 50000], MXN: [20000, 100000, 200000, 500000, 1000000] };
  var MIN = { EUR: 100, MXN: 2000 };

  function fmt(n, cur) {
    return new Intl.NumberFormat(LOC, { style: "currency", currency: cur, maximumFractionDigits: 0 }).format(n);
  }

  function renderChips() {
    chips.textContent = "";
    PRESETS[currency].forEach(function (v) {
      var b = document.createElement("button");
      b.type = "button";
      b.className = "inv-chip";
      b.textContent = fmt(v, currency);
      b.addEventListener("click", function () {
        amount.value = v;
        chips.querySelectorAll(".inv-chip").forEach(function (c) { c.setAttribute("aria-pressed", "false"); });
        b.setAttribute("aria-pressed", "true");
      });
      chips.appendChild(b);
    });
    sign.textContent = currency === "EUR" ? "€" : "MX$";
    amount.min = MIN[currency];
  }

  form.querySelectorAll("[data-cur]").forEach(function (b) {
    b.addEventListener("click", function () {
      currency = b.getAttribute("data-cur");
      form.querySelectorAll("[data-cur]").forEach(function (x) { x.setAttribute("aria-selected", x === b ? "true" : "false"); });
      amount.value = "";
      renderChips();
    });
  });

  var country = form.elements.country;
  country.addEventListener("change", function () {
    var want = country.value === "Mexico" ? "MXN" : "EUR";
    if (want !== currency) form.querySelector('[data-cur="' + want + '"]').click();
  });

  function say(text, ok) {
    msg.textContent = text;
    msg.className = "inv-msg " + (ok ? "ok" : "err");
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var f = form.elements;
    var a = parseFloat(f.amount.value);
    if (f.name.value.trim().length < 2) return say(t("f_name", "Please enter your full name."));
    if (!/^[^@\s]+@[^@\s]+\.[A-Za-z]{2,}$/.test(f.email.value.trim())) return say(t("f_email", "Please enter a valid e-mail address."));
    if (!/^\+?[0-9 ()\-]{6,24}$/.test(f.phone.value.trim())) return say(t("f_phone", "Please enter your mobile number, with country code."));
    if (!(a >= MIN[currency])) return say(t("f_min", "The minimum is") + " " + fmt(MIN[currency], currency) + ".");
    if (!f.consent.checked) return say(t("f_consent", "Please accept the privacy terms to continue."));
    var btn = form.querySelector(".inv-submit");
    btn.disabled = true;
    say(t("f_sending", "Sending, encrypted…"), true);
    fetch(api + "/api/interest", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json", "X-Requested-With": "hercoss" },
      body: JSON.stringify({
        name: f.name.value.trim(), email: f.email.value.trim(), phone: f.phone.value.trim(),
        country: f.country.value, amount: a, currency: currency,
        join_hub: f.join_hub.checked, consent: f.consent.checked, website: f.website.value, lang: LANG
      })
    }).then(function (r) {
      return r.json().catch(function () { return {}; }).then(function (j) { return { ok: r.ok, j: j, s: r.status }; });
    }).then(function (res) {
      btn.disabled = false;
      if (res.ok) {
        form.reset();
        renderChips();
        say(t("f_ok", "Thank you, welcome to the Hercoss family. Check your inbox: one click on the link we sent opens your Investor Hub."), true);
      } else if (res.s === 429) {
        say(t("f_429", "Too many attempts. Please try again in an hour, or write to adrian@hercoss.com."));
      } else {
        say(res.s === 422 ? t("f_check", "Please check the form.") : t("f_err", "Something went wrong. Please try again."));
      }
    }).catch(function () {
      btn.disabled = false;
      say(t("f_net", "We could not reach the server. Please try again, or write to adrian@hercoss.com."));
    });
  });

  renderChips();
  if (country.value === "Mexico") form.querySelector('[data-cur="MXN"]').click();
})();
