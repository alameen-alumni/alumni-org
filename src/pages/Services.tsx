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
import { useState } from "react";

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
      icon: Users,
      title: "Networking & Mentorship",
      description: "Connect with fellow alumni and industry professionals for career guidance and opportunities.",
      features: ["Mentor matching", "Industry networking", "Career counseling", "Professional development"],
      category: "Career"
    },
    {
      icon: Briefcase,
      title: "Job Placement Services",
      description: "Exclusive job opportunities and career placement assistance for alumni and students.",
      features: ["Job board access", "Resume review", "Interview preparation", "Industry connections"],
      category: "Career"
    },
    {
      icon: BookOpen,
      title: "Educational Resources",
      description: "Access to learning materials, online courses, and educational content curated by experts.",
      features: ["Online library", "Course materials", "Research papers", "Skill development"],
      category: "Education"
    },
    {
      icon: Award,
      title: "Recognition Programs",
      description: "Celebrate achievements and honor outstanding contributions of our alumni community.",
      features: ["Alumni awards", "Achievement recognition", "Hall of fame", "Annual honors"],
      category: "Recognition"
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

  const categories = ["All", ...Array.from(new Set(services.map(service => service.category)))];
  const [selectedCategory, setSelectedCategory] = useState("All");

  const filteredServices = selectedCategory === "All" 
    ? services 
    : services.filter(service => service.category === selectedCategory);

  return (
    <div className="min-h-screen bg-slate-50 pt-20">
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

        {/* Category Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex flex-wrap justify-center gap-3 mb-12"
        >
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                selectedCategory === category
                  ? "bg-indigo-600 text-white shadow-lg"
                  : "bg-white text-gray-700 hover:bg-indigo-50 hover:text-indigo-600"
              }`}
            >
              {category}
            </button>
          ))}
        </motion.div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredServices.map((service, index) => (
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

        {filteredServices.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <p className="text-gray-500 text-lg">
              No services found in this category.
            </p>
          </motion.div>
        )}

        {/* Contact Section */}
        <motion.div
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
        </motion.div>
      </div>
    </div>
  );
};

export default Services;
