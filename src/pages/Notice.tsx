
import { Calendar, Clock, Users } from 'lucide-react';

const Notice = () => {
  const notices = [
    {
      id: 1,
      title: "Annual General Meeting 2024",
      date: "March 20, 2024",
      time: "10:00 AM",
      location: "Main Auditorium",
      priority: "high",
      description: "All alumni are cordially invited to attend the Annual General Meeting. Important decisions regarding future activities will be discussed."
    },
    {
      id: 2,
      title: "Scholarship Application Deadline",
      date: "February 28, 2024",
      time: "11:59 PM",
      location: "Online Submission",
      priority: "medium",
      description: "Last date for submitting scholarship applications for deserving students."
    },
    {
      id: 3,
      title: "Alumni Registration Drive",
      date: "January 15, 2024",
      time: "9:00 AM - 5:00 PM",
      location: "Campus Office",
      priority: "low",
      description: "Registration drive for new alumni. Update your contact information and connect with the community."
    }
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">Notice Board</h1>
          <p className="text-lg text-gray-600">Stay updated with important announcements and notices</p>
        </div>

        <div className="space-y-6">
          {notices.map((notice) => (
            <div key={notice.id} className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <h2 className="text-xl font-semibold text-gray-800">{notice.title}</h2>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getPriorityColor(notice.priority)}`}>
                    {notice.priority.toUpperCase()}
                  </span>
                </div>
                
                <div className="flex flex-wrap gap-4 mb-4 text-sm text-gray-600">
                  <div className="flex items-center">
                    <Calendar size={16} className="mr-2" />
                    {notice.date}
                  </div>
                  <div className="flex items-center">
                    <Clock size={16} className="mr-2" />
                    {notice.time}
                  </div>
                  <div className="flex items-center">
                    <Users size={16} className="mr-2" />
                    {notice.location}
                  </div>
                </div>
                
                <p className="text-gray-700">{notice.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Notice;
