import React from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import ScrollToTop from './ScrollToTop';
import PageTransition from './PageTransition';
import { useLocation } from 'react-router-dom';

const Layout = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  
  return (
    <div className="min-h-screen flex flex-col">
      <ScrollToTop />
      <Navbar />
      <main className="flex-grow">
        <PageTransition key={location.pathname}>
          {children}
        </PageTransition>
      </main>
      <Footer />
    </div>
  );
};

export default Layout;