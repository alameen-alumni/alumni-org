import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { db } from '../lib/firebase';
import { addDoc, collection, getDocs, query, where } from 'firebase/firestore';
import { toast } from '@/components/ui/sonner';
import { useIsMobile } from '../hooks/use-mobile';
import ImageUpload from '@/components/ImageUpload';
import { uploadToCloudinary } from '../lib/cloudinary';
import bcrypt from 'bcryptjs';
import { auth } from '../lib/firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { useDebouncedValue } from '../hooks/use-debounced-value';
import { useAlumniNameByRegId } from '../hooks/use-alumni-name-by-regid';
import StepBasicInfo from './reunion2k25/StepBasicInfo';
import StepContact from './reunion2k25/StepContact';
import StepMission from './reunion2k25/StepMission';
import StepParentAddress from './reunion2k25/StepParentAddress';
import StepProfession from './reunion2k25/StepProfession';

// Reunion2k25 form schema update
const initialForm = {
  reg_id: '',
  name: '',
  password: '',
  photo: '',
  education: {
    admit_class: '',
    admit_year: '',
    current_class: '',
    last_class: '',
    passout_year: '',
    scholarship: false,
    study: false,
    year_of_grad: '',
  },
  address: {
    present: '',
    permanent: '',
  },
  contact: {
  email: '',
  mobile: '',
  whatsapp: '',
  },
  parent: {
    father: '',
    mother: '',
  },
  profession: {
    company: '',
    position: '',
    working: false,
  },
  info: {},
  same_address: false, // <-- add this back
  same_whatsapp: false, // <-- add this back
};

