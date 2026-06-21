import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { COLORS } from "@shared/colors";

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
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!formData.email) {
      setError("Email is required");
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
        setFormData({
          firstName: "",
          lastName: "",
          email: "",
          phone: "",
          company: "",
          message: "",
        });
        setTimeout(() => setSubmitted(false), 5000);
      } else {
        setError(result.error || "Failed to submit contact form");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "#F8FAFC", paddingTop: "2rem", paddingBottom: "4rem" }}>
      <div style={{ maxWidth: 800, margin: "0 auto", padding: "0 2rem" }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "3rem" }}>
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "2.5rem", fontWeight: 700, color: "#1E293B", marginBottom: "0.5rem" }}>
            Get in Touch
          </h1>
          <p style={{ fontFamily: "'Source Sans 3', sans-serif", fontSize: "1rem", color: "#64748B", lineHeight: 1.6 }}>
            Have questions about our services? We'd love to hear from you. Fill out the form below and our team will get back to you shortly.
          </p>
        </div>

        {/* Success Message */}
        {submitted && (
          <div style={{ background: "#D1FAE5", border: "1px solid #6EE7B7", borderRadius: 8, padding: "1rem", marginBottom: "2rem", color: "#065F46", fontFamily: "'Source Sans 3', sans-serif" }}>
            ✓ Thank you for your message! We'll be in touch soon.
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div style={{ background: "#FEE2E2", border: "1px solid #FCA5A5", borderRadius: 8, padding: "1rem", marginBottom: "2rem", color: "#991B1B", fontFamily: "'Source Sans 3', sans-serif" }}>
            ✕ {error}
          </div>
        )}

        {/* Contact Form */}
        <form onSubmit={handleSubmit} style={{ background: "white", border: "1px solid #E2E8F0", borderRadius: 12, padding: "2rem", boxShadow: "0 2px 8px rgba(0,0,0,0.08)" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem", marginBottom: "1.5rem" }}>
            {/* First Name */}
            <div>
              <label style={{ display: "block", fontFamily: "'Source Sans 3', sans-serif", fontWeight: 600, color: "#1E293B", marginBottom: "0.5rem", fontSize: "0.9rem" }}>
                First Name
              </label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                style={{
                  width: "100%",
                  padding: "0.75rem",
                  border: "1px solid #E2E8F0",
                  borderRadius: 6,
                  fontFamily: "'Source Sans 3', sans-serif",
                  fontSize: "0.95rem",
                  boxSizing: "border-box",
                }}
              />
            </div>

            {/* Last Name */}
            <div>
              <label style={{ display: "block", fontFamily: "'Source Sans 3', sans-serif", fontWeight: 600, color: "#1E293B", marginBottom: "0.5rem", fontSize: "0.9rem" }}>
                Last Name
              </label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                style={{
                  width: "100%",
                  padding: "0.75rem",
                  border: "1px solid #E2E8F0",
                  borderRadius: 6,
                  fontFamily: "'Source Sans 3', sans-serif",
                  fontSize: "0.95rem",
                  boxSizing: "border-box",
                }}
              />
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem", marginBottom: "1.5rem" }}>
            {/* Email */}
            <div>
              <label style={{ display: "block", fontFamily: "'Source Sans 3', sans-serif", fontWeight: 600, color: "#1E293B", marginBottom: "0.5rem", fontSize: "0.9rem" }}>
                Email *
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                style={{
                  width: "100%",
                  padding: "0.75rem",
                  border: "1px solid #E2E8F0",
                  borderRadius: 6,
                  fontFamily: "'Source Sans 3', sans-serif",
                  fontSize: "0.95rem",
                  boxSizing: "border-box",
                }}
              />
            </div>

            {/* Phone */}
            <div>
              <label style={{ display: "block", fontFamily: "'Source Sans 3', sans-serif", fontWeight: 600, color: "#1E293B", marginBottom: "0.5rem", fontSize: "0.9rem" }}>
                Phone
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                style={{
                  width: "100%",
                  padding: "0.75rem",
                  border: "1px solid #E2E8F0",
                  borderRadius: 6,
                  fontFamily: "'Source Sans 3', sans-serif",
                  fontSize: "0.95rem",
                  boxSizing: "border-box",
                }}
              />
            </div>
          </div>

          {/* Company */}
          <div style={{ marginBottom: "1.5rem" }}>
            <label style={{ display: "block", fontFamily: "'Source Sans 3', sans-serif", fontWeight: 600, color: "#1E293B", marginBottom: "0.5rem", fontSize: "0.9rem" }}>
              Company
            </label>
            <input
              type="text"
              name="company"
              value={formData.company}
              onChange={handleChange}
              style={{
                width: "100%",
                padding: "0.75rem",
                border: "1px solid #E2E8F0",
                borderRadius: 6,
                fontFamily: "'Source Sans 3', sans-serif",
                fontSize: "0.95rem",
                boxSizing: "border-box",
              }}
            />
          </div>

          {/* Message */}
          <div style={{ marginBottom: "1.5rem" }}>
            <label style={{ display: "block", fontFamily: "'Source Sans 3', sans-serif", fontWeight: 600, color: "#1E293B", marginBottom: "0.5rem", fontSize: "0.9rem" }}>
              Message
            </label>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              rows={6}
              style={{
                width: "100%",
                padding: "0.75rem",
                border: "1px solid #E2E8F0",
                borderRadius: 6,
                fontFamily: "'Source Sans 3', sans-serif",
                fontSize: "0.95rem",
                boxSizing: "border-box",
                resize: "vertical",
              }}
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={submitLeadMutation.isPending}
            style={{
              width: "100%",
              padding: "0.75rem",
              background: C.teal,
              color: "white",
              border: "none",
              borderRadius: 6,
              fontFamily: "'Source Sans 3', sans-serif",
              fontWeight: 600,
              fontSize: "0.95rem",
              cursor: submitLeadMutation.isPending ? "not-allowed" : "pointer",
              opacity: submitLeadMutation.isPending ? 0.6 : 1,
              transition: "all 0.2s",
            }}
          >
            {submitLeadMutation.isPending ? "Sending..." : "Send Message"}
          </button>
        </form>

        {/* Contact Info */}
        <div style={{ marginTop: "3rem", textAlign: "center" }}>
          <p style={{ fontFamily: "'Source Sans 3', sans-serif", color: "#64748B", fontSize: "0.95rem" }}>
            Prefer to reach out directly? Contact us at{" "}
            <a href="mailto:info@legacyassetintelligence.com" style={{ color: C.teal, textDecoration: "none", fontWeight: 600 }}>
              info@legacyassetintelligence.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
