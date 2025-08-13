import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { X } from 'lucide-react';

export default function StepBasicInfo({ form, handleChange, alumniName, regIdExists, alreadyRegistered, isLoading, handleContinue }) {

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
      <div>
        <label className="block text-sm font-medium text-teal-700 mb-1.5" htmlFor="info.gender">Gender <span className="text-red-500">*</span></label>
        <select id="info.gender" name="info.gender" value={form.info?.gender || ''} onChange={handleChange} required className="w-full pl-4 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent">
          <option value="">Select</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="prefer_not_to_say">Prefer not to say</option>
        </select>
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
      
      {/* Accompany Fields - Only show if attending */}
      {(form.event?.present === 'yes' || form.event?.present === 'maybe') && (
        <>
          <div>
            <label className="block text-sm font-medium text-teal-700 mb-1.5" htmlFor="event.coming_with_anyone">Coming with anyone? <span className="text-red-500">*</span></label>
            <select id="event.coming_with_anyone" name="event.coming_with_anyone" value={form.event?.coming_with_anyone || ''} onChange={handleChange} required className="w-full pl-4 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent">
              <option value="">Select</option>
              <option value="yes">Yes</option>
              <option value="no">No</option>
            </select>
          </div>
          
          {/* Count and Relationship - Only show if coming with anyone */}
          {form.event?.coming_with_anyone === 'yes' && (
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <label className="block text-sm font-medium text-teal-700 mb-1.5" htmlFor="event.accompany">Number of Accompanying Persons <span className="text-red-500">*</span></label>
                <select id="event.accompany" name="event.accompany" value={form.event?.accompany || 1} onChange={handleChange} required className="w-full pl-4 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent">
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="4">4</option>
                </select>
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium text-teal-700 mb-1.5" htmlFor="event.accompany_rel">Relationship <span className="text-red-500">*</span></label>
                {(form.event?.accompany_rel === 'Other' || (form.event?.accompany_rel && !['Spouse', 'Children', 'Parents', 'Siblings', 'Friends', 'Colleagues'].includes(form.event?.accompany_rel))) ? (
                  <div className="relative">
                    <Input 
                      name="event.accompany_rel" 
                      value={form.event?.accompany_rel === 'Other' ? '' : (form.event?.accompany_rel || '')} 
                      onChange={handleChange} 
                      placeholder="Enter your custom relationship" 
                      className="w-full pl-4 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                    <button
                      type="button"
                      onClick={() => handleChange({
                        target: {
                          name: 'event.accompany_rel',
                          value: ''
                        }
                      })}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 hover:bg-gray-100 rounded-full transition-colors"
                      title="Switch back to dropdown"
                    >
                      <X className="w-4 h-4 text-gray-500" />
                    </button>
                  </div>
                ) : (
                  <select id="event.accompany_rel" name="event.accompany_rel" value={form.event?.accompany_rel || ''} onChange={handleChange} required className="w-full pl-4 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent">
                    <option value="">Select Relationship</option>
                    <option value="Spouse">Spouse</option>
                    <option value="Children">Children</option>
                    <option value="Parents">Parents</option>
                    <option value="Siblings">Siblings</option>
                    <option value="Friends">Friends</option>
                    <option value="Colleagues">Colleagues</option>
                    <option value="Other">Other</option>
                  </select>
                )}
              </div>
            </div>
          )}
        </>
      )}
      
      {form.reg_id && String(form.reg_id).length > 3 && alreadyRegistered && (
        <div className="w-full text-red-700 rounded text-sm text-center px-0 py-2 mt-4 mb-2 font-medium">
          You are already registered for the reunion. {<br/>}
          Please go to <span onClick={() => navigate("/dashboard")} className='text-white bg-green-700/80 px-1.5 py-0.5 rounded-xl pb-1 cursor-pointer'>Dashboard</span> to view your registration.
        </div>
      )}
      {form.reg_id && String(form.reg_id).length > 3 && !regIdExists && !alreadyRegistered && (
        <div className="w-full text-red-700 rounded text-sm text-center px-0 py-2 mt-4 mb-2 font-medium">Registration ID not found in alumni database. {<br/>}Please contact the <span onClick={()=> navigate("/core-team")} className=' text-white bg-green-700/80 px-1.5 py-0.5 rounded-xl pb-1 cursor-pointer'>Core Team</span>.</div>
      )}
      
      <Button className="w-full mt-4" type="button" disabled={!regIdExists || !form.event?.present || alreadyRegistered || (form.event?.present === 'yes' && !form.event?.coming_with_anyone) || (form.event?.coming_with_anyone === 'yes' && (!form.event?.accompany || !form.event?.accompany_rel))} onClick={handleContinue}>Continue</Button>
    </>
  );
} 