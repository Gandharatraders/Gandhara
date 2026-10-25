'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import AdminLayout from '@/components/admin/AdminLayout';

export default function AdminCustomersPage() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const session = localStorage.getItem('admin-session');
    if (!session) {
      router.push('/admin/login');
    } else {
      setIsAuthenticated(true);
    }
  }, [router]);

  if (!isAuthenticated) {
    return null;
  }

  return (
    <AdminLayout>
      <div className="p-6 lg:p-8">
        <h1 className="text-3xl font-light text-[#F5F5F5] mb-2">
          Customers <span className="font-semibold text-[#C7CBD0]">Management</span>
        </h1>
        <p className="text-[#A6A6A6] mb-8">
          Manage customer accounts and profiles.
        </p>
        <div className="bg-[#101010] rounded-xl p-12 border border-[#292929] text-center">
          <p className="text-[#A6A6A6]">Customer management coming soon.</p>
        </div>
      </div>
    </AdminLayout>
  );
}
