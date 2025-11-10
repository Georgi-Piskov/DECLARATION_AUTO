// Регистрация на Service Worker за PWA (относителен път за GitHub Pages)
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
    errEl.textContent = 'Моля, проверете попълнените полета (ЕИК: 9 или 13 цифри).';
    errEl.hidden = false;
    return;
  }

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
    role: form.role.value
  };

  // Запази локално (за всеки случай)
  localStorage.setItem('companyPayload', JSON.stringify(payload));

  // Изпращане към n8n (ако е настроен)
  let n8nResponse = null;
  try{
    if (!window.N8N_WEBHOOK_URL){
      console.warn('N8N_WEBHOOK_URL не е зададен. Ще продължим без POST.');
    } else {
      // При webhook-test в n8n, OPTIONS preflight може да "изяде" слушането.
      // За да избегнем preflight при тест, изпращаме като text/plain.
      const isTest = /webhook-test\//.test(window.N8N_WEBHOOK_URL);
      const body = JSON.stringify(payload);
      const headers = isTest ? { 'Content-Type':'text/plain;charset=UTF-8' } : { 'Content-Type':'application/json' };
      console.log('Изпращам към n8n:', window.N8N_WEBHOOK_URL, { isTest });
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
    console.error('Грешка при изпращане към n8n:', err);
    errEl.textContent = 'Грешка при изпращане към n8n. Вижте конзолата (F12 → Console).';
    errEl.hidden = false;
  }

  if (n8nResponse){
    sessionStorage.setItem('n8nResponse', JSON.stringify(n8nResponse));
  }else{
    sessionStorage.removeItem('n8nResponse');
  }

  // Редирект към резултатите
  window.location.href = 'results.html';
});
