const fs = require('fs');
let html = fs.readFileSync('dist/admin.html', 'utf8');

// Remove all occurrences of the bad translations
html = html.replace(/\\s*'static_qr\\.type\\.location': 'Location',\\s*'location\\.lat': 'Latitude \\(Optional\\)',\\s*'location\\.lng': 'Longitude \\(Optional\\)',\\s*'location\\.query': 'Place Name \\/ Address',\\s*/g, '');
html = html.replace(/\\s*'static_qr\\.type\\.location': '导航',\\s*'location\\.lat': '纬度 \\(可选\\)',\\s*'location\\.lng': '经度 \\(可选\\)',\\s*'location\\.query': '地点名称\\/地址',\\s*/g, '');

// Now insert them correctly
// For ZH, find 'static_qr.type.wifi': 'WiFi', inside TRANSLATIONS.zh
html = html.replace(/'static_qr\.type\.wifi': 'WiFi',/g, (match, offset, str) => {
  // We can just replace both, but we need to know if it's zh or en
  const before = str.slice(Math.max(0, offset - 500), offset);
  if (before.includes("'static_qr.generate': '生成二维码',") || before.includes("'vcard.ln': '姓氏',") || before.includes("zh:")) {
    return "'static_qr.type.wifi': 'WiFi',\n        'static_qr.type.location': '导航',\n        'location.lat': '纬度 (可选)',\n        'location.lng': '经度 (可选)',\n        'location.query': '地点名称/地址',";
  }
  if (before.includes("'static_qr.generate': 'Generate QR Code',") || before.includes("'vcard.ln': 'Last Name',") || before.includes("en:")) {
    return "'static_qr.type.wifi': 'WiFi',\n        'static_qr.type.location': 'Location',\n        'location.lat': 'Latitude (Optional)',\n        'location.lng': 'Longitude (Optional)',\n        'location.query': 'Place Name / Address',";
  }
  return match;
});

fs.writeFileSync('dist/admin.html', html, 'utf8');
console.log('Fixed translations');
