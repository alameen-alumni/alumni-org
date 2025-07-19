import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Users, Award, Target, Mail, Phone } from "lucide-react";

const Details = () => {
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
            About Our Association
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Learn more about the Alumni Association Midnapur, our history, mission, 
            and the impact we're making in our community.
          </p>
        </motion.div>

        <div className="space-y-8">
          {/* History Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <Calendar className="h-6 w-6 text-indigo-600" />
                  Our History
                </CardTitle>
              </CardHeader>
              <CardContent className="prose prose-gray max-w-none">
                <p className="text-gray-700 leading-relaxed">
                  Founded in 1985, the Alumni Association Midnapur has been a cornerstone of 
                  educational excellence and community service for nearly four decades. Starting 
                  with just 50 founding members, we have grown into a vibrant network of over 
                  2,000 alumni across the globe.
                </p>
                <p className="text-gray-700 leading-relaxed mt-4">
                  Our association was established with the vision of maintaining lifelong 
                  connections between graduates and fostering a spirit of giving back to 
                  our alma mater and community. Over the years, we have facilitated countless 
                  reunions, scholarships, and community development projects.
                </p>
              </CardContent>
            </Card>
          </motion.div>

          {/* Mission & Vision */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <Target className="h-6 w-6 text-indigo-600" />
                  Mission & Vision
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-3 text-indigo-600">Our Mission</h3>
                    <p className="text-gray-700 leading-relaxed">
                      To create a strong network of alumni that supports educational excellence, 
                      professional development, and community service while preserving the 
                      values and traditions of our institution.
                    </p>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-3 text-indigo-600">Our Vision</h3>
                    <p className="text-gray-700 leading-relaxed">
                      To be the leading alumni association that empowers graduates to achieve 
                      their full potential while contributing meaningfully to society and 
                      maintaining lifelong connections with their alma mater.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Key Statistics */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <Users className="h-6 w-6 text-indigo-600" />
                  Key Statistics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-indigo-600 mb-2">200+</div>
                    <div className="text-sm text-gray-600">Alumni Members</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-indigo-600 mb-2">5</div>
                    <div className="text-sm text-gray-600">Years of Service</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-indigo-600 mb-2">5+</div>
                    <div className="text-sm text-gray-600">Districts</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-indigo-600 mb-2">₹2lakh+</div>
                    <div className="text-sm text-gray-600">Charity Given</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Core Values */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <Award className="h-6 w-6 text-indigo-600" />
                  Core Values
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  {[
                    "Educational Excellence",
                    "Community Service",
                    "Integrity & Ethics",
                    "Innovation & Growth",
                    "Diversity & Inclusion",
                    "Lifelong Learning"
                  ].map((value) => (
                    <div key={value} className="flex items-center gap-3">
                      <Badge className="bg-indigo-100 text-indigo-800">
                        ✓
                      </Badge>
                      <span className="text-gray-700">{value}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Contact Information */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <Card className="bg-teal-700 text-white">
              <CardHeader>
                <CardTitle className="text-2xl mb-4">
                  Get in Touch
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <Mail className="h-5 w-5" />
                      <div>
                        <p className="font-medium">Email</p>
                        <p className="text-indigo-100">info@alumni-midnapur.org</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Phone className="h-5 w-5" />
                      <div>
                        <p className="font-medium">Phone</p>
                        <p className="text-indigo-100">+91 98765 43210</p>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Office Hours</h3>
                    <div className="text-indigo-100 space-y-1">
                      <p>Monday - Friday: 10:00 AM - 6:00 PM</p>
                      <p>Saturday: 10:00 AM - 2:00 PM</p>
                      <p>Sunday: Closed</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Details;
