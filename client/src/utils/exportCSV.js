/**
 * Helper to download array data as CSV file in the browser
 */
export const downloadCSV = (filename, data, headers) => {
  if (!data || !data.length) return;

  const headerRow = headers.map((h) => `"${h.label}"`).join(',');
  const rows = data.map((item) => {
    return headers
      .map((h) => {
        let val = typeof h.key === 'function' ? h.key(item) : item[h.key];
        if (val === undefined || val === null) val = '';
        if (typeof val === 'string') {
          return `"${val.replace(/"/g, '""')}"`;
        }
        return `"${val}"`;
      })
      .join(',');
  });

  const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headerRow, ...rows].join('\r\n');
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  link.setAttribute('download', `${filename}_${new Date().toISOString().split('T')[0]}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
