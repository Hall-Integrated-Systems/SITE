import assert from "node:assert/strict";
import { runInNewContext } from "node:vm";
import test from "node:test";
import { readText } from "./site-fixture.mjs";

class Field {
  constructor(name) {
    this.name = name;
    this.value = "";
    this.attributes = new Map();
  }

  setAttribute(name, value) {
    this.attributes.set(name, value);
  }
}

function loadContactForm(options = {}) {
  const fields = new Map([
    ["name", new Field("name")],
    ["email", new Field("email")],
    ["subject", new Field("subject")],
    ["message", new Field("message")],
    ["_honey", new Field("_honey")]
  ]);
  const errors = new Map(["name", "email", "subject", "message"].map((name) => [name, { textContent: "" }]));
  const status = { textContent: "" };
  const submitButton = { disabled: false };
  const formHandlers = new Map();
  let fetchCalls = 0;

  const form = {
    action: "https://his-contact-api-d1378abe.azurewebsites.net/api/contact",
    method: "POST",
    addEventListener(type, handler) {
      formHandlers.set(type, handler);
    },
    querySelector(selector) {
      if (selector === 'button[type="submit"]') return submitButton;
      const name = selector.match(/^\[name="(.+)"\]$/)?.[1];
      return name ? fields.get(name) : null;
    },
    querySelectorAll(selector) {
      if (selector !== '[aria-invalid="true"]') return [];
      return [...fields.values()].filter((field) => field.attributes.get("aria-invalid") === "true");
    },
    reset() {
      for (const field of fields.values()) field.value = "";
    }
  };
  const documentHandlers = new Map();
  const document = {
    addEventListener(type, handler) {
      documentHandlers.set(type, handler);
    },
    getElementById(id) {
      if (id === "contact-form") return form;
      if (id === "form-status") return status;
      if (id.endsWith("-error")) return errors.get(id.replace(/-error$/, ""));
      return fields.get(id) ?? null;
    },
    querySelector() {
      return null;
    }
  };
  const windowHandlers = new Map();
  const readyMessages = [];
  const opener = options.withOpener ? { postMessage(data, origin) { readyMessages.push({ data, origin }); } } : null;
  document.referrer = options.referrer || '';
  const window = {
    opener,
    addEventListener(type, handler) { windowHandlers.set(type, handler); },
    location: {
      hostname: "127.0.0.1",
      href: "http://127.0.0.1:4173/contact.html",
      pathname: "/contact.html"
    }
  };

  runInNewContext(readText("script.js"), {
    document,
    fetch() {
      fetchCalls += 1;
      throw new Error("Validation should prevent a network request");
    },
    JSON,
    Promise,
    URL,
    window
  });
  documentHandlers.get("DOMContentLoaded")();

  function submit() {
    formHandlers.get("submit")({ preventDefault() {} });
  }

  return { errors, fields, getFetchCalls: () => fetchCalls, status, submit, windowHandlers, opener, readyMessages };
}

test("empty contact form reports every required field without sending", () => {
  const contact = loadContactForm();
  contact.submit();

  assert.equal(contact.errors.get("name").textContent, "Please enter your name.");
  assert.equal(contact.errors.get("email").textContent, "Please enter your email address.");
  assert.equal(contact.errors.get("subject").textContent, "Please enter a subject.");
  assert.equal(contact.errors.get("message").textContent, "Please include a message.");
  assert.equal(contact.status.textContent, "Please correct the highlighted fields before submitting.");
  assert.equal(contact.getFetchCalls(), 0);
});

test("contact handoff rejects other windows and preserves text already entered", () => {
  const contact = loadContactForm({ withOpener: true });
  const message = contact.windowHandlers.get('message');
  message({ origin: 'https://studio.hallintegratedsystems.com', source: {}, data: { type: 'his-plate-contact-hello' } });
  assert.equal(contact.readyMessages.length, 0);
  message({ origin: 'https://studio.hallintegratedsystems.com', source: contact.opener, data: { type: 'his-plate-contact-hello' } });
  contact.fields.get('message').value = 'Already typed';
  message({ origin: 'https://studio.hallintegratedsystems.com', source: contact.opener, data: { type: 'his-plate-contact-details', message: 'Replacement', name: '', email: '' } });
  assert.equal(contact.fields.get('message').value, 'Already typed');
  assert.equal(contact.getFetchCalls(), 0);
});

test("contact form accepts project details only from its trusted Studio opener without submitting", () => {
  const contact = loadContactForm({ withOpener: true });
  const message = contact.windowHandlers.get('message');
  message({ origin: 'https://studio.hallintegratedsystems.com', source: contact.opener, data: { type: 'his-plate-contact-hello' } });
  assert.equal(contact.readyMessages.length, 1);
  message({ origin: 'https://evil.example', source: contact.opener, data: { type: 'his-plate-contact-details', message: 'Untrusted' } });
  assert.equal(contact.fields.get('message').value, '');
  message({ origin: 'https://studio.hallintegratedsystems.com', source: contact.opener, data: { type: 'his-plate-contact-details', message: 'Outside diameter: 197 mm', name: 'Customer', email: 'customer@example.com' } });
  assert.equal(contact.fields.get('message').value, 'Outside diameter: 197 mm');
  assert.equal(contact.fields.get('name').value, 'Customer');
  assert.equal(contact.fields.get('subject').value, 'Speaker mounting plate inquiry');
  assert.equal(contact.getFetchCalls(), 0);
});

test("invalid email is rejected locally without sending", () => {
  const contact = loadContactForm();
  contact.fields.get("name").value = "Visitor";
  contact.fields.get("email").value = "not-an-email";
  contact.fields.get("subject").value = "Product question";
  contact.fields.get("message").value = "I have a question about the current product record.";
  contact.submit();

  assert.equal(contact.errors.get("email").textContent, "Please enter a valid email address.");
  assert.equal(contact.fields.get("email").attributes.get("aria-invalid"), "true");
  assert.equal(contact.status.textContent, "Please correct the highlighted fields before submitting.");
  assert.equal(contact.getFetchCalls(), 0);
});
