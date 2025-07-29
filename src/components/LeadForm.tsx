'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { JsonForms } from '@jsonforms/react';
import {
  materialRenderers,
  materialCells,
} from '@jsonforms/material-renderers';
import {
  JsonFormsCellRendererRegistryEntry,
  JsonFormsRendererRegistryEntry,
} from '@jsonforms/core';
import styled from 'styled-components';
import { RootState } from '@/store/store';
import {
  updateFormData,
  setSubmitting,
  setSubmitted,
  setError,
  LeadFormData,
} from '@/store/leadSlice';
import { leadFormSchema, leadFormUISchema } from './LeadFormConfig';
import { submitLeadForm, ApiError } from '@/lib/api';
import Link from 'next/link';
import { Description as DescriptionIcon } from '@mui/icons-material';

// Client-only wrapper to prevent hydration mismatches
const ClientOnly: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div style={{ minHeight: '400px' }} />; // Placeholder to prevent layout shift
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
  background: #e8f0d7 url('/header-background.jpg') no-repeat left center;
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
  color: #333;
  text-transform: lowercase;
`;

const Heading = styled.h1`
  font-size: 1.75rem;
  font-weight: 700;
  color: #333;
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
`;

/* Form Elements */
const FormHeader = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
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
`;

const Title = styled.h2`
  font-size: 1.25rem;
  font-weight: 600;
  color: #333;

  @media (min-width: 768px) {
    font-size: 1.5rem;
  }
`;

const Description = styled.p`
  color: #666;
  margin-bottom: 2rem;
  line-height: 1.6;
`;

const StyledJsonForms = styled.div`
  width: 100%;
  max-width: 500px;
  margin: 0 auto;

  /* ✅ Visa checkboxes */
  .MuiFormGroup-root {
    flex-direction: column !important;
    align-items: flex-start !important;
    margin-left: 0 !important;
  }

  .MuiFormControlLabel-root {
    justify-content: flex-start !important;
    width: 100% !important;
    margin: 0.25rem 0 !important;
  }

  .MuiFormControlLabel-label {
    font-weight: 500;
    color: #111;
  }

  .MuiCheckbox-root {
    padding: 4px;
    margin: 0;
  }

  textarea.MuiInputBase-input {
    min-height: 120px;
    padding: 1rem;
    font-size: 1rem;
    border-radius: 12px;
    border: 1px solid #ddd;
    background-color: white;
    color: #333;
    resize: vertical;
    line-height: 1.5;
  }
`;

const Button = styled.button`
  width: 100%;
  padding: 1rem 2rem;
  margin-top: 2rem;
  background: #333;
  color: white;
  font-weight: 600;
  font-size: 1.1rem;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background: #555;
  }

  &:disabled {
    background: #ccc;
    cursor: not-allowed;
  }
`;

const Error = styled.div`
  background: #f8f9fa;
  color: #333;
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
  color: #333;
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
  color: #333;
  margin: 0;
`;

const ThankYouMessage = styled.p`
  color: #333;
  font-size: 1rem;
  line-height: 1.5;
  margin: 0;
  text-align: center;
  font-weight: 600;
`;

const HomeButton = styled(Link)`
  background: #333;
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
  const { formData, isSubmitting, isSubmitted, error } = useSelector(
    (state: RootState) => state.lead
  );

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
            'Please fill in all required fields and select at least one visa category.'
          )
        );
        return;
      }

      dispatch(setSubmitting(true));
      dispatch(setError(null));

      try {
        const response = await submitLeadForm(formData);
        console.log('Form submitted successfully:', response);
        dispatch(setSubmitted(true));
      } catch (err) {
        if (err instanceof ApiError) {
          dispatch(setError(err.message));
        } else {
          dispatch(setError('Submission failed. Please try again.'));
        }
        console.error('Form submission error:', err);
      } finally {
        dispatch(setSubmitting(false));
      }
    },
    [dispatch, formData]
  );

  if (isSubmitted) {
    return (
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
                attorneys. Expect an email from{' '}
                <strong>hello@tryalma.ai</strong>.
              </ThankYouMessage>
              <HomeButton href='/'>Go Back to Homepage</HomeButton>
            </Success>
          </Container>
        </Section>
      </Page>
    );
  }

  return (
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
              Submit the form below and our team of experienced attorneys will
              review your case and send a preliminary assessment based on your
              goals.
            </Description>

            <StyledJsonForms>
              <ClientOnly>
                <JsonForms
                  schema={leadFormSchema}
                  uischema={leadFormUISchema}
                  data={formData}
                  renderers={
                    materialRenderers as JsonFormsRendererRegistryEntry[]
                  }
                  cells={materialCells as JsonFormsCellRendererRegistryEntry[]}
                  onChange={handleFormChange}
                />
              </ClientOnly>
            </StyledJsonForms>

            <Button type='submit' disabled={isSubmitting}>
              {isSubmitting ? 'Submitting...' : 'Submit'}
            </Button>
          </form>
        </Container>
      </Section>
    </Page>
  );
};

export default LeadForm;
