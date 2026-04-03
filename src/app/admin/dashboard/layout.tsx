'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  ShoppingBag,
  Tag,
  MessageSquare,
  BarChart,
  Settings,
  LogOut,
  Menu,
  X
} from 'lucide-react';
import Link from 'next/link';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const pathname = usePathname();

  // Navigation sidebar items
  const navItems = [
    { label: 'Overview', icon: LayoutDashboard, href: '/admin/dashboard' },
    { label: 'Products', icon: ShoppingBag, href: '/admin/dashboard/products' },
    { label: 'Offers', icon: Tag, href: '/admin/dashboard/offers' },
    { label: 'Inquiries', icon: MessageSquare, href: '/admin/dashboard/inquiries' },
    { label: 'Analytics', icon: BarChart, href: '/admin/dashboard/analytics' },
  ];

  const isActive = (href: string) => {
    if (href === '/admin/dashboard') return pathname === href;
    return pathname.startsWith(href);
  };

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50" suppressHydrationWarning={true}>
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40 lg:hidden transition-opacity duration-300"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-slate-200 flex flex-col transform transition-transform duration-300 ease-in-out
        lg:relative lg:translate-x-0 
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="h-16 flex items-center justify-between px-6 border-b border-slate-200 bg-earthGreen/5">
          <span className="text-xl font-bold text-earthGreen">Green Seeds Agro Admin</span>
          <button
            className="lg:hidden p-2 -mr-2 text-slate-500 hover:text-slate-900"
            onClick={() => setIsSidebarOpen(false)}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="flex-1 py-6 px-4 space-y-1 overflow-y-auto">
          <p className="px-2 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4">Management</p>
          {navItems.map((item) => {
            const active = isActive(item.href);
            return (
              <Link
                key={item.label}
                href={item.href}
                onClick={() => setIsSidebarOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${active
                    ? 'bg-earthGreen text-white shadow-md shadow-earthGreen/20'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  }`}
              >
                <item.icon className={`w-5 h-5 ${active ? 'text-white/80' : 'text-slate-400'}`} />
                {item.label}
              </Link>
            );
          })}

          <p className="px-2 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4 mt-8">Content</p>
          <Link
            href="/admin/dashboard/banner"
            onClick={() => setIsSidebarOpen(false)}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${isActive('/admin/dashboard/banner')
                ? 'bg-earthGreen text-white shadow-md shadow-earthGreen/20'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
          >
            <LayoutDashboard className={`w-5 h-5 ${isActive('/admin/dashboard/banner') ? 'text-white/80' : 'text-slate-400'}`} />
            Promo Banner
          </Link>
        </nav>

        <div className="p-4 border-t border-slate-200">
          <Link href="/" className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900 rounded-lg">
            <Settings className="w-5 h-5 text-slate-400" />
            User Page
          </Link>
          <Link href="/admin" className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 hover:text-red-700 rounded-lg mt-1">
            <LogOut className="w-5 h-5 text-red-400" />
            Logout
          </Link>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile Header */}
        <header className="lg:hidden h-16 flex items-center justify-between px-6 bg-white border-b border-slate-200 shrink-0">
          <div className="flex items-center gap-3">
            <button
              className="p-2 -ml-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
              onClick={() => setIsSidebarOpen(true)}
            >
              <Menu className="w-6 h-6" />
            </button>
            <span className="text-lg font-bold text-earthGreen">Admin Panel</span>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}

