import type { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '@/lib/supabaseClient';
import { v4 as uuidv4 } from 'uuid';
import { enforcePermission } from '@/lib/utils';
import nodemailer from 'nodemailer';

function generateInviteCode() {
  return 'INV-' + Math.random().toString(36).substr(2, 8).toUpperCase();
}

async function sendInviteEmail(email: string, invite_code: string) {
  // Configure your SMTP transport (for local testing, you can use Gmail or Mailtrap)
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: Number(process.env.SMTP_PORT) || 587,
    secure: false,
    auth: {
      user: process.env.SMTP_USER || 'your-email@gmail.com',
      pass: process.env.SMTP_PASS || 'your-app-password',
    },
  });

  const mailOptions = {
    from: process.env.SMTP_FROM || 'no-reply@elevate.com',
    to: email,
    subject: 'Your Elevate Investor Invite Code',
    text: `You have been invited to register as an investor on Elevate.\n\nYour invite code: ${invite_code}\n\nGo to the registration page and enter this code to complete your signup.`,
    html: `<p>You have been invited to register as an investor on Elevate.</p><p><b>Your invite code:</b> <code>${invite_code}</code></p><p>Go to the registration page and enter this code to complete your signup.</p>`,
  };

  await transporter.sendMail(mailOptions);
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { role } = req.headers; // Assume role is passed in headers for simplicity

  try {
    enforcePermission(role, 'manage_referrals');

    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    // Generate unique invite code
    const invite_code = generateInviteCode();

    // Insert into invites table
    const { error } = await supabase.from('invites').insert([
      {
        email,
        invite_code,
        role: 'Investor',
        created_at: new Date(),
        used: false,
      },
    ]);

    if (error) {
      throw error;
    }

    // Send invite code to email
    await sendInviteEmail(email, invite_code);

    res.status(200).json({ message: 'Invitation sent successfully', invite_code });
  } catch (err) {
    if (err.status === 403) {
      return res.status(403).json({ error: 'Forbidden' });
    }
    res.status(500).json({ error: 'Failed to send invitation' });
  }
}
