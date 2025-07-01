# Test Architecture

This project uses a comprehensive testing strategy with three levels of testing:

## 1. Unit Tests (`tests/unit/`)
- **Framework**: Vitest + Vue Test Utils
- **Purpose**: Test individual components and utilities in isolation
- **Run with**: `npm run test`
- **Files**:
  - `CalendarComponent.test.ts` - Main calendar component tests
  - `utils.test.ts` - Date utilities and helper functions

## 2. Component Tests (`tests/e2e/components/`)
- **Framework**: Playwright (browser-based)
- **Purpose**: Test components in a real browser environment with DOM interactions
- **Run with**: `npm run test:ct`
- **Features**:
  - Real browser rendering
  - Full CSS and JavaScript execution
  - User interaction simulation
  - Visual regression testing capabilities

## 3. E2E Integration Tests (`tests/e2e/integration/`)
- **Framework**: Playwright
- **Purpose**: Test the complete application flow with real user scenarios
- **Run with**: `npm run test:e2e`
- **Features**:
  - Full application testing
  - Cross-browser compatibility
  - Mobile responsive testing
  - Performance monitoring

## Test Structure

```
tests/
├── unit/                           # Unit tests
│   ├── setup.ts                   # Vitest setup
│   ├── CalendarComponent.test.ts  # Component unit tests
│   └── utils.test.ts              # Utility function tests
└── e2e/                           # End-to-end tests
    ├── components/                # Component-level browser tests
    │   └── calendar-component.spec.ts
    ├── integration/               # Full E2E tests
    │   └── calendar-e2e.spec.ts
    └── component-test.html        # Test harness for component tests
```

## Available Scripts

- `npm run test` - Run unit tests with Vitest
- `npm run test:ui` - Run unit tests with UI
- `npm run test:ct` - Run component tests with Playwright
- `npm run test:e2e` - Run E2E tests (Chrome only)
- `npm run test:e2e:all` - Run E2E tests on all browsers
- `npm run test:playwright` - Run all Playwright tests

## Component Test Approach

The component tests use a hybrid approach:
1. A test HTML page (`component-test.html`) serves as the test harness
2. Tests dynamically inject component HTML and behaviors
3. Playwright interacts with the injected components as if they were real Vue components
4. This approach provides browser-level testing without requiring complex setup

## Best Practices

1. **Unit Tests**: Focus on logic, edge cases, and component props/events
2. **Component Tests**: Focus on user interactions, visual states, and DOM behavior
3. **E2E Tests**: Focus on user workflows, navigation, and integration scenarios

## Running Tests

### Development
```bash
# Run all unit tests in watch mode
npm run test

# Run component tests
npm run test:ct

# Run E2E tests
npm run test:e2e
```

### CI/CD
```bash
# Run all tests
npm run test && npm run test:playwright
```

## Test Data

Tests use mock data and real dayjs objects to ensure accurate date handling and component behavior.
