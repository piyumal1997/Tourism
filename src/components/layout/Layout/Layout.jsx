import React from 'react';
import Header from '../Header/Header';
import Footer from '../Footer/Footer';
import { Outlet } from 'react-router-dom'

const Layout = () => {
  
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      {/* Main content area with automatic growth */}
      <main
        role="main" // Accessibility landmark
        className="flex-grow" // Fill available space
      >
        <Outlet /> {/* Nested route content */}
      </main>

      {/* Sticky footer across all pages */}
      <Footer />
    </div>
  );
};

export default Layout;