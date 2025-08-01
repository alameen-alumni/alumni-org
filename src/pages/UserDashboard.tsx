import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../lib/firebase';
import { doc, getDoc, updateDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Pencil, BadgeCheck, User as UserIcon, ShieldCheck, Home, CreditCard, Calendar, Hash, GraduationCap, Lock, X } from 'lucide-react';
import ImageUpload from '@/components/ImageUpload';
import { Link } from 'react-router-dom';
import { WhatsappShareButton, WhatsappIcon } from 'react-share';
import html2canvas from 'html2canvas';
import { useRef } from 'react';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogFooter, DialogTitle } from '@/components/ui/dialog';
import { getAuth, updatePassword, reauthenticateWithCredential, EmailAuthProvider } from 'firebase/auth';
import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip';

export default function UserDashboard() {
  const { currentUser } = useAuth();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState(false);
  const [message, setMessage] = useState('');
  const [cardModalOpen, setCardModalOpen] = useState(false);
  const [cardRatio, setCardRatio] = useState<'landscape' | 'portrait'>('landscape');
  const cardRef = useRef<HTMLDivElement>(null);
  const [editProfession, setEditProfession] = useState(false);
  const [modalProfession, setModalProfession] = useState('');
  const [downloading, setDownloading] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');
  const [passwordLoading, setPasswordLoading] = useState(false);

  useEffect(() => {
    if (cardModalOpen && profile) {
      setModalProfession(profile?.profession?.working ? (profile.profession.position || '') : (profile.profession?.student ? 'Student' : ''));
      setEditProfession(false);
    }
  }, [cardModalOpen, profile]);

  // Fetch user data from Firestore (reunion collection)
  useEffect(() => {
    if (!currentUser) {
      console.log('No currentUser found');
      setLoading(false);
      return;
    }
    
    console.log('CurrentUser:', currentUser);
    
    const fetchProfile = async () => {
      setLoading(true);
      let profileDoc = null;
      
      // First try to fetch by reg_id if available
      if (currentUser.reg_id) {
        const q = query(collection(db, 'reunion'), where('reg_id', '==', Number(currentUser.reg_id)));
        const snap = await getDocs(q);
        if (!snap.empty) {
          profileDoc = { ...snap.docs[0].data(), id: snap.docs[0].id };
        }
      }
      
      // If not found by reg_id, try by email
      if (!profileDoc && currentUser.email) {
        // First try exact match
        let q = query(collection(db, 'reunion'), where('info.contact.email', '==', currentUser.email));
        let snap = await getDocs(q);
        
        if (!snap.empty) {
          profileDoc = { ...snap.docs[0].data(), id: snap.docs[0].id };
        } else {
          // If no exact match, try case-insensitive search
          const allDocs = await getDocs(collection(db, 'reunion'));
          const matchingDoc = allDocs.docs.find(doc => {
            const docEmail = doc.data()?.info?.contact?.email;
            return docEmail && docEmail.toLowerCase() === currentUser.email.toLowerCase();
          });
          
          if (matchingDoc) {
            profileDoc = { ...matchingDoc.data(), id: matchingDoc.id };
          }
        }
      }
      
      if (!profileDoc) {
        console.log('No profile found in reunion collection');
      }
      
      setProfile(profileDoc);
      setLoading(false);
    };
    
    fetchProfile();
  }, [currentUser]);

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setProfile((prev: any) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  // Handle photo upload
  const handlePhotoUpload = (url: string) => {
    setProfile((prev: any) => ({ ...prev, info: { ...prev.info, photo: url } }));
  };

  // Save updates to Firestore
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;
    setSaving(true);
    setMessage('');
    try {
      const userId = (currentUser as any).uid;
      const ref = doc(db, 'users', userId);
      await updateDoc(ref, profile);
      setMessage('Profile updated!');
      setEditing(false);
    } catch (err) {
      setMessage('Failed to update profile.');
    }
    setSaving(false);
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError('');
    setPasswordSuccess('');
    if (newPassword !== confirmPassword) {
      setPasswordError('New passwords do not match.');
      return;
    }
    setPasswordLoading(true);
    try {
      const auth = getAuth();
      const user = auth.currentUser;
      if (!user || !user.email) throw new Error('No user found.');
      // Re-authenticate
      const cred = EmailAuthProvider.credential(user.email, currentPassword);
      await reauthenticateWithCredential(user, cred);
      await updatePassword(user, newPassword);
      setPasswordSuccess('Password updated successfully!');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setShowPasswordModal(false);
    } catch (err: any) {
      setPasswordError(err.message || 'Failed to update password.');
    }
    setPasswordLoading(false);
  };

  if (loading) return <div className="p-8 text-center">Loading...</div>;
  if (!profile) return <div className="p-8 text-center">No profile found.</div>;

  const handleDownload = async () => {
    if (!cardRef.current) return;
    setDownloading(true);
    // Wait a tick to ensure rendering
    setTimeout(() => {
      html2canvas(cardRef.current, {
        backgroundColor: '#fff',
        useCORS: true,
        scale: 2,
        width: cardRef.current.offsetWidth,
        height: cardRef.current.offsetHeight,
      })
        .then((canvas) => {
          const dataUrl = canvas.toDataURL('image/png');
          const link = document.createElement('a');
          link.download = `${profile.name || 'alumni-profile'}.png`;
          link.href = dataUrl;
          link.click();
        })
        .catch(() => alert('Failed to generate image. Try again or use a different browser.'))
        .finally(() => setDownloading(false));
    }, 150);
  };
  // WhatsApp share message
  const shareText = `Alumni Card\nName: ${profile.name}\nPassout Year: ${profile.passout_year}\nReg. ID: ${profile.reg_id}\n${profile.profession?.working ? `Profession: ${profile.profession.position || ''} at ${profile.profession.company || ''}` : ''}`;
  const shareUrl = window.location.origin + '/dashboard';

  const exportCard = cardModalOpen ? (
    cardRatio === 'landscape' ? (
      <div
        ref={cardRef}
        className="relative rounded-2xl border-0 bg-gradient-to-br from-teal-100 via-white to-indigo-100 shadow-2xl w-[400px] h-[210px] flex flex-col justify-between mx-auto"
      >
        {/* Watermark or background icon */}
        <GraduationCap className="absolute right-6 top-6 w-10 h-10 text-teal-100 opacity-44 pointer-events-none select-none" />
        <div className="flex flex-row items-center gap-6 px-3 pt-4 pb-2 z-10">
          <div className="w-28 h-28 rounded-2xl overflow-hidden border-4 border-white shadow-lg bg-gradient-to-br from-gray-100 to-white flex items-center justify-center">
            {profile.info?.photo ? (
              <img src={profile.info.photo} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-300"><UserIcon className="w-10 h-10" /></div>
            )}
          </div>
          <div className="flex flex-col flex-1 min-w-0">
            <div className="flex flex-col justify-center gap-2 flex-wrap mb-1">
              <span className="text-2xl font-extrabold text-teal-800 truncate drop-shadow">{profile.name || 'No Name'}</span>
              {profile.role === 'admin' ? (
                <span className="inline-flex items-center justify-start w-24 px-2.5 py-1 rounded-full bg-gradient-to-r from-teal-600 to-indigo-600 text-white text-sm font-semibold shadow">
                  <ShieldCheck className="w-4 h-4 mr-1" /> Admin
                </span>
              ) : (
                <span className="inline-flex items-center justify-start w-24 px-2.5 py-1 rounded-full bg-gradient-to-r from-teal-500 to-green-400 text-white text-sm font-semibold shadow">
                  <BadgeCheck className="w-4 h-4 mr-1" /> Alumni
                </span>
              )}
            </div>
            <div className="flex flex-row items-center gap-4 mt-1">
              <span className="flex items-center gap-1 text-sm text-gray-700 font-semibold">
                <Calendar className="w-4 h-4 text-teal-500" />
                {profile.passout_year || 'N/A'}
              </span>
              <span className="flex items-center gap-1 text-sm text-gray-700 font-semibold">
                <Hash className="w-4 h-4 text-indigo-500" />
                {profile.reg_id || 'N/A'}
              </span>
            </div>
            <div className="my-2 border-t border-dashed border-teal-200 w-24" />
            <div className="mt-1">
              {(profile.profession?.working || profile.profession?.student) && editProfession && (
                <input
                  className="text-sm border rounded px-2 py-1 mt-1 w-40"
                  value={modalProfession}
                  onChange={e => setModalProfession(e.target.value)}
                  onBlur={() => setEditProfession(false)}
                  autoFocus
                />
              )}
            </div>
          </div>
        </div>
        {/* Footer bar */}
        <div className="w-full text-center py-2 bg-gradient-to-r from-teal-600 to-indigo-500 text-white text-base font-bold tracking-wide shadow-inner mt-2 rounded-b-xl">
          AlumniAssociationMidnapore.org
        </div>
      </div>
    ) : (
      <div ref={cardRef} className="rounded-2xl border-2 border-teal-200 bg-white/95 shadow-xl w-[300px] h-[350px] flex flex-col items-center justify-between pt-4 mx-auto">
        <div className="flex flex-col items-center w-full">
          <div className="w-32 h-32 rounded-2xl overflow-hidden border-4 border-teal-300 shadow mb-3 bg-gradient-to-br from-gray-100 to-white flex items-center justify-center">
            {profile.info?.photo ? (
              <img src={profile.info.photo} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400"><UserIcon className="w-12 h-12" /></div>
            )}
          </div>
          <span className="text-2xl font-extrabold text-teal-700 mt-2">{profile.name || 'No Name'}</span>
          {profile.role === 'admin' ? (
            <span className="inline-flex items-center px-3 py-1 rounded-full bg-gradient-to-r from-teal-600 to-indigo-600 text-white text-base font-semibold mt-2">
              <ShieldCheck className="w-5 h-5 mr-1" /> Admin
            </span>
          ) : (
            <span className="inline-flex items-center px-3 py-1 rounded-full bg-gradient-to-r from-teal-500 to-green-400 text-white text-base font-semibold mt-2">
              <BadgeCheck className="w-5 h-5 mr-1" /> Alumni
            </span>
          )}
          <div className="flex flex-row items-center gap-4 mt-4">
            <span className="flex items-center gap-1 text-base text-gray-700 font-semibold">
              <Calendar className="w-5 h-5 text-teal-500" />
              {profile.passout_year || 'N/A'}
            </span>
            <span className="flex items-center gap-1 text-base text-gray-700 font-semibold">
              <Hash className="w-5 h-5 text-indigo-500" />
              {profile.reg_id || 'N/A'}
            </span>
          </div>
          <div className="my-3 border-t border-dashed border-teal-200 w-32" />
          {(profile.profession?.working || profile.profession?.student) && !editProfession && (
            <span className="text-base text-gray-700 font-semibold cursor-pointer mt-2" onClick={() => setEditProfession(true)}>
              Profession: <span className="font-bold">{modalProfession || (profile.profession?.student ? 'Student' : '')}</span> <span className="underline text-teal-500">Edit</span>
            </span>
          )}
          {(profile.profession?.working || profile.profession?.student) && editProfession && (
            <input
              className="text-base border rounded px-2 py-1 mt-2 w-48"
              value={modalProfession}
              onChange={e => setModalProfession(e.target.value)}
              onBlur={() => setEditProfession(false)}
              autoFocus
            />
          )}
        </div>
        <div className="w-full text-center py-3 bg-gradient-to-r from-teal-600 to-indigo-500 text-white text-base font-bold tracking-wide shadow-inner mt-4 rounded-b-xl">
          AlumniAssociationMidnapore.org
        </div>
      </div>
    )
  ) : null;

  // Helper function to display current_class in full form
  function getCurrentClassLabel(val: string) {
    if (val === 'UG') return 'Undergraduate';
    if (val === 'PG') return 'Postgraduate';
    if (val === 'Higher Secondary') return 'Higher Secondary';
    return val || 'N/A';
  }

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-teal-50 via-indigo-50 to-teal-50 py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  // Show error if no user or profile
  if (!currentUser) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-teal-50 via-indigo-50 to-teal-50 py-8">
        <div className="text-center">
          <p className="text-red-600 mb-4">Please log in to access your dashboard.</p>
          <Link to="/login">
            <Button className="bg-teal-600 hover:bg-teal-700 text-white">
              Go to Login
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  // Show message if no profile data found
  if (!profile) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-teal-50 via-indigo-50 to-teal-50 py-8">
        <div className="text-center">
          <p className="text-gray-600 mb-4">No profile data found. Please complete your registration.</p>
          <Link to="/reunion2k25">
            <Button className="bg-teal-600 hover:bg-teal-700 text-white">
              Complete Registration
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-teal-50 via-indigo-50 to-teal-50 py-8">
      
      {/* Main Profile Card */}
      <Card className="relative shadow-xl border-0 bg-white/95 backdrop-blur-lg ring-1 ring-teal-100 max-w-7xl w-full">
        <div className="absolute top-4 left-4 z-10 flex gap-2">
          
          
        </div>
        <div className="flex flex-row items-center justify-start pt-8 pb-4 px-4 border-b border-teal-100 gap-8 relative">
          <div className="flex-shrink-0 w-28 h-28 md:w-32 md:h-32 rounded-full overflow-hidden border-4 border-teal-200 shadow bg-gradient-to-br from-gray-100 to-white flex items-center justify-center">
            {profile.info?.photo ? (
              <img src={profile.info.photo} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400"><UserIcon className="w-12 h-12" /></div>
            )}
          </div>
          <div className="flex-1 flex items-center justify-start min-w-0">
            <div>
            <div className="flex flex-row items-center gap-3 flex-wrap">
              <span className="text-2xl md:text-3xl font-bold text-teal-700 truncate">{profile.name || 'No Name'}</span>
              {profile.role === 'admin' ? (
                <span className="inline-flex items-center px-2 py-1 rounded-full bg-gradient-to-r from-teal-600 to-teal-700 text-white text-xs font-semibold">
                  <ShieldCheck className="w-4 h-4 mr-1" /> Admin
                </span>
              ) : (
                <span className="inline-flex items-center px-2 py-1 rounded-full bg-gradient-to-r from-teal-500 to-green-400 text-white text-xs font-semibold">
                  <BadgeCheck className="w-4 h-4 mr-1" /> Alumni
                </span>
              )}
            </div>
            <div className="flex flex-row gap-6 mt-2 text-xs text-gray-400">
              <span>Passout Year: <span className="font-semibold text-gray-700">{profile.education.passout_year || 'N/A'}</span></span>
              <span>Reg. ID: <span className="font-semibold text-gray-700">{profile.reg_id || 'N/A'}</span></span>
            </div>
            </div>
            {editing && (
              <div className=" ml-4">
                <ImageUpload
                  onImageUpload={handlePhotoUpload}
                  currentImage={profile.info?.photo}
                  fieldName="userDashboardPhoto"
                />
                <div className="text-xs text-gray-500 text-center mt-1">Change Photo</div>
              </div>
            )}
          </div>
          <div className="absolute top-4 right-4 flex gap-2">
          <Link to="/">
              <Button variant="outline" size="icon" className="border-gray-300" aria-label="Home">
                <Home className="w-5 h-5" />
              </Button>
            </Link>
            {/* Card Modal */}
      <Dialog open={cardModalOpen} onOpenChange={setCardModalOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" size="icon" className=" border-gray-300 z-20" aria-label="Show Card">
            <CreditCard className="w-5 h-5" />
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-xl w-full flex flex-col items-center">
          <DialogHeader>
            <DialogTitle>Alumni Card</DialogTitle>
          </DialogHeader>
          <div className="flex flex-row gap-2 mb-4">
            <button
              className={`px-3 py-1 rounded-lg text-xs font-semibold border ${cardRatio === 'landscape' ? 'bg-teal-600 text-white' : 'bg-white text-teal-700 border-teal-200'}`}
              onClick={() => setCardRatio('landscape')}
            >
              Landscape
            </button>
            <button
              className={`px-3 py-1 rounded-lg text-xs font-semibold border ${cardRatio === 'portrait' ? 'bg-teal-600 text-white' : 'bg-white text-teal-700 border-teal-200'}`}
              onClick={() => setCardRatio('portrait')}
            >
              Portrait
            </button>
          </div>
          {exportCard}
          <DialogFooter className="w-full flex flex-col gap-3 justify-center mt-6 px-2">
            <WhatsappShareButton url={shareUrl} title={shareText} separator="\n" className="w-full">
              <button type="button" className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-green-500 hover:bg-green-600 text-white text-base font-bold shadow-lg transition">
                <WhatsappIcon size={28} round />
                Share to WhatsApp
              </button>
            </WhatsappShareButton>
            <button
              type="button"
              onClick={handleDownload}
              className={`w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-indigo-500 hover:bg-indigo-600 text-white text-base font-bold shadow-lg transition ${downloading ? 'opacity-60 cursor-not-allowed' : ''}`}
              disabled={downloading}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5 5m0 0l5-5m-5 5V4" /></svg>
              {downloading ? 'Downloading...' : 'Download Card'}
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

            
            {/* Password Icon (just a button with tooltip) */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="border-gray-300 z-20"
                aria-label="Change Password"
                onClick={() => setShowPasswordModal(true)}
              >
                <Lock className="w-5 h-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom" align="center">
              Change Password
            </TooltipContent>
          </Tooltip>
            <Button
              variant="outline"
              size="icon"
              className="border-gray-300"
              onClick={() => setEditing((v) => !v)}
              aria-label="Edit Profile"
            >
              <Pencil className="w-5 h-5" />
            </Button>
          </div>
        </div>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-8 p-8">
          {/* Password Edit Section (removed button, only modal is triggered from icon) */}
          {/* Contact Section */}
          <section className="bg-white/95 rounded-xl shadow p-6 border border-teal-100 mb-6">
            <h2 className="font-bold text-lg md:text-xl text-teal-700 mb-3 tracking-wide flex items-center gap-2 border-b border-teal-100 pb-2">
              Contact
            </h2>
            <Separator className="mb-3" />
            <div className="mb-2">
              <span className="block text-xs text-gray-500">Email</span>
              {editing ? (
                <Input name="email" value={profile.info?.contact?.email || ''} onChange={handleChange} />
              ) : (
                <span className="text-sm">{profile.info?.contact?.email || 'N/A'}</span>
              )}
            </div>
            <div className="mb-2">
              <span className="block text-xs text-gray-500">Primary Mobile</span>
              {editing ? (
                <Input name="mobile" value={profile.info?.contact?.mobile || ''} onChange={e => setProfile((prev: any) => ({ ...prev, info: { ...prev.info, contact: { ...prev.info.contact, mobile: e.target.value } } }))} />
              ) : (
                <div className="flex items-center gap-2">
                  <span className="text-sm">{profile.info?.contact?.mobile || 'N/A'}</span>
                  {profile.info?.contact?.mobile_wp && (
                    <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">WhatsApp</span>
                  )}
                </div>
              )}
            </div>
            <div className="mb-2">
              <span className="block text-xs text-gray-500">Secondary WhatsApp</span>
              {editing ? (
                <Input name="whatsapp" value={profile.info?.contact?.whatsapp || ''} onChange={e => setProfile((prev: any) => ({ ...prev, info: { ...prev.info, contact: { ...prev.info.contact, whatsapp: e.target.value } } }))} />
              ) : (
                <div className="flex items-center gap-2">
                  <span className="text-sm">{profile.info?.contact?.whatsapp || 'N/A'}</span>
                  {profile.info?.contact?.whatsapp_wp && (
                    <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">WhatsApp</span>
                  )}
                </div>
              )}
            </div>
            {editing && (
              <div className="flex items-center mt-1">
                <input
                  id="sameMobile"
                  type="checkbox"
                  checked={profile.info?.contact?.whatsapp === profile.info?.contact?.mobile && !!profile.info?.contact?.mobile}
                  onChange={e => {
                    if (e.target.checked) {
                      setProfile((prev: any) => ({
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
                  }}
                  className="mr-2"
                />
                <label htmlFor="sameMobile" className="text-xs text-gray-600">WhatsApp same as Mobile</label>
              </div>
            )}
          </section>
          
          {/* Education Section */}
          <section className="bg-white/95 rounded-xl shadow p-6 border border-teal-100 mb-6">
            <h2 className="font-bold text-lg md:text-xl text-teal-700 mb-3 tracking-wide flex items-center gap-2 border-b border-teal-100 pb-2">
              Education
            </h2>
            <Separator className="mb-3" />
            <div className="mb-2">
              <span className="block text-xs text-gray-500">Admit Year</span>
              {editing ? (
                <select name="admit_year" value={profile.education?.admit_year || ''} onChange={e => setProfile((prev: any) => ({ ...prev, education: { ...prev.education, admit_year: e.target.value } }))} className="w-full border rounded px-2 py-1 max-h-40 overflow-y-auto">
                  <option value="">Select</option>
                  {Array.from({length: 2025-2000+1}, (_,i)=>2025-i).map(y => (
                    <option key={y} value={y}>{y}</option>
                  ))}
                </select>
              ) : (
                <span className="text-sm">{profile.education?.admit_year || 'N/A'}</span>
              )}
            </div>
            <div className="mb-2">
              <span className="block text-xs text-gray-500">Admit Class</span>
              {editing ? (
                <select name="admit_class" value={profile.education?.admit_class || ''} onChange={e => setProfile((prev: any) => ({ ...prev, education: { ...prev.education, admit_class: e.target.value } }))} className="w-full border rounded px-2 py-1 max-h-40 overflow-y-auto">
                  <option value="">Select</option>
                  {Array.from({length: 12-5+1}, (_,i)=>5+i).map(n => (
                    <option key={n} value={n}>{n}</option>
                  ))}
                </select>
              ) : (
                <span className="text-sm">{profile.education?.admit_class || 'N/A'}</span>
              )}
            </div>
            <div className="mb-2">
              <span className="block text-xs text-gray-500">Passout Year</span>
              {editing ? (
                <select name="passout_year" value={profile.education?.passout_year || ''} onChange={e => setProfile((prev: any) => ({ ...prev, education: { ...prev.education, passout_year: e.target.value } }))} className="w-full border rounded px-2 py-1 max-h-40 overflow-y-auto">
                  <option value="">Select</option>
                  {Array.from({length: 2025-2000+1}, (_,i)=>2025-i).map(y => (
                    <option key={y} value={y}>{y}</option>
                  ))}
                </select>
              ) : (
                <span className="text-sm">{profile.education?.passout_year || 'N/A'}</span>
              )}
            </div>
            <div className="mb-2">
              <span className="block text-xs text-gray-500">Passout Class</span>
              {editing ? (
                <select name="last_class" value={profile.education?.last_class || ''} onChange={e => setProfile((prev: any) => ({ ...prev, education: { ...prev.education, last_class: e.target.value } }))} className="w-full border rounded px-2 py-1 max-h-40 overflow-y-auto">
                  <option value="">Select</option>
                  <option value="10">10</option>
                  <option value="11">11</option>
                  <option value="12">12</option>
                </select>
              ) : (
                <span className="text-sm">{profile.education?.last_class || 'N/A'}</span>
              )}
            </div>
            <div className="mb-2">
              <span className="block text-xs text-gray-500">Current Qualification</span>
              {editing ? (
                <select name="current_class" value={profile.education?.current_class || ''} onChange={e => setProfile((prev: any) => ({ ...prev, education: { ...prev.education, current_class: e.target.value } }))} className="w-full border rounded px-2 py-1 max-h-40 overflow-y-auto">
                  <option value="">Select</option>
                  <option value="Higher Secondary">Higher Secondary</option>
                  <option value="UG">Undergraduate</option>
                  <option value="PG">Postgraduate</option>
                </select>
              ) : (
                <span className="text-sm">{getCurrentClassLabel(profile.education?.current_class)}</span>
              )}
            </div>
            <div className="mb-2">
              <span className="block text-xs text-gray-500">Currently Studying</span>
              {editing ? (
                <select name="study" value={profile.education?.study ? 'yes' : 'no'} onChange={e => setProfile((prev: any) => ({ ...prev, education: { ...prev.education, study: e.target.value === 'yes' } }))} className="w-full border rounded px-2 py-1">
                  <option value="no">No</option>
                  <option value="yes">Yes</option>
                </select>
              ) : (
                <span className="text-sm">{profile.education?.study ? 'Yes' : 'No'}</span>
              )}
            </div>
            {profile.education?.study && (
              <>
                <div className="mb-2">
                  <span className="block text-xs text-gray-500">Year of Graduation</span>
                  {editing ? (
                    <select name="year_of_grad" value={profile.education?.year_of_grad || ''} onChange={e => setProfile((prev: any) => ({ ...prev, education: { ...prev.education, year_of_grad: e.target.value } }))} className="w-full border rounded px-2 py-1 max-h-40 overflow-y-auto">
                      <option value="">Select</option>
                      {Array.from({length: 2025-2005+1}, (_,i)=>2025-i).map(y => (
                        <option key={y} value={y}>{y}</option>
                      ))}
                    </select>
                  ) : (
                    <span className="text-sm">{profile.education?.year_of_grad || 'N/A'}</span>
                  )}
                </div>
                <div className="mb-2">
                  <span className="block text-xs text-gray-500">Scholarship Needed</span>
                  {editing ? (
                    <select name="scholarship" value={profile.education?.scholarship ? 'yes' : 'no'} onChange={e => setProfile((prev: any) => ({ ...prev, education: { ...prev.education, scholarship: e.target.value === 'yes' } }))} className="w-full border rounded px-2 py-1">
                      <option value="no">No</option>
                      <option value="yes">Yes</option>
                    </select>
                  ) : (
                    <span className="text-sm">{profile.education?.scholarship ? 'Yes' : 'No'}</span>
                  )}
                </div>
                <div className="mb-2">
                  <span className="block text-xs text-gray-500">Current College</span>
                  {editing ? (
                    <Input name="curr_college" value={profile.education?.curr_college || ''} onChange={e => setProfile((prev: any) => ({ ...prev, education: { ...prev.education, curr_college: e.target.value } }))} />
                  ) : (
                    <span className="text-sm">{profile.education?.curr_college || 'N/A'}</span>
                  )}
                </div>
                <div className="mb-2">
                  <span className="block text-xs text-gray-500">Current Degree</span>
                                      {editing ? (
                      <>
                        <select name="curr_degree" value={profile.education?.curr_degree || ''} onChange={e => {
                          const value = e.target.value;
                          if (value === 'Other') {
                            setProfile((prev: any) => ({ ...prev, education: { ...prev.education, curr_degree: '' } }));
                          } else {
                            setProfile((prev: any) => ({ ...prev, education: { ...prev.education, curr_degree: value } }));
                          }
                        }} className="w-full border rounded px-2 py-1">
                          <option value="">Select</option>
                          <option value="B.Tech">B.Tech</option>
                          <option value="B.E">B.E</option>
                          <option value="B.Sc">B.Sc</option>
                          <option value="B.Com">B.Com</option>
                          <option value="B.A">B.A</option>
                          <option value="BBA">BBA</option>
                          <option value="BCA">BCA</option>
                          <option value="MBBS">MBBS</option>
                          <option value="BDS">BDS</option>
                          <option value="B.Pharm">B.Pharm</option>
                          <option value="B.Arch">B.Arch</option>
                          <option value="LLB">LLB</option>
                          <option value="M.Tech">M.Tech</option>
                          <option value="M.Sc">M.Sc</option>
                          <option value="MBA">MBA</option>
                          <option value="MCA">MCA</option>
                          <option value="MD">MD</option>
                          <option value="MS">MS</option>
                          <option value="PhD">PhD</option>
                          <option value="Diploma">Diploma</option>
                          <option value="ITI">ITI</option>
                          <option value="Other">Other</option>
                        </select>
                        {(profile.education?.curr_degree === 'Other' || (profile.education?.curr_degree && !['B.Tech', 'B.E', 'B.Sc', 'B.Com', 'B.A', 'BBA', 'BCA', 'MBBS', 'BDS', 'B.Pharm', 'B.Arch', 'LLB', 'M.Tech', 'M.Sc', 'MBA', 'MCA', 'MD', 'MS', 'PhD', 'Diploma', 'ITI'].includes(profile.education?.curr_degree))) && (
                          <div className="relative mt-2">
                            <Input 
                              name="curr_degree" 
                              value={profile.education?.curr_degree || ''} 
                              onChange={e => setProfile((prev: any) => ({ ...prev, education: { ...prev.education, curr_degree: e.target.value } }))} 
                              placeholder="Enter your custom degree" 
                              className="w-full border rounded px-2 py-1 pr-8"
                            />
                            <button
                              type="button"
                              onClick={() => setProfile((prev: any) => ({ ...prev, education: { ...prev.education, curr_degree: '' } }))}
                              className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 hover:bg-gray-100 rounded-full transition-colors"
                              title="Switch back to dropdown"
                            >
                              <X className="w-3 h-3 text-gray-500" />
                            </button>
                          </div>
                        )}
                      </>
                    ) : (
                    <span className="text-sm">
                      {profile.education?.curr_degree || 'N/A'}
                    </span>
                  )}
                </div>
              </>
            )}
          </section>
          {/* Parent Section */}
          <section className="bg-white/95 rounded-xl shadow p-6 border border-teal-100 mb-6">
            <h2 className="font-bold text-lg md:text-xl text-teal-700 mb-3 tracking-wide flex items-center gap-2 border-b border-teal-100 pb-2">
              Parent
            </h2>
            <Separator className="mb-3" />
            <div className="mb-2">
              <span className="block text-xs text-gray-500">Father</span>
              {editing ? (
                <Input name="father" value={profile.info?.parent?.father || ''} onChange={e => setProfile((prev: any) => ({ ...prev, info: { ...prev.info, parent: { ...prev.info.parent, father: e.target.value } } }))} />
              ) : (
                <span className="text-sm">{profile.info?.parent?.father || 'N/A'}</span>
              )}
            </div>
            <div className="mb-2">
              <span className="block text-xs text-gray-500">Mother</span>
              {editing ? (
                <Input name="mother" value={profile.info?.parent?.mother || ''} onChange={e => setProfile((prev: any) => ({ ...prev, info: { ...prev.info, parent: { ...prev.info.parent, mother: e.target.value } } }))} />
              ) : (
                <span className="text-sm">{profile.info?.parent?.mother || 'N/A'}</span>
              )}
            </div>
          </section>
          {/* Blood Section */}
          <section className="bg-white/95 rounded-xl shadow p-6 border border-teal-100 mb-6">
            <h2 className="font-bold text-lg md:text-xl text-teal-700 mb-3 tracking-wide flex items-center gap-2 border-b border-teal-100 pb-2">
              Blood Information
            </h2>
            <Separator className="mb-3" />
            <div className="mb-2">
              <span className="block text-xs text-gray-500">Blood Group</span>
              {editing ? (
                <select name="blood_group" value={profile.info?.blood?.group || ''} onChange={e => setProfile((prev: any) => ({ ...prev, info: { ...prev.info, blood: { ...prev.info.blood, group: e.target.value } } }))} className="w-full border rounded px-2 py-1">
                  <option value="">Select</option>
                  <option value="A+">A+</option>
                  <option value="A-">A-</option>
                  <option value="B+">B+</option>
                  <option value="B-">B-</option>
                  <option value="AB+">AB+</option>
                  <option value="AB-">AB-</option>
                  <option value="O+">O+</option>
                  <option value="O-">O-</option>
                </select>
              ) : (
                <span className="text-sm">{profile.info?.blood?.group || 'N/A'}</span>
              )}
            </div>
            <div className="mb-2">
              <span className="block text-xs text-gray-500">Blood Donation</span>
              {editing ? (
                <select name="blood_donation" value={profile.info?.blood?.isDonating || ''} onChange={e => setProfile((prev: any) => ({ ...prev, info: { ...prev.info, blood: { ...prev.info.blood, isDonating: e.target.value } } }))} className="w-full border rounded px-2 py-1">
                  <option value="">Select</option>
                  <option value="yes">Yes</option>
                  <option value="no">No</option>
                  <option value="maybe">Maybe</option>
                </select>
              ) : (
                <span className="text-sm">{profile.info?.blood?.isDonating || 'N/A'}</span>
              )}
            </div>
          </section>
          {/* Profession Section */}
          <section className="bg-white/95 rounded-xl shadow p-6 border border-teal-100 mb-6">
            <h2 className="font-bold text-lg md:text-xl text-teal-700 mb-3 tracking-wide flex items-center gap-2 border-b border-teal-100 pb-2">
              Profession
            </h2>
            <Separator className="mb-3" />
            <div className="mb-2">
              <span className="block text-xs text-gray-500">Company</span>
              {editing ? (
                <Input name="company" value={profile.profession?.company || ''} onChange={e => setProfile((prev: any) => ({ ...prev, profession: { ...prev.profession, company: e.target.value } }))} />
              ) : (
                <span className="text-sm">{profile.profession?.company || 'N/A'}</span>
              )}
            </div>
            <div className="mb-2">
              <span className="block text-xs text-gray-500">Position</span>
              {editing ? (
                <Input name="position" value={profile.profession?.position || ''} onChange={e => setProfile((prev: any) => ({ ...prev, profession: { ...prev.profession, position: e.target.value } }))} />
              ) : (
                <span className="text-sm">{profile.profession?.position || 'N/A'}</span>
              )}
            </div>
            <div className="mb-2">
              <span className="block text-xs text-gray-500">Working</span>
              {editing ? (
                <select name="working" value={profile.profession?.working ? 'true' : 'false'} onChange={e => setProfile((prev: any) => ({ ...prev, profession: { ...prev.profession, working: e.target.value === 'true' } }))} className="w-full border rounded px-2 py-1">
                  <option value="false">No</option>
                  <option value="true">Yes</option>
                </select>
              ) : (
                <span className="text-sm">{profile.profession?.working ? 'Yes' : 'No'}</span>
              )}
            </div>
          </section>
          {/* Address Section */}
          <section className="bg-white/95 rounded-xl shadow p-6 border border-teal-100 mb-6">
            <h2 className="font-bold text-lg md:text-xl text-teal-700 mb-3 tracking-wide flex items-center gap-2 border-b border-teal-100 pb-2">
              Address
            </h2>
            <Separator className="mb-3" />
            <div className="mb-2">
              <span className="block text-xs text-gray-500">Present</span>
              {editing ? (
                <Input name="present" value={profile.info?.address?.present || ''} onChange={e => setProfile((prev: any) => ({ ...prev, info: { ...prev.info, address: { ...prev.info.address, present: e.target.value } } }))} />
              ) : (
                <span className="text-sm">{profile.info?.address?.present || 'N/A'}</span>
              )}
            </div>
            <div className="mb-2">
              <span className="block text-xs text-gray-500">Permanent</span>
              {editing ? (
                <Input name="permanent" value={profile.info?.address?.permanent || ''} onChange={e => setProfile((prev: any) => ({ ...prev, info: { ...prev.info, address: { ...prev.info.address, permanent: e.target.value } } }))} />
              ) : (
                <span className="text-sm">{profile.info?.address?.permanent || 'N/A'}</span>
              )}
            </div>
            {editing && (
              <div className="flex items-center mt-1">
                <input
                  id="sameAddress"
                  type="checkbox"
                  checked={profile.info?.address?.permanent === profile.info?.address?.present && !!profile.info?.address?.present}
                  onChange={e => {
                    if (e.target.checked) {
                      setProfile((prev: any) => ({
                        ...prev,
                        info: {
                          ...prev.info,
                          address: {
                            ...prev.info.address,
                            permanent: prev.info.address.present,
                          },
                        },
                      }));
                    }
                  }}
                  className="mr-2"
                />
                <label htmlFor="sameAddress" className="text-xs text-gray-600">Permanent address same as present</label>
              </div>
            )}
          </section>
          {/* Event Section */}
          <section className="bg-white/95 rounded-xl shadow p-6 border border-teal-100 mb-6">
            <h2 className="font-bold text-lg md:text-xl text-teal-700 mb-3 tracking-wide flex items-center gap-2 border-b border-teal-100 pb-2">
              Reunion Event
            </h2>
            <Separator className="mb-3" />
            <div className="mb-2">
              <span className="block text-xs text-gray-500">Attendance</span>
              {editing ? (
                <select name="event_present" value={profile.event?.present || ''} onChange={e => setProfile((prev: any) => ({ ...prev, event: { ...prev.event, present: e.target.value } }))} className="w-full border rounded px-2 py-1">
                  <option value="">Select</option>
                  <option value="yes">Yes</option>
                  <option value="no">No</option>
                  <option value="maybe">Maybe</option>
                </select>
              ) : (
                <span className="text-sm">{profile.event?.present || 'N/A'}</span>
              )}
            </div>
            <div className="mb-2">
              <span className="block text-xs text-gray-500">Registration Fee</span>
              <span className="text-sm">₹{profile.event?.reg_fee || 1}</span>
            </div>
            <div className="mb-2">
              <span className="block text-xs text-gray-500">Donation Amount</span>
              <span className="text-sm">₹{profile.event?.donate || 0}</span>
            </div>
            {profile.event?.perks && (
              <>
                <div className="mb-2">
                  <span className="block text-xs text-gray-500">Event Perks</span>
                  <div className="text-sm space-y-1">
                    {profile.event.perks.welcome_gift && <div>• Welcome Gift (₹150)</div>}
                    {profile.event.perks.jacket && <div>• Jacket (₹450)</div>}
                    {profile.event.perks.special_gift_hamper && <div>• Special Gift Hamper (₹550)</div>}
                  </div>
                </div>
                <div className="mb-2">
                  <span className="block text-xs text-gray-500">Total Amount</span>
                  <span className="text-sm font-semibold">₹{profile.event?.perks?.to_pay || 0}</span>
                </div>
              </>
            )}
          </section>
          {/* Registration Info Section */}
          <section className="bg-white/95 rounded-xl shadow p-6 border border-teal-100 mb-6">
            <h2 className="font-bold text-lg md:text-xl text-teal-700 mb-3 tracking-wide flex items-center gap-2 border-b border-teal-100 pb-2">
              Registration Info
            </h2>
            <Separator className="mb-3" />
            <div className="mb-2">
              <span className="block text-xs text-gray-500">Registration Date</span>
              <span className="text-sm">{profile.createdAt ? new Date(profile.createdAt).toLocaleDateString('en-IN', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              }) : 'N/A'}</span>
            </div>

          </section>
        </CardContent>
        {editing && (
          <div className="p-4 border-t flex justify-end bg-gray-50 rounded-b-xl">
            <Button type="button" variant="outline" className="mr-2" onClick={() => setEditing(false)}>
              Cancel
            </Button>
            <Button type="button" onClick={handleSave} disabled={saving} className="bg-teal-600 text-white hover:bg-teal-700">
              {saving ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        )}
        {message && <div className="mt-4 text-center text-green-600">{message}</div>}
      </Card>
      {/* Password Change Modal */}
      <Dialog open={showPasswordModal} onOpenChange={setShowPasswordModal}>
        <DialogContent className="max-w-md w-full flex flex-col items-center">
          <DialogHeader>
            <DialogTitle>Change Password</DialogTitle>
          </DialogHeader>
          <form className="w-full flex flex-col gap-3" onSubmit={handlePasswordChange}>
            <input
              type="password"
              className="w-full border rounded px-4 py-2"
              placeholder="Current Password"
              value={currentPassword}
              onChange={e => setCurrentPassword(e.target.value)}
              required
            />
            <input
              type="password"
              className="w-full border rounded px-4 py-2"
              placeholder="New Password"
              value={newPassword}
              onChange={e => setNewPassword(e.target.value)}
              required
            />
            <input
              type="password"
              className="w-full border rounded px-4 py-2"
              placeholder="Confirm New Password"
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
              required
            />
            {passwordError && <div className="text-red-600 text-sm text-center">{passwordError}</div>}
            {passwordSuccess && <div className="text-green-600 text-sm text-center">{passwordSuccess}</div>}
            <DialogFooter className="w-full flex flex-row gap-3 justify-center mt-2">
              <button
                type="button"
                className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold"
                onClick={() => setShowPasswordModal(false)}
                disabled={passwordLoading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded bg-indigo-500 hover:bg-indigo-600 text-white font-semibold"
                disabled={passwordLoading}
              >
                {passwordLoading ? 'Saving...' : 'Save Password'}
              </button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}