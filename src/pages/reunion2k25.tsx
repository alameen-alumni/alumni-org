import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { db } from '../lib/firebase';
import { addDoc, collection, getDocs, query, where } from 'firebase/firestore';
import { toast } from '@/components/ui/sonner';
import { useIsMobile } from '../hooks/use-mobile';
import ImageUpload from '@/components/ImageUpload';
import { uploadToCloudinary } from '../lib/cloudinary';

function useDebouncedValue(value, delay) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debounced;
}

// Custom hook to fetch alumni name by reg_id
function useAlumniNameByRegId(reg_id, shouldFetch) {
  const [alumniName, setAlumniName] = useState('');
  const [regIdExists, setRegIdExists] = useState(false);
  const debouncedRegId = useDebouncedValue(reg_id, 400);
  useEffect(() => {
    const fetchName = async () => {
      if (!debouncedRegId || String(debouncedRegId).length < 3 || !shouldFetch) {
        setAlumniName('');
        setRegIdExists(false);
        return;
      }
      // 1. Check reunion collection for existing registration
      const reunionQuery = query(
        collection(db, 'reunion'),
        where('reg_id', '==', Number(debouncedRegId))
      );
      const reunionSnap = await getDocs(reunionQuery);
      if (!reunionSnap.empty) {
        setAlumniName(''); // Already registered
        setRegIdExists(false);
        return;
      }
      // 2. Check alumni_db for name
      const alumniQuery = query(
        collection(db, 'alumni_db'),
        where('reg_id', '==', Number(debouncedRegId))
      );
      const alumniSnap = await getDocs(alumniQuery);
      if (!alumniSnap.empty) {
        const alumniData = alumniSnap.docs[0].data();
        setAlumniName(alumniData.name || '');
        setRegIdExists(true);
      } else {
        setAlumniName('');
        setRegIdExists(false);
      }
    };
    fetchName();
  }, [debouncedRegId, shouldFetch]);
  return { alumniName, regIdExists };
}

const initialForm = {
  reg_id: '',
  name: '',
  father: '',
  mother: '',
  education: '',
  working: false,
  company: '',
  position: '',
  email: '',
  mobile: '',
  whatsapp: '',
  address_present: '',
  address_permanent: '',
  same_address: false,
  photo: null,
};

