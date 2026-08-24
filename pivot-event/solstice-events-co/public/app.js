const input = document.querySelector('#code');
const button = document.querySelector('#check');
const status = document.querySelector('#status');
const actions = document.querySelector('#actions');
const simulate = document.querySelector('#simulate');
let statusPoll = null;
let activeCode = null;
let activeJobId = null;

const show = (kind, title, message) => {
  status.className = `status ${kind}`;
  status.innerHTML = `<b>${title}</b><span>${message}</span>`;
};

function stopStatusPolling() {
  if (statusPoll) clearInterval(statusPoll);
  statusPoll = null;
}

function setDemoAction(visible) {
  actions.hidden = !visible;
  simulate.disabled = false;
}

function watchForWebhookConfirmation(code, jobId) {
  stopStatusPolling();
  statusPoll = setInterval(async () => {
    try {
      const response = await fetch(`/api/attendee-status?code=${encodeURIComponent(code)}`);
      if (!response.ok) return;
      const data = await response.json();
      if (data.attendee.status === 'CHECKED_IN' && data.attendee.print_job_id === jobId) {
        stopStatusPolling();
        activeCode = null;
        activeJobId = null;
        setDemoAction(false);
        show('success', 'Checked In ✓', 'The verified badge-printer webhook confirmed completion.');
      }
    } catch (_error) {}
  }, 700);
}

async function checkIn() {
  stopStatusPolling();
  setDemoAction(false);
  const code = input.value.trim().toUpperCase();
  if (!code) return show('error', 'Missing code', 'Enter an attendee code first.');

  button.disabled = true;
  show('pending', 'Checking…', 'Validating the attendee and creating an idempotent print job.');
  try {
    const response = await fetch('/api/check-in', { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify({ attendeeCode: code }) });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || 'Check-in failed');

    if (data.status === 'checked_in') {
      show('success', 'Already checked in ✓', data.message);
      return;
    }

    activeCode = code;
    activeJobId = data.jobId;
    show('pending', 'Printing…', `${data.message} Job ${data.jobId}.`);
    setDemoAction(Boolean(data.demoWebhookAvailable));
    watchForWebhookConfirmation(code, data.jobId);
  } catch (error) {
    show('error', 'Unable to check in', error.message);
  } finally { button.disabled = false; }
}

async function simulatePrinterCompletion() {
  if (!activeCode || !activeJobId) return;
  simulate.disabled = true;
  show('pending', 'Printer callback received…', 'Signing the vendor event and sending it through webhook verification.');
  try {
    const response = await fetch('/api/demo/printer-complete', { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify({ attendeeCode: activeCode }) });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || 'Printer simulation failed');
    if (data.duplicate) show('success', 'Webhook replay ignored ✓', 'The event was already processed safely.');
  } catch (error) {
    simulate.disabled = false;
    show('error', 'Webhook simulation failed', error.message);
  }
}

button.onclick = checkIn;
simulate.onclick = simulatePrinterCompletion;
input.addEventListener('keydown', event => { if (event.key === 'Enter') checkIn(); });
document.querySelectorAll('[data-code]').forEach(el => { el.onclick = () => { input.value = el.dataset.code; checkIn(); }; });
