# Semantic Versioning & Conventional Commits Implementation

This document summarizes the semantic versioning and automated release system implemented for the Vue 3 Calendar Component project.

## 🎯 What Was Implemented

### 1. Conventional Commits Setup
- **commitlint**: Validates commit message format
- **commitizen**: Interactive commit message helper
- **Husky hooks**: Pre-commit and commit-msg validation
- **GitHub Actions**: Automatic commit message validation on PRs

### 2. Semantic Release Configuration
- **Automatic versioning**: Based on commit types
- **Changelog generation**: Automated CHANGELOG.md updates
- **GitHub releases**: Automatic release creation with notes
- **NPM publishing**: Automatic package publishing

### 3. CI/CD Pipeline Updates
- **Multi-branch support**: main, beta, alpha branches
- **Automatic releases**: Triggered on main branch pushes
- **Pre-releases**: Beta and alpha versions
- **Artifact management**: Build artifacts with retention

### 4. Developer Experience
- **Interactive commits**: `npm run commit` for guided commit creation
- **Pre-commit hooks**: Lint, format, and validate before commit
- **Documentation**: Comprehensive contributing guidelines
- **Templates**: GitHub issue and PR templates with conventional commit hints

## 📋 Commit Types & Version Bumps

| Commit Type | Description | Version Bump | Example |
|-------------|-------------|--------------|---------|
| `feat` | New feature | **Minor** (1.0.0 → 1.1.0) | `feat: add event filtering` |
| `fix` | Bug fix | **Patch** (1.0.0 → 1.0.1) | `fix: resolve time grid toggle` |
| `feat!` | Breaking change | **Major** (1.0.0 → 2.0.0) | `feat!: change event API` |
| `perf` | Performance | **Patch** (1.0.0 → 1.0.1) | `perf: optimize rendering` |
| `refactor` | Code refactoring | **Patch** (1.0.0 → 1.0.1) | `refactor: simplify utils` |
| `docs` | Documentation | **Patch** (README only) | `docs: update installation` |
| `test` | Tests | **None** | `test: add unit tests` |
| `chore` | Maintenance | **None** | `chore: update deps` |
| `ci` | CI changes | **None** | `ci: update workflow` |
| `style` | Formatting | **None** | `style: fix linting` |

## 🚀 Release Workflow

### Automatic Releases (Main Branch)
1. Developer creates feature branch
2. Makes commits using conventional format
3. Creates PR to main branch
4. PR is reviewed and commit messages validated
5. PR merged to main
6. **GitHub Actions automatically**:
   - Analyzes commit messages
   - Determines version bump
   - Updates package.json version
   - Generates CHANGELOG.md
   - Creates GitHub release
   - Publishes to NPM
   - Commits changes back to main

### Pre-releases (Beta/Alpha)
- Push to `beta` branch → creates beta pre-release (1.1.0-beta.1)
- Push to `alpha` branch → creates alpha pre-release (1.1.0-alpha.1)

## 🛠️ Available Scripts

```bash
# Development
npm run dev                 # Start development server
npm run build              # Build for production
npm run test               # Run unit tests

# Committing
npm run commit             # Interactive commit helper (recommended)
git commit -m "feat: ..."  # Manual conventional commit

# Releasing
npm run release            # Manual semantic release
npm run release:dry        # Test release without publishing

# Validation
bunx commitlint --from HEAD~1 --to HEAD --verbose  # Check last commit
```

## 📁 New Files Created

```
.releaserc.json              # Semantic release configuration
commitlint.config.js         # Commit message validation rules
CONTRIBUTING.md              # Developer contribution guidelines
CHANGELOG.md                 # Auto-generated changelog
.husky/
  ├── commit-msg            # Validates commit messages
  └── pre-commit            # Runs linting before commit
.github/
  ├── workflows/ci.yml      # Updated CI/CD pipeline
  ├── ISSUE_TEMPLATE/
  │   ├── bug_report.md     # Bug report template
  │   └── feature_request.md # Feature request template
  └── pull_request_template.md # PR template
```

## 🔧 Configuration Details

### Semantic Release Rules
- `feat` commits → Minor version bump
- `fix`, `perf`, `refactor` → Patch version bump
- Breaking changes → Major version bump
- `docs` (README scope) → Patch version bump
- Other types → No version bump

### Branch Strategy
- `main`: Production releases
- `develop`: Development branch (manual releases)
- `beta`: Beta pre-releases
- `alpha`: Alpha pre-releases

### GitHub Secrets Required
- `GITHUB_TOKEN`: Automatic (provided by GitHub)
- `NPM_TOKEN`: Manual setup required for NPM publishing

## 📚 Usage Examples

### Making Commits
```bash
# Interactive (recommended)
npm run commit

# Manual examples
git commit -m "feat: add drag and drop to calendar events"
git commit -m "fix: resolve time grid visibility issue"
git commit -m "docs: update README with new examples"
git commit -m "feat!: change event API structure

BREAKING CHANGE: Event objects now require 'id' field"
```

### Checking Releases
```bash
# Dry run to see what would be released
npm run release:dry

# Check commit message format
bunx commitlint --from HEAD~1 --to HEAD --verbose
```

## 🎉 Benefits

1. **Automated Versioning**: No manual version bumps needed
2. **Consistent Changelog**: Auto-generated from commit messages
3. **Clear Communication**: Commit messages indicate change impact
4. **Reduced Errors**: Automated process prevents human mistakes
5. **Better Collaboration**: Standardized commit format for all contributors
6. **Instant Releases**: New features and fixes available immediately after merge

## 🔧 Setup for New Contributors

1. Clone repository
2. Run `npm install` (installs husky hooks)
3. Use `npm run commit` for commits
4. Follow conventional commit format
5. PRs automatically validated
