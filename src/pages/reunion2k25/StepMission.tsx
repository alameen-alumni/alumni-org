import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export default function StepMission({ form, handleChange, handleBack, handleContinue }) {
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