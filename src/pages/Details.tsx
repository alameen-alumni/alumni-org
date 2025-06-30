
import { BookOpen, Users, Award, Globe } from 'lucide-react';

const Details = () => {
  return (
    <div className="min-h-screen bg-[#F9F7F1] py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-lg border border-[#186F65]/10">
          {/* Header */}
          <div className="bg-gradient-to-r from-[#186F65] to-[#B2533E] text-white p-8 rounded-t-lg">
            <h1 className="text-3xl font-serif font-bold mb-4">About Al Ameen Alumni Association</h1>
            <p className="text-xl font-sans">Al Ameen Mission Academy - Midnapore Branch</p>
          </div>

          <div className="p-8">
            {/* Mission Statement */}
            <section className="mb-12">
              <h2 className="text-2xl font-serif font-bold text-[#1F1F1F] mb-4">Our Mission</h2>
              <p className="text-lg text-[#666666] font-sans leading-relaxed">
                The Al Ameen Alumni Association serves as a bridge connecting past, present, and future students of 
                Al Ameen Mission Academy, Midnapore Branch. We are dedicated to fostering lifelong relationships, 
                supporting educational excellence, and contributing to the betterment of our community through 
                collaborative efforts rooted in Islamic values and modern education.
              </p>
            </section>

            {/* Key Information */}
            <section className="mb-12">
              <h2 className="text-2xl font-serif font-bold text-[#1F1F1F] mb-6">Key Information</h2>
              <div className="grid md:grid-cols-2 gap-8">
                <div className="bg-[#186F65]/10 p-6 rounded-lg border border-[#186F65]/20">
                  <div className="flex items-center mb-3">
                    <BookOpen className="text-[#186F65] mr-3" size={24} />
                    <h3 className="text-lg font-serif font-semibold text-[#186F65]">Established</h3>
                  </div>
                  <p className="text-[#666666] font-sans">Founded in 1985 with the vision of creating a strong alumni network</p>
                </div>

                <div className="bg-[#B2533E]/10 p-6 rounded-lg border border-[#B2533E]/20">
                  <div className="flex items-center mb-3">
                    <Users className="text-[#B2533E] mr-3" size={24} />
                    <h3 className="text-lg font-serif font-semibold text-[#B2533E]">Members</h3>
                  </div>
                  <p className="text-[#666666] font-sans">Over 1,500 alumni members across India and abroad</p>
                </div>

                <div className="bg-[#186F65]/10 p-6 rounded-lg border border-[#186F65]/20">
                  <div className="flex items-center mb-3">
                    <Award className="text-[#186F65] mr-3" size={24} />
                    <h3 className="text-lg font-serif font-semibold text-[#186F65]">Recognition</h3>
                  </div>
                  <p className="text-[#666666] font-sans">Recognized by West Bengal Government for educational excellence</p>
                </div>

                <div className="bg-[#B2533E]/10 p-6 rounded-lg border border-[#B2533E]/20">
                  <div className="flex items-center mb-3">
                    <Globe className="text-[#B2533E] mr-3" size={24} />
                    <h3 className="text-lg font-serif font-semibold text-[#B2533E]">Reach</h3>
                  </div>
                  <p className="text-[#666666] font-sans">Active presence in West Bengal, Assam, Delhi, and overseas</p>
                </div>
              </div>
            </section>

            {/* Contact Details */}
            <section className="mb-12">
              <h2 className="text-2xl font-serif font-bold text-[#1F1F1F] mb-6">Contact Details</h2>
              <div className="bg-[#F9F7F1] p-6 rounded-lg border border-[#186F65]/20">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-serif font-semibold text-[#1F1F1F] mb-2">Main Office</h3>
                    <p className="text-[#666666] font-sans">
                      Al Ameen Mission Academy<br />
                      Midnapore, West Bengal<br />
                      India - 721101
                    </p>
                  </div>
                  <div>
                    <h3 className="font-serif font-semibold text-[#1F1F1F] mb-2">Contact Information</h3>
                    <p className="text-[#666666] font-sans">
                      Phone: +91 98765 43210<br />
                      Email: alumni@alameenmission.edu.in<br />
                      Website: www.alameenmissionmidnapore.org
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* Objectives */}
            <section>
              <h2 className="text-2xl font-serif font-bold text-[#1F1F1F] mb-6">Our Objectives</h2>
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="w-2 h-2 bg-[#186F65] rounded-full mt-2 mr-4 flex-shrink-0"></div>
                  <p className="text-[#666666] font-sans">Foster lifelong connections among alumni, students, and faculty</p>
                </div>
                <div className="flex items-start">
                  <div className="w-2 h-2 bg-[#186F65] rounded-full mt-2 mr-4 flex-shrink-0"></div>
                  <p className="text-[#666666] font-sans">Support educational initiatives and student development programs</p>
                </div>
                <div className="flex items-start">
                  <div className="w-2 h-2 bg-[#186F65] rounded-full mt-2 mr-4 flex-shrink-0"></div>
                  <p className="text-[#666666] font-sans">Provide career guidance and mentorship opportunities</p>
                </div>
                <div className="flex items-start">
                  <div className="w-2 h-2 bg-[#186F65] rounded-full mt-2 mr-4 flex-shrink-0"></div>
                  <p className="text-[#666666] font-sans">Uphold Islamic values while embracing modern educational practices</p>
                </div>
                <div className="flex items-start">
                  <div className="w-2 h-2 bg-[#186F65] rounded-full mt-2 mr-4 flex-shrink-0"></div>
                  <p className="text-[#666666] font-sans">Preserve and promote the heritage and values of our institution</p>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Details;
