import React, { useRef, useState } from "react";
import styled from "styled-components";

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

interface CustomResumeUploadProps {
  value?: string;
  onChange: (value: string, file?: File) => void;
  label?: string;
  description?: string;
  required?: boolean;
}

const CustomResumeUpload: React.FC<CustomResumeUploadProps> = ({
  value,
  onChange,
  label = "Resume/CV (Optional)",
  description = "Upload your resume or CV to help us better understand your background. Accepted formats: PDF, DOC, DOCX, TXT (max 5MB)",
  required = false,
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        onChange(result, file);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div style={{ marginBottom: "1rem" }}>
      <Label>
        {label}
        {required && <span style={{ color: "red" }}> *</span>}
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
    </div>
  );
};

export default CustomResumeUpload;
