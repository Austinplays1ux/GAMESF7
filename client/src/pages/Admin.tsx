import AdminPanel from "@/components/AdminPanel";
import { useAuth } from "@/hooks/use-auth";
import { useLocation } from "wouter";

export default function Admin() {
  const { user, isLoading } = useAuth();
  
  // Show loading indicator while checking authentication
  if (isLoading) {
    return <div className="container mx-auto p-8 flex justify-center">Loading...</div>;
  }
  
  const [_, setLocation] = useLocation();
  
  // Redirect non-admin users
  if (!user?.isAdmin) {
    setLocation("/");
    return null;
  }
  
  return <AdminPanel />;
}