import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Award, Heart, BookOpen, Users, Lightbulb, GraduationCap, Calendar, Target } from "lucide-react";

const Details = () => {
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
            About Our Association
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Learn more about the Alumni Association Midnapore, our history, mission, 
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
                <p className="text-gray-700 leading-relaxed mb-4">
                  In the Name of Allah, the Most Gracious, the Most Merciful.
                </p>
                <p className="text-gray-700 leading-relaxed mb-4">
                  The journey of the Alumni Association Midnapore began not merely as an initiative, but as a heartfelt intention — born from the hearts of a few brothers and sisters united by the blessings of Al-Ameen Mission Midnapore.
                </p>
                <p className="text-gray-700 leading-relaxed mb-4">
                  In 2018, a group of grateful alumni came together under the banner of Alumni Forum Midnapore, bound by the rope of Allah and driven by a shared purpose: to give back in the path of goodness. Through charitable acts and a blessed reunion, a seed of unity was sown.
                </p>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Today, in 2025, by the Will of Allah, that seed has blossomed into the officially formed Alumni Association Midnapore — a reflection of our unity, gratitude, and sincere purpose.
                </p>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Though the formal registration is recent, our journey is deeply rooted in the blessed soil of Al-Ameen Mission, which began in 2007 at Dharma (Old Campus), Paschim Medinipur, and in 2008 at Sepoybazar. A major turning point came in 2011 with the establishment of the full-fledged boys' residential section at Elahiganj — a sanctuary for learning and character-building, nurtured in the light of knowledge and faith.
                </p>
                <p className="text-gray-700 leading-relaxed mb-4">
                  In 2012, the introduction of the girls' section expanded this blessing further — nurturing our future generation of mothers. In 2025, it was granted its own campus, right beside the main boys' campus at Elahiganj, enabling opportunities for all classes up to Grade XII.
                </p>
                <p className="text-gray-700 leading-relaxed">
                  Since then, by the Grace of Allah, 17 boys' batches and 12 girls' batches have passed through these gates, leaving behind footprints of dedication, adab, and excellence.
                </p>
              </CardContent>
            </Card>
          </motion.div>

          {/* Vision Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <Target className="h-6 w-6 text-indigo-600" />
                  Our Vision
                </CardTitle>
              </CardHeader>
              <CardContent className="prose prose-gray max-w-none">
                <p className="text-gray-700 leading-relaxed mb-4">
                  Our vision is simple, yet deeply spiritual — to remain connected in hearts and in du'ā, long after we part ways from the gates of our beloved institution.
                </p>
                <p className="text-gray-700 leading-relaxed mb-4">
                  The Alumni Association Midnapore is our collective trust — a means of fulfilling our responsibilities toward our alma mater, our juniors, and the ummah at large. We strive to uphold the values instilled in us: sincerity, humanity, knowledge, and service.
                </p>
                <p className="text-gray-700 leading-relaxed mb-4">
                  Through reunions that revive love, mentorships that light the path, scholarships that open doors, and initiatives that uplift the ummah, we hope to be a source of ṣadaqah jāriyah.
                </p>
                <div className="bg-gray-50 p-4 rounded-lg border-l-4 border-indigo-600 my-6">
                  <p className="text-gray-700 italic">
                    Let our footsteps be guided by the words of our beloved Prophet ﷺ:
                  </p>
                  <blockquote className="text-gray-800 font-medium mt-2">
                    "The most beloved of people to Allah are those who are most beneficial to others."
                  </blockquote>
                  <p className="text-sm text-gray-600 mt-2">(Hadith)</p>
                </div>
                <p className="text-gray-700 leading-relaxed">
                  May Allah keep our intentions pure, our bonds strong, and our journey ever pleasing to Him.
                </p>
                <p className="text-gray-700 font-medium mt-4">Āmīn.</p>
              </CardContent>
            </Card>
          </motion.div>

          {/* Core Values */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <Award className="h-6 w-6 text-indigo-600" />
                  Core Values
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div className="bg-gradient-to-br from-red-50 to-red-100 p-6 rounded-xl border border-red-200 hover:shadow-lg transition-all duration-300">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="bg-red-500 p-3 rounded-full">
                        <Heart className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-red-800">Sincerity</h3>
                        <Badge className="bg-red-200 text-red-800 hover:bg-red-200">Authentic</Badge>
                      </div>
                    </div>
                    <p className="text-gray-700 leading-relaxed">
                      Authentic commitment to our purpose with pure intentions and genuine dedication to serving our community.
                    </p>
                  </div>

                  <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl border border-blue-200 hover:shadow-lg transition-all duration-300">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="bg-blue-500 p-3 rounded-full">
                        <Users className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-blue-800">Humanity</h3>
                        <Badge className="bg-blue-200 text-blue-800 hover:bg-blue-200">Compassionate</Badge>
                      </div>
                    </div>
                    <p className="text-gray-700 leading-relaxed">
                      Compassion and service to others, treating everyone with dignity, respect, and understanding.
                    </p>
                  </div>

                  <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-xl border border-green-200 hover:shadow-lg transition-all duration-300">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="bg-green-500 p-3 rounded-full">
                        <BookOpen className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-green-800">Knowledge</h3>
                        <Badge className="bg-green-200 text-green-800 hover:bg-green-200">Wisdom</Badge>
                      </div>
                    </div>
                    <p className="text-gray-700 leading-relaxed">
                      Pursuit of wisdom and learning, fostering intellectual growth and sharing knowledge for collective progress.
                    </p>
                  </div>

                  <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-xl border border-purple-200 hover:shadow-lg transition-all duration-300">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="bg-purple-500 p-3 rounded-full">
                        <GraduationCap className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-purple-800">Service</h3>
                        <Badge className="bg-purple-200 text-purple-800 hover:bg-purple-200">Dedicated</Badge>
                      </div>
                    </div>
                    <p className="text-gray-700 leading-relaxed">
                      Dedication to community upliftment through selfless service and meaningful contributions to society.
                    </p>
                  </div>

                  <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 p-6 rounded-xl border border-yellow-200 hover:shadow-lg transition-all duration-300">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="bg-yellow-500 p-3 rounded-full">
                        <Lightbulb className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-yellow-800">Innovation</h3>
                        <Badge className="bg-yellow-200 text-yellow-800 hover:bg-yellow-200">Creative</Badge>
                      </div>
                    </div>
                    <p className="text-gray-700 leading-relaxed">
                      Creative solutions for progress, embracing new ideas and approaches to address challenges effectively.
                    </p>
                  </div>

                  <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 p-6 rounded-xl border border-indigo-200 hover:shadow-lg transition-all duration-300">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="bg-indigo-500 p-3 rounded-full">
                        <Award className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-indigo-800">Excellence</h3>
                        <Badge className="bg-indigo-200 text-indigo-800 hover:bg-indigo-200">Quality</Badge>
                      </div>
                    </div>
                    <p className="text-gray-700 leading-relaxed">
                      Striving for the highest standards in everything we do, maintaining quality and integrity in all endeavors.
                    </p>
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
