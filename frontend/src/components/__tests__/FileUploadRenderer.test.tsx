import { fireEvent, render, screen, waitFor, within } from "@/test-utils";
import FileUploadRenderer from "../FileUploadRenderer";

// Mock the JsonForms wrapper
jest.mock("@jsonforms/react", () => ({
  withJsonFormsControlProps: (
    Component: React.ComponentType<Record<string, unknown>>
  ) => Component,
}));

// Mock FileReader
const mockFileReader = {
  readAsDataURL: jest.fn(),
  onload: null as
    | ((this: FileReader, ev: ProgressEvent<FileReader>) => unknown)
    | null,
  result: "data:application/pdf;base64,mock-base64-data",
  error: null,
  onabort: null,
  onerror: null,
  onloadend: null,
  onloadstart: null,
  onprogress: null,
  readyState: 0 as 0 | 1 | 2,
  DONE: 2 as const,
  EMPTY: 0 as const,
  LOADING: 1 as const,
  abort: jest.fn(),
  readAsArrayBuffer: jest.fn(),
  readAsBinaryString: jest.fn(),
  readAsText: jest.fn(),
  addEventListener: jest.fn(),
  removeEventListener: jest.fn(),
  dispatchEvent: jest.fn(),
};

global.FileReader = jest.fn(
  () => mockFileReader as unknown as FileReader
) as unknown as jest.MockedClass<typeof FileReader>;

