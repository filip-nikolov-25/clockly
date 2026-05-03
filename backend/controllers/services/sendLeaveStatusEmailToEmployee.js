import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendLeaveStatusEmailToEmployee = async ({
  employeeEmail,
  username,
  startStr,
  endStr,
  status,
}) => {
  const isApproved = status === "accepted";

  try {
    return await resend.emails.send({
      from: "Clockly <noreply@clockly.it.com>",
      to: employeeEmail,
      subject: `Your leave request has been ${
        isApproved ? "approved" : "declined"
      }`,
      html: `
        <div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif; line-height:1.6; color:#374151; max-width:600px; margin:40px auto; border:1px solid #e5e7eb; border-radius:12px; overflow:hidden; background-color:#ffffff;">
          
          <div style="background-color:#050505; padding:24px; text-align:center;">
            <h1 style="color:#f97316; margin:0; font-size:22px; font-weight:700;">Clockly</h1>
          </div>
          
          <div style="padding:40px 32px;">
            <h2 style="color:#111827;">Hello ${username},</h2>

            <p style="color:#4b5563;">
              Your leave request has been reviewed.
            </p>

            <div style="margin:24px 0; padding:16px; border-radius:8px; background-color:${
              isApproved ? "#ecfdf5" : "#fef2f2"
            };">
              <p style="margin:0; font-weight:600; color:${
                isApproved ? "#065f46" : "#991b1b"
              };">
                ${isApproved ? "APPROVED" : "DECLINED"}
              </p>
            </div>

            <p style="color:#4b5563;">
              <strong>Period:</strong> ${startStr} — ${endStr}
            </p>

            <p style="margin-top:24px; color:#6b7280;">
              If you have questions, please contact your administrator.
            </p>
          </div>

          <div style="background-color:#f9fafb; padding:24px; text-align:center; font-size:12px; color:#9ca3af;">
            <p style="margin:0;">Clockly</p>
          </div>
        </div>
      `,
    });
  } catch (error) {
    console.error("Email sending failed:", error);
    throw error;
  }
};