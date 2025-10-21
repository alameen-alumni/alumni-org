import React from "react";

const RegistrationClosed: React.FC = () => {
  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center"
      style={{ backgroundImage: "url('/reunion2k25.jpg')" }}
    >
      <div className="bg-white/80 dark:bg-black/60 rounded-lg p-8 max-w-xl text-center shadow">
        <h1 className="text-2xl font-semibold mb-4">Registration Closed</h1>
        <p className="text-base text-gray-700 dark:text-gray-200">
          The registration is closed - thank you for your interest.
        </p>
      </div>
    </div>
  );
};

export default RegistrationClosed;