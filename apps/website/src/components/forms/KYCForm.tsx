import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';

const entityTypes = [
  { value: 'individual', label: 'Individual' },
  { value: 'firm', label: 'Firm' },
  { value: 'company', label: 'Company' },
  { value: 'huf', label: 'HUF' },
];

export default function KYCForm() {
  const [entityType, setEntityType] = useState('individual');
  const [form, setForm] = useState({});
  const [files, setFiles] = useState({});

  const handleInput = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  const handleFile = (e: any) => {
    setFiles({ ...files, [e.target.name]: e.target.files[0] });
  };
  const handleEntityType = (val: string) => {
    setEntityType(val);
    setForm({});
    setFiles({});
  };
  const handleSubmit = (e: any) => {
    e.preventDefault();
    // TODO: submit logic
    alert('KYC submitted!');
  };

  return (
    <form className="space-y-6 max-w-xl mx-auto" onSubmit={handleSubmit}>
      <div className="space-y-2">
        <Label>Entity Type</Label>
        <Select value={entityType} onValueChange={handleEntityType}>
          <SelectTrigger>
            <SelectValue placeholder="Select entity type" />
          </SelectTrigger>
          <SelectContent>
            {entityTypes.map(e => (
              <SelectItem key={e.value} value={e.value}>{e.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      {/* Individual Fields */}
      {entityType === 'individual' && (
        <>
          <div className="space-y-2">
            <Label>Full Name</Label>
            <Input name="fullName" required onChange={handleInput} />
          </div>
          <div className="space-y-2">
            <Label>Date of Birth</Label>
            <Input name="dob" type="date" required onChange={handleInput} />
          </div>
          <div className="space-y-2">
            <Label>PAN Number</Label>
            <Input name="pan" required onChange={handleInput} />
          </div>
          <div className="space-y-2">
            <Label>Address</Label>
            <Input name="address" required onChange={handleInput} />
          </div>
          <div className="space-y-2">
            <Label>Mobile Number</Label>
            <Input name="mobile" required onChange={handleInput} />
          </div>
          <div className="space-y-2">
            <Label>Annual Income</Label>
            <Input name="income" required onChange={handleInput} />
          </div>
          <div className="space-y-2">
            <Label>PAN Card Upload</Label>
            <Input name="panFile" type="file" required onChange={handleFile} />
          </div>
          <div className="space-y-2">
            <Label>Address Proof Upload</Label>
            <Input name="addressFile" type="file" required onChange={handleFile} />
          </div>
        </>
      )}
      {/* Firm/Company Fields */}
      {(entityType === 'firm' || entityType === 'company') && (
        <>
          <div className="space-y-2">
            <Label>Entity Name</Label>
            <Input name="entityName" required onChange={handleInput} />
          </div>
          <div className="space-y-2">
            <Label>Registration Number/CIN</Label>
            <Input name="regNo" required onChange={handleInput} />
          </div>
          <div className="space-y-2">
            <Label>PAN Number</Label>
            <Input name="pan" required onChange={handleInput} />
          </div>
          <div className="space-y-2">
            <Label>Registered Address</Label>
            <Input name="address" required onChange={handleInput} />
          </div>
          <div className="space-y-2">
            <Label>Contact Person Name</Label>
            <Input name="contactName" required onChange={handleInput} />
          </div>
          <div className="space-y-2">
            <Label>Contact Person Mobile</Label>
            <Input name="contactMobile" required onChange={handleInput} />
          </div>
          <div className="space-y-2">
            <Label>Annual Turnover</Label>
            <Input name="turnover" required onChange={handleInput} />
          </div>
          <div className="space-y-2">
            <Label>Certificate of Incorporation</Label>
            <Input name="incFile" type="file" required onChange={handleFile} />
          </div>
          <div className="space-y-2">
            <Label>PAN Card Upload</Label>
            <Input name="panFile" type="file" required onChange={handleFile} />
          </div>
          <div className="space-y-2">
            <Label>Address Proof Upload</Label>
            <Input name="addressFile" type="file" required onChange={handleFile} />
          </div>
        </>
      )}
      {/* HUF Fields */}
      {entityType === 'huf' && (
        <>
          <div className="space-y-2">
            <Label>HUF Name</Label>
            <Input name="hufName" required onChange={handleInput} />
          </div>
          <div className="space-y-2">
            <Label>PAN Number</Label>
            <Input name="pan" required onChange={handleInput} />
          </div>
          <div className="space-y-2">
            <Label>Address</Label>
            <Input name="address" required onChange={handleInput} />
          </div>
          <div className="space-y-2">
            <Label>Karta Name</Label>
            <Input name="kartaName" required onChange={handleInput} />
          </div>
          <div className="space-y-2">
            <Label>Karta PAN</Label>
            <Input name="kartaPan" required onChange={handleInput} />
          </div>
          <div className="space-y-2">
            <Label>HUF PAN Upload</Label>
            <Input name="panFile" type="file" required onChange={handleFile} />
          </div>
          <div className="space-y-2">
            <Label>Address Proof Upload</Label>
            <Input name="addressFile" type="file" required onChange={handleFile} />
          </div>
          <div className="space-y-2">
            <Label>Karta ID Proof Upload</Label>
            <Input name="kartaIdFile" type="file" required onChange={handleFile} />
          </div>
        </>
      )}
      <div className="space-y-2">
        <input type="checkbox" required /> <span>I confirm the above details are correct.</span>
      </div>
      <Button type="submit" className="w-full">Submit KYC</Button>
    </form>
  );
}
