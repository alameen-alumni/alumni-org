import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { db } from '../lib/firebase';
import { addDoc, collection } from 'firebase/firestore';
import { toast } from '@/components/ui/sonner';
import { useIsMobile } from '../hooks/use-mobile';

const initialForm = {
  name: '',
  email: '',
  passout_year: '',
  registration_id: '',
  magazine: false,
  tshirt: {
    required: false,
    size: '',
  },
};

const Reunion2k25 = () => {
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(false);
  const isMobile = useIsMobile();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name.startsWith('tshirt.')) {
      const tshirtField = name.split('.')[1];
      setForm((prev) => ({
        ...prev,
        tshirt: {
          ...prev.tshirt,
          [tshirtField]: type === 'checkbox' ? checked : value,
        },
      }));
    } else {
      setForm((prev) => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Convert number fields
      const data = {
        ...form,
        passout_year: form.passout_year ? Number(form.passout_year) : '',
        registration_id: form.registration_id ? Number(form.registration_id) : '',
      };
      await addDoc(collection(db, 'reunion'), data);
      setForm(initialForm);
      toast.success('Registration submitted!', {
        position: isMobile ? 'top-center' : 'top-right',
      });
    } catch (err) {
      toast.error('Failed to submit registration. Please try again.', {
        position: isMobile ? 'top-center' : 'top-right',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto p-8 bg-white rounded shadow mt-10">
      <h1 className="text-2xl font-bold mb-6 text-center">Reunion 2K25 Registration</h1>
      <form className="space-y-4" onSubmit={handleSubmit}>
        <div>
          <label className="block text-xs font-medium mb-2" htmlFor="name">Name *</label>
          <Input id="name" name="name" value={form.name} onChange={handleChange} required />
        </div>
        <div>
          <label className="block text-xs font-medium mb-2" htmlFor="email">Email *</label>
          <Input id="email" name="email" type="email" value={form.email} onChange={handleChange} required />
        </div>
        <div>
          <label className="block text-xs font-medium mb-2" htmlFor="passout_year">Passout Year *</label>
          <Input id="passout_year" name="passout_year" type="number" value={form.passout_year} onChange={handleChange} required />
        </div>
        <div>
          <label className="block text-xs font-medium mb-2" htmlFor="registration_id">Registration ID *</label>
          <Input id="registration_id" name="registration_id" type="number" value={form.registration_id} onChange={handleChange} required />
        </div>
        <div className="flex items-center gap-2">
          <input id="magazine" name="magazine" type="checkbox" checked={form.magazine} onChange={handleChange} />
          <label htmlFor="magazine" className="text-xs">Opt-in for Magazine</label>
        </div>
        <fieldset className="border p-4 rounded">
          <legend className="text-xs font-semibold">T-Shirt</legend>
          <div className="flex items-center gap-2 mb-2">
            <input id="tshirt.required" name="tshirt.required" type="checkbox" checked={form.tshirt.required} onChange={handleChange} />
            <label htmlFor="tshirt.required" className="text-xs">T-Shirt Required</label>
          </div>
          {form.tshirt.required && (
            <div>
              <label className="block text-xs font-medium mb-2" htmlFor="tshirt.size">Size</label>
              <select id="tshirt.size" name="tshirt.size" value={form.tshirt.size} onChange={handleChange} className="w-full border rounded p-2" required={form.tshirt.required}>
                <option value="">Select Size</option>
                <option value="S">S</option>
                <option value="M">M</option>
                <option value="L">L</option>
                <option value="XL">XL</option>
                <option value="XXL">XXL</option>
              </select>
            </div>
          )}
        </fieldset>
        <Button type="submit" className="w-full" disabled={loading}>{loading ? 'Submitting...' : 'Register'}</Button>
      </form>
    </div>
  );
};

export default Reunion2k25; 