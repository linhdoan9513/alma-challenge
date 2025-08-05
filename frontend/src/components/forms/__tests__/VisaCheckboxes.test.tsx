import { LeadFormData } from "@/store/leadSlice";
import { fireEvent, render, screen } from "@/test-utils";
import VisaCheckboxes from "../VisaCheckboxes";

describe("VisaCheckboxes", () => {
  const defaultFormData: LeadFormData = {
    firstName: "",
    lastName: "",
    email: "",
    linkedin: "",
    country: "",
    o1Visa: false,
    eb1aVisa: false,
    eb2NiwVisa: false,
    dontKnowVisa: false,
    resume: "",
    openInput: "",
  };

  const defaultProps = {
    formData: defaultFormData,
    onUpdate: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders all visa options", () => {
    render(<VisaCheckboxes {...defaultProps} />);

    expect(screen.getByText("O-1")).toBeInTheDocument();
    expect(screen.getByText("EB-1A")).toBeInTheDocument();
    expect(screen.getByText("EB-2 NIW")).toBeInTheDocument();
    expect(screen.getByText("I don't know")).toBeInTheDocument();
  });

  it("renders all checkboxes as unchecked by default", () => {
    render(<VisaCheckboxes {...defaultProps} />);

    const checkboxes = screen.getAllByRole("checkbox");
    expect(checkboxes).toHaveLength(4);

    checkboxes.forEach(checkbox => {
      expect(checkbox).not.toBeChecked();
    });
  });

  it("shows checked state when formData has visa selected", () => {
    const formDataWithVisa = {
      ...defaultFormData,
      o1Visa: true,
    };

    render(<VisaCheckboxes {...defaultProps} formData={formDataWithVisa} />);

    const o1Checkbox = screen.getByLabelText("O-1");
    expect(o1Checkbox).toBeChecked();

    const otherCheckboxes = screen
      .getAllByRole("checkbox")
      .filter(cb => cb !== o1Checkbox);
    otherCheckboxes.forEach(checkbox => {
      expect(checkbox).not.toBeChecked();
    });
  });

  it("calls onUpdate with correct data when checkbox is checked", () => {
    const onUpdate = jest.fn();
    render(<VisaCheckboxes {...defaultProps} onUpdate={onUpdate} />);

    const o1Checkbox = screen.getByLabelText("O-1");
    fireEvent.click(o1Checkbox);

    expect(onUpdate).toHaveBeenCalledWith({
      o1Visa: true,
      eb1aVisa: false,
      eb2NiwVisa: false,
      dontKnowVisa: false,
    });
  });

  it("implements single-select behavior - unchecks others when one is selected", () => {
    const formDataWithMultipleVisa = {
      ...defaultFormData,
      o1Visa: true,
      eb1aVisa: true,
    };

    const onUpdate = jest.fn();
    render(
      <VisaCheckboxes
        {...defaultProps}
        formData={formDataWithMultipleVisa}
        onUpdate={onUpdate}
      />
    );

    const eb1aCheckbox = screen.getByLabelText("EB-1A");
    fireEvent.click(eb1aCheckbox);

    // When clicking on an already checked checkbox, it gets unchecked
    expect(onUpdate).toHaveBeenCalledWith({
      eb1aVisa: false,
    });
  });

  it("calls onUpdate with single field when checkbox is unchecked", () => {
    const formDataWithVisa = {
      ...defaultFormData,
      o1Visa: true,
    };

    const onUpdate = jest.fn();
    render(
      <VisaCheckboxes
        {...defaultProps}
        formData={formDataWithVisa}
        onUpdate={onUpdate}
      />
    );

    const o1Checkbox = screen.getByLabelText("O-1");
    fireEvent.click(o1Checkbox);

    expect(onUpdate).toHaveBeenCalledWith({ o1Visa: false });
  });

  it("handles all visa options correctly", () => {
    const onUpdate = jest.fn();
    render(<VisaCheckboxes {...defaultProps} onUpdate={onUpdate} />);

    const visaOptions = ["O-1", "EB-1A", "EB-2 NIW", "I don't know"];

    visaOptions.forEach(option => {
      const checkbox = screen.getByLabelText(option);
      fireEvent.click(checkbox);
    });

    expect(onUpdate).toHaveBeenCalledTimes(4);
  });

  it("maintains accessibility attributes", () => {
    render(<VisaCheckboxes {...defaultProps} />);

    const checkboxes = screen.getAllByRole("checkbox");
    checkboxes.forEach(checkbox => {
      expect(checkbox).toHaveAttribute("type", "checkbox");
    });
  });

  it("handles form data with all visa options false", () => {
    const formDataAllFalse = {
      ...defaultFormData,
      o1Visa: false,
      eb1aVisa: false,
      eb2NiwVisa: false,
      dontKnowVisa: false,
    };

    render(<VisaCheckboxes {...defaultProps} formData={formDataAllFalse} />);

    const checkboxes = screen.getAllByRole("checkbox");
    checkboxes.forEach(checkbox => {
      expect(checkbox).not.toBeChecked();
    });
  });

  it("handles form data with all visa options true", () => {
    const formDataAllTrue = {
      ...defaultFormData,
      o1Visa: true,
      eb1aVisa: true,
      eb2NiwVisa: true,
      dontKnowVisa: true,
    };

    render(<VisaCheckboxes {...defaultProps} formData={formDataAllTrue} />);

    const checkboxes = screen.getAllByRole("checkbox");
    checkboxes.forEach(checkbox => {
      expect(checkbox).toBeChecked();
    });
  });
});
