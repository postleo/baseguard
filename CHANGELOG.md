# Changelog

All notable changes to Baseguard will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2024-01-15

### Added
- Initial release of Baseguard (Baseline Webpack Plugin)
- Code scanning for JavaScript, CSS, and HTML features
- Integration with Google Baseline API for compatibility checking
- Build-time warnings for limited availability features
- JSON and HTML report generation
- Caching system for API results
- Configurable options via plugin parameters or config file
- Support for Webpack 4 and 5
- TypeScript type definitions
- Comprehensive documentation

### Features
- **Feature Detection**:
  - JavaScript API scanning (fetch, IntersectionObserver, Promise, etc.)
  - CSS property detection (Grid, Flexbox, custom properties, etc.)
  - HTML element identification (video, canvas, dialog, etc.)

- **Compatibility Checking**:
  - Google Baseline API integration
  - Status classification (Widely, Newly, Limited, Unknown)
  - Browser-specific support details

- **Reporting**:
  - Visual HTML reports with summary cards
  - Structured JSON reports for CI/CD integration
  - Console warnings during build

- **Configuration**:
  - Customizable output paths
  - Exclude patterns for files/directories
  - Browser targeting options
  - Build failure controls

- **Performance**:
  - API result caching (7-day TTL)
  - Incremental scanning
  - Optimized file processing

### Developer Experience
- Clear console output with colored warnings
- Suggestion system for fallbacks and polyfills
- Links to web.dev documentation
- Framework-agnostic design
- Easy integration with existing Webpack projects

## [Unreleased]

### Planned
- VS Code extension for inline warnings
- Additional framework-specific detectors
- Custom rule definitions
- Enhanced CI/CD reporting formats
- Performance metrics dashboard
- Community-contributed feature database