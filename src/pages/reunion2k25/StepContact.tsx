import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import ImageUpload from '@/components/ImageUpload';

export default function StepContact({ form, handleChange, handleBack, handleContinue, setPhotoFile }) {
  const handleSameAsPrimary = () => {
    handleChange({
      target: {
        name: 'info.contact.whatsapp',
        value: form.info?.contact?.mobile || ''
      }
    });
  };

  return (
    <>
      

      {/* Primary Mobile Number */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-teal-700 mb-1.5" htmlFor="mobile">Primary Mobile Number <span className="text-red-500">*</span></label>
        <Input 
          id="mobile" 
          name="info.contact.mobile" 
          type="text" 
          value={form.info?.contact?.mobile || ''} 
          onChange={handleChange} 
          required 
          className="w-full pl-4 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent" 
          placeholder="Enter primary mobile number"
          onKeyPress={(e) => {
            // Allow only numbers and some special characters
            if (!/[0-9+]/.test(e.key)) {
              e.preventDefault();
            }
          }}
        />
        <div className="flex items-center mt-2">
          <input
            id="mobile_wp"
            type="checkbox"
            checked={form.info?.contact?.mobile_wp || false}
            onChange={e => {
              handleChange({
                target: {
                  name: 'info.contact.mobile_wp',
                  type: 'checkbox',
                  checked: e.target.checked,
                },
              });
            }}
            className="mr-2"
          />
          <label htmlFor="mobile_wp" className="text-xs text-gray-600">This number has WhatsApp</label>
        </div>
      </div>

      {/* Secondary WhatsApp Number */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-teal-700 mb-1.5" htmlFor="whatsapp">Secondary WhatsApp Number <span className="text-red-500">*</span></label>
        <div className="flex gap-2 mb-2">
          <Input 
            id="whatsapp" 
            name="info.contact.whatsapp" 
            type="text" 
            value={form.info?.contact?.whatsapp || ''} 
            onChange={handleChange} 
            required
            className="flex-1 pl-4 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent" 
            placeholder="Enter secondary WhatsApp number"
            onKeyPress={(e) => {
              // Allow only numbers and some special characters
              if (!/[0-9+]/.test(e.key)) {
                e.preventDefault();
              }
            }}
          />
          <Button 
            type="button" 
            variant="outline" 
            onClick={handleSameAsPrimary}
            className="whitespace-nowrap"
          >
            Same as Primary
          </Button>
        </div>
        <div className="flex items-center mt-2">
          <input
            id="whatsapp_wp"
            type="checkbox"
            checked={form.info?.contact?.whatsapp_wp || false}
            onChange={e => {
              handleChange({
                target: {
                  name: 'info.contact.whatsapp_wp',
                  type: 'checkbox',
                  checked: e.target.checked,
                },
              });
            }}
            className="mr-2"
          />
          <label htmlFor="whatsapp_wp" className="text-xs text-gray-600">This number has WhatsApp</label>
        </div>
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium text-teal-700 mb-1.5" htmlFor="email">Email <span className="text-red-500">*</span></label>
        <Input id="email" name="info.contact.email" type="email" value={form.info?.contact?.email || ''} onChange={handleChange} required className="w-full pl-4 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent" />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium text-teal-700 mb-1.5" htmlFor="password">Create Password <span className="text-red-500">*</span></label>
        <Input id="password" name="password" type="password" value={form.password} onChange={handleChange} required className="w-full pl-4 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent" />
        {form.password && form.password.length <= 6 && (
          <p className="text-red-500 text-xs mt-1">Password must be at least 7 characters long</p>
        )}
      </div>

      {/* Photo Upload */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-teal-700 mb-1.5">
          Photo
        </label>
        <ImageUpload
          onImageUpload={(url, file) => {
            handleChange({
              target: {
                name: 'info.photo',
                value: url
              }
            });
            setPhotoFile(file || null);
          }}
          currentImage={form.info?.photo || ''}
          fieldName="regPhoto"
          onClearLocalStorage={() => {
            setPhotoFile(null);
          }}
        />
      </div>
      
      <div className="flex gap-2 mt-4">
        <Button type="button" onClick={handleBack} className="flex-1" variant="outline">Back</Button>
        <Button 
          type="button" 
          onClick={handleContinue} 
          className="flex-1" 
          disabled={!form.info?.contact?.mobile || !form.info?.contact?.whatsapp || !form.info?.contact?.email || !form.password || form.password.length <= 6}
        >
          Continue
        </Button>
      </div>
    </>
  );
} 