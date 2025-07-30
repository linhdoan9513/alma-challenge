import { Country, sortedCountries } from "../countries";

describe("countries utility", () => {
  describe("sortedCountries", () => {
    it("should be an array", () => {
      expect(Array.isArray(sortedCountries)).toBe(true);
    });

    it("should contain country objects with name and code properties", () => {
      expect(sortedCountries.length).toBeGreaterThan(0);

      sortedCountries.forEach(country => {
        expect(country).toHaveProperty("name");
        expect(country).toHaveProperty("code");
        expect(typeof country.name).toBe("string");
        expect(typeof country.code).toBe("string");
      });
    });

    it("should be sorted alphabetically by name", () => {
      for (let i = 1; i < sortedCountries.length; i++) {
        const prevCountry = sortedCountries[i - 1];
        const currentCountry = sortedCountries[i];
        expect(
          prevCountry.name.localeCompare(currentCountry.name)
        ).toBeLessThanOrEqual(0);
      }
    });

    it("should contain common countries", () => {
      const countryNames = sortedCountries.map(country => country.name);

      expect(countryNames).toContain("United States");
      expect(countryNames).toContain("Canada");
      expect(countryNames).toContain("United Kingdom");
      expect(countryNames).toContain("Germany");
      expect(countryNames).toContain("France");
    });

    it("should have unique country names", () => {
      const countryNames = sortedCountries.map(country => country.name);
      const uniqueNames = new Set(countryNames);

      expect(uniqueNames.size).toBe(countryNames.length);
    });

    it("should have unique country codes", () => {
      const countryCodes = sortedCountries.map(country => country.code);
      const uniqueCodes = new Set(countryCodes);

      expect(uniqueCodes.size).toBe(countryCodes.length);
    });

    it("should have valid ISO country codes", () => {
      sortedCountries.forEach(country => {
        expect(country.code).toMatch(/^[A-Z]{2}$/);
      });
    });

    it("should not contain empty names or codes", () => {
      sortedCountries.forEach(country => {
        expect(country.name.trim()).toBeTruthy();
        expect(country.code.trim()).toBeTruthy();
      });
    });
  });

  describe("Country interface", () => {
    it("should match the expected structure", () => {
      const sampleCountry: Country = {
        name: "Test Country",
        code: "TC",
      };

      expect(sampleCountry).toHaveProperty("name");
      expect(sampleCountry).toHaveProperty("code");
      expect(typeof sampleCountry.name).toBe("string");
      expect(typeof sampleCountry.code).toBe("string");
    });
  });

  describe("data integrity", () => {
    it("should have reasonable number of countries", () => {
      // Should have at least 50 countries but not more than 300
      expect(sortedCountries.length).toBeGreaterThan(50);
      expect(sortedCountries.length).toBeLessThan(300);
    });

    it("should start with countries beginning with A", () => {
      const firstCountry = sortedCountries[0];
      expect(firstCountry.name.charAt(0)).toBe("A");
    });

    it("should end with countries beginning with Z or similar", () => {
      const lastCountry = sortedCountries[sortedCountries.length - 1];
      const lastChar = lastCountry.name.charAt(0).toUpperCase();
      expect(["Z", "Y", "W", "V"]).toContain(lastChar);
    });
  });
});
