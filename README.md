# Baseguard - Baseline Webpack Plugin

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)
![Node](https://img.shields.io/badge/node-%3E%3D12.0.0-brightgreen.svg)

Ensure cross-browser compatibility for your web applications by scanning code for web platform features and checking their support using Google Baseline data.

## 🚀 Features

- ✅ **Automatic Feature Detection** - Scans JavaScript, CSS, and HTML for web features
- 🌐 **Baseline Integration** - Uses Google Baseline API for accurate compatibility data
- ⚠️ **Build-Time Warnings** - Alerts you during builds about compatibility issues
- 📊 **Visual Reports** - Generates HTML and JSON compatibility reports
- 🎯 **Smart Suggestions** - Recommends polyfills and fallbacks for limited features
- ⚡ **Performance Optimized** - Caches API results and scans only changed files
- 🔧 **Highly Configurable** - Customize behavior via config files or plugin options
- 🔌 **Framework Agnostic** - Works with React, Angular, Vue, or vanilla JavaScript

## 📦 Installation

```bash
npm install baseguard --save-dev
```

or

```bash
yarn add baseguard --dev
```

## 🎯 Quick Start

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

## ⚙️ Configuration Options

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

## 📊 Understanding Reports

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

### JSON Report

```json
{
  "features": [
    {
      "name": "fetch",
      "availability": "widely",
      "files": ["src/api.js"],
      "browsers": {
        "chrome": { "supported": true, "version": "Supported for 30+ months" },
        "firefox": { "supported": true, "version": "Supported for 30+ months" }
      }
    }
  ],
  "summary": {
    "total": 15,
    "widely": 12,
    "newly": 2,
    "limited": 1,
    "unknown": 0
  }
}
```

## 🔍 Detected Features

### JavaScript
- APIs: `fetch`, `IntersectionObserver`, `ResizeObserver`, `Promise`, `async/await`
- Storage: `localStorage`, `sessionStorage`, `IndexedDB`
- Media: `Web Audio API`, `WebRTC`, `MediaRecorder`
- Workers: `Service Workers`, `Web Workers`
- And more...

### CSS
- Layout: `Grid`, `Flexbox`, `Subgrid`, `Container Queries`
- Visual: `clip-path`, `backdrop-filter`, `mask`, `filters`
- Properties: `aspect-ratio`, `gap`, `object-fit`
- Custom Properties & Variables
- And more...

### HTML
- Elements: `<video>`, `<audio>`, `<canvas>`, `<dialog>`
- Attributes: `loading="lazy"`, `decoding="async"`
- Form inputs: `type="date"`, `type="color"`
- And more...

## 🎨 Availability Statuses

- **Widely Available** (🟢): Supported in all major browsers for 30+ months
- **Newly Available** (🔵): Recently supported across all major browsers
- **Limited Availability** (🟡): Not supported in all browsers
- **Unknown** (⚫): Unable to determine compatibility

## 🔧 Advanced Usage

### CI/CD Integration

GitHub Actions example:

```yaml
name: Compatibility Check

on: [push, pull_request]

jobs:
  check:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
      - run: npm install
      - run: npm run build
      - uses: actions/upload-artifact@v2
        with:
          name: compatibility-report
          path: dist/compat-report/
```

### Fail Build on Issues

```javascript
new Baseguard({
  failOnLimited: true,  // Build fails if limited features found
  excludePatterns: [/vendor/]  // Exclude third-party code
})
```

### Custom Baseline API

```javascript
new Baseguard({
  customBaselineUrl: 'https://your-baseline-api.com/v1/features'
})
```

## 📁 Project Structure

```
your-project/
├── webpack.config.js       # Webpack config with Baseguard
├── baseguard.config.js     # Optional: Baseguard configuration
├── src/                    # Your source code
│   ├── index.js
│   └── styles.css
├── dist/                   # Build output
│   └── compat-report/      # Generated reports
│       ├── compat-report.json
│       └── compat-report.html
└── baseline-cache.json     # API result cache
```

## 🤝 Framework Examples

### React (Create React App)

```bash
npm install baseguard --save-dev
npm run eject  # Expose webpack config
```

Edit `config/webpack.config.js`:

```javascript
const Baseguard = require('baseguard');

// In plugins array:
plugins: [
  new Baseguard({
    outputPath: 'build/compat-report'
  })
]
```

### Next.js

```javascript
// next.config.js
const Baseguard = require('baseguard');

module.exports = {
  webpack: (config) => {
    config.plugins.push(
      new Baseguard({
        outputPath: '.next/compat-report'
      })
    );
    return config;
  }
};
```

### Angular

```javascript
// Add to angular.json custom webpack config
// Or use @angular-builders/custom-webpack
const Baseguard = require('baseguard');

module.exports = {
  plugins: [
    new Baseguard({
      outputPath: 'dist/compat-report'
    })
  ]
};
```

## 🐛 Troubleshooting

### Reports Not Generated

- Ensure `outputPath` directory is writable
- Check Webpack build completes successfully
- Look for errors in console output

### API Timeout Errors

- Check internet connection
- Verify Baseline API is accessible
- Use cached results: `cacheResults: true`

### False Positives

- Add files to `excludePatterns`
- Check if features are in third-party libraries
- Report issues on GitHub

## 📖 API Reference

### Constructor Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `outputPath` | String | `'dist/compat-report'` | Report output directory |
| `failOnLimited` | Boolean | `false` | Fail build on limited features |
| `includeNewly` | Boolean | `true` | Include newly available features |
| `cacheFile` | String | `'baseline-cache.json'` | Cache file location |
| `cacheResults` | Boolean | `true` | Enable API result caching |
| `excludePatterns` | Array | `[/node_modules/]` | Files to exclude |
| `browsers` | Array | `['chrome', 'edge', 'firefox', 'safari']` | Target browsers |
| `verbose` | Boolean | `false` | Detailed console output |

## 🌟 Contributing

Contributions are welcome! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

## 📝 License

MIT © [Your Name]

## 🔗 Links

- [Google Baseline](https://web.dev/baseline/)
- [Can I Use](https://caniuse.com/)
- [MDN Web Docs](https://developer.mozilla.org/)
- [GitHub Repository](https://github.com/yourusername/baseguard)

## 💬 Support

- 📧 Email: support@baseguard.dev
- 💬 Discord: [Join our community](https://discord.gg/baseguard)
- 🐛 Issues: [GitHub Issues](https://github.com/yourusername/baseguard/issues)

---

Made with ❤️ by the Baseguard team