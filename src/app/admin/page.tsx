'use client';

import { ShieldCheck } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function AdminLoginPage() {
  const router = useRouter();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // For demonstration, any login redirects to dashboard
    router.push('/admin/dashboard');
  };

  return (
    <div className="flex h-screen w-full items-center justify-center bg-slate-50 px-4">
      <div className="w-full max-w-sm bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
        <div className="flex flex-col items-center mb-8">
          <div className="w-12 h-12 bg-earthGreen/10 text-earthGreen rounded-full flex items-center justify-center mb-4">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900">Admin Login</h1>
          <p className="text-sm text-slate-500 mt-1">Authenticate to access the dashboard</p>
        </div>
        
        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-1">
            <label className="text-sm font-medium text-slate-700">Email Address</label>
            <input 
              type="email" 
              required
              placeholder="admin@greenseedsagro.in" 
              className="w-full h-10 px-3 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-earthGreen focus:border-transparent text-sm"
            />
          </div>
          
          <div className="space-y-1">
            <label className="text-sm font-medium text-slate-700">Password</label>
            <input 
              type="password" 
              required
              placeholder="••••••••" 
              className="w-full h-10 px-3 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-earthGreen focus:border-transparent text-sm"
            />
          </div>
          
          <button 
            type="submit" 
             className="w-full h-10 bg-earthGreen hover:bg-lightGreen text-white font-medium rounded-md transition-colors mt-4"
          >
            Sign In
          </button>

          {/* Warning notice about demo */}
          <div className="mt-4 p-4 text-xs text-amber-700 bg-amber-50 rounded text-center border border-amber-200">
            For demonstration purposes, login logic is mocked. Submitting redirects to the dashboard.
          </div>
        </form>
      </div>
    </div>
  );
}
