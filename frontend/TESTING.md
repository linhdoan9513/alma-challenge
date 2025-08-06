# Frontend Testing Guide

This document provides information about the testing setup and how to run tests for the frontend application.

## Testing Stack

- **Jest**: Test runner and assertion library
- **React Testing Library**: Component testing utilities
- **@testing-library/jest-dom**: Custom Jest matchers for DOM testing
- **@testing-library/user-event**: User interaction simulation

## Running Tests

### Run all tests

```bash
npm test
```

### Run tests in watch mode (development)

```bash
npm run test:watch
```

### Run tests with coverage report

```bash
npm run test:coverage
```

### Run tests in CI mode

```bash
npm run test:ci
```

## Test Structure

Tests are organized in the following structure:

```
src/
├── components/
│   ├── __tests__/
│   │   ├── VisaCheckboxes.test.tsx
│   │   └── LeadForm.test.tsx
│   └── ...
├── lib/
│   ├── __tests__/
│   │   ├── api.test.ts
│   │   └── countries.test.ts
│   └── ...
├── store/
│   └── __tests__/
│       └── leadSlice.test.ts
└── test-utils.tsx
```

## Test Utilities

The `src/test-utils.tsx` file provides:

- Custom render function with Redux Provider
- Test store creation
- Re-exported testing utilities

## Writing Tests

### Component Tests

When testing components, use the custom render function from `test-utils.tsx`:

```typescript
import { render, screen, fireEvent } from "@/test-utils";

describe("MyComponent", () => {
  it("renders correctly", () => {
    render(<MyComponent />);
    expect(screen.getByText("Hello")).toBeInTheDocument();
  });
});
```

### Redux Tests

For testing Redux slices and actions:

```typescript
import leadSlice, { updateFormData } from "../leadSlice";

describe("leadSlice", () => {
  it("updates form data correctly", () => {
    const initialState = { formData: { firstName: "" } };
    const newState = leadSlice(
      initialState,
      updateFormData({ firstName: "John" })
    );
    expect(newState.formData.firstName).toBe("John");
  });
});
```

### API Tests

For testing API functions:

```typescript
import { submitLeadForm } from "../api";

// Mock fetch
global.fetch = jest.fn();

describe("API", () => {
  it("submits form successfully", async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true }),
    });

    const result = await submitLeadForm(new FormData());
    expect(result).toEqual({ success: true });
  });
});
```

## Testing Best Practices

1. **Test behavior, not implementation**: Focus on what the component does, not how it does it
2. **Use semantic queries**: Prefer `getByRole`, `getByLabelText` over `getByTestId`
3. **Test user interactions**: Use `fireEvent` or `userEvent` to simulate user actions
4. **Mock external dependencies**: Mock API calls, file system operations, etc.
5. **Test error states**: Ensure components handle errors gracefully
6. **Test accessibility**: Verify that components are accessible to screen readers

## Coverage Requirements

The test suite aims for:

- **70% line coverage**
- **70% branch coverage**
- **70% function coverage**
- **70% statement coverage**

## Mocking

### Common Mocks

- **Next.js Router**: Mocked in `jest.setup.js`
- **FileReader**: Mocked for file upload tests
- **localStorage/sessionStorage**: Mocked in `jest.setup.js`
- **window.matchMedia**: Mocked in `jest.setup.js`

### Component Mocks

For complex components or external libraries, create mock components:

```typescript
jest.mock("../ComplexComponent", () => {
  return function MockComplexComponent(props: any) {
    return <div data-testid="complex-component" {...props} />;
  };
});
```

## Debugging Tests

### Debug Mode

Run tests in debug mode to see more detailed output:

```bash
npm test -- --verbose
```

### Debug Specific Test

To debug a specific test file:

```bash
npm test -- LeadForm.test.tsx
```

### Debug with Console

Add `console.log` statements in tests or use the debug utility:

```typescript
import { screen } from "@testing-library/react";

// Debug the current state
screen.debug();
```

## Continuous Integration

Tests are automatically run in CI with:

- Coverage reporting
- No watch mode
- Fail on coverage thresholds
- Parallel execution

## Troubleshooting

### Common Issues

1. **Import errors**: Ensure all imports are properly mocked
2. **Async test failures**: Use `waitFor` for async operations
3. **Component not rendering**: Check if all required providers are included
4. **Mock not working**: Verify mock is defined before the test runs

### Getting Help

- Check Jest documentation: https://jestjs.io/docs/getting-started
- Check React Testing Library documentation: https://testing-library.com/docs/react-testing-library/intro
- Review existing tests for patterns and examples
