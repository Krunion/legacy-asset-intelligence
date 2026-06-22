/**
 * Webhook-based email service using Make.com (formerly Integromat)
 * This sends contact form data to a webhook that handles email delivery
 */

interface WebhookPayload {
  firstName?: string;
  lastName?: string;
  email: string;
  phone?: string;
  company?: string;
  message?: string;
  source: "contact_form" | "roi_calculator" | "chatbot";
}

export async function sendViaWebhook(payload: WebhookPayload): Promise<{
  success: boolean;
  error?: string;
}> {
  const webhookUrl = process.env.CONTACT_WEBHOOK_URL;

  if (!webhookUrl) {
    console.warn("[WebhookEmail] CONTACT_WEBHOOK_URL not configured");
    return {
      success: false,
      error: "Webhook URL not configured",
    };
  }

  try {
    console.log("[WebhookEmail] Sending to webhook");

    // Make.com webhook URLs can have two formats:
    // 1. With credentials: https://user:pass@host/path
    // 2. Direct: https://host/path
    // We handle both formats
    let finalUrl = webhookUrl;
    
    // Check if URL has credentials format (contains @ before the domain)
    if (webhookUrl.includes("@")) {
      // Extract the base URL without credentials for the fetch
      // Format: https://user:pass@host/path -> https://host/path
      const urlObj = new URL(webhookUrl);
      finalUrl = `${urlObj.protocol}//${urlObj.host}${urlObj.pathname}${urlObj.search}`;
      
      // Extract credentials
      const credentials = urlObj.username ? `${urlObj.username}:${urlObj.password}` : null;
      
      console.log("[WebhookEmail] Extracted credentials from URL, converting to Basic Auth");
      
      const headers: HeadersInit = {
        "Content-Type": "application/json",
      };
      
      // Add Basic Auth header if credentials exist
      if (credentials) {
        const encoded = Buffer.from(credentials).toString("base64");
        headers["Authorization"] = `Basic ${encoded}`;
      }
      
      const response = await fetch(finalUrl, {
        method: "POST",
        headers,
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const error = await response.text();
        console.error("[WebhookEmail] Webhook failed:", response.status, error);
        return {
          success: false,
          error: `Webhook returned ${response.status}: ${error}`,
        };
      }

      console.log("[WebhookEmail] Successfully sent to webhook with Basic Auth");
      return { success: true };
    } else {
      // No credentials in URL, send directly to webhook
      const response = await fetch(finalUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const error = await response.text();
        console.error("[WebhookEmail] Webhook failed:", response.status, error);
        return {
          success: false,
          error: `Webhook returned ${response.status}: ${error}`,
        };
      }

      console.log("[WebhookEmail] Successfully sent to webhook directly");
      return { success: true };
    }
  } catch (error) {
    console.error("[WebhookEmail] Error sending to webhook:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}
