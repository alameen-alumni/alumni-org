import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useState, useEffect } from 'react';
import { X } from 'lucide-react';

export default function StepMission({ form, handleChange, handleBack, handleContinue }) {
  const [showCustomDegree, setShowCustomDegree] = useState(false);
  const [isOtherSelected, setIsOtherSelected] = useState(false);

  // Check if we should show custom degree input
  useEffect(() => {
    const shouldShowCustom = form.education.curr_degree === 'Other' || isOtherSelected;
    setShowCustomDegree(shouldShowCustom);
  }, [form.education.curr_degree, isOtherSelected]);

  // Handle degree selection change
  const handleDegreeChange = (e) => {
    const value = e.target.value;
    if (value === 'Other') {
      setIsOtherSelected(true);
      setShowCustomDegree(true);
      // Clear the curr_degree field when "Other" is selected
      handleChange({ target: { name: 'education.curr_degree', value: '' } });
    } else if (value !== '') {
      // Only reset when a predefined option is selected (not empty)
      setIsOtherSelected(false);
      setShowCustomDegree(false);
      handleChange(e);
    } else {
      // Handle empty selection
      handleChange(e);
    }
  };

  // Handle custom degree input change
  const handleCustomDegreeChange = (e) => {
    handleChange(e);
    // Keep showing custom input as long as user is typing
    // Don't change isOtherSelected state when user is typing
  };

  return (
    <>
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <label className="block text-sm font-medium text-teal-700 mb-1.5" htmlFor="education.admit_year">Admit Year <span className="text-red-500">*</span></label>
          <select id="education.admit_year" name="education.admit_year" value={form.education.admit_year} onChange={handleChange} required className="w-full pl-4 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent max-h-40 overflow-y-auto">
            <option value="">Select</option>
            {Array.from({length: 2025-2000+1}, (_,i)=>2025-i).map(y => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
        </div>
        <div className="flex-1">
          <label className="block text-sm font-medium text-teal-700 mb-1.5" htmlFor="education.admit_class">Admit Class <span className="text-red-500">*</span></label>
          <select id="education.admit_class" name="education.admit_class" value={form.education.admit_class} onChange={handleChange} required className="w-full pl-4 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent max-h-40 overflow-y-auto">
            <option value="">Select</option>
            {Array.from({length: 12-5+1}, (_,i)=>5+i).map(n => (
              <option key={n} value={n}>{n}</option>
            ))}
          </select>
        </div>
      </div>
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <label className="block text-sm font-medium text-teal-700 mb-1.5" htmlFor="education.passout_year">Passout Year <span className="text-red-500">*</span></label>
          <select id="education.passout_year" name="education.passout_year" value={form.education.passout_year} onChange={handleChange} required className="w-full pl-4 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent max-h-40 overflow-y-auto">
            <option value="">Select</option>
            {Array.from({length: 2025-2000+1}, (_,i)=>2025-i).map(y => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
        </div>
        <div className="flex-1">
          <label className="block text-sm font-medium text-teal-700 mb-1.5" htmlFor="education.last_class">Passout Class <span className="text-red-500">*</span></label>
          <select id="education.last_class" name="education.last_class" value={form.education.last_class} onChange={handleChange} required className="w-full pl-4 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent max-h-40 overflow-y-auto">
            <option value="">Select</option>
            <option value="10">10</option>
            <option value="12">12</option>
          </select>
        </div>
      </div>
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <label className="block text-sm font-medium text-teal-700 mb-1.5" htmlFor="education.curr_college">College/University <span className="text-red-500">*</span></label>
          <Input id="education.curr_college" name="education.curr_college" value={form.education.curr_college} onChange={handleChange} required placeholder="Enter college/university name" className="w-full pl-4 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent" />
        </div>
        <div className="flex-1">
          <label className="block text-sm font-medium text-teal-700 mb-1.5" htmlFor="education.curr_degree">Degree <span className="text-red-500">*</span></label>
          {showCustomDegree ? (
            <div className="relative">
              <Input 
                id="education.curr_degree" 
                name="education.curr_degree" 
                value={form.education.curr_degree} 
                onChange={handleCustomDegreeChange} 
                required 
                placeholder="Enter degree (e.g., B.Des, BHM, etc.)" 
                className="w-full pl-4 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent" 
              />
              <button
                type="button"
                onClick={() => {
                  setIsOtherSelected(false);
                  setShowCustomDegree(false);
                  handleChange({ target: { name: 'education.curr_degree', value: '' } });
                }}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 hover:bg-gray-100 rounded-full transition-colors"
                title="Switch back to dropdown"
              >
                <X className="w-4 h-4 text-gray-500" />
              </button>
            </div>
          ) : (
            <select id="education.curr_degree" name="education.curr_degree" value={form.education.curr_degree} onChange={handleDegreeChange} required className="w-full pl-4 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent max-h-40 overflow-y-auto">
              <option value="">Select</option>
              <option value="Engineering">Engineering</option>
              <option value="MBBS">MBBS</option>
              <option value="BDS">BDS</option>
              <option value="BAMS">BAMS</option>
              <option value="BHMS">BHMS</option>
              <option value="B.Tech">B.Tech</option>
              <option value="B.Sc">B.Sc</option>
              <option value="B.Com">B.Com</option>
              <option value="BBA">BBA</option>
              <option value="BCA">BCA</option>
              <option value="BA">BA</option>
              <option value="BFA">BFA</option>
              <option value="LLB">LLB</option>
              <option value="B.Arch">B.Arch</option>
              <option value="B.Pharm">B.Pharm</option>
              <option value="M.Tech">M.Tech</option>
              <option value="M.Sc">M.Sc</option>
              <option value="M.Com">M.Com</option>
              <option value="MBA">MBA</option>
              <option value="MCA">MCA</option>
              <option value="MA">MA</option>
              <option value="M.Arch">M.Arch</option>
              <option value="M.Pharm">M.Pharm</option>
              <option value="PhD">PhD</option>
              <option value="Diploma">Diploma</option>
              <option value="ITI">ITI</option>
              <option value="Polytechnic">Polytechnic</option>
              <option value="Arts">Arts</option>
              <option value="Commerce">Commerce</option>
              <option value="Science">Science</option>
              <option value="Other">Other</option>
            </select>
          )}
        </div>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-teal-700 mb-1.5" htmlFor="education.current_class">Current Qualification <span className="text-red-500">*</span></label>
        <select id="education.current_class" name="education.current_class" value={form.education.current_class} onChange={handleChange} required className="w-full pl-4 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent max-h-40 overflow-y-auto">
          <option value="">Select</option>
          <option value="Higher Secondary">Higher Secondary</option>
          <option value="UG">Undergraduate</option>
          <option value="PG">Postgraduate</option>
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-teal-700 mb-1.5">Currently Studying? <span className="text-red-500">*</span></label>
        <select id="currently_studying" name="education.study" value={form.education.study ? 'yes' : 'no'} onChange={e => handleChange({ target: { name: 'education.study', value: e.target.value === 'yes', type: 'checkbox', checked: e.target.value === 'yes' } })} required className="w-full pl-4 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent">
          <option value="no">No</option>
          <option value="yes">Yes</option>
        </select>
      </div>
      {form.education.study && (
        <>
          <div>
            <label className="block text-sm font-medium text-teal-700 mb-1.5" htmlFor="education.year_of_grad">Year of Graduation <span className="text-red-500">*</span></label>
            <select id="education.year_of_grad" name="education.year_of_grad" value={form.education.year_of_grad} onChange={handleChange} required className="w-full pl-4 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent max-h-40 overflow-y-auto">
              <option value="">Select</option>
              {Array.from({length: 2030-2005+1}, (_,i)=>2030-i).map(y => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-teal-700 mb-1.5">Scholarship Needed? <span className="text-red-500">*</span></label>
            <select id="education.scholarship" name="education.scholarship" value={form.education.scholarship ? 'yes' : 'no'} onChange={e => handleChange({ target: { name: 'education.scholarship', value: e.target.value === 'yes', type: 'checkbox', checked: e.target.value === 'yes' } })} required className="w-full pl-4 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent">
              <option value="no">No</option>
              <option value="yes">Yes</option>
            </select>
          </div>
        </>
      )}
      <div className="flex gap-2 mt-4">
        <Button type="button" onClick={handleBack} className="flex-1" variant="outline">Back</Button>
        <Button type="button" onClick={handleContinue} className="flex-1">Continue</Button>
      </div>
    </>
  );
} 