const fs = require('fs');
const lines = fs.readFileSync('src/pages/ProjectDetailPage.jsx', 'utf8').split('\n');
lines.splice(2516, 309, '  const renderRaiseInvoice = () => {', '    const invoiceColumns = [', '      { key: "invoiceNo", title: "Invoice No" },', '      { key: "invoiceType", title: "Type" },');
fs.writeFileSync('src/pages/ProjectDetailPage.jsx', lines.join('\n'));
