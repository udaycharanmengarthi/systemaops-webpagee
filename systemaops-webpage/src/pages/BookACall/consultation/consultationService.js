/* ================================================================
   CONSULTATION SERVICE BOUNDARY
   ------------------------------------------------------------
   Presentation components never call fetch() directly. They call this.

   PHASE 1: the enquiry is submitted to the EXISTING backend endpoint
   /api/consultations (already implemented and tested server-side), so
   the visitor's request is genuinely recorded. No mock is used here and
   no success state is ever shown for a request that was not accepted by
   the server.

   Contract consumed here (server: Server/src/controllers/consultation.controller.js):
     POST /api/consultations
     body: { name, email, company, areaOfInterest, message,
             privacyAccepted: true, privacyVersion }
     201 -> { success: true, message, data: { id } }
     400 -> { success: false, message }
     429 -> rate limited
   ================================================================ */

const API_BASE_URL = (
  import.meta.env?.VITE_API_BASE_URL || ""
).replace(/\/+$/, "");

export class ConsultationError extends Error {
  constructor(reason) {
    super(`consultation_error:${reason}`);
    this.name = "ConsultationError";
    /* 'network' | 'rateLimited' | 'invalid' | 'server' */
    this.reason = reason;
  }
}

export const consultationService = {
  async submit(payload) {
    let response;

    try {
      response = await fetch(`${API_BASE_URL}/api/consultations`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
    } catch {
      throw new ConsultationError("network");
    }

    let body;
    try {
      body = await response.json();
    } catch {
      body = null;
    }

    if (response.status === 429) throw new ConsultationError("rateLimited");
    if (response.status === 400) throw new ConsultationError("invalid");

    /* Only a confirmed 201 with success:true counts as submitted.
       Anything else must NOT be rendered as success. */
    if (!response.ok || !body || body.success !== true) {
      throw new ConsultationError("server");
    }

    return { id: body.data?.id || null };
  },
};

export default consultationService;
