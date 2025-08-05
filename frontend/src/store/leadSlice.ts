import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface LeadFormData {
  firstName: string;
  lastName: string;
  email: string;
  linkedin: string;
  country: string;
  o1Visa: boolean;
  eb1aVisa: boolean;
  eb2NiwVisa: boolean;
  dontKnowVisa: boolean;
  resume?: string;
  openInput: string;
}

interface LeadState {
  formData: LeadFormData;
  isSubmitting: boolean;
  isSubmitted: boolean;
  error: string | null;
}

// First, extract the default form data to a constant
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

const initialState: LeadState = {
  formData: defaultFormData,
  isSubmitting: false,
  isSubmitted: false,
  error: null,
};

const leadSlice = createSlice({
  name: "lead",
  initialState,
  reducers: {
    updateFormData: (state, action: PayloadAction<Partial<LeadFormData>>) => {
      const incoming = action.payload;

      let changed = false;
      const currentData = state.formData;
      // Check for changes in incoming fields only
      for (const key in incoming) {
        if (
          incoming[key as keyof LeadFormData] !==
          currentData[key as keyof LeadFormData]
        ) {
          changed = true;
          break;
        }
      }

      if (changed) {
        state.formData = {
          ...currentData,
          ...incoming,
        };
      }
    },
    setSubmitting: (state, action: PayloadAction<boolean>) => {
      state.isSubmitting = action.payload;
    },
    setSubmitted: (state, action: PayloadAction<boolean>) => {
      state.isSubmitted = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    resetForm: state => {
      state.formData = initialState.formData;
      state.isSubmitting = false;
      state.isSubmitted = false;
      state.error = null;
    },
  },
});

export const {
  updateFormData,
  setSubmitting,
  setSubmitted,
  setError,
  resetForm,
} = leadSlice.actions;
export default leadSlice.reducer;
