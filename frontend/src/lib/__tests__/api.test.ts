import { ApiError, submitLeadForm } from "../api";

// Mock fetch
global.fetch = jest.fn();

describe("API utilities", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("submitLeadForm", () => {
    const mockFormData = new FormData();
    mockFormData.append("firstName", "John");
    mockFormData.append("lastName", "Doe");
    mockFormData.append("email", "john@example.com");

    it("successfully submits lead form", async () => {
      const mockResponse = {
        success: true,
        message: "Lead submitted successfully",
      };

      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      });

      const result = await submitLeadForm(mockFormData);

      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining("/api/leads/submit"),
        expect.objectContaining({
          method: "POST",
          body: mockFormData,
        })
      );
      expect(result).toEqual(mockResponse);
    });

    it("throws ApiError when response is not ok", async () => {
      const errorMessage = "Validation failed";

      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 400,
        statusText: "Bad Request",
        json: async () => ({ error: errorMessage }),
      });

      const promise = submitLeadForm(mockFormData);
      await expect(promise).rejects.toThrow(ApiError);
      await expect(promise).rejects.toThrow(errorMessage);
    });

    it("throws ApiError with default message when response has no message", async () => {
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 500,
        statusText: "Internal Server Error",
        json: async () => ({}),
      });

      const promise = submitLeadForm(mockFormData);
      await expect(promise).rejects.toThrow(ApiError);
      await expect(promise).rejects.toThrow("Failed to submit form");
    });

    it("throws ApiError when network request fails", async () => {
      const networkError = new Error("Network error");
      (fetch as jest.Mock).mockRejectedValueOnce(networkError);

      const promise = submitLeadForm(mockFormData);
      await expect(promise).rejects.toThrow(ApiError);
      await expect(promise).rejects.toThrow(
        "Network error. Please check your connection and try again."
      );
    });

    it("uses correct API URL", async () => {
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true }),
      });

      await submitLeadForm(mockFormData);

      expect(fetch).toHaveBeenCalledWith(
        expect.stringMatching(/\/api\/leads\/submit$/),
        expect.any(Object)
      );
    });

    it("handles JSON parsing errors", async () => {
      (fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 500,
        statusText: "Internal Server Error",
        json: async () => {
          throw new Error("Invalid JSON");
        },
      });

      const promise = submitLeadForm(mockFormData);
      await expect(promise).rejects.toThrow(ApiError);
      await expect(promise).rejects.toThrow(
        "Network error. Please check your connection and try again."
      );
    });
  });

  describe("ApiError", () => {
    it("creates ApiError with message", () => {
      const error = new ApiError("Test error message", 400);
      expect(error.message).toBe("Test error message");
      expect(error).toBeInstanceOf(Error);
    });

    it("inherits from Error", () => {
      const error = new ApiError("Test error", 500);
      expect(error).toBeInstanceOf(Error);
    });
  });
});
