import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/sonner";
import bcrypt from "bcryptjs";
import { createUserWithEmailAndPassword } from "firebase/auth";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
  where
} from "firebase/firestore";
import { CheckCircle, X } from "lucide-react";
import { Suspense, useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAlumniNameByRegId } from "../hooks/use-alumni-name-by-regid";
import { useIsMobile } from "../hooks/use-mobile";
import { uploadToCloudinary } from "../lib/cloudinary";
import { auth, db } from "../lib/firebase";
import { lazyWithRetry } from '../utils/lazy-loading';

// Lazy load step components with retry mechanism
const StepBasicInfo = lazyWithRetry(() => import("./reunion2k25/StepBasicInfo"));
const StepContact = lazyWithRetry(() => import("./reunion2k25/StepContact"));
const StepMission = lazyWithRetry(() => import("./reunion2k25/StepMission"));
const StepParentAddress = lazyWithRetry(() => import("./reunion2k25/StepParentAddress"));
const StepProfession = lazyWithRetry(() => import("./reunion2k25/StepProfession"));

// Loading component for step components
const StepLoader = () => (
  <div className="flex items-center justify-center h-32">
    <div className="flex flex-col items-center space-y-2">
      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#186F65]"></div>
      <p className="text-gray-600 text-sm">Loading step...</p>
    </div>
  </div>
);

// Reunion2k25 form schema update
const initialForm = {
  reg_id: "",
  name: "",
  gender: "",
  password: "",
  education: {
    admit_class: "",
    admit_year: "",
    current_class: "UG",
    last_class: "",
    passout_year: "",
    scholarship: false,
    study: false,
    year_of_grad: "",
    curr_college: "",
    curr_degree: "",
  },
  profession: {
    company: "",
    position: "",
    working: false,
  },
  info: {
    address: {
      present: "",
      permanent: "",
    },
    contact: {
      email: "",
      mobile: "",
      whatsapp: "",
      mobile_wp: false,
      whatsapp_wp: false,
    },
    parent: {
      father: "",
      mother: "",
    },
    blood: {
      group: "",
      isDonating: "",
    },
    photo: "",
  },
  event: {
    present: "", // Will you appear on reunion: yes, no, maybe
    reg_fee: 1, // Fixed registration fee of ₹1
    donate: 0, // Donation amount
    paid: false, // Payment status - controlled by checkbox
    pay_id: "", // Payment ID - mandatory when payment is done
    payment_approved: false, // Payment approval status - managed by admin
    perks: {
      welcome_gift: false,
      jacket: false,
      special_gift_hamper: false,
      jacket_size: "",
      to_pay: 1, // Start with registration fee
    },
    accompany: 0, // Number of accompanying persons
    accompany_rel: "", // Relationship with accompanying person(s)
  },
  same_address: false, // <-- add this back
  same_whatsapp: false, // <-- add this back
};

