
import { GraduationCap, Users, Briefcase, BookOpen, Heart, Globe } from 'lucide-react';

const Services = () => {
  const services = [
    {
      icon: GraduationCap,
      title: "Scholarship Programs",
      description: "Financial assistance for deserving students to pursue higher education",
      features: ["Merit-based scholarships", "Need-based financial aid", "International study grants", "Vocational training support"],
      color: "blue"
    },
    {
      icon: Briefcase,
      title: "Career Development",
      description: "Professional guidance and job placement assistance for graduates",
      features: ["Resume building workshops", "Interview preparation", "Job placement assistance", "Industry networking events"],
      color: "green"
    },
    {
      icon: Users,
      title: "Alumni Networking",
      description: "Connect with fellow graduates for professional and personal growth",
      features: ["Alumni directory", "Regional chapters", "Professional meetups", "Online community platform"],
      color: "purple"
    },
    {
      icon: BookOpen,
      title: "Educational Resources",
      description: "Access to learning materials and continuing education opportunities",
      features: ["Online courses", "Research materials", "Library access", "Academic workshops"],
      color: "orange"
    },
    {
      icon: Heart,
      title: "Community Outreach",
      description: "Social welfare programs and community development initiatives",
      features: ["Charity drives", "Blood donation camps", "Environmental projects", "Disaster relief efforts"],
      color: "red"
    },
    {
      icon: Globe,
      title: "Global Connections",
      description: "International alumni network and cross-cultural exchange programs",
      features: ["International chapters", "Cultural exchange", "Global conferences", "Study abroad guidance"],
      color: "indigo"
    }
  ];

  const getColorClasses = (color: string) => {
    const colorMap = {
      blue: "bg-blue-50 text-blue-600 border-blue-200",
      green: "bg-green-50 text-green-600 border-green-200",
      purple: "bg-purple-50 text-purple-600 border-purple-200",
      orange: "bg-orange-50 text-orange-600 border-orange-200",
      red: "bg-red-50 text-red-600 border-red-200",
      indigo: "bg-indigo-50 text-indigo-600 border-indigo-200"
    };
    return colorMap[color as keyof typeof colorMap] || colorMap.blue;
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">Our Services</h1>
          <p className="text-lg text-gray-600">
            Comprehensive support services for our alumni community and current students
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <div key={index} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
              <div className="p-6">
                <div className={`inline-flex p-3 rounded-full ${getColorClasses(service.color)} mb-4`}>
                  <service.icon size={24} />
                </div>
                
                <h3 className="text-xl font-semibold text-gray-800 mb-3">
                  {service.title}
                </h3>
                
                <p className="text-gray-600 mb-6">
                  {service.description}
                </p>
                
                <ul className="space-y-2">
                  {service.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center text-sm text-gray-700">
                      <div className="w-2 h-2 bg-blue-600 rounded-full mr-3 flex-shrink-0"></div>
                      {feature}
                    </li>
                  ))}
                </ul>
                
                <button className="mt-6 w-full bg-gray-100 text-gray-800 py-2 rounded-lg hover:bg-gray-200 transition-colors">
                  Learn More
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Contact Section */}
        <div className="mt-16 bg-blue-600 text-white rounded-lg p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Need Help with Our Services?</h2>
          <p className="text-lg mb-6">
            Our dedicated team is here to assist you with any questions about our services
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
              Contact Support
            </button>
            <button className="border-2 border-white text-white px-6 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors">
              Schedule Consultation
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Services;
