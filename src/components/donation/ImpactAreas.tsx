import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { GraduationCap, Users, Award } from "lucide-react";
import { type ImpactAreasProps, type ImpactArea } from "../../types";

const ImpactAreas = ({ impactAreas }: ImpactAreasProps) => {
  return (
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
  );
};

export default ImpactAreas; 