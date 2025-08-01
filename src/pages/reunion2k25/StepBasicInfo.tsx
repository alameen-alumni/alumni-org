import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import ImageUpload from '@/components/ImageUpload';
import { Loader2 } from 'lucide-react';

export default function StepBasicInfo({ form, handleChange, alumniName, regIdExists, alreadyRegistered, isLoading, handleContinue, setPhotoFile }) {

  const navigate = useNavigate();
  return (
    <>
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <label className="block text-sm font-medium text-teal-700 mb-1.5" htmlFor="reg_id">Registration ID <span className="text-red-500">*</span></label>
          <Input id="reg_id" name="reg_id" type="number" value={form.reg_id} onChange={handleChange} required className="w-full pl-4 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent" />
        </div>
        <div className="flex-1">
          <label className="block text-sm font-medium text-teal-700 mb-1.5" htmlFor="name">Name <span className="text-red-500">*</span></label>
          <Input id="name" name="name" value={form.name} onChange={handleChange} required className="w-full pl-4 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent" />
        </div>
      </div>
      {/* Loading State */}
      {isLoading && (
        <div className="flex items-center gap-2 mt-2 text-blue-600">
          <Loader2 className="w-4 h-4 animate-spin" />
          <span className="text-sm font-medium">Searching for registration ID...</span>
        </div>
      )}
      
      {/* Found Name */}
      {alumniName && !isLoading && (
        <div className="text-green-700 font-semibold mt-2">Name: {alumniName}</div>
      )}
      <div>
        <label className="block text-sm font-medium text-teal-700 mb-1.5" htmlFor="event.present">Will you appear on reunion? <span className="text-red-500">*</span></label>
        <select id="event.present" name="event.present" value={form.event?.present || ''} onChange={handleChange} required className="w-full pl-4 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent">
          <option value="">Select</option>
          <option value="yes">Yes</option>
          <option value="no">No</option>
          <option value="maybe">Maybe</option>
        </select>
      </div>
      {form.reg_id && String(form.reg_id).length > 3 && alreadyRegistered && (
        <div className="w-full text-red-700 rounded text-sm text-center px-0 py-2 mt-4 mb-2 font-medium">
          You are already registered for the reunion. {<br/>}
          Please go to <span onClick={() => navigate("/dashboard")} className='text-white bg-green-700/80 px-1.5 py-0.5 rounded-xl pb-1 cursor-pointer'>Dashboard</span> to view your registration.
        </div>
      )}
      {form.reg_id && String(form.reg_id).length > 3 && !regIdExists && !alreadyRegistered && (
        <div className="w-full text-red-700 rounded text-sm text-center px-0 py-2 mt-4 mb-2 font-medium">Registration ID not found in alumni database. {<br/>}Please contact the <span onClick={()=> navigate("/core-team")} className=' text-white bg-green-700/80 px-1.5 py-0.5 rounded-xl pb-1 cursor-pointer'>Core Team</span>.</div>
      )}
      
      {/* Photo Upload */}
      <div className="mt-4">
        <label className="block text-sm font-medium text-teal-700 mb-1.5">
          Photo 
          {(!regIdExists || alreadyRegistered) && (
            <span className="text-gray-500 text-xs ml-2">(Upload after valid registration ID)</span>
          )}
        </label>
        <div className={(!regIdExists || alreadyRegistered) ? 'opacity-50 pointer-events-none' : ''}>
          <ImageUpload
            onImageUpload={(url, file) => {
              setPhotoFile(file || null);
            }}
            currentImage={form.info?.photo || ''}
            fieldName="regPhoto"
            onClearLocalStorage={() => {
              setPhotoFile(null);
            }}
          />
        </div>
        {(!regIdExists || alreadyRegistered) && (
          <p className="text-xs text-gray-500 mt-1">
            Please enter a valid registration ID first
          </p>
        )}
      </div>
      
      <Button className="w-full mt-4" type="button" disabled={!regIdExists || !form.event?.present || alreadyRegistered} onClick={handleContinue}>Continue</Button>
    </>
  );
} 