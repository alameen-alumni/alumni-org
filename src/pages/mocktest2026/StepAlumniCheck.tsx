import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

export default function StepAlumniCheck({ form, handleChange, alumniName, regIdExists, alreadyRegistered, isLoading, handleContinue }) {
  
  // Handle name input - only allow letters and spaces
  const handleNameChange = (e) => {
    const value = e.target.value;
    // Only allow letters, spaces, and common name characters
    if (/^[a-zA-Z\s.'-]*$/.test(value) || value === '') {
      handleChange(e);
    }
  };

  return (
    <>
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-teal-700 mb-4">Mock Test Registration 2026</h2>
        <p className="text-sm text-gray-600 mb-4">Please fill out the following information to register for the mock test.</p>
      </div>

      {/* Are you an alumni? */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-teal-700 mb-1.5">
          Are you an alumni of Al Ameen Mission Academy? <span className="text-red-500">*</span>
        </label>
        <div className="flex gap-4">
          <label className="flex items-center">
            <input
              type="radio"
              name="is_alumni"
              value="yes"
              checked={form.is_alumni === 'yes'}
              onChange={handleChange}
              className="mr-2"
            />
            <span className="text-sm">Yes</span>
          </label>
          <label className="flex items-center">
            <input
              type="radio"
              name="is_alumni"
              value="no"
              checked={form.is_alumni === 'no'}
              onChange={handleChange}
              className="mr-2"
            />
            <span className="text-sm">No</span>
          </label>
        </div>
      </div>

      {/* If alumni, show reg_id field */}
      {form.is_alumni === 'yes' && (
        <div className="mb-4">
          <label className="block text-sm font-medium text-teal-700 mb-1.5" htmlFor="reg_id">
            Registration ID <span className="text-red-500">*</span>
          </label>
          <Input
            id="reg_id"
            name="reg_id"
            type="number"
            value={form.reg_id}
            onChange={handleChange}
            required
            className="w-full pl-4 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            placeholder="Enter your registration ID"
            min="1"
          />
          
          {/* Loading State */}
          {isLoading && (
            <div className="flex items-center gap-2 mt-2 text-blue-600">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span className="text-sm font-medium">Searching for registration ID...</span>
            </div>
          )}
          
          {/* Found Name */}
          {alumniName && !isLoading && (
            <div className="mt-2 p-2 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-green-700 font-semibold text-sm">✓ Name: {alumniName}</p>
            </div>
          )}

          {/* Not found */}
          {form.reg_id && String(form.reg_id).length > 3 && !regIdExists && !isLoading && (
            <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-700 text-sm">Registration ID not found in alumni database. Please check your ID or contact the Core Team.</p>
            </div>
          )}

          {/* Already registered */}
          {alreadyRegistered && (
            <div className="mt-2 p-3 bg-yellow-50 border-2 border-yellow-300 rounded-lg">
              <p className="text-yellow-900 font-semibold text-sm mb-2">⚠ Already Registered</p>
              <p className="text-yellow-800 text-sm">
                You have already submitted your registration for the mock test. 
                Please wait while our administration confirms your status. 
                You will be notified via email and WhatsApp once your registration is verified.
              </p>
              <p className="text-yellow-700 text-xs mt-2">
                If you have any queries, please contact the Core Team.
              </p>
            </div>
          )}
        </div>
      )}

      {/* If not alumni (guest), show name field */}
      {form.is_alumni === 'no' && (
        <div className="mb-4">
          <label className="block text-sm font-medium text-teal-700 mb-1.5" htmlFor="name">
            Full Name <span className="text-red-500">*</span>
          </label>
          <Input
            id="name"
            name="name"
            value={form.name}
            onChange={handleNameChange}
            required
            className="w-full pl-4 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            placeholder="Enter your full name"
          />
          <p className="text-xs text-gray-500 mt-1">Only letters and spaces allowed</p>
        </div>
      )}

      <Button
        className="w-full mt-4"
        type="button"
        disabled={
          !form.is_alumni ||
          (form.is_alumni === 'yes' && (!regIdExists || alreadyRegistered)) ||
          (form.is_alumni === 'no' && !form.name)
        }
        onClick={handleContinue}
      >
        Continue
      </Button>
    </>
  );
}
