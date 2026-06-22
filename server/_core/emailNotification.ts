import { ENV } from "./env";
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
 * Send contact form emails to both team members
 */
export async function sendContactNotificationEmails(contact: ContactFormData): Promise<{
  success: boolean;
  error?: string;
}> {
  const recipientEmails = [
    "Kevin.Runion@legacyassetintelligence.com",
    "Chris.Haynes@legacyassetintelligence.com",
  ];

  // Build email subject and body
  const emailSubject = `New Contact Request from ${contact.firstName || "Visitor"}`;
  const emailBody = `
New Contact Form Submission

From: ${contact.firstName || ""} ${contact.lastName || ""}
Email: ${contact.email}
Phone: ${contact.phone || "Not provided"}
Company: ${contact.company || "Not provided"}

Message:
${contact.message || "No message provided"}

---
This is an automated notification from the Legacy Asset Intelligence website contact form.
  `.trim();

  try {
    // Send emails to both recipients
    const emailPromises = recipientEmails.map((recipientEmail) =>
      sendEmail({
        to: recipientEmail,
        subject: emailSubject,
        body: emailBody,
      })
    );

    const results = await Promise.all(emailPromises);
    const allSuccessful = results.every((r) => r.success);

    if (!allSuccessful) {
      const errors = results
        .filter((r) => !r.success)
        .map((r) => r.error)
        .join("; ");
      console.error("[Email] Failed to send some notifications:", errors);
      return {
        success: false,
        error: `Failed to send notifications: ${errors}`,
      };
    }

    // Also send Manus notification to owner
    const notificationContent = `
Email: ${contact.email}
Name: ${contact.firstName || ""} ${contact.lastName || ""}
Phone: ${contact.phone || "Not provided"}
Company: ${contact.company || "Not provided"}

Message:
${contact.message || "No message provided"}
    `.trim();

    await notifyOwner({
      title: emailSubject,
      content: notificationContent,
    });

    console.log("[Email] Contact notifications sent successfully to both recipients");
    return { success: true };
  } catch (error) {
    console.error("[Email] Failed to send contact notifications:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

/**
 * Send email using the Manus built-in email service
 */
async function sendEmail({
  to,
  subject,
  body,
}: {
  to: string;
  subject: string;
  body: string;
}): Promise<{ success: boolean; error?: string }> {
  if (!ENV.forgeApiUrl || !ENV.forgeApiKey) {
    console.warn("[Email] Manus API not configured");
    return {
      success: false,
      error: "Email service not configured",
    };
  }

  try {
    const response = await fetch(`${ENV.forgeApiUrl}/v1/email/send`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${ENV.forgeApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        to,
        subject,
        text: body,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error(`[Email] Failed to send to ${to}:`, {
        status: response.status,
        error: errorData,
      });
      return {
        success: false,
        error: `Email service error: ${response.status}`,
      };
    }

    console.log(`[Email] Successfully sent to ${to}`);
    return { success: true };
  } catch (error) {
    console.error(`[Email] Error sending to ${to}:`, error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}
