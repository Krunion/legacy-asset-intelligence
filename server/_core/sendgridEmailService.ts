import { ENV } from "./env";

interface EmailRecipient {
  name: string;
  email: string;
}

interface EmailContent {
  subject: string;
  body: string;
  recipients: EmailRecipient[];
  fromEmail: string;
  fromName: string;
}

/**
 * Send email via SendGrid API
 */
export async function sendEmailViaSendGrid(
  content: EmailContent
): Promise<{ success: boolean; error?: string }> {
  if (!ENV.sendgridApiKey) {
    console.error("[SendGrid] API key not configured");
    return {
      success: false,
      error: "SendGrid API key not configured",
    };
  }

  try {
    const payload = {
      personalizations: [
        {
          to: content.recipients.map((recipient) => ({
            email: recipient.email,
            name: recipient.name,
          })),
        },
      ],
      from: {
        email: content.fromEmail,
        name: content.fromName,
      },
      subject: content.subject,
      content: [
        {
          type: "text/html",
          value: content.body,
        },
      ],
    };

    const response = await fetch("https://api.sendgrid.com/v3/mail/send", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${ENV.sendgridApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error("[SendGrid] Email send failed:", {
        status: response.status,
        error: errorData,
      });
      return {
        success: false,
        error: `SendGrid error: ${response.status}`,
      };
    }

    console.log("[SendGrid] Email sent successfully to:", content.recipients.map(r => r.email).join(", "));
    return { success: true };
  } catch (error) {
    console.error("[SendGrid] Error sending email:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

/**
 * Format contact information into an HTML email body
 */
export function formatContactEmailBody(data: {
  name?: string;
  email: string;
  phone?: string;
  company?: string;
  message?: string;
  source: "contact_form" | "roi_calculator" | "chatbot";
}): string {
  const sourceLabel = {
    contact_form: "Contact Form Submission",
    roi_calculator: "ROI Calculator Usage",
    chatbot: "Chatbot Inquiry",
  }[data.source];

  return `
    <html>
      <body style="font-family: Arial, sans-serif; color: #333;">
        <h2 style="color: #D4AF37;">New ${sourceLabel}</h2>
        
        <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
          <p><strong>Name:</strong> ${data.name || "Not provided"}</p>
          <p><strong>Email:</strong> <a href="mailto:${data.email}">${data.email}</a></p>
          <p><strong>Phone:</strong> ${data.phone || "Not provided"}</p>
          <p><strong>Company:</strong> ${data.company || "Not provided"}</p>
        </div>

        ${
          data.message
            ? `
          <div style="margin: 20px 0;">
            <h3>Message:</h3>
            <p style="white-space: pre-wrap; background-color: #f9f9f9; padding: 10px; border-left: 3px solid #D4AF37;">
              ${escapeHtml(data.message)}
            </p>
          </div>
        `
            : ""
        }

        <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
        <p style="font-size: 12px; color: #666;">
          This is an automated notification from the Legacy Asset Intelligence website.
        </p>
      </body>
    </html>
  `;
}

/**
 * Escape HTML special characters
 */
function escapeHtml(text: string): string {
  const map: { [key: string]: string } = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;",
  };
  return text.replace(/[&<>"']/g, (char) => map[char]);
}
