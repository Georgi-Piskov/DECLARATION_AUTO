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
  // Helper: open printable HTML in a new tab and auto-trigger print
  const ensurePrintable = (html) => {
    if (!html) return '';
    if (/<\/body>/i.test(html)){
      return html.replace(/<\/body>/i, '<script>window.addEventListener("load",()=>{setTimeout(()=>{window.print()},200);});<\/script></body>');
    }
    return `<!doctype html><html lang="bg"><meta charset="utf-8"><title>Документ</title><meta name="viewport" content="width=device-width, initial-scale=1" /><body>${html}<script>window.addEventListener('load',()=>{setTimeout(()=>{window.print()},200);});<\/script></body></html>`;
  };

  const openPrintHtml = (html, title='Документ') => {
    const doc = ensurePrintable(html);
    const blob = new Blob([doc], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const w = window.open(url, '_blank');
    if (!w) alert('Позволете изскачащи прозорци, за да отпечатате документа.');
  };

  const addDownloadLink = (parent, html, filename) => {
    const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.textContent = 'Свали .HTML';
    a.className = 'secondary';
    parent.appendChild(a);
  };

  if (n8n?.decl11PdfUrl || n8n?.decl38PdfUrl || n8n?.decl11Html || n8n?.decl38Html){
    if (n8n.decl11PdfUrl){
      const li = document.createElement('li');
      li.innerHTML = `📄 <a target="_blank" rel="noopener" href="${n8n.decl11PdfUrl}">Декларация за неактивност – Прил. №11</a>`;
      filesList.appendChild(li);
    }
    if (n8n.decl11Html && !n8n.decl11PdfUrl){
      const li = document.createElement('li');
      const btn = document.createElement('button');
      btn.textContent = '🖨 Отвори и принтирай – Прил. №11';
      btn.onclick = () => openPrintHtml(n8n.decl11Html, 'Прил. №11');
      li.appendChild(btn);
      li.appendChild(document.createTextNode(' '));
      addDownloadLink(li, n8n.decl11Html, 'Pril11.html');
      filesList.appendChild(li);
    }
    if (n8n.decl38PdfUrl){
      const li = document.createElement('li');
      li.innerHTML = `📄 <a target="_blank" rel="noopener" href="${n8n.decl38PdfUrl}">Декларация по чл. 38, ал. 9, т. 2 ЗСч</a>`;
      filesList.appendChild(li);
    }
    if (n8n.decl38Html && !n8n.decl38PdfUrl){
      const li = document.createElement('li');
      const btn = document.createElement('button');
      btn.textContent = '🖨 Отвори и принтирай – чл. 38, ал. 9, т. 2 ЗСч';
      btn.onclick = () => openPrintHtml(n8n.decl38Html, 'Декларация по чл. 38, ал. 9, т. 2 ЗСч');
      li.appendChild(btn);
      li.appendChild(document.createTextNode(' '));
      addDownloadLink(li, n8n.decl38Html, 'ZSCh38.html');
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
