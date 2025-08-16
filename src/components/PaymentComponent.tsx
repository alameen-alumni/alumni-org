import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Clock, ArrowLeft, CreditCard, QrCode, CheckCircle, X, AlertCircle, DollarSign, Receipt } from 'lucide-react';

// Pricing map for perks
const PRICING = {
  reg_fee: 1,
  welcome_gift: 150,
  jacket: 450,
  special_gift_hamper: 550,
};

interface PaymentComponentProps {
  profile: any;
  onPaymentUpdate: (paymentData: any) => void;
  loading?: boolean;
}

export default function PaymentComponent({ profile, onPaymentUpdate, loading = false }: PaymentComponentProps) {
  const [showQRModal, setShowQRModal] = useState(false);
  const [paymentChoice, setPaymentChoice] = useState(''); // 'now' or 'later'
  const [paymentStatus, setPaymentStatus] = useState(''); // 'success' or 'failed'
  const [payId, setPayId] = useState(profile?.event?.pay_id || '');
  
  // Calculate total amount
  const calculateTotalAmount = () => {
    let total = profile?.event?.reg_fee || PRICING.reg_fee;
    
    if (profile?.event?.perks) {
      if (profile.event.perks.special_gift_hamper) {
        total += PRICING.special_gift_hamper;
      } else {
        if (profile.event.perks.welcome_gift) total += PRICING.welcome_gift;
        if (profile.event.perks.jacket) total += PRICING.jacket;
      }
    }
    
    total += Number(profile?.event?.donate || 0);
    
    return total;
  };

  const totalAmount = calculateTotalAmount();

  // Generate UPI payment link
  const generateUPILink = () => {
    const regId = profile?.reg_id || '';
    const amount = totalAmount;
    const transactionNote = `Reg ID: ${regId}`;
    
    const upiLink = `upi://pay?pa=8145484047@ybl&pn=Alumni%20Association%20Midnapore&cu=INR&am=${amount}&tn=${encodeURIComponent(transactionNote)}`;
    
    return upiLink;
  };

  // Handle pay button click
  const handlePayClick = () => {
    const upiLink = generateUPILink();
    window.open(upiLink, '_blank');
  };

  // Generate QR code for UPI payment
  const generateQRCode = () => {
    setShowQRModal(true);
  };

  // Handle payment success
  const handlePaymentSuccess = () => {
    if (!payId.trim()) return;
    
    onPaymentUpdate({
      paid: true,
      pay_id: payId.trim(),
      payment_approved: false // Will be approved by admin
    });
    
    setPaymentStatus('');
    setPaymentChoice('');
  };

  // Handle pay later
  const handlePayLater = () => {
    onPaymentUpdate({
      paid: false,
      pay_id: '',
      payment_approved: false
    });
    
    setPaymentChoice('');
  };

  // If already paid, don't show payment component
  if (profile?.event?.paid) {
    return null;
  }

  return (
    <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
      <h3 className="text-lg font-semibold text-teal-700 mb-3 flex items-center gap-2">
        <DollarSign className="w-5 h-5" />
        Payment Required
      </h3>
      
             <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
         <div className="flex items-center justify-between">
           <span className="text-sm font-medium text-blue-700 flex items-center gap-2">
             <DollarSign className="w-4 h-4" />
             Total Amount Due:
           </span>
           <span className="text-sm font-semibold text-blue-700">₹{totalAmount}</span>
         </div>
       </div>

      {/* Payment Choice Buttons */}
      {!paymentChoice && (
        <div className="mt-3">
          <div className="mb-2">
                         <p className="text-xs md:text-sm font-medium text-red-600 text-center flex items-center justify-center gap-2">
               <AlertCircle className="w-4 h-4" />
               Please select a payment option to continue
             </p>
          </div>
          <div className="flex gap-2">
            <Button 
              type="button" 
              onClick={() => setPaymentChoice('now')}
              className="flex-1 bg-teal-600 hover:bg-teal-700 text-white font-semibold py-3 rounded-lg"
            >
              <CreditCard className="w-4 h-4 mr-2" />
              Pay Now
            </Button>
            <Button 
              type="button" 
              onClick={() => setPaymentChoice('later')}
              className="flex-1 bg-orange-600 hover:bg-orange-700 text-white font-semibold py-3 rounded-lg"
            >
              <Clock className="w-4 h-4 mr-2" />
              Pay Later
            </Button>
          </div>
        </div>
      )}

      {/* Pay Now Section */}
      {paymentChoice === 'now' && (
        <div className="mt-3">
          {/* Payment Status Selection - Show after Pay Now is clicked */}
          {!paymentStatus && (
            <>
              {/* Mobile: Both buttons */}
              <div className="flex gap-2 md:hidden">
                <Button 
                  type="button" 
                  onClick={handlePayClick}
                  className="flex-1 bg-teal-600 hover:bg-teal-700 text-white font-semibold py-3 rounded-lg"
                >
                  <CreditCard className="w-4 h-4 mr-2" />
                  Pay Now
                </Button>
                <Button 
                  type="button" 
                  onClick={generateQRCode}
                  className="flex-1 bg-teal-600 hover:bg-teal-700 text-white font-semibold py-3 rounded-lg"
                >
                  <QrCode className="w-4 h-4 mr-2" />
                  Gen QR
                </Button>
              </div>
              
              {/* Desktop: Only Generate QR button */}
              <div className="hidden md:block">
                <Button 
                  type="button" 
                  onClick={generateQRCode}
                  className="w-full bg-teal-600 hover:bg-teal-700 text-white font-semibold py-3 rounded-lg"
                >
                  <QrCode className="w-4 h-4 mr-2" />
                  Generate QR to Pay
                </Button>
              </div>
              
                             <p className="text-xs text-gray-500 mt-1 text-center flex items-center justify-center gap-1">
                 <Receipt className="w-3 h-3" />
                 Click to open UPI payment app or generate QR code
               </p>
              
              {/* Payment Status Buttons */}
              <div className="mt-4 text-center">
                                 <p className="text-sm font-medium text-gray-700 mb-3 flex items-center justify-center gap-2">
                   <Receipt className="w-4 h-4" />
                   After making the payment, please select:
                 </p>
                <div className="flex gap-3 justify-center">
                  <Button 
                    type="button" 
                    onClick={() => setPaymentStatus('success')}
                    className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg"
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Payment Success
                  </Button>
                  <Button 
                    type="button" 
                    onClick={() => setPaymentStatus('failed')}
                    className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg"
                  >
                    <X className="w-4 h-4 mr-2" />
                    Payment Failed
                  </Button>
                </div>
              </div>
            </>
          )}

          {/* Payment Success - Show Payment ID Input */}
          {paymentStatus === 'success' && (
            <div className="mt-3 p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="text-center mb-4">
                <div className="text-green-600 text-lg font-semibold mb-2">
                  Payment Successful
                </div>
                                 <p className="text-sm text-green-700 flex items-center justify-center gap-2">
                   <Receipt className="w-4 h-4" />
                   Please provide your payment transaction ID
                 </p>
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-green-700 mb-1.5" htmlFor="pay_id">
                  Payment ID <span className="text-red-500">*</span>
                </label>
                <Input 
                  id="pay_id" 
                  value={payId} 
                  onChange={(e) => setPayId(e.target.value)} 
                  required 
                  placeholder="Enter your payment transaction ID (e.g., UPI123456789)" 
                  className="w-full pl-3 pr-3 py-2 border border-green-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent" 
                />
                                 <p className="text-xs text-green-600 mt-2 flex items-center gap-2">
                   <CheckCircle className="w-3 h-3" />
                   This is required to confirm your payment
                 </p>
              </div>
              
              <div className="flex gap-2 justify-center">
                <Button 
                  type="button" 
                  onClick={handlePaymentSuccess}
                  disabled={!payId.trim() || loading}
                  className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg"
                >
                  {loading ? 'Updating...' : 'Confirm Payment'}
                </Button>
                <Button 
                  type="button" 
                  onClick={() => {
                    setPaymentStatus('');
                    setPaymentChoice('');
                  }}
                  className="bg-gray-500 hover:bg-gray-600 text-white font-semibold py-2 px-4 rounded-lg"
                >
                  <ArrowLeft className="w-4 h-4 mr-1" />
                  Back to Options
                </Button>
              </div>
            </div>
          )}

          {/* Payment Failed - Show Pay Later Option */}
          {paymentStatus === 'failed' && (
            <div className="mt-3 p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="text-center mb-4">
                <div className="text-red-600 text-lg font-semibold mb-2">
                  Payment Failed
                </div>
                                 <p className="text-sm text-red-700 mb-3 flex items-center justify-center gap-2">
                   <AlertCircle className="w-4 h-4" />
                   Don't worry! You can choose to pay later
                 </p>
              </div>
              
              <div className="flex gap-2 justify-center">
                <Button 
                  type="button" 
                  onClick={handlePayLater}
                  className="bg-orange-600 hover:bg-orange-700 text-white font-semibold py-2 px-4 rounded-lg"
                >
                  <Clock className="w-4 h-4 mr-2" />
                  Switch to Pay Later
                </Button>
                <Button 
                  type="button" 
                  onClick={() => {
                    setPaymentStatus('');
                  }}
                  className="bg-gray-500 hover:bg-gray-600 text-white font-semibold py-2 px-4 rounded-lg"
                >
                  Try Payment Again
                </Button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Pay Later Section */}
      {paymentChoice === 'later' && (
        <div className="mt-3 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="text-center">
            <div className="text-blue-600 text-lg font-semibold mb-2">
              Payment Deferred
            </div>
                         <p className="text-xs sm:text-base text-blue-700 mb-3 flex items-center justify-center gap-2">
               <Clock className="w-4 h-4" />
               You will be contacted by admin for payment details. No payment required now.
             </p>
                         <p className="text-xs text-blue-600 flex items-center justify-center gap-2">
               <DollarSign className="w-3 h-3" />
               Total Amount: ₹{totalAmount}
             </p>
          </div>
          
          {/* Back to Payment Choice */}
          <div className="mt-3">
            <Button 
              type="button" 
              onClick={() => {
                setPaymentChoice('');
              }}
              className="bg-orange-600 hover:bg-orange-700 text-white font-semibold py-2 px-3 rounded-lg text-xs"
            >
              <ArrowLeft className="w-4 h-4 mr-1" />
              Back to Payment Options
            </Button>
          </div>
        </div>
      )}

      {/* QR Code Modal */}
      <Dialog open={showQRModal} onOpenChange={setShowQRModal}>
        <DialogContent className="max-w-md w-full flex flex-col items-center rounded-2xl mx-auto">
          <DialogHeader>
            <DialogTitle>UPI Payment QR Code</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col items-center gap-3 p-2.5">
            <div className="bg-white p-4 rounded-lg border-2 border-green-400">
              <img 
                src={`https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(generateUPILink())}`}
                alt="UPI Payment QR Code"
                className="w-64 h-64"
              />
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-2">
                Scan this QR code with any UPI app to pay ₹{totalAmount}
              </p>
              <p className="text-sm text-green-600">
                Registration ID: {profile?.reg_id || 'N/A'}
              </p>
            </div>
            <Button 
              type="button" 
              onClick={() => setShowQRModal(false)}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
