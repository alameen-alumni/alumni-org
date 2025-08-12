import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Eye, Loader2 } from "lucide-react";
import { useState } from "react";
import { useGallery } from "../hooks/use-gallery";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";

const Gallery = () => {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const { items: galleryItems, loading, loadingMore, hasMore, loadMore } = useGallery();

  // Sort gallery items: first by sl_no (1 to n), then items with 0 or no sl_no
  const sortedGalleryItems = [...galleryItems].sort((a, b) => {
    // Convert sl_no to numbers for proper comparison
    const aSlNo = typeof a.sl_no === 'string' ? parseInt(a.sl_no) : a.sl_no;
    const bSlNo = typeof b.sl_no === 'string' ? parseInt(b.sl_no) : b.sl_no;
    
    // If both items have sl_no > 0, sort by sl_no
    if (aSlNo !== undefined && aSlNo > 0 && bSlNo !== undefined && bSlNo > 0) {
      return aSlNo - bSlNo;
    }
    // If only one has sl_no > 0, prioritize the one with sl_no > 0
    if (aSlNo !== undefined && aSlNo > 0 && (bSlNo === undefined || bSlNo === 0)) {
      return -1; // a comes first
    }
    if (bSlNo !== undefined && bSlNo > 0 && (aSlNo === undefined || aSlNo === 0)) {
      return 1; // b comes first
    }
    // If both have sl_no = 0 or no sl_no, maintain current order
    return 0;
  });

  const categories = ["All", ...Array.from(new Set(sortedGalleryItems.map(item => item.category).filter(Boolean)))];
  const filteredItems = selectedCategory === "All" ? sortedGalleryItems : sortedGalleryItems.filter(item => item.category === selectedCategory);

  const [selectedImage, setSelectedImage] = useState<string | null>(null);

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
          {loading ? (
            // Show 6 skeleton cards while loading
            Array.from({ length: 6 }).map((_, index) => (
              <motion.div
                key={`skeleton-${index}`}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card className="overflow-hidden">
                  <div className="relative">
                    <Skeleton className="w-full h-48" />
                    <Skeleton className="absolute top-3 left-3 w-16 h-6 rounded-full" />
                  </div>
                  <div className="p-4 space-y-3">
                    <Skeleton className="h-5 w-3/4" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-2/3" />
                    <Skeleton className="h-3 w-1/2" />
                  </div>
                </Card>
              </motion.div>
            ))
          ) : (
                         filteredItems.map((item, index) => (
               <div
                 key={item.id}
               >
                <Card className="group overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer">
                  <div 
                    className="relative overflow-hidden"
                    onClick={() => setSelectedImage(item.id)}
                  >
                    <img
                      src={item.image || "https://via.placeholder.com/600x400"}
                      alt={item.title || "Gallery item"}
                      className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
                      <Eye className="h-8 w-8 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>
                    <Badge className="absolute top-3 left-3 bg-indigo-600">
                      {item.category || "Uncategorized"}
                    </Badge>
                  </div>
                  
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900 mb-2 line-clamp-1">
                      {item.title || "Untitled Event"}
                    </h3>
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                      {item.description || "Glimpse of good old days"}
                    </p>
                    <div className="flex items-center text-xs text-gray-500">
                      <Calendar className="h-3 w-3 mr-1" />
                      {item.date ? new Date(item.date).toLocaleDateString() : "Somewhere in the past"}
                    </div>
                  </div>
                </Card>
              </div>
            ))
          )}
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

        {/* Load More Button */}
        {hasMore && (
          <div className="col-span-full flex justify-center mt-8">
            <Button 
              onClick={loadMore} 
              disabled={loadingMore}
              className="px-8 py-3 bg-[#186F65] text-white font-semibold rounded-lg transition-all duration-300 transform hover:scale-105"
            >
              {loadingMore ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Loading...
                </>
              ) : (
                'Load More Images'
              )}
            </Button>
          </div>
        )}

        {/* Show message when no more items */}
        {!hasMore && sortedGalleryItems.length > 0 && (
          <div className="col-span-full text-center mt-8 text-gray-500">
            <p>You've reached the end of the gallery!</p>
          </div>
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
                src={galleryItems.find(item => item.id === selectedImage)?.image || "https://via.placeholder.com/800x600"}
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
