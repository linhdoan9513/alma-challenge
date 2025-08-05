import { ControlProps } from "@jsonforms/core";
import { withJsonFormsControlProps } from "@jsonforms/react";
import React from "react";
import CountrySelect from "./CountrySelect";

const CountrySelectRenderer: React.FC<ControlProps> = ({
  data,
  handleChange,
  path,
  label,
  required,
  errors,
  enabled,
  visible,
}) => {
  if (!visible) {
    return null;
  }

  const handleCountryChange = (value: string) => {
    handleChange(path, value);
  };

  return (
    <CountrySelect
      value={data || ""}
      onChange={handleCountryChange}
      label={label}
      required={required}
      error={errors ? errors.length > 0 : false}
      disabled={!enabled}
    />
  );
};

export default withJsonFormsControlProps(CountrySelectRenderer);
