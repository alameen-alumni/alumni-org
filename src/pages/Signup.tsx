import { useState, useEffect } from 'react';
import { Eye, EyeOff, User, Lock, Mail, X } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { db } from '../lib/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import ImageUpload from '@/components/ImageUpload';
import { useRef } from 'react';

// Debounce hook
function useDebouncedValue(value: any, delay: number) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debounced;
}

const Signup = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    passout_year: '',
    reg_id: '',
    photo: '',
    contact: { phone: '', whatsapp: '' },
    address: { present: '', permanent: '' },
    parent: { father: '', mother: '' },
    profession: { company: '', position: '', working: false },
    education: { qualification: '', mission: '' },
    info: {},
    same_address: false,
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { signup, loginWithGoogle, currentUser } = useAuth();
  const [regIdExists, setRegIdExists] = useState<boolean | null>(null);
  const [checkingRegId, setCheckingRegId] = useState(false);
  const [alumniName, setAlumniName] = useState('');
  const [sameMobile, setSameMobile] = useState(false);
  const navigate = useNavigate();

  const debouncedRegId = useDebouncedValue(form.reg_id, 400);

  // Check reg_id in alumni_db when reg_id changes and is not empty
  useEffect(() => {
    if (!debouncedRegId || String(debouncedRegId).length < 4) {
      setRegIdExists(null);
      setAlumniName('');
      return;
    }
    const checkRegId = async () => {
      setCheckingRegId(true);
      const q = query(collection(db, 'alumni_db'), where('reg_id', '==', Number(debouncedRegId)));
      const snap = await getDocs(q);
      if (!snap.empty) {
        setRegIdExists(true);
        const data = snap.docs[0].data();
        if (data.name && data.name !== form.name) {
          setAlumniName(data.name);
        }
      } else {
        setRegIdExists(false);
        setAlumniName('');
      }
      setCheckingRegId(false);
    };
    checkRegId();
  }, [debouncedRegId]);

  // Autofill name if alumniName changes and form.name is empty or different
  useEffect(() => {
    if (alumniName && alumniName !== form.name) {
      setForm((prev) => ({ ...prev, name: alumniName }));
    }
  }, [alumniName]);

  useEffect(() => {
    if (currentUser) {
      if (currentUser.admin) {
        navigate('/admin', { replace: true });
      } else {
        navigate('/dashboard', { replace: true });
      }
    }
  }, [currentUser, navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (name === 'sameMobile') {
      const checked = (e.target as HTMLInputElement).checked;
      setSameMobile(checked);
      if (checked) {
        setForm((prev) => ({ ...prev, contact: { ...prev.contact, whatsapp: prev.contact.phone } }));
      }
      return;
    }
    if (name.startsWith('contact.')) {
      setForm((prev) => ({ ...prev, contact: { ...prev.contact, [name.split('.')[1]]: value } }));
      if (name === 'contact.phone' && sameMobile) {
        setForm((prev) => ({ ...prev, contact: { ...prev.contact, whatsapp: value } }));
      }
    } else if (name.startsWith('address.')) {
      if (name === 'address.present' && form.same_address) {
        setForm((prev) => ({
          ...prev,
          address: { present: value, permanent: value },
        }));
      } else {
        setForm((prev) => ({ ...prev, address: { ...prev.address, [name.split('.')[1]]: value } }));
      }
    } else if (name.startsWith('parent.')) {
      setForm((prev) => ({ ...prev, parent: { ...prev.parent, [name.split('.')[1]]: value } }));
    } else if (name.startsWith('profession.')) {
      if (type === 'checkbox') {
        const checked = (e.target as HTMLInputElement).checked;
        setForm((prev) => ({ ...prev, profession: { ...prev.profession, [name.split('.')[1]]: checked } }));
        if (name === 'profession.working' && !checked) {
          setForm((prev) => ({ ...prev, profession: { ...prev.profession, company: '', position: '' } }));
        }
      } else {
        setForm((prev) => ({ ...prev, profession: { ...prev.profession, [name.split('.')[1]]: value } }));
      }
    } else if (name === 'same_address') {
      const checked = (e.target as HTMLInputElement).checked;
      setForm((prev) => ({
        ...prev,
        same_address: checked,
        address: checked ? { ...prev.address, permanent: prev.address.present } : prev.address,
      }));
    } else if (name.startsWith('education.')) {
      setForm((prev) => ({ ...prev, education: { ...prev.education, [name.split('.')[1]]: value } }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      if (form.password !== form.confirmPassword) {
        setError('Passwords do not match');
        setLoading(false);
        return;
      }
      // Check reg_id in alumni_db
      const q = query(collection(db, 'alumni_db'), where('reg_id', '==', Number(form.reg_id)));
      const snap = await getDocs(q);
      if (snap.empty) {
        setError('Registration ID not found in alumni database.');
        setLoading(false);
        return;
      }
      await signup(
        form.email,
        form.password,
        form.name,
        {
          name: form.name,
          passout_year: Number(form.passout_year),
          reg_id: Number(form.reg_id),
        }
      );
    } catch (err: any) {
      setError(err.message || 'Signup failed');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    setError(null);
    setLoading(true);
    try {
      await loginWithGoogle();
    } catch (err: any) {
      setError(err.message || 'Google authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-indigo-100 flex items-center justify-center py-3 px-4 relative">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-40"
        style={{ backgroundImage: `url('/msn2.png')` }}
      ></div>
      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-black/50 to-black/50"></div>
      <div className="w-full max-w-2xl rounded-lg md:shadow-xl bg-white overflow-hidden relative z-10 md:mx-0 mx-2 md:h-auto h-full flex flex-col justify-center">
        <div className="bg-teal-600 text-white p-2.5 text-center relative">
          <button
            onClick={() => navigate('/')}
            className="absolute top-2 right-2 p-1 hover:bg-teal-700 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          <h1 className="text-2xl font-bold">Join Our Community</h1>
          <p className="text-indigo-100 mt-1">Create your alumni account</p>
        </div>
        <div className="flex-1 md:px-6 py-2 px-4 overflow-y-auto">
          <form className="space-y-2.5" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-medium text-teal-700 mb-1.5">Registration ID</label>
              <input
                type="number"
                name="reg_id"
                value={form.reg_id}
                onChange={handleChange}
                placeholder="Enter your registration ID (numbers only)"
                className="w-full pl-4 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                required
                min={1}
                step={1}
              />
              {checkingRegId && <div className="text-xs text-gray-500 mt-1">Checking registration ID...</div>}
              {regIdExists === false && form.reg_id && !checkingRegId && (
                <div className="text-xs text-red-600 mt-1">Registration ID not found in alumni database.</div>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-teal-700 mb-1.5">Full Name</label>
              <div className="relative">
                <User className="absolute left-3 top-3 text-indigo-400" size={20} />
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  required
                />
                {alumniName && (
                  <div className="text-xs text-gray-500 mt-1">Name from alumni database: {alumniName}</div>
                )}
              </div>
            </div>
            {/* Collapse the rest of the form unless regIdExists is true */}
            {regIdExists === true && (
              <>
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-teal-700 mb-1.5">Mobile</label>
                    <input
                      type="text"
                      name="contact.phone"
                      value={form.contact.phone}
                      onChange={handleChange}
                      placeholder="Enter your mobile number"
                      className="w-full pl-4 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                  </div>
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-teal-700 mb-1.5">WhatsApp</label>
                    <input
                      type="text"
                      name="contact.whatsapp"
                      value={form.contact.whatsapp}
                      onChange={handleChange}
                      placeholder="Enter your WhatsApp number"
                      className="w-full pl-4 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      disabled={sameMobile}
                    />
                  </div>
                </div>
                <div className="flex items-center gap-2 mb-2">
                  <input
                    id="sameMobile"
                    name="sameMobile"
                    type="checkbox"
                    checked={sameMobile}
                    onChange={handleChange}
                  />
                  <label htmlFor="sameMobile" className="text-xs">Mobile and WhatsApp same number</label>
                </div>
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-teal-700 mb-1.5">Passout Year</label>
                    <select
                      name="passout_year"
                      value={form.passout_year}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      required
                    >
                      <option value="">Select year</option>
                      {Array.from({length: 2025-2000+1}, (_,i)=>2025-i).map(y => (
                        <option key={y} value={y}>{y}</option>
                      ))}
                    </select>
                  </div>
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-teal-700 mb-1.5">Last Class</label>
                    <select
                      name="education.mission"
                      value={form.education.mission}
                      onChange={handleChange}
                      className="w-full pl-4 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    >
                      <option value="">Select last class</option>
                      <option value="10">10</option>
                      <option value="12">12</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-teal-700 mb-1.5">Qualification</label>
                  <input
                    type="text"
                    name="education.qualification"
                    value={form.education.qualification}
                    onChange={handleChange}
                    placeholder="Enter your qualification"
                    className="w-full pl-4 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-teal-700 mb-1.5">Father's Name</label>
                    <input
                      type="text"
                      name="parent.father"
                      value={form.parent.father}
                      onChange={handleChange}
                      placeholder="Enter your father's name"
                      className="w-full pl-4 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                  </div>
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-teal-700 mb-1.5">Mother's Name</label>
                    <input
                      type="text"
                      name="parent.mother"
                      value={form.parent.mother}
                      onChange={handleChange}
                      placeholder="Enter your mother's name"
                      className="w-full pl-4 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                  </div>
                </div>
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-teal-700 mb-1.5">Present Address</label>
                    <input
                      type="text"
                      name="address.present"
                      value={form.address.present}
                      onChange={handleChange}
                      placeholder="Enter your present address"
                      className="w-full pl-4 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                  </div>
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-teal-700 mb-1.5">Permanent Address</label>
                    <input
                      type="text"
                      name="address.permanent"
                      value={form.address.permanent}
                      onChange={handleChange}
                      placeholder="Enter your permanent address"
                      className="w-full pl-4 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      disabled={form.same_address}
                    />
                  </div>
                </div>
                <div className="flex items-center gap-2 mb-2">
                  <input
                    id="same_address"
                    name="same_address"
                    type="checkbox"
                    checked={form.same_address}
                    onChange={handleChange}
                  />
                  <label htmlFor="same_address" className="text-xs">Permanent address same as present</label>
                </div>
                
                {form.profession.working && (
                  <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-teal-700 mb-1.5">Company</label>
                      <input
                        type="text"
                        name="profession.company"
                        value={form.profession.company}
                        onChange={handleChange}
                        placeholder="Enter your company"
                        className="w-full pl-4 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      />
                    </div>
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-teal-700 mb-1.5">Position</label>
                      <input
                        type="text"
                        name="profession.position"
                        value={form.profession.position}
                        onChange={handleChange}
                        placeholder="Enter your position"
                        className="w-full pl-4 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                )}
                <div>
                  <label className="block text-sm font-medium text-teal-700 mb-1.5">Working</label>
                  <input
                    type="checkbox"
                    name="profession.working"
                    checked={form.profession.working}
                    onChange={handleChange}
                    className="mr-2"
                  />
                  <span className="text-sm">Currently Working</span>
                </div>
                <div>
                  <label className="block text-sm font-medium text-teal-700 mb-1.5">Photo</label>
                  <ImageUpload
                    onImageUpload={(url) => setForm((prev) => ({ ...prev, photo: url }))}
                    currentImage={form.photo}
                    fieldName="signupPhoto"
                  />
                </div>
              </>
            )}
            {error && <div className="text-red-600 text-sm text-center">{error}</div>}
            <button
              type="submit"
              className="w-full bg-teal-600 text-white py-3 rounded-lg font-semibold hover:bg-teal-700 transition-colors"
              disabled={loading || regIdExists !== true}
            >
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>
          <div className="mt-4 flex flex-col gap-2">
            <button
              type="button"
              onClick={handleGoogle}
              className="w-full flex items-center justify-center gap-2 border border-gray-300 py-2 rounded-lg hover:bg-gray-50 transition-colors"
              disabled={loading}
            >
              <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-5 h-5" />
              <span>Sign up with Google</span>
            </button>
          </div>
          <div className="mt-6 text-center">
            <p className="text-indigo-600">
              Already have an account?{' '}
              <Link
                to="/login"
                className="text-indigo-600 hover:text-indigo-700 font-medium"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup; 