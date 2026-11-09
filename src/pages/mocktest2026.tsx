import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/sonner";
import {
  addDoc,
  collection,
  getDocs,
  limit,
  orderBy,
  query,
  where
} from "firebase/firestore";
import { CheckCircle, X } from "lucide-react";
import { Suspense, useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useIsMobile } from "../hooks/use-mobile";
import { db } from "../lib/firebase";
import { lazyWithRetry } from '../utils/lazy-loading';
import { z } from 'zod';

// Lazy load step components with retry mechanism
const StepAlumniCheck = lazyWithRetry(() => import("./mocktest2026/StepAlumniCheck"));
const StepPersonalDetails = lazyWithRetry(() => import("./mocktest2026/StepPersonalDetails"));
const StepEducation = lazyWithRetry(() => import("./mocktest2026/StepEducation"));
const StepExamPreparation = lazyWithRetry(() => import("./mocktest2026/StepExamPreparation"));

// Loading component for step components
const StepLoader = () => (
  <div className="flex items-center justify-center h-32">
    <div className="flex flex-col items-center space-y-2">
      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#186F65]"></div>
      <p className="text-gray-600 text-sm">Loading step...</p>
    </div>
  </div>
);

// Zod validation schemas
const nameSchema = z.string()
  .min(2, "Name must be at least 2 characters")
  .regex(/^[a-zA-Z\s.'-]+$/, "Name can only contain letters, spaces, dots, hyphens and apostrophes");

const mobileSchema = z.string()
  .length(10, "Mobile number must be exactly 10 digits")
  .regex(/^[0-9]{10}$/, "Mobile number must contain only digits");

const emailSchema = z.string()
  .email("Please enter a valid email address");

const percentageSchema = z.number()
  .min(0, "Percentage cannot be negative")
  .max(100, "Percentage cannot exceed 100");

const yearSchema = z.number()
  .min(1950, "Please enter a valid year")
  .max(new Date().getFullYear() + 5, "Year cannot be in the far future");

// Initial form state
const initialForm = {
  is_alumni: "",
  reg_id: "",
  name: "",
  father_name: "",
  mobile: "",
  email: "",
  address: "",
  secondary_year: "",
  secondary_percentage: "",
  higher_secondary_year: "",
  higher_secondary_percentage: "",
  higher_secondary_stream: "",
  graduation_year: "",
  graduation_percentage: "",
  graduation_stream: "",
  post_graduation: "",
  bed: "",
  qualified_exams: "",
  preparing_for: "",
};

const MockTest2026 = () => {
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submittedData, setSubmittedData] = useState(null);
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [alreadyRegisteredInMockTest, setAlreadyRegisteredInMockTest] = useState(false);
  const [alumniName, setAlumniName] = useState('');
  const [regIdExists, setRegIdExists] = useState(false);
  const [isLoadingAlumni, setIsLoadingAlumni] = useState(false);

  // Check alumni database for name - independent of reunion
  useEffect(() => {
    const fetchAlumniName = async () => {
      if (form.is_alumni === 'yes' && form.reg_id && String(form.reg_id).length > 3) {
        setIsLoadingAlumni(true);
        try {
          const alumniQuery = query(
            collection(db, 'alumni_db'),
            where('reg_id', '==', Number(form.reg_id)),
            limit(1)
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
        } catch (error) {
          console.error('Error fetching alumni name:', error);
          setAlumniName('');
          setRegIdExists(false);
        } finally {
          setIsLoadingAlumni(false);
        }
      } else {
        setAlumniName('');
        setRegIdExists(false);
        setIsLoadingAlumni(false);
      }
    };

    const timeoutId = setTimeout(fetchAlumniName, 400); // Debounce
    return () => clearTimeout(timeoutId);
  }, [form.reg_id, form.is_alumni]);

  // Check if already registered in mock test
  useEffect(() => {
    const checkMockTestRegistration = async () => {
      if (form.is_alumni === 'yes' && form.reg_id && String(form.reg_id).length > 3) {
        try {
          const mockTestQuery = query(
            collection(db, 'mocktest'),
            where('reg_id', '==', Number(form.reg_id)),
            limit(1)
          );
          const mockTestSnap = await getDocs(mockTestQuery);
          setAlreadyRegisteredInMockTest(!mockTestSnap.empty);
        } catch (error) {
          console.error('Error checking mock test registration:', error);
          setAlreadyRegisteredInMockTest(false);
        }
      } else {
        setAlreadyRegisteredInMockTest(false);
      }
    };

    checkMockTestRegistration();
  }, [form.reg_id, form.is_alumni]);

  // Autofill name if alumniName is found
  useEffect(() => {
    if (alumniName && form.is_alumni === 'yes') {
      setForm((prev) => ({ ...prev, name: alumniName }));
    }
  }, [alumniName, form.is_alumni]);

  // Handle input changes
  const handleChange = useCallback((e) => {
    const { name, value, type, checked } = e.target;
    
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  }, []);

  // Step navigation
  const handleContinue = () => {
    const validationError = validateRequiredFields();
    if (validationError) {
      toast.error(validationError, {
        position: isMobile ? "top-center" : "top-right",
      });
      return;
    }
    setStep((s) => s + 1);
  };

  const handleBack = () => {
    setStep((s) => s - 1);
  };

  // Handle close button click - redirect to home
  const handleClose = () => {
    navigate("/");
  };

  // Helper: check required fields with Zod validation
  function validateRequiredFields(targetStep = step) {
    // Step 1
    if (targetStep === 1) {
      if (!form.is_alumni) return "Please select if you are an alumni or not.";
      if (form.is_alumni === 'yes' && !regIdExists) return "Please enter a valid registration ID.";
      if (form.is_alumni === 'yes' && alreadyRegisteredInMockTest) return "This registration ID is already registered for the mock test.";
      
      if (form.is_alumni === 'no' && !form.name) return "Please enter your name.";
      if (form.is_alumni === 'no' && form.name) {
        try {
          nameSchema.parse(form.name);
        } catch (error) {
          return error.errors[0]?.message || "Invalid name format";
        }
      }
    }
    
    // Step 2
    if (targetStep === 2) {
      if (!form.father_name || !form.mobile || !form.email || !form.address) {
        return "All personal details are required.";
      }
      
      // Validate father's name
      try {
        nameSchema.parse(form.father_name);
      } catch (error) {
        return "Father's name: " + (error.errors[0]?.message || "Invalid format");
      }
      
      // Validate mobile
      try {
        mobileSchema.parse(form.mobile);
      } catch (error) {
        return error.errors[0]?.message || "Invalid mobile number";
      }
      
      // Validate email
      try {
        emailSchema.parse(form.email);
      } catch (error) {
        return error.errors[0]?.message || "Invalid email address";
      }
    }
    
    // Step 3
    if (targetStep === 3) {
      if (
        !form.secondary_year ||
        !form.secondary_percentage ||
        !form.higher_secondary_year ||
        !form.higher_secondary_percentage ||
        !form.higher_secondary_stream ||
        !form.graduation_year ||
        !form.graduation_percentage ||
        !form.graduation_stream ||
        !form.post_graduation ||
        !form.bed
      ) {
        return "All education details are required.";
      }
      
      // Validate years
      try {
        yearSchema.parse(Number(form.secondary_year));
        yearSchema.parse(Number(form.higher_secondary_year));
        yearSchema.parse(Number(form.graduation_year));
      } catch (error) {
        return "Year: " + (error.errors[0]?.message || "Invalid year");
      }
      
      // Validate percentages
      try {
        percentageSchema.parse(Number(form.secondary_percentage));
        percentageSchema.parse(Number(form.higher_secondary_percentage));
        percentageSchema.parse(Number(form.graduation_percentage));
      } catch (error) {
        return "Percentage: " + (error.errors[0]?.message || "Invalid percentage");
      }
    }
    
    // Step 4
    if (targetStep === 4 && !form.preparing_for) {
      return "Please specify which exam you are preparing for.";
    }
    
    return null;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Re-check every step, not just the current one, before saving.
    for (let s = 1; s <= 4; s++) {
      const validationError = validateRequiredFields(s);
      if (validationError) {
        toast.error(validationError, {
          position: isMobile ? "top-center" : "top-right",
        });
        setStep(s);
        return;
      }
    }

    // Show loading toast
    const loadingToast = toast.loading("Processing your registration...", {
      position: isMobile ? "top-center" : "top-right",
    });

    setLoading(true);
    try {
      // Check if email is already registered in mocktest
      const mocktestEmailQuery = query(
        collection(db, "mocktest"),
        where("email", "==", form.email)
      );
      const mocktestEmailSnap = await getDocs(mocktestEmailQuery);
      if (!mocktestEmailSnap.empty) {
        toast.dismiss(loadingToast);
        toast.error(
          "This email is already registered for the mock test. You have already submitted your registration. Please wait while our administration confirms your status.",
          { position: isMobile ? "top-center" : "top-right", duration: 7000 }
        );
        setLoading(false);
        return;
      }

      // Compute next registration number in format AAMM0001
      let nextRegNo = 'AAMM0001';
      try {
        const regNoQuery = query(
          collection(db, 'mocktest'),
          orderBy('mock_reg_no_numeric', 'desc'),
          limit(1)
        );
        const regNoSnap = await getDocs(regNoQuery);
        if (!regNoSnap.empty) {
          const topNumeric = regNoSnap.docs[0].data().mock_reg_no_numeric;
          const nextNumeric = topNumeric ? Number(topNumeric) + 1 : 1;
          nextRegNo = `AAMM${String(nextNumeric).padStart(4, '0')}`;
        }
      } catch (e) {
        console.warn('Could not compute next registration number, defaulting to AAMM0001', e);
        nextRegNo = 'AAMM0001';
      }

      // Extract numeric value for sorting
      const numericValue = parseInt(nextRegNo.replace('AAMM', '')) || 1;

      // Prepare data for Firestore
      const data = {
        is_alumni: form.is_alumni,
        reg_id: form.is_alumni === 'yes' ? Number(form.reg_id) : null,
        name: form.name,
        father_name: form.father_name,
        mobile: form.mobile,
        email: form.email,
        address: form.address,
        education: {
          secondary: {
            year: Number(form.secondary_year),
            percentage: Number(form.secondary_percentage),
          },
          higher_secondary: {
            year: Number(form.higher_secondary_year),
            percentage: Number(form.higher_secondary_percentage),
            stream: form.higher_secondary_stream,
          },
          graduation: {
            year: Number(form.graduation_year),
            percentage: Number(form.graduation_percentage),
            stream: form.graduation_stream,
          },
          post_graduation: form.post_graduation,
          bed: form.bed,
          qualified_exams: form.qualified_exams,
        },
        preparing_for: form.preparing_for,
        mock_reg_no: nextRegNo,
        mock_reg_no_numeric: numericValue, // For sorting purposes
        createdAt: new Date().toISOString(),
      };

      // Save to Firestore
      const savedDoc = await addDoc(collection(db, "mocktest"), data);
      console.log("Document saved successfully with ID:", savedDoc.id);

      // Dismiss loading toast and show success
      toast.dismiss(loadingToast);
      toast.success("Registration completed successfully!", {
        position: isMobile ? "top-center" : "top-right",
        duration: 3000,
      });

      setSubmittedData({
        name: form.name,
        email: form.email,
        mobile: form.mobile,
        mock_reg_no: nextRegNo,
        is_alumni: form.is_alumni,
        reg_id: form.reg_id,
        createdAt: new Date().toISOString(),
      });
      setSubmitted(true);
      setForm(initialForm);
    } catch (err) {
      // Dismiss loading toast and show specific error
      toast.dismiss(loadingToast);
      console.error("Registration error:", err);

      let errorMessage = "Failed to submit registration. Please try again.";
      if (err.message && err.message.includes("network")) {
        errorMessage = "Network error. Please check your internet connection and try again.";
      }

      toast.error(errorMessage, {
        position: isMobile ? "top-center" : "top-right",
        duration: 5000,
      });
    } finally {
      setLoading(false);
    }
  };

  // Render steps
  const totalSteps = 4;
  const stepLabels = [
    "Alumni Check",
    "Personal Details",
    "Education",
    "Exam Preparation",
  ];

  // Show confirmation page if submitted
  if (submitted && submittedData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-indigo-100 flex justify-center items-center py-5 px-4 relative">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-40 min-h-screen"
          style={{ backgroundImage: `url('/msn2.png')` }}
        ></div>
        <div className="absolute inset-0 bg-gradient-to-br from-black/50 to-black/50"></div>
        <div className="w-full max-w-3xl rounded-lg md:shadow-xl bg-white overflow-hidden relative z-10 md:mx-0 mx-2 h-auto">
          {/* Header */}
          <div className="bg-teal-600 text-white p-2.5 text-center relative">
            <h1 className="text-2xl font-bold">Registration Successful!</h1>
            <button
              onClick={handleClose}
              className="absolute top-2 right-2 p-1 hover:bg-teal-700 rounded transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Confirmation Content */}
          <div className="p-4 space-y-2">
            {/* Success Icon */}
            <div className="flex justify-center">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
            </div>

            {/* Success Message */}
            <div className="text-center space-y-2">
              <h2 className="text-xl font-semibold text-gray-900">
                Thank you for registering!
              </h2>
              <p className="text-gray-600">
                Your mock test registration has been submitted successfully.
              </p>
            </div>

            {/* Registration Details */}
            <div className="bg-gray-50 rounded-lg p-4 space-y-1.5">
              <h3 className="font-semibold text-gray-900">
                Registration Details:
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Mock Test Registration No:</span>
                  <span className="font-bold text-teal-600 text-lg">{submittedData.mock_reg_no}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Name:</span>
                  <span className="font-medium">{submittedData.name}</span>
                </div>
                {submittedData.is_alumni === 'yes' && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Alumni Registration ID:</span>
                    <span className="font-medium">{submittedData.reg_id}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-gray-600">Email:</span>
                  <span className="font-medium">{submittedData.email}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Mobile:</span>
                  <span className="font-medium">{submittedData.mobile}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Registration Date:</span>
                  <span className="font-medium">
                    {new Date(submittedData.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>

            {/* Important Notice */}
            <div className="bg-yellow-50 rounded-lg p-3 border border-yellow-200">
              <h4 className="font-semibold text-yellow-900 mb-2 text-sm sm:text-base flex items-center gap-2">
                <span>📸</span> Important - Please Take a Screenshot!
              </h4>
              <p className="text-xs sm:text-sm text-yellow-800">
                Please take a screenshot of this page with your registration number <strong>({submittedData.mock_reg_no})</strong> for your records. 
                This will help us navigate and identify you easily during the mock test.
              </p>
            </div>

            {/* Additional Information */}
            <div className="bg-blue-50 rounded-lg p-3">
              <h4 className="font-semibold text-blue-900 mb-2 text-sm sm:text-base">
                What's Next?
              </h4>
              <ul className="text-xs sm:text-sm text-blue-800 space-y-1">
                <li>• You will receive a confirmation email shortly</li>
                <li>• Mock test details will be shared via email and WhatsApp</li>
                <li>• Keep your registration number handy for the test day</li>
                <li>• Contact the Core Team if you have any questions</li>
              </ul>
            </div>

            {/* Close Button */}
            <div className="flex justify-center pt-4">
              <Button
                onClick={handleClose}
                className="bg-teal-600 hover:bg-teal-700 text-white px-8 py-3"
              >
                Back to Home
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-indigo-100 flex justify-center items-center py-5 sm:px-4 relative">
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-40 min-h-screen"
        style={{ backgroundImage: `url('/msn2.png')` }}
      ></div>
      <div className="absolute inset-0 bg-gradient-to-br from-black/50 to-black/50"></div>
      <div className="w-full max-w-2xl rounded-lg md:shadow-xl bg-white overflow-hidden relative z-10 md:mx-0 mx-2 h-auto flex flex-col">
        {/* Step Status Bar */}
        <div className="w-full sm:px-6 pt-3.5 pb-2">
          <div className="flex items-center justify-between mb-2">
            {stepLabels.map((label, idx) => (
              <div key={label} className="flex-1 flex flex-col items-center">
                <div
                  className={`w-6 h-6 flex items-center justify-center rounded-full border-2 text-xs font-bold transition-all duration-200 ${
                    step === idx + 1
                      ? "bg-teal-600 text-white border-teal-600"
                      : step > idx + 1
                      ? "bg-teal-400 text-white border-teal-400"
                      : "bg-white text-teal-600 border-teal-200"
                  }`}
                >
                  {idx + 1}
                </div>
                <span
                  className={`mt-1 text-[9px] sm:text-xs text-center ${
                    step === idx + 1
                      ? "text-teal-700 font-semibold"
                      : "text-gray-400"
                  }`}
                >
                  {label}
                </span>
              </div>
            ))}
          </div>
          <div className="w-full h-2 bg-teal-100 rounded-full relative">
            <div
              className="h-2 bg-teal-500 rounded-full transition-all duration-300"
              style={{ width: `${((step - 1) / (totalSteps - 1)) * 100}%` }}
            ></div>
          </div>
        </div>
        <div className="bg-teal-600 text-white p-2.5 text-center relative">
          <button
            onClick={() => navigate("/")}
            className="absolute top-2 right-2 p-1 hover:bg-teal-700 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          <h1 className="text-xl md:text-2xl font-bold">Mock Test Registration 2026</h1>
        </div>
        <div className="flex-1 md:px-6 py-2 px-4 overflow-y-auto">
          <form
            className="space-y-2.5"
            onSubmit={
              step === 4
                ? handleSubmit
                : (e) => {
                    e.preventDefault();
                    handleContinue();
                  }
            }
          >
            {step === 1 && (
              <Suspense fallback={<StepLoader />}>
                <StepAlumniCheck
                  form={form}
                  handleChange={handleChange}
                  alumniName={alumniName}
                  regIdExists={regIdExists}
                  alreadyRegistered={alreadyRegisteredInMockTest}
                  isLoading={isLoadingAlumni}
                  handleContinue={handleContinue}
                />
              </Suspense>
            )}
            {step === 2 && (
              <Suspense fallback={<StepLoader />}>
                <StepPersonalDetails
                  form={form}
                  handleChange={handleChange}
                  handleBack={handleBack}
                  handleContinue={handleContinue}
                />
              </Suspense>
            )}
            {step === 3 && (
              <Suspense fallback={<StepLoader />}>
                <StepEducation
                  form={form}
                  handleChange={handleChange}
                  handleBack={handleBack}
                  handleContinue={handleContinue}
                />
              </Suspense>
            )}
            {step === 4 && (
              <Suspense fallback={<StepLoader />}>
                <StepExamPreparation
                  form={form}
                  handleChange={handleChange}
                  handleBack={handleBack}
                  loading={loading}
                />
              </Suspense>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default MockTest2026;
