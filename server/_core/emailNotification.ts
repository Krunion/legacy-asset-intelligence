import { sendEmailViaMicrosoft365, formatContactEmailBody } from "./microsoftEmailService";

interface ContactFormData {
  email: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  company?: string;
  message?: string;
}

const RECIPIENTS = [
  { name: "Kevin Runion", email: "Kevin.Runion@legacyassetintelligence.com" },
  { name: "Chris Haynes", email: "Chris.Haynes@legacyassetintelligence.com" },
];

/**
 * Send contact form notification emails to both team members via Microsoft 365
 */
export async function sendContactNotificationEmails(
  contact: ContactFormData,
  source: "contact_form" | "roi_calculator" | "chatbot" = "contact_form"
): Promise<{
  success: boolean;
  error?: string;
}> {
  const fullName = `${contact.firstName || ""} ${contact.lastName || ""}`.trim() || "Visitor";

  const emailBody = formatContactEmailBody({
    name: fullName,
    email: contact.email,
    phone: contact.phone,
    company: contact.company,
    message: contact.message,
    source,
  });

  const sourceLabel = {
    contact_form: "Contact Form Submission",
    roi_calculator: "ROI Calculator Usage",
    chatbot: "Chatbot Inquiry",
  }[source];

  try {
    const result = await sendEmailViaMicrosoft365({
      subject: `[LAI] ${sourceLabel} from ${fullName}`,
      body: emailBody,
      recipients: RECIPIENTS,
    });

    if (!result.success) {
      console.error("[EmailNotification] Failed to send email:", result.error);
      return {
        success: false,
        error: result.error,
      };
    }

    console.log(`[EmailNotification] ${sourceLabel} sent successfully to both recipients`);
    return { success: true };
  } catch (error) {
    console.error("[EmailNotification] Error sending notification:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}
