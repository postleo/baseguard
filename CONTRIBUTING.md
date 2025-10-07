# Contributing to Baseguard

Thank you for your interest in contributing to Baseguard! This document provides guidelines and instructions for contributing.

## Code of Conduct

We are committed to providing a welcoming and inspiring community for all. Please be respectful and constructive in all interactions.

## How to Contribute

### Reporting Bugs

Before creating a bug report:
1. Check the [existing issues](https://github.com/yourusername/baseguard/issues)
2. Update to the latest version to see if the issue persists
3. Collect relevant information (Webpack version, Node version, error messages)

When creating a bug report, include:
- Clear and descriptive title
- Steps to reproduce the issue
- Expected vs actual behavior
- Code samples or repository links
- Webpack configuration
- Console output and error messages

### Suggesting Features

Feature suggestions are welcome! Please:
1. Check if the feature has already been suggested
2. Provide a clear use case
3. Explain why this feature would be useful to most users
4. Include example code or mockups if possible

### Pull Requests

1. **Fork the repository** and create your branch from `main`
2. **Install dependencies**: `npm install`
3. **Make your changes** following our coding standards
4. **Add tests** for new functionality
5. **Run tests**: `npm test`
6. **Run linting**: `npm run lint`
7. **Update documentation** if needed
8. **Commit with clear messages** following conventional commits
9. **Submit your pull request**

## Development Setup

### Prerequisites
- Node.js >= 12.0.0
- npm or yarn
- Git

### Installation

```bash
# Clone your fork
git clone https://github.com/YOUR_USERNAME/baseguard.git
cd baseguard

# Install dependencies
npm install

# Run tests
npm test

# Run linting
npm run lint

# Build the plugin
npm run build
```

### Project Structure

```
baseguard/
├── src/                    # Source code
│   ├── index.js           # Main plugin entry
│   ├── scanner.js         # Feature detection
│   ├── baseline-checker.js # Baseline API integration
│   ├── report-generator.js # Report creation
│   └── config-loader.js   # Configuration management
├── types/                 # TypeScript definitions
├── example/               # Example project
├── __tests__/             # Test files
├── docs/                  # Documentation
└── scripts/               # Build scripts
```

## Coding Standards

### JavaScript Style

We use ESLint and Prettier for code formatting:

```bash
# Fix linting issues
npm run lint:fix

# Format code
npm run format
```

Key rules:
- Use single quotes for strings
- Include semicolons
- 2-space indentation
- No trailing commas
- Prefer const over let, avoid var
- Use arrow functions where appropriate

### Commit Messages

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```
feat: add support for CSS Container Queries
fix: resolve caching issue with API results
docs: update README with new examples
test: add tests for scanner.js
chore: update dependencies
```

Types:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `test`: Adding or updating tests
- `chore`: Maintenance tasks
- `refactor`: Code refactoring
- `perf`: Performance improvements

### Testing

- Write tests for all new features
- Ensure existing tests pass
- Aim for >80% code coverage
- Use descriptive test names

```javascript
// Good test example
describe('FeatureScanner', () => {
  it('should detect fetch API in JavaScript code', () => {
    const scanner = new FeatureScanner();
    const code = 'fetch("/api/data")';
    const features = scanner.scanJavaScript(code);
    expect(features).toContain('fetch');
  });
});
```

## Adding New Features

### Adding Feature Detection

To add a new feature to detect:

1. **Update scanner.js**:
```javascript
// Add to appropriate scanning method
const apiPatterns = {
  'NewFeature': /pattern-to-match/,
  // ...
};
```

2. **Add tests**:
```javascript
it('should detect NewFeature', () => {
  const features = scanner.scan('code with feature', 'javascript');
  expect(features).toContain('NewFeature');
});
```

3. **Update documentation**:
- Add to README.md feature list
- Update CHANGELOG.md

### Adding Compatibility Suggestions

To add suggestions for features:

1. **Update baseline-checker.js**:
```javascript
getSuggestion(feature) {
  const suggestions = {
    'YourFeature': 'Your helpful suggestion here',
    // ...
  };
  // ...
}
```

2. **Include polyfill links** if available
3. **Add fallback recommendations**

## Documentation

- Update README.md for user-facing changes
- Add JSDoc comments for new functions
- Update TypeScript definitions if needed
- Include code examples

## Release Process

Releases are managed by maintainers:

1. Update version in package.json
2. Update CHANGELOG.md
3. Create git tag: `v1.x.x`
4. Publish to npm: `npm publish`
5. Create GitHub release with notes

## Questions?

- 💬 [Join our Discord](https://discord.gg/baseguard)
- 📧 Email: contributors@baseguard.dev
- 🐛 [Open an issue](https://github.com/yourusername/baseguard/issues)

## Recognition

Contributors will be:
- Listed in CONTRIBUTORS.md
- Credited in release notes
- Thanked in our README

Thank you for contributing to Baseguard! 🎉