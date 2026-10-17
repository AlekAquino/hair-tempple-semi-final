import test from "node:test";
import assert from "node:assert/strict";
import vm from "node:vm";
import { readFileSync } from "node:fs";

const source = readFileSync(new URL("../analytics-consent.js", import.meta.url), "utf8");
const key = "hair-tempple.analytics-consent.v1";
const gaDisabled = "ga-disable-G-N20ZXRCBJE";
function browser({ value, expires = Date.now() + 100000, host = "hairtempple.com", blocked = false, raw } = {}) {
  const handlers = {}, nodes = {}, scripts = [], cookies = [];
  let stored = raw ?? (value ? JSON.stringify({ value, expires }) : null);
  for (const name of ["panel", "status", "preferences", "accept", "reject", "heading"]) {
    nodes[name] = { hidden: true, textContent: "", focused: false,
      addEventListener(type, fn) { handlers[`${name}:${type}`] = fn; },
      focus() { this.focused = true; }, scrollIntoView() {},
      querySelector() { return nodes.heading; }
    };
  }
  const document = {
    referrer: "https://example.org/from?email=private@example.org#private",
    head: { append(s) { scripts.push(s); } },
    createElement() { return { addEventListener(type, fn) { this[type] = fn; } }; },
    querySelector(selector) { return nodes[selector.match(/analytics-(\w+)/)[1]]; },
    set cookie(value) { cookies.push(value); }
  };
  const location = { hostname: host, protocol: host === "localhost" ? "http:" : "https:",
    href: `https://${host}/faq/?private=secret#secret`, reloads: 0, reload() { this.reloads++; } };
  const window = { addEventListener(type, fn) { handlers[type] = fn; } };
  const localStorage = {
    getItem() { if (blocked) throw Error("blocked"); return stored; },
    setItem(k, val) { assert.equal(k, key); if (blocked) throw Error("blocked"); stored = val; }
  };
  vm.runInNewContext(source, { window, document, location, localStorage, URL, Date });
  return { window, nodes, scripts, cookies, location, click: n => handlers[`${n}:click`](),
    saved: () => JSON.parse(stored), external: v => { stored = v; handlers.storage({ key }); }, handlers };
}

test("first visit waits: no loader, queue or tracking permission", () => {
  const b = browser();
  assert.equal(b.scripts.length, 0);
  assert.equal(b.window.dataLayer, undefined);
  assert.equal(b.window[gaDisabled], true);
  assert.equal(b.nodes.panel.hidden, false);
});
test("reject persists and does not load Analytics", () => {
  const b = browser(); b.click("reject");
  assert.equal(b.saved().value, "denied");
  assert.equal(b.scripts.length, 0);
  assert.equal(b.nodes.panel.hidden, true);
  assert.equal(b.nodes.preferences.focused, true);
});
test("accept loads once, restricts ads and removes query/hash from initial URLs", () => {
  const b = browser(); b.click("accept"); b.click("accept");
  assert.equal(b.scripts.length, 1);
  assert.equal(b.scripts[0].src, "https://www.googletagmanager.com/gtag/js?id=G-N20ZXRCBJE");
  const queue = b.window.dataLayer.map(a => Array.from(a));
  assert.equal(queue[0][2].ad_storage, "denied");
  assert.equal(queue[0][2].ad_user_data, "denied");
  assert.equal(queue[0][2].ad_personalization, "denied");
  const config = queue.find(a => a[0] === "config")[2];
  assert.equal(config.allow_google_signals, false);
  assert.equal(config.allow_ad_personalization_signals, false);
  assert.equal(config.page_location, "https://hairtempple.com/faq/");
  assert.equal(config.page_referrer, "https://example.org/from");
  assert.equal(queue.filter(a => a[0] === "config").length, 1);
});
test("valid saved consent reconnects once on a new page", () => {
  const b = browser({ value: "granted" });
  assert.equal(b.scripts.length, 1);
  assert.equal(b.nodes.panel.hidden, true);
});
test("saved refusal stays refused", () => {
  const b = browser({ value: "denied" });
  assert.equal(b.scripts.length, 0);
  assert.equal(b.nodes.panel.hidden, true);
});
test("expired, malformed, unknown and future-tampered records require a choice", () => {
  for (const opts of [{ value: "granted", expires: 0 }, { raw: "invalid" },
    { value: "anything" }, { value: "granted", expires: Date.now() + 100000000000 }]) {
    const b = browser(opts);
    assert.equal(b.scripts.length, 0);
    assert.equal(b.nodes.panel.hidden, false);
  }
});
test("blocked storage leaves navigation and explicit choice functional", () => {
  const b = browser({ blocked: true }); b.click("reject");
  assert.equal(b.scripts.length, 0);
  assert.match(b.nodes.status.textContent, /não salvou/);
  b.click("preferences");
  assert.equal(b.nodes.panel.hidden, false);
  assert.equal(b.nodes.heading.focused, true);
});
test("local preview never sends real property traffic", () => {
  const b = browser({ host: "localhost" }); b.click("accept");
  assert.equal(b.scripts.length, 0);
  assert.equal(b.window[gaDisabled], true);
});
test("withdrawal disables tracking, clears only Analytics cookies and reloads", () => {
  const b = browser({ value: "granted" }); b.click("reject");
  assert.equal(b.window[gaDisabled], true);
  assert.equal(b.location.reloads, 1);
  assert.equal(b.saved().value, "denied");
  assert.ok(b.cookies.every(c => /^_ga(?:_N20ZXRCBJE)?=/.test(c)));
});
test("cross-tab revocation disables and unloads an already loaded tag", () => {
  const b = browser({ value: "granted" });
  b.external(JSON.stringify({ value: "denied", expires: Date.now() + 10000 }));
  assert.equal(b.window[gaDisabled], true);
  assert.equal(b.location.reloads, 1);
});
test("back-forward cache restoration detects a changed choice", () => {
  const b = browser({ value: "denied" });
  b.external(null); b.handlers.pageshow();
  assert.equal(b.nodes.panel.hidden, false);
  assert.equal(b.scripts.length, 0);
});
test("loader failure shows an error without automatic retries", () => {
  const b = browser(); b.click("accept"); b.scripts[0].error();
  assert.match(b.nodes.status.textContent, /Não foi possível/);
  assert.equal(b.scripts.length, 1);
});
test("all five pages expose one panel and a footer preference control", () => {
  for (const path of ["index.html", "servicos/index.html", "produtos/index.html", "faq/index.html", "o-espaco/index.html"]) {
    const html = readFileSync(new URL("../" + path, import.meta.url), "utf8");
    for (const token of ["data-analytics-panel", "data-analytics-preferences", "data-analytics-status"])
      assert.equal(html.split(token).length - 1, 1, `${path}: ${token}`);
    assert.match(html, /<footer class="site-footer">[\s\S]*data-analytics-preferences/);
    assert.match(html, /analytics-consent\.js" defer/);
    assert.match(html, /analytics-consent\.css/);
  }
});
