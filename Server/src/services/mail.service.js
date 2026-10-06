import dotenv from "dotenv";
dotenv.config();

import { Resend } from "resend";

function getResend() {
  if (!process.env.RESEND_API_KEY) return null;
  return new Resend(process.env.RESEND_API_KEY);
}

function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/* Transactional email to an admin's own address (password resets,
   security notifications). Reuses the same Resend infrastructure.
   Never logs tokens or secrets. */
export const sendAdminEmail = async ({ to, subject, html, text }) => {
  try {
    const resend = getResend();
    if (!resend || !process.env.SENDER_EMAIL || !to) {
      console.error("Email not configured, skipping send");
      return { skipped: true };
    }
    const response = await resend.emails.send({
      from: process.env.SENDER_EMAIL,
      to,
      subject,
      html,
      ...(text ? { text } : {}),
    });
    if (response.error) {
      // Safe diagnostics only: provider status/message, never the
      // request body (which could contain tokens or PII).
      console.error(
        `Email send failed: ${response.error.name || "provider_error"} ` +
          `${response.error.statusCode || ""} ${(response.error.message || "").slice(0, 160)}`
      );
      return { sent: false };
    }
    return { sent: true, id: response.data && response.data.id ? response.data.id : null };
  } catch {
    console.error("Email send failed");
    return { sent: false };
  }
};

export const sendFounderEmail = async ({
  name,
  email,
  phone,
  company,
  message,
  subject,
  html,
}) => {
  try {
    const resend = getResend();
    if (!resend || !process.env.SENDER_EMAIL || !process.env.FOUNDER_EMAIL) {
      console.error("Email not configured, skipping send");
      return { skipped: true };
    }

    // Custom HTML (e.g. career applications) takes precedence and is already escaped by the caller.
    const customHtml = typeof html === "string" && html.length > 0 ? html : null;

    const safeName = escapeHtml(name);
    const safeEmail = escapeHtml(email);
    const safePhone = escapeHtml(phone);
    const safeCompany = escapeHtml(company || "Not Provided");
    const safeMessage = escapeHtml(message);

    const response = await resend.emails.send({
      from: process.env.SENDER_EMAIL,

      to: process.env.FOUNDER_EMAIL,

      subject: subject || "New Contact Form Submission",

      html:
        customHtml ||
        `
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">

<style>
body{
  margin:0;
  padding:30px;
  background:#f4f7fb;
  font-family:Arial,Helvetica,sans-serif;
}

.container{
  max-width:700px;
  margin:auto;
  background:#ffffff;
  border-radius:12px;
  overflow:hidden;
}

.header{
  background:#0f172a;
  color:#ffffff;
  padding:25px;
  text-align:center;
}

.content{
  padding:30px;
}

.card{
  background:#f8fafc;
  border:1px solid #e2e8f0;
  border-radius:10px;
  padding:20px;
}

.row{
  margin-bottom:15px;
}

.label{
  font-weight:bold;
  color:#475569;
}

.message{
  background:#ffffff;
  border-left:4px solid #06b6d4;
  padding:15px;
  margin-top:10px;
}

.footer{
  text-align:center;
  padding:20px;
  background:#f8fafc;
  color:#64748b;
}
</style>

</head>

<body>

<div class="container">

<div class="header">
<h2>🚀 New Lead from SystemaOps</h2>
</div>

<div class="content">

<div class="card">

<div class="row">
<span class="label">Name:</span>
${safeName}
</div>

<div class="row">
<span class="label">Email:</span>
${safeEmail}
</div>

<div class="row">
<span class="label">Phone:</span>
${safePhone}
</div>

<div class="row">
<span class="label">Company:</span>
${safeCompany}
</div>

<div class="row">
<span class="label">Project Requirement:</span>

<div class="message">
${safeMessage}
</div>

</div>

</div>

</div>

<div class="footer">
SystemaOps Website Contact Form
</div>

</div>

</body>
</html>
`,
    });

    if (response.error) {
      console.error("Email send failed");
      return { sent: false };
    }
    return { sent: true };
  } catch (error) {
    console.error("Email send failed");
    return { sent: false };
  }
};
