import leadSlice, {
  LeadFormData,
  resetForm,
  setError,
  setSubmitted,
  setSubmitting,
  updateFormData,
} from "../leadSlice";

describe("leadSlice", () => {
  const initialState = {
    formData: {
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
    },
    isSubmitting: false,
    isSubmitted: false,
    error: null,
  };

  describe("initial state", () => {
    it("should return the initial state", () => {
      expect(leadSlice(undefined, { type: "unknown" })).toEqual(initialState);
    });
  });

  describe("updateFormData", () => {
    it("should update form data correctly", () => {
      const updates: Partial<LeadFormData> = {
        firstName: "John",
        lastName: "Doe",
        email: "john@example.com",
      };

      const newState = leadSlice(initialState, updateFormData(updates));

      expect(newState.formData.firstName).toBe("John");
      expect(newState.formData.lastName).toBe("Doe");
      expect(newState.formData.email).toBe("john@example.com");
      expect(newState.formData.country).toBe(""); // unchanged
    });

    it("should not update state if no changes are made", () => {
      const updates: Partial<LeadFormData> = {
        firstName: "",
        lastName: "",
      };

      const newState = leadSlice(initialState, updateFormData(updates));

      expect(newState).toBe(initialState);
    });

    it("should update visa categories correctly", () => {
      const updates: Partial<LeadFormData> = {
        o1Visa: true,
        eb1aVisa: false,
        eb2NiwVisa: true,
        dontKnowVisa: false,
      };

      const newState = leadSlice(initialState, updateFormData(updates));

      expect(newState.formData.o1Visa).toBe(true);
      expect(newState.formData.eb1aVisa).toBe(false);
      expect(newState.formData.eb2NiwVisa).toBe(true);
      expect(newState.formData.dontKnowVisa).toBe(false);
    });
  });

  describe("setSubmitting", () => {
    it("should set isSubmitting to true", () => {
      const newState = leadSlice(initialState, setSubmitting(true));
      expect(newState.isSubmitting).toBe(true);
    });

    it("should set isSubmitting to false", () => {
      const stateWithSubmitting = { ...initialState, isSubmitting: true };
      const newState = leadSlice(stateWithSubmitting, setSubmitting(false));
      expect(newState.isSubmitting).toBe(false);
    });
  });

  describe("setSubmitted", () => {
    it("should set isSubmitted to true", () => {
      const newState = leadSlice(initialState, setSubmitted(true));
      expect(newState.isSubmitted).toBe(true);
    });

    it("should set isSubmitted to false", () => {
      const stateWithSubmitted = { ...initialState, isSubmitted: true };
      const newState = leadSlice(stateWithSubmitted, setSubmitted(false));
      expect(newState.isSubmitted).toBe(false);
    });
  });

  describe("setError", () => {
    it("should set error message", () => {
      const errorMessage = "Something went wrong";
      const newState = leadSlice(initialState, setError(errorMessage));
      expect(newState.error).toBe(errorMessage);
    });

    it("should clear error when set to null", () => {
      const stateWithError = { ...initialState, error: "Previous error" };
      const newState = leadSlice(stateWithError, setError(null));
      expect(newState.error).toBe(null);
    });
  });

  describe("resetForm", () => {
    it("should reset form to initial state", () => {
      const filledState = {
        formData: {
          firstName: "John",
          lastName: "Doe",
          email: "john@example.com",
          linkedin: "https://linkedin.com/john",
          country: "USA",
          o1Visa: true,
          eb1aVisa: false,
          eb2NiwVisa: true,
          dontKnowVisa: false,
          resume: "resume.pdf",
          openInput: "Additional info",
        },
        isSubmitting: true,
        isSubmitted: true,
        error: "Some error",
      };

      const newState = leadSlice(filledState, resetForm());

      expect(newState.formData).toEqual(initialState.formData);
      expect(newState.isSubmitting).toBe(false);
      expect(newState.isSubmitted).toBe(false);
      expect(newState.error).toBe(null);
    });
  });
});
