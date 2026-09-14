const fs = require('fs');
const path = require('path');

const indexFile = path.join(__dirname, 'index.html');
const content = fs.readFileSync(indexFile, 'utf8');
const lines = content.split('\n');

const cssStart = lines.findIndex(l => l.includes('/* ============ MANAGE CUSTOMER SPECIFIC STYLES ============ */'));
const cssEnd = lines.findIndex(l => l.includes('/* ================= PROFESSIONAL REPORT STYLES ================= */'));
const cssLines = lines.slice(cssStart, cssEnd);

const htmlStart = lines.findIndex(l => l.includes('<!-- Manage Customer View -->')) + 1;
const htmlEnd = htmlStart + 414; // Let's just find the closing tag of manageCustomerContent dynamically

let htmlEndDynamic = -1;
for (let i = htmlStart; i < lines.length; i++) {
    if (lines[i].includes('<!-- About Us View -->')) {
        htmlEndDynamic = i - 1;
        break;
    }
}
const htmlLines = lines.slice(htmlStart + 1, htmlEndDynamic); // +1 to skip <div id="manageCustomerContent"...>

const jsInnerTabsStart = lines.findIndex(l => l.includes('// Manage Customer Inner Tabs Logic'));
let jsInnerTabsEnd = jsInnerTabsStart;
for (let i = jsInnerTabsStart; i < lines.length; i++) {
    if (lines[i].includes('// User dropdown toggle')) {
        jsInnerTabsEnd = i;
        break;
    }
}
const jsLines1 = lines.slice(jsInnerTabsStart, jsInnerTabsEnd);

const jsFuncsStart = lines.findIndex(l => l.includes('// Toggle Date of Birth input based on Birthdate Type'));
let jsFuncsEnd = jsFuncsStart;
for (let i = jsFuncsStart; i < lines.length; i++) {
    if (lines[i].includes('function closePaymentReportSide()')) {
        jsFuncsEnd = i;
        break;
    }
}
const jsLines2 = lines.slice(jsFuncsStart, jsFuncsEnd);

const manageCustomerHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Manage Customer</title>
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
${htmlLines.join('\n')}

  <script>
${jsLines1.join('\n')}
${jsLines2.join('\n')}
  </script>
</body>
</html>`;

fs.writeFileSync(path.join(__dirname, 'managecustomer.html'), manageCustomerHtml);

// Modify index.html to use iframe and remove the extracted CSS and JS?
// For safety, let's just replace the HTML part with the iframe.
// The CSS and JS can remain in index.html to avoid breaking anything else that might rely on them.

const newHtmlPart = `      <div id="manageCustomerContent" style="display: none; height: 100%; width: 100%;">
        <iframe src="managecustomer.html" style="width: 100%; height: 100%; border: none;"></iframe>
      </div>`;

// Replace from <!-- Manage Customer View --> to <!-- About Us View -->
const newLines = [
    ...lines.slice(0, htmlStart - 1),
    '      <!-- Manage Customer View -->',
    newHtmlPart,
    '',
    ...lines.slice(htmlEndDynamic)
];

fs.writeFileSync(indexFile, newLines.join('\n'));

console.log("Extraction complete!");
