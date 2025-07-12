import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, MapPin, ExternalLink, X } from 'lucide-react';

interface NotificationModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  notice: {
    title?: string;
    description?: string;
    date?: string;
    venue?: string;
    image?: string;
    link?: string;
    reg_url?: string;
  } | null;
}

const NotificationModal = ({ open, onOpenChange, notice }: NotificationModalProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[90%] md:w-[80%] max-w-none p-0 overflow-hidden border-0 shadow-2xl">
        
        
        {notice && (
          <div className="relative">
            {/* Full Width Image */}
            {notice.image && (
              <div className="relative w-full h-96 md:h-[500px] overflow-hidden">
                <img 
                  src={notice.image} 
                  alt={notice.title} 
                  className="w-full h-full object-cover" 
                />
                {/* Gradient overlay for better text readability */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                
                {/* Content overlay - Bottom left and right */}
                <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
                  <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
                    {/* Left side - Title and Description */}
                    <div className="flex-1 text-white">
                      <h2 className="text-2xl md:text-3xl font-bold mb-2 drop-shadow-lg">
                        {notice.title}
                      </h2>
                      <p className="text-sm md:text-xl leading-relaxed drop-shadow-lg max-w-2xl">
                        {notice.description}
                      </p>
                    </div>
                    
                    {/* Right side - Venue and Date */}
                    <div className="flex flex-col gap-3 text-white">
                      {notice.venue && (
                        <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
                          <MapPin className="h-4 w-4" />
                          <span className="font-medium text-xs">{notice.venue}</span>
                        </div>
                      )}
                      {notice.date && (
                        <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full ">
                          <Calendar className="h-4 w-4" />
                          <span className="font-medium text-xs">{notice.date}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {/* Fallback content when no image */}
            {!notice.image && (
              <div className="p-6 md:p-8 bg-gradient-to-br from-gray-50 to-gray-100">
                <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
                  {/* Left side - Title and Description */}
                  <div className="flex-1">
                    <h2 className="text-2xl md:text-3xl font-bold mb-2 text-gray-900">
                      {notice.title}
                    </h2>
                    <p className="text-base md:text-xl leading-relaxed text-gray-700 max-w-2xl">
                      {notice.description}
                    </p>
                  </div>
                  
                  {/* Right side - Venue and Date */}
                  <div className="flex flex-col gap-3">
                    {notice.venue && (
                      <div className="flex items-center gap-2 bg-blue-100 px-4 py-2 rounded-full">
                        <MapPin className="h-4 w-4 text-blue-600" />
                        <span className="font-medium text-blue-800">{notice.venue}</span>
                      </div>
                    )}
                    {notice.date && (
                      <div className="flex items-center gap-2 bg-green-100 px-4 py-2 rounded-full">
                        <Calendar className="h-4 w-4 text-green-600" />
                        <span className="font-medium text-green-800">{notice.date}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
        
        {/* Buttons Section */}
        <DialogFooter className="p-6 pt-4 bg-gradient-to-r from-gray-50 to-gray-100">
          <div className="flex flex-col sm:flex-row gap-3 w-full">
            {notice?.link && (
              <Button asChild className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg">
                <a href={notice.link} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                  <ExternalLink className="h-4 w-4" />
                  View Details
                </a>
              </Button>
            )}
            {notice?.reg_url && (
              <Button asChild variant="secondary" className="flex-1 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white shadow-lg">
                <a href={notice.reg_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Register
                </a>
              </Button>
            )}
            <Button 
              variant="outline" 
              onClick={() => onOpenChange(false)} 
              className="flex-1 border-2 border-teal-600 hover:bg-gray-100 hover:text-black shadow-md"
            >
              Close
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default NotificationModal; 