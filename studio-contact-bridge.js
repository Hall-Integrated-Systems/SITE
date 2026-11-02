(() => {
  const studioOrigin = 'https://studio.hallintegratedsystems.com';
  if (window.parent === window) return;
  let handled = false;
  window.addEventListener('message', async event => {
    if (event.origin !== studioOrigin || event.source !== window.parent || handled || event.data?.type !== 'his-studio-contact-send') return;
    handled = true;
    const { name, email, subject, message } = event.data;
    const respond = (ok) => window.parent.postMessage({ type: 'his-studio-contact-result', ok }, studioOrigin);
    try {
      const response = await fetch('https://his-contact-api-d1378abe.azurewebsites.net/api/contact', {
        method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ name, email, subject, message, _honey: '' })
      });
      const result = await response.json();
      respond(response.ok && result.ok === true);
    } catch { respond(false); }
  });
  window.parent.postMessage({ type: 'his-studio-contact-ready' }, studioOrigin);
})();
