import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

export default function StepPersonalDetails({ form, handleChange, handleBack, handleContinue }) {
  
  // Handle name input - only allow letters and spaces
  const handleNameChange = (e) => {
    const value = e.target.value;
    if (/^[a-zA-Z\s.'-]*$/.test(value) || value === '') {
      handleChange(e);
    }
  };

  // Handle mobile number - only 10 digits
  const handleMobileChange = (e) => {
    const value = e.target.value.replace(/\D/g, ''); // Remove non-digits
    if (value.length <= 10) {
      handleChange({
        target: {
          name: e.target.name,
          value: value
        }
      });
    }
  };

  return (
    <>
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-teal-700 mb-2">Personal Details</h3>
      </div>

      {/* Name - only show if guest */}
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
            pattern="[a-zA-Z\s.'-]+"
            title="Please enter only letters and spaces"
          />
          <p className="text-xs text-gray-500 mt-1">Only letters and spaces allowed</p>
        </div>
      )}

      {/* Father's Name */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-teal-700 mb-1.5" htmlFor="father_name">
          Father's Name <span className="text-red-500">*</span>
        </label>
        <Input
          id="father_name"
          name="father_name"
          value={form.father_name}
          onChange={handleNameChange}
          required
          className="w-full pl-4 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          placeholder="Enter father's name"
          pattern="[a-zA-Z\s.'-]+"
          title="Please enter only letters and spaces"
        />
        <p className="text-xs text-gray-500 mt-1">Only letters and spaces allowed</p>
      </div>

      {/* Mobile Number */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-teal-700 mb-1.5" htmlFor="mobile">
          Mobile Number <span className="text-red-500">*</span>
        </label>
        <Input
          id="mobile"
          name="mobile"
          type="tel"
          value={form.mobile}
          onChange={handleMobileChange}
          required
          className="w-full pl-4 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          placeholder="Enter 10-digit mobile number"
          maxLength={10}
          minLength={10}
          pattern="[0-9]{10}"
          title="Please enter exactly 10 digits"
        />
        <p className="text-xs text-gray-500 mt-1">
          {form.mobile.length}/10 digits {form.mobile.length === 10 ? '✓' : ''}
        </p>
      </div>

      {/* Email Address */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-teal-700 mb-1.5" htmlFor="email">
          Email Address <span className="text-red-500">*</span>
        </label>
        <Input
          id="email"
          name="email"
          type="email"
          value={form.email}
          onChange={handleChange}
          required
          className="w-full pl-4 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          placeholder="Enter email address"
        />
      </div>

      {/* Address */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-teal-700 mb-1.5" htmlFor="address">
          Address <span className="text-red-500">*</span>
        </label>
        <Textarea
          id="address"
          name="address"
          value={form.address}
          onChange={handleChange}
          required
          className="w-full pl-4 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent min-h-[100px]"
          placeholder="Enter your complete address"
        />
      </div>

      <div className="flex gap-2 mt-4">
        <Button type="button" onClick={handleBack} className="flex-1" variant="outline">
          Back
        </Button>
        <Button
          type="button"
          onClick={handleContinue}
          className="flex-1"
          disabled={
            !form.father_name || 
            !form.mobile || 
            form.mobile.length !== 10 || 
            !form.email || 
            !form.address ||
            (form.is_alumni === 'no' && !form.name)
          }
        >
          Continue
        </Button>
      </div>
    </>
  );
}
