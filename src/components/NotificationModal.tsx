import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, ExternalLink, X, IndianRupee, HeartHandshake, BadgeIndianRupee } from "lucide-react";
import { Link } from "react-router-dom";

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
    locationUrl?: string; // Add locationUrl from backend
  } | null;
}

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

  // Demo budget data
  const budget = 500000; // total
  const completed = 5; // completed
  const percent = Math.round((completed / budget) * 100);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[95%] md:w-[80%] max-w-none p-0 overflow-hidden border-0 shadow-2xl rounded-xl">
        {/* Top bar: Timer (left) and Budget (right) */}
        <div className="flex justify-around sm:justify-between items-center px-2 pt-2 -mb-2.5">
          {/* Timer */}
          <div className="text-xs md:text-base font-normal text-white bg-black/60 rounded-sm sm:rounded-lg px-2 sm:px-3 py-1 shadow-md">
            {`${timer.days.toString().padStart(2, "0")} D : ${timer.hours
              .toString()
              .padStart(2, "0")} H : ${timer.minutes
              .toString()
              .padStart(2, "0")} M : ${timer.seconds
              .toString()
              .padStart(2, "0")}`}
          </div>
          {/* Budget */}
          <div className="flex items-center text-xs md:text-base text-white bg-green-700/80 rounded-sm sm:rounded-lg px-2.5 py-1 gap-1 shadow-md font-normal md:mr-10">
            <BadgeIndianRupee height={20} width={20} />
            ₹{completed.toLocaleString()}/ ₹5 lac
          </div>
        </div>

        {notice && (
          <div className="relative">
            {/* Full Width Image */}
            {notice.image && (
              <div className="relative w-full h-96 md:h-[500px] overflow-hidden">
                <img
                  src={notice.image}
                  alt={notice.title}
                  className="w-full h-full object-cover object-top"
                />
                {/* Gradient overlay for better text readability */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

                {/* Content overlay - Bottom left and right */}
                <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6">
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
                        <a
                          href={notice.locationUrl || "#"}
                          target={notice.locationUrl ? "_blank" : undefined}
                          rel="noopener noreferrer"
                          className={`flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full transition hover:bg-white/40 ${
                            notice.locationUrl ? "cursor-pointer underline" : ""
                          }`}
                        >
                          <MapPin className="h-4 w-4" />
                          <span className="font-medium text-xs">
                            {notice.venue}
                          </span>
                        </a>
                      )}
                      {notice.date && (
                        <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full ">
                          <Calendar className="h-4 w-4" />
                          <span className="font-medium text-xs">
                            {notice.date}
                          </span>
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
                      <a
                        href={notice.locationUrl || "#"}
                        target={notice.locationUrl ? "_blank" : undefined}
                        rel="noopener noreferrer"
                        className={`flex items-center gap-2 bg-blue-100 px-4 py-2 rounded-full transition hover:bg-blue-200 ${
                          notice.locationUrl ? "cursor-pointer underline" : ""
                        }`}
                      >
                        <MapPin className="h-4 w-4 text-blue-600" />
                        <span className="font-medium text-blue-800">
                          {notice.venue}
                        </span>
                      </a>
                    )}
                    {notice.date && (
                      <div className="flex items-center gap-2 bg-green-100 px-4 py-2 rounded-full">
                        <Calendar className="h-4 w-4 text-green-600" />
                        <span className="font-medium text-green-800">
                          {notice.date}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Buttons Section */}
        <DialogFooter className="px-2 pb-2 bg-gradient-to-r from-gray-50 to-gray-100">
          <div className="flex flex-col sm:flex-row gap-3 w-full">
            {notice?.link && (
              <Button
                asChild
                className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg"
              >
                <a
                  href={notice.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2"
                >
                  <ExternalLink className="h-4 w-4" />
                  View Details
                </a>
              </Button>
            )}
            {notice?.reg_url && (
              <Button
                asChild
                variant="secondary"
                className="flex-1 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white shadow-lg"
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
            asChild
              variant="secondary"
              className="flex-1 bg-gradient-to-r from-teal-600 to-teal-400 hover:from-teal-600 hover:to-teal-700 text-white shadow-lg font-medium"
            >
              <Link
                to={`/donate`}
                className="flex items-center gap-2"
              >
                <HeartHandshake className="h-4 w-4" />
                Donate
              </Link>
            </Button>
            <Button
              variant="secondary"
              onClick={() => onOpenChange(false)}
              className="flex-0.5 w-40 hover:bg-red-300 hover:text-black shadow-md"
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
