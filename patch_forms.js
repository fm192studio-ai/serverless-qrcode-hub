const fs = require('fs');

let html = fs.readFileSync('dist/admin.html', 'utf8');

// 1. Add translations for the new fields
const zhTranslations = `
        'static_qr.type.text': '文本',
        'static_qr.type.vcard': '名片',
        'static_qr.type.wifi': 'WiFi',
        'vcard.ln': '姓氏',
        'vcard.fn': '名字',
        'vcard.org': '公司',
        'vcard.title': '职位',
        'vcard.tel': '电话',
        'vcard.email': '邮箱',
        'vcard.url': '网址',
        'vcard.addr': '地址',
        'wifi.ssid': '网络名称 (SSID)',
        'wifi.pw': '密码',
        'wifi.type.wpa': 'WPA/WPA2/WPA3',
        'wifi.type.wep': 'WEP',
        'wifi.type.nopass': '无密码',
        'wifi.hidden': '隐藏网络',
`;
html = html.replace("'static_qr.generate': '生成二维码',", zhTranslations + "\n        'static_qr.generate': '生成二维码',");

const enTranslations = `
        'static_qr.type.text': 'Text',
        'static_qr.type.vcard': 'vCard',
        'static_qr.type.wifi': 'WiFi',
        'vcard.ln': 'Last Name',
        'vcard.fn': 'First Name',
        'vcard.org': 'Company',
        'vcard.title': 'Title',
        'vcard.tel': 'Phone',
        'vcard.email': 'Email',
        'vcard.url': 'Website',
        'vcard.addr': 'Address',
        'wifi.ssid': 'Network Name (SSID)',
        'wifi.pw': 'Password',
        'wifi.type.wpa': 'WPA/WPA2/WPA3',
        'wifi.type.wep': 'WEP',
        'wifi.type.nopass': 'No Password',
        'wifi.hidden': 'Hidden Network',
`;
html = html.replace("'static_qr.generate': 'Generate QR Code',", enTranslations + "\n        'static_qr.generate': 'Generate QR Code',");

// 2. Replace the static-qr form area in the modal
const oldFormArea = `
          <label class="form-control">
            <span class="label-text mb-2" data-i18n="static_qr.data.label">二维码内容</span>
            <textarea id="static-qr-data" class="textarea textarea-bordered h-32 w-full font-mono text-sm" placeholder="可手动输入 WIFI:..., BEGIN:VCARD... 等格式，或通过上方上传解析" data-i18n-ph="static_qr.data.placeholder"></textarea>
          </label>
`;