const Reunion2k25 = () => {
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(false);
  const isMobile = useIsMobile();
  const [photoUrl, setPhotoUrl] = useState('');
  const [photoFile, setPhotoFile] = useState<File | null>(null);

  // Use the custom hook to get alumni name
  const { alumniName, regIdExists } = useAlumniNameByRegId(form.reg_id, !form.name);

  // Autofill name if alumniName is found and name is empty
  useEffect(() => {
    if (alumniName ) {
      setForm((prev) => ({ ...prev, name: alumniName }));
    }
  }, [alumniName]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name === 'same_address') {
      setForm((prev) => ({
        ...prev,
        same_address: checked,
        address_permanent: checked ? prev.address_present : prev.address_permanent,
      }));
    } else if (name === 'photo') {
      setForm((prev) => ({ ...prev, photo: e.target.files[0] }));
    } else {
      setForm((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
      if (name === 'address_present' && form.same_address) {
        setForm((prev) => ({ ...prev, address_permanent: value }));
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    // Check if reg_id exists in alumni_db before allowing registration
    if (!regIdExists) {
      toast.error('Registration number not found in alumni database. Please contact admin.', {
        position: isMobile ? 'top-center' : 'top-right',
      });
      setLoading(false);
      return;
    }
    try {
      let uploadedPhotoUrl = photoUrl;
      if (photoFile) {
        uploadedPhotoUrl = await uploadToCloudinary(photoFile);
      }
      // Prepare data
      const data = {
        reg_id: form.reg_id ? Number(form.reg_id) : '',
        name: form.name,
        father: form.father,
        mother: form.mother,
        education: form.education,
        working: form.working,
        company: form.working ? form.company : '',
        position: form.working ? form.position : '',
        email: form.email,
        mobile: form.mobile,
        whatsapp: form.whatsapp,
        address_present: form.address_present,
        address_permanent: form.address_permanent,
        photo: uploadedPhotoUrl,
      };
      await addDoc(collection(db, 'reunion'), data);
      setForm(initialForm);
      setPhotoUrl('');
      setPhotoFile(null);
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
          <label className="block text-xs font-medium mb-2" htmlFor="reg_id">Registration ID *</label>
          <Input id="reg_id" name="reg_id" type="number" value={form.reg_id} onChange={handleChange} required />
        </div>
        <div>
          <label className="block text-xs font-medium mb-2" htmlFor="name">Name *</label>
          <Input id="name" name="name" value={form.name} onChange={handleChange} required />
        </div>
        <div>
          <label className="block text-xs font-medium mb-2" htmlFor="father">Father's Name *</label>
          <Input id="father" name="father" value={form.father} onChange={handleChange} required />
        </div>
        <div>
          <label className="block text-xs font-medium mb-2" htmlFor="mother">Mother's Name *</label>
          <Input id="mother" name="mother" value={form.mother} onChange={handleChange} required />
        </div>
        <div>
          <label className="block text-xs font-medium mb-2" htmlFor="education">Educational Qualification *</label>
          <Input id="education" name="education" value={form.education} onChange={handleChange} required />
        </div>
        <div>
          <label className="block text-xs font-medium mb-2">Are you working?</label>
          <input id="working" name="working" type="checkbox" checked={form.working} onChange={handleChange} />
          <label htmlFor="working" className="text-xs ml-2">Yes</label>
        </div>
        {form.working && (
          <div className="flex gap-2">
            <div className="flex-1">
              <label className="block text-xs font-medium mb-2" htmlFor="company">Company *</label>
              <Input id="company" name="company" value={form.company} onChange={handleChange} required={form.working} />
            </div>
            <div className="flex-1">
              <label className="block text-xs font-medium mb-2" htmlFor="position">Position *</label>
              <Input id="position" name="position" value={form.position} onChange={handleChange} required={form.working} />
            </div>
          </div>
        )}
        <div>
          <label className="block text-xs font-medium mb-2" htmlFor="email">Email *</label>
          <Input id="email" name="email" type="email" value={form.email} onChange={handleChange} required />
        </div>
        <div>
          <label className="block text-xs font-medium mb-2" htmlFor="mobile">Mobile *</label>
          <Input id="mobile" name="mobile" type="number" value={form.mobile} onChange={handleChange} required />
        </div>
        <div>
          <label className="block text-xs font-medium mb-2" htmlFor="whatsapp">WhatsApp Number</label>
          <Input id="whatsapp" name="whatsapp" type="number" value={form.whatsapp} onChange={handleChange} />
        </div>
        <div>
          <label className="block text-xs font-medium mb-2" htmlFor="address_present">Present Address *</label>
          <textarea id="address_present" name="address_present" value={form.address_present} onChange={handleChange} required className="w-full border rounded p-2 resize-none" rows={1} />
        </div>
        <div className="flex items-center gap-2 mb-2">
          <input id="same_address" name="same_address" type="checkbox" checked={form.same_address} onChange={handleChange} />
          <label htmlFor="same_address" className="text-xs">Permanent address same as present</label>
        </div>
        <div>
          <label className="block text-xs font-medium mb-2" htmlFor="address_permanent">Permanent Address *</label>
          <textarea id="address_permanent" name="address_permanent" value={form.address_permanent} onChange={handleChange} required className="w-full border rounded p-2 resize-none" rows={1} />
        </div>
        <div>
          <label className="block text-xs font-medium mb-2">Photo</label>
          <ImageUpload
            onImageUpload={(url, file) => {
              setPhotoUrl(url);
              setPhotoFile(file || null);
            }}
            currentImage={photoUrl}
            fieldName="regPhoto"
          />
        </div>
        <Button className="w-full" disabled={loading || String(form.reg_id).length < 3 || !regIdExists}>{loading ? 'Submitting...' : 'Register'}</Button>
      </form>
    </div>
  );
};

export default Reunion2k25; 