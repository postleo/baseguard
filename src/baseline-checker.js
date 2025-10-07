const axios = require('axios');
const fs = require('fs-extra');
const path = require('path');

class BaselineChecker {
  constructor(cacheFile = 'cache.json') {
    this.cacheFile = cacheFile;
    this.cache = this.loadCache();
    this.baselineApiUrl = 'https://api.baseline.web.dev/v1/features';
  }

  loadCache() {
    try {
      if (fs.existsSync(this.cacheFile)) {
        return JSON.parse(fs.readFileSync(this.cacheFile, 'utf8'));
      }
    } catch (error) {
      console.warn('Baseguard: Could not load cache:', error.message);
    }
    return {};
  }

  saveCache() {
    try {
      fs.writeFileSync(this.cacheFile, JSON.stringify(this.cache, null, 2));
    } catch (error) {
      console.warn('Baseguard: Could not save cache:', error.message);
    }
  }

  async check(feature) {
    // Check cache first
    if (this.cache[feature]) {
      const cached = this.cache[feature];
      // Cache expires after 7 days
      if (Date.now() - cached.timestamp < 7 * 24 * 60 * 60 * 1000) {
        return cached.data;
      }
    }

    // Query Baseline API
    try {
      const result = await this.queryBaseline(feature);
      
      // Cache the result
      this.cache[feature] = {
        data: result,
        timestamp: Date.now()
      };
      this.saveCache();

      return result;
    } catch (error) {
      console.warn(`Baseguard: API error for ${feature}:`, error.message);
      
      // Return unknown status if API fails
      return {
        availability: 'unknown',
        browsers: {},
        suggestion: 'Check caniuse.com for compatibility details',
        link: `https://caniuse.com/?search=${encodeURIComponent(feature)}`
      };
    }
  }

  async queryBaseline(feature) {
    try {
      // Note: This is a mock implementation since actual Baseline API structure may vary
      // Replace with real API endpoint when available
      const response = await axios.get(`${this.baselineApiUrl}/${encodeURIComponent(feature)}`, {
        timeout: 5000
      });

      return this.parseBaselineResponse(response.data, feature);
    } catch (error) {
      // Fallback to heuristic-based detection if API is unavailable
      return this.getFallbackStatus(feature);
    }
  }

  parseBaselineResponse(data, feature) {
    // Parse Baseline API response
    // This structure depends on the actual Baseline API format
    
    const availability = data.status || 'unknown';
    const browsers = data.browser_support || {};
    
    let suggestion = '';
    let link = `https://web.dev/baseline/${encodeURIComponent(feature)}`;

    if (availability === 'limited') {
      suggestion = this.getSuggestion(feature);
    }

    return {
      availability,
      browsers,
      suggestion,
      link
    };
  }

  getFallbackStatus(feature) {
    // Heuristic-based fallback when API is unavailable
    const widelySupported = [
      'fetch', 'Promise', 'CSS Flexbox', 'CSS Grid', 
      'localStorage', 'sessionStorage', 'HTML5 Video', 
      'HTML5 Audio', 'SVG', 'Canvas'
    ];

    const newlySupported = [
      'CSS Container Queries', 'CSS Subgrid', 'Dialog Element',
      'Lazy Loading', 'ResizeObserver', 'IntersectionObserver'
    ];

    const limited = [
      'CSS backdrop-filter', 'WebRTC', 'Web Audio API',
      'Service Worker', 'Web Workers', 'IndexedDB'
    ];

    let availability = 'unknown';
    
    if (widelySupported.some(f => feature.toLowerCase().includes(f.toLowerCase()))) {
      availability = 'widely';
    } else if (newlySupported.some(f => feature.toLowerCase().includes(f.toLowerCase()))) {
      availability = 'newly';
    } else if (limited.some(f => feature.toLowerCase().includes(f.toLowerCase()))) {
      availability = 'limited';
    }

    return {
      availability,
      browsers: this.getDefaultBrowserSupport(availability),
      suggestion: availability === 'limited' ? this.getSuggestion(feature) : '',
      link: `https://caniuse.com/?search=${encodeURIComponent(feature)}`
    };
  }

  getDefaultBrowserSupport(availability) {
    const browsers = {
      chrome: { supported: false, version: '' },
      edge: { supported: false, version: '' },
      firefox: { supported: false, version: '' },
      safari: { supported: false, version: '' }
    };

    if (availability === 'widely') {
      Object.keys(browsers).forEach(browser => {
        browsers[browser].supported = true;
        browsers[browser].version = 'Supported for 30+ months';
      });
    } else if (availability === 'newly') {
      Object.keys(browsers).forEach(browser => {
        browsers[browser].supported = true;
        browsers[browser].version = 'Recently supported';
      });
    }

    return browsers;
  }

  getSuggestion(feature) {
    const suggestions = {
      'CSS Subgrid': 'Use CSS Grid with nested grids as fallback',
      'CSS Container Queries': 'Use media queries or JavaScript-based solutions',
      'CSS backdrop-filter': 'Use semi-transparent backgrounds as fallback',
      'Dialog Element': 'Use modal libraries or custom implementations',
      'WebRTC': 'Check for browser support and provide alternative communication methods',
      'Service Worker': 'Check for support before registration, app works without offline features',
      'Web Workers': 'Provide fallback for heavy computations in main thread with throttling',
      'IndexedDB': 'Use localStorage as fallback for smaller data storage',
      'Web Audio API': 'Provide basic audio playback using HTML5 audio element',
      'IntersectionObserver': 'Use polyfill from https://polyfill.io',
      'ResizeObserver': 'Use polyfill or fallback to window resize events'
    };

    for (const [key, suggestion] of Object.entries(suggestions)) {
      if (feature.includes(key)) {
        return suggestion;
      }
    }

    return 'Check browser compatibility and provide appropriate fallbacks';
  }
}

module.exports = BaselineChecker;