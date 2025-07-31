import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Heart, CreditCard, Smartphone, Banknote, Check, Mail, Phone, Clock, Users, GraduationCap, Award } from "lucide-react";
import { useState } from "react";
import { toast } from "@/hooks/use-toast";

const PayUs = () => {
  const [donationForm, setDonationForm] = useState({
    name: '',
    email: '',
    amount: '',
    note: ''
  });

  const [selectedAmount, setSelectedAmount] = useState<string>('');

  const quickAmounts = [
    { label: '₹50', value: '50' },
    { label: '₹100', value: '100' },
    { label: '₹250', value: '250' },
    { label: '₹500', value: '500' },
    { label: '₹1000', value: '1000' },
    { label: 'Custom', value: 'custom' }
  ];

  const impactAreas = [
    {
      icon: GraduationCap,
      title: "Student Scholarships",
      description: "Support deserving students with financial assistance for their education"
    },
    {
      icon: Users,
      title: "Alumni Events",
      description: "Fund community gatherings, networking events, and reunions"
    },
    {
      icon: Award,
      title: "Excellence Awards",
      description: "Recognize outstanding achievements in academics and community service"
    }
  ];

  const paymentMethods = [
    {
      icon: CreditCard,
      title: "Credit/Debit Card",
      description: "Secure payment with Visa, MasterCard, or RuPay"
    },
    {
      icon: Smartphone,
      title: "UPI Payment",
      description: "Pay using Google Pay, PhonePe, Paytm, or any UPI app"
    },
    {
      icon: Banknote,
      title: "Net Banking",
      description: "Direct bank transfer from all major banks"
    }
  ];

  const handleAmountSelect = (amount: string) => {
    setSelectedAmount(amount);
    if (amount !== 'custom') {
      setDonationForm(prev => ({ ...prev, amount }));
    } else {
      setDonationForm(prev => ({ ...prev, amount: '' }));
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setDonationForm(prev => ({ ...prev, [field]: value }));
  };

  const handleDonate = () => {
    if (!donationForm.name || !donationForm.email || !donationForm.amount) {
      toast({
        title: "Please fill all required fields",
        description: "Name, email, and amount are required to proceed.",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Donation service coming soon!",
      description: "We're working hard to enable online donations. Please check back soon.",
      variant: "default",
    });

    // Here you would integrate with your payment gateway (Razorpay, Stripe, etc.)
    // toast({
    //   title: "Thank you for your donation!",
    //   description: `Your contribution of ₹${donationForm.amount} will make a real difference in our community.`,
    // });
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="w-full px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Heart className="h-8 w-8 text-indigo-600" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Support Our Alumni Mission
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Your donations help us empower future students and alumni-driven initiatives. 
            Together, we can make a lasting impact on education and community development.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* Donation Form */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="text-2xl flex items-center gap-2">
                  <Heart className="h-6 w-6 text-teal-600" />
                  Make Your Donation
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Quick Amount Selection */}
                <div className="space-y-3">
                  <Label className="text-base font-medium">Select Amount</Label>
                  <div className="grid grid-cols-3 gap-3">
                    {quickAmounts.map((amount) => (
                      <Button
                        key={amount.value}
                        variant={selectedAmount === amount.value ? "default" : "outline"}
                        onClick={() => handleAmountSelect(amount.value)}
                        className={selectedAmount === amount.value ? "bg-teal-600 hover:bg-teal-700" : "hover:bg-teal-500"}
                      >
                        {amount.label}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Custom Amount Input */}
                {(selectedAmount === 'custom' || !quickAmounts.find(a => a.value === selectedAmount)) && (
                  <div className="space-y-2">
                    <Label htmlFor="amount">Custom Amount (₹)</Label>
                    <Input
                      id="amount"
                      type="number"
                      placeholder="Enter amount"
                      value={donationForm.amount}
                      onChange={(e) => handleInputChange('amount', e.target.value)}
                      className="text-lg"
                    />
                  </div>
                )}

                <Separator />

                {/* Donor Information */}
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name *</Label>
                    <Input
                      id="name"
                      type="text"
                      placeholder="Your full name"
                      value={donationForm.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address *</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="your.email@example.com"
                      value={donationForm.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="note">Optional Message</Label>
                    <Textarea
                      id="note"
                      placeholder="Share why you're supporting our mission (optional)"
                      value={donationForm.note}
                      onChange={(e) => handleInputChange('note', e.target.value)}
                      className="min-h-[80px]"
                    />
                  </div>
                </div>

                <Button 
                  onClick={handleDonate}
                  className="w-full bg-teal-600 hover:bg-teal-700 text-lg py-6"
                  size="lg"
                >
                  <Heart className="h-5 w-5 mr-2" />
                  Donate Now - ₹{donationForm.amount || '0'}
                </Button>

                <p className="text-xs text-gray-500 text-center">
                  Your donation is secure and helps fund our educational initiatives
                </p>
              </CardContent>
            </Card>
          </motion.div>

          {/* Impact Areas */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="space-y-8"
          >
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Your Impact</h2>
              <div className="space-y-4">
                {impactAreas.map((area, index) => (
                  <Card key={area.title} className="hover:shadow-lg transition-all duration-300">
                    <CardContent className="pt-6">
                      <div className="flex items-start gap-4">
                        <div className="p-3 bg-indigo-100 rounded-full">
                          <area.icon className="h-6 w-6 text-teal-600" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-lg mb-2">{area.title}</h3>
                          <p className="text-gray-600 leading-relaxed">{area.description}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Statistics */}
            <Card className="bg-teal-600 text-white">
              <CardContent className="pt-6">
                <h3 className="text-xl font-bold mb-4">Our Impact So Far</h3>
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold">150+</div>
                    <div className="text-sm opacity-90">Students Supported</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold">₹5L+</div>
                    <div className="text-sm opacity-90">Funds Raised</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold">25+</div>
                    <div className="text-sm opacity-90">Events Organized</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold">500+</div>
                    <div className="text-sm opacity-90">Alumni Connected</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Payment Methods */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mb-12"
        >
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">
            Secure Payment Methods
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {paymentMethods.map((method) => (
              <Card key={method.title} className="text-center hover:shadow-lg transition-all duration-300">
                <CardHeader>
                  <div className="mx-auto mb-4 p-3 bg-green-100 rounded-full w-fit">
                    <method.icon className="h-8 w-8 text-green-600" />
                  </div>
                  <CardTitle className="text-xl">
                    {method.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 leading-relaxed">
                    {method.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </motion.div>

        {/* Contact & Security Info */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-8"
        >
          <Card>
            <CardHeader>
              <CardTitle className="text-xl flex items-center gap-2">
                <Mail className="h-5 w-5" />
                Need Help?
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4 leading-relaxed">
                Have questions about donations or need assistance? Our team is here to help you make a difference.
              </p>
              <div className="space-y-2 text-sm">
                <p className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-indigo-600" />
                  <strong>Email:</strong> ask@alumniassociationmidnapore.org
                </p>
                <p className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-indigo-600" />
                  <strong>Phone:</strong> +91 98765 43210
                </p>
                <p className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-indigo-600" />
                  <strong>Hours:</strong> Mon-Fri, 10 AM - 6 PM
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-green-50 border-green-200">
            <CardContent className="pt-6">
              <div className="flex items-center justify-center gap-2 text-green-700 mb-4">
                <Check className="h-6 w-6" />
                <span className="font-semibold text-lg">100% Secure</span>
              </div>
              <div className="space-y-2 text-sm text-green-600">
                <p>✓ SSL encrypted transactions</p>
                <p>✓ No payment information stored</p>
                <p>✓ Transparent fund utilization</p>
                <p>✓ Regular impact reports</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default PayUs;
