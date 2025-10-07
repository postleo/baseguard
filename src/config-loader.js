const fs = require('fs');
const path = require('path');

class ConfigLoader {
  static load(userOptions = {}) {
    const defaults = {
      // Output settings
      outputPath: 'dist/compat-report',
      
      // Behavior settings
      failOnLimited: false,
      includeNewly: true,
      verbose: false,
      
      // Caching
      cacheFile: 'baseline-cache.json',
      cacheResults: true,
      
      // Exclusions
      excludePatterns: [
        /node_modules/,
        /\.min\./,
        /vendor/
      ],
      
      // Browser targets (optional, can be used with browserslist)
      browsers: ['chrome', 'edge', 'firefox', 'safari'],
      
      // Custom Baseline API URL (for testing or enterprise deployments)
      customBaselineUrl: null
    };

    // Try to load config from file
    const configFile = this.findConfigFile();
    const fileConfig = configFile ? this.loadConfigFile(configFile) : {};

    // Merge configs: defaults < file config < user options
    const config = {
      ...defaults,
      ...fileConfig,
      ...userOptions
    };

    // Validate configuration
    this.validate(config);

    return config;
  }

  static findConfigFile() {
    const possibleFiles = [
      'baseguard.config.js',
      'baseline.config.js',
      '.baseguardrc.js',
      '.baseguardrc.json'
    ];

    for (const file of possibleFiles) {
      const filePath = path.resolve(process.cwd(), file);
      if (fs.existsSync(filePath)) {
        return filePath;
      }
    }

    return null;
  }

  static loadConfigFile(configPath) {
    try {
      const ext = path.extname(configPath);
      
      if (ext === '.json') {
        const content = fs.readFileSync(configPath, 'utf8');
        return JSON.parse(content);
      } else if (ext === '.js') {
        // Clear require cache to allow config reloading
        delete require.cache[require.resolve(configPath)];
        return require(configPath);
      }
    } catch (error) {
      console.warn(`Baseguard: Error loading config from ${configPath}:`, error.message);
      return {};
    }
  }

  static validate(config) {
    // Validate outputPath
    if (typeof config.outputPath !== 'string') {
      throw new Error('Baseguard: outputPath must be a string');
    }

    // Validate failOnLimited
    if (typeof config.failOnLimited !== 'boolean') {
      throw new Error('Baseguard: failOnLimited must be a boolean');
    }

    // Validate excludePatterns
    if (!Array.isArray(config.excludePatterns)) {
      throw new Error('Baseguard: excludePatterns must be an array');
    }

    // Validate browsers
    if (!Array.isArray(config.browsers)) {
      throw new Error('Baseguard: browsers must be an array');
    }

    const validBrowsers = ['chrome', 'edge', 'firefox', 'safari'];
    config.browsers.forEach(browser => {
      if (!validBrowsers.includes(browser.toLowerCase())) {
        console.warn(`Baseguard: Unknown browser "${browser}". Valid options: ${validBrowsers.join(', ')}`);
      }
    });

    // Validate customBaselineUrl if provided
    if (config.customBaselineUrl !== null && typeof config.customBaselineUrl !== 'string') {
      throw new Error('Baseguard: customBaselineUrl must be a string or null');
    }

    return true;
  }

  static getExample() {
    return `// baseguard.config.js
module.exports = {
  // Where to save reports
  outputPath: 'dist/compat-report',
  
  // Fail build if limited features found
  failOnLimited: false,
  
  // Include newly available features in checks
  includeNewly: true,
  
  // Show detailed output
  verbose: false,
  
  // Cache file location
  cacheFile: 'baseline-cache.json',
  
  // Enable caching of API results
  cacheResults: true,
  
  // Patterns to exclude from scanning
  excludePatterns: [
    /node_modules/,
    /\\.min\\./,
    /vendor/,
    'dist/**'
  ],
  
  // Target browsers
  browsers: ['chrome', 'edge', 'firefox', 'safari'],
  
  // Custom Baseline API endpoint (optional)
  customBaselineUrl: null
};
`;
  }
}

module.exports = ConfigLoader;