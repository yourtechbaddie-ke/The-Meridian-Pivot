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

function stopStatusPolling(){if(statusPoll)clearInterval(statusPoll);statusPoll=null}
function setDemoAction(visible){actions.hidden=!visible;simulate.disabled=false}

async function loadDashboard(){
  try{
    const r=await fetch('/api/dashboard'); const d=await r.json();
    document.querySelector('#registered').textContent=d.totals.total;
    document.querySelector('#checkedIn').textContent=d.totals.checkedIn;
    document.querySelector('#queue').textContent=d.totals.pending;
    document.querySelector('#heroGuests').textContent=d.event.guests;
    renderActivity(d.recent);
    renderDemoGuests(d.recent);
  }catch(e){console.warn('Dashboard refresh failed',e)}
}

async function loadEvents(){
  try{const r=await fetch('/api/events');const d=await r.json();document.querySelector('#eventGrid').innerHTML=d.events.map((e,i)=>`<article class="event-card ${i===0?'featured':''}"><span class="category">${e.category.toUpperCase()}</span><h4>${e.name}</h4><p>${e.venue} · ${e.date}</p><div class="event-bottom"><span>${e.guests} guests · ${e.readiness}% ready</span><span class="event-status">${e.status}</span></div></article>`).join('')}catch(e){console.warn('Event load failed',e)}
}

function renderActivity(items){
  const labels=['Guest record refreshed','Operations heartbeat received','Badge queue reconciled','Event readiness recalculated','Webhook service healthy','Guest manifest synchronised','Vendor milestone confirmed','Timeline checkpoint logged'];
  document.querySelector('#activityList').innerHTML=items.map((x,i)=>`<div class="activity-row"><i class="activity-dot"></i><div><b>${labels[i%labels.length]}</b><span>${x.name} · ${x.attendee_code}</span></div><time>${i<2?'LIVE':'RECENT'}</time></div>`).join('');
}

function renderDemoGuests(items){document.querySelector('#demoList').innerHTML=items.slice(0,6).map(x=>`<button data-code="${x.attendee_code}">${x.attendee_code}<br><strong>${x.name}</strong></button>`).join('');document.querySelectorAll('[data-code]').forEach(el=>el.onclick=()=>{input.value=el.dataset.code;checkIn()})}

function watchForWebhookConfirmation(code,jobId){stopStatusPolling();statusPoll=setInterval(async()=>{try{const r=await fetch(`/api/attendee-status?code=${encodeURIComponent(code)}`);if(!r.ok)return;const d=await r.json();if(d.attendee.status==='CHECKED_IN'&&d.attendee.print_job_id===jobId){stopStatusPolling();activeCode=null;activeJobId=null;setDemoAction(false);show('success','Checked In ✓','Verified badge-printer webhook confirmed completion.');loadDashboard()}}catch(_e){}},700)}

async function checkIn(){
  stopStatusPolling();setDemoAction(false);const code=input.value.trim().toUpperCase();if(!code)return show('error','Missing guest code','Enter an attendee code first.');
  button.disabled=true;show('pending','Checking…','Validating the guest and creating an idempotent print job.');
  try{const r=await fetch('/api/check-in',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({attendeeCode:code})});const d=await r.json();if(!r.ok)throw new Error(d.error||'Check-in failed');if(d.status==='checked_in'){show('success','Already checked in ✓',d.message);loadDashboard();return}activeCode=code;activeJobId=d.jobId;show('pending','Printing…',`${d.message} Job ${d.jobId}.`);setDemoAction(Boolean(d.demoWebhookAvailable));watchForWebhookConfirmation(code,d.jobId)}catch(e){show('error','Unable to check in',e.message)}finally{button.disabled=false}}

async function simulatePrinterCompletion(){if(!activeCode||!activeJobId)return;simulate.disabled=true;show('pending','Printer callback received…','Signing the vendor event and sending it through webhook verification.');try{const r=await fetch('/api/demo/printer-complete',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({attendeeCode:activeCode})});const d=await r.json();if(!r.ok)throw new Error(d.error||'Printer simulation failed');if(d.duplicate)show('success','Webhook replay ignored ✓','The event was already processed safely.')}catch(e){simulate.disabled=false;show('error','Webhook simulation failed',e.message)}}

button.onclick=checkIn;simulate.onclick=simulatePrinterCompletion;input.addEventListener('keydown',e=>{if(e.key==='Enter')checkIn()});loadEvents();loadDashboard();setInterval(loadDashboard,5000);
