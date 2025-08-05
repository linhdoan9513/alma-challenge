import { LeadFormData } from "@/store/leadSlice";
import { Checkbox, FormControlLabel, FormGroup } from "@mui/material";
import React from "react";
import styled from "styled-components";

const BlueCheckbox = styled(Checkbox)`
  &.Mui-checked {
    color: var(--checkbox-blue) !important;
  }
`;

const CheckboxContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin: 1rem 0;
`;

const ErrorText = styled.div`
  color: #d32f2f;
  font-size: 0.75rem;
  margin-top: 0.25rem;
  font-family: "Roboto", "Helvetica", "Arial", sans-serif;
`;

interface VisaCheckboxesProps {
  formData: LeadFormData;
  onUpdate: (updates: Partial<LeadFormData>) => void;
  error?: boolean;
}

const VisaCheckboxes: React.FC<VisaCheckboxesProps> = ({
  formData,
  onUpdate,
  error = false,
}) => {
  const handleCheckboxChange =
    (property: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
      if (event.target.checked) {
        // If this checkbox is being checked, uncheck all others
        const updates: Partial<LeadFormData> = {
          o1Visa: false,
          eb1aVisa: false,
          eb2NiwVisa: false,
          dontKnowVisa: false,
        };

        // Set the selected one to true
        switch (property) {
          case "o1Visa":
            updates.o1Visa = true;
            break;
          case "eb1aVisa":
            updates.eb1aVisa = true;
            break;
          case "eb2NiwVisa":
            updates.eb2NiwVisa = true;
            break;
          case "dontKnowVisa":
            updates.dontKnowVisa = true;
            break;
        }

        onUpdate(updates);
      } else {
        // If this checkbox is being unchecked, just update this one
        const updates: Partial<LeadFormData> = {};
        switch (property) {
          case "o1Visa":
            updates.o1Visa = false;
            break;
          case "eb1aVisa":
            updates.eb1aVisa = false;
            break;
          case "eb2NiwVisa":
            updates.eb2NiwVisa = false;
            break;
          case "dontKnowVisa":
            updates.dontKnowVisa = false;
            break;
        }
        onUpdate(updates);
      }
    };

  const visaOptions = [
    { key: "o1Visa", label: "O-1" },
    { key: "eb1aVisa", label: "EB-1A" },
    { key: "eb2NiwVisa", label: "EB-2 NIW" },
    { key: "dontKnowVisa", label: "I don't know" },
  ];

  const hasVisa =
    formData.o1Visa ||
    formData.eb1aVisa ||
    formData.eb2NiwVisa ||
    formData.dontKnowVisa;

  return (
    <CheckboxContainer>
      <FormGroup>
        {visaOptions.map(option => (
          <FormControlLabel
            key={option.key}
            control={
              <BlueCheckbox
                checked={Boolean(formData[option.key as keyof LeadFormData])}
                onChange={handleCheckboxChange(option.key)}
              />
            }
            label={option.label}
          />
        ))}
      </FormGroup>
      {error && !hasVisa && (
        <ErrorText>Please select at least one visa category</ErrorText>
      )}
    </CheckboxContainer>
  );
};

export default VisaCheckboxes;
