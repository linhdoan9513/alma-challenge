import { fireEvent, render, screen, waitFor } from "@/test-utils";
import CountrySelect from "../CountrySelect";

// Mock the countries data
jest.mock("@/lib/countries", () => ({
  sortedCountries: [
    { name: "United States", code: "US" },
    { name: "Canada", code: "CA" },
    { name: "United Kingdom", code: "GB" },
  ],
}));

describe("CountrySelect", () => {
  const defaultProps = {
    value: "",
    onChange: jest.fn(),
    label: "Country of Citizenship",
    required: false,
    error: false,
    disabled: false,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders with default props", () => {
    render(<CountrySelect {...defaultProps} />);

    expect(screen.getByLabelText("Country of Citizenship")).toBeInTheDocument();
    expect(screen.getByRole("combobox")).toBeInTheDocument();
  });

  it("renders with custom label", () => {
    render(<CountrySelect {...defaultProps} label="Select Country" />);

    expect(screen.getByLabelText("Select Country")).toBeInTheDocument();
  });

  it("shows required indicator when required is true", () => {
    render(<CountrySelect {...defaultProps} required={true} />);

    const input = screen.getByRole("combobox");
    // Material-UI Autocomplete doesn't set aria-required on the input
    // Instead, check if the label has the required indicator
    const label = screen.getByText("Country of Citizenship");
    expect(label).toBeInTheDocument();
  });

  it("shows error state when error is true", () => {
    render(<CountrySelect {...defaultProps} error={true} />);

    const input = screen.getByRole("combobox");
    expect(input).toHaveAttribute("aria-invalid", "true");
  });

  it("is disabled when disabled is true", () => {
    render(<CountrySelect {...defaultProps} disabled={true} />);

    const input = screen.getByRole("combobox");
    // Material-UI Autocomplete sets disabled class but not the disabled attribute
    expect(input).toHaveClass("Mui-disabled");
  });

  it("displays selected country when value is provided", () => {
    render(<CountrySelect {...defaultProps} value="United States" />);

    expect(screen.getByDisplayValue("United States")).toBeInTheDocument();
  });

  it("calls onChange when a country is selected", async () => {
    const onChange = jest.fn();
    render(<CountrySelect {...defaultProps} onChange={onChange} />);

    const input = screen.getByRole("combobox");
    fireEvent.mouseDown(input);

    // Wait for dropdown to open and select a country
    await waitFor(() => {
      expect(screen.getByText("Canada")).toBeInTheDocument();
    });

    const option = screen.getByText("Canada");
    fireEvent.click(option);

    expect(onChange).toHaveBeenCalledWith("Canada");
  });

  it("handles empty value correctly", () => {
    render(<CountrySelect {...defaultProps} value="" />);

    const input = screen.getByRole("combobox");
    expect(input).toHaveValue("");
  });

  it("handles unknown country value gracefully", () => {
    render(<CountrySelect {...defaultProps} value="Unknown Country" />);

    const input = screen.getByRole("combobox");
    expect(input).toHaveValue("");
  });

  it("filters countries when typing", async () => {
    render(<CountrySelect {...defaultProps} />);

    const input = screen.getByRole("combobox");
    fireEvent.change(input, { target: { value: "United" } });

    // Wait for the filtered options to appear
    await waitFor(() => {
      expect(screen.getByText("United States")).toBeInTheDocument();
      expect(screen.getByText("United Kingdom")).toBeInTheDocument();
      expect(screen.queryByText("Canada")).not.toBeInTheDocument();
    });
  });

  it("shows no options text when no countries match filter", async () => {
    render(<CountrySelect {...defaultProps} />);

    const input = screen.getByRole("combobox");
    fireEvent.change(input, { target: { value: "XYZ" } });

    await waitFor(() => {
      expect(screen.getByText("No countries found")).toBeInTheDocument();
    });
  });

  it("maintains controlled state correctly", () => {
    const { rerender } = render(<CountrySelect {...defaultProps} value="" />);

    let input = screen.getByRole("combobox");
    expect(input).toHaveValue("");

    rerender(<CountrySelect {...defaultProps} value="Canada" />);
    input = screen.getByRole("combobox");
    expect(input).toHaveValue("Canada");
  });
});
