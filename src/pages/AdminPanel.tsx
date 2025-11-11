import { ProtectedAdminRoute } from "@/components/ProtectedAdminRoute";
import { Suspense, useState } from 'react';
import Navbar from '../components/Navbar';
import { lazyWithRetry } from '../utils/lazy-loading';

// Lazy load all admin components with retry mechanism
const EventsAdmin = lazyWithRetry(() => import('./admin/EventsAdmin'));
const NoticesAdmin = lazyWithRetry(() => import('./admin/NoticesAdmin'));
const AlumniAdmin = lazyWithRetry(() => import('./admin/AlumniAdmin'));
const GalleryAdmin = lazyWithRetry(() => import('./admin/GalleryAdmin'));
const DonationsAdmin = lazyWithRetry(() => import('./admin/DonationsAdmin'));
const FeaturedDonorsAdmin = lazyWithRetry(() => import('./admin/FeaturedDonorsAdmin'));
const UsersAdmin = lazyWithRetry(() => import('./admin/UsersAdmin'));
const ReunionAdmin = lazyWithRetry(() => import('./admin/ReunionAdmin'));
const ModalAdmin = lazyWithRetry(() => import('./admin/ModalAdmin'));
const IDCardAdmin = lazyWithRetry(() => import('./admin/IDCardAdmin'));
const AlumniDbFiller = lazyWithRetry(() => import('./admin/AlumniDbFiller'));
const AlumniDbViewer = lazyWithRetry(() => import('./admin/AlumniDbViewer'));

// Loading component for admin sections
const AdminSectionLoader = () => (
  <div className="flex items-center justify-center h-64">
    <div className="flex flex-col items-center space-y-4">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600"></div>
      <p className="text-gray-600 text-sm">Loading admin section...</p>
    </div>
  </div>
);

const sections = [
  { key: 'events', label: 'Events' },
  { key: 'notices', label: 'Notices' },
  { key: 'alumni', label: 'Alumni' },
  { key: 'gallery', label: 'Gallery' },
  { key: 'reunion', label: 'Reunion Registrations' },
  { key: 'donations', label: 'Donations' },
  { key: 'featured-donors', label: 'Featured Donors' },
  { key: 'users', label: 'Registered Users' },
  { key: 'modal', label: 'Notification Pop Up' },
    { key: 'idcards', label: 'ID Cards' },
  { key: 'alumnidb', label: 'Alumni DB Filler' },
  { key: 'alumnidbviewer', label: 'Alumni Database' },
];

const AdminPanel = () => {
  const [activeSection, setActiveSection] = useState('events');

  const renderActiveSection = () => {
    return (
      <Suspense fallback={<AdminSectionLoader />}>
        {activeSection === 'events' && <EventsAdmin />}
        {activeSection === 'notices' && <NoticesAdmin />}
        {activeSection === 'alumni' && <AlumniAdmin />}
        {activeSection === 'gallery' && <GalleryAdmin />}
        {activeSection === 'reunion' && <ReunionAdmin />}
        {activeSection === 'donations' && <DonationsAdmin />}
        {activeSection === 'featured-donors' && <FeaturedDonorsAdmin />}
        {activeSection === 'users' && <UsersAdmin />}
        {activeSection === 'modal' && <ModalAdmin />}
  {activeSection === 'idcards' && <IDCardAdmin />}
        {activeSection === 'alumnidb' && <AlumniDbFiller />}
        {activeSection === 'alumnidbviewer' && <AlumniDbViewer />}
      </Suspense>
    );
  };

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
        <main className="flex-1 p-8 overflow-x-auto">
          {renderActiveSection()}
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