const { app } = require("@azure/functions");

const DEFAULT_ALLOWED_ORIGINS = [
  "http://localhost:8080",
  "http://127.0.0.1:8080",
];

const MAX_LENGTHS = {
  name: 120,
  email: 254,
  subject: 160,
  message: 5000,
};

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

app.http("contact", {
  methods: ["GET", "POST", "OPTIONS"],
  authLevel: "anonymous",
  route: "contact",
  handler: contact,
});

async function contact(request, context) {
  const allowedOrigins = getAllowedOrigins();
  const origin = request.headers.get("origin");
  const cors = getCorsHeaders(origin, allowedOrigins);

  if (origin && !isAllowedOrigin(origin, allowedOrigins)) {
    return jsonResponse(403, {
      ok: false,
      error: "Origin is not allowed.",
    }, cors);
  }

  if (request.method === "OPTIONS") {
    return jsonResponse(200, {
      ok: true,
    }, cors);
  }

  if (request.method === "GET") {
    return jsonResponse(200, {
      ok: true,
      status: "healthy",
      function: "contact",
    }, cors);
  }

  if (request.method !== "POST") {
    return jsonResponse(405, {
      ok: false,
      error: "Method not allowed.",
    }, cors);
  }

  if (!origin && !allowNoOriginPost()) {
    return jsonResponse(403, {
      ok: false,
      error: "Origin is required.",
    }, cors);
  }

  let body;
  try {
    body = await request.json();
  } catch (error) {
    return jsonResponse(400, {
      ok: false,
      error: "Request body must be valid JSON.",
    }, cors);
  }

  if (hasFilledHoneypot(body)) {
    return jsonResponse(200, genericSuccessBody(), cors);
  }

  const validation = validatePayload(body);
  if (!validation.ok) {
    return jsonResponse(400, {
      ok: false,
      error: "Validation failed.",
      fields: validation.errors,
    }, cors);
  }

  const graphConfig = getGraphConfig();
  if (!graphConfig.ok) {
    return jsonResponse(500, {
      ok: false,
      error: "Contact email is not configured.",
      missing: graphConfig.missing,
    }, cors);
  }

  try {
    await sendMailWithGraph(graphConfig.values, validation.values, origin || "");
  } catch (error) {
    context.error("Graph sendMail failed.", {
      message: error.message,
      status: error.status || null,
    });

    return jsonResponse(502, {
      ok: false,
      error: "Contact email could not be sent.",
    }, cors);
  }

  return jsonResponse(200, genericSuccessBody(), cors);
}

function getAllowedOrigins() {
  const configured = (process.env.CONTACT_ALLOWED_ORIGINS || "")
    .split(",")
    .map(normalizeOrigin)
    .filter(Boolean);

  return new Set(configured.length > 0 ? configured : DEFAULT_ALLOWED_ORIGINS);
}

function normalizeOrigin(origin) {
  return String(origin || "").trim().replace(/\/+$/, "");
}

function isAllowedOrigin(origin, allowedOrigins) {
  return allowedOrigins.has(normalizeOrigin(origin));
}

function allowNoOriginPost() {
  return process.env.CONTACT_ALLOW_NO_ORIGIN_POST === "true";
}

function getCorsHeaders(origin, allowedOrigins) {
  const headers = {
    "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Max-Age": "86400",
    "Cache-Control": "no-store",
    "Content-Type": "application/json; charset=utf-8",
    "Vary": "Origin",
  };

  if (origin && isAllowedOrigin(origin, allowedOrigins)) {
    headers["Access-Control-Allow-Origin"] = origin;
  }

  return headers;
}

function jsonResponse(status, payload, headers) {
  return {
    status,
    headers,
    jsonBody: payload,
  };
}

function genericSuccessBody() {
  return {
    ok: true,
    message: "Message received.",
  };
}

function hasFilledHoneypot(body) {
  return typeof body?._honey === "string" && body._honey.trim().length > 0;
}

