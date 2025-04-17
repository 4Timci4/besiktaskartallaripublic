import { ReactNode, useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { isAuthenticated } from '../utils/auth';
import { logger } from '../utils/supabase';

interface PrivateRouteProps {
  children: ReactNode;
}

function PrivateRoute({ children }: PrivateRouteProps) {
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    // Auth durumunu kontrol et
    const checkAuth = async () => {
      try {
        const auth = await isAuthenticated();
        setAuthorized(auth);
      } catch (error) {
        logger.error('Kimlik doğrulama hatası:', error);
        setAuthorized(false);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  if (loading) {
    // Yükleniyor ekranı
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Kimlik doğrulaması yapılmamışsa login sayfasına yönlendir
  if (!authorized) {
    return <Navigate to="/admin/login" replace />;
  }

  // Kimlik doğrulaması yapılmışsa normal içeriği göster
  return <>{children}</>;
}

export default PrivateRoute; 