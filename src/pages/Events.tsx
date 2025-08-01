import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Users, Award, Target, Clock, MapPin, X } from "lucide-react";
import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Skeleton } from "@/components/ui/skeleton";

const Events = () => {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState(null);

  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      try {
        const querySnapshot = await getDocs(collection(db, "events"));
        setEvents(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      } catch (error) {
        setEvents([]);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  const categories = ["All", ...Array.from(new Set(events.map(e => e.category).filter(Boolean)))];
  const filteredEvents = selectedCategory === "All" ? events : events.filter(e => e.category === selectedCategory);

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
            Events
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Stay up to date with our latest alumni events, webinars, ceremonies, and more.
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
        {/* Events List */}
        <div className="space-y-6">
          {loading ? (
            // Show 4 skeleton cards while loading
            Array.from({ length: 4 }).map((_, index) => (
              <motion.div
                key={`skeleton-${index}`}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card className="hover:shadow-lg transition-all duration-300">
                  <div className="flex flex-col md:flex-row">
                    <Skeleton className="w-full md:w-1/3 h-48 md:h-auto" />
                    <div className="flex-1 p-6">
                      <div className="flex items-center gap-4 mb-2">
                        <Skeleton className="p-3 w-12 h-12 rounded-lg" />
                        <Skeleton className="h-6 w-3/4" />
                      </div>
                      <div className="flex items-center gap-3 mb-2">
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-4 w-16" />
                      </div>
                      <Skeleton className="h-4 w-full mb-2" />
                      <Skeleton className="h-4 w-2/3 mb-2" />
                      <Skeleton className="h-4 w-1/2" />
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))
          ) : (
            filteredEvents.map((event, index) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <Card className="hover:shadow-lg transition-all duration-300 cursor-pointer" onClick={() => setSelectedEvent(event)}>
                <div className="flex flex-col md:flex-row">
                  {/* Event Image */}
                  {event.image && event.image.length > 0 && (
                    <div className="relative w-full md:w-1/3">
                      <img
                        src={event.image[0]}
                        alt={event.title}
                        className="w-full h-48 md:h-full object-contain sm:object-cover rounded-t-lg md:rounded-l-lg md:rounded-r-none"
                      />
                      <div className="absolute top-3 right-3">
                        <Badge variant="outline" className="bg-white/90">
                          {event.category}
                        </Badge>
                      </div>
                    </div>
                  )}
                  {/* Event Details */}
                  <div className="flex-1 p-6">
                    <div className="flex items-center gap-4 mb-2">
                      <div className="p-3 bg-indigo-100 rounded-lg">
                        <Calendar className="h-6 w-6 text-indigo-600" />
                      </div>
                      <CardTitle className="text-xl sm:text-xl font-semibold">
                        {event.title}
                      </CardTitle>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-gray-500 mb-2">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {new Date(event.date).toLocaleDateString()}
                      </div>
                      {event.time && (
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {event.time}
                        </div>
                      )}
                    </div>
                    <p className="text-gray-700 mb-3 text-sm sm:text-base">
                      {event.description}
                    </p>
                    {event.venue && (
                      <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
                        <MapPin className="h-4 w-4" />
                        <span>{event.venue}</span>
                      </div>
                    )}
                    {event.details && (
                      <div className="bg-indigo-50 p-3 rounded-lg">
                        <p className="text-sm text-indigo-800 font-medium">
                          {event.details}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            </motion.div>
          ))
          )}
        </div>
        {filteredEvents.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <p className="text-gray-500 text-lg">
              No events found in this category.
            </p>
          </motion.div>
        )}
        {selectedEvent && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedEvent(null)}
          >
            <div className="relative max-w-2xl w-full bg-white rounded-lg shadow-lg overflow-hidden" onClick={e => e.stopPropagation()}>
              {selectedEvent.image && selectedEvent.image.length > 0 && (
                <img
                  src={selectedEvent.image[0]}
                  alt={selectedEvent.title}
                  className="w-full h-auto max-h-96 object-contain"
                />
              )}
              <div className="p-6">
                <h2 className="text-2xl font-bold mb-2">{selectedEvent.title}</h2>
                <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                  <Calendar className="h-4 w-4" />
                  {new Date(selectedEvent.date).toLocaleDateString()}
                  {selectedEvent.time && (
                    <>
                      <Clock className="h-4 w-4" />
                      {selectedEvent.time}
                    </>
                  )}
                  <Badge variant="outline" className="ml-2">{selectedEvent.category}</Badge>
                </div>
                <p className="text-gray-700 mb-4 text-sm sm:text-base">{selectedEvent.description}</p>
                {selectedEvent.venue && (
                  <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                    <MapPin className="h-4 w-4" />
                    <span>{selectedEvent.venue}</span>
                  </div>
                )}
                {selectedEvent.details && (
                  <div className="bg-indigo-50 p-3 rounded-lg mb-4">
                    <p className="text-sm text-indigo-800 font-medium">{selectedEvent.details}</p>
                  </div>
                )}
                <button
                  onClick={() => setSelectedEvent(null)}
                  className="absolute top-4 right-4 text-gray-700 text-2xl font-bold bg-white/80 rounded-full px-1 py-1 hover:bg-white"
                >
                  <X/>
                </button>
              </div>
            </div>
          </motion.div>
        )}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-16 text-center"
        >
          <Card className="bg-teal-700 text-white">
            <CardHeader>
              <CardTitle className="text-2xl mb-4">
                Want to Host an Event?
              </CardTitle>
              <p className="text-indigo-100">
                Contact the alumni team to organize or suggest new events for the community.
              </p>
            </CardHeader>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default Events; 