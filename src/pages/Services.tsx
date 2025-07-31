import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  GraduationCap, 
  Users, 
  Briefcase, 
  BookOpen, 
  Award, 
  Heart,
  Globe,
  Calendar
} from "lucide-react";

const Services = () => {
  const services = [
    {
      icon: GraduationCap,
      title: "Scholarship Programs",
      description: "Financial assistance for deserving students from our community to pursue higher education.",
      features: ["Merit-based scholarships", "Need-based assistance", "Research grants", "International study support"],
      category: "Education"
    },
    {
      icon: Heart,
      title: "Community Service",
      description: "Organize and participate in social initiatives that make a positive impact on society.",
      features: ["Volunteer programs", "Social initiatives", "Community outreach", "Charity drives"],
      category: "Service"
    },
    {
      icon: Globe,
      title: "Global Alumni Network",
      description: "Connect with alumni chapters worldwide and maintain lifelong relationships.",
      features: ["International chapters", "Global events", "Cultural exchange", "Travel assistance"],
      category: "Network"
    },
    {
      icon: Calendar,
      title: "Events & Reunions",
      description: "Regular events, reunions, and gatherings to strengthen alumni bonds and create memories.",
      features: ["Annual reunions", "Social events", "Cultural programs", "Sports meets"],
      category: "Events"
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="w-full px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Our Services
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Comprehensive services designed to support our alumni community throughout 
            their personal and professional journey.
          </p>
        </motion.div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {services.map((service, index) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              layout
            >
              <Card className="h-full hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                <CardHeader>
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 bg-indigo-100 rounded-lg">
                      <service.icon className="h-6 w-6 text-indigo-600" />
                    </div>
                    <Badge variant="secondary" className="text-xs">
                      {service.category}
                    </Badge>
                  </div>
                  <CardTitle className="text-lg font-semibold mb-2">
                    {service.title}
                  </CardTitle>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {service.description}
                  </p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 mb-4">
                    {service.features.map((feature) => (
                      <div key={feature} className="flex items-center gap-2 text-sm text-gray-600">
                        <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full flex-shrink-0" />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                  <Button className="w-full text-sm">
                    Learn More
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {services.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <p className="text-gray-500 text-lg">
              No services available at the moment.
            </p>
          </motion.div>
        )}

        {/* Contact Section */}
        {/* <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mt-16"
        >
          <Card className="bg-teal-700 text-white">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl md:text-3xl mb-4">
                Need Personalized Assistance?
              </CardTitle>
              <p className="text-indigo-100 text-lg max-w-2xl mx-auto">
                Our dedicated team is here to help you make the most of our services. 
                Get in touch for personalized guidance and support.
              </p>
            </CardHeader>
            <CardContent className="text-center">
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button className="bg-white text-indigo-600 hover:bg-gray-100">
                  Contact Support
                </Button>
                <Button variant="outline" className="border-white text-black hover:bg-white hover:text-indigo-600">
                  Schedule Consultation
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div> */}
      </div>
    </div>
  );
};

export default Services;
