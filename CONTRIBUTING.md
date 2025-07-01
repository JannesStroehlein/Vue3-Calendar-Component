# Contributing Guide

## Conventional Commits

This project uses [Conventional Commits](https://www.conventionalcommits.org/) for automated semantic versioning and changelog generation.

### Commit Message Format

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

### Commit Types

| Type | Description | Version Bump |
|------|-------------|--------------|
| `feat` | New feature | Minor |
| `fix` | Bug fix | Patch |
| `docs` | Documentation only changes | Patch (README only) |
| `style` | Code formatting changes | None |
| `refactor` | Code refactoring | Patch |
| `perf` | Performance improvements | Patch |
| `test` | Adding or updating tests | None |
| `build` | Build system or dependency changes | Patch |
| `ci` | CI configuration changes | None |
| `chore` | Other changes | None |
| `revert` | Reverts a previous commit | Patch |

### Examples

#### Features (Minor Version Bump)
```bash
feat: add drag and drop functionality to calendar events
feat(calendar): implement week view navigation
feat!: remove deprecated event API (BREAKING CHANGE)
```

#### Bug Fixes (Patch Version Bump)
```bash
fix: resolve time grid visibility toggle issue
fix(toolbar): correct view switching reactivity
fix: prevent event overflow in day view
```

#### Documentation (Patch Version Bump for README)
```bash
docs: update installation instructions
docs(README): add usage examples
```

#### Other Changes (No Version Bump)
```bash
style: format code with prettier
test: add unit tests for date utilities
ci: update GitHub Actions workflow
chore: update dependencies
```

### Breaking Changes

For breaking changes, add `!` after the type or include `BREAKING CHANGE:` in the footer:

```bash
feat!: change event API structure

BREAKING CHANGE: Event objects now require 'id' field
```

## Making Commits

### Option 1: Interactive Commitizen (Recommended)
```bash
npm run commit
```

This will guide you through creating a properly formatted commit message.

### Option 2: Manual Commit
```bash
git commit -m "feat: add new calendar filtering options"
```

Make sure to follow the conventional commit format.

## Automated Releases

### Release Workflow

1. **Development**: Work on feature branches
2. **Pull Request**: Create PR to `main` branch
3. **Review**: Code review and commit message validation
4. **Merge**: Merge to `main` triggers automatic release
5. **Release**: Semantic-release creates version, changelog, and GitHub release

### Release Branches

- `main`: Production releases (1.0.0, 1.1.0, 1.1.1)
- `beta`: Beta pre-releases (1.1.0-beta.1)
- `alpha`: Alpha pre-releases (1.1.0-alpha.1)

### Version Bumping Rules

- `feat` commits → Minor version increase (1.0.0 → 1.1.0)
- `fix`, `perf`, `refactor` commits → Patch version increase (1.0.0 → 1.0.1)
- Breaking changes → Major version increase (1.0.0 → 2.0.0)

## Scripts

```bash
# Interactive commit with commitizen
npm run commit

# Run semantic release (dry run)
npm run release:dry

# Run semantic release
npm run release

# Lint commit messages
bunx commitlint --from HEAD~1 --to HEAD --verbose
```

## GitHub Actions

The CI/CD pipeline automatically:

1. **Tests**: Run on all PRs and pushes
2. **Build**: Create distribution files
3. **Release**: Automatic releases on `main` branch
4. **Pre-release**: Beta/alpha releases on respective branches
5. **Commit Linting**: Validate commit messages on PRs

## Local Development

### Setup
```bash
npm install
npm run prepare  # Install husky hooks
```

### Pre-commit Hooks

Husky hooks automatically:
- Run linting and formatting
- Validate commit messages
- Suggest using commitizen for proper format

### Validation

Before pushing, you can validate your commits:
```bash
# Check last commit message
bunx commitlint --from HEAD~1 --to HEAD --verbose

# Check commit message format
npm run release:dry
```

## Troubleshooting

### Commit Message Rejected
If your commit message is rejected:
1. Check the format matches conventional commits
2. Use `npm run commit` for guided commit creation
3. Review the commit types table above

### Release Failed
If automatic release fails:
1. Check GitHub Actions logs
2. Ensure NPM_TOKEN secret is set
3. Verify package.json version is correct
4. Check for any build errors

### Hook Errors
If git hooks fail:
1. Ensure dependencies are installed: `npm install`
2. Reinstall hooks: `npm run prepare`
3. Check file permissions on `.husky/` scripts
