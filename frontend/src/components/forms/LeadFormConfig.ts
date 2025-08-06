import { JsonSchema, UISchemaElement } from "@jsonforms/core";
import { countries } from "../../lib/countries";

// Separate schema for Personal Information
export const personalInfoSchema: JsonSchema = {
  type: "object",
  properties: {
    firstName: {
      type: "string",
      title: "First Name",
      minLength: 1,
      errorMessage: "First Name is required",
    },
    lastName: {
      type: "string",
      title: "Last Name",
      minLength: 1,
      errorMessage: "Last Name is required",
    },
    email: {
      type: "string",
      title: "Email",
      minLength: 1,
      format: "email",
      errorMessage: "Please provide a valid email address",
    },
    linkedin: {
      type: "string",
      title: "LinkedIn / Personal Website URL",
      minLength: 1,
      errorMessage: "LinkedIn / Personal Website URL is required",
    },
    country: {
      type: "string",
      title: "Country of Citizenship",
      errorMessage: "Country is required",
      enum: countries.map(country => country.name),
    },
  },
  required: ["firstName", "lastName", "email", "linkedin", "country"],
};

// Separate schema for Textarea
export const textareaSchema: JsonSchema = {
  type: "object",
  properties: {
    openInput: {
      type: "string",
      title: "How can we help you?",
      maxLength: 1000,
    },
  },
};

// UI Schemas
export const createPersonalInfoUISchema = (
  showValidationErrors: boolean
): UISchemaElement => ({
  type: "VerticalLayout",
  elements: [
    {
      type: "Control",
      scope: "#/properties/firstName",
      options: {
        trim: true,
        showUnfocusedDescription: false,
        showErrors: showValidationErrors,
      },
    },
    {
      type: "Control",
      scope: "#/properties/lastName",
      options: {
        trim: true,
        showUnfocusedDescription: false,
        showErrors: showValidationErrors,
      },
    },
    {
      type: "Control",
      scope: "#/properties/email",
      options: {
        trim: true,
        showUnfocusedDescription: false,
        showErrors: showValidationErrors,
      },
    },
    {
      type: "Control",
      scope: "#/properties/linkedin",
      options: {
        trim: true,
        showUnfocusedDescription: false,
        showErrors: showValidationErrors,
      },
    },
    {
      type: "Control",
      scope: "#/properties/country",
      options: {
        trim: true,
        showUnfocusedDescription: false,
        showErrors: showValidationErrors,
      },
    },
  ],
});

export const createTextareaUISchema = (
  showValidationErrors: boolean
): UISchemaElement => ({
  type: "VerticalLayout",
  elements: [
    {
      type: "Control",
      scope: "#/properties/openInput",
      options: {
        multi: true,
        showUnfocusedDescription: false,
        showErrors: showValidationErrors,
      },
    },
  ],
});
