import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { supabase } from '../utils/supabase';

export default function ProtectedRoute({ children }) {
  const [user, setuser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setuser(session?.user ?? null);
      setLoading(false);
    };

    getUser();
  }, []);

  if (loading) {
    return <div className="text-white p-4">Loading...</div>;
  }

  return user ? children : <Navigate to="/login" replace />;
}