import { enforcePermission } from '@/lib/utils';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { role } = req.headers; // Assume role is passed in headers for simplicity

  try {
    enforcePermission(role, 'submit_icd_request');

    const { amount, tenure, investorId } = req.body;

    if (!amount || !tenure || !investorId) {
      return res.status(400).json({ error: 'Amount, tenure, and investorId are required' });
    }

    const { error } = await supabase.from('icd_requests').insert([
      {
        amount,
        tenure,
        investorId,
        status: 'Pending',
        created_at: new Date(),
      },
    ]);

    if (error) {
      throw error;
    }

    res.status(200).json({ message: 'ICD request submitted successfully' });
  } catch (err) {
    if (err.status === 403) {
      return res.status(403).json({ error: 'Forbidden' });
    }
    res.status(500).json({ error: 'Failed to submit ICD request' });
  }
}