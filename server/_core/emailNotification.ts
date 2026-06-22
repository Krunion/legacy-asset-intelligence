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
 * Send contact form notification using Manus notification system
 */
export async function sendContactNotificationEmails(contact: ContactFormData): Promise<{
  success: boolean;
  error?: string;
}> {
  // Build notification content
  const title = `New Contact Request from ${contact.firstName || "Visitor"}`;
  const content = `
Email: ${contact.email}
Name: ${contact.firstName || ""} ${contact.lastName || ""}
Phone: ${contact.phone || "Not provided"}
Company: ${contact.company || "Not provided"}

Message:
${contact.message || "No message provided"}
  `.trim();

  try {
    // Send notification using Manus notification system
    const success = await notifyOwner({
      title,
      content,
    });

    if (!success) {
      console.warn("[Notification] Failed to send contact notification");
      return {
        success: false,
        error: "Failed to send notification",
      };
    }

    console.log("[Notification] Contact notification sent successfully");
    return { success: true };
  } catch (error) {
    console.error("[Notification] Error sending contact notification:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}
