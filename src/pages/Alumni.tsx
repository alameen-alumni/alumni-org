
import { GraduationCap, MapPin, Briefcase, Mail } from 'lucide-react';

const Alumni = () => {
  const featuredAlumni = [
    {
      id: 1,
      name: "Dr. Sarah Ahmed",
      graduation: "Class of 2010",
      profession: "Chief Medical Officer",
      company: "City General Hospital",
      location: "Dhaka, Bangladesh",
      image: "https://images.unsplash.com/photo-1649972904349-6e44c42644a7?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
    },
    {
      id: 2,
      name: "Mohammad Rahman",
      graduation: "Class of 2008",
      profession: "Software Engineer",
      company: "Tech Solutions Ltd",
      location: "Midnapur, India",
      image: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
    },
    {
      id: 3,
      name: "Fatima Khan",
      graduation: "Class of 2012",
      profession: "Education Director",
      company: "International School",
      location: "Kathmandu, Nepal",
      image: "https://images.unsplash.com/photo-1649972904349-6e44c42644a7?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
    }
  ];

  const stats = [
    { label: "Total Alumni", value: "2,500+" },
    { label: "Countries", value: "15+" },
    { label: "Active Members", value: "1,200+" },
    { label: "Years of Legacy", value: "25+" }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">Our Alumni Network</h1>
          <p className="text-lg text-gray-600">
            Connecting graduates across the globe, building lasting relationships and opportunities
          </p>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white rounded-lg shadow-lg p-6 text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">{stat.value}</div>
              <div className="text-gray-600">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Featured Alumni */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-800 mb-8 text-center">Featured Alumni</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {featuredAlumni.map((alumni) => (
              <div key={alumni.id} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                <div className="aspect-square">
                  <img 
                    src={alumni.image} 
                    alt={alumni.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">{alumni.name}</h3>
                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex items-center">
                      <GraduationCap size={16} className="mr-2" />
                      {alumni.graduation}
                    </div>
                    <div className="flex items-center">
                      <Briefcase size={16} className="mr-2" />
                      {alumni.profession}
                    </div>
                    <div className="flex items-center">
                      <MapPin size={16} className="mr-2" />
                      {alumni.location}
                    </div>
                  </div>
                  <button className="mt-4 w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition-colors flex items-center justify-center">
                    <Mail size={16} className="mr-2" />
                    Connect
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Join Alumni Network */}
        <div className="bg-blue-600 text-white rounded-lg p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Join Our Alumni Network</h2>
          <p className="text-lg mb-6">
            Connect with fellow graduates, access exclusive opportunities, and contribute to our growing community
          </p>
          <button className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
            Register Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default Alumni;
