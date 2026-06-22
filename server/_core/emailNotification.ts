import { sendEmailViaSendGrid, formatContactEmailBody } from "./sendgridEmailService";

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

const FROM_EMAIL = "Kevin.Runion@legacyassetintelligence.com";
const FROM_NAME = "Legacy Asset Intelligence";

/**
 * Send contact form notification emails to both team members via SendGrid
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
    const result = await sendEmailViaSendGrid({
      subject: `[LAI] ${sourceLabel} from ${fullName}`,
      body: emailBody,
      recipients: RECIPIENTS,
      fromEmail: FROM_EMAIL,
      fromName: FROM_NAME,
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
