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

function loadContactForm() {
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
  const window = {
    addEventListener() {},
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

  return { errors, fields, getFetchCalls: () => fetchCalls, status, submit };
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
