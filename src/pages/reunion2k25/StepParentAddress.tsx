import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export default function StepParentAddress({ form, handleChange, handleBack, handleContinue }) {
  return (
    <>
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <label className="block text-sm font-medium text-teal-700 mb-1.5" htmlFor="parent.father">Father's Name <span className="text-red-500">*</span></label>
          <Input id="parent.father" name="parent.father" value={form.parent.father} onChange={handleChange} required className="w-full pl-4 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent" />
        </div>
        <div className="flex-1">
          <label className="block text-sm font-medium text-teal-700 mb-1.5" htmlFor="parent.mother">Mother's Name <span className="text-red-500">*</span></label>
          <Input id="parent.mother" name="parent.mother" value={form.parent.mother} onChange={handleChange} required className="w-full pl-4 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent" />
        </div>
      </div>
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <label className="block text-sm font-medium text-teal-700 mb-1.5" htmlFor="address.present">Present Address <span className="text-red-500">*</span></label>
          <Input id="address.present" name="address.present" value={form.address.present} onChange={handleChange} required className="w-full pl-4 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent" />
        </div>
        <div className="flex-1">
          <label className="block text-sm font-medium text-teal-700 mb-1.5" htmlFor="address.permanent">Permanent Address <span className="text-red-500">*</span></label>
          <Input id="address.permanent" name="address.permanent" value={form.address.permanent} onChange={handleChange} required className="w-full pl-4 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent" />
        </div>
      </div>
      <div className="flex items-center gap-2 mb-2">
        <input id="same_address" name="same_address" type="checkbox" checked={form.same_address} onChange={handleChange} />
        <label htmlFor="same_address" className="text-xs">Permanent address same as present</label>
      </div>
      <div className="flex gap-2 mt-4">
        <Button type="button" onClick={handleBack} className="flex-1" variant="outline">Back</Button>
        <Button type="button" onClick={handleContinue} className="flex-1">Continue</Button>
      </div>
    </>
  );
} 