import { sendEmailViaSendGrid, formatContactEmailBody } from "./sendgridEmailService";

interface ContactFormData {
  email: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  company?: string;
  message?: string;
}

// Recipients for all lead notifications
const NOTIFICATION_RECIPIENTS = [
  { name: "Kevin Runion", email: "Kevin.Runion@legacyassetintelligence.com" },
  { name: "Chris Haynes", email: "Chris.Haynes@legacyassetintelligence.com" },
];

// Verified sender - must match SendGrid Single Sender Verification
const FROM_EMAIL = "Kevin.Runion@legacyassetintelligence.com";
const FROM_NAME = "Legacy Asset Intelligence";

/**
 * Send contact form notification via SendGrid API directly
 * This bypasses Make.com and Microsoft 365 SMTP entirely
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
    console.log(`[EmailNotification] Sending ${sourceLabel} via SendGrid API`);
    console.log(`[EmailNotification] From: ${FROM_EMAIL}`);
    console.log(`[EmailNotification] To: ${NOTIFICATION_RECIPIENTS.map(r => r.email).join(", ")}`);

    const name = [contact.firstName, contact.lastName].filter(Boolean).join(" ") || undefined;

    const htmlBody = formatContactEmailBody({
      name,
      email: contact.email,
      phone: contact.phone,
      company: contact.company,
      message: contact.message,
      source,
    });

    const result = await sendEmailViaSendGrid({
      subject: `[LAI] New ${sourceLabel} from ${name || contact.email}`,
      body: htmlBody,
      recipients: NOTIFICATION_RECIPIENTS,
      fromEmail: FROM_EMAIL,
      fromName: FROM_NAME,
    });

    if (!result.success) {
      console.error(`[EmailNotification] SendGrid failed:`, result.error);
      return {
        success: false,
        error: result.error,
      };
    }

    console.log(`[EmailNotification] ${sourceLabel} sent successfully via SendGrid`);
    return { success: true };
  } catch (error) {
    console.error(`[EmailNotification] Error sending ${sourceLabel}:`, error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}