function validatePayload(body) {
  const errors = {};
  const values = {};

  for (const field of Object.keys(MAX_LENGTHS)) {
    const value = body?.[field];

    if (typeof value !== "string") {
      errors[field] = `${field} is required.`;
      continue;
    }

    const trimmed = value.trim();
    if (!trimmed) {
      errors[field] = `${field} is required.`;
      continue;
    }

    if (trimmed.length > MAX_LENGTHS[field]) {
      errors[field] = `${field} must be ${MAX_LENGTHS[field]} characters or fewer.`;
      continue;
    }

    values[field] = trimmed;
  }

  if (values.email && !EMAIL_PATTERN.test(values.email)) {
    errors.email = "email must be a valid email address.";
  }

  return {
    ok: Object.keys(errors).length === 0,
    errors,
    values,
  };
}

function getGraphConfig() {
  const required = [
    "GRAPH_TENANT_ID",
    "GRAPH_CLIENT_ID",
    "GRAPH_CLIENT_SECRET",
    "GRAPH_SENDER",
    "CONTACT_RECIPIENT",
  ];
  const missing = required.filter((name) => !process.env[name]);

  if (missing.length > 0) {
    return {
      ok: false,
      missing,
    };
  }

  return {
    ok: true,
    values: {
      tenantId: process.env.GRAPH_TENANT_ID,
      clientId: process.env.GRAPH_CLIENT_ID,
      clientSecret: process.env.GRAPH_CLIENT_SECRET,
      sender: process.env.GRAPH_SENDER,
      recipient: process.env.CONTACT_RECIPIENT,
    },
  };
}

async function sendMailWithGraph(config, form, origin) {
  const token = await getGraphToken(config);
  const response = await fetch(
    `https://graph.microsoft.com/v1.0/users/${encodeURIComponent(config.sender)}/sendMail`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: {
          subject: `[HIS Contact] ${form.subject}`,
          body: {
            contentType: "HTML",
            content: buildEmailHtml(form, origin),
          },
          toRecipients: [
            {
              emailAddress: {
                address: config.recipient,
              },
            },
          ],
          replyTo: [
            {
              emailAddress: {
                address: form.email,
                name: form.name,
              },
            },
          ],
        },
        saveToSentItems: false,
      }),
    },
  );

  if (!response.ok) {
    throw await graphError("sendMail", response);
  }
}

async function getGraphToken(config) {
  const params = new URLSearchParams({
    client_id: config.clientId,
    client_secret: config.clientSecret,
    grant_type: "client_credentials",
    scope: "https://graph.microsoft.com/.default",
  });

  const response = await fetch(
    `https://login.microsoftonline.com/${encodeURIComponent(config.tenantId)}/oauth2/v2.0/token`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: params.toString(),
    },
  );

  if (!response.ok) {
    throw await graphError("token", response);
  }

  const tokenBody = await response.json();
  if (!tokenBody.access_token) {
    const error = new Error("Graph token response did not include an access token.");
    error.status = response.status;
    throw error;
  }

  return tokenBody.access_token;
}

async function graphError(operation, response) {
  const error = new Error(`Graph ${operation} request failed with status ${response.status}.`);
  error.status = response.status;
  return error;
}

function buildEmailHtml(form, origin) {
  const timestamp = new Date().toISOString();
  const sourceOrigin = origin || "No Origin header";

  return `
    <h2>Hall Integrated Systems Contact Form</h2>
    <table cellpadding="6" cellspacing="0" border="0">
      <tr>
        <th align="left" scope="row">Name</th>
        <td>${escapeHtml(form.name)}</td>
      </tr>
      <tr>
        <th align="left" scope="row">Email</th>
        <td>${escapeHtml(form.email)}</td>
      </tr>
      <tr>
        <th align="left" scope="row">Subject</th>
        <td>${escapeHtml(form.subject)}</td>
      </tr>
      <tr>
        <th align="left" scope="row">Timestamp UTC</th>
        <td>${escapeHtml(timestamp)}</td>
      </tr>
      <tr>
        <th align="left" scope="row">Source origin</th>
        <td>${escapeHtml(sourceOrigin)}</td>
      </tr>
    </table>
    <h3>Message</h3>
    <p>${escapeHtml(form.message).replace(/\n/g, "<br>")}</p>
  `;
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

module.exports = {
  contact,
};
