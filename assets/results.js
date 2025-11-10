// Зареждане на резултати от sessionStorage (n8n) и localStorage (payload)
const filesList = document.getElementById('filesList');
const adviceBox = document.getElementById('adviceBox');
const emailExample = document.getElementById('emailExample');

const n8n = (() => {
  const raw = sessionStorage.getItem('n8nResponse');
  if (!raw) return null;
  try { return JSON.parse(raw); } catch { return null; }
})();

const payload = (() => {
  const raw = localStorage.getItem('companyPayload');
  if (!raw) return null;
  try { return JSON.parse(raw); } catch { return null; }
})();

function renderFiles(){
  filesList.innerHTML = '';
  if (n8n?.decl11PdfUrl || n8n?.decl38PdfUrl){
    if (n8n.decl11PdfUrl){
      const li = document.createElement('li');
      li.innerHTML = `📄 <a target="_blank" rel="noopener" href="${n8n.decl11PdfUrl}">Декларация за неактивност – Прил. №11</a>`;
      filesList.appendChild(li);
    }
    if (n8n.decl38PdfUrl){
      const li = document.createElement('li');
      li.innerHTML = `📄 <a target="_blank" rel="noopener" href="${n8n.decl38PdfUrl}">Декларация по чл. 38, ал. 9, т. 2 ЗСч</a>`;
      filesList.appendChild(li);
    }
  } else {
    const li = document.createElement('li');
    li.textContent = 'Все още няма върнати файлове. Ако стигнахте тук директно, изпратете формата от началната страница.';
    filesList.appendChild(li);
  }
}

function renderAdvice(){
  if (n8n?.adviceHtml){
    adviceBox.innerHTML = n8n.adviceHtml;
  } else {
    adviceBox.innerHTML = `<p>Пример: Подайте Прил. №11 в НСИ (електронно/на хартия) и декларацията по ЗСч в ТРРЮЛНЦ (електронно).</p>`;
  }
}

function renderEmail(){
  if (n8n?.sampleEmail){
    emailExample.textContent = n8n.sampleEmail;
  } else if (payload) {
    emailExample.textContent =
`До: [институция@domain.bg]
Тема: Декларация за неактивност – ${payload.companyName} (${payload.eik})

Здравейте,
Изпращам приложени декларации за дружество без дейност за отчетна година ${payload.reportYear}.
С уважение,
${payload.manager}
${payload.phone}`;
  } else {
    emailExample.textContent = 'Примерен имейл ще бъде зареден след генериране от n8n.';
  }
}

renderFiles();
renderAdvice();
renderEmail();

