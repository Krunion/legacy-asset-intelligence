import { describe, expect, it } from "vitest";
import { validateHubSpotApiKey } from "./_core/hubspot";
import { ENV } from "./_core/env";

describe(
  "HubSpot Integration",
  () => {
    it(
      "validates a valid HubSpot API key",
      async () => {
        // Skip test if API key is not configured
        if (!ENV.hubspotApiKey) {
          console.warn("[Test] Skipping HubSpot validation: API key not configured");
          expect(true).toBe(true);
          return;
        }

        const isValid = await validateHubSpotApiKey(ENV.hubspotApiKey);
        expect(isValid).toBe(true);
      },
      { timeout: 15000 }
    );

    it(
      "rejects an invalid HubSpot API key",
      async () => {
        const isValid = await validateHubSpotApiKey("invalid-key-12345");
        expect(isValid).toBe(false);
      },
      { timeout: 15000 }
    );
  },
  { timeout: 15000 }
);
