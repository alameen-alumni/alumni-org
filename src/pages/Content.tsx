
import { BookOpen, Users, Award, Heart } from 'lucide-react';

const Content = () => {
  const contentSections = [
    {
      icon: BookOpen,
      title: 'Educational Resources',
      description: 'Access study materials, research papers, and academic resources contributed by our distinguished alumni community.',
      color: 'bg-[#186F65]/10 text-[#186F65]'
    },
    {
      icon: Users,
      title: 'Alumni Stories',
      description: 'Read inspiring success stories and career journeys shared by our accomplished graduates making their mark globally.',
      color: 'bg-[#B2533E]/10 text-[#B2533E]'
    },
    {
      icon: Award,
      title: 'Achievement Archives',
      description: 'Celebrate the remarkable achievements of our alumni in various fields including academia, business, and social service.',
      color: 'bg-purple-100 text-purple-800'
    },
    {
      icon: Heart,
      title: 'Mission Publications',
      description: 'Explore newsletters, magazines, and publications that showcase our mission values and community initiatives.',
      color: 'bg-orange-100 text-orange-800'
    }
  ];

  return (
    <div className="min-h-screen bg-[#F9F7F1] py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-serif font-bold text-[#1F1F1F] mb-4">
            Content & Resources
          </h1>
          <div className="w-24 h-1 bg-gradient-to-r from-[#186F65] to-[#B2533E] mx-auto mb-4"></div>
          <p className="text-lg text-[#666666] max-w-3xl mx-auto leading-relaxed">
            Discover valuable resources, inspiring stories, and educational materials that reflect 
            our mission's commitment to knowledge, service, and community excellence.
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8 border border-[#186F65]/10">
          <div className="grid md:grid-cols-2 gap-8">
            {contentSections.map((section, index) => (
              <div key={index} className="group hover:scale-105 transition-all duration-300">
                <div className="bg-[#F9F7F1] rounded-xl p-6 h-full border border-[#186F65]/5 hover:border-[#186F65]/20 transition-all">
                  <div className={`w-12 h-12 rounded-lg ${section.color} flex items-center justify-center mb-4`}>
                    <section.icon size={24} />
                  </div>
                  <h3 className="text-xl font-serif font-semibold text-[#1F1F1F] mb-3">
                    {section.title}
                  </h3>
                  <p className="text-[#666666] leading-relaxed">
                    {section.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Featured Content Section */}
        <div className="bg-gradient-to-r from-[#186F65] to-[#B2533E] rounded-2xl p-8 text-white">
          <div className="text-center">
            <h2 className="text-2xl md:text-3xl font-serif font-bold mb-4">
              Join Our Knowledge Network
            </h2>
            <p className="text-lg mb-6 text-white/90 max-w-2xl mx-auto">
              Contribute your expertise, share your experiences, and help build a comprehensive 
              resource library for future generations of Al Ameen students.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-white text-[#186F65] px-8 py-3 rounded-full font-semibold hover:bg-[#F9F7F1] transition-all duration-300">
                Share Your Story
              </button>
              <button className="border-2 border-white text-white px-8 py-3 rounded-full font-semibold hover:bg-white hover:text-[#186F65] transition-all duration-300">
                Browse Resources
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Content;