const newFormArea = `
          <div role="tablist" class="tabs tabs-bordered" id="static-qr-tabs">
            <a role="tab" class="tab tab-active" data-qr-type="text" data-i18n="static_qr.type.text">文本</a>
            <a role="tab" class="tab" data-qr-type="vcard" data-i18n="static_qr.type.vcard">名片</a>
            <a role="tab" class="tab" data-qr-type="wifi" data-i18n="static_qr.type.wifi">WiFi</a>
          </div>

          <div id="static-qr-form-text" class="form-control mt-2">
            <textarea id="static-qr-data" class="textarea textarea-bordered h-32 w-full font-mono text-sm" placeholder="可手动输入内容或通过上方上传解析"></textarea>
          </div>

          <div id="static-qr-form-vcard" class="hidden flex-col gap-2 mt-2">
            <div class="flex gap-2">
              <input id="vcard-ln" type="text" class="input input-bordered input-sm w-full" data-i18n-ph="vcard.ln" placeholder="姓氏">
              <input id="vcard-fn" type="text" class="input input-bordered input-sm w-full" data-i18n-ph="vcard.fn" placeholder="名字">
            </div>
            <input id="vcard-org" type="text" class="input input-bordered input-sm w-full" data-i18n-ph="vcard.org" placeholder="公司">
            <input id="vcard-title" type="text" class="input input-bordered input-sm w-full" data-i18n-ph="vcard.title" placeholder="职位">
            <input id="vcard-tel" type="tel" class="input input-bordered input-sm w-full" data-i18n-ph="vcard.tel" placeholder="电话">
            <input id="vcard-email" type="email" class="input input-bordered input-sm w-full" data-i18n-ph="vcard.email" placeholder="邮箱">
            <input id="vcard-url" type="url" class="input input-bordered input-sm w-full" data-i18n-ph="vcard.url" placeholder="网址">
            <textarea id="vcard-addr" class="textarea textarea-bordered textarea-sm w-full" data-i18n-ph="vcard.addr" placeholder="地址"></textarea>
          </div>

          <div id="static-qr-form-wifi" class="hidden flex-col gap-2 mt-2">
            <input id="wifi-ssid" type="text" class="input input-bordered input-sm w-full" data-i18n-ph="wifi.ssid" placeholder="网络名称 (SSID)">
            <input id="wifi-pw" type="text" class="input input-bordered input-sm w-full" data-i18n-ph="wifi.pw" placeholder="密码">
            <select id="wifi-type" class="select select-bordered select-sm w-full">
              <option value="WPA" data-i18n="wifi.type.wpa">WPA/WPA2/WPA3</option>
              <option value="WEP" data-i18n="wifi.type.wep">WEP</option>
              <option value="nopass" data-i18n="wifi.type.nopass">无密码</option>
            </select>
            <label class="label cursor-pointer justify-start gap-2 p-0 mt-1">
              <input id="wifi-hidden" type="checkbox" class="checkbox checkbox-sm checkbox-primary">
              <span class="label-text" data-i18n="wifi.hidden">隐藏网络</span>
            </label>
          </div>
`;
html = html.replace(oldFormArea.trim(), newFormArea.trim());


// 3. Add script logic for tab switching and formatting
const oldJsLogic = `
    function renderStaticQr() {
      const container = document.getElementById('static-qr-container');
      const data = document.getElementById('static-qr-data').value.trim();
`;
const newJsLogic = `
    let currentStaticQrType = 'text';

    function buildVCardData() {
      const ln = document.getElementById('vcard-ln').value.trim();
      const fn = document.getElementById('vcard-fn').value.trim();
      const org = document.getElementById('vcard-org').value.trim();
      const title = document.getElementById('vcard-title').value.trim();
      const tel = document.getElementById('vcard-tel').value.trim();
      const email = document.getElementById('vcard-email').value.trim();
      const url = document.getElementById('vcard-url').value.trim();
      const addr = document.getElementById('vcard-addr').value.trim();
      
      let vcard = 'BEGIN:VCARD\\nVERSION:3.0\\n';
      vcard += 'N:' + (ln || '') + ';' + (fn || '') + ';;;\\n';
      vcard += 'FN:' + (fn ? fn + ' ' : '') + (ln || '') + '\\n';
      if (org) vcard += 'ORG:' + org + '\\n';
      if (title) vcard += 'TITLE:' + title + '\\n';
      if (tel) vcard += 'TEL:' + tel + '\\n';
      if (email) vcard += 'EMAIL:' + email + '\\n';
      if (url) vcard += 'URL:' + url + '\\n';
      if (addr) vcard += 'ADR:;;' + addr.replace(/\\n/g, ' ') + ';;;;\\n';
      vcard += 'END:VCARD';
      return vcard;
    }

    function buildWifiData() {
      const ssid = document.getElementById('wifi-ssid').value.trim();
      const pw = document.getElementById('wifi-pw').value.trim();
      const type = document.getElementById('wifi-type').value;
      const hidden = document.getElementById('wifi-hidden').checked ? 'true' : 'false';
      
      if (!ssid) return '';
      return 'WIFI:S:' + ssid + ';T:' + type + ';P:' + pw + ';H:' + hidden + ';;';
    }

    function getActiveStaticQrData() {
      if (currentStaticQrType === 'vcard') return buildVCardData();
      if (currentStaticQrType === 'wifi') return buildWifiData();
      return document.getElementById('static-qr-data').value.trim();
    }

    function updateStaticQrFormVisibility() {
      document.getElementById('static-qr-form-text').classList.toggle('hidden', currentStaticQrType !== 'text');
      document.getElementById('static-qr-form-vcard').classList.toggle('hidden', currentStaticQrType !== 'vcard');
      document.getElementById('static-qr-form-wifi').classList.toggle('hidden', currentStaticQrType !== 'wifi');
    }

    document.querySelectorAll('#static-qr-tabs .tab').forEach(tab => {
      tab.addEventListener('click', (e) => {
        document.querySelectorAll('#static-qr-tabs .tab').forEach(t => t.classList.remove('tab-active'));
        e.target.classList.add('tab-active');
        currentStaticQrType = e.target.dataset.qrType;
        updateStaticQrFormVisibility();
        renderStaticQr();
      });
    });

    ['vcard-ln', 'vcard-fn', 'vcard-org', 'vcard-title', 'vcard-tel', 'vcard-email', 'vcard-url', 'vcard-addr', 'wifi-ssid', 'wifi-pw', 'wifi-type', 'wifi-hidden'].forEach(id => {
      document.getElementById(id).addEventListener('input', renderStaticQr);
      document.getElementById(id).addEventListener('change', renderStaticQr);
    });

    function parseToForm(text) {
      if (text.startsWith('WIFI:')) {
        document.querySelector('#static-qr-tabs .tab[data-qr-type="wifi"]').click();
        const ssidMatch = text.match(/S:([^;]+);/);
        const pwMatch = text.match(/P:([^;]+);/);
        const typeMatch = text.match(/T:([^;]+);/);
        const hiddenMatch = text.match(/H:([^;]+);/);
        document.getElementById('wifi-ssid').value = ssidMatch ? ssidMatch[1] : '';
        document.getElementById('wifi-pw').value = pwMatch ? pwMatch[1] : '';
        document.getElementById('wifi-type').value = typeMatch ? typeMatch[1] : 'nopass';
        document.getElementById('wifi-hidden').checked = hiddenMatch && hiddenMatch[1] === 'true';
      } else if (text.startsWith('BEGIN:VCARD')) {
        document.querySelector('#static-qr-tabs .tab[data-qr-type="vcard"]').click();
        const nMatch = text.match(/\\nN:([^;]*);([^;]*)/);
        const orgMatch = text.match(/\\nORG:([^\\n]+)/);
        const titleMatch = text.match(/\\nTITLE:([^\\n]+)/);
        const telMatch = text.match(/\\nTEL[^:]*:([^\\n]+)/);
        const emailMatch = text.match(/\\nEMAIL[^:]*:([^\\n]+)/);
        const urlMatch = text.match(/\\nURL[^:]*:([^\\n]+)/);
        const addrMatch = text.match(/\\nADR[^:]*:;;([^;]+)/);

        document.getElementById('vcard-ln').value = nMatch ? nMatch[1] : '';
        document.getElementById('vcard-fn').value = nMatch ? nMatch[2] : '';
        document.getElementById('vcard-org').value = orgMatch ? orgMatch[1] : '';
        document.getElementById('vcard-title').value = titleMatch ? titleMatch[1] : '';
        document.getElementById('vcard-tel').value = telMatch ? telMatch[1] : '';
        document.getElementById('vcard-email').value = emailMatch ? emailMatch[1] : '';
        document.getElementById('vcard-url').value = urlMatch ? urlMatch[1] : '';
        document.getElementById('vcard-addr').value = addrMatch ? addrMatch[1] : '';
      } else {
        document.querySelector('#static-qr-tabs .tab[data-qr-type="text"]').click();
      }
    }

    function renderStaticQr() {
      const container = document.getElementById('static-qr-container');
      const data = getActiveStaticQrData();
`;
html = html.replace(oldJsLogic.trim(), newJsLogic.trim());

// Also replace the parsing step in handleStaticQrFile:
// from `document.getElementById('static-qr-data').value = text;`
// to `document.getElementById('static-qr-data').value = text; parseToForm(text);`
html = html.replace(
  "document.getElementById('static-qr-data').value = text;",
  "document.getElementById('static-qr-data').value = text;\n        parseToForm(text);"
);


fs.writeFileSync('dist/admin.html', html, 'utf8');
console.log('Patched dist/admin.html with forms');
