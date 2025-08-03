import { enforcePermission } from '@/lib/utils';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { role } = req.headers; // Assume role is passed in headers for simplicity

  try {
    enforcePermission(role, 'approve_investments');

    const { investmentId, status } = req.body;

    if (!investmentId || !status) {
      return res.status(400).json({ error: 'Investment ID and status are required' });
    }

    const { error } = await supabase.from('investment_requests').update({
      status,
      updated_at: new Date(),
    }).eq('id', investmentId);

    if (error) {
      throw error;
    }

    res.status(200).json({ message: 'Investment status updated successfully' });
  } catch (err) {
    if (err.status === 403) {
      return res.status(403).json({ error: 'Forbidden' });
    }
    res.status(500).json({ error: 'Failed to update investment status' });
  }
}