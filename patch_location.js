const fs = require('fs');

let html = fs.readFileSync('dist/admin.html', 'utf8');

// 1. Add translations
const zhTranslations = `
        'static_qr.type.location': '导航',
        'location.lat': '纬度 (可选)',
        'location.lng': '经度 (可选)',
        'location.query': '地点名称/地址',
`;
html = html.replace("'static_qr.type.wifi': 'WiFi',", "'static_qr.type.wifi': 'WiFi',\n" + zhTranslations);

const enTranslations = `
        'static_qr.type.location': 'Location',
        'location.lat': 'Latitude (Optional)',
        'location.lng': 'Longitude (Optional)',
        'location.query': 'Place Name / Address',
`;
html = html.replace("'static_qr.type.wifi': 'WiFi',", "'static_qr.type.wifi': 'WiFi',\n" + enTranslations);

// 2. Add Tab
html = html.replace('<a role="tab" class="tab" data-qr-type="wifi" data-i18n="static_qr.type.wifi">WiFi</a>', '<a role="tab" class="tab" data-qr-type="wifi" data-i18n="static_qr.type.wifi">WiFi</a>\n            <a role="tab" class="tab" data-qr-type="location" data-i18n="static_qr.type.location">导航</a>');

// 3. Add Form
const locationForm = `
          <div id="static-qr-form-location" class="hidden flex flex-col gap-2 mt-2">
            <input id="location-query" type="text" class="input input-bordered input-sm w-full" data-i18n-ph="location.query" placeholder="地点名称/地址">
            <div class="flex gap-2">
              <input id="location-lat" type="number" step="any" class="input input-bordered input-sm w-full" data-i18n-ph="location.lat" placeholder="纬度 (可选)">
              <input id="location-lng" type="number" step="any" class="input input-bordered input-sm w-full" data-i18n-ph="location.lng" placeholder="经度 (可选)">
            </div>
            <div class="text-xs opacity-70 mt-1 px-1">仅填地址将由扫码软件自动定位，填入经纬度定位更精确。</div>
          </div>
`;
html = html.replace('</label>\n          </div>\n\n        </div>', '</label>\n          </div>\n' + locationForm + '\n        </div>');

// 4. Update JS Logic
html = html.replace('function buildWifiData() {', `
    function buildLocationData() {
      const query = document.getElementById('location-query').value.trim();
      const lat = document.getElementById('location-lat').value.trim() || '0';
      const lng = document.getElementById('location-lng').value.trim() || '0';
      if (!query && lat === '0' && lng === '0') return '';
      let geo = 'geo:' + lat + ',' + lng;
      if (query) geo += '?q=' + encodeURIComponent(query);
      return geo;
    }

    function buildWifiData() {`);

html = html.replace("if (currentStaticQrType === 'wifi') return buildWifiData();", "if (currentStaticQrType === 'wifi') return buildWifiData();\n      if (currentStaticQrType === 'location') return buildLocationData();");

html = html.replace("document.getElementById('static-qr-form-wifi').classList.toggle('hidden', currentStaticQrType !== 'wifi');", "document.getElementById('static-qr-form-wifi').classList.toggle('hidden', currentStaticQrType !== 'wifi');\n      document.getElementById('static-qr-form-location').classList.toggle('hidden', currentStaticQrType !== 'location');");

html = html.replace("'wifi-pw', 'wifi-type', 'wifi-hidden'", "'wifi-pw', 'wifi-type', 'wifi-hidden', 'location-query', 'location-lat', 'location-lng'");

const parseLogicAdd = `
      } else if (text.startsWith('geo:')) {
        document.querySelector('#static-qr-tabs .tab[data-qr-type="location"]').click();
        const coordsMatch = text.match(/geo:([-\\d\\.]+),([-\\d\\.]+)/);
        const queryMatch = text.match(/\\?q=([^&]+)/);
        document.getElementById('location-lat').value = (coordsMatch && coordsMatch[1] !== '0') ? coordsMatch[1] : '';
        document.getElementById('location-lng').value = (coordsMatch && coordsMatch[2] !== '0') ? coordsMatch[2] : '';
        document.getElementById('location-query').value = queryMatch ? decodeURIComponent(queryMatch[1]) : '';`;
html = html.replace("} else if (text.startsWith('BEGIN:VCARD')) {", parseLogicAdd + "\n      } else if (text.startsWith('BEGIN:VCARD')) {");

fs.writeFileSync('dist/admin.html', html, 'utf8');
console.log('Patched dist/admin.html with location');
