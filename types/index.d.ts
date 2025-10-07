declare module 'baseguard' {
  import { Compiler } from 'webpack';

  interface BrowserSupport {
    supported: boolean;
    version: string;
  }

  interface Feature {
    name: string;
    availability: 'widely' | 'newly' | 'limited' | 'unknown';
    files: string[];
    browsers: {
      chrome?: BrowserSupport;
      edge?: BrowserSupport;
      firefox?: BrowserSupport;
      safari?: BrowserSupport;
    };
    suggestion?: string;
    link?: string;
  }

  interface ReportSummary {
    total: number;
    widely: number;
    newly: number;
    limited: number;
    unknown: number;
  }

  interface ReportData {
    features: Feature[];
    summary: ReportSummary;
    generatedAt: string;
  }

  type ExcludePattern = string | RegExp;

  interface BaseguardOptions {
    /**
     * Output directory for compatibility reports
     * @default 'dist/compat-report'
     */
    outputPath?: string;

    /**
     * Fail the build if features with limited availability are found
     * @default false
     */
    failOnLimited?: boolean;

    /**
     * Include newly available features in compatibility checks
     * @default true
     */
    includeNewly?: boolean;

    /**
     * Enable verbose console output
     * @default false
     */
    verbose?: boolean;

    /**
     * Path to cache file for API results
     * @default 'baseline-cache.json'
     */
    cacheFile?: string;

    /**
     * Enable caching of Baseline API results
     * @default true
     */
    cacheResults?: boolean;

    /**
     * Patterns to exclude from scanning
     * @default [/node_modules/, /\.min\./, /vendor/]
     */
    excludePatterns?: ExcludePattern[];

    /**
     * Target browsers for compatibility checking
     * @default ['chrome', 'edge', 'firefox', 'safari']
     */
    browsers?: ('chrome' | 'edge' | 'firefox' | 'safari')[];

    /**
     * Custom Baseline API URL
     * @default null
     */
    customBaselineUrl?: string | null;
  }

  class BaseguardPlugin {
    constructor(options?: BaseguardOptions);
    apply(compiler: Compiler): void;
  }

  export = BaseguardPlugin;
}