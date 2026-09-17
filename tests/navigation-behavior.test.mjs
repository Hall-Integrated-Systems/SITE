import assert from "node:assert/strict";
import { runInNewContext } from "node:vm";
import test from "node:test";
import { readText } from "./site-fixture.mjs";

class FakeClassList {
  constructor() {
    this.values = new Set();
  }

  toggle(value) {
    if (this.values.has(value)) {
      this.values.delete(value);
      return false;
    }
    this.values.add(value);
    return true;
  }

  remove(value) {
    this.values.delete(value);
  }

  contains(value) {
    return this.values.has(value);
  }
}

class FakeElement {
  constructor() {
    this.attributes = new Map();
    this.classList = new FakeClassList();
    this.handlers = new Map();
    this.focused = false;
  }

  addEventListener(type, handler) {
    this.handlers.set(type, handler);
  }

  setAttribute(name, value) {
    this.attributes.set(name, value);
  }

  focus() {
    this.focused = true;
  }
}

function loadNavigation(trackedEvents = []) {
  const navToggle = new FakeElement();
  const navLinks = new FakeElement();
  const documentHandlers = new Map();
  const windowHandlers = new Map();

  const document = {
    addEventListener(type, handler) {
      documentHandlers.set(type, handler);
    },
    getElementById() {
      return null;
    },
    querySelector(selector) {
      if (selector === ".nav-toggle") return navToggle;
      if (selector === ".nav-links") return navLinks;
      return null;
    }
  };
  const window = {
    addEventListener(type, handler) {
      windowHandlers.set(type, handler);
    },
    innerWidth: 390,
    location: {
      hostname: "127.0.0.1",
      href: "http://127.0.0.1:4173/index.html",
      pathname: "/index.html"
    },
    clarity(action, value) {
      if (action === "event") trackedEvents.push(value);
    }
  };

  runInNewContext(readText("script.js"), { document, window, URL });
  documentHandlers.get("DOMContentLoaded")();

  return { documentHandlers, navLinks, navToggle, window, windowHandlers };
}

function trackedLink(eventName) {
  return {
    href: "https://hallintegratedsystems.com/products.html",
    closest(selector) {
      return selector === "a[href]" ? this : null;
    },
    getAttribute(name) {
      if (name === "href") return "products.html";
      if (name === "data-clarity-event") return eventName;
      return null;
    }
  };
}

test("Escape closes an open mobile navigation and restores toggle focus", () => {
  const { documentHandlers, navLinks, navToggle } = loadNavigation();

  navToggle.handlers.get("click")();
  assert.equal(navLinks.classList.contains("open"), true);
  assert.equal(navToggle.attributes.get("aria-expanded"), "true");

  documentHandlers.get("keydown")({ key: "Escape" });
  assert.equal(navLinks.classList.contains("open"), false);
  assert.equal(navToggle.attributes.get("aria-expanded"), "false");
  assert.equal(navToggle.focused, true);
});

test("returning to desktop width clears mobile navigation state", () => {
  const { navLinks, navToggle, window, windowHandlers } = loadNavigation();

  navToggle.handlers.get("click")();
  window.innerWidth = 1100;
  windowHandlers.get("resize")();

  assert.equal(navLinks.classList.contains("open"), false);
  assert.equal(navToggle.attributes.get("aria-expanded"), "false");
});

test("approved discovery links emit their named Clarity event", () => {
  const trackedEvents = [];
  const { documentHandlers } = loadNavigation(trackedEvents);

  documentHandlers.get("click")({ target: trackedLink("hero_products_click") });
  assert.deepEqual(trackedEvents, ["hero_products_click"]);
});

test("unapproved data event names are ignored", () => {
  const trackedEvents = [];
  const { documentHandlers } = loadNavigation(trackedEvents);

  documentHandlers.get("click")({ target: trackedLink("invented_event") });
  assert.deepEqual(trackedEvents, []);
});
