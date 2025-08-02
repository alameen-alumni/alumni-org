import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CreditCard, Smartphone, Banknote } from "lucide-react";
import { type PaymentMethodsProps, type PaymentMethod } from "../../types";

const PaymentMethods = ({ paymentMethods }: PaymentMethodsProps) => {
  return (
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
  );
};

export default PaymentMethods; 