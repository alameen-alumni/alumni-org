import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import ImageUpload from '@/components/ImageUpload';

// Pricing map for perks
const PRICING = {
  reg_fee: 1,
  welcome_gift: 150,
  jacket: 450,
  special_gift_hamper: 550,
};

export default function StepProfession({ form, handleChange, handleBack, setPhotoUrl, setPhotoFile, loading, setForm }) {
  
  // Handle perks checkbox changes
  const handlePerksChange = (e) => {
    const { name, checked } = e.target;
    const fieldName = name.replace('event.perks.', '');
    
    if (fieldName === 'special_gift_hamper' && checked) {
      // If hamper is selected, uncheck individual items and set total to hamper price + reg_fee
      setForm(prev => ({
        ...prev,
        event: {
          ...prev.event,
          perks: {
            welcome_gift: false,
            jacket: false,
            special_gift_hamper: true,
            to_pay: PRICING.special_gift_hamper + (prev.event.reg_fee || PRICING.reg_fee)
          }
        }
      }));
    } else if (fieldName === 'special_gift_hamper' && !checked) {
      // If hamper is unchecked, calculate based on individual items + reg_fee
      setForm(prev => ({
        ...prev,
        event: {
          ...prev.event,
          perks: {
            ...prev.event.perks,
            special_gift_hamper: false,
            to_pay: (prev.event.perks.welcome_gift ? PRICING.welcome_gift : 0) + (prev.event.perks.jacket ? PRICING.jacket : 0) + (prev.event.reg_fee || PRICING.reg_fee)
          }
        }
      }));
    } else {
      // Handle individual item changes
      setForm(prev => {
        const newPerks = {
          ...prev.event.perks,
          [fieldName]: checked
        };
        
        // Calculate total amount including registration fee
        let total = prev.event.reg_fee || PRICING.reg_fee; // Start with registration fee
        if (newPerks.welcome_gift) total += PRICING.welcome_gift;
        if (newPerks.jacket) total += PRICING.jacket;
        if (newPerks.special_gift_hamper) total = PRICING.special_gift_hamper + (prev.event.reg_fee || PRICING.reg_fee); // Override if hamper is selected
        
        return {
          ...prev,
          event: {
            ...prev.event,
            perks: {
              ...newPerks,
              to_pay: total
            }
          }
        };
      });
    }
  };

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
      
      {/* Event Perks Section */}
      <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
        <h3 className="text-lg font-semibold text-teal-700 mb-3">Event Perks & Gifts</h3>
        
        {/* Registration Fee Display */}
        <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-blue-700">Registration Fee:</span>
            <span className="text-sm font-semibold text-blue-700">₹{form.event?.reg_fee || PRICING.reg_fee}</span>
          </div>
        </div>
        
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <input 
                id="event.perks.welcome_gift" 
                name="event.perks.welcome_gift" 
                type="checkbox" 
                checked={form.event.perks.welcome_gift} 
                onChange={handlePerksChange}
                disabled={form.event.perks.special_gift_hamper}
                className="w-4 h-4 text-teal-600 border-gray-300 rounded focus:ring-teal-500"
              />
              <label htmlFor="event.perks.welcome_gift" className="text-sm font-medium text-gray-700">
                Welcome Gift
              </label>
            </div>
            <span className="text-sm font-semibold text-gray-600">₹{PRICING.welcome_gift}</span>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <input 
                id="event.perks.jacket" 
                name="event.perks.jacket" 
                type="checkbox" 
                checked={form.event.perks.jacket} 
                onChange={handlePerksChange}
                disabled={form.event.perks.special_gift_hamper}
                className="w-4 h-4 text-teal-600 border-gray-300 rounded focus:ring-teal-500"
              />
              <label htmlFor="event.perks.jacket" className="text-sm font-medium text-gray-700">
                Reunion Jacket
              </label>
            </div>
            <span className="text-sm font-semibold text-gray-600">₹{PRICING.jacket}</span>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <input 
                id="event.perks.special_gift_hamper" 
                name="event.perks.special_gift_hamper" 
                type="checkbox" 
                checked={form.event.perks.special_gift_hamper} 
                onChange={handlePerksChange}
                className="w-4 h-4 text-teal-600 border-gray-300 rounded focus:ring-teal-500"
              />
              <label htmlFor="event.perks.special_gift_hamper" className="text-sm font-medium text-gray-700">
                Special Gift Hamper (Includes Welcome Gift + Jacket)
              </label>
            </div>
            <span className="text-sm font-semibold text-gray-600">₹{PRICING.special_gift_hamper}</span>
          </div>
          
          <div className="border-t pt-3 mt-3">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Registration Fee:</span>
                <span className="text-gray-600">₹{form.event?.reg_fee || PRICING.reg_fee}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Perks & Gifts:</span>
                <span className="text-gray-600">₹{form.event.perks.to_pay - (form.event?.reg_fee || PRICING.reg_fee)}</span>
              </div>
              <div className="flex items-center justify-between border-t pt-2">
                <span className="text-lg font-bold text-teal-700">Total Amount:</span>
                <span className="text-lg font-bold text-teal-700">₹{form.event.perks.to_pay}</span>
              </div>

              {form.event.perks.to_pay > 1 && <p className=' text-sm'>You will be contacted with payment details soon.</p>}
            </div>
          </div>
        </div>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-teal-700 mb-1.5">Photo</label>
        <ImageUpload
          onImageUpload={(url, file) => {
            setPhotoUrl(url);
            setPhotoFile(file || null);
          }}
          currentImage={form.info?.photo || ''}
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