import { ENV } from "./env";

interface HubSpotContact {
  email: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  company?: string;
  message?: string;
  [key: string]: string | undefined;
}

/**
 * Submit a lead to HubSpot via the Contacts API
 * Creates or updates a contact and optionally associates it with a deal
 */
export async function submitLeadToHubSpot(contact: HubSpotContact): Promise<{
  success: boolean;
  contactId?: string;
  error?: string;
}> {
  if (!ENV.hubspotApiKey) {
    console.warn("[HubSpot] API key not configured");
    return { success: false, error: "HubSpot API key not configured" };
  }

  if (!contact.email) {
    console.warn("[HubSpot] Email is required for lead submission");
    return { success: false, error: "Email is required" };
  }

  try {
    console.log(`[HubSpot] Submitting lead for ${contact.email}`);
    
    // Build properties object for HubSpot
    const properties: Record<string, string> = {
      email: contact.email,
    };

    if (contact.firstName) properties.firstname = contact.firstName;
    if (contact.lastName) properties.lastname = contact.lastName;
    if (contact.phone) properties.phone = contact.phone;
    if (contact.company) properties.company = contact.company;
    if (contact.message) properties.message = contact.message;

    // Create or update contact via HubSpot API
    const response = await fetch("https://api.hubapi.com/crm/v3/objects/contacts", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${ENV.hubspotApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        properties,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error(`[HubSpot] API error for ${contact.email}:`, {
        status: response.status,
        error: errorData,
      });
      return {
        success: false,
        error: `HubSpot API error: ${response.status}`,
      };
    }

    const data = await response.json();
    console.log(`[HubSpot] Lead submitted successfully for ${contact.email}`, {
      contactId: data.id,
    });
    return {
      success: true,
      contactId: data.id,
    };
  } catch (error) {
    console.error(`[HubSpot] Failed to submit lead for ${contact.email}:`, error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

/**
 * Validate HubSpot API key by making a test request
 */
export async function validateHubSpotApiKey(apiKey: string): Promise<boolean> {
  try {
    console.log("[HubSpot] Validating API key");
    const response = await fetch("https://api.hubapi.com/crm/v3/objects/contacts?limit=1", {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
      },
    });

    if (response.ok) {
      console.log("[HubSpot] API key validation successful");
    } else {
      console.warn(`[HubSpot] API key validation failed with status ${response.status}`);
    }
    return response.ok;
  } catch (error) {
    console.error("[HubSpot] Validation failed:", error);
    return false;
  }
}
