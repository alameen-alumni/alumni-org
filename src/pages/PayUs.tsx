
import { CreditCard, Smartphone, Building, IndianRupee } from 'lucide-react';

const PayUs = () => {
  const paymentMethods = [
    {
      icon: CreditCard,
      title: "Credit/Debit Card",
      description: "Secure payment with Visa, MasterCard, RuPay, or other Indian cards",
      color: "blue"
    },
    {
      icon: Smartphone,
      title: "UPI & Digital Wallets",
      description: "Pay using UPI, Paytm, PhonePe, Google Pay, or other digital wallets",
      color: "green"
    },
    {
      icon: Building,
      title: "Net Banking",
      description: "Direct transfer through Indian banks like SBI, HDFC, ICICI, etc.",
      color: "purple"
    }
  ];

  const donationOptions = [
    { amount: 500, purpose: "Student Scholarship Fund" },
    { amount: 1000, purpose: "Alumni Event Support" },
    { amount: 2500, purpose: "Infrastructure Development" },
    { amount: 5000, purpose: "Educational Resources" }
  ];

  return (
    <div className="min-h-screen bg-[#F9F7F1] py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-serif font-bold text-[#1F1F1F] mb-4">Support Our Mission</h1>
          <p className="text-lg text-[#666666] font-sans">
            Your contributions help us build a stronger alumni community and support current students
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {/* Payment Methods */}
          <div className="bg-white rounded-lg shadow-lg p-8 border border-[#186F65]/10">
            <h2 className="text-2xl font-serif font-bold text-[#1F1F1F] mb-6">Payment Methods</h2>
            <div className="space-y-4">
              {paymentMethods.map((method, index) => (
                <div key={index} className="flex items-center p-4 border border-[#186F65]/20 rounded-lg hover:bg-[#186F65]/5 transition-colors">
                  <div className={`p-3 rounded-full bg-${method.color}-100 mr-4`}>
                    <method.icon className={`text-${method.color}-600`} size={24} />
                  </div>
                  <div>
                    <h3 className="font-serif font-semibold text-[#1F1F1F]">{method.title}</h3>
                    <p className="text-sm text-[#666666] font-sans">{method.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Donation Form */}
          <div className="bg-white rounded-lg shadow-lg p-8 border border-[#186F65]/10">
            <h2 className="text-2xl font-serif font-bold text-[#1F1F1F] mb-6">Make a Contribution</h2>
            <form className="space-y-6">
              <div>
                <label className="block text-sm font-serif font-medium text-[#1F1F1F] mb-2">
                  Contribution Amount (₹)
                </label>
                <div className="relative">
                  <IndianRupee className="absolute left-3 top-3 text-[#666666]" size={20} />
                  <input 
                    type="number"
                    placeholder="Enter amount"
                    className="w-full pl-12 pr-4 py-3 border border-[#186F65]/30 rounded-lg focus:ring-2 focus:ring-[#186F65] focus:border-transparent font-sans"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-serif font-medium text-[#1F1F1F] mb-2">
                  Purpose
                </label>
                <select className="w-full px-4 py-3 border border-[#186F65]/30 rounded-lg focus:ring-2 focus:ring-[#186F65] focus:border-transparent font-sans">
                  <option value="">Select purpose</option>
                  <option value="scholarship">Student Scholarship Fund</option>
                  <option value="events">Alumni Event Support</option>
                  <option value="infrastructure">Infrastructure Development</option>
                  <option value="resources">Educational Resources</option>
                  <option value="general">General Fund</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-serif font-medium text-[#1F1F1F] mb-2">
                  Your Name
                </label>
                <input 
                  type="text"
                  placeholder="Enter your name"
                  className="w-full px-4 py-3 border border-[#186F65]/30 rounded-lg focus:ring-2 focus:ring-[#186F65] focus:border-transparent font-sans"
                />
              </div>

              <div>
                <label className="block text-sm font-serif font-medium text-[#1F1F1F] mb-2">
                  Email Address
                </label>
                <input 
                  type="email"
                  placeholder="Enter your email"
                  className="w-full px-4 py-3 border border-[#186F65]/30 rounded-lg focus:ring-2 focus:ring-[#186F65] focus:border-transparent font-sans"
                />
              </div>

              <button 
                type="submit"
                className="w-full bg-[#186F65] text-white py-3 rounded-lg font-serif font-semibold hover:bg-[#186F65]/90 transition-colors"
              >
                Proceed to Payment
              </button>
            </form>
          </div>
        </div>

        {/* Quick Donation Options */}
        <div className="bg-white rounded-lg shadow-lg p-8 border border-[#186F65]/10">
          <h2 className="text-2xl font-serif font-bold text-[#1F1F1F] mb-6 text-center">Quick Donation Options</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {donationOptions.map((option, index) => (
              <div key={index} className="text-center">
                <button className="w-full bg-gradient-to-r from-[#186F65] to-[#B2533E] text-white p-4 rounded-lg hover:from-[#186F65]/90 hover:to-[#B2533E]/90 transition-colors mb-2">
                  <div className="text-2xl font-serif font-bold">₹{option.amount}</div>
                </button>
                <p className="text-sm text-[#666666] font-sans">{option.purpose}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Bank Details */}
        <div className="bg-[#186F65]/10 rounded-lg p-8 mt-8 border border-[#186F65]/20">
          <h3 className="text-xl font-serif font-bold text-[#186F65] mb-4">Bank Transfer Details</h3>
          <div className="grid md:grid-cols-2 gap-6 text-sm font-sans">
            <div>
              <p><strong>Account Name:</strong> Al Ameen Alumni Association</p>
              <p><strong>Account Number:</strong> 50100012345678</p>
              <p><strong>Bank:</strong> State Bank of India</p>
            </div>
            <div>
              <p><strong>Branch:</strong> Midnapore Main Branch</p>
              <p><strong>IFSC Code:</strong> SBIN0001234</p>
              <p><strong>MICR Code:</strong> 721002001</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PayUs;