const Reunion2k25 = () => {
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(false);
  const isMobile = useIsMobile();
  const [photoUrl, setPhotoUrl] = useState('');
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [step, setStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [sameMobile, setSameMobile] = useState(false);

  // Use the custom hook to get alumni name
  const { alumniName, regIdExists } = useAlumniNameByRegId(form.reg_id, step === 1 && String(form.reg_id).length > 3);

  // Autofill name if alumniName is found and name is empty
  useEffect(() => {
    if (alumniName) {
      setForm((prev) => ({ ...prev, name: alumniName }));
    }
  }, [alumniName]);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name === 'sameMobile') {
      setSameMobile(checked);
      if (checked) {
        setForm((prev) => ({
          ...prev,
          contact: { ...prev.contact, whatsapp: prev.contact.mobile },
        }));
      }
      return;
    }
    if (name.includes('.')) {
      const [group, field] = name.split('.');
      setForm((prev) => ({
        ...prev,
        [group]: {
          ...prev[group],
          [field]: type === 'checkbox' ? checked : value,
        },
      }));
      if (name === 'address.present' && form.same_address) {
        setForm((prev) => ({
          ...prev,
          address: {
            ...prev.address,
            present: value,
            permanent: value,
          },
        }));
      }
      if (name === 'contact.mobile' && sameMobile) {
        setForm((prev) => ({
          ...prev,
          contact: { ...prev.contact, whatsapp: value },
        }));
      }
    } else if (name === 'same_address') {
      setForm((prev) => ({
        ...prev,
        same_address: checked,
        address: checked
          ? { ...prev.address, permanent: prev.address.present }
          : prev.address,
      }));
    } else if (name === 'photo') {
      setPhotoFile(e.target.files[0]);
    } else {
      setForm((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    }
  };

  // Step navigation
  const handleContinue = () => {
    const validationError = validateRequiredFields();
    if (validationError) {
      toast.error(validationError, { position: isMobile ? 'top-center' : 'top-right' });
      return;
    }
    setStep((s) => s + 1);
  };
  const handleBack = () => setStep((s) => s - 1);

  // Password hashing before submit
  const hashPassword = async (plain) => {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(plain, salt);
  };

  // Helper: check required fields
  function validateRequiredFields() {
    // Step 1
    if (!form.reg_id || !form.name) return 'Registration ID and Name are required.';
    // Step 2
    if (step === 2 && (!form.contact.mobile || !form.contact.email || !form.password)) return 'Mobile, Email, and Password are required.';
    // Step 3
    if (step >= 3 && (!form.education.admit_year || !form.education.admit_class || !form.education.passout_year || !form.education.last_class || !form.education.current_class)) return 'All mission details are required.';
    if (step >= 3 && form.education.study && (form.education.year_of_grad === '' || form.education.scholarship === undefined)) return 'Year of Graduation and Scholarship are required if currently studying.';
    // Step 4
    if (step >= 4 && (!form.parent.father || !form.parent.mother || !form.address.present || !form.address.permanent)) return 'Parent names and both addresses are required.';
    // Step 5
    if (step >= 5 && form.profession.working && (!form.profession.company || !form.profession.position)) return 'Company and Position are required if working.';
    return null;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationError = validateRequiredFields();
    if (validationError) {
      toast.error(validationError, { position: isMobile ? 'top-center' : 'top-right' });
      return;
    }
    setLoading(true);
    try {
      let uploadedPhotoUrl = photoUrl;
      if (photoFile) {
        uploadedPhotoUrl = await uploadToCloudinary(photoFile);
      }
      const email = form.contact.email;
      const password = form.password;
      if (!email) {
        toast.error('Email is required to register.', { position: isMobile ? 'top-center' : 'top-right' });
        setLoading(false);
        return;
      }
      // 1. Check if email is already registered in reunion
      const reunionEmailQuery = query(
        collection(db, 'reunion'),
        where('contact.email', '==', email)
      );
      const reunionEmailSnap = await getDocs(reunionEmailQuery);
      if (!reunionEmailSnap.empty) {
        toast.error('This email is already registered for the reunion. Please use another email or log in.', { position: isMobile ? 'top-center' : 'top-right' });
        setLoading(false);
        return;
      }
      // 2. Create Firebase Auth user
      let userCredential;
      try {
        userCredential = await createUserWithEmailAndPassword(auth, email, password);
      } catch (err) {
        toast.error(
          err.code === 'auth/email-already-in-use'
            ? 'Email already in use. Please use another email or log in.'
            : err.message || 'Failed to create user. Please try again.',
          { position: isMobile ? 'top-center' : 'top-right' }
        );
        setLoading(false);
        return;
      }
      // 3. Hash password for Firestore (optional, for reference only)
      let hashedPassword = password;
      if (password) {
        hashedPassword = await hashPassword(password);
      }
      // 4. Prepare data for Firestore
      const data = {
        reg_id: form.reg_id ? Number(form.reg_id) : '',
        name: form.name,
        password: hashedPassword,
        education: {
          ...form.education,
          admit_class: form.education.admit_class ? Number(form.education.admit_class) : '',
          admit_year: form.education.admit_year ? Number(form.education.admit_year) : '',
          last_class: form.education.last_class ? Number(form.education.last_class) : '',
          passout_year: form.education.passout_year ? Number(form.education.passout_year) : '',
          year_of_grad: form.education.year_of_grad ? Number(form.education.year_of_grad) : '',
        },
        profession: { ...form.profession },
        role: 'user',
        info: {
          address: { ...form.address },
          contact: {
            ...form.contact,
            mobile: form.contact.mobile ? Number(form.contact.mobile) : '',
            whatsapp: form.contact.whatsapp ? Number(form.contact.whatsapp) : '',
          },
          parent: { ...form.parent },
          photo: form.photo,
          ...form.info,
        },
        uid: userCredential.user.uid, // Save Firebase Auth UID for reference
      };
      // 5. Save to Firestore
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

  // Render steps
  const totalSteps = 5;
  const stepLabels = [
    'Basic Info',
    'Contact & Password',
    'Mission Details',
    'Parent & Address',
    'Profession & Photo',
  ];

  return (
    <div className=" bg-gradient-to-br from-indigo-50 to-indigo-100 flex justify-center py-10 px-4 relative">
      <div className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-40" style={{ backgroundImage: `url('/msn2.png')` }}></div>
      <div className="absolute inset-0 bg-gradient-to-br from-black/50 to-black/50"></div>
      <div className="w-full max-w-2xl rounded-lg md:shadow-xl bg-white overflow-hidden relative z-10 md:mx-0 mx-2 md:h-auto h-full flex flex-col justify-center">
        {/* Step Status Bar */}
        <div className="w-full px-6 pt-3.5 pb-2">
          <div className="flex items-center justify-between mb-2">
            {stepLabels.map((label, idx) => (
              <div key={label} className="flex-1 flex flex-col items-center">
                <div className={`w-6 h-6 flex items-center justify-center rounded-full border-2 text-xs font-bold transition-all duration-200 ${step === idx + 1 ? 'bg-teal-600 text-white border-teal-600' : step > idx + 1 ? 'bg-teal-400 text-white border-teal-400' : 'bg-white text-teal-600 border-teal-200'}`}>{idx + 1}</div>
                <span className={`mt-1 text-xs text-center ${step === idx + 1 ? 'text-teal-700 font-semibold' : 'text-gray-400'}`}>{label}</span>
        </div>
            ))}
        </div>
          <div className="w-full h-2 bg-teal-100 rounded-full relative">
            <div className="h-2 bg-teal-500 rounded-full transition-all duration-300" style={{ width: `${(step - 1) / (totalSteps - 1) * 100}%` }}></div>
          </div>
          {/* <div className="text-right text-xs text-gray-500 mt-1">Step {step} of {totalSteps}</div> */}
        </div>
        <div className="bg-teal-600 text-white p-2.5 text-center">
          <h1 className="text-2xl font-bold">Reunion 2K25 Registration</h1>
        </div>
        <div className="flex-1 md:px-6 py-2 px-4 overflow-y-auto">
          <form className="space-y-2.5" onSubmit={step === 5 ? handleSubmit : (e) => { e.preventDefault(); handleContinue(); }}>
            {step === 1 && (
              <StepBasicInfo
                form={form}
                handleChange={handleChange}
                alumniName={alumniName}
                regIdExists={regIdExists}
                handleContinue={handleContinue}
              />
            )}
            {step === 2 && (
              <StepContact
                form={form}
                handleChange={handleChange}
                handleBack={handleBack}
                handleContinue={handleContinue}
              />
            )}
            {step === 3 && (
              <StepMission
                form={form}
                handleChange={handleChange}
                handleBack={handleBack}
                handleContinue={handleContinue}
              />
            )}
            {step === 4 && (
              <StepParentAddress
                form={form}
                handleChange={handleChange}
                handleBack={handleBack}
                handleContinue={handleContinue}
              />
            )}
            {step === 5 && (
              <StepProfession
                form={form}
                handleChange={handleChange}
                handleBack={handleBack}
                setPhotoUrl={setPhotoUrl}
                setPhotoFile={setPhotoFile}
                loading={loading}
              />
            )}
          </form>
        </div>
        </div>
    </div>
  );
};

export default Reunion2k25; 