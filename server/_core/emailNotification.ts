import { notifyOwner } from "./notification";

interface ContactFormData {
  email: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  company?: string;
  message?: string;
}

/**
 * Send contact form notification to owner via Manus Notification Service
 */
export async function sendContactNotificationEmails(
  contact: ContactFormData,
  source: "contact_form" | "roi_calculator" | "chatbot" = "contact_form"
): Promise<{
  success: boolean;
  error?: string;
}> {
  const fullName = `${contact.firstName || ""} ${contact.lastName || ""}`.trim() || "Visitor";

  const sourceLabel = {
    contact_form: "Contact Form Submission",
    roi_calculator: "ROI Calculator Usage",
    chatbot: "Chatbot Inquiry",
  }[source];

  const title = `[LAI] ${sourceLabel} from ${fullName}`;
  
  const content = `
Name: ${fullName}
Email: ${contact.email}
Phone: ${contact.phone || "Not provided"}
Company: ${contact.company || "Not provided"}

Message:
${contact.message || "No message provided"}
  `.trim();

  try {
    console.log(`[EmailNotification] Sending ${sourceLabel} notification`);
    const success = await notifyOwner({ title, content });

    if (!success) {
      console.error(`[EmailNotification] Failed to send ${sourceLabel} notification`);
      return {
        success: false,
        error: "Failed to send notification",
      };
    }

    console.log(`[EmailNotification] ${sourceLabel} notification sent successfully`);
    return { success: true };
  } catch (error) {
    console.error(`[EmailNotification] Error sending ${sourceLabel}:`, error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}
