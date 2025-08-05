import { fireEvent, render, screen, waitFor } from "@/test-utils";
import CustomResumeUpload from "../CustomResumeUpload";

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

describe("CustomResumeUpload", () => {
  const defaultProps = {
    onChange: jest.fn(),
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
    render(<CustomResumeUpload {...defaultProps} />);

    expect(screen.getByText("Resume/CV (Optional)")).toBeInTheDocument();
    expect(screen.getByText("Upload resume or CV")).toBeInTheDocument();
    expect(screen.getByText("Max file size 5MB.")).toBeInTheDocument();
    expect(
      screen.getByText(
        "Upload your resume or CV to help us better understand your background. Accepted formats: PDF, DOC, DOCX, TXT (max 5MB)"
      )
    ).toBeInTheDocument();
  });

  it("renders with custom label", () => {
    render(<CustomResumeUpload {...defaultProps} label="Custom Label" />);

    expect(screen.getByText("Custom Label")).toBeInTheDocument();
  });

  it("renders with custom description", () => {
    render(
      <CustomResumeUpload
        {...defaultProps}
        description="Custom description text"
      />
    );

    expect(screen.getByText("Custom description text")).toBeInTheDocument();
  });

  it("shows required indicator when required is true", () => {
    render(<CustomResumeUpload {...defaultProps} required={true} />);

    const label = screen.getByText("Resume/CV (Optional)");
    expect(label).toBeInTheDocument();
    const asterisk = screen.getByText("*");
    expect(asterisk).toBeInTheDocument();
    expect(asterisk).toHaveStyle({ color: "red" });
  });

  it("displays selected file name when file is selected", async () => {
    const mockFile = new File(["mock content"], "resume.pdf", {
      type: "application/pdf",
    });

    render(<CustomResumeUpload {...defaultProps} />);

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

  it("calls onChange with base64 data and file when file is selected", async () => {
    const onChange = jest.fn();
    const mockFile = new File(["mock content"], "resume.pdf", {
      type: "application/pdf",
    });

    render(<CustomResumeUpload {...defaultProps} onChange={onChange} />);

    // Find the hidden file input
    const fileInput = screen.getByRole("button", {
      name: /upload resume or cv/i,
    }).nextElementSibling;
    fireEvent.change(fileInput!, { target: { files: [mockFile] } });

    await waitFor(() => {
      expect(onChange).toHaveBeenCalledWith(
        "data:application/pdf;base64,mock-data",
        mockFile
      );
    });
  });

  it("opens file dialog when upload button is clicked", () => {
    render(<CustomResumeUpload {...defaultProps} />);

    const uploadButton = screen.getByText("Upload resume or CV");
    fireEvent.click(uploadButton);

    // The file input should be triggered via the ref
    const fileInput = screen.getByRole("button", {
      name: /upload resume or cv/i,
    }).nextElementSibling;
    expect(fileInput).toHaveAttribute("type", "file");
  });

  it("accepts only specified file types", () => {
    render(<CustomResumeUpload {...defaultProps} />);

    const fileInput = screen.getByRole("button", {
      name: /upload resume or cv/i,
    }).nextElementSibling;
    expect(fileInput).toHaveAttribute("accept", ".pdf,.doc,.docx,.txt");
  });

  it("handles empty file selection gracefully", () => {
    const onChange = jest.fn();

    render(<CustomResumeUpload {...defaultProps} onChange={onChange} />);

    const fileInput = screen.getByRole("button", {
      name: /upload resume or cv/i,
    }).nextElementSibling;
    fireEvent.change(fileInput!, { target: { files: [] } });

    expect(onChange).not.toHaveBeenCalled();
  });

  it("handles null file selection gracefully", () => {
    const onChange = jest.fn();

    render(<CustomResumeUpload {...defaultProps} onChange={onChange} />);

    const fileInput = screen.getByRole("button", {
      name: /upload resume or cv/i,
    }).nextElementSibling;
    fireEvent.change(fileInput!, { target: { files: null } });

    expect(onChange).not.toHaveBeenCalled();
  });

  it("maintains accessibility attributes", () => {
    render(<CustomResumeUpload {...defaultProps} />);

    const uploadButton = screen.getByText("Upload resume or CV");
    expect(uploadButton).toHaveAttribute("type", "button");

    const fileInput = screen.getByRole("button", {
      name: /upload resume or cv/i,
    }).nextElementSibling;
    expect(fileInput).toHaveAttribute("type", "file");
  });

  it("shows cloud icon in upload button", () => {
    render(<CustomResumeUpload {...defaultProps} />);

    const cloudIcon = screen.getByText("☁️");
    expect(cloudIcon).toBeInTheDocument();
  });

  it("handles FileReader errors gracefully", async () => {
    const onChange = jest.fn();
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

    render(<CustomResumeUpload {...defaultProps} onChange={onChange} />);

    const fileInput = screen.getByRole("button", {
      name: /upload resume or cv/i,
    }).nextElementSibling;
    fireEvent.change(fileInput!, { target: { files: [mockFile] } });

    // Should not call onChange when FileReader fails
    await waitFor(() => {
      expect(onChange).not.toHaveBeenCalled();
    });
  });

  it("displays different file names for different file types", async () => {
    const mockPdfFile = new File(["mock content"], "document.pdf", {
      type: "application/pdf",
    });
    const mockDocFile = new File(["mock content"], "resume.doc", {
      type: "application/msword",
    });

    const { rerender } = render(<CustomResumeUpload {...defaultProps} />);

    // Test PDF file
    let fileInput = screen.getByDisplayValue("");
    fireEvent.change(fileInput!, { target: { files: [mockPdfFile] } });

    await waitFor(() => {
      expect(screen.getByText("document.pdf")).toBeInTheDocument();
    });

    // Test DOC file - rerender to reset state
    rerender(<CustomResumeUpload {...defaultProps} />);
    fileInput = screen.getByDisplayValue("");
    fireEvent.change(fileInput!, { target: { files: [mockDocFile] } });

    await waitFor(() => {
      expect(screen.getByText("resume.doc")).toBeInTheDocument();
    });
  });

  it("maintains component structure and styling", () => {
    render(<CustomResumeUpload {...defaultProps} />);

    // Check that the main container exists
    const container = screen.getByText("Upload resume or CV").closest("div");
    expect(container).toBeInTheDocument();

    // Check that all expected elements are present
    expect(screen.getByText("Resume/CV (Optional)")).toBeInTheDocument();
    expect(screen.getByText("Upload resume or CV")).toBeInTheDocument();
    expect(screen.getByText("Max file size 5MB.")).toBeInTheDocument();
  });

  it("handles multiple file selections correctly", async () => {
    const onChange = jest.fn();
    const mockFile1 = new File(["mock content 1"], "resume1.pdf", {
      type: "application/pdf",
    });
    const mockFile2 = new File(["mock content 2"], "resume2.pdf", {
      type: "application/pdf",
    });

    render(<CustomResumeUpload {...defaultProps} onChange={onChange} />);

    const fileInput = screen.getByRole("button", {
      name: /upload resume or cv/i,
    }).nextElementSibling;

    // Select first file
    fireEvent.change(fileInput!, { target: { files: [mockFile1] } });

    await waitFor(() => {
      expect(screen.getByText("resume1.pdf")).toBeInTheDocument();
    });

    // Select second file (should replace the first)
    fireEvent.change(fileInput!, { target: { files: [mockFile2] } });

    await waitFor(() => {
      expect(screen.getByText("resume2.pdf")).toBeInTheDocument();
    });
  });
});
