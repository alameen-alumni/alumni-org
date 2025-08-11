import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import ImageUpload from '@/components/ImageUpload';
import { Clock, ArrowLeft } from 'lucide-react';

// Pricing map for perks
const PRICING = {
  reg_fee: 1,
  welcome_gift: 150,
  jacket: 450,
  special_gift_hamper: 550,
};

export default function StepProfession({ form, handleChange, handleBack, setPhotoFile, loading, setForm, onPaymentChoiceChange }) {
  const [showCustomDonation, setShowCustomDonation] = useState(false);
  const [paymentChoice, setPaymentChoice] = useState(''); // 'later' only
  
  // Ensure to_pay is properly initialized
  useEffect(() => {
    if (!form.event?.perks?.to_pay && form.event?.perks?.to_pay !== 0) {
      setForm(prev => ({
        ...prev,
        event: {
          ...prev.event,
          perks: {
            ...prev.event.perks,
            to_pay: prev.event?.reg_fee || PRICING.reg_fee
          }
        }
      }));
    }
  }, [form.event?.perks?.to_pay, setForm]);
  
  // Function to calculate total amount including donation
  const calculateTotalAmount = (perks, regFee, donation) => {
    let total = regFee || PRICING.reg_fee; // Start with registration fee
    
    // Add perks amount
    if (perks.special_gift_hamper) {
      total += PRICING.special_gift_hamper;
    } else {
      if (perks.welcome_gift) total += PRICING.welcome_gift;
      if (perks.jacket) total += PRICING.jacket;
    }
    
    // Add donation
    total += Number(donation || 0);
    
    return total;
  };

  // Handle perks checkbox changes
  const handlePerksChange = (e) => {
    const { name, checked } = e.target;
    const fieldName = name.replace('event.perks.', '');
    
    if (fieldName === 'special_gift_hamper' && checked) {
      // If hamper is selected, uncheck individual items
      setForm(prev => ({
        ...prev,
        event: {
          ...prev.event,
          perks: {
            welcome_gift: false,
            jacket: false,
            special_gift_hamper: true,
            jacket_size: prev.event?.perks?.jacket_size || "",
            to_pay: calculateTotalAmount(
              { welcome_gift: false, jacket: false, special_gift_hamper: true },
              prev.event.reg_fee,
              prev.event.donate
            )
          }
        }
      }));
    } else if (fieldName === 'special_gift_hamper' && !checked) {
      // If hamper is unchecked, calculate based on individual items
      setForm(prev => ({
        ...prev,
        event: {
          ...prev.event,
          perks: {
            ...prev.event.perks,
            special_gift_hamper: false,
            to_pay: calculateTotalAmount(
              { ...prev.event.perks, special_gift_hamper: false },
              prev.event.reg_fee,
              prev.event.donate
            )
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
        
        return {
          ...prev,
          event: {
            ...prev.event,
            perks: {
              ...newPerks,
              to_pay: calculateTotalAmount(newPerks, prev.event.reg_fee, prev.event.donate)
            }
          }
        };
      });
    }
  };

  const jacketSizes = ["S", "M", "L", "XL", "XXL", "XXXL"];

  // Handle donation changes
  const handleDonationChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev,
      event: {
        ...prev.event,
        donate: value,
        perks: {
          ...prev.event.perks,
          to_pay: calculateTotalAmount(prev.event.perks, prev.event.reg_fee, value)
        }
      }
    }));
  };



  return (
    <>
      <div className="flex items-center gap-2 mb-2">
        <label className="block text-sm font-medium text-teal-700 mb-1.5">Are you currently working? <span className="text-red-500">*</span></label>
        <select id="profession.working" name="profession.working" value={form.profession.working ? 'yes' : 'no'} onChange={e => handleChange({ target: { name: 'profession.working', value: e.target.value === 'yes', type: 'checkbox', checked: e.target.value === 'yes' } })} required className="w-[30%] md:w-[65%] pl-4 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent">
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
            <span className="text-sm font-semibold text-blue-700"> <s className='text-gray-700'>₹51</s> ₹{form.event?.reg_fee || PRICING.reg_fee}</span>
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
          {(form.event.perks.jacket || form.event.perks.special_gift_hamper) && (
            <div className="ml-7">
              <label className="block text-xs font-medium text-teal-700 mb-1.5" htmlFor="event.perks.jacket_size">
                Jacket Size <span className="text-red-500">*</span>
              </label>
              <select
                id="event.perks.jacket_size"
                name="event.perks.jacket_size"
                value={form.event.perks.jacket_size || ""}
                onChange={handleChange}
                required
                className="w-40 pl-3 pr-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              >
                <option value="">Select size</option>
                {jacketSizes.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>
          )}
          
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
                  Special Gift Hamper
              </label>
            </div>
            <span className="text-sm font-semibold text-gray-600">₹{PRICING.special_gift_hamper}</span>
          </div>
          
          {/* Donation Section */}
          <div className="border-t pt-3 mt-3">
            <h4 className="text-sm font-medium text-teal-700 mb-3">Donation for reunion </h4>
            <p className="text-xs text-gray-500 mb-3">Your donation will help support the alumni community and future events.</p>
            
            {/* Preset Donation Buttons */}
            <div className="grid grid-cols-5 gap-2 mb-3">
              {[500, 1000, 1500, 2000].map((amount) => (
                <button
                  key={amount}
                  type="button"
                  onClick={() => {
                    setShowCustomDonation(false);
                    handleDonationChange({
                      target: {
                        name: 'event.donate',
                        value: amount.toString(),
                      },
                    });
                  }}
                  className={` sm:px2 py-1 text-xs font-medium rounded border transition-colors ${
                    form.event?.donate == amount
                      ? 'bg-teal-600 text-white border-teal-600'
                      : 'bg-white text-teal-700 border-teal-300 hover:bg-teal-50'
                  }`}
                >
                  ₹{amount}
                </button>
              ))}
              
              {/* Custom Amount Button */}
              <button
                type="button"
                onClick={() => {
                  setShowCustomDonation(true);
                  handleDonationChange({
                    target: {
                      name: 'event.donate',
                      value: '',
                    },
                  });
                }}
                className={`px-2 py-1 text-xs font-medium rounded border transition-colors ${
                  showCustomDonation || (form.event?.donate && ![500,1000, 1500, 2000].includes(Number(form.event.donate)))
                    ? 'bg-teal-600 text-white border-teal-600'
                    : 'bg-white text-teal-700 border-teal-300 hover:bg-teal-50'
                }`}
              >
                Custom
              </button>
            </div>
            
            {/* Custom Amount Input */}
            {showCustomDonation && (
              <Input 
                id="event.donate" 
                name="event.donate" 
                type="number" 
                value={form.event?.donate || ''} 
                onChange={handleDonationChange} 
                className="w-full pl-3 pr-3 py-2 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-indigo-500 focus:border-transparent" 
                placeholder="Enter custom donation amount"
                min="0"
              />
            )}
          </div>
          
          <div className="border-t pt-3 mt-3">
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Registration Fee:</span>
                <span className="text-gray-600">₹{form.event?.reg_fee || PRICING.reg_fee}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Perks & Gifts:</span>
                <span className="text-gray-600">₹{(() => {
                  const regFee = form.event?.reg_fee || PRICING.reg_fee;
                  const total = form.event.perks.to_pay || 0;
                  const perksAmount = total - regFee;
                  return Math.max(0, perksAmount);
                })()}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Donation for reunion:</span>
                <span className="text-gray-600">₹{form.event?.donate || 0}</span>
              </div>
              <div className="flex items-center justify-between border-t pt-2">
                <span className="text-lg font-bold text-teal-700">Total Amount:</span>
                <span className="text-lg font-bold text-teal-700">₹{form.event.perks.to_pay || 0}</span>
              </div>

              {/* Payment Choice - Only Pay Later */}
              {form.event.perks.to_pay > 0 && !paymentChoice && (
                <div className="mt-3">
                  <div className="mb-2">
                    <p className="text-xs md:text-sm font-medium text-blue-600 text-center">
                      💳 Payment will be collected later by admin
                    </p>
                  </div>
                  <div className="flex justify-center">
                    <Button 
                      type="button" 
                      onClick={() => {
                        setPaymentChoice('later');
                        onPaymentChoiceChange && onPaymentChoiceChange('later');
                        // Set all payment fields to false
                        handleChange({ target: { name: 'event.paid', value: false, type: 'checkbox', checked: false } });
                        handleChange({ target: { name: 'event.payment_approved', value: false, type: 'checkbox', checked: false } });
                        handleChange({ target: { name: 'event.pay_id', value: '', type: 'text' } });
                      }}
                      className="bg-orange-600 hover:bg-orange-700 text-white font-semibold py-3 px-6 rounded-lg"
                    >
                      <Clock className="w-4 h-4 mr-2" />
                      Pay Later
                    </Button>
                  </div>
                </div>
              )}



              {/* Pay Later Section */}
              {form.event.perks.to_pay > 0 && paymentChoice === 'later' && (
                <div className="mt-3 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="text-center">
                    <div className="text-blue-600 text-lg font-semibold mb-2">
                      ⏰ Payment Deferred
                    </div>
                    <p className="text-xs sm:text-base text-blue-700 mb-3">
                      You will be contacted by admin for payment details. No payment required now.
                    </p>
                    <p className="text-xs text-blue-600">
                      Total Amount: ₹{form.event.perks.to_pay || 0}
                    </p>
                  </div>
                  
                  {/* Back to Payment Choice */}
                  <div className="mt-3">
                    <Button 
                      type="button" 
                      onClick={() => {
                        setPaymentChoice('');
                        // Reset payment fields when going back
                        handleChange({ target: { name: 'event.paid', value: false, type: 'checkbox', checked: false } });
                        handleChange({ target: { name: 'event.payment_approved', value: false, type: 'checkbox', checked: false } });
                        handleChange({ target: { name: 'event.pay_id', value: '', type: 'text' } });
                      }}
                      className="bg-orange-600 hover:bg-orange-700 text-white font-semibold py-2 px-3 rounded-lg text-xs"
                    >
                      <ArrowLeft className="w-4 h-4 mr-1" />
                      Back to Payment Options
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="flex gap-2 mt-4">
        <Button type="button" onClick={handleBack} className="flex-1" variant="outline">Back</Button>
        <Button 
          type="submit" 
          className="flex-1" 
          disabled={loading || !form.reg_id || !form.name || (form.event.perks.to_pay > 0 && !paymentChoice)}
        >
          {loading ? 'Submitting...' : 'Submit'}
        </Button>
      </div>
    </>
  );
} 