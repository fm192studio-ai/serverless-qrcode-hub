const fs = require('fs');
let html = fs.readFileSync('dist/admin.html', 'utf8');

html = html.replace(`    document.getElementById('static-qr-open-btn').addEventListener('click', () => {
      document.getElementById('static-qr-modal').showModal(); updateStaticQrFormVisibility();
      if (document.getElementById('static-qr-data').value) {
        renderStaticQr();
      }
    });`, `    document.getElementById('static-qr-open-btn').addEventListener('click', () => {
      document.getElementById('static-qr-modal').showModal();
      updateStaticQrFormVisibility();
      renderStaticQr();
    });`);

fs.writeFileSync('dist/admin.html', html, 'utf8');
