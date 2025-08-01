import { useAuth } from "@/contexts/AuthContext";
import { Link, Navigate } from "react-router-dom";
import Navbar from "./Navbar";
import type { ReactNode } from "react";

export function ProtectedAdminRoute({
  children,
}: {
  children: ReactNode;
}) {
  const { currentUser } = useAuth();
  if (!currentUser) return <Navigate to="/login" replace />;
  if (!currentUser.role || currentUser.role !== 'admin')
    return (
      <>
        <Navbar />
        <div className="p-8 text-center  pt-36">
        <div className="text-red-600 font-bold text-3xl mb-10">No Access</div>
        <Link to={"/"} className="text-sky-600 underline">Go Home</Link></div>
      </>
    );
  return <>{children}</>;
}
