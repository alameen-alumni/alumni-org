import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Calendar,
  MapPin,
  ExternalLink,
  X,
  IndianRupee,
  HeartHandshake,
  BadgeIndianRupee,
} from "lucide-react";
import { Link } from "react-router-dom";
import { type NotificationModalProps } from '../types';

const NotificationModal = ({
  open,
  onOpenChange,
  notice,
}: NotificationModalProps) => {
  // Timer state
  const [timer, setTimer] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
  }>({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    // Use 18/10/2025 12:00 UTC as default if notice?.date is not provided
    const dateString = notice?.date || "2025-10-18T12:00:00Z";
    const target = Date.parse(dateString);
    if (isNaN(target)) {
      // fallback: try with space instead of T
      const altTarget = Date.parse(dateString.replace("T", " "));
      if (isNaN(altTarget)) {
        setTimer({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }
      runTimer(altTarget);
    } else {
      runTimer(target);
    }
    function runTimer(targetTime: number) {
      setTimerFromTarget(targetTime);
      const interval = setInterval(() => setTimerFromTarget(targetTime), 1000);
      function setTimerFromTarget(target: number) {
        const now = Date.now();
        const diff = Math.max(0, target - now);
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((diff / (1000 * 60)) % 60);
        const seconds = Math.floor((diff / 1000) % 60);
        setTimer({ days, hours, minutes, seconds });
      }
      return () => clearInterval(interval);
    }
  }, [notice?.date]);


  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[95%] md:w-[90%] max-w-5xl p-0 overflow-hidden border-0 shadow-2xl rounded-xl bg-white">
        {/* Hidden DialogTitle and DialogDescription for accessibility */}
        <DialogTitle className="sr-only">
          {notice?.title || 'Event Notice'}
        </DialogTitle>
        <DialogDescription className="sr-only">
          {notice?.description || 'Event details and information'}
        </DialogDescription>
        
        {notice && (
          <div>
            {/* Full Width Image */}
                         <DialogHeader className="md:hidden">
               {/* Timer and close button row */}
               <div className="flex justify-between items-center m-1.5">
                 <div className="text-xs md:text-base font-normal text-white bg-green-700 rounded-sm sm:rounded-lg px-2 sm:px-3 py-1 shadow-md">
                   {`${timer.days.toString().padStart(2, "0")} D : ${timer.hours
                     .toString()
                     .padStart(2, "0")} H : ${timer.minutes
                     .toString()
                     .padStart(2, "0")} M : ${timer.seconds
                     .toString()
                     .padStart(2, "0")}`}
                 </div>
                 <button
                   onClick={() => onOpenChange(false)}
                   className="text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-500 bg-white p-2"
                 >
                   <X className="h-5 w-5 " />
                 </button>
               </div>
             </DialogHeader>
            {notice.image && (
              <>
                {/* Mobile Layout - Image on top with timer overlay */}
                <div className="md:hidden relative w-full overflow-hidden">
                  <img
                    src={notice.image}
                    alt={notice.title}
                    className="w-full h-auto max-h-96 object-contain"
                  />
                </div>

                {/* Mobile Content */}
                <div className="md:hidden px-4 pt-2 space-y-1.5">
                  <div>
                    <h2 className="text-xl font-bold mb-1">{notice.title}</h2>
                    <p className="text-sm text-gray-600">
                      {notice.description}
                    </p>
                  </div>
                  <div className="flex flex-col gap-1">
                    {notice.venue && (
                      <a
                        href={notice.venue_url || "#"}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 bg-gray-100 px-2.5 py-1.5 rounded-xl hover:bg-gray-200"
                      >
                        <MapPin className="h-4 w-4 text-blue-600" />
                        <span className="font-medium">{notice.venue}</span>
                      </a>
                    )}
                    {notice.date && (
                      <div className="flex items-center gap-2 bg-gray-100 px-2.5 py-1.5 rounded-xl">
                        <Calendar className="h-4 w-4 text-green-600" />
                        <span className="font-medium">{notice.date}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Desktop Layout */}
                <div className="hidden md:block relative w-full min-h-[60vh]">
                  <img
                    src={notice.image}
                    alt={notice.title}
                    className="w-full h-full min-h-[60vh] object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

                  {/* Timer - Top Left with better mobile design */}
                  <div className="absolute top-4 left-4 z-10">
                    <div className="text-xs md:text-base font-normal text-white bg-green-700 rounded-sm sm:rounded-lg px-2 sm:px-3 py-1 shadow-md">
                      {`${timer.days
                        .toString()
                        .padStart(2, "0")} D : ${timer.hours
                        .toString()
                        .padStart(2, "0")} H : ${timer.minutes
                        .toString()
                        .padStart(2, "0")} M : ${timer.seconds
                        .toString()
                        .padStart(2, "0")}`}
                    </div>
                  </div>

                  {/* Content overlay - Desktop design */}
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <div className="flex justify-between gap-4">
                      {/* Title and Description */}
                      <div className="text-white">
                        <h2 className="text-2xl md:text-3xl font-bold mb-3 drop-shadow-lg leading-tight">
                          {notice.title}
                        </h2>
                        <p className="text-base md:text-lg leading-relaxed drop-shadow-lg max-w-2xl opacity-95">
                          {notice.description}
                        </p>
                      </div>
                      <div className="flex flex-col gap-3">
                        {notice.venue && (
                          <a
                            href={notice.venue_url || "#"}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 bg-white backdrop-blur-sm px-2 py-1.5 rounded-xl hover:bg-white"
                          >
                            <MapPin className="h-4 w-4" />
                            <span className="font-medium text-sm">
                              {notice.venue}
                            </span>
                          </a>
                        )}
                        {notice.date && (
                          <div className="flex items-center gap-2 bg-white backdrop-blur-sm px-2 py-1.5 rounded-xl">
                            <Calendar className="h-4 w-4" />
                            <span className="font-medium text-sm">
                              Date : {notice.date}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        )}

        {/* Buttons Section */}
        <DialogFooter className="px-4 py-3 bg-gray-50 border-t">
          <div className="flex gap-3 w-full">
            {notice?.reg_url && (
              <Button
                asChild
                variant="secondary"
                className="flex-1 bg-green-600 hover:bg-green-700 text-white"
              >
                <Link
                  to={`/${notice.reg_url}`}
                  className="flex items-center gap-2"
                >
                  <Calendar className="h-4 w-4" />
                  Register
                </Link>
              </Button>
            )}
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="px-6"
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
