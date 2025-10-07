const parser = require('@babel/parser');
const postcss = require('postcss');

class FeatureScanner {
  constructor() {
    this.jsFeatures = new Set();
    this.cssFeatures = new Set();
    this.htmlFeatures = new Set();
  }

  scan(source, fileType) {
    const features = new Set();

    try {
      switch (fileType) {
        case 'javascript':
          this.scanJavaScript(source).forEach(f => features.add(f));
          break;
        case 'css':
          this.scanCSS(source).forEach(f => features.add(f));
          break;
        case 'html':
          this.scanHTML(source).forEach(f => features.add(f));
          break;
      }
    } catch (error) {
      console.warn(`Baseguard: Error scanning ${fileType}:`, error.message);
    }

    return Array.from(features);
  }

  scanJavaScript(code) {
    const features = new Set();

    try {
      const ast = parser.parse(code, {
        sourceType: 'module',
        plugins: ['jsx', 'typescript']
      });

      // API detection patterns
      const apiPatterns = {
        'fetch': /\bfetch\s*\(/,
        'IntersectionObserver': /\bnew\s+IntersectionObserver\b/,
        'ResizeObserver': /\bnew\s+ResizeObserver\b/,
        'MutationObserver': /\bnew\s+MutationObserver\b/,
        'Promise': /\bnew\s+Promise\b/,
        'async/await': /\basync\s+function\b/,
        'ServiceWorker': /navigator\.serviceWorker/,
        'WebSocket': /\bnew\s+WebSocket\b/,
        'localStorage': /\blocalStorage\./,
        'sessionStorage': /\bsessionStorage\./,
        'Geolocation': /navigator\.geolocation/,
        'Notification': /\bnew\s+Notification\b/,
        'Web Workers': /\bnew\s+Worker\b/,
        'IndexedDB': /\bindexedDB\./,
        'Web Audio API': /\bnew\s+AudioContext\b/,
        'WebRTC': /\bRTCPeerConnection\b/,
        'File API': /\bnew\s+FileReader\b/,
        'Clipboard API': /navigator\.clipboard/,
        'Broadcast Channel': /\bnew\s+BroadcastChannel\b/,
        'requestAnimationFrame': /\brequestAnimationFrame\s*\(/,
        'matchMedia': /window\.matchMedia/,
        'CustomElements': /customElements\.define/
      };

      for (const [feature, pattern] of Object.entries(apiPatterns)) {
        if (pattern.test(code)) {
          features.add(feature);
        }
      }

    } catch (error) {
      console.warn('JavaScript parsing error:', error.message);
    }

    return Array.from(features);
  }

  scanCSS(code) {
    const features = new Set();

    try {
      const root = postcss.parse(code);

      root.walkRules(rule => {
        // Check for grid
        if (rule.selector.includes('grid') || /display:\s*grid/.test(rule.toString())) {
          features.add('CSS Grid');
        }

        // Check for flexbox
        if (/display:\s*flex/.test(rule.toString())) {
          features.add('CSS Flexbox');
        }

        // Check for subgrid
        if (/grid-template.*subgrid/.test(rule.toString())) {
          features.add('CSS Subgrid');
        }

        rule.walkDecls(decl => {
          const prop = decl.prop.toLowerCase();
          const value = decl.value.toLowerCase();

          // CSS Feature patterns
          const featureMap = {
            'clip-path': 'CSS clip-path',
            'mask': 'CSS Masking',
            'filter': 'CSS Filters',
            'backdrop-filter': 'CSS backdrop-filter',
            'mix-blend-mode': 'CSS Blend Modes',
            'object-fit': 'CSS object-fit',
            'scroll-snap': 'CSS Scroll Snap',
            'position: sticky': 'CSS position: sticky',
            'aspect-ratio': 'CSS aspect-ratio',
            'gap': 'CSS gap',
            'place-items': 'CSS place-items',
            'contain': 'CSS Containment',
            '@supports': 'CSS @supports',
            '@container': 'CSS Container Queries'
          };

          // Check properties
          for (const [pattern, feature] of Object.entries(featureMap)) {
            if (prop.includes(pattern) || value.includes(pattern)) {
              features.add(feature);
            }
          }

          // Custom properties
          if (prop.startsWith('--')) {
            features.add('CSS Custom Properties');
          }

          // CSS Variables in values
          if (value.includes('var(')) {
            features.add('CSS Custom Properties');
          }

          // Modern color functions
          if (value.includes('lab(') || value.includes('lch(')) {
            features.add('CSS Color Level 4');
          }
        });
      });

      // Check for @media features
      if (code.includes('@media')) {
        if (code.includes('prefers-color-scheme')) {
          features.add('prefers-color-scheme');
        }
        if (code.includes('prefers-reduced-motion')) {
          features.add('prefers-reduced-motion');
        }
      }

    } catch (error) {
      console.warn('CSS parsing error:', error.message);
    }

    return Array.from(features);
  }

  scanHTML(code) {
    const features = new Set();

    // HTML5 Elements
    const html5Elements = {
      '<video': 'HTML5 Video',
      '<audio': 'HTML5 Audio',
      '<canvas': 'HTML5 Canvas',
      '<svg': 'SVG',
      '<picture': 'Picture Element',
      '<source': 'Picture/Video Source',
      '<template': 'HTML Template',
      '<slot': 'HTML Slots',
      '<dialog': 'HTML Dialog',
      '<details': 'HTML Details/Summary',
      'loading="lazy"': 'Native Lazy Loading',
      'decoding="async"': 'Image Decode API'
    };

    for (const [pattern, feature] of Object.entries(html5Elements)) {
      if (code.includes(pattern)) {
        features.add(feature);
      }
    }

    // Form features
    if (code.includes('type="date"')) features.add('HTML5 Date Input');
    if (code.includes('type="color"')) features.add('HTML5 Color Input');
    if (code.includes('type="range"')) features.add('HTML5 Range Input');
    if (code.includes('required')) features.add('HTML5 Form Validation');
    if (code.includes('pattern=')) features.add('HTML5 Pattern Validation');

    return Array.from(features);
  }
}

module.exports = FeatureScanner;