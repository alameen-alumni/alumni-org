import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import ImageUpload from '@/components/ImageUpload';

export default function StepProfession({ form, handleChange, handleBack, setPhotoUrl, setPhotoFile, loading }) {
  return (
    <>
      <div className="flex items-center gap-2 mb-2">
        <label className="block text-sm font-medium text-teal-700 mb-1.5">Are you currently working? <span className="text-red-500">*</span></label>
        <select id="profession.working" name="profession.working" value={form.profession.working ? 'yes' : 'no'} onChange={e => handleChange({ target: { name: 'profession.working', value: e.target.value === 'yes', type: 'checkbox', checked: e.target.value === 'yes' } })} required className="w-full pl-4 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent">
          <option value="no">No</option>
          <option value="yes">Yes</option>
        </select>
      </div>
      {form.profession.working && (
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-teal-700 mb-1.5" htmlFor="profession.company">Company <span className="text-red-500">*</span></label>
            <Input id="profession.company" name="profession.company" value={form.profession.company} onChange={handleChange} required={form.profession.working} className="w-full pl-4 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent" />
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium text-teal-700 mb-1.5" htmlFor="profession.position">Position <span className="text-red-500">*</span></label>
            <Input id="profession.position" name="profession.position" value={form.profession.position} onChange={handleChange} required={form.profession.working} className="w-full pl-4 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent" />
          </div>
        </div>
      )}
      <div>
        <label className="block text-sm font-medium text-teal-700 mb-1.5">Photo</label>
        <ImageUpload
          onImageUpload={(url, file) => {
            setPhotoUrl(url);
            setPhotoFile(file || null);
          }}
          currentImage={form.photo}
          fieldName="regPhoto"
        />
      </div>
      <div className="flex gap-2 mt-4">
        <Button type="button" onClick={handleBack} className="flex-1" variant="outline">Back</Button>
        <Button type="submit" className="flex-1" disabled={loading || !form.reg_id || !form.name}>{loading ? 'Submitting...' : 'Submit'}</Button>
      </div>
    </>
  );
} 