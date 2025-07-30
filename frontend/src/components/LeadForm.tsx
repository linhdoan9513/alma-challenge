"use client";

import { ApiError, submitLeadForm } from "@/lib/api";
import {
  LeadFormData,
  resetForm,
  setError,
  setSubmitted,
  setSubmitting,
  updateFormData,
} from "@/store/leadSlice";
import { RootState } from "@/store/store";
import {
  JsonFormsCellRendererRegistryEntry,
  JsonFormsRendererRegistryEntry,
} from "@jsonforms/core";
import {
  materialCells,
  materialRenderers,
} from "@jsonforms/material-renderers";
import { JsonForms } from "@jsonforms/react";
import { Description as DescriptionIcon } from "@mui/icons-material";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";
import CustomResumeUpload from "./CustomResumeUpload";
import { leadFormSchema, leadFormUISchema } from "./LeadFormConfig";

// Client-only wrapper to prevent hydration mismatches
const ClientOnly: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div style={{ minHeight: "400px" }} />; // Placeholder to prevent layout shift
  }

  return <>{children}</>;
};

/* Layout */
const Page = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
`;

const Header = styled.header`
  background: #e8f0d7 url("/header-background.jpg") no-repeat left center;
  background-size: cover;
  padding: 2rem 1rem;
  display: flex;
  align-items: center;
  min-height: 200px;

  @media (min-width: 768px) {
    padding: 3rem 2rem;
    min-height: 250px;
  }

  @media (min-width: 1024px) {
    padding: 4rem 2rem;
    min-height: 300px;
  }
`;

const HeaderContent = styled.div`
  max-width: 1200px;
  width: 100%;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Brand = styled.div`
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--primary-color);
  text-transform: lowercase;
`;

const Heading = styled.h1`
  font-size: 1.75rem;
  font-weight: 700;
  color: var(--primary-color);
  text-align: right;

  @media (min-width: 768px) {
    font-size: 2.25rem;
  }

  @media (min-width: 1024px) {
    font-size: 2.75rem;
  }
`;

const Section = styled.section`
  background: white;
  flex: 1;
  padding: 2rem 1rem;
  width: 100%;

  @media (min-width: 768px) {
    padding: 3rem 2rem;
  }

  @media (min-width: 1024px) {
    padding: 4rem 2rem;
  }

  @media (max-width: 480px) {
    padding: 1.5rem 0.5rem;
  }
`;

const Container = styled.div`
  max-width: 600px;
  margin: 0 auto;
  text-align: center;
  padding: 0 1rem;
  width: 100%;

  @media (max-width: 768px) {
    padding: 0 0.5rem;
  }

  @media (max-width: 480px) {
    padding: 0 0.25rem;
  }
`;

/* Form Elements */
const FormHeader = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  margin-bottom: 2rem;
`;

const Icon = styled.div`
  width: 48px;
  height: 48px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
  font-size: 1.5rem;
`;

const Title = styled.h2`
  font-size: 1.25rem;
  font-weight: 600;
  color: black;
  margin: 0;
  text-align: center;

  @media (min-width: 768px) {
    font-size: 1.5rem;
  }
`;

const Description = styled.p`
  color: black;
  margin-bottom: 2.5rem;
  line-height: 1.6;
  font-size: 1rem;
  text-align: center;
  max-width: 500px;
  margin-left: auto;
  margin-right: auto;
  font-weight: 600;
