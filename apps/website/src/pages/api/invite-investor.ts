import type { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '@/lib/supabaseClient';
import { v4 as uuidv4 } from 'uuid';
import { enforcePermission } from '@/lib/utils';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { role } = req.headers; // Assume role is passed in headers for simplicity

  try {
    enforcePermission(role, 'manage_referrals');

    const { email, partnerEmail } = req.body;

    if (!email || !partnerEmail) {
      return res.status(400).json({ error: 'Email and partnerEmail are required' });
    }

    const token = uuidv4();
    const expirationDate = new Date();
    expirationDate.setDate(expirationDate.getDate() + 7);

    const { error } = await supabase.from('referrals').insert([
      {
        partnerEmail,
        investorEmail: email,
        status: 'pending',
        created_at: new Date(),
        token,
        expires_at: expirationDate,
      },
    ]);

    if (error) {
      throw error;
    }

    const invitationLink = `${process.env.BASE_URL}/register?token=${token}`;

    // Send email logic here (e.g., using SendGrid or another email service)

    res.status(200).json({ message: 'Invitation sent successfully', link: invitationLink });
  } catch (err) {
    if (err.status === 403) {
      return res.status(403).json({ error: 'Forbidden' });
    }
    res.status(500).json({ error: 'Failed to send invitation' });
  }
}
