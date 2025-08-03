import { enforcePermission } from '@/lib/utils';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { role } = req.headers; // Assume role is passed in headers for simplicity

  try {
    enforcePermission(role, 'approve_kyc');

    const { kycId, status } = req.body;

    if (!kycId || !status) {
      return res.status(400).json({ error: 'KYC ID and status are required' });
    }

    const { error } = await supabase.from('kyc_requests').update({
      status,
      updated_at: new Date(),
    }).eq('id', kycId);

    if (error) {
      throw error;
    }

    res.status(200).json({ message: 'KYC status updated successfully' });
  } catch (err) {
    if (err.status === 403) {
      return res.status(403).json({ error: 'Forbidden' });
    }
    res.status(500).json({ error: 'Failed to update KYC status' });
  }
}