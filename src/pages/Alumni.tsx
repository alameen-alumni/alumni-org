import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { GraduationCap, MapPin, Briefcase, Mail, Users, Award, Globe, Calendar } from 'lucide-react';
import { useState, useEffect } from "react";

const Alumni = () => {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [alumniSlider, setAlumniSlider] = useState([]);

  // Fetch random user images for the slider
  useEffect(() => {
    const fetchAlumniImages = async () => {
      try {
        const response = await fetch('https://randomuser.me/api/?results=20&inc=picture,name');
        const data = await response.json();
        const alumniData = data.results.map((user, index) => ({
          id: index + 1,
          name: `${user.name.first} ${user.name.last}`,
          image: user.picture.large,
          graduation: `Class of ${2010 + Math.floor(Math.random() * 15)}`,
          profession: ['Software Engineer', 'Doctor', 'Teacher', 'Business Analyst', 'Designer', 'Researcher'][Math.floor(Math.random() * 6)],
          location: ['Dhaka, Bangladesh', 'Mumbai, India', 'Karachi, Pakistan', 'Dubai, UAE', 'Kathmandu, Nepal', 'Singapore'][Math.floor(Math.random() * 6)]
        }));
        setAlumniSlider(alumniData);
      } catch (error) {
        console.error('Error fetching alumni images:', error);
        // Fallback data if API fails
        const fallbackData = Array.from({ length: 20 }, (_, index) => ({
          id: index + 1,
          name: `Alumni ${index + 1}`,
          image: `https://images.unsplash.com/photo-${1500000000000 + index}?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80`,
          graduation: `Class of ${2010 + Math.floor(Math.random() * 15)}`,
          profession: ['Software Engineer', 'Doctor', 'Teacher', 'Business Analyst', 'Designer', 'Researcher'][Math.floor(Math.random() * 6)],
          location: ['Dhaka, Bangladesh', 'Mumbai, India', 'Karachi, Pakistan', 'Dubai, UAE', 'Kathmandu, Nepal', 'Singapore'][Math.floor(Math.random() * 6)]
        }));
        setAlumniSlider(fallbackData);
      }
    };

    fetchAlumniImages();
  }, []);

  const [featuredAlumni, setFeaturedAlumni] = useState([]);

  // Fetch featured alumni data with Random User API
  useEffect(() => {
    const fetchFeaturedAlumni = async () => {
      try {
        const response = await fetch('https://randomuser.me/api/?results=12&inc=picture,name');
        const data = await response.json();
        const featuredData = data.results.map((user, index) => {
          const categories = [
            "Healthcare", "Technology", "Education", "Business", "Research", "Design",
            "Finance", "Marketing", "Engineering", "Consulting", "Academia", "Entrepreneurship"
          ];
          const professions = [
            "Chief Medical Officer", "Software Engineer", "Education Director", 
            "Business Analyst", "Research Scientist", "Architect",
            "Financial Analyst", "Marketing Manager", "Civil Engineer",
            "Management Consultant", "Professor", "Startup Founder"
          ];
          const companies = [
            "City General Hospital", "Tech Solutions Ltd", "International School",
            "Global Consulting", "National Institute", "Design Studio",
            "Investment Bank", "Digital Marketing Agency", "Construction Corp",
            "Strategy Partners", "University", "Innovation Labs"
          ];
          const locations = [
            "Dhaka, Bangladesh", "Midnapur, India", "Kathmandu, Nepal",
            "Dubai, UAE", "Mumbai, India", "Karachi, Pakistan",
            "Singapore", "London, UK", "Toronto, Canada", "Sydney, Australia",
            "New York, USA", "Berlin, Germany"
          ];
          
          return {
            id: index + 1,
            name: `${user.name.first} ${user.name.last}`,
            graduation: `Class of ${2010 + Math.floor(Math.random() * 15)}`,
            profession: professions[index],
            company: companies[index],
            location: locations[index],
            image: user.picture.large,
            category: categories[index]
          };
        });
        setFeaturedAlumni(featuredData);
      } catch (error) {
        console.error('Error fetching featured alumni:', error);
        // Fallback data if API fails
        const fallbackData = Array.from({ length: 12 }, (_, index) => {
          const categories = [
            "Healthcare", "Technology", "Education", "Business", "Research", "Design",
            "Finance", "Marketing", "Engineering", "Consulting", "Academia", "Entrepreneurship"
          ];
          const professions = [
            "Chief Medical Officer", "Software Engineer", "Education Director", 
            "Business Analyst", "Research Scientist", "Architect",
            "Financial Analyst", "Marketing Manager", "Civil Engineer",
            "Management Consultant", "Professor", "Startup Founder"
          ];
          const companies = [
            "City General Hospital", "Tech Solutions Ltd", "International School",
            "Global Consulting", "National Institute", "Design Studio",
            "Investment Bank", "Digital Marketing Agency", "Construction Corp",
            "Strategy Partners", "University", "Innovation Labs"
          ];
          const locations = [
            "Dhaka, Bangladesh", "Midnapur, India", "Kathmandu, Nepal",
            "Dubai, UAE", "Mumbai, India", "Karachi, Pakistan",
            "Singapore", "London, UK", "Toronto, Canada", "Sydney, Australia",
            "New York, USA", "Berlin, Germany"
          ];
          
          return {
            id: index + 1,
            name: `Alumni ${index + 1}`,
            graduation: `Class of ${2010 + Math.floor(Math.random() * 15)}`,
            profession: professions[index],
            company: companies[index],
            location: locations[index],
            image: `https://images.unsplash.com/photo-${1500000000000 + index}?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80`,
            category: categories[index]
          };
        });
        setFeaturedAlumni(fallbackData);
      }
    };

    fetchFeaturedAlumni();
  }, []);

  const stats = [
    { 
      label: "Total Alumni", 
      value: "2,500+",
      icon: Users,
      color: "text-blue-600"
    },
    { 
      label: "Countries", 
      value: "15+",
      icon: Globe,
      color: "text-green-600"
    },
    { 
      label: "Active Members", 
      value: "1,200+",
      icon: Award,
      color: "text-purple-600"
    },
    { 
      label: "Years of Legacy", 
      value: "25+",
      icon: Calendar,
      color: "text-orange-600"
    }
  ];

  const categories = ["All", ...Array.from(new Set(featuredAlumni.map(alumni => alumni.category)))];
  
  const filteredAlumni = selectedCategory === "All" 
    ? featuredAlumni 
    : featuredAlumni.filter(alumni => alumni.category === selectedCategory);

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
            Our Alumni Network
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Connecting graduates across the globe, building lasting relationships 
            and opportunities for our community.
          </p>
        </motion.div>

        {/* Statistics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
            >
              <Card className="text-center hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                <CardContent className="p-6">
                  <div className={`text-3xl mb-2 ${stat.color}`}>
                    <stat.icon className="h-8 w-8 mx-auto mb-2" />
                  </div>
                  <div className="text-3xl font-bold text-gray-900 mb-2">{stat.value}</div>
                  <div className="text-gray-600">{stat.label}</div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Alumni Slider Carousel */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mb-16"
        >
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Our Alumni Community</h2>
            <p className="text-gray-600">Meet our alumni from around the world</p>
          </div>
          
          <div className="relative overflow-hidden">
            <div className="flex animate-scroll py-4">
              {alumniSlider.map((alumni, index) => (
                <div
                  key={alumni.id}
                  className="flex-shrink-0 w-40 md:w-44 mx-2"
                >
                  <Card className="h-full hover:shadow-lg transition-all duration-300 hover:-translate-y-2">
                    <div className="aspect-square overflow-hidden rounded-t-lg">
                      <img 
                        src={alumni.image} 
                        alt={alumni.name}
                        className="w-full h-full object-cover transition-transform duration-300 hover:scale-110 rounded-t-lg"
                      />
                    </div>
                    <CardContent className="p-3 text-center">
                      <h3 className="font-semibold text-gray-900 text-xs mb-1 truncate">
                        {alumni.name}
                      </h3>
                      <p className="text-xs text-gray-600 mb-1">
                        {alumni.graduation}
                      </p>
                      <p className="text-xs text-gray-500 truncate">
                        {alumni.profession}
                      </p>
                      <p className="text-xs text-gray-500 truncate">
                        {alumni.location}
                      </p>
                    </CardContent>
                  </Card>
                </div>
              ))}
              {/* Duplicate items for seamless loop */}
              {alumniSlider.slice(0, 5).map((alumni, index) => (
                <div
                  key={`duplicate-${alumni.id}`}
                  className="flex-shrink-0 w-40 md:w-44 mx-2"
                >
                  <Card className="h-full hover:shadow-lg transition-all duration-300 hover:-translate-y-2">
                    <div className="aspect-square overflow-hidden rounded-t-lg">
                      <img 
                        src={alumni.image} 
                        alt={alumni.name}
                        className="w-full h-full object-cover transition-transform duration-300 hover:scale-110 rounded-t-lg"
                      />
                    </div>
                    <CardContent className="p-3 text-center">
                      <h3 className="font-semibold text-gray-900 text-xs mb-1 truncate">
                        {alumni.name}
                      </h3>
                      <p className="text-xs text-gray-600 mb-1">
                        {alumni.graduation}
                      </p>
                      <p className="text-xs text-gray-500 truncate">
                        {alumni.profession}
                      </p>
                      <p className="text-xs text-gray-500 truncate">
                        {alumni.location}
                      </p>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Category Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
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

        {/* Featured Alumni */}
        <div className="mb-12">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.7 }}
            className="text-2xl font-bold text-gray-900 mb-8 text-center"
          >
            Featured Alumni
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredAlumni.map((alumni, index) => (
              <motion.div
                key={alumni.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.8 + index * 0.1 }}
                layout
              >
                <Card className="h-full hover:shadow-lg transition-all duration-300 hover:-translate-y-1 rounded-lg">
                  <div className="aspect-[4/3] overflow-hidden">
                    <img 
                      src={alumni.image} 
                      alt={alumni.name}
                      className="w-full h-full object-cover transition-transform duration-300 hover:scale-105 rounded-t-lg"
                    />
                  </div>
                  <CardHeader className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <CardTitle className="text-base font-semibold">{alumni.name}</CardTitle>
                      <Badge variant="secondary" className="text-xs">
                        {alumni.category}
                      </Badge>
                    </div>
                    <div className="space-y-1 text-xs text-gray-600">
                      <div className="flex items-center">
                        <GraduationCap size={14} className="mr-2 text-indigo-600" />
                        {alumni.graduation}
                      </div>
                      <div className="flex items-center">
                        <Briefcase size={14} className="mr-2 text-indigo-600" />
                        {alumni.profession}
                      </div>
                      <div className="flex items-center">
                        <MapPin size={14} className="mr-2 text-indigo-600" />
                        {alumni.location}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-4 pt-0">
                    <Button className="w-full text-xs py-2">
                      <Mail size={14} className="mr-2" />
                      Connect
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>

        {filteredAlumni.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <p className="text-gray-500 text-lg">
              No alumni found in this category.
            </p>
          </motion.div>
        )}

        {/* Join Alumni Network */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.0 }}
          className="mt-16"
        >
          <Card className="bg-teal-700 text-white">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl md:text-3xl mb-4">
                Join Our Alumni Network
              </CardTitle>
              <p className="text-indigo-100 text-lg max-w-2xl mx-auto">
                Connect with fellow graduates, access exclusive opportunities, and contribute 
                to our growing community. Be part of something bigger.
              </p>
            </CardHeader>
            <CardContent className="text-center">
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button className="bg-white text-indigo-600 hover:bg-gray-100">
                  Register Now
                </Button>
                <Button variant="outline" className="border-white text-black hover:bg-white hover:text-indigo-600">
                  Learn More
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default Alumni; 