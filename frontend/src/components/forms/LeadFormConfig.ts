import { JsonSchema, UISchemaElement } from "@jsonforms/core";

export const leadFormSchema: JsonSchema = {
  type: "object",
  properties: {
    firstName: {
      type: "string",
      title: "First Name",
      minLength: 1,
    },
    lastName: {
      type: "string",
      title: "Last Name",
      minLength: 1,
    },
    email: {
      type: "string",
      title: "Email",
      minLength: 1,
    },
    linkedin: {
      type: "string",
      title: "LinkedIn / Personal Website URL",
      minLength: 1,
    },
    country: {
      type: "string",
      title: "Country of Citizenship",
    },
    o1Visa: {
      type: "boolean",
      title: "O-1",
    },
    eb1aVisa: {
      type: "boolean",
      title: "EB-1A",
    },
    eb2NiwVisa: {
      type: "boolean",
      title: "EB-2 NIW",
    },
    dontKnowVisa: {
      type: "boolean",
      title: "I don't know",
    },

    openInput: {
      type: "string",
      title: "How can we help you?",
      maxLength: 1000,
    },
  },
  required: ["firstName", "lastName", "email", "linkedin", "country"],
};

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
  },
  required: ["firstName", "lastName", "email", "linkedin"],
};

// Separate schema for Visa Categories
export const visaSchema: JsonSchema = {
  type: "object",
  properties: {
    o1Visa: {
      type: "boolean",
      title: "O-1",
    },
    eb1aVisa: {
      type: "boolean",
      title: "EB-1A",
    },
    eb2NiwVisa: {
      type: "boolean",
      title: "EB-2 NIW",
    },
    dontKnowVisa: {
      type: "boolean",
      title: "I don't know",
    },
  },
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

// Keep the original UI schema for backward compatibility
export const leadFormUISchema: UISchemaElement = {
  type: "VerticalLayout",
  elements: [
    {
      type: "Control",
      scope: "#/properties/firstName",
      options: {
        trim: true,
        showUnfocusedDescription: false,
        showErrors: false,
      },
    },
    {
      type: "Control",
      scope: "#/properties/lastName",
      options: {
        trim: true,
        showUnfocusedDescription: false,
        showErrors: false,
      },
    },
    {
      type: "Control",
      scope: "#/properties/email",
      options: {
        trim: true,
        showUnfocusedDescription: false,
        showErrors: false,
      },
    },
    {
      type: "Control",
      scope: "#/properties/linkedin",
      options: {
        trim: true,
        showUnfocusedDescription: false,
        showErrors: false,
      },
    },
    {
      type: "Control",
      scope: "#/properties/country",
      options: {
        trim: true,
        showUnfocusedDescription: false,
        showErrors: false,
      },
    },
    {
      type: "Label",
      text: "Visa categories of interest?",
    },
    {
      type: "Control",
      scope: "#/properties/o1Visa",
    },
    {
      type: "Control",
      scope: "#/properties/eb1aVisa",
    },
    {
      type: "Control",
      scope: "#/properties/eb2NiwVisa",
    },
    {
      type: "Control",
      scope: "#/properties/dontKnowVisa",
    },

    {
      type: "Control",
      scope: "#/properties/openInput",
      // label: "How can we help you?",
      options: {
        multi: true, // for textarea
        showUnfocusedDescription: false,
        showErrors: false,
      },
    },
  ],
};
