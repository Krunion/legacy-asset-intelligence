import { ENV } from "./env";

interface EmailRecipient {
  name: string;
  email: string;
}

interface EmailContent {
  subject: string;
  body: string;
  recipients: EmailRecipient[];
}

/**
 * Send email via Microsoft 365 using the Graph API
 * Requires MICROSOFT_OAUTH_CLIENT_ID, MICROSOFT_OAUTH_CLIENT_SECRET, and MICROSOFT_OAUTH_TENANT_ID
 */
export async function sendEmailViaMicrosoft365(
  content: EmailContent
): Promise<{ success: boolean; error?: string }> {
  try {
    // Get access token
    const tokenResponse = await fetch(
      `https://login.microsoftonline.com/${ENV.microsoftOAuthTenantId}/oauth2/v2.0/token`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          client_id: ENV.microsoftOAuthClientId,
          client_secret: ENV.microsoftOAuthClientSecret,
          scope: "https://graph.microsoft.com/.default",
          grant_type: "client_credentials",
        }).toString(),
      }
    );

    if (!tokenResponse.ok) {
      const error = await tokenResponse.text();
      console.error("[Microsoft365] Token request failed:", error);
      return {
        success: false,
        error: "Failed to authenticate with Microsoft 365",
      };
    }

    const tokenData = await tokenResponse.json();
    const accessToken = tokenData.access_token;

    // Send email via Graph API
    const emailPayload = {
      message: {
        subject: content.subject,
        body: {
          contentType: "HTML",
          content: content.body,
        },
        toRecipients: content.recipients.map((recipient) => ({
          emailAddress: {
            address: recipient.email,
            name: recipient.name,
          },
        })),
      },
      saveToSentItems: "true",
    };

    const sendResponse = await fetch(
      "https://graph.microsoft.com/v1.0/me/sendMail",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(emailPayload),
      }
    );

    if (!sendResponse.ok) {
      const error = await sendResponse.text();
      console.error("[Microsoft365] Email send failed:", error);
      return {
        success: false,
        error: `Failed to send email: ${sendResponse.status}`,
      };
    }

    console.log("[Microsoft365] Email sent successfully to:", content.recipients.map(r => r.email).join(", "));
    return { success: true };
  } catch (error) {
    console.error("[Microsoft365] Error sending email:", error);
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
