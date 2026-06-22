import { sendEmailViaSendGrid, formatContactEmailBody } from "./sendgridEmailService";
import { getDb } from "../db";
import { contactSubmissions } from "../../drizzle/schema";

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

  let emailSent = false;
  let emailError: string | undefined;

  try {
    console.log(`[EmailNotification] Attempting to send ${sourceLabel} via SendGrid`);
    console.log(`[EmailNotification] Recipients: ${RECIPIENTS.map(r => r.email).join(", ")}`);
    
    const result = await sendEmailViaSendGrid({
      subject: `[LAI] ${sourceLabel} from ${fullName}`,
      body: emailBody,
      recipients: RECIPIENTS,
      fromEmail: FROM_EMAIL,
      fromName: FROM_NAME,
    });

    if (!result.success) {
      console.error(`[EmailNotification] Failed to send ${sourceLabel}:`, result.error);
      emailError = result.error || "Failed to send email";
    } else {
      console.log(`[EmailNotification] ${sourceLabel} sent successfully to both recipients`);
      emailSent = true;
    }
  } catch (error) {
    console.error(`[EmailNotification] Error sending ${sourceLabel}:`, error);
    emailError = error instanceof Error ? error.message : "Unknown error";
  }

  // Store submission in database
  try {
    const db = await getDb();
    if (db) {
      await db.insert(contactSubmissions).values({
        firstName: contact.firstName,
        lastName: contact.lastName,
        email: contact.email,
        phone: contact.phone,
        company: contact.company,
        message: contact.message,
        source,
        emailSent: emailSent ? 1 : 0,
        emailError: emailError || null,
      });
      console.log(`[EmailNotification] Submission stored in database`);
    } else {
      console.warn(`[EmailNotification] Database not available, submission not stored`);
    }
  } catch (dbError) {
    console.error(`[EmailNotification] Failed to store submission in database:`, dbError);
  }

  return {
    success: true,
    error: emailError,
  };
}
