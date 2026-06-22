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

const WEBHOOK_URL = "https://hook.make.com/your-webhook-id"; // Will be configured via env

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
    console.log("[WebhookEmail] Sending to webhook:", webhookUrl);

    const response = await fetch(webhookUrl, {
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
        error: `Webhook returned ${response.status}`,
      };
    }

    console.log("[WebhookEmail] Successfully sent to webhook");
    return { success: true };
  } catch (error) {
    console.error("[WebhookEmail] Error sending to webhook:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}
