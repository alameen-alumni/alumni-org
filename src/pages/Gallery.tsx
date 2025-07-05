import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Eye } from "lucide-react";
import { useState } from "react";

const Gallery = () => {
  const [selectedCategory, setSelectedCategory] = useState("All");

  const galleryItems = [
    {
      id: 1,
      title: "Annual Reunion 2023",
      category: "Events",
      date: "2023-12-15",
      image: "https://images.unsplash.com/photo-1517022812141-23620dba5c23?auto=format&fit=crop&w=600&q=80",
      description: "Alumni gathering with cultural programs and networking"
    },
    {
      id: 2,
      title: "Scholarship Distribution",
      category: "Ceremony",
      date: "2023-11-20",
      image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=600&q=80",
      description: "Annual scholarship awards ceremony"
    },
    {
      id: 3,
      title: "Technology Seminar",
      category: "Workshop",
      date: "2023-10-10",
      image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=600&q=80",
      description: "Latest trends in technology and innovation"
    },
    {
      id: 4,
      title: "Sports Meet 2023",
      category: "Sports",
      date: "2023-09-05",
      image: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?auto=format&fit=crop&w=600&q=80",
      description: "Inter-batch sports competition"
    },
    {
      id: 5,
      title: "Cultural Night",
      category: "Events",
      date: "2023-08-15",
      image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=600&q=80",
      description: "Traditional dance and music performances"
    },
    {
      id: 6,
      title: "Guest Lecture Series",
      category: "Workshop",
      date: "2023-07-20",
      image: "https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7?auto=format&fit=crop&w=600&q=80",
      description: "Industry experts sharing insights"
    },
    {
      id: 7,
      title: "Alumni Awards Night",
      category: "Ceremony",
      date: "2023-06-10",
      image: "https://images.unsplash.com/photo-1487958449943-2429e8be8625?auto=format&fit=crop&w=600&q=80",
      description: "Recognizing outstanding alumni achievements"
    },
    {
      id: 8,
      title: "Community Service",
      category: "Service",
      date: "2023-05-15",
      image: "https://images.unsplash.com/photo-1551038247-3d9af20df552?auto=format&fit=crop&w=600&q=80",
      description: "Tree plantation and clean-up drive"
    }
  ];

  const categories = ["All", ...Array.from(new Set(galleryItems.map(item => item.category)))];

  const filteredItems = selectedCategory === "All" 
    ? galleryItems 
    : galleryItems.filter(item => item.category === selectedCategory);

  const [selectedImage, setSelectedImage] = useState<number | null>(null);

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
            Photo Gallery
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Explore memorable moments from our events, ceremonies, and community activities. 
            Relive the experiences that bring our alumni community together.
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

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredItems.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              layout
            >
              <Card className="group overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer">
                <div 
                  className="relative overflow-hidden"
                  onClick={() => setSelectedImage(item.id)}
                >
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
                    <Eye className="h-8 w-8 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                  <Badge className="absolute top-3 left-3 bg-indigo-600">
                    {item.category}
                  </Badge>
                </div>
                
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 mb-2 line-clamp-1">
                    {item.title}
                  </h3>
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                    {item.description}
                  </p>
                  <div className="flex items-center text-xs text-gray-500">
                    <Calendar className="h-3 w-3 mr-1" />
                    {new Date(item.date).toLocaleDateString()}
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        {filteredItems.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <p className="text-gray-500 text-lg">
              No images found in this category.
            </p>
          </motion.div>
        )}

        {/* Image Modal/Lightbox */}
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedImage(null)}
          >
            <div className="relative max-w-4xl max-h-full">
              <img
                src={galleryItems.find(item => item.id === selectedImage)?.image}
                alt="Gallery item"
                className="max-w-full max-h-full object-contain"
              />
              <button
                onClick={() => setSelectedImage(null)}
                className="absolute top-4 right-4 text-white text-2xl font-bold"
              >
                ×
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Gallery;
