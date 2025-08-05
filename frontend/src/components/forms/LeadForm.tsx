"use client";

import { submitLeadForm } from "../../lib/api";
import {
  LeadFormData,
  resetForm,
  setSubmitted,
  setSubmitting,
  updateFormData,
} from "../../store/leadSlice";
import { RootState } from "../../store/store";
import { JsonFormsRendererRegistryEntry } from "@jsonforms/core";
import { materialRenderers } from "@jsonforms/material-renderers";
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
import CountrySelect from "./CountrySelect";
import CustomResumeUpload from "./CustomResumeUpload";
import VisaCheckboxes from "./VisaCheckboxes";
import {
  personalInfoSchema,
  textareaSchema,
} from "./LeadFormConfig";

/* Layout */
const Page = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
`;

const Header = styled.header`
  background: var(--header-bg);
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
  color: var(--text-primary);
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
  color: var(--text-primary);
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
  background: var(--background);
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
  color: var(--icon-color);
`;

const Title = styled.h2`
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0;
  text-align: center;

  @media (min-width: 768px) {
    font-size: 1.5rem;
  }
`;

const Description = styled.p`
  color: var(--text-primary);
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

  .MuiTextField-root,
  .MuiFormControl-root {
    margin-bottom: 1.5rem;
    width: 100% !important;
    min-width: 100% !important;
  }

  /* Remove any close/clear buttons from form controls */
  button[aria-label*="clear"],
  button[aria-label*="Clear"],
  button[aria-label*="close"],
  button[aria-label*="Close"] {
    display: none !important;
  }

  textarea.MuiInputBase-input {
    min-height: 120px;
    padding: 1rem;
    font-size: 1rem;
    border-radius: 8px;
    background-color: var(--background);
    color: var(--primary-color);
    resize: vertical;
    line-height: 1.5;
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
`;

const Button = styled.button`
  width: 100%;
  max-width: 500px;
  padding: 1rem 2rem;
  margin-top: 2rem;
  background: var(--text-primary);
  color: var(--background);
  font-weight: 600;
  font-size: 1.1rem;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

  &:hover {
    background: var(--grey-600);
    transform: translateY(-1px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
  }

  &:active {
    transform: translateY(0);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }

  &:disabled {
    background: var(--grey-400);
    cursor: not-allowed;
    transform: none;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }
`;

const Error = styled.div`
  background: var(--grey-100);
  color: var(--primary-color);
  border: 1px solid var(--grey-300);
  border-radius: 8px;
  padding: 1rem;
  margin-bottom: 1rem;
`;

const Success = styled.div`
  text-align: center;
  background: var(--background);
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
  background: linear-gradient(
    135deg,
    var(--secondary-color) 0%,
    var(--secondary-dark) 100%
  );
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--background);
  position: relative;
`;

const ThankYouTitle = styled.h2`
  font-size: 1.75rem;
  font-weight: 700;
  color: var(--text-primary);
  margin: 0;
`;

const ThankYouMessage = styled.p`
  color: var(--text-primary);
  font-size: 1rem;
  line-height: 1.5;
  margin: 0;
  text-align: center;
  font-weight: 600;
`;

const HomeButton = styled(Link)`
  background: var(--text-primary);
  color: var(--background);
  padding: 1rem 2rem;
  border-radius: 8px;
  font-weight: 600;
  transition: background-color 0.2s;
  min-width: 400px;
  text-decoration: none;

  &:hover {
    background: var(--grey-600);
    transform: translateY(-1px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
  }

  &:active {
    transform: translateY(0);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }
`;

interface JsonFormsChangeEvent {
  data: LeadFormData;
  errors?: unknown[];
}

const LeadForm: React.FC = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const { formData, isSubmitting, isSubmitted } = useSelector(
    (state: RootState) => state.lead
  );
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [showValidationErrors, setShowValidationErrors] = useState(false);

  // Dynamic UI schemas that show errors only when needed
  const personalInfoUISchema = {
    type: "VerticalLayout" as const,
    elements: [
      {
        type: "Control" as const,
        scope: "#/properties/firstName",
        options: {
          trim: true,
          showUnfocusedDescription: false,
          showErrors: showValidationErrors,
        },
      },
      {
        type: "Control" as const,
        scope: "#/properties/lastName",
        options: {
          trim: true,
          showUnfocusedDescription: false,
          showErrors: showValidationErrors,
        },
      },
      {
        type: "Control" as const,
        scope: "#/properties/email",
        options: {
          trim: true,
          showUnfocusedDescription: false,
          showErrors: showValidationErrors,
        },
      },
      {
        type: "Control" as const,
        scope: "#/properties/linkedin",
        options: {
          trim: true,
          showUnfocusedDescription: false,
          showErrors: showValidationErrors,
        },
      },
    ],
  };

  const textareaUISchema = {
    type: "VerticalLayout" as const,
    elements: [
      {
        type: "Control" as const,
        scope: "#/properties/openInput",
        options: {
          multi: true,
          showUnfocusedDescription: false,
          showErrors: showValidationErrors,
        },
      },
    ],
  };

  useEffect(() => {
    dispatch(resetForm());
    setResumeFile(null);
    setShowValidationErrors(false);
  }, [dispatch, router]);

  const handleChange = useCallback(
    (event: JsonFormsChangeEvent) => {
      const incomingData = event.data;

      const hasPersonalInfo =
        "firstName" in incomingData ||
        "lastName" in incomingData ||
        "email" in incomingData ||
        "linkedin" in incomingData;

      const hasTextarea = "openInput" in incomingData;

      let updateData = { ...incomingData };

      if (hasPersonalInfo) {
        const personalFields = ["firstName", "lastName", "email", "linkedin"];
        personalFields.forEach(field => {
          if (!(field in incomingData)) {
            (updateData as any)[field] = "";
          }
        });
      }

      if (hasTextarea && !("openInput" in incomingData)) {
        updateData.openInput = "";
      }

      // Hide validation errors when user starts making changes
      if (showValidationErrors) {
        setShowValidationErrors(false);
      }

      dispatch(updateFormData(updateData));
    },
    [dispatch, showValidationErrors]
  );

  const handleSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      // Check for missing required fields
      const missingFields: string[] = [];

      if (!formData.firstName?.trim()) {
        missingFields.push("First Name");
      }

      if (!formData.lastName?.trim()) {
        missingFields.push("Last Name");
      }

      if (!formData.email?.trim()) {
        missingFields.push("Email");
      }

      if (!formData.linkedin?.trim()) {
        missingFields.push("LinkedIn / Personal Website URL");
      }

      if (!formData.country?.trim()) {
        missingFields.push("Country of Citizenship");
      }

      const hasVisa =
        formData.o1Visa ||
        formData.eb1aVisa ||
        formData.eb2NiwVisa ||
        formData.dontKnowVisa;

      if (!hasVisa) {
        missingFields.push("Visa Category (at least one must be selected)");
      }

      if (missingFields.length > 0) {
        setShowValidationErrors(true);
        return;
      }

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email.trim())) {
        setShowValidationErrors(true);
        return;
      }

      // Validate LinkedIn URL
      const linkedinUrl = formData.linkedin.trim();
      const urlPattern = /^https?:\/\/.+/;

      if (!urlPattern.test(linkedinUrl)) {
        setShowValidationErrors(true);
        return;
      }

      try {
        new URL(linkedinUrl);
      } catch {
        setShowValidationErrors(true);
        return;
      }

      dispatch(setSubmitting(true));

      try {
        const formDataToSend = new FormData();
        Object.keys(formData).forEach(key => {
          formDataToSend.append(
            key,
            String(formData[key as keyof LeadFormData])
          );
        });

        if (resumeFile) {
          formDataToSend.append("resume", resumeFile);
        }

        await submitLeadForm(formDataToSend);
        dispatch(setSubmitted(true));
      } catch (err) {
        console.error("Form submission error:", err);
        // For now, just log the error without showing text messages
      } finally {
        dispatch(setSubmitting(false));
      }
    },
    [dispatch, formData]
  );

  return (
    <>
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
                  attorneys. Expect an email from
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
                    uischema={personalInfoUISchema}
                    data={formData}
                    renderers={
                      materialRenderers as JsonFormsRendererRegistryEntry[]
                    }
                    onChange={handleChange}
                    validationMode={
                      showValidationErrors
                        ? "ValidateAndShow"
                        : "ValidateAndHide"
                    }
                  />
                  <CountrySelect
                    value={formData.country}
                    onChange={value => {
                      if (showValidationErrors) {
                        setShowValidationErrors(false);
                      }
                      dispatch(updateFormData({ country: value }));
                    }}
                    label="Country of Citizenship"
                    required={true}
                    error={showValidationErrors && !formData.country?.trim()}
                    disabled={false}
                  />
                  <FormHeader>
                    <Icon>
                      <CasinoIcon />
                    </Icon>
                    <Title>Visa categories of interest?</Title>
                  </FormHeader>
                  <VisaCheckboxes
                    formData={formData}
                    onUpdate={updates => {
                      if (showValidationErrors) {
                        setShowValidationErrors(false);
                      }
                      dispatch(updateFormData(updates));
                    }}
                    error={showValidationErrors}
                  />
                  <FormHeader>
                    <Icon>💬</Icon>
                    <Title>How can we help you ?</Title>
                  </FormHeader>

                  <JsonForms
                    schema={textareaSchema}
                    uischema={textareaUISchema}
                    data={formData}
                    renderers={
                      materialRenderers as JsonFormsRendererRegistryEntry[]
                    }
                    onChange={handleChange}
                    validationMode={
                      showValidationErrors
                        ? "ValidateAndShow"
                        : "ValidateAndHide"
                    }
                  />
                  <CustomResumeUpload
                    value={formData.resume}
                    onChange={(value: string, file?: File) => {
                      if (showValidationErrors) {
                        setShowValidationErrors(false);
                      }
                      dispatch(updateFormData({ resume: value }));
                      setResumeFile(file || null);
                    }}
                  />
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? "Submitting..." : "Submit"}
                  </Button>
                </StyledJsonForms>
              </form>
            </Container>
          </Section>
        </Page>
      )}
    </>
  );
};

export default LeadForm;
