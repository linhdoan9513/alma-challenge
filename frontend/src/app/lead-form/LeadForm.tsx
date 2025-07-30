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
import {
  Casino as CasinoIcon,
  Description as DescriptionIcon,
} from "@mui/icons-material";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";
import CountrySelect from "../../components/CountrySelect";
import CustomResumeUpload from "../../components/CustomResumeUpload";
import {
  leadFormUISchema1,
  leadFormUISchema3,
  personalInfoSchema,
  textareaSchema,
} from "../../components/LeadFormConfig";
import VisaCheckboxes from "../../components/VisaCheckboxes";

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
  background: #d9dea6;
  display: flex;
  align-items: center;
  min-height: 150px;
  padding: 1rem;
  position: relative;
  overflow: hidden;

  @media (min-width: 768px) {
    padding: 3rem 2rem;
    min-height: 250px;
  }

  @media (min-width: 1024px) {
    padding: 4rem 2rem;
    min-height: 350px;
  }
`;

const HeaderContent = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  position: relative;
  z-index: 2;
  padding-left: 120px;

  @media (min-width: 768px) {
    padding-left: 250px;
  }

  @media (min-width: 1024px) {
    padding-left: 300px;
  }
`;

const Brand = styled.div`
  font-size: 1.25rem;
  font-weight: 600;
  color: black;
  margin-bottom: 0.5rem;

  @media (min-width: 768px) {
    font-size: 1.5rem;
  }
`;

const CircularShapes = styled.img`
  position: absolute;
  left: 0;
  top: 0;
  width: 100px;
  height: 100%;
  object-fit: cover;
  z-index: 1;

  @media (min-width: 768px) {
    width: 200px;
    height: 250px;
    top: 50%;
    transform: translateY(-50%);
  }

  @media (min-width: 1024px) {
    width: 250px;
    height: 350px;
  }
`;

const Heading = styled.h1`
  font-size: 1.5rem;
  font-weight: 700;
  color: black;
  text-align: left;
  margin: 0;
  line-height: 1.2;

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
  padding: 1.5rem 0.5rem;
  width: 100%;

  @media (min-width: 768px) {
    padding: 3rem 2rem;
  }

  @media (min-width: 1024px) {
    padding: 4rem 2rem;
  }
`;

const Container = styled.div`
  max-width: 600px;
  margin: 0 auto;
  text-align: center;
  padding: 0 0.5rem;
  width: 100%;

  @media (min-width: 768px) {
    padding: 0 1rem;
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
  background: linear-gradient(135deg, #e6e6fa 0%, #d8bfd8 100%);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 12px rgba(230, 230, 250, 0.3);
  font-size: 1.5rem;
  color: #6a5acd;
`;

const Title = styled.h2`
  font-size: 1.1rem;
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
  color: black;
  margin: 0;
`;

const ThankYouMessage = styled.p`
  color: black;
  font-size: 1rem;
  line-height: 1.5;
  margin: 0;
  text-align: center;
  font-weight: 600;
`;

const HomeButton = styled(Link)`
  background: black;
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

  const handleChange = useCallback(
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

      // Validate LinkedIn URL format
      const linkedinUrl = formData.linkedin.trim();
      const urlPattern = /^https?:\/\/.+/;

      if (!urlPattern.test(linkedinUrl)) {
        dispatch(
          setError(
            "Please provide a valid LinkedIn or website URL starting with http:// or https://"
          )
        );
        return;
      }

      try {
        new URL(linkedinUrl);
      } catch {
        dispatch(setError("Please provide a valid LinkedIn or website URL"));
        return;
      }

      dispatch(setSubmitting(true));
      dispatch(setError(null));

      try {
        // Create FormData for file upload
        const formDataToSend = new FormData();

        // Add all form fields
        Object.keys(formData).forEach(key => {
          formDataToSend.append(
            key,
            String(formData[key as keyof LeadFormData])
          );
        });

        // Add resume file if exists
        if (resumeFile) {
          formDataToSend.append("resume", resumeFile);
        }
        const response = await submitLeadForm(formDataToSend);
        dispatch(setSubmitted(true));
      } catch (err) {
        if (err instanceof ApiError) {
          // Handle specific API errors with user-friendly messages
          if (
            err.message.includes("LinkedIn") ||
            err.message.includes("website URL")
          ) {
            dispatch(
              setError(
                "Please provide a valid LinkedIn or website URL starting with http:// or https://"
              )
            );
          } else {
            dispatch(setError(err.message));
          }
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
            <CircularShapes src="/circular-shapes.png" alt="Circular shapes" />
            <HeaderContent>
              <Brand>alma</Brand>
              <Heading>
                Get An Assessment
                <br />
                Of Your Immigration Case
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
            <CircularShapes src="/circular-shapes.png" alt="Circular shapes" />
            <HeaderContent>
              <Brand>alma</Brand>
              <Heading>
                Get An Assessment
                <br />
                Of Your Immigration Case
              </Heading>
            </HeaderContent>
          </Header>

          <Section>
            <Container>
              {error && <Error>{error}</Error>}

              <form onSubmit={handleSubmit}>
                <FormHeader>
                  <Icon>
                    <DescriptionIcon />
                  </Icon>
                  <Title>Want to understand your visa options?</Title>
                </FormHeader>

                <Description>
                  Submit the form below and our team of experienced attorneys
                  will review your case and send a preliminary assessment based
                  on your goals.
                </Description>

                <StyledJsonForms>
                  <JsonForms
                    schema={personalInfoSchema}
                    uischema={leadFormUISchema1}
                    data={formData}
                    renderers={
                      materialRenderers as JsonFormsRendererRegistryEntry[]
                    }
                    cells={
                      materialCells as JsonFormsCellRendererRegistryEntry[]
                    }
                    onChange={handleChange}
                    validationMode="ValidateAndHide"
                  />
                </StyledJsonForms>
                <div
                  style={{
                    marginBottom: "1.5rem",
                    width: "100%",
                    maxWidth: "500px",
                    margin: "0 auto 1.5rem auto",
                  }}
                >
                  <CountrySelect
                    value={formData.country}
                    onChange={value => {
                      dispatch(updateFormData({ country: value }));
                    }}
                    label="Country of Citizenship"
                    required={true}
                    error={false}
                    disabled={false}
                  />
                </div>
                <FormHeader>
                  <Icon>
                    <CasinoIcon />
                  </Icon>
                  <Title>Visa categories of interest?</Title>
                </FormHeader>
                <div
                  style={{
                    marginBottom: "1.5rem",
                    width: "100%",
                    maxWidth: "500px",
                    margin: "0 auto 1.5rem auto",
                  }}
                >
                  <VisaCheckboxes
                    formData={formData}
                    onUpdate={updates => {
                      dispatch(updateFormData(updates));
                    }}
                  />
                </div>
                <FormHeader>
                  <Icon>💬</Icon>
                  <Title>How can we help you ?</Title>
                </FormHeader>

                <StyledJsonForms>
                  <JsonForms
                    schema={textareaSchema}
                    uischema={leadFormUISchema3}
                    data={formData}
                    renderers={
                      materialRenderers as JsonFormsRendererRegistryEntry[]
                    }
                    cells={
                      materialCells as JsonFormsCellRendererRegistryEntry[]
                    }
                    onChange={handleChange}
                    validationMode="ValidateAndHide"
                  />
                </StyledJsonForms>
                <CustomResumeUpload
                  value={formData.resume}
                  onChange={(value: string, file?: File) => {
                    dispatch(updateFormData({ resume: value }));
                    setResumeFile(file || null);
                  }}
                />
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
