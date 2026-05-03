import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendLeaveRequestEmailToAdmin = async ({
  adminEmail,
  username,
  startStr,
  endStr,
  leave_type,
  reason,
}) => {
  return await resend.emails.send({
    from: "Clockly <noreply@clockly.it.com>",
    to: adminEmail,
    subject: `Leave Request Notification: ${username}`,
    html: `
      <div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif; line-height:1.6; color:#374151; max-width:600px; margin:40px auto; border:1px solid #e5e7eb; border-radius:12px; overflow:hidden; background-color:#ffffff;">
        
        <!-- Header -->
        <div style="background-color:#050505; padding:24px; text-align:center;">
          <h1 style="color:#f97316; margin:0; font-size:22px; font-weight:700; letter-spacing:-0.02em;">Clockly</h1>
        </div>
        
        <!-- Main Content -->
        <div style="padding:40px 32px;">
          <h2 style="color:#111827; margin-top:0; font-size:20px; font-weight:600;">Time Off Request</h2>
          
          <p style="margin:16px 0; color:#4b5563;">Greetings,</p>
          
          <p style="margin:16px 0; color:#4b5563;"> A leave request has been submitted through the Clockly platform. Please find the administrative details for this request below.</p>
          
          <!-- Data Table -->
          <div style="margin:32px 0; border:1px solid #f3f4f6; border-radius:8px; overflow:hidden;">
            <table style="width:100%; border-collapse:collapse; background-color:#ffffff;">
              <tr>
                <td style="padding:12px 16px; background-color:#f9fafb; border-bottom:1px solid #f3f4f6; color:#6b7280; font-size:13px; font-weight:600; width:120px;">EMPLOYEE</td>
                <td style="padding:12px 16px; border-bottom:1px solid #f3f4f6; color:#111827; font-weight:500;">${username}</td>
              </tr>
              <tr>
                <td style="padding:12px 16px; background-color:#f9fafb; border-bottom:1px solid #f3f4f6; color:#6b7280; font-size:13px; font-weight:600;">TYPE</td>
                <td style="padding:12px 16px; border-bottom:1px solid #f3f4f6; color:#111827;">${leave_type}</td>
              </tr>
              <tr>
                <td style="padding:12px 16px; background-color:#f9fafb; border-bottom:1px solid #f3f4f6; color:#6b7280; font-size:13px; font-weight:600;">DURATION</td>
                <td style="padding:12px 16px; border-bottom:1px solid #f3f4f6; color:#111827;">${startStr} — ${endStr}</td>
              </tr>
              <tr>
                <td style="padding:12px 16px; background-color:#f9fafb; color:#6b7280; font-size:13px; font-weight:600; vertical-align:top;">REASON</td>
                <td style="padding:12px 16px; color:#111827;">${reason || "No additional details provided."}</td>
              </tr>
            </table>
          </div>
          
          <p style="margin:24px 0 0 0; color:#6b7280; font-size:14px;">
            This request requires administrative review. Action can be taken by logging into the Clockly platform Admin panel.
          </p>
        </div>

        <!-- Footer -->
        <div style="background-color:#f9fafb; padding:24px; text-align:center; font-size:12px; color:#9ca3af; border-top:1px solid #e5e7eb;">
          <p style="margin:0; font-weight:600; color:#6b7280;">Clockly Inc.</p>
          <p style="margin:12px 0 0 0; font-size:11px; color:#d1d5db;">This is an automated notification. Please do not reply directly to this email.</p>
        </div>

      </div>
    `,
  });
};