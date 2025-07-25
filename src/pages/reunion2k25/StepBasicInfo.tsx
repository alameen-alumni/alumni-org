import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

export default function StepBasicInfo({ form, handleChange, alumniName, regIdExists, handleContinue }) {

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
      {alumniName && (
        <div className="text-green-700 font-semibold mt-2">Name: {alumniName}</div>
      )}
      {form.reg_id && String(form.reg_id).length > 3 && !regIdExists && (
        <div className="w-full text-red-700 rounded text-sm text-center px-0 py-2 mt-4 mb-2 font-medium">Registration ID not found in alumni database. {<br/>}Please contact the <span onClick={()=> navigate("/core-team")} className=' text-white bg-green-700/80 px-1.5 py-0.5 rounded-xl pb-1 cursor-pointer'>Core Team</span>.</div>
      )}
      <Button className="w-full mt-2" type="button" disabled={!regIdExists} onClick={handleContinue}>Continue</Button>
    </>
  );
} 