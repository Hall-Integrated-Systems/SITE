# Hall Integrated Systems Contact API

This folder is a local Azure Functions scaffold for a future Hall Integrated Systems contact-form API. The current website is not wired to this API yet, and no Azure resources or deployed endpoints have been created.

## Local Setup

1. Install Node.js and Azure Functions Core Tools.
2. From this folder, install dependencies:

   ```powershell
   npm install
   ```

3. Copy `local.settings.sample.json` to `local.settings.json`.
4. Replace the placeholder values in `local.settings.json` with real local settings. Do not commit `local.settings.json`.
5. Start the local function host:

   ```powershell
   npm start
   ```

With the default Functions route prefix, the function is available locally at:

- `GET http://localhost:7071/api/contact`
- `POST http://localhost:7071/api/contact`
- `OPTIONS http://localhost:7071/api/contact`

## Required Environment Variables

- `GRAPH_TENANT_ID`: Microsoft Entra tenant ID for the app registration.
- `GRAPH_CLIENT_ID`: Microsoft Entra application client ID.
- `GRAPH_CLIENT_SECRET`: Microsoft Entra client secret.
- `GRAPH_SENDER`: Mailbox user principal name or ID used to send the message.
- `CONTACT_RECIPIENT`: Destination mailbox for contact form messages.
- `CONTACT_ALLOWED_ORIGINS`: Comma-separated browser origins allowed to call the function.

If `CONTACT_ALLOWED_ORIGINS` is not set, the local defaults are:

- `http://localhost:8080`
- `http://127.0.0.1:8080`

## Microsoft Graph Setup Still Required

Before this can send real email, Azure setup is still required:

- Create an Azure App Registration.
- Add Microsoft Graph `Mail.Send` application permission.
- Grant tenant admin consent for the application permission.
- Create a Function App when ready to deploy.
- Add the required environment variables as Function App settings.

This scaffold uses built-in `fetch` for the Microsoft identity token request and Graph `sendMail` request. It does not use the Microsoft Graph SDK.

## Current Website Status

`contact.html` is intentionally not wired to this API yet. The existing static website files should continue to behave exactly as they did before this scaffold was added.

