import { useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

const KYC = () => {
  const [kycData, setKycData] = useState({
    fullName: '',
    contactEmail: '',
    address: '',
    document: null,
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setKycData({ ...kycData, document: e.target.files[0] });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!kycData.document) {
      setError('Please upload a valid document.');
      return;
    }

    try {
      // Upload document to Supabase storage (if configured)
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('kyc-documents')
        .upload(`documents/${kycData.document.name}`, kycData.document);

      if (uploadError) {
        throw uploadError;
      }

      // Save KYC data to the database
      const { error: insertError } = await supabase.from('investors').update({
        name: kycData.fullName,
        contactEmail: kycData.contactEmail,
        address: kycData.address,
        kycStatus: 'Pending',
        kycDocumentUrl: uploadData?.path,
      });

      if (insertError) {
        throw insertError;
      }

      setSuccess(true);
    } catch (err) {
      setError('Failed to submit KYC. Please try again.');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10">
      <h1 className="text-2xl font-bold mb-4">Complete Your KYC</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="fullName" className="block text-sm font-medium mb-1">Full Name</label>
          <Input
            id="fullName"
            type="text"
            value={kycData.fullName}
            onChange={(e) => setKycData({ ...kycData, fullName: e.target.value })}
            required
          />
        </div>
        <div>
          <label htmlFor="contactEmail" className="block text-sm font-medium mb-1">Contact Email</label>
          <Input
            id="contactEmail"
            type="email"
            value={kycData.contactEmail}
            onChange={(e) => setKycData({ ...kycData, contactEmail: e.target.value })}
            required
          />
        </div>
        <div>
          <label htmlFor="address" className="block text-sm font-medium mb-1">Address</label>
          <Textarea
            id="address"
            value={kycData.address}
            onChange={(e) => setKycData({ ...kycData, address: e.target.value })}
            rows={3}
            required
          />
        </div>
        <div>
          <label htmlFor="document" className="block text-sm font-medium mb-1">Upload Document</label>
          <Input
            id="document"
            type="file"
            onChange={handleFileChange}
            required
          />
        </div>
        {error && <p className="text-red-500 text-sm">{error}</p>}
        {success && <p className="text-green-500 text-sm">KYC submitted successfully. Please wait for admin approval.</p>}
        <Button type="submit" className="w-full">Submit KYC</Button>
      </form>
    </div>
  );
};

export default KYC;