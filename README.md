# Baseguard - Baseline Webpack Plugin

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)
![Node](https://img.shields.io/badge/node-%3E%3D12.0.0-brightgreen.svg)

Ensures cross-browser compatibility for your web applications by scanning code for web platform features and checking their support using Google Baseline data.

##  Features

-  **Automatic Feature Detection** - Scans JavaScript, CSS, and HTML for web features
-  **Baseline Integration** - Uses Google Baseline API for accurate compatibility data
-  **Build-Time Warnings** - Alerts you during builds about compatibility issues
-  **Visual Reports** - Generates HTML and JSON compatibility reports
-  **Smart Suggestions** - Recommends polyfills and fallbacks for limited features
-  **Performance Optimized** - Caches API results and scans only changed files
-  **Highly Configurable** - Customize behavior via config files or plugin options
-  **Framework Agnostic** - Works with React, Angular, Vue, or vanilla JavaScript

##  Installation

```bash
npm install baseguard --save-dev
```

or

```bash
yarn add baseguard --dev
```

##  Quick Start

### Basic Usage

Add Baseguard to your Webpack configuration:

```javascript
// webpack.config.js
const Baseguard = require('baseguard');

module.exports = {
  // ... other webpack config
  plugins: [
    new Baseguard({
      outputPath: 'dist/compat-report',
      failOnLimited: false
    })
  ]
};
```

### Run Your Build

```bash
npx webpack
```

Baseguard will:
1. Scan your code for web features
2. Check compatibility with Google Baseline
3. Show warnings in the console
4. Generate reports in `dist/compat-report/`

##  Configuration Options

### Plugin Options

```javascript
new Baseguard({
  // Output directory for reports
  outputPath: 'dist/compat-report',
  
  // Fail build if limited features are found
  failOnLimited: false,
  
  // Include newly available features in checks
  includeNewly: true,
  
  // Cache file location
  cacheFile: 'baseline-cache.json',
  
  // Enable result caching
  cacheResults: true,
  
  // Files/patterns to exclude
  excludePatterns: [
    /node_modules/,
    /\.min\./,
    /vendor/
  ],
  
  // Target browsers
  browsers: ['chrome', 'edge', 'firefox', 'safari'],
  
  // Verbose output
  verbose: false
})
```

### Configuration File

Create `baseguard.config.js` in your project root:

```javascript
module.exports = {
  outputPath: 'reports/compatibility',
  failOnLimited: true,
  excludePatterns: [
    /node_modules/,
    /dist/,
    '**/*.test.js'
  ],
  browsers: ['chrome', 'firefox', 'safari']
};
```

##  Understanding Reports

### Console Output

```
Baseguard: Checking compatibility...
⚠️  CSS Subgrid: Limited Availability in 2 file(s)
   Suggestion: Use CSS Grid with nested grids as fallback

✓ Baseguard reports generated:
  JSON: dist/compat-report/compat-report.json
  HTML: dist/compat-report/compat-report.html
```

### HTML Report

Open `compat-report.html` in your browser to see:
- Visual summary of feature availability
- Detailed compatibility table
- Browser support indicators
- Suggestions and documentation links


## 🔗 Links

- [Google Baseline](https://web.dev/baseline/)
- [Can I Use](https://caniuse.com/)
- [MDN Web Docs](https://developer.mozilla.org/)
- [GitHub Repository](https://github.com/postleo/baseguard)

---

Made with ❤️ by the Baseguard team
