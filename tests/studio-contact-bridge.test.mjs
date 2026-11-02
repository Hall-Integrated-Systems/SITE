import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';

const script = readFileSync(new URL('../studio-contact-bridge.js', import.meta.url), 'utf8');
function setup(fetch) {
  const sent = [], handlers = {};
  const parent = { postMessage: (data, origin) => sent.push({ data, origin }) };
  const window = { parent, addEventListener: (name, fn) => { handlers[name] = fn; } };
  vm.runInNewContext(script, { window, fetch, JSON });
  return { sent, handlers, parent };
}
test('bridge accepts only Studio parent and sends a single request including project details', async () => {
  const requests = [];
  const { sent, handlers, parent } = setup(async (url, options) => { requests.push({ url, options }); return { ok: true, json: async () => ({ ok: true }) }; });
  const data = { type: 'his-studio-contact-send', name: 'A', email: 'a@example.com', subject: 'Spacer ring inquiry', message: 'Outside diameter: 200 mm' };
  await handlers.message({ origin: 'https://example.com', source: parent, data });
  await handlers.message({ origin: 'https://studio.hallintegratedsystems.com', source: {}, data });
  assert.equal(requests.length, 0);
  await handlers.message({ origin: 'https://studio.hallintegratedsystems.com', source: parent, data });
  await handlers.message({ origin: 'https://studio.hallintegratedsystems.com', source: parent, data });
  assert.equal(requests.length, 1);
  assert.equal(JSON.parse(requests[0].options.body).message, data.message);
  assert.equal(sent.at(-1).data.ok, true);
  assert.equal(sent.at(-1).origin, 'https://studio.hallintegratedsystems.com');
});
test('bridge reports an unsuccessful response instead of claiming success', async () => {
  const { sent, handlers, parent } = setup(async () => ({ ok: false, json: async () => ({ ok: false }) }));
  await handlers.message({ origin: 'https://studio.hallintegratedsystems.com', source: parent, data: { type: 'his-studio-contact-send' } });
  assert.equal(sent.at(-1).data.ok, false);
});