`;

const StyledJsonForms = styled.div`
  width: 100%;
  max-width: 500px;
  margin: 0 auto;

  /* Form field styling - consistent width and responsive */
  .MuiTextField-root {
    margin-bottom: 1.5rem;
    width: 100%;
  }

  .MuiFormControl-root {
    margin-bottom: 1.5rem;
    width: 100%;
  }

  .MuiInputBase-root {
    border-radius: 8px;
    background-color: white;
    width: 100%;
  }

  /* Remove clear button (x) from input fields */
  .MuiInputAdornment-root .MuiIconButton-root {
    display: none !important;
  }

  /* Hide any clear/close icons in input fields */
  .MuiInputBase-input::-webkit-search-cancel-button,
  .MuiInputBase-input::-webkit-search-decoration,
  .MuiInputBase-input::-webkit-search-results-button,
  .MuiInputBase-input::-webkit-search-results-decoration {
    display: none !important;
  }

  /* Remove any clear buttons from JsonForms inputs */
  .MuiTextField-root .MuiInputAdornment-root .MuiIconButton-root,
  .MuiFormControl-root .MuiInputAdornment-root .MuiIconButton-root {
    display: none !important;
  }

  /* Hide clear icons in select dropdowns */
  .MuiSelect-icon {
    display: none !important;
  }

  /* Remove any close/clear buttons from form controls */
  button[aria-label*="clear"],
  button[aria-label*="Clear"],
  button[aria-label*="close"],
  button[aria-label*="Close"] {
    display: none !important;
  }

  /* Hide checkbox labels when checked */
  .MuiCheckbox-root.Mui-checked ~ .MuiFormControlLabel-label {
    pointer-events: none !important;
    color: black;
  }

  .MuiOutlinedInput-root {
    // border: 1px solid #e0e0e0;
    width: 100%;
    transition: border-color 0.2s ease;

    &:hover {
      border-color: var(--primary-color);
    }

    &.Mui-focused {
      border-color: var(--primary-color);
      box-shadow: 0 0 0 2px rgba(51, 51, 51, 0.1);
    }

    /* Remove all error styling */
    &.Mui-error {
      border-color: #e0e0e0;
    }
  }

  .MuiFormLabel-root {
    color: #666;
    font-weight: 500;
    font-size: 0.9rem;

    &.Mui-focused {
      color: black;
    }
  }

  /* Hide all validation error messages */
  .MuiFormHelperText-root {
    display: none !important;
  }

  /* Visa checkboxes - responsive layout */
  .MuiFormGroup-root {
    flex-direction: column !important;
    align-items: flex-start !important;
    margin-left: 0 !important;
    margin-bottom: 1.5rem;
    width: 100%;
  }

  .MuiFormControlLabel-root {
    justify-content: flex-start !important;
    width: 100% !important;
    margin: 0.5rem 0 !important;
  }

  .MuiFormControlLabel-label {
    font-weight: 500;
    color: black;
    font-size: 1rem;
  }

  .MuiCheckbox-root {
    padding: 4px;
    margin: 0;
    color: #666;
    transition: color 0.2s ease;

    &.Mui-checked {
      color: black;
    }
  }

  /* Textarea styling - consistent width */
  textarea.MuiInputBase-input {
    min-height: 120px;
    padding: 1rem;
    font-size: 1rem;
    border-radius: 8px;
    border: none;
    background-color: white;
    color: var(--primary-color);
    resize: vertical;
    line-height: 1.5;
    width: 100%;
    transition: border-color 0.2s ease;

    &:focus {
      border: none;
      outline: none;
      box-shadow: none;
    }

    &::placeholder {
      color: #999;
      font-style: italic;
    }
  }

  /* Select dropdown styling - consistent width */
  .MuiSelect-root {
    border-radius: 8px;
    width: 100%;
  }

  /* Better label styling */
  .MuiInputLabel-root {
    font-weight: 500;
    color: var(--primary-color);
  }

  /* Consistent spacing for all form elements */
  .MuiFormControl-root,
  .MuiTextField-root {
    margin-bottom: 1.5rem;
  }

  /* Responsive design */
  @media (max-width: 768px) {
    max-width: 100%;
    padding: 0 1rem;

    .MuiTextField-root,
    .MuiFormControl-root {
      margin-bottom: 1rem;
    }

    .MuiFormControlLabel-label {
      font-size: 0.9rem;
    }

    textarea.MuiInputBase-input {
      min-height: 100px;
      padding: 0.75rem;
    }
  }

  @media (max-width: 480px) {
    padding: 0 0.5rem;

    .MuiTextField-root,
    .MuiFormControl-root {
      margin-bottom: 0.75rem;
    }

    .MuiFormControlLabel-label {
      font-size: 0.85rem;
    }

    textarea.MuiInputBase-input {
      min-height: 80px;
      padding: 0.5rem;
    }
  }

  /* Global overrides to ensure no red colors */
  * {
    --mui-palette-error-main: #e0e0e0 !important;
    --mui-palette-error-light: #e0e0e0 !important;
    --mui-palette-error-dark: #e0e0e0 !important;
  }