describe("FileUploadRenderer", () => {
  const defaultProps = {
    data: "",
    handleChange: jest.fn(),
    path: "#/properties/resume",
    label: "Resume Upload",
    description: "Upload your resume or CV",
    errors: null,
    required: false,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockFileReader.onload = null;
    // Reset the mock implementation
    mockFileReader.readAsDataURL.mockImplementation(() => {
      // Simulate async behavior by calling onload after a short delay
      setTimeout(() => {
        if (mockFileReader.onload) {
          mockFileReader.onload({
            target: { result: "data:application/pdf;base64,mock-data" },
          } as ProgressEvent<FileReader>);
        }
      }, 0);
    });
  });

  it("renders with default props", () => {
    render(<FileUploadRenderer {...defaultProps} />);

    expect(screen.getByText("Resume Upload")).toBeInTheDocument();
    expect(screen.getByText("Upload resume or CV")).toBeInTheDocument();
    expect(screen.getByText("Max file size 5MB.")).toBeInTheDocument();
  });
  it("renders with custom label", () => {
    render(<FileUploadRenderer {...defaultProps} label="Custom Label" />);

    expect(screen.getByText("Custom Label")).toBeInTheDocument();
  });

  it("shows required indicator when required is true", () => {
    render(<FileUploadRenderer {...defaultProps} required={true} />);

    const label = screen.getByText("Resume Upload").closest("label");
    expect(label).toBeInTheDocument();
    if (label) {
      const asterisk = within(label).getByText("*");
      expect(asterisk).toBeInTheDocument();
    }
  });

  it("shows description when provided", () => {
    render(
      <FileUploadRenderer {...defaultProps} description="Custom description" />
    );

    expect(screen.getByText("Custom description")).toBeInTheDocument();
  });

  it("shows error message when errors are provided", () => {
    render(<FileUploadRenderer {...defaultProps} errors="File is too large" />);

    expect(screen.getByText("File is too large")).toBeInTheDocument();
  });

  it("displays selected file name when file is selected", async () => {
    const mockFile = new File(["mock content"], "resume.pdf", {
      type: "application/pdf",
    });

    render(<FileUploadRenderer {...defaultProps} />);

    // Find the hidden file input
    const fileInput = screen.getByRole("button", {
      name: /upload resume or cv/i,
    }).nextElementSibling;
    expect(fileInput).toHaveAttribute("type", "file");

    fireEvent.change(fileInput!, { target: { files: [mockFile] } });

    await waitFor(() => {
      expect(screen.getByText("resume.pdf")).toBeInTheDocument();
    });
  });

  it("calls handleChange with base64 data when file is selected", async () => {
    const handleChange = jest.fn();
    const mockFile = new File(["mock content"], "resume.pdf", {
      type: "application/pdf",
    });

    render(
      <FileUploadRenderer {...defaultProps} handleChange={handleChange} />
    );

    // Find the hidden file input
    const fileInput = screen.getByRole("button", {
      name: /upload resume or cv/i,
    }).nextElementSibling;
    fireEvent.change(fileInput!, { target: { files: [mockFile] } });

    await waitFor(() => {
      expect(handleChange).toHaveBeenCalledWith(
        "#/properties/resume",
        "data:application/pdf;base64,mock-data"
      );
    });
  });

  it("opens file dialog when upload button is clicked", () => {
    render(<FileUploadRenderer {...defaultProps} />);

    const uploadButton = screen.getByText("Upload resume or CV");
    fireEvent.click(uploadButton);

    // The file input should be triggered via the ref
    const fileInput = screen.getByRole("button", {
      name: /upload resume or cv/i,
    }).nextElementSibling;
    expect(fileInput).toHaveAttribute("type", "file");
  });

  it("accepts only specified file types", () => {
    render(<FileUploadRenderer {...defaultProps} />);

    const fileInput = screen.getByRole("button", {
      name: /upload resume or cv/i,
    }).nextElementSibling;
    expect(fileInput).toHaveAttribute("accept", ".pdf,.doc,.docx,.txt");
  });

  it("handles empty file selection gracefully", () => {
    const handleChange = jest.fn();

    render(
      <FileUploadRenderer {...defaultProps} handleChange={handleChange} />
    );

    const fileInput = screen.getByRole("button", {
      name: /upload resume or cv/i,
    }).nextElementSibling;
    fireEvent.change(fileInput!, { target: { files: [] } });

    expect(handleChange).not.toHaveBeenCalled();
  });

  it("handles null file selection gracefully", () => {
    const handleChange = jest.fn();

    render(
      <FileUploadRenderer {...defaultProps} handleChange={handleChange} />
    );

    const fileInput = screen.getByRole("button", {
      name: /upload resume or cv/i,
    }).nextElementSibling;
    fireEvent.change(fileInput!, { target: { files: null } });

    expect(handleChange).not.toHaveBeenCalled();
  });

  it("maintains accessibility attributes", () => {
    render(<FileUploadRenderer {...defaultProps} />);

    const uploadButton = screen.getByText("Upload resume or CV");
    expect(uploadButton).toHaveAttribute("type", "button");

    const fileInput = screen.getByRole("button", {
      name: /upload resume or cv/i,
    }).nextElementSibling;
    expect(fileInput).toHaveAttribute("type", "file");
  });

  it("shows cloud icon in upload button", () => {
    render(<FileUploadRenderer {...defaultProps} />);

    const cloudIcon = screen.getByText("☁️");
    expect(cloudIcon).toBeInTheDocument();
  });

  it("handles FileReader errors gracefully", async () => {
    const handleChange = jest.fn();
    const mockFile = new File(["mock content"], "resume.pdf", {
      type: "application/pdf",
    });

    // Mock FileReader to simulate error by not calling onload
    const mockErrorFileReader = {
      ...mockFileReader,
      readAsDataURL: jest.fn().mockImplementation(() => {
        // Don't call onload, simulating a FileReader error
        return;
      }),
    };

    jest
      .spyOn(global, "FileReader")
      .mockImplementation(() => mockErrorFileReader as unknown as FileReader);

    render(
      <FileUploadRenderer {...defaultProps} handleChange={handleChange} />
    );

    const fileInput = screen.getByRole("button", {
      name: /upload resume or cv/i,
    }).nextElementSibling;
    fireEvent.change(fileInput!, { target: { files: [mockFile] } });

    // Should not call handleChange when FileReader fails
    await waitFor(() => {
      expect(handleChange).not.toHaveBeenCalled();
    });
  });
});
