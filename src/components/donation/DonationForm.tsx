import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Heart } from "lucide-react";
import { type DonationFormProps, type DonationFormData, type QuickAmount } from "../../types";

const DonationForm = ({
  donationForm,
  selectedAmount,
  quickAmounts,
  onAmountSelect,
  onInputChange,
  onSubmit
}: DonationFormProps) => {
  return (
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
                  onClick={() => onAmountSelect(amount.value)}
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
                onChange={(e) => onInputChange('amount', e.target.value)}
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
                onChange={(e) => onInputChange('name', e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email Address *</Label>
              <Input
                id="email"
                type="email"
                placeholder="your.email@example.com"
                value={donationForm.email}
                onChange={(e) => onInputChange('email', e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="note">Optional Message</Label>
              <Textarea
                id="note"
                placeholder="Share why you're supporting our mission (optional)"
                value={donationForm.note}
                onChange={(e) => onInputChange('note', e.target.value)}
                className="min-h-[80px]"
              />
            </div>
          </div>

          <Button 
            onClick={onSubmit}
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
  );
};

export default DonationForm; 