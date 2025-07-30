import { ControlProps } from "@jsonforms/core";
import { withJsonFormsControlProps } from "@jsonforms/react";
import React from "react";
import styled from "styled-components";

interface FileUploadRendererProps extends ControlProps {
  data: string;
  handleChange: (path: string, value: string) => void;
}

const UploadButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  width: 100%;
  padding: 1rem;
  background-color: #f8f9fa;
  border: 2px dashed #dee2e6;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 0.875rem;
  color: #6c757d;

  &:hover {
    background-color: #e9ecef;
    border-color: #adb5bd;
  }

  &:focus {
    outline: none;
    border-color: #007bff;
    box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
  }
`;

const FileInput = styled.input`
  display: none;
`;

const CloudIcon = styled.span`
  font-size: 1.25rem;
  color: #6c757d;
`;

const FileInfo = styled.div`
  margin-top: 0.5rem;
  font-size: 0.75rem;
  color: #6c757d;
  text-align: center;
`;

const Container = styled.div`
  margin-bottom: 1rem;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
`;

const Description = styled.p`
  font-size: 0.875rem;
  color: #666;
  margin-bottom: 0.5rem;
`;

const ErrorMessage = styled.div`
  color: red;
  font-size: 0.75rem;
  margin-top: 0.25rem;
`;

const RequiredIndicator = styled.span`
  color: red;
`;

const FileUploadRenderer: React.FC<FileUploadRendererProps> = ({
  handleChange,
  path,
  label,
  description,
  errors,
  required,
}) => {
  const [selectedFile, setSelectedFile] = React.useState<File | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onload = e => {
        const result = e.target?.result as string;
        handleChange(path, result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <Container>
      <Label>
        {label}
        {required && <RequiredIndicator> *</RequiredIndicator>}
      </Label>
      {description && <Description>{description}</Description>}

      <UploadButton type="button" onClick={handleButtonClick}>
        <CloudIcon>☁️</CloudIcon>
        {selectedFile ? selectedFile.name : "Upload resume or CV"}
      </UploadButton>

      <FileInput
        ref={fileInputRef}
        type="file"
        accept=".pdf,.doc,.docx,.txt"
        onChange={handleFileChange}
      />

      <FileInfo>Max file size 5MB.</FileInfo>

      {errors && <ErrorMessage>{errors}</ErrorMessage>}
    </Container>
  );
};

export default withJsonFormsControlProps(FileUploadRenderer);
