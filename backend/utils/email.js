import nodemailer from "nodemailer";

const emailUser = process.env.EMAIL_USER?.trim();
const emailPass = process.env.EMAIL_PASS?.trim();

if (!emailUser || !emailPass) {
  throw new Error("EMAIL_USER or EMAIL_PASS is missing.");
}

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: emailUser,
    pass: emailPass
  }
});

export async function sendOtpEmail(email, otp, purpose = "verification") {
  const isReset = purpose === "reset";

  const subject = isReset
    ? "Nexaroton - Password Reset OTP"
    : "Nexaroton - Verify Your Email";

  const title = isReset
    ? "Reset your password"
    : "Verify your Orebound account";

  const message = isReset
    ? "Use the OTP below to reset your Nexaroton password."
    : "Use the OTP below to verify your Nexaroton account.";

  await transporter.sendMail({
    from: `"Nexaroton" <${emailUser}>`,
    to: email,
    subject,
    html: `
      <!DOCTYPE html>
      <html>
        <body style="
          margin:0;
          padding:0;
          background:#0b0f14;
          font-family:Arial,sans-serif;
          color:#ffffff;
        ">

          <div style="
            max-width:520px;
            margin:40px auto;
            padding:30px;
            background:#111820;
            border-radius:14px;
            border:1px solid #26313d;
          ">

            <h1 style="
              margin:0 0 10px;
              text-align:center;
              color:#ffffff;
            ">
              Nexaroton
            </h1>

            <p style="
              text-align:center;
              color:#9ca8b5;
              margin-bottom:30px;
            ">
              24/7 Minecraft Server Hosting
            </p>

            <h2 style="color:#ffffff;">
              ${title}
            </h2>

            <p style="
              color:#c5ced8;
              line-height:1.6;
            ">
              ${message}
            </p>

            <div style="
              margin:30px 0;
              padding:20px;
              text-align:center;
              background:#0b0f14;
              border:1px solid #33404d;
              border-radius:10px;
            ">

              <div style="
                color:#8e9aa8;
                font-size:13px;
                margin-bottom:8px;
              ">
                YOUR OTP
              </div>

              <div style="
                font-size:32px;
                font-weight:bold;
                letter-spacing:8px;
                color:#ffffff;
              ">
                ${otp}
              </div>

            </div>

            <p style="
              color:#9ca8b5;
              font-size:13px;
              line-height:1.6;
            ">
              This OTP expires in 10 minutes.
              If you did not request this, you can safely ignore this email.
            </p>

            <hr style="
              border:none;
              border-top:1px solid #26313d;
              margin:25px 0;
            ">

            <p style="
              text-align:center;
              color:#66727f;
              font-size:12px;
            ">
              © 2026 Nexaroton
            </p>

          </div>

        </body>
      </html>
    `
  });
}