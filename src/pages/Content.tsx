import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Users, Award, Target } from "lucide-react";

const Content = () => {
  const contentSections = [
    {
      icon: BookOpen,
      title: "Educational Resources",
      description: "Access to academic materials, research papers, and educational content shared by our alumni community.",
      items: ["Research Publications", "Study Materials", "Online Courses", "Webinar Recordings"]
    },
    {
      icon: Users,
      title: "Alumni Stories",
      description: "Inspiring stories and achievements from our alumni network around the world.",
      items: ["Success Stories", "Career Journeys", "Life Experiences", "Mentorship Tales"]
    },
    {
      icon: Award,
      title: "Achievements",
      description: "Celebrating the accomplishments and milestones of our alumni in various fields.",
      items: ["Awards & Honors", "Professional Milestones", "Community Service", "Innovation Projects"]
    },
    {
      icon: Target,
      title: "Mission & Values",
      description: "Our core principles and objectives that guide the alumni association's activities.",
      items: ["Vision Statement", "Core Values", "Strategic Goals", "Community Impact"]
    }
  ];

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
            Content & Resources
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Explore our comprehensive collection of educational content, community stories, 
            and resources curated for our alumni network.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {contentSections.map((section, index) => (
            <motion.div
              key={section.title}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <Card className="h-full hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                <CardHeader>
                  <div className="flex items-center gap-4 mb-4">
                    <div className="p-3 bg-indigo-100 rounded-lg">
                      <section.icon className="h-6 w-6 text-indigo-600" />
                    </div>
                    <CardTitle className="text-xl font-semibold">
                      {section.title}
                    </CardTitle>
                  </div>
                  <p className="text-gray-600">
                    {section.description}
                  </p>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {section.items.map((item) => (
                      <Badge 
                        key={item} 
                        variant="secondary"
                        className="text-xs"
                      >
                        {item}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-16 text-center"
        >
          <Card className="bg-teal-700 text-white">
            <CardHeader>
              <CardTitle className="text-2xl mb-4">
                Contribute Your Content
              </CardTitle>
              <p className="text-indigo-100">
                Share your knowledge, experiences, and resources with the alumni community. 
                Your contributions help strengthen our network and support fellow alumni.
              </p>
            </CardHeader>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default Content;
