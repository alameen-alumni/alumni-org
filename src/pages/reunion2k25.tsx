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
  education: {
    admit_class: '',
    admit_year: '',
    current_class: '',
    last_class: '',
    passout_year: '',
    scholarship: false,
    study: false,
    year_of_grad: '',
    curr_college: '',
    curr_degree: '',
  },
  profession: {
    company: '',
    position: '',
    working: false,
  },
  info: {
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
    blood: {
      group: '',
      isDonating: '',
    },
    photo: '',
  },
  event: {
    present: '', // Will you appear on reunion: yes, no, maybe
    reg_fee: 1, // Fixed registration fee of ₹1
    perks: {
      welcome_gift: false,
      jacket: false,
      special_gift_hamper: false,
      to_pay: 0,
    },
  },
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
          info: {
            ...prev.info,
            contact: { ...prev.info.contact, whatsapp: prev.info.contact.mobile },
          },
        }));
      }
      return;
    }
    if (name.includes('.')) {
      const parts = name.split('.');
      if (parts.length === 2) {
        // Simple case: group.field
        const [group, field] = parts;
        setForm((prev) => ({
          ...prev,
          [group]: {
            ...prev[group],
            [field]: type === 'checkbox' ? checked : value,
          },
        }));
      } else if (parts.length === 3) {
        // Nested case: group.subgroup.field
        const [group, subgroup, field] = parts;
        setForm((prev) => ({
          ...prev,
          [group]: {
            ...prev[group],
            [subgroup]: {
              ...prev[group]?.[subgroup],
              [field]: type === 'checkbox' ? checked : value,
            },
          },
        }));
      }
      if (name === 'info.address.present' && form.same_address) {
        setForm((prev) => ({
          ...prev,
          info: {
            ...prev.info,
            address: {
              ...prev.info.address,
              present: value,
              permanent: value,
            },
          },
        }));
      }
      if (name === 'info.contact.mobile' && sameMobile) {
        setForm((prev) => ({
          ...prev,
          info: {
            ...prev.info,
            contact: { ...prev.info.contact, whatsapp: value },
          },
        }));
      }
    } else if (name === 'same_address') {
      setForm((prev) => ({
        ...prev,
        same_address: checked,
        info: {
          ...prev.info,
          address: checked
            ? { ...prev.info.address, permanent: prev.info.address.present }
            : prev.info.address,
        },
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
    if (!form.reg_id || !form.name || !form.event.present) return 'Registration ID, Name, and Reunion attendance are required.';
    // Step 2
    if (step === 2 && (!form.info.contact.mobile || !form.info.contact.email || !form.password)) return 'Mobile, Email, and Password are required.';
    // Step 3
    if (step >= 3 && (!form.education.admit_year || !form.education.admit_class || !form.education.passout_year || !form.education.last_class || !form.education.current_class || !form.education.curr_college || !form.education.curr_degree)) return 'All mission details including current college and degree are required.';
    if (step >= 3 && form.education.study && (form.education.year_of_grad === '' || form.education.scholarship === undefined)) return 'Year of Graduation and Scholarship are required if currently studying.';
    // Step 4
    if (step >= 4 && (!form.info.parent.father || !form.info.parent.mother || !form.info.address.present || !form.info.address.permanent || !form.info.blood.group || !form.info.blood.isDonating)) return 'Parent names, addresses, blood group, and donation preference are required.';
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
      // Update form with photo URL
      if (uploadedPhotoUrl) {
        setForm(prev => ({
          ...prev,
          info: {
            ...prev.info,
            photo: uploadedPhotoUrl
          }
        }));
      }
      const email = form.info.contact.email;
      const password = form.password;
      if (!email) {
        toast.error('Email is required to register.', { position: isMobile ? 'top-center' : 'top-right' });
        setLoading(false);
        return;
      }
      // 1. Check if email is already registered in reunion
      const reunionEmailQuery = query(
        collection(db, 'reunion'),
        where('info.contact.email', '==', email)
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
        event: { ...form.event },
        info: {
          address: { ...form.info.address },
          contact: {
            ...form.info.contact,
            mobile: form.info.contact.mobile ? Number(form.info.contact.mobile) : '',
            whatsapp: form.info.contact.whatsapp ? Number(form.info.contact.whatsapp) : '',
          },
          parent: { ...form.info.parent },
          blood: { ...form.info.blood },
          photo: form.info.photo,
        },
        uid: userCredential.user.uid, // Save Firebase Auth UID for reference
        createdAt: new Date(), // Add timestamp for when registration was created
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
                setForm={setForm}
              />
            )}
          </form>
        </div>
        </div>
    </div>
  );
};

export default Reunion2k25; 