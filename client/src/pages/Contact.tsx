import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { COLORS } from "@shared/colors";
import PageLayout from "@/components/PageLayout";

const C = COLORS;

export default function Contact() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    company: "",
    message: "",
  });

  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const submitLeadMutation = trpc.leads.submitLead.useMutation();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!formData.email) {
      setError("Email is required");
      return;
    }

    if (!formData.message.trim()) {
      setError("Message is required");
      return;
    }

    try {
      const result = await submitLeadMutation.mutateAsync({
        email: formData.email,
        firstName: formData.firstName,
        lastName: formData.lastName,
        phone: formData.phone,
        company: formData.company,
        message: formData.message,
      });

      if (result.success) {
        setSubmitted(true);
        setFormData({ firstName: "", lastName: "", email: "", phone: "", company: "", message: "" });
        setTimeout(() => setSubmitted(false), 5000);
      } else {
        setError(result.error || "Failed to submit contact form");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    }
  };

  const inputStyle = {
    width: "100%",
    padding: "0.8rem 1rem",
    background: C.navy,
    border: `1px solid ${C.borderLight}`,
    borderRadius: 4,
    fontFamily: "'Source Sans 3', sans-serif",
    fontSize: "0.95rem",
    color: C.text,
    boxSizing: "border-box" as const,
    outline: "none",
    transition: "border-color 0.2s",
  };

  const labelStyle = {
    display: "block",
    fontFamily: "'Source Sans 3', sans-serif",
    fontWeight: 500 as const,
    color: C.silver,
    marginBottom: "0.5rem",
    fontSize: "0.85rem",
  };

  return (
    <PageLayout
      heroTitle="Get in Touch"
      heroSubtitle="Have questions about our services? We'd love to hear from you."
      ctaTitle="Prefer a Direct Conversation?"
      ctaDescription="Email us directly and our team will respond within 24 hours."
      ctaButtonText="Email Us"
    >
      <div style={{ maxWidth: 700, margin: "0 auto" }}>
        {/* Success Message */}
        {submitted && (
          <div style={{ background: "rgba(27,77,62,0.3)", border: `1px solid rgba(13,148,136,0.4)`, borderRadius: 6, padding: "1rem", marginBottom: "2rem", color: C.tealLight, fontFamily: "'Source Sans 3', sans-serif" }}>
            ✓ Thank you for your message! We'll be in touch soon.
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div style={{ background: "rgba(153,27,27,0.2)", border: "1px solid rgba(252,165,165,0.3)", borderRadius: 6, padding: "1rem", marginBottom: "2rem", color: "#FCA5A5", fontFamily: "'Source Sans 3', sans-serif" }}>
            ✕ {error}
          </div>
        )}

        {/* Contact Form */}
        <form onSubmit={handleSubmit} style={{ background: C.slate, border: `1px solid ${C.border}`, borderRadius: 8, padding: "2.5rem" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1.5rem", marginBottom: "1.5rem" }}>
            <div>
              <label htmlFor="firstName" style={labelStyle}>First Name</label>
              <input id="firstName" type="text" name="firstName" autoComplete="given-name" value={formData.firstName} onChange={handleChange} style={inputStyle} />
            </div>
            <div>
              <label htmlFor="lastName" style={labelStyle}>Last Name</label>
              <input id="lastName" type="text" name="lastName" autoComplete="family-name" value={formData.lastName} onChange={handleChange} style={inputStyle} />
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1.5rem", marginBottom: "1.5rem" }}>
            <div>
              <label htmlFor="email" style={labelStyle}>Email *</label>
              <input id="email" type="email" name="email" autoComplete="email" value={formData.email} onChange={handleChange} required style={inputStyle} />
            </div>
            <div>
              <label htmlFor="phone" style={labelStyle}>Phone</label>
              <input id="phone" type="tel" name="phone" autoComplete="tel" value={formData.phone} onChange={handleChange} style={inputStyle} />
            </div>
          </div>

          <div style={{ marginBottom: "1.5rem" }}>
            <label htmlFor="company" style={labelStyle}>Company</label>
            <input id="company" type="text" name="company" autoComplete="organization" value={formData.company} onChange={handleChange} style={inputStyle} />
          </div>

          <div style={{ marginBottom: "2rem" }}>
            <label htmlFor="message" style={labelStyle}>Message</label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              rows={5}
              style={{ ...inputStyle, resize: "vertical" }}
            />
          </div>

          <p style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: "0.7rem", color: C.textMuted, lineHeight: 1.5, marginBottom: "1rem" }}>
            By submitting this form, you consent to Legacy Asset Intelligence contacting you regarding your inquiry. Your information will be used to respond to your inquiry and may be processed by service providers acting on LAI's behalf, as described in our{" "}
            <a href="/privacy" style={{ color: C.gold, textDecoration: "underline" }}>Privacy Policy</a>.
          </p>

          <button
            type="submit"
            disabled={submitLeadMutation.isPending}
            style={{
              width: "100%",
              padding: "0.85rem",
              background: C.gold,
              color: C.charcoal,
              border: "none",
              borderRadius: 4,
              fontFamily: "'Source Sans 3', sans-serif",
              fontWeight: 600,
              fontSize: "0.95rem",
              cursor: submitLeadMutation.isPending ? "not-allowed" : "pointer",
              opacity: submitLeadMutation.isPending ? 0.6 : 1,
              transition: "all 0.2s",
              letterSpacing: "0.02em",
            }}
          >
            {submitLeadMutation.isPending ? "Sending..." : "Send Message"}
          </button>
        </form>

        {/* Direct Contact */}
        <div style={{ marginTop: "2.5rem", textAlign: "center" }}>
          <p style={{ fontFamily: "'Source Sans 3', sans-serif", color: C.textMuted, fontSize: "0.9rem" }}>
            Prefer to reach out directly?{" "}
            <a href="mailto:info@legacyassetintelligence.com" style={{ color: C.gold, textDecoration: "none", fontWeight: 600 }}>
              info@legacyassetintelligence.com
            </a>
          </p>
        </div>
      </div>
    </PageLayout>
  );
}
