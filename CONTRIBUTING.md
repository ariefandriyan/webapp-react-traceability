# 🤝 Contributing to Tobacco Traceability System

Thank you for your interest in contributing to the Tobacco Traceability System! This document provides guidelines and information for contributors.

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Coding Standards](#coding-standards)
- [Pull Request Process](#pull-request-process)
- [Issue Reporting](#issue-reporting)
- [Feature Requests](#feature-requests)

## 📜 Code of Conduct

By participating in this project, you agree to abide by our Code of Conduct:

- **Be respectful**: Treat everyone with respect and kindness
- **Be inclusive**: Welcome newcomers and help them succeed
- **Be collaborative**: Work together and share knowledge
- **Be constructive**: Provide helpful feedback and suggestions

## 🚀 Getting Started

### Prerequisites

- Node.js 18.0+
- npm or yarn
- Git
- Basic knowledge of React, TypeScript, and modern web development

### Local Development Setup

1. **Fork the repository**
   ```bash
   # Click the "Fork" button on GitHub
   ```

2. **Clone your fork**
   ```bash
   git clone https://github.com/your-username/tobacco-traceability.git
   cd tobacco-traceability/web-app
   ```

3. **Add upstream remote**
   ```bash
   git remote add upstream https://github.com/original-repo/tobacco-traceability.git
   ```

4. **Install dependencies**
   ```bash
   npm install
   ```

5. **Start development server**
   ```bash
   npm run dev
   ```

6. **Verify Docker setup (optional)**
   ```bash
   ./docker-check.sh
   ./deploy.sh dev
   ```

## 🔄 Development Workflow

### Branch Naming Convention

Use descriptive branch names with prefixes:

- `feature/` - New features
- `fix/` - Bug fixes
- `docs/` - Documentation updates
- `refactor/` - Code refactoring
- `test/` - Adding or updating tests
- `chore/` - Maintenance tasks

Examples:
```bash
feature/add-export-functionality
fix/map-rendering-issue
docs/update-installation-guide
refactor/optimize-data-fetching
```

### Development Process

1. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes**
   - Write clean, readable code
   - Follow TypeScript best practices
   - Add/update tests as needed
   - Update documentation if necessary

3. **Test your changes**
   ```bash
   # Run linting
   npm run lint
   
   # Run type checking
   npm run type-check
   
   # Run tests
   npm run test
   
   # Build for production
   npm run build
   ```

4. **Commit your changes**
   ```bash
   git add .
   git commit -m "feat: add export functionality for land data"
   ```

5. **Keep your branch updated**
   ```bash
   git fetch upstream
   git rebase upstream/main
   ```

6. **Push to your fork**
   ```bash
   git push origin feature/your-feature-name
   ```

## 📝 Coding Standards

### TypeScript Guidelines

- **Use strict TypeScript**: Enable strict mode in tsconfig.json
- **Define proper types**: Avoid `any` type, create proper interfaces
- **Use meaningful names**: Variables, functions, and components should have descriptive names

```typescript
// ✅ Good
interface FarmingPhase {
  id: string;
  name: string;
  duration: number;
  requirements: string[];
}

// ❌ Bad
interface Phase {
  id: any;
  name: string;
  dur: number;
  req: any[];
}
```

### React Component Guidelines

- **Use functional components**: Prefer function components with hooks
- **Props typing**: Always type component props
- **Component organization**: One component per file
- **Naming convention**: PascalCase for components, camelCase for functions

```typescript
// ✅ Good
interface LahanCardProps {
  lahan: LahanData;
  onEdit: (id: string) => void;
  isSelected?: boolean;
}

export function LahanCard({ lahan, onEdit, isSelected = false }: LahanCardProps) {
  // Component implementation
}

// ❌ Bad
export function lahanCard(props: any) {
  // Component implementation
}
```

### CSS/Styling Guidelines

- **Use Tailwind CSS**: Prefer utility classes over custom CSS
- **Responsive design**: Always consider mobile-first approach
- **Dark mode support**: Use theme-aware colors
- **Consistent spacing**: Use Tailwind spacing scale

```tsx
// ✅ Good
<div className="p-4 bg-background border border-border rounded-lg dark:bg-background-dark">
  <h2 className="text-lg font-semibold text-foreground">Title</h2>
</div>

// ❌ Bad
<div style={{ padding: '16px', backgroundColor: '#fff' }}>
  <h2 style={{ fontSize: '18px' }}>Title</h2>
</div>
```

### File Organization

```
src/
├── components/
│   ├── lahan/
│   │   ├── LahanCard.tsx
│   │   ├── LahanForm.tsx
│   │   └── PetaLahan.tsx
│   ├── fase-tanam/
│   └── ui/
├── pages/
├── types/
├── data/
├── providers/
└── lib/
```

## 🔍 Pull Request Process

### Before Submitting

1. **Ensure your code works**
   - Test locally
   - Run all checks
   - Verify Docker build

2. **Update documentation**
   - Update README if needed
   - Add/update code comments
   - Update type definitions

3. **Check for conflicts**
   - Rebase on latest main
   - Resolve any merge conflicts

### PR Guidelines

1. **Use descriptive titles**
   ```
   ✅ Good: "feat: add CSV export functionality for land data"
   ❌ Bad: "update files"
   ```

2. **Write clear descriptions**
   - What changes were made
   - Why they were made
   - How to test them
   - Screenshots if UI changes

3. **Reference issues**
   ```markdown
   Closes #123
   Fixes #456
   Related to #789
   ```

4. **Add appropriate labels**
   - `feature` - New functionality
   - `bug` - Bug fixes
   - `documentation` - Documentation updates
   - `breaking-change` - Breaking changes

### PR Template

```markdown
## Description
Brief description of changes made.

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
- [ ] Tests pass locally
- [ ] New tests added
- [ ] Manual testing completed

## Screenshots (if applicable)
Add screenshots for UI changes.

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Documentation updated
- [ ] No breaking changes (or properly documented)
```

## 🐛 Issue Reporting

### Before Reporting

1. **Search existing issues**: Check if the issue already exists
2. **Use latest version**: Ensure you're using the latest code
3. **Reproduce the issue**: Provide clear reproduction steps

### Bug Report Template

```markdown
## Bug Description
Clear description of the bug.

## Steps to Reproduce
1. Go to '...'
2. Click on '....'
3. Scroll down to '....'
4. See error

## Expected Behavior
What should happen.

## Actual Behavior
What actually happens.

## Environment
- OS: [e.g., macOS, Windows, Linux]
- Browser: [e.g., Chrome, Firefox, Safari]
- Node.js version: [e.g., 18.17.0]
- Docker version: [if applicable]

## Screenshots
Add screenshots if applicable.

## Additional Context
Any other relevant information.
```

## 💡 Feature Requests

### Feature Request Template

```markdown
## Feature Description
Clear description of the proposed feature.

## Problem Statement
What problem does this feature solve?

## Proposed Solution
How should this feature work?

## Alternatives Considered
Other approaches you've considered.

## Additional Context
Mockups, examples, or other relevant information.
```

## 🔧 Development Tips

### Useful Commands

```bash
# Development
npm run dev              # Start development server
npm run build           # Build for production
npm run preview         # Preview production build

# Code Quality
npm run lint            # Run ESLint
npm run lint:fix        # Fix ESLint errors
npm run type-check      # TypeScript type checking

# Docker
./deploy.sh dev         # Start development environment
./deploy.sh build       # Build production image
./monitor.sh            # Monitor application health
```

### Debugging

1. **Use React Developer Tools**
2. **Check browser console** for errors
3. **Use TypeScript errors** for type issues
4. **Check Docker logs** for container issues

### Performance Considerations

- **Lazy loading**: Use React.lazy for route-based code splitting
- **Memoization**: Use useMemo and useCallback appropriately
- **Bundle size**: Monitor bundle size impact
- **Image optimization**: Optimize images and assets

## 🏆 Recognition

Contributors will be recognized in:
- README.md contributors section
- Release notes for significant contributions
- Project documentation

## 📞 Getting Help

- **GitHub Discussions**: For questions and general discussion
- **Issues**: For bug reports and feature requests
- **Discord/Slack**: [If available] For real-time chat

## 📚 Resources

- [React Documentation](https://reactjs.org/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [HeroUI Documentation](https://heroui.com)
- [Leaflet Documentation](https://leafletjs.com/reference.html)

---

Thank you for contributing to the Tobacco Traceability System! 🌿
