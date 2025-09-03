import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import Breadcrumb from './Breadcrumb';
import ContentRenderer from './ContentRenderer';
import { useDocumentTitle } from '../../lib/useDocumentTitle';

interface MenuItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  path: string;
  badge?: string;
  children?: MenuItem[];
}

interface BreadcrumbItem {
  label: string;
  path?: string;
}

interface AdminLayoutProps {
  currentPageTitle?: string;
  breadcrumbItems?: BreadcrumbItem[];
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ 
  currentPageTitle,
  breadcrumbItems = []
}) => {
  // Update document title based on current page
  const titleSuffix = "Tobacco Traceability System";
  const fullTitle = currentPageTitle 
    ? `${currentPageTitle} - ${titleSuffix}` 
    : titleSuffix;
  useDocumentTitle(fullTitle);

  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  
  const [activeMenuItem, setActiveMenuItem] = useState('dashboard');

  const handleSidebarToggle = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  const handleMenuItemClick = (menuItem: MenuItem) => {
    setActiveMenuItem(menuItem.id);
    // No navigation needed, just change the active menu item
  };

  const handleBreadcrumbNavigate = (path: string) => {
    // Handle breadcrumb navigation if needed
    console.log('Breadcrumb navigate to:', path);
  };

  return (
    <div className="min-h-screen bg-emerald-50 light:bg-emerald-50 dark:bg-gray-900 flex">
      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 transition-transform duration-300 lg:translate-x-0 ${
        isSidebarCollapsed ? '-translate-x-full lg:translate-x-0' : 'translate-x-0'
      }`}>
        <Sidebar
          isCollapsed={isSidebarCollapsed}
          onToggle={handleSidebarToggle}
          activeMenuItem={activeMenuItem}
          onMenuItemClick={handleMenuItemClick}
        />
      </div>

      {/* Overlay for mobile */}
      {!isSidebarCollapsed && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={handleSidebarToggle}
        />
      )}

      {/* Main Content */}
      <div className={`flex-1 flex flex-col transition-all duration-300 ${
        isSidebarCollapsed ? 'lg:ml-16' : 'lg:ml-64'
      }`}>
        {/* Topbar */}
        <Topbar
          onSidebarToggle={handleSidebarToggle}
          currentPageTitle={currentPageTitle || 'Dashboard'}
        />

        {/* Content Area */}
        <main className="flex-1 p-6 bg-emerald-50 dark:bg-gray-800">
          {/* Breadcrumb */}
          {breadcrumbItems.length > 0 && (
            <Breadcrumb
              items={breadcrumbItems}
              onNavigate={handleBreadcrumbNavigate}
            />
          )}

          {/* Page Content */}
          <div className="min-h-full">
            <ContentRenderer activeMenuItem={activeMenuItem} />
          </div>
        </main>

        {/* Footer */}
        <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 px-8 py-4">
          <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
            <div>
              <p>© 2025 UB Tobacco Traceability System. All rights reserved.</p>
            </div>
            <div className="flex items-center space-x-4">
              <button className="hover:text-gray-700 dark:hover:text-gray-300">Privacy Policy</button>
              <button className="hover:text-gray-700 dark:hover:text-gray-300">Terms of Service</button>
              <button className="hover:text-gray-700 dark:hover:text-gray-300">Support</button>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default AdminLayout;
