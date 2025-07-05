
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Bell, AlertCircle } from "lucide-react";

const Notice = () => {
  const notices = [
    {
      id: 1,
      title: "Annual General Meeting 2024",
      date: "2024-03-20",
      priority: "High",
      category: "Meeting",
      description: "All alumni are invited to attend the Annual General Meeting. Important decisions regarding future initiatives will be discussed.",
      details: "Venue: Main Auditorium | Time: 10:00 AM - 2:00 PM"
    },
    {
      id: 2,
      title: "Membership Fee Reminder",
      date: "2024-03-15",
      priority: "Medium",
      category: "Payment",
      description: "Friendly reminder that annual membership fees are due by the end of this month.",
      details: "Late fee applies after March 31st, 2024"
    },
    {
      id: 3,
      title: "New Online Portal Launch",
      date: "2024-03-10",
      priority: "Low",
      category: "Update",
      description: "We're excited to announce the launch of our new online alumni portal with enhanced features.",
      details: "Login credentials will be sent via email"
    },
    {
      id: 4,
      title: "Scholarship Applications Open",
      date: "2024-03-05",
      priority: "High",
      category: "Opportunity",
      description: "Applications are now open for the Alumni Scholarship Program 2024. Don't miss this opportunity!",
      details: "Deadline: April 15, 2024"
    }
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "High": return "bg-red-100 text-red-800 border-red-200";
      case "Medium": return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "Low": return "bg-green-100 text-green-800 border-green-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case "High": return <AlertCircle className="h-4 w-4" />;
      case "Medium": return <Bell className="h-4 w-4" />;
      case "Low": return <Calendar className="h-4 w-4" />;
      default: return <Bell className="h-4 w-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 pt-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Notice Board
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Stay informed with the latest announcements, updates, and important notices 
            from the Alumni Association.
          </p>
        </motion.div>

        <div className="space-y-6">
          {notices.map((notice, index) => (
            <motion.div
              key={notice.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <Card className="hover:shadow-lg transition-all duration-300">
                <CardHeader>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <CardTitle className="text-xl font-semibold mb-2">
                        {notice.title}
                      </CardTitle>
                      <div className="flex items-center gap-3 text-sm text-gray-500 mb-3">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {new Date(notice.date).toLocaleDateString()}
                        </div>
                        <Badge variant="outline">
                          {notice.category}
                        </Badge>
                      </div>
                    </div>
                    <div className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium border ${getPriorityColor(notice.priority)}`}>
                      {getPriorityIcon(notice.priority)}
                      {notice.priority}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 mb-3">
                    {notice.description}
                  </p>
                  <div className="bg-indigo-50 p-3 rounded-lg">
                    <p className="text-sm text-indigo-800 font-medium">
                      {notice.details}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-12 text-center"
        >
          <Card className="bg-teal-700 text-white">
            <CardHeader>
              <CardTitle className="text-xl mb-2">
                Want to Submit a Notice?
              </CardTitle>
              <p className="text-indigo-100">
                Contact the administration team to post important announcements for the alumni community.
              </p>
            </CardHeader>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default Notice;
