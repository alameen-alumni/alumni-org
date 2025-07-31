import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export default function StepParentAddress({ form, handleChange, handleBack, handleContinue }) {
  return (
    <>
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <label className="block text-sm font-medium text-teal-700 mb-1.5" htmlFor="info.parent.father">Father's Name <span className="text-red-500">*</span></label>
          <Input id="info.parent.father" name="info.parent.father" value={form.info?.parent?.father || ''} onChange={handleChange} required className="w-full pl-4 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent" />
        </div>
        <div className="flex-1">
          <label className="block text-sm font-medium text-teal-700 mb-1.5" htmlFor="info.parent.mother">Mother's Name <span className="text-red-500">*</span></label>
          <Input id="info.parent.mother" name="info.parent.mother" value={form.info?.parent?.mother || ''} onChange={handleChange} className="w-full pl-4 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent" />
        </div>
      </div>
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <label className="block text-sm font-medium text-teal-700 mb-1.5" htmlFor="info.blood.group">Blood Group <span className="text-red-500">*</span></label>
          <select id="info.blood.group" name="info.blood.group" value={form.info?.blood?.group || ''} onChange={handleChange} required className="w-full pl-4 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent">
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
        </div>
        <div className="flex-1">
          <label className="block text-sm font-medium text-teal-700 mb-1.5" htmlFor="info.blood.isDonating">Willing to donate blood? <span className="text-red-500">*</span></label>
          <select id="info.blood.isDonating" name="info.blood.isDonating" value={form.info?.blood?.isDonating || ''} onChange={handleChange} required className="w-full pl-4 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent">
            <option value="">Select</option>
            <option value="yes">Yes</option>
            <option value="no">No</option>
            <option value="maybe">Maybe</option>
          </select>
        </div>
      </div>
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <label className="block text-sm font-medium text-teal-700 mb-1.5" htmlFor="info.address.present">Present Address <span className="text-red-500">*</span></label>
          <Input id="info.address.present" name="info.address.present" value={form.info?.address?.present || ''} onChange={handleChange} required className="w-full pl-4 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent" />
        </div>
        <div className="flex-1">
          <label className="block text-sm font-medium text-teal-700 mb-1.5" htmlFor="info.address.permanent">Permanent Address <span className="text-red-500">*</span></label>
          <Input id="info.address.permanent" name="info.address.permanent" value={form.info?.address?.permanent || ''} onChange={handleChange} required className="w-full pl-4 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent" />
        </div>
      </div>
      <div className="flex items-center gap-2 mb-2">
        <input id="same_address" name="same_address" type="checkbox" checked={form.same_address || false} onChange={handleChange} />
        <label htmlFor="same_address" className="text-xs">Permanent address same as present</label>
      </div>
      <div className="flex gap-2 mt-4">
        <Button type="button" onClick={handleBack} className="flex-1" variant="outline">Back</Button>
        <Button type="button" onClick={handleContinue} className="flex-1">Continue</Button>
      </div>
    </>
  );
} 