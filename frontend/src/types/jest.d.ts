import "@testing-library/jest-dom";

declare global {
  const describe: (name: string, fn: () => void) => void;
  const it: (name: string, fn: () => void) => void;
  const expect: any;
  const jest: any;
  const beforeEach: (fn: () => void) => void;
  const afterEach: (fn: () => void) => void;

  namespace jest {
    interface Matchers<R> {
      toBeInTheDocument(): R;
      toHaveAttribute(attr: string, value?: string): R;
      toBeChecked(): R;
      toHaveValue(value: string): R;
      toBeDisabled(): R;
    }
  }
}

export {};
