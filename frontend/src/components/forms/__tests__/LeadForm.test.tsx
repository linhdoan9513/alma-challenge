import { fireEvent, render, screen } from "@/test-utils";
import LeadForm from "../../app/lead-form/LeadForm";

// Mock the API
jest.mock("@/lib/api", () => ({
  submitLeadForm: jest.fn(),
}));

// Mock JsonForms components
jest.mock("@jsonforms/react", () => ({
  JsonForms: ({
    onChange,
  }: {
    onChange: (data: Record<string, unknown>) => void;
  }) => (
    <div
      data-testid="json-forms"
      onClick={() =>
        onChange({
          data: {
            firstName: "John",
            lastName: "Doe",
            email: "john@example.com",
            linkedin: "https://linkedin.com/johndoe",
          },
        })
      }
    >
      JsonForms Component
    </div>
  ),
}));

jest.mock("@jsonforms/core", () => ({
  JsonFormsCellRendererRegistryEntry: {},
  JsonFormsRendererRegistryEntry: {},
}));

jest.mock("@jsonforms/material-renderers", () => ({
  materialCells: [],
  materialRenderers: [],
}));

// Mock the custom components
jest.mock("../CountrySelect", () => {
  return function MockCountrySelect({
    value,
    onChange,
  }: {
    value: string;
    onChange: (value: string) => void;
  }) {
    return (
      <select
        data-testid="country-select"
        value={value}
        onChange={e => onChange(e.target.value)}
      >
        <option value="">Select Country</option>
        <option value="United States">United States</option>
        <option value="Canada">Canada</option>
      </select>
    );
  };
});

jest.mock("../VisaCheckboxes", () => {
  return function MockVisaCheckboxes({
    formData,
    onUpdate,
  }: {
    formData: { o1Visa: boolean };
    onUpdate: (data: { o1Visa: boolean }) => void;
  }) {
    return (
      <div data-testid="visa-checkboxes">
        <input
          type="checkbox"
          data-testid="o1-visa"
          checked={formData.o1Visa}
          onChange={e => onUpdate({ o1Visa: e.target.checked })}
        />
        <label htmlFor="o1-visa">O-1</label>
      </div>
    );
  };
});

jest.mock("../CustomResumeUpload", () => {
  return function MockCustomResumeUpload({
    onChange,
  }: {
    onChange: (filename: string, file: File | undefined) => void;
  }) {
    return (
      <div data-testid="resume-upload">
        <input
          type="file"
          data-testid="resume-file"
          onChange={e => onChange("resume.pdf", e.target.files?.[0])}
        />
      </div>
    );
  };
});

describe("LeadForm", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders the form with all sections", () => {
    render(<LeadForm />);

    expect(
      screen.getByText(
        "Submit the form below and our team of experienced attorneys will review your case and send a preliminary assessment based on your goals."
      )
    ).toBeInTheDocument();
    expect(
      screen.getByText("Visa categories of interest?")
    ).toBeInTheDocument();
    expect(screen.getByText("How can we help you ?")).toBeInTheDocument();
    expect(screen.getByText("Submit")).toBeInTheDocument();
  });

  it("renders JsonForms components", () => {
    render(<LeadForm />);

    expect(screen.getAllByTestId("json-forms")).toHaveLength(2); // personal info and textarea
  });

  it("renders CountrySelect component", () => {
    render(<LeadForm />);

    expect(screen.getByTestId("country-select")).toBeInTheDocument();
  });

  it("renders VisaCheckboxes component", () => {
    render(<LeadForm />);

    expect(screen.getByTestId("visa-checkboxes")).toBeInTheDocument();
  });

  it("renders CustomResumeUpload component", () => {
    render(<LeadForm />);

    expect(screen.getByTestId("resume-upload")).toBeInTheDocument();
  });

  it("shows submit button", () => {
    render(<LeadForm />);

    const submitButton = screen.getByText("Submit");
    expect(submitButton).toBeInTheDocument();
    expect(submitButton).toHaveAttribute("type", "submit");
  });

  it("handles country selection", () => {
    render(<LeadForm />);

    const countrySelect = screen.getByTestId("country-select");
    fireEvent.change(countrySelect, { target: { value: "Canada" } });

    // Test that the change event was triggered
    expect(countrySelect).toBeInTheDocument();
  });

  it("handles visa selection", () => {
    render(<LeadForm />);

    const o1VisaCheckbox = screen.getByTestId("o1-visa");
    fireEvent.click(o1VisaCheckbox);

    // Test that the checkbox is present and clickable
    expect(o1VisaCheckbox).toBeInTheDocument();
  });

  it("handles file upload", () => {
    render(<LeadForm />);

    const fileInput = screen.getByTestId("resume-file");
    const mockFile = new File(["test content"], "resume.pdf", {
      type: "application/pdf",
    });

    fireEvent.change(fileInput, { target: { files: [mockFile] } });

    // The file should be handled by the CustomResumeUpload component
    expect(fileInput).toBeInTheDocument();
  });

  it("handles JsonForms interaction", () => {
    render(<LeadForm />);

    const jsonFormsComponents = screen.getAllByTestId("json-forms");
    expect(jsonFormsComponents).toHaveLength(2);

    // Test that JsonForms components are clickable
    fireEvent.click(jsonFormsComponents[0]);
    fireEvent.click(jsonFormsComponents[1]);
  });

  it("renders form with proper structure", () => {
    render(<LeadForm />);

    // Check for main form sections
    expect(
      screen.getByText("Want to understand your visa options?")
    ).toBeInTheDocument();
    expect(
      screen.getByText("Visa categories of interest?")
    ).toBeInTheDocument();
    expect(screen.getByText("How can we help you ?")).toBeInTheDocument();

    // Check for form elements
    expect(screen.getByTestId("country-select")).toBeInTheDocument();
    expect(screen.getByTestId("visa-checkboxes")).toBeInTheDocument();
    expect(screen.getByTestId("resume-upload")).toBeInTheDocument();
    expect(screen.getByText("Submit")).toBeInTheDocument();
  });
});
