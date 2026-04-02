import { LayoutDashboard, ShoppingBag, Tag, MessageSquare, BarChart, Settings, LogOut } from 'lucide-react';
import Link from 'next/link';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  // Navigation sidebar items
  const navItems = [
    { label: 'Overview', icon: LayoutDashboard, href: '/admin/dashboard', active: true },
    { label: 'Products', icon: ShoppingBag, href: '/admin/dashboard/products', active: false },
    { label: 'Offers', icon: Tag, href: '/admin/dashboard/offers', active: false },
    { label: 'Inquiries', icon: MessageSquare, href: '/admin/dashboard/inquiries', active: false },
    { label: 'Analytics', icon: BarChart, href: '/admin/dashboard/analytics', active: false },
  ];

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50" suppressHydrationWarning={true}>
      {/* Sidebar */}
      <aside className="w-64 flex-shrink-0 bg-white border-r border-slate-200 flex flex-col">
        <div className="h-16 flex items-center px-6 border-b border-slate-200 bg-earthGreen/5">
          <span className="text-xl font-bold text-earthGreen">Green Seeds Agro Admin</span>
        </div>
        
        <nav className="flex-1 py-6 px-4 space-y-2 overflow-y-auto">
          <p className="px-2 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4">Management</p>
          {navItems.map((item) => (
            <Link 
              key={item.label} 
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                item.active 
                  ? 'bg-earthGreen text-white' 
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              <item.icon className={`w-5 h-5 ${item.active ? 'text-white/80' : 'text-slate-400'}`} />
              {item.label}
            </Link>
          ))}
          
          <p className="px-2 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4 mt-8">Content</p>
          <Link 
            href="/admin/dashboard/banner"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors text-slate-600 hover:bg-slate-100 hover:text-slate-900"
          >
            <LayoutDashboard className="w-5 h-5 text-slate-400" />
            Promo Banner
          </Link>
        </nav>

        <div className="p-4 border-t border-slate-200">
          <Link href="#" className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900 rounded-lg">
            <Settings className="w-5 h-5 text-slate-400" />
            Settings
          </Link>
          <Link href="/admin" className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 hover:text-red-700 rounded-lg mt-1">
            <LogOut className="w-5 h-5 text-red-400" />
            Logout
          </Link>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto p-8">
        {children}
      </main>
    </div>
  );
}