`;

const Button = styled.button`
  width: 100%;
  max-width: 500px;
  padding: 1rem 2rem;
  margin-top: 2rem;
  background: black;
  color: white;
  font-weight: 600;
  font-size: 1.1rem;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

  &:hover {
    background: #555;
    transform: translateY(-1px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
  }

  &:active {
    transform: translateY(0);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }

  &:disabled {
    background: #ccc;
    cursor: not-allowed;
    transform: none;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }
`;

const Error = styled.div`
  background: #f8f9fa;
  color: var(--primary-color);
  border: 1px solid #dee2e6;
  border-radius: 8px;
  padding: 1rem;
  margin-bottom: 1rem;
`;

const Success = styled.div`
  text-align: center;
  background: white;
  padding: 3rem 2rem;
  margin: 2rem 0;
  color: var(--primary-color);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
  max-width: 500px;
  margin: 2rem auto;
`;

const DocumentIcon = styled.div`
  width: 64px;
  height: 64px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  position: relative;
`;

const ThankYouTitle = styled.h2`
  font-size: 1.75rem;
  font-weight: 700;
  color: var(--primary-color);
  margin: 0;
`;

const ThankYouMessage = styled.p`
  color: var(--primary-color);
  font-size: 1rem;
  line-height: 1.5;
  margin: 0;
  text-align: center;
  font-weight: 600;
`;

const HomeButton = styled(Link)`
  background: var(--primary-color);
  color: white;
  padding: 1rem 2rem;
  border-radius: 8px;
  text-decoration: none;
  font-weight: 600;
  transition: background-color 0.2s;
  min-width: 400px;

  &:hover {
    background: #555;
  }
`;

interface JsonFormsChangeEvent {
  data: LeadFormData;
  errors?: unknown[];
}

const LeadForm: React.FC = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { formData, isSubmitting, isSubmitted, error } = useSelector(
    (state: RootState) => state.lead
  );
  const [resumeFile, setResumeFile] = useState<File | null>(null);

  // Reset form state when component mounts or when user navigates to this page
  useEffect(() => {
    dispatch(resetForm());
    setResumeFile(null);
  }, [dispatch, router]);

  const handleFormChange = useCallback(
    (event: JsonFormsChangeEvent) => {
      dispatch(updateFormData(event.data));
    },
    [dispatch]
  );

  const handleSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      const hasVisa =
        formData.o1Visa ||
        formData.eb1aVisa ||
        formData.eb2NiwVisa ||
        formData.dontKnowVisa;

      if (
        !formData.firstName ||
        !formData.lastName ||
        !formData.email ||
        !formData.linkedin ||
        !formData.country ||
        !hasVisa
      ) {
        dispatch(
          setError(
            "Please fill in all required fields and select at least one visa category."
          )
        );
        return;
      }

      dispatch(setSubmitting(true));
      dispatch(setError(null));

      try {
        // Create FormData for file upload
        const formDataToSend = new FormData();

        // Add all form fields
        Object.keys(formData).forEach((key) => {
          formDataToSend.append(
            key,
            String(formData[key as keyof LeadFormData])
          );
        });

        // Add resume file if exists
        if (resumeFile) {
          formDataToSend.append("resume", resumeFile);
        }

        console.log("Submitting form with resume file:", resumeFile);
        const response = await submitLeadForm(formDataToSend);
        dispatch(setSubmitted(true));
      } catch (err) {
        if (err instanceof ApiError) {
          dispatch(setError(err.message));
        } else {
          dispatch(setError("Submission failed. Please try again."));
        }
        console.error("Form submission error:", err);
      } finally {
        dispatch(setSubmitting(false));
      }
    },
    [dispatch, formData]
  );

  return (
    <ClientOnly>
      {isSubmitted ? (
        <Page>
          <Header>
            <HeaderContent>
              <Brand>alma</Brand>
              <Heading>
                Get An Assessment
                <br />
                Of Your
                <br />
                Immigration Case
              </Heading>
            </HeaderContent>
          </Header>
          <Section>
            <Container>
              <Success>
                <DocumentIcon>
                  <DescriptionIcon />
                </DocumentIcon>
                <ThankYouTitle>Thank You</ThankYouTitle>
                <ThankYouMessage>
                  Your information was submitted to our team of immigration
                  attorneys. Expect an email from{" "}
                  <strong>hello@tryalma.ai</strong>.
                </ThankYouMessage>
                <HomeButton href="/">Go Back to Homepage</HomeButton>
              </Success>
            </Container>
          </Section>
        </Page>
      ) : (
        <Page>
          <Header>
            <HeaderContent>
              <Brand>alma</Brand>
              <Heading>
                Get An Assessment
                <br />
                Of Your
                <br />
                Immigration Case
              </Heading>
            </HeaderContent>
          </Header>

          <Section>
            <Container>
              {error && <Error>{error}</Error>}

              <form onSubmit={handleSubmit}>
                <FormHeader>
                  <Icon>📄</Icon>
                  <Title>Want to understand your visa options?</Title>
                </FormHeader>

                <Description>
                  Submit the form below and our team of experienced attorneys
                  will review your case and send a preliminary assessment based
                  on your goals.
                </Description>

                <StyledJsonForms>
                  <JsonForms
                    schema={leadFormSchema}
                    uischema={leadFormUISchema}
                    data={formData}
                    renderers={
                      materialRenderers as JsonFormsRendererRegistryEntry[]
                    }
                    cells={
                      materialCells as JsonFormsCellRendererRegistryEntry[]
                    }
                    onChange={handleFormChange}
                    validationMode="ValidateAndHide"
                  />

                  <CustomResumeUpload
                    value={formData.resume}
                    onChange={(value: string, file?: File) => {
                      dispatch(updateFormData({ resume: value }));
                      setResumeFile(file || null);
                    }}
                  />
                </StyledJsonForms>

                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Submitting..." : "Submit"}
                </Button>
              </form>
            </Container>
          </Section>
        </Page>
      )}
    </ClientOnly>
  );
};

export default LeadForm;
