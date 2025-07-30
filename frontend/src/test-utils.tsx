import leadSlice from "@/store/leadSlice";
import { configureStore } from "@reduxjs/toolkit";
import { render } from "@testing-library/react";
import React, { ReactElement } from "react";
import { Provider } from "react-redux";

// Create a test store
const createTestStore = (preloadedState = {}) => {
  return configureStore({
    reducer: {
      lead: leadSlice,
    },
    preloadedState,
  });
};

// Custom render function that includes providers
const AllTheProviders = ({
  children,
  store,
}: {
  children: React.ReactNode;
  store: ReturnType<typeof configureStore>;
}) => {
  return <Provider store={store}>{children}</Provider>;
};

const customRender = (
  ui: ReactElement,
  {
    preloadedState = {},
    store = createTestStore(preloadedState),
    ...renderOptions
  } = {}
) => {
  const Wrapper = ({ children }: { children: React.ReactNode }) => (
    <AllTheProviders store={store}>{children}</AllTheProviders>
  );

  return { store, ...render(ui, { wrapper: Wrapper, ...renderOptions }) };
};

// Re-export everything from testing library
export * from "@testing-library/react";
export { createTestStore, customRender as render };
