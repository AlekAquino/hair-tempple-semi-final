/* Basic consent: no Google Analytics code is loaded before a positive choice. */
(() => {
  "use strict";
  const measurementId = "G-N20ZXRCBJE";
  const storageKey = "hair-tempple.analytics-consent.v1";
  const lifetime = 90 * 24 * 60 * 60 * 1000;
  const panel = document.querySelector("[data-analytics-panel]");
  const status = document.querySelector("[data-analytics-status]");
  const preferences = document.querySelector("[data-analytics-preferences]");
  if (!panel || !status || !preferences) return;

  let started = false;
  let currentChoice = null;
  let storageAvailable = true;
  window[`ga-disable-${measurementId}`] = true;

  function readChoice() {
    try {
      const saved = JSON.parse(localStorage.getItem(storageKey));
      if (saved && ["granted", "denied"].includes(saved.value)
        && Number.isFinite(saved.expires) && saved.expires > Date.now()
        && saved.expires <= Date.now() + lifetime) return saved.value;
    } catch { storageAvailable = false; }
    return null;
  }

  function saveChoice(value) {
    try {
      localStorage.setItem(storageKey, JSON.stringify({ value, expires: Date.now() + lifetime }));
    } catch { storageAvailable = false; }
  }

  function cleanUrl(value) {
    try {
      const url = new URL(value);
      return ["http:", "https:"].includes(url.protocol) ? url.origin + url.pathname : "";
    } catch { return ""; }
  }

  function clearAnalyticsCookies() {
    // Only this property's identifiers; leave unrelated site cookies untouched.
    const names = ["_ga", `_ga_${measurementId.slice(2).replaceAll("-", "")}`];
    for (const name of names) {
      for (const domain of ["", location.hostname, "." + location.hostname]) {
        document.cookie = `${name}=; Max-Age=0; Path=/; SameSite=Lax${domain ? "; Domain=" + domain : ""}`;
      }
    }
  }

  function startAnalytics() {
    if (started || location.protocol !== "https:" || location.hostname !== "hairtempple.com") return;
    started = true;
    window[`ga-disable-${measurementId}`] = false;
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { window.dataLayer.push(arguments); };
    window.gtag("consent", "default", {
      analytics_storage: "denied", ad_storage: "denied",
      ad_user_data: "denied", ad_personalization: "denied"
    });
    window.gtag("consent", "update", { analytics_storage: "granted" });
    window.gtag("set", "ads_data_redaction", true);
    window.gtag("js", new Date());
    window.gtag("config", measurementId, {
      allow_google_signals: false,
      allow_ad_personalization_signals: false,
      page_location: cleanUrl(location.href),
      page_referrer: cleanUrl(document.referrer),
      cookie_expires: lifetime / 1000,
      cookie_update: false
    });
    const script = document.createElement("script");
    script.async = true;
    script.src = "https://www.googletagmanager.com/gtag/js?id=" + measurementId;
    script.addEventListener("error", () => {
      status.textContent = "Não foi possível carregar as estatísticas. A navegação continua disponível.";
    });
    document.head.append(script);
  }

  function applyChoice(value) {
    currentChoice = value;
    panel.hidden = value !== null;
    status.textContent = value === "granted" ? "Estatísticas permitidas." : value === "denied"
      ? "Estatísticas recusadas." : "As estatísticas aguardam sua escolha.";
    if (value === "granted") {
      startAnalytics();
    } else {
      window[`ga-disable-${measurementId}`] = true;
      clearAnalyticsCookies();
      // Unload the library and its automatic listeners after withdrawing consent.
      if (started) location.reload();
    }
  }

  function choose(value) {
    saveChoice(value);
    applyChoice(value);
    if (!storageAvailable) status.textContent += " O navegador não salvou a escolha; ela será solicitada novamente ao navegar.";
    if (!started || value === "granted") preferences.focus({ preventScroll: true });
  }

  document.querySelector("[data-analytics-accept]").addEventListener("click", () => choose("granted"));
  document.querySelector("[data-analytics-reject]").addEventListener("click", () => choose("denied"));
  preferences.addEventListener("click", () => {
    panel.hidden = false;
    panel.querySelector("h2").focus();
    panel.scrollIntoView({ block: "center", behavior: "instant" });
  });
  window.addEventListener("storage", (event) => {
    if (event.key === storageKey || event.key === null) applyChoice(readChoice());
  });
  window.addEventListener("pageshow", () => {
    const value = readChoice();
    if (value !== currentChoice) applyChoice(value);
  });
  applyChoice(readChoice());
})();
