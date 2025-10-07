const fs = require('fs-extra');
const path = require('path');
const chalk = require('chalk');
const FeatureScanner = require('./scanner');
const BaselineChecker = require('./baseline-checker');
const ReportGenerator = require('./report-generator');
const ConfigLoader = require('./config-loader');

class BaseguardPlugin {
  constructor(options = {}) {
    this.options = ConfigLoader.load(options);
    this.scanner = new FeatureScanner();
    this.checker = new BaselineChecker(this.options.cacheFile);
    this.reporter = new ReportGenerator(this.options.outputPath);
    this.features = new Map();
  }

  apply(compiler) {
    const pluginName = 'BaseguardPlugin';

    // Hook into compilation to scan files
    compiler.hooks.compilation.tap(pluginName, (compilation) => {
      compilation.hooks.processAssets.tapAsync(
        {
          name: pluginName,
          stage: compiler.webpack.Compilation.PROCESS_ASSETS_STAGE_ANALYSE,
        },
        async (assets, callback) => {
          try {
            await this.processAssets(assets, compilation);
            callback();
          } catch (error) {
            console.error(chalk.red('Baseguard Error:'), error.message);
            callback(error);
          }
        }
      );
    });

    // Hook into emit to generate reports
    compiler.hooks.emit.tapAsync(pluginName, async (compilation, callback) => {
      try {
        await this.generateReports(compilation);
        callback();
      } catch (error) {
        console.error(chalk.red('Baseguard Report Error:'), error.message);
        callback(error);
      }
    });

    // Hook into done to show summary
    compiler.hooks.done.tap(pluginName, (stats) => {
      this.showSummary(stats);
    });
  }

  async processAssets(assets, compilation) {
    const assetNames = Object.keys(assets);
    
    for (const assetName of assetNames) {
      // Skip excluded patterns
      if (this.shouldSkipFile(assetName)) {
        continue;
      }

      const source = assets[assetName].source();
      const fileType = this.getFileType(assetName);

      if (!fileType) continue;

      // Scan for features
      const features = this.scanner.scan(source, fileType);
      
      // Store features with file reference
      features.forEach(feature => {
        if (!this.features.has(feature)) {
          this.features.set(feature, []);
        }
        this.features.get(feature).push(assetName);
      });
    }

    // Check compatibility for all found features
    if (this.features.size > 0) {
      await this.checkCompatibility();
    }
  }

  shouldSkipFile(filename) {
    const excludePatterns = this.options.excludePatterns || [];
    return excludePatterns.some(pattern => {
      if (typeof pattern === 'string') {
        return filename.includes(pattern);
      }
      if (pattern instanceof RegExp) {
        return pattern.test(filename);
      }
      return false;
    });
  }

  getFileType(filename) {
    const ext = path.extname(filename).toLowerCase();
    const typeMap = {
      '.js': 'javascript',
      '.jsx': 'javascript',
      '.ts': 'javascript',
      '.tsx': 'javascript',
      '.css': 'css',
      '.scss': 'css',
      '.sass': 'css',
      '.html': 'html',
      '.htm': 'html'
    };
    return typeMap[ext];
  }

  async checkCompatibility() {
    const featureList = Array.from(this.features.keys());
    
    console.log(chalk.cyan('\nBaseguard: Checking compatibility...'));
    
    for (const feature of featureList) {
      const status = await this.checker.check(feature);
      
      if (status.availability === 'limited') {
        const files = this.features.get(feature);
        console.warn(
          chalk.yellow(`⚠️  ${feature}:`),
          chalk.gray(`Limited Availability in ${files.length} file(s)`)
        );
        
        if (status.suggestion) {
          console.log(chalk.gray(`   Suggestion: ${status.suggestion}`));
        }
      }
    }
  }

  async generateReports(compilation) {
    const reportData = {
      features: [],
      summary: {
        total: this.features.size,
        widely: 0,
        newly: 0,
        limited: 0,
        unknown: 0
      },
      generatedAt: new Date().toISOString()
    };

    for (const [feature, files] of this.features.entries()) {
      const status = await this.checker.check(feature);
      
      reportData.features.push({
        name: feature,
        availability: status.availability,
        files: files,
        browsers: status.browsers,
        suggestion: status.suggestion,
        link: status.link
      });

      // Update summary counts
      if (status.availability === 'widely') reportData.summary.widely++;
      else if (status.availability === 'newly') reportData.summary.newly++;
      else if (status.availability === 'limited') reportData.summary.limited++;
      else reportData.summary.unknown++;
    }

    // Generate JSON report
    const jsonReport = JSON.stringify(reportData, null, 2);
    const jsonPath = path.join(this.options.outputPath, 'compat-report.json');
    await fs.outputFile(jsonPath, jsonReport);

    // Generate HTML report
    const htmlReport = await this.reporter.generateHTML(reportData);
    const htmlPath = path.join(this.options.outputPath, 'compat-report.html');
    await fs.outputFile(htmlPath, htmlReport);

    console.log(chalk.green('\n✓ Baseguard reports generated:'));
    console.log(chalk.gray(`  JSON: ${jsonPath}`));
    console.log(chalk.gray(`  HTML: ${htmlPath}`));

    // Fail build if configured and limited features found
    if (this.options.failOnLimited && reportData.summary.limited > 0) {
      const error = new Error(
        `Baseguard: Build failed due to ${reportData.summary.limited} limited availability feature(s)`
      );
      compilation.errors.push(error);
    }
  }

  showSummary(stats) {
    if (this.features.size === 0) {
      console.log(chalk.gray('\nBaseguard: No web features detected'));
      return;
    }

    console.log(chalk.cyan('\n=== Baseguard Summary ==='));
    console.log(chalk.gray(`Total features analyzed: ${this.features.size}`));
    console.log(chalk.gray(`Reports saved to: ${this.options.outputPath}`));
    console.log(chalk.cyan('========================\n'));
  }
}

module.exports = BaseguardPlugin;