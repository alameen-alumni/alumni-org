import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

export default function StepPersonalDetails({ form, handleChange, handleBack, handleContinue }) {
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
            onChange={handleChange}
            required
            className="w-full pl-4 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            placeholder="Enter your full name"
          />
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
          onChange={handleChange}
          required
          className="w-full pl-4 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          placeholder="Enter father's name"
        />
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
          onChange={handleChange}
          required
          className="w-full pl-4 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          placeholder="Enter mobile number"
          onKeyPress={(e) => {
            if (!/[0-9+]/.test(e.key)) {
              e.preventDefault();
            }
          }}
        />
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
          disabled={!form.father_name || !form.mobile || !form.email || !form.address}
        >
          Continue
        </Button>
      </div>
    </>
  );
}
