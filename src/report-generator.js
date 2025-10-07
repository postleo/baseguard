const fs = require('fs-extra');
const path = require('path');

class ReportGenerator {
  constructor(outputPath) {
    this.outputPath = outputPath;
  }

  async generateHTML(reportData) {
    const template = this.getHTMLTemplate();
    
    const featuresHTML = reportData.features
      .sort((a, b) => {
        const order = { limited: 0, newly: 1, widely: 2, unknown: 3 };
        return order[a.availability] - order[b.availability];
      })
      .map(feature => this.generateFeatureRow(feature))
      .join('');

    const html = template
      .replace('{{generatedAt}}', new Date(reportData.generatedAt).toLocaleString())
      .replace('{{totalFeatures}}', reportData.summary.total)
      .replace('{{widelyCount}}', reportData.summary.widely)
      .replace('{{newlyCount}}', reportData.summary.newly)
      .replace('{{limitedCount}}', reportData.summary.limited)
      .replace('{{unknownCount}}', reportData.summary.unknown)
      .replace('{{featuresTable}}', featuresHTML);

    return html;
  }

  generateFeatureRow(feature) {
    const statusClass = this.getStatusClass(feature.availability);
    const statusText = this.getStatusText(feature.availability);
    const filesText = feature.files.slice(0, 3).join(', ') + 
                     (feature.files.length > 3 ? ` (+${feature.files.length - 3} more)` : '');

    return `
      <tr class="${statusClass}">
        <td><strong>${this.escapeHtml(feature.name)}</strong></td>
        <td><span class="badge badge-${statusClass}">${statusText}</span></td>
        <td class="browser-support">${this.generateBrowserIcons(feature.browsers)}</td>
        <td class="file-list">${this.escapeHtml(filesText)}</td>
        <td class="suggestion">
          ${feature.suggestion ? this.escapeHtml(feature.suggestion) : '-'}
          ${feature.link ? `<br><a href="${feature.link}" target="_blank">Learn more →</a>` : ''}
        </td>
      </tr>
    `;
  }

  generateBrowserIcons(browsers) {
    if (!browsers || Object.keys(browsers).length === 0) {
      return '-';
    }

    const icons = {
      chrome: '🟢',
      edge: '🔵',
      firefox: '🟠',
      safari: '⚪'
    };

    return Object.entries(browsers)
      .map(([browser, support]) => {
        const icon = icons[browser] || '⚫';
        const status = support.supported ? '✓' : '✗';
        return `<span title="${browser}: ${support.version || 'Unknown'}">${icon}${status}</span>`;
      })
      .join(' ');
  }

  getStatusClass(availability) {
    const classMap = {
      widely: 'success',
      newly: 'info',
      limited: 'warning',
      unknown: 'secondary'
    };
    return classMap[availability] || 'secondary';
  }

  getStatusText(availability) {
    const textMap = {
      widely: 'Widely Available',
      newly: 'Newly Available',
      limited: 'Limited Availability',
      unknown: 'Unknown'
    };
    return textMap[availability] || 'Unknown';
  }

  escapeHtml(text) {
    const map = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, m => map[m]);
  }

  getHTMLTemplate() {
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Baseguard Compatibility Report</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            background: #f5f7fa;
            color: #333;
            line-height: 1.6;
        }

        .container {
            max-width: 1400px;
            margin: 0 auto;
            padding: 20px;
        }

        .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 40px;
            border-radius: 12px;
            margin-bottom: 30px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.1);
        }

        .header h1 {
            font-size: 2.5em;
            margin-bottom: 10px;
        }

        .header p {
            opacity: 0.9;
            font-size: 1.1em;
        }

        .summary {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 20px;
            margin-bottom: 30px;
        }

        .summary-card {
            background: white;
            padding: 25px;
            border-radius: 8px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
            border-left: 4px solid;
        }

        .summary-card.widely { border-left-color: #10b981; }
        .summary-card.newly { border-left-color: #3b82f6; }
        .summary-card.limited { border-left-color: #f59e0b; }
        .summary-card.unknown { border-left-color: #6b7280; }

        .summary-card h3 {
            font-size: 2.5em;
            margin-bottom: 5px;
        }

        .summary-card p {
            color: #6b7280;
            font-size: 0.95em;
        }

        .content {
            background: white;
            border-radius: 12px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
            overflow: hidden;
        }

        .section {
            padding: 30px;
        }

        .section h2 {
            margin-bottom: 20px;
            color: #1f2937;
        }

        table {
            width: 100%;
            border-collapse: collapse;
        }

        th {
            background: #f9fafb;
            padding: 15px;
            text-align: left;
            font-weight: 600;
            color: #374151;
            border-bottom: 2px solid #e5e7eb;
        }

        td {
            padding: 15px;
            border-bottom: 1px solid #e5e7eb;
        }

        tr:hover {
            background: #f9fafb;
        }

        .badge {
            display: inline-block;
            padding: 4px 12px;
            border-radius: 20px;
            font-size: 0.85em;
            font-weight: 600;
        }

        .badge-success {
            background: #d1fae5;
            color: #065f46;
        }

        .badge-info {
            background: #dbeafe;
            color: #1e40af;
        }

        .badge-warning {
            background: #fef3c7;
            color: #92400e;
        }

        .badge-secondary {
            background: #e5e7eb;
            color: #374151;
        }

        .browser-support {
            font-family: monospace;
            font-size: 1.2em;
        }

        .file-list {
            font-size: 0.9em;
            color: #6b7280;
        }

        .suggestion {
            font-size: 0.9em;
            color: #4b5563;
        }

        .suggestion a {
            color: #3b82f6;
            text-decoration: none;
        }

        .suggestion a:hover {
            text-decoration: underline;
        }

        .footer {
            text-align: center;
            margin-top: 30px;
            padding: 20px;
            color: #6b7280;
            font-size: 0.9em;
        }

        @media (max-width: 768px) {
            .header h1 { font-size: 1.8em; }
            .summary { grid-template-columns: 1fr 1fr; }
            th, td { padding: 10px; font-size: 0.9em; }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🛡️ Baseguard Compatibility Report</h1>
            <p>Generated on {{generatedAt}} • {{totalFeatures}} features analyzed</p>
        </div>

        <div class="summary">
            <div class="summary-card widely">
                <h3>{{widelyCount}}</h3>
                <p>Widely Available</p>
            </div>
            <div class="summary-card newly">
                <h3>{{newlyCount}}</h3>
                <p>Newly Available</p>
            </div>
            <div class="summary-card limited">
                <h3>{{limitedCount}}</h3>
                <p>Limited Availability</p>
            </div>
            <div class="summary-card unknown">
                <h3>{{unknownCount}}</h3>
                <p>Unknown Status</p>
            </div>
        </div>

        <div class="content">
            <div class="section">
                <h2>Feature Details</h2>
                <table>
                    <thead>
                        <tr>
                            <th>Feature</th>
                            <th>Status</th>
                            <th>Browser Support</th>
                            <th>Files</th>
                            <th>Suggestion</th>
                        </tr>
                    </thead>
                    <tbody>
                        {{featuresTable}}
                    </tbody>
                </table>
            </div>
        </div>

        <div class="footer">
            <p>Generated by <strong>Baseguard</strong> - Baseline Webpack Plugin</p>
            <p>Ensuring cross-browser compatibility for modern web applications</p>
        </div>
    </div>
</body>
</html>`;
  }
}

module.exports = ReportGenerator;