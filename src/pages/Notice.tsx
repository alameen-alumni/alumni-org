
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Bell, AlertCircle, ExternalLink } from "lucide-react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useNavigate } from "react-router-dom";

const Notice = () => {
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchNotices = async () => {
      setLoading(true);
      try {
        const querySnapshot = await getDocs(collection(db, "notice"));
        setNotices(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      } catch (error) {
        setNotices([]);
      } finally {
        setLoading(false);
      }
    };
    fetchNotices();
  }, []);

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
    <div className="min-h-screen bg-slate-50">
      <div className="w-full px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 text-center">Notices</h1>
        {loading ? (
          <p className="text-center py-12">Loading notices...</p>
        ) : notices.length === 0 ? (
          <p className="text-center py-12">No notices found.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {notices.map((notice, index) => (
              <div key={notice.id} className="bg-white rounded-lg shadow p-6 flex flex-col">
                {notice.image && (
                  <img src={notice.image} alt={notice.title || "Notice image"} className="w-full h-48 object-cover object-top rounded mb-4" />
                )}
                <h2 className="text-xl font-bold mb-2 text-left">{notice.title || "Untitled Notice"}</h2>
                <div className="text-xs text-gray-500 mb-2 text-left">Date : {notice.date || "N/A"}</div>
                <p className="text-gray-600 mb-2 text-left">{notice.description || "No description available."}</p>
                
                {notice.btn_url && (
                  <Button 
                    onClick={() => navigate(notice.btn_url)} 
                    className="mt-4 w-full bg-teal-600 hover:bg-teal-700 text-white"
                  >
                    <ExternalLink className="h-4 w-4 mr-2" />
                    View
                  </Button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Notice;