const Reunion2k25 = () => {
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submittedData, setSubmittedData] = useState(null);
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [step, setStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [sameMobile, setSameMobile] = useState(false);
  const [paymentChoice, setPaymentChoice] = useState("");

  // Use the custom hook to get alumni name
  const { alumniName, regIdExists, alreadyRegistered, isLoading } = useAlumniNameByRegId(
    form.reg_id,
    step === 1 && String(form.reg_id).length > 3
  );

  // Autofill name if alumniName is found and name is empty
  useEffect(() => {
    if (alumniName) {
      setForm((prev) => ({ ...prev, name: alumniName }));
    }
  }, [alumniName]);

  // Clear localStorage when component unmounts
  useEffect(() => {
    return () => {
      localStorage.removeItem("imagePreview_regPhoto");
    };
  }, []);

  // Handle input changes (stable reference via useCallback)
  const handleChange = useCallback((e) => {
    const { name, value, type, checked, files } = e.target;

    if (name === "sameMobile") {
      setSameMobile(checked);
      if (checked) {
        // copy mobile into whatsapp
        setForm((prev) => ({
          ...prev,
          info: {
            ...prev.info,
            contact: {
              ...prev.info.contact,
              whatsapp: prev.info.contact.mobile,
            },
          },
        }));
      }
      return;
    }

    if (name === "photo") {
      setPhotoFile(files?.[0] ?? null);
      return;
    }

    // Use functional updates to avoid reading stale outer state and keep
    // the handler stable (so child components don't re-render due to new function refs).
    setForm((prev) => {
      // Nested fields like group.field or group.subgroup.field
      if (name.includes(".")) {
        const parts = name.split(".");
        if (parts.length === 2) {
          const [group, field] = parts;
          const updatedGroup = {
            ...prev[group],
            [field]: type === "checkbox" ? checked : value,
          };
          // Special-case: if address.present and same_address is true, update permanent too
          if (group === "info" && field === "address") {
            return {
              ...prev,
              info: {
                ...prev.info,
                address: {
                  ...prev.info.address,
                  ...updatedGroup,
                },
              },
            };
          }
          return {
            ...prev,
            [group]: updatedGroup,
          };
        } else if (parts.length === 3) {
          const [group, subgroup, field] = parts;
          const updatedSubgroup = {
            ...prev[group]?.[subgroup],
            [field]: type === "checkbox" ? checked : value,
          };

          // Special handling: if setting info.address.present and same_address is true
          if (group === "info" && subgroup === "address" && field === "present" && prev.same_address) {
            return {
              ...prev,
              info: {
                ...prev.info,
                address: {
                  ...prev.info.address,
                  present: value,
                  permanent: value,
                },
              },
            };
          }

          // If updating mobile and sameMobile is true, update whatsapp
          if (group === "info" && subgroup === "contact" && field === "mobile" && sameMobile) {
            return {
              ...prev,
              info: {
                ...prev.info,
                contact: {
                  ...prev.info.contact,
                  mobile: type === "checkbox" ? checked : value,
                  whatsapp: type === "checkbox" ? checked : value,
                },
              },
            };
          }

          return {
            ...prev,
            [group]: {
              ...prev[group],
              [subgroup]: updatedSubgroup,
            },
          };
        }
      }

      // Auto-set accompany to 1 when coming_with_anyone is set to "yes"
      if (name === "event.coming_with_anyone" && value === "yes") {
        return {
          ...prev,
          event: {
            ...prev.event,
            coming_with_anyone: value,
            accompany: 1,
          },
        };
      }

      if (name === "same_address") {
        return {
          ...prev,
          same_address: checked,
          info: {
            ...prev.info,
            address: checked
              ? { ...prev.info.address, permanent: prev.info.address.present }
              : prev.info.address,
          },
        };
      }

      // Default top-level fields
      return {
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      };
    });
  }, [sameMobile]);

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

  // Clear localStorage when form is reset (going back to step 1)
  const handleBack = () => {
    if (step === 1) {
      // Clear localStorage when resetting form
      localStorage.removeItem("imagePreview_regPhoto");
    }
    setStep((s) => s - 1);
  };

  // Handle close button click - redirect to dashboard
  const handleClose = () => {
    navigate("/dashboard");
  };

  // Password hashing before submit
  const hashPassword = async (plain) => {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(plain, salt);
  };

  // Helper: check required fields
  function validateRequiredFields() {
    // Step 1
    if (!form.reg_id || !form.name || !form.gender || !form.event.present)
      return "Registration ID, Name, Gender, and Reunion attendance are required.";
    // Step 2
    if (
      step === 2 &&
      (!form.info.contact.mobile || !form.info.contact.email || !form.password)
    )
      return "Mobile, Email, and Password are required.";
    if (step === 2 && form.password && form.password.length <= 6)
      return "Password must be at least 7 characters long.";
    // Step 3
    if (
      step >= 3 &&
      (!form.education.admit_year ||
        !form.education.admit_class ||
        !form.education.passout_year ||
        !form.education.last_class ||
        !form.education.curr_college ||
        !form.education.curr_degree)
    )
      return "All mission details including current college and degree are required.";
    if (step >= 3 && !form.education.curr_degree.trim())
      return "Please specify your degree.";
    if (
      step >= 3 &&
      form.education.study &&
      (form.education.year_of_grad === "" ||
        form.education.scholarship === undefined)
    )
      return "Year of Graduation and Scholarship are required if currently studying.";
    // Step 4
    if (
      step >= 4 &&
      (!form.info.parent.father ||
        !form.info.address.present ||
        !form.info.address.permanent)
    )
      return "Father name and addresses are required.";
    // Step 5
    if (
      step >= 5 &&
      form.profession.working &&
      (!form.profession.company || !form.profession.position)
    )
      return "Company and Position are required if working.";
    if (step >= 5 && form.event.perks.to_pay > 0 && !paymentChoice)
      return "Please select a payment option (Pay Now or Pay Later).";
    if (step >= 5 && form.event?.paid && !form.event?.pay_id?.trim())
      return "Payment ID is required when payment is marked as completed.";
    if (
      step >= 5 &&
      (form.event?.perks?.jacket || form.event?.perks?.special_gift_hamper) &&
      !String(form.event?.perks?.jacket_size || "").trim()
    )
      return "Please select your jacket size.";
    return null;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check for missing environment variables
    const missingVars = [];
    if (!import.meta.env.VITE_FIREBASE_API_KEY) missingVars.push("Firebase API Key");
    if (!import.meta.env.VITE_FIREBASE_PROJECT_ID) missingVars.push("Firebase Project ID");
    if (!import.meta.env.VITE_CLOUDINARY_CLOUD_NAME) missingVars.push("Cloudinary Cloud Name");

    if (missingVars.length > 0) {
      toast.error(`Configuration error: Missing ${missingVars.join(", ")}. Please check environment setup.`, {
        position: isMobile ? "top-center" : "top-right",
        duration: 6000,
      });
      console.error("Missing environment variables:", missingVars);
      return;
    }

    const validationError = validateRequiredFields();
    if (validationError) {
      toast.error(validationError, {
        position: isMobile ? "top-center" : "top-right",
      });
      return;
    }

    // Show loading toast
    const loadingToast = toast.loading("Processing your registration...", {
      position: isMobile ? "top-center" : "top-right",
    });

    setLoading(true);
    try {
      let uploadedPhotoUrl = "";
      if (photoFile) {
        try {
          uploadedPhotoUrl = await uploadToCloudinary(photoFile);
          // Update form with photo URL
          if (uploadedPhotoUrl) {
            setForm((prev) => ({
              ...prev,
              info: {
                ...prev.info,
                photo: uploadedPhotoUrl,
              },
            }));
          }
        } catch (photoError) {
          console.warn("Photo upload failed, continuing without photo:", photoError);
          // Continue registration without photo - don't fail the entire registration
          toast.warning("Photo upload failed, but registration will continue without photo.", {
            position: isMobile ? "top-center" : "top-right",
            duration: 3000,
          });
        }
      }
      const email = form.info.contact.email;
      const password = form.password;
      if (!email) {
        toast.dismiss(loadingToast);
        toast.error("Email is required to register.", {
          position: isMobile ? "top-center" : "top-right",
        });
        setLoading(false);
        return;
      }
      // 1. Check if email is already registered in reunion
      const reunionEmailQuery = query(
        collection(db, "reunion"),
        where("info.contact.email", "==", email)
      );
      const reunionEmailSnap = await getDocs(reunionEmailQuery);
      if (!reunionEmailSnap.empty) {
        toast.dismiss(loadingToast);
        toast.error(
          "This email is already registered for the reunion. Please use another email or log in.",
          { position: isMobile ? "top-center" : "top-right" }
        );
        setLoading(false);
        return;
      }
      // 2. Create Firebase Auth user
      let userCredential;
      try {
        userCredential = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );
      } catch (err) {
        toast.dismiss(loadingToast);
        toast.error(
          err.code === "auth/email-already-in-use"
            ? "Email already in use. Please use another email or log in."
            : err.message || "Failed to create user. Please try again.",
          { position: isMobile ? "top-center" : "top-right" }
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
        reg_id: form.reg_id ? Number(form.reg_id) : "",
        name: form.name,
        gender: form.gender,
        password: hashedPassword,
        education: {
          ...form.education,
          admit_class: form.education.admit_class
            ? Number(form.education.admit_class)
            : "",
          admit_year: form.education.admit_year
            ? Number(form.education.admit_year)
            : "",
          last_class: form.education.last_class
            ? Number(form.education.last_class)
            : "",
          passout_year: form.education.passout_year
            ? Number(form.education.passout_year)
            : "",
          year_of_grad: form.education.year_of_grad
            ? Number(form.education.year_of_grad)
            : "",
        },
        profession: { ...form.profession },
        role: "user",
        event: {
          ...form.event,
          paid: false, // Always set to false for pay later
          payment_approved: false, // Always set to false for pay later
          pay_id: "", // Always empty for pay later
        },
        info: {
          address: { ...form.info.address },
          contact: {
            ...form.info.contact,
            mobile: form.info.contact.mobile
              ? Number(form.info.contact.mobile)
              : "",
            whatsapp: form.info.contact.whatsapp
              ? Number(form.info.contact.whatsapp)
              : "",
          },
          parent: { ...form.info.parent },
          blood: { ...form.info.blood },
          photo: form.info.photo,
        },
        uid: userCredential.user.uid, // Save Firebase Auth UID for reference
      };

      // 5. Add timestamp just before saving to ensure accuracy
      const finalData = {
        ...data,
        createdAt: new Date().toISOString(), // Add timestamp for when registration was created
      };

      // 6. Save to Firestore with retry logic and timestamp validation
      let retryCount = 0;
      const maxRetries = 3;
      let savedDoc = null;

      // Compute next sl_no (ensure new registrations get sequential sl_no)
      let nextSlNo = 1;
      try {
        const slQuery = query(collection(db, 'reunion'), orderBy('sl_no', 'desc'), limit(1));
        const slSnap = await getDocs(slQuery);
        if (!slSnap.empty) {
          const top = slSnap.docs[0].data().sl_no;
          nextSlNo = top ? Number(top) + 1 : 1;
        }
      } catch (e) {
        // If fetching sl_no fails, fallback to 1 (script or prior data can be used later to reassign)
        console.warn('Could not compute next sl_no, defaulting to 1', e);
        nextSlNo = 1;
      }

      while (retryCount < maxRetries) {
        try {
          // Generate fresh timestamp
          const timestamp = new Date().toISOString();
          console.log("Generated timestamp:", timestamp);

          // Regenerate timestamp on each retry to ensure freshness
          const retryData = {
            ...data,
            createdAt: timestamp,
            sl_no: nextSlNo,
          };

          // Validate timestamp is present
          if (!retryData.createdAt) {
            throw new Error("Timestamp generation failed");
          }

          console.log("Saving data with timestamp:", retryData.createdAt);
          savedDoc = await addDoc(collection(db, "reunion"), retryData);
          console.log("Document saved successfully with ID:", savedDoc.id);

          // Verify the document was saved with timestamp
          const savedDocRef = doc(db, "reunion", savedDoc.id);
          const savedDocSnap = await getDoc(savedDocRef);

          if (savedDocSnap.exists() && savedDocSnap.data().createdAt) {
            console.log(
              "Timestamp verified in saved document:",
              savedDocSnap.data().createdAt
            );
            break; // Success, exit retry loop
          } else {
            throw new Error("Timestamp not found in saved document");
          }
        } catch (error) {
          retryCount++;
          console.error(`Firestore save attempt ${retryCount} failed:`, error);

          if (retryCount >= maxRetries) {
            throw error; // Re-throw if all retries failed
          }

          // Wait a bit before retrying
          await new Promise((resolve) =>
            setTimeout(resolve, 1000 * retryCount)
          );
        }
      }
      // Store submitted data for confirmation page
      // Dismiss loading toast and show success
      toast.dismiss(loadingToast);
      toast.success("Registration completed successfully!", {
        position: isMobile ? "top-center" : "top-right",
        duration: 3000,
      });

      setSubmittedData({
        name: form.name,
        gender: form.gender,
        reg_id: form.reg_id,
        email: form.info.contact.email,
        present: form.event.present,
        to_pay: form.event.perks.to_pay,
        sl_no: nextSlNo,
        createdAt: new Date().toISOString(),
      });
      setSubmitted(true);
      setForm(initialForm);
      setPhotoFile(null);
      // Clear photo preview from localStorage after successful upload
      localStorage.removeItem("imagePreview_regPhoto");
    } catch (err) {
      // Dismiss loading toast and show specific error
      toast.dismiss(loadingToast);

      console.error("Registration error:", err);

      let errorMessage = "Failed to submit registration. Please try again.";

      // Provide specific error messages based on error type
      if (err.message) {
        if (err.message.includes("VITE_CLOUDINARY_CLOUD_NAME is not configured")) {
          errorMessage = "Image upload is not configured. Please contact support.";
        } else if (err.message.includes("VITE_FIREBASE_API_KEY")) {
          errorMessage = "Application configuration error. Please contact support.";
        } else if (err.message.includes("auth/email-already-in-use")) {
          errorMessage = "This email is already registered. Please use another email or log in.";
        } else if (err.message.includes("auth/weak-password")) {
          errorMessage = "Password is too weak. Please use a stronger password.";
        } else if (err.message.includes("auth/invalid-email")) {
          errorMessage = "Please enter a valid email address.";
        } else if (err.message.includes("Upload failed")) {
          errorMessage = "Image upload failed. Please try again or skip photo upload.";
        } else if (err.message.includes("network") || err.message.includes("fetch")) {
          errorMessage = "Network error. Please check your internet connection and try again.";
        } else if (err.message.includes("permission") || err.message.includes("Firestore")) {
          errorMessage = "Database access error. Please contact support.";
        }
      }

      toast.error(errorMessage, {
        position: isMobile ? "top-center" : "top-right",
        duration: 5000,
      });

      // Clear photo preview from localStorage on error
      localStorage.removeItem("imagePreview_regPhoto");
    } finally {
      setLoading(false);
    }
  };

  // Render steps
  const totalSteps = 5;
  const stepLabels = [
    "Basic Info",
    "Contact & Password",
    "Mission Details",
    "Parent & Address",
    "Profession & Photo",
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
                Your reunion registration has been submitted successfully.
              </p>
            </div>

            {/* Registration Details */}
            <div className="bg-gray-50 rounded-lg p-4 space-y-1.5">
              <h3 className="font-semibold text-gray-900">
                Registration Details:
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Name:</span>
                  <span className="font-medium">{submittedData.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Gender:</span>
                  <span className="font-medium capitalize">
                    {submittedData.gender}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Registration ID:</span>
                  <span className="font-medium">{submittedData.reg_id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Email:</span>
                  <span className="font-medium">{submittedData.email}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Will Attend:</span>
                  <span className="font-medium capitalize">
                    {submittedData.present}
                  </span>
                </div>
                {submittedData.to_pay > 1 && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Amount:</span>
                    <span className="font-medium text-teal-600">
                      ₹{submittedData.to_pay}
                    </span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-gray-600">Registration Date:</span>
                  <span className="font-medium">
                    {new Date(submittedData.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>

            {/* Additional Information */}
            <div className="bg-blue-50 rounded-lg p-3">
              <h4 className="font-semibold text-blue-900 mb-2 text-sm sm:text-base">
                What's Next?
              </h4>
              <ul className="text-xs sm:text-sm text-blue-800 space-y-1">
                <li>• You will receive a confirmation email shortly</li>
                <li>• Payment details will be shared if applicable</li>
                <li>• Event updates will be sent to your registered email</li>
                <li>
                  • You can view your registration details in your dashboard
                </li>
              </ul>
            </div>

            {/* Close Button */}
            <div className="flex justify-center pt-4">
              <Button
                onClick={handleClose}
                className="bg-teal-600 hover:bg-teal-700 text-white px-8 py-3"
              >
                Go to Dashboard
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
          {/* <div className="text-right text-xs text-gray-500 mt-1">Step {step} of {totalSteps}</div> */}
        </div>
        <div className="bg-teal-600 text-white p-2.5 text-center relative">
          <button
            onClick={() => navigate("/")}
            className="absolute top-2 right-2 p-1 hover:bg-teal-700 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          <h1 className="text-xl md:text-2xl font-bold">পুনর্মিলন উৎসব ২০২৫</h1>
        </div>
        <div className="flex-1 md:px-6 py-2 px-4 overflow-y-auto">
          <form
            className="space-y-2.5"
            onSubmit={
              step === 5
                ? handleSubmit
                : (e) => {
                    e.preventDefault();
                    handleContinue();
                  }
            }
          >
            {step === 1 && (
              <Suspense fallback={<StepLoader />}>
                <StepBasicInfo
                  form={form}
                  handleChange={handleChange}
                  alumniName={alumniName}
                  regIdExists={regIdExists}
                  alreadyRegistered={alreadyRegistered}
                  isLoading={isLoading}
                  handleContinue={handleContinue}
                />
              </Suspense>
            )}
            {step === 2 && (
              <Suspense fallback={<StepLoader />}>
                <StepContact
                  form={form}
                  handleChange={handleChange}
                  handleBack={handleBack}
                  handleContinue={handleContinue}
                  setPhotoFile={setPhotoFile}
                />
              </Suspense>
            )}
            {step === 3 && (
              <Suspense fallback={<StepLoader />}>
                <StepMission
                  form={form}
                  handleChange={handleChange}
                  handleBack={handleBack}
                  handleContinue={handleContinue}
                />
              </Suspense>
            )}
            {step === 4 && (
              <Suspense fallback={<StepLoader />}>
                <StepParentAddress
                  form={form}
                  handleChange={handleChange}
                  handleBack={handleBack}
                  handleContinue={handleContinue}
                />
              </Suspense>
            )}
            {step === 5 && (
              <Suspense fallback={<StepLoader />}>
                <StepProfession
                  form={form}
                  handleChange={handleChange}
                  handleBack={handleBack}
                  setPhotoFile={setPhotoFile}
                  loading={loading}
                  setForm={setForm}
                  onPaymentChoiceChange={setPaymentChoice}
                />
              </Suspense>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default Reunion2k25;
