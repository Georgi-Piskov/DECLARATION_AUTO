// Р РµРіРёСЃС‚СЂР°С†РёСЏ РЅР° Service Worker Р·Р° PWA (РѕС‚РЅРѕСЃРёС‚РµР»РµРЅ РїСЉС‚ Р·Р° GitHub Pages)
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('sw.js').catch(console.error);
  });
}

const form = document.getElementById('companyForm');
const nextBtn = document.getElementById('nextBtn');
const errEl = document.getElementById('formError');
const dateEl = document.getElementById('date');
const yearEl = document.getElementById('year');

(function initDefaults(){
  const today = new Date();
  dateEl.value = today.toISOString().slice(0,10);
  yearEl.value = String(today.getFullYear());
})();

form.addEventListener('input', () => {
  nextBtn.disabled = !form.checkValidity() || !isEikValid();
});

function isEikValid(){
  const eik = form.eik.value.trim();
  return /^\d{9}$/.test(eik) || /^\d{13}$/.test(eik);
}

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  errEl.hidden = true;
  if (!form.checkValidity() || !isEikValid()){
    errEl.textContent = 'РњРѕР»СЏ, РїСЂРѕРІРµСЂРµС‚Рµ РїРѕРїСЉР»РЅРµРЅРёС‚Рµ РїРѕР»РµС‚Р° (Р•РРљ: 9 РёР»Рё 13 С†РёС„СЂРё).';
    errEl.hidden = false;
    return;
  }

  // РЎРµСЂРёР»РёР·РёСЂР°РјРµ Р’РЎРР§РљР РїРѕР»РµС‚Р° РѕС‚ С„РѕСЂРјР°С‚Р° (Р·Р°РµРґРЅРѕ СЃ РѕСЂРёРіРёРЅР°Р»РЅРёС‚Рµ РєР»СЋС‡РѕРІРµ)
  const fd = new FormData(form);
  const formFields = {};
  fd.forEach((v, k) => { formFields[k] = typeof v === 'string' ? v.trim() : v; });

  const payload = {
    eik: form.eik.value.trim(),
    companyName: form.name.value.trim(),
    legalForm: form.legal.value,
    address: form.address.value.trim(),
    manager: form.manager.value.trim(),
    email: form.email.value.trim(),
    phone: form.phone.value.trim(),
    reportYear: form.year.value.trim(),
    city: form.city.value.trim(),
    date: form.date.value,
    role: form.role.value,`n    ownership: form.ownership.value,
    formFields, // РїСЉР»РЅРѕ РєРѕРїРёРµ РЅР° РІСЃРёС‡РєРё РїРѕР»РµС‚Р°
    meta: { ts: new Date().toISOString(), ua: navigator.userAgent, page: location.href }
  };
  console.log('Payload РєСЉРј n8n:', payload);

  // Р—Р°РїР°Р·Рё Р»РѕРєР°Р»РЅРѕ (Р·Р° РІСЃРµРєРё СЃР»СѓС‡Р°Р№)
  localStorage.setItem('companyPayload', JSON.stringify(payload));

  // РР·РїСЂР°С‰Р°РЅРµ РєСЉРј n8n (Р°РєРѕ Рµ РЅР°СЃС‚СЂРѕРµРЅ)
  let n8nResponse = null;
  try{
    if (!window.N8N_WEBHOOK_URL){
      console.warn('N8N_WEBHOOK_URL РЅРµ Рµ Р·Р°РґР°РґРµРЅ. Р©Рµ РїСЂРѕРґСЉР»Р¶РёРј Р±РµР· POST.');
    } else {
      // РџСЂРё webhook-test РІ n8n, OPTIONS preflight РјРѕР¶Рµ РґР° "РёР·СЏРґРµ" СЃР»СѓС€Р°РЅРµС‚Рѕ.
      // Р—Р° РґР° РёР·Р±РµРіРЅРµРј preflight РїСЂРё С‚РµСЃС‚, РёР·РїСЂР°С‰Р°РјРµ РєР°С‚Рѕ text/plain.
      const isTest = /webhook-test\//.test(window.N8N_WEBHOOK_URL);
      const body = JSON.stringify(payload);
      const headers = isTest ? { 'Content-Type':'text/plain;charset=UTF-8' } : { 'Content-Type':'application/json' };
      console.log('РР·РїСЂР°С‰Р°Рј РєСЉРј n8n:', window.N8N_WEBHOOK_URL, { isTest });
      const res = await fetch(window.N8N_WEBHOOK_URL, {
        method: 'POST',
        mode: 'cors',
        headers,
        body
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      n8nResponse = await res.json();
    }
  }catch(err){
    console.error('Р“СЂРµС€РєР° РїСЂРё РёР·РїСЂР°С‰Р°РЅРµ РєСЉРј n8n:', err);
    errEl.textContent = 'Р“СЂРµС€РєР° РїСЂРё РёР·РїСЂР°С‰Р°РЅРµ РєСЉРј n8n. Р’РёР¶С‚Рµ РєРѕРЅР·РѕР»Р°С‚Р° (F12 в†’ Console).';
    errEl.hidden = false;
  }

  if (n8nResponse){
    sessionStorage.setItem('n8nResponse', JSON.stringify(n8nResponse));
  }else{
    sessionStorage.removeItem('n8nResponse');
  }

  // Р РµРґРёСЂРµРєС‚ РєСЉРј СЂРµР·СѓР»С‚Р°С‚РёС‚Рµ
  window.location.href = 'results.html';
});

