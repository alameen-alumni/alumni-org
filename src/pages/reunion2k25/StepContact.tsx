import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export default function StepContact({ form, handleChange, handleBack, handleContinue }) {
  return (
    <>
      <div className="flex flex-col md:flex-row gap-4 mb-4">
        <div className="flex-1">
          <label className="block text-sm font-medium text-teal-700 mb-1.5" htmlFor="mobile">Mobile <span className="text-red-500">*</span></label>
          <Input 
            id="mobile" 
            name="info.contact.mobile" 
            type="text" 
            value={form.info?.contact?.mobile || ''} 
            onChange={handleChange} 
            required 
            className="w-full pl-4 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent" 
            placeholder="Enter mobile number"
            onKeyPress={(e) => {
              // Allow only numbers and some special characters
              if (!/[0-9+]/.test(e.key)) {
                e.preventDefault();
              }
            }}
          />
        </div>
        <div className="flex-1">
          <label className="block text-sm font-medium text-teal-700 mb-1.5" htmlFor="whatsapp">WhatsApp</label>
          <Input id="whatsapp" name="info.contact.whatsapp" type="text" value={form.info?.contact?.whatsapp || ''} onChange={handleChange} className="w-full pl-4 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent" placeholder="Enter WhatsApp number" />
          <div className="flex items-center mt-1">
                          <input
                id="sameAsMobile"
                type="checkbox"
                checked={form.same_whatsapp || false}
              onChange={e => {
                handleChange({
                  target: {
                    name: 'same_whatsapp',
                    type: 'checkbox',
                    checked: e.target.checked,
                  },
                });
                if (e.target.checked) {
                  handleChange({
                    target: {
                      name: 'info.contact.whatsapp',
                      value: form.info?.contact?.mobile || '',
                    },
                  });
                }
              }}
              className="mr-2"
            />
            <label htmlFor="sameAsMobile" className="text-xs text-gray-600">WhatsApp same as Mobile</label>
          </div>
        </div>
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium text-teal-700 mb-1.5" htmlFor="email">Email <span className="text-red-500">*</span></label>
        <Input id="email" name="info.contact.email" type="email" value={form.info?.contact?.email || ''} onChange={handleChange} required className="w-full pl-4 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent" />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium text-teal-700 mb-1.5" htmlFor="password">Create Password <span className="text-red-500">*</span></label>
        <Input id="password" name="password" type="password" value={form.password} onChange={handleChange} required className="w-full pl-4 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent" />
      </div>
      <div className="flex gap-2 mt-4">
        <Button type="button" onClick={handleBack} className="flex-1" variant="outline">Back</Button>
        <Button type="button" onClick={handleContinue} className="flex-1">Continue</Button>
      </div>
    </>
  );
} 