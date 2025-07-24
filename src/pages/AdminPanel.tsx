import { useState } from 'react';
import Navbar from '../components/Navbar';
import EventsAdmin from './admin/EventsAdmin';
import NoticesAdmin from './admin/NoticesAdmin';
import AlumniAdmin from './admin/AlumniAdmin';
import GalleryAdmin from './admin/GalleryAdmin';
import DonationsAdmin from './admin/DonationsAdmin';
import UsersAdmin from './admin/UsersAdmin';
import ReunionAdmin from './admin/ReunionAdmin';
import { ProtectedAdminRoute } from "@/components/ProtectedAdminRoute";
import ModalAdmin from './admin/ModalAdmin';
import AlumniDbFiller from './admin/AlumniDbFiller';

const sections = [
  { key: 'events', label: 'Events' },
  { key: 'notices', label: 'Notices' },
  { key: 'alumni', label: 'Alumni' },
  { key: 'gallery', label: 'Gallery' }, // Added Gallery section
  { key: 'reunion', label: 'Reunion Registrations' }, // Added Reunion section
  { key: 'donations', label: 'Donations' },
  { key: 'users', label: 'Registered Users' },
  { key: 'modal', label: 'Notification Pop Up' },
  { key: 'alumnidb', label: 'Alumni DB Filler' },
];

const AdminPanel = () => {
  const [activeSection, setActiveSection] = useState('events');

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />
      <div className="flex flex-1 mt-16">
        {/* Sidebar */}
        <aside className="w-64 bg-white border-r p-6 flex flex-col gap-2 shadow-md ">
          <h2 className="text-2xl font-bold mb-6 text-teal-700">Admin</h2>
          {sections.map((section) => (
            <button
              key={section.key}
              onClick={() => setActiveSection(section.key)}
              className={`text-left px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${
                activeSection === section.key
                  ? 'bg-teal-600 text-white shadow'
                  : 'text-gray-700 hover:bg-indigo-50'
              }`}
            >
              {section.label}
            </button>
          ))}
        </aside>
        {/* Main Content */}
        <main className="flex-1 p-8">
          {activeSection === 'events' && <EventsAdmin />}
          {activeSection === 'notices' && <NoticesAdmin />}
          {activeSection === 'alumni' && <AlumniAdmin />}
          {activeSection === 'gallery' && <GalleryAdmin />} {/* Render GalleryAdmin */}
          {activeSection === 'reunion' && <ReunionAdmin />} {/* Render ReunionAdmin */}
          {activeSection === 'donations' && <DonationsAdmin />}
          {activeSection === 'users' && <UsersAdmin />}
          {activeSection === 'modal' && <ModalAdmin />}
          {activeSection === 'alumnidb' && <AlumniDbFiller />}
        </main>
      </div>
    </div>
  );
};

export default function ProtectedAdminPanelWrapper() {
  return (
    <ProtectedAdminRoute>
      <AdminPanel />
    </ProtectedAdminRoute>
  );
} 