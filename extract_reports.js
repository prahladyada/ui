const fs = require('fs');
const path = require('path');

const indexFile = path.join(__dirname, 'index.html');
const content = fs.readFileSync(indexFile, 'utf8');
const lines = content.split('\n');

const cssStart = lines.findIndex(l => l.includes('/* ================= PROFESSIONAL REPORT STYLES ================= */'));
const cssEnd = lines.findIndex(l => l.includes('/* ================= DIRECT BILLING STYLES ================= */'));
const cssLines = lines.slice(cssStart, cssEnd);

const paymentStart = lines.findIndex(l => l.includes('<!-- Payment Report View -->')) + 1; // +1 to start at <div id="paymentReportContent"...>
const gameStart = lines.findIndex(l => l.includes('<!-- Game Report View -->')) + 1;
const directSaleStart = lines.findIndex(l => l.includes('<!-- Direct Billing View -->')) + 1;

// The inner contents
const paymentHtmlLines = lines.slice(paymentStart + 1, gameStart - 2); // slice inside the div
const gameHtmlLines = lines.slice(gameStart + 1, directSaleStart - 2); 

const createHtml = (title, innerHtml) => `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${title}</title>
  <style>
    * { box-sizing: border-box; }
    html, body {
      margin: 0;
      padding: 0;
      height: 100%;
      overflow: hidden;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
      background: #f8fafc;
      color: #334155;
    }
    
    /* ===== Custom Scrollbars ===== */
    ::-webkit-scrollbar {
      width: 6px;
      height: 6px;
    }

    ::-webkit-scrollbar-track {
      background: #f1f5f9;
      border-radius: 4px;
    }

    ::-webkit-scrollbar-thumb {
      background: #cbd5e1;
      border-radius: 4px;
    }

    ::-webkit-scrollbar-thumb:hover {
      background: #94a3b8;
    }
    
${cssLines.join('\n')}
  </style>
</head>
<body>
${innerHtml.join('\n')}
</body>
</html>`;

fs.writeFileSync(path.join(__dirname, 'paymentreport.html'), createHtml('Payment Report', paymentHtmlLines));
fs.writeFileSync(path.join(__dirname, 'gamereport.html'), createHtml('Game Report', gameHtmlLines));

// Now replace them in index.html
const newLines = [
    ...lines.slice(0, paymentStart - 1),
    '      <!-- Payment Report View -->',
    '      <div id="paymentReportContent" style="display: none; height: 100%; width: 100%;">',
    '        <iframe src="paymentreport.html" style="width: 100%; height: 100%; border: none;"></iframe>',
    '      </div>',
    '',
    '      <!-- Game Report View -->',
    '      <div id="gameReportContent" style="display: none; height: 100%; width: 100%;">',
    '        <iframe src="gamereport.html" style="width: 100%; height: 100%; border: none;"></iframe>',
    '      </div>',
    '',
    ...lines.slice(directSaleStart - 1)
];

fs.writeFileSync(indexFile, newLines.join('\n'));

console.log("Extraction complete!");
