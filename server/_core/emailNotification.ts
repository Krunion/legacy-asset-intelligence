import { sendViaWebhook } from "./webhookEmailService";

interface ContactFormData {
  email: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  company?: string;
  message?: string;
}

/**
 * Send contact form notification via webhook service
 */
export async function sendContactNotificationEmails(
  contact: ContactFormData,
  source: "contact_form" | "roi_calculator" | "chatbot" = "contact_form"
): Promise<{
  success: boolean;
  error?: string;
}> {
  const sourceLabel = {
    contact_form: "Contact Form Submission",
    roi_calculator: "ROI Calculator Usage",
    chatbot: "Chatbot Inquiry",
  }[source];

  try {
    console.log(`[EmailNotification] Sending ${sourceLabel} via webhook`);

    const result = await sendViaWebhook({
      firstName: contact.firstName,
      lastName: contact.lastName,
      email: contact.email,
      phone: contact.phone,
      company: contact.company,
      message: contact.message,
      source,
    });

    if (!result.success) {
      console.error(`[EmailNotification] Failed to send ${sourceLabel}:`, result.error);
      return {
        success: false,
        error: result.error,
      };
    }

    console.log(`[EmailNotification] ${sourceLabel} sent successfully via webhook`);
    return { success: true };
  } catch (error) {
    console.error(`[EmailNotification] Error sending ${sourceLabel}:`, error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}
