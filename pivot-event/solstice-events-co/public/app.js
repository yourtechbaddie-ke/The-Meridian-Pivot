const input = document.querySelector('#code');
const button = document.querySelector('#check');
const status = document.querySelector('#status');

const show = (kind, title, message) => {
  status.className = `status ${kind}`;
  status.innerHTML = `<b>${title}</b><span>${message}</span>`;
};

async function checkIn() {
  const code = input.value.trim().toUpperCase();
  if (!code) return show('error', 'Missing code', 'Enter an attendee code first.');

  button.disabled = true;
  show('pending', 'Checking…', 'Validating the attendee and starting the asynchronous badge print.');

  try {
    const response = await fetch('/api/check-in', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ attendeeCode: code })
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.error || 'Check-in failed');

    if (data.status === 'checked_in') {
      show('success', 'Already checked in ✓', data.message);
    } else {
      show('pending', 'Printing…', `${data.message} Job ${data.jobId}.`);
    }
  } catch (error) {
    show('error', 'Unable to check in', error.message);
  } finally {
    button.disabled = false;
  }
}

button.onclick = checkIn;
input.addEventListener('keydown', event => {
  if (event.key === 'Enter') checkIn();
});

document.querySelectorAll('[data-code]').forEach(buttonElement => {
  buttonElement.onclick = () => {
    input.value = buttonElement.dataset.code;
    checkIn();
  };
});
