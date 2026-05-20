import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendPasswordResetEmail = async (email, resetURL) => {
  return await resend.emails.send({
    from: "Clockly <noreply@clockly.it.com>",
    to: email,
    subject: "Reset your Clockly password",
    html: `
      <div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif; line-height:1.6; color:#333; max-width:600px; margin:40px auto; border:1px solid #e5e7eb; border-radius:12px; overflow:hidden; background-color:#ffffff;">
        
        <div style="background-color:#050505; padding:20px; text-align:center;">
          <h1 style="color:#f97316; margin:0; font-size:24px;">Clockly</h1>
        </div>
        
        <div style="padding:40px 30px;">
          <h2 style="color:#111827; margin-top:0;">Reset your password</h2>
          <p style="margin:16px 0;">Hi there,</p>
          <p style="margin:16px 0;">We received a request to reset the password for your Clockly account. If you didn't initiate this request, you can safely ignore this email.</p>
          
          <div style="text-align:center; margin:40px 0;">
            <a href="${resetURL}" style="background-color:#f97316; color:#ffffff; padding:14px 28px; text-decoration:none; border-radius:8px; font-weight:600; font-size:16px; display:inline-block;">
              Reset Password
            </a>
          </div>
          
          <p style="margin:16px 0;">This link will expire in <strong>15 minutes</strong>. For security reasons, do not share this link with anyone.</p>
        </div>

        <div style="background-color:#f9fafb; padding:20px; text-align:center; font-size:12px; color:#6b7280; border-top:1px solid #e5e7eb;">
          <p style="margin:0;">Clockly Inc. | North Macedonia</p>
        </div>

      </div>
    `,
  });
};