'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  Shield,
  Settings,
  LogOut,
  Menu,
  X,
  Mail,
  Star,
} from 'lucide-react';

interface AdminLayoutProps {
  children: React.ReactNode;
}

const navItems = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/products', label: 'Products', icon: Package },
  { href: '/admin/orders', label: 'Orders', icon: ShoppingCart },
  { href: '/admin/reviews', label: 'Reviews', icon: Star },
  { href: '/admin/messages', label: 'Messages', icon: Mail },
  { href: '/admin/customers', label: 'Customers', icon: Users },
  { href: '/admin/laboratory', label: 'Laboratory', icon: Shield },
  { href: '/admin/settings', label: 'Settings', icon: Settings },
];

export default function AdminLayout({ children }: AdminLayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-[#050505]">
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-[#101010] border-b border-[#292929]">
        <div className="flex items-center justify-between px-4 py-4">
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="p-2 text-[#A6A6A6] hover:text-[#F5F5F5]"
          >
            <Menu className="w-6 h-6" />
          </button>
          <div className="relative w-32 h-8">
            <img
              src="/logo.png"
              alt="Gandhara Traders Company"
              className="w-full h-full object-contain"
              className="object-contain"
            />
          </div>
          <div className="w-10" />
        </div>
      </div>

      {/* Sidebar Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-50 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-50 h-full w-64 bg-[#101010] border-r border-[#292929] transform transition-transform duration-300 lg:translate-x-0 ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-6 border-b border-[#292929]">
            <div className="relative w-48 h-16 mx-auto">
              <img
                src="/logo.png"
                alt="Gandhara Traders Company"
                className="w-full h-full object-contain"
                className="object-contain"
              />
            </div>
            <p className="text-xs text-[#A6A6A6] text-center mt-2">Admin Dashboard</p>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto p-4">
            <ul className="space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
                
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      onClick={() => setIsSidebarOpen(false)}
                      className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                        isActive
                          ? 'bg-[#E50920] text-white'
                          : 'text-[#A6A6A6] hover:bg-[#151515] hover:text-[#F5F5F5]'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      <span>{item.label}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* Logout */}
          <div className="p-4 border-t border-[#292929]">
            <Link
              href="/"
              className="flex items-center gap-3 px-4 py-3 rounded-lg text-[#A6A6A6] hover:bg-[#151515] hover:text-[#F5F5F5] transition-colors"
            >
              <LogOut className="w-5 h-5" />
              <span>Logout</span>
            </Link>
          </div>

          {/* Close Button (Mobile) */}
          <button
            onClick={() => setIsSidebarOpen(false)}
            className="lg:hidden absolute top-4 right-4 p-2 text-[#A6A6A6] hover:text-[#F5F5F5]"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="lg:ml-64 pt-16 lg:pt-0">
        <main className="min-h-screen">{children}</main>
      </div>
    </div>
  );
}
