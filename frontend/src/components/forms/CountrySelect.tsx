import { Country, sortedCountries } from "@/lib/countries";
import { Autocomplete, TextField } from "@mui/material";
import React, { useCallback, useMemo } from "react";

interface CountrySelectProps {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  required?: boolean;
  error?: boolean;
  disabled?: boolean;
}

const CountrySelect: React.FC<CountrySelectProps> = ({
  value,
  onChange,
  label = "Country of Citizenship",
  required = false,
  error = false,
  disabled = false,
}) => {
  // Memoize the selected country to prevent unnecessary re-renders
  const selectedCountry = useMemo(() => {
    // Always return null for falsy values to maintain controlled state
    if (!value || value.trim() === "") {
      return null;
    }
    return sortedCountries.find(country => country.name === value) || null;
  }, [value]);

  const handleChange = (_: React.SyntheticEvent, newValue: Country | null) => {
    onChange(newValue?.name || "");
  };

  return (
    <Autocomplete
      options={sortedCountries}
      getOptionLabel={option => option.name}
      value={selectedCountry}
      onChange={handleChange}
      renderInput={params => (
        <TextField
          {...params}
          label={label}
          required={required}
          error={error}
          disabled={disabled}
          variant="outlined"
          fullWidth
        />
      )}
      isOptionEqualToValue={(option, value) => option.name === value.name}
      filterOptions={(options, { inputValue }) => {
        const filtered = options.filter(option =>
          option.name.toLowerCase().includes(inputValue.toLowerCase())
        );
        return filtered;
      }}
      noOptionsText="No countries found"
      loadingText="Loading countries..."
      clearOnBlur={false}
      selectOnFocus
      clearOnEscape
      openOnFocus
    />
  );
};

export default CountrySelect;
