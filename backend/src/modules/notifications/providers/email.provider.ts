import nodemailer from 'nodemailer';
import { env } from '../../../config/env';

let transporter: nodemailer.Transporter | null = null;

async function getTransporter() {
  if (transporter) return transporter;

  const isGmail = env.SMTP_HOST === 'smtp.gmail.com';
  const hasCredentials = env.SMTP_USER && env.SMTP_PASS;

  // Use Ethereal for testing if no real credentials are provided
  if (!hasCredentials || !env.SMTP_HOST) {
    const testAccount = await nodemailer.createTestAccount();
    transporter = nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      secure: false,
      auth: { user: testAccount.user, pass: testAccount.pass },
    });
    console.log(`[Email] ⚠️  No SMTP credentials found. Using Ethereal test account: ${testAccount.user}`);
  } else {
    transporter = nodemailer.createTransport({
      host: env.SMTP_HOST,
      port: Number(env.SMTP_PORT) || 587,
      secure: isGmail ? false : env.SMTP_SECURE === 'true',
      auth: { user: env.SMTP_USER, pass: env.SMTP_PASS },
      ...(isGmail && { service: 'gmail' }),
    });
    console.log(`[Email] ✅ Gmail SMTP transporter configured for ${env.SMTP_USER}`);
  }

  return transporter;
}

export const emailProvider = async (to: string, subject: string, text: string, html?: string) => {
  const mailer = await getTransporter();
  const fromName = env.EMAIL_FROM ?? 'LastMile Delivery <noreply@lastmiletracker.dev>';

  const info = await mailer.sendMail({
    from: fromName,
    to,
    subject,
    text,
    ...(html && { html }),
  });

  console.log(`[Email] ✅ Sent to ${to} | Subject: "${subject}" | MessageId: ${info.messageId}`);

  // Print preview URL for Ethereal
  const previewUrl = nodemailer.getTestMessageUrl(info);
  if (previewUrl) {
    console.log(`[Email] 🔗 Preview (Ethereal): ${previewUrl}`);
  }

  return info;
};
