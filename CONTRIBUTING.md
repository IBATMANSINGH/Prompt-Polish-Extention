# Contributing to PromptPolish

Thank you for your interest in contributing to PromptPolish! This document provides guidelines and instructions for contributing to the project.

## Code of Conduct

By participating in this project, you agree to abide by our Code of Conduct. Please read it before contributing.

## How Can I Contribute?

### Reporting Bugs

Before submitting a bug report:

- Check the [issue tracker](https://github.com/yourusername/promptpolish/issues) to see if the problem has already been reported.
- If you're unable to find an open issue addressing the problem, [open a new one](https://github.com/yourusername/promptpolish/issues/new).

When reporting bugs, please include:
- A clear and descriptive title
- A description of the exact steps to reproduce the behavior
- Expected behavior and what actually happened
- Screenshots if applicable
- Extension version and browser information
- Any other context that might be relevant

### Suggesting Enhancements

Enhancement suggestions are tracked as GitHub issues. To suggest an enhancement:

- Check if the enhancement has already been suggested in the issue tracker
- If not, create a new issue with a clear title and detailed description
- Explain why this enhancement would be useful to most PromptPolish users

### Pull Requests

- Fill in the required template
- Follow the coding style of the project
- Include appropriate tests and ensure all tests pass
- Update the documentation for any changes to APIs, features, or behavior

## Development Process

### Setting Up Development Environment

1. Fork the repository
2. Clone your fork: `git clone https://github.com/yourusername/promptpolish.git`
3. Install dependencies: `npm install`
4. Set up environment variables (see README.md)
5. Start the development server: `npm run dev`

### Loading the Extension

1. In Chrome/Edge, go to `chrome://extensions/`
2. Enable "Developer mode"
3. Click "Load unpacked" and select the `client/public` folder

### Project Structure

- `/client/public` - Extension files (manifest, background script, content script)
- `/client/src` - React application for the extension popup
- `/server` - API server for prompt optimization
- `/shared` - Shared types and schemas
- `/docs` - Documentation and assets

### Running Tests

```bash
npm test
```

### Building for Production

```bash
npm run build
```

## Style Guides

### Git Commit Messages

- Use the present tense ("Add feature" not "Added feature")
- Use the imperative mood ("Move cursor to..." not "Moves cursor to...")
- Limit the first line to 72 characters or less
- Reference issues and pull requests liberally after the first line

### JavaScript/TypeScript Style Guide

- Follow the [Airbnb JavaScript Style Guide](https://github.com/airbnb/javascript)
- Use TypeScript for type safety
- Document all functions and classes with JSDoc comments
- Use meaningful variable and function names

### CSS/SCSS Style Guide

- Use Tailwind CSS utility classes when possible
- Follow BEM naming conventions for custom CSS

### Documentation Style Guide

- Use [Markdown](https://daringfireball.net/projects/markdown/) for documentation
- Follow the [GitHub Flavored Markdown Spec](https://github.github.com/gfm/)

## Additional Notes

### Issue and Pull Request Labels

- `bug` - Something isn't working
- `enhancement` - New feature or request
- `documentation` - Improvements or additions to documentation
- `good first issue` - Good for newcomers
- `help wanted` - Extra attention is needed

## Thank You!

Your contributions to open source, large or small, make projects like this possible. Thank you for taking the time to contribute.