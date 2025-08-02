import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, Phone, Clock, Check } from "lucide-react";
import { type ContactSecurityInfoProps } from "../../types";

const ContactSecurityInfo = ({}: ContactSecurityInfoProps) => {
  return (
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
  );
};

export default ContactSecurityInfo; 