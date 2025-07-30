import { LeadFormData } from "@/store/leadSlice";
import { Checkbox, FormControlLabel, FormGroup } from "@mui/material";
import React from "react";
import styled from "styled-components";

const CheckboxContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin: 1rem 0;
`;

interface VisaCheckboxesProps {
  formData: LeadFormData;
  onUpdate: (updates: Partial<LeadFormData>) => void;
}

const VisaCheckboxes: React.FC<VisaCheckboxesProps> = ({
  formData,
  onUpdate,
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

  return (
    <CheckboxContainer>
      <FormGroup>
        {visaOptions.map(option => (
          <FormControlLabel
            key={option.key}
            control={
              <Checkbox
                checked={Boolean(formData[option.key as keyof LeadFormData])}
                onChange={handleCheckboxChange(option.key)}
                color="primary"
              />
            }
            label={option.label}
          />
        ))}
      </FormGroup>
    </CheckboxContainer>
  );
};

export default VisaCheckboxes;
