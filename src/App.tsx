import { RouterProvider, createBrowserRouter, Navigate } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import Layout from './components/Layout';
import PrivateRoute from './components/PrivateRoute';
import { DataProvider } from './contexts/DataProvider';
import LoadingFallback from './components/LoadingFallback';
import MaintenancePage from './components/MaintenancePage';

// Bakım modu kontrolü
const MAINTENANCE_MODE = import.meta.env.VITE_MAINTENANCE_MODE === 'true';

// Lazy loaded components
const HomePage = lazy(() => import('./pages/HomePage'));
const AboutPage = lazy(() => import('./pages/AboutPage'));
const BoardPage = lazy(() => import('./pages/BoardPage'));
const BoardMemberDetailPage = lazy(() => import('./pages/BoardMemberDetailPage'));
const PressPage = lazy(() => import('./pages/PressPage'));
const ActivitiesPage = lazy(() => import('./pages/ActivitiesPage'));
const ActivityDetailPage = lazy(() => import('./pages/ActivityDetailPage'));
const GalleryPage = lazy(() => import('./pages/GalleryPage'));
const MembershipPage = lazy(() => import('./pages/MembershipPage'));
const PaymentPage = lazy(() => import('./pages/PaymentPage'));
const ContactPage = lazy(() => import('./pages/ContactPage'));
const AdminLoginPage = lazy(() => import('./pages/AdminLoginPage'));
const AdminPage = lazy(() => import('./pages/AdminPage'));
const AdminActivitiesPage = lazy(() => import('./pages/AdminActivitiesPage'));
const AdminGalleryPage = lazy(() => import('./pages/AdminGalleryPage'));
const AdminPressPage = lazy(() => import('./pages/AdminPressPage'));
const AdminBoardPage = lazy(() => import('./pages/AdminBoardPage'));
const AdminContactMessagesPage = lazy(() => import('./pages/AdminContactMessagesPage'));
const AdminMembershipApplicationsPage = lazy(() => import('./pages/AdminMembershipApplicationsPage'));

// Router seçenekleri - v7 uyumluluk bayrağı etkinleştirildi
const routerOptions = {
  future: {
    v7_startTransition: true,
    v7_relativeSplatPath: true,
    v7_normalizeFormMethod: true,
    v7_prependBasename: true
  }
};

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <Layout>
        <Suspense fallback={<LoadingFallback type="page" />}>
          <HomePage />
        </Suspense>
      </Layout>
    ),
  },
  {
    path: "/kurumsal/hakkimizda",
    element: (
      <Layout>
        <Suspense fallback={<LoadingFallback type="page" />}>
          <AboutPage />
        </Suspense>
      </Layout>
    ),
  },
  {
    path: "/kurumsal/yonetim-kurulu",
    element: (
      <Layout>
        <Suspense fallback={<LoadingFallback type="list" count={5} />}>
          <BoardPage />
        </Suspense>
      </Layout>
    ),
  },
  {
    path: "/yonetim-kurulu/:id",
    element: (
      <Layout>
        <Suspense fallback={<LoadingFallback type="page" />}>
          <BoardMemberDetailPage />
        </Suspense>
      </Layout>
    ),
  },
  {
    path: "/kurumsal/basinda-biz",
    element: (
      <Layout>
        <Suspense fallback={<LoadingFallback type="list" count={5} />}>
          <PressPage />
        </Suspense>
      </Layout>
    ),
  },
  {
    path: "/faaliyetler",
    element: (
      <Layout>
        <Suspense fallback={<LoadingFallback type="card" count={6} />}>
          <ActivitiesPage />
        </Suspense>
      </Layout>
    ),
  },
  {
    path: "/faaliyet/:id",
    element: (
      <Layout>
        <Suspense fallback={<LoadingFallback type="page" />}>
          <ActivityDetailPage />
        </Suspense>
      </Layout>
    ),
  },
  {
    path: "/galeri",
    element: (
      <Layout>
        <Suspense fallback={<LoadingFallback type="card" count={9} />}>
          <GalleryPage />
        </Suspense>
      </Layout>
    ),
  },
  {
    path: "/uyelik",
    element: (
      <Navigate to="/uyelik/odeme" replace />
    ),
  },
  {
    path: "/uyelik/basvuru",
    element: (
      <Layout>
        <Suspense fallback={<LoadingFallback type="page" />}>
          <MembershipPage />
        </Suspense>
      </Layout>
    ),
  },
  {
    path: "/uyelik/odeme",
    element: (
      <Layout>
        <Suspense fallback={<LoadingFallback type="page" />}>
          <PaymentPage />
        </Suspense>
      </Layout>
    ),
  },
  {
    path: "/iletisim",
    element: (
      <Layout>
        <Suspense fallback={<LoadingFallback type="page" />}>
          <ContactPage />
        </Suspense>
      </Layout>
    ),
  },
  // Admin Sayfaları
  {
    path: "/admin/login",
    element: (
      <Suspense fallback={<LoadingFallback />}>
        <AdminLoginPage />
      </Suspense>
    ),
  },
  {
    path: "/admin",
    element: (
      <PrivateRoute>
        <Suspense fallback={<LoadingFallback type="page" />}>
          <AdminPage />
        </Suspense>
      </PrivateRoute>
    ),
  },
  {
    path: "/admin/faaliyetler",
    element: (
      <PrivateRoute>
        <Suspense fallback={<LoadingFallback type="page" />}>
          <AdminActivitiesPage />
        </Suspense>
      </PrivateRoute>
    ),
  },
  {
    path: "/admin/galeri",
    element: (
      <PrivateRoute>
        <Suspense fallback={<LoadingFallback type="page" />}>
          <AdminGalleryPage />
        </Suspense>
      </PrivateRoute>
    ),
  },
  {
    path: "/admin/basin",
    element: (
      <PrivateRoute>
        <Suspense fallback={<LoadingFallback type="page" />}>
          <AdminPressPage />
        </Suspense>
      </PrivateRoute>
    ),
  },
  {
    path: "/admin/yonetim-kurulu",
    element: (
      <PrivateRoute>
        <Suspense fallback={<LoadingFallback type="page" />}>
          <AdminBoardPage />
        </Suspense>
      </PrivateRoute>
    ),
  },
  {
    path: "/admin/iletisim-mesajlari",
    element: (
      <PrivateRoute>
        <Suspense fallback={<LoadingFallback type="page" />}>
          <AdminContactMessagesPage />
        </Suspense>
      </PrivateRoute>
    ),
  },
  {
    path: "/admin/uyelik-basvurulari",
    element: (
      <PrivateRoute>
        <Suspense fallback={<LoadingFallback type="page" />}>
          <AdminMembershipApplicationsPage />
        </Suspense>
      </PrivateRoute>
    ),
  },
], routerOptions);

function App() {
  // Bakım modundaysa MaintenancePage göster
  if (MAINTENANCE_MODE) {
    return <MaintenancePage />;
  }
  
  // Normal uygulama akışı
  return (
    <DataProvider>
      <RouterProvider router={router} />
    </DataProvider>
  );
}

export default App;
