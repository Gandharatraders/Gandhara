'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import AdminLayout from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Search, Filter, Eye, Package, Truck, CheckCircle, XCircle } from 'lucide-react';
import { Input } from '@/components/ui/input';

const statusConfig = {
  pending: { label: 'Pending', color: 'bg-yellow-500/10 text-yellow-500', icon: Package },
  confirmed: { label: 'Confirmed', color: 'bg-blue-500/10 text-blue-500', icon: CheckCircle },
  processing: { label: 'Processing', color: 'bg-purple-500/10 text-purple-500', icon: Package },
  shipped: { label: 'Shipped', color: 'bg-cyan-500/10 text-cyan-500', icon: Truck },
  delivered: { label: 'Delivered', color: 'bg-green-500/10 text-green-500', icon: CheckCircle },
  cancelled: { label: 'Cancelled', color: 'bg-red-500/10 text-red-500', icon: XCircle },
};

export default function AdminOrdersPage() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const session = localStorage.getItem('admin-session');
    if (!session) {
      router.push('/admin/login');
    } else {
      setIsAuthenticated(true);
      // Fetch orders from API
      fetch('/api/orders')
        .then(res => res.json())
        .then(data => {
          setOrders(data);
          setLoading(false);
        })
        .catch(err => {
          console.error('Failed to fetch orders:', err);
          // Fallback to localStorage if API fails
          const localOrders = JSON.parse(localStorage.getItem('crownix-orders') || '[]');
          setOrders(localOrders);
          setLoading(false);
        });
    }
  }, [router]);

  if (!isAuthenticated) {
    return null;
  }

  const filteredOrders = orders.filter(
    (order) =>
      order.customerName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.id?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customerEmail?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <AdminLayout>
      <div className="p-6 lg:p-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-light text-[#F5F5F5] mb-2">
              Orders <span className="font-semibold text-[#C7CBD0]">Management</span>
            </h1>
            <p className="text-[#A6A6A6]">
              View and manage customer orders, shipping, and delivery status.
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          {Object.entries(statusConfig).map(([key, config]) => {
            const Icon = config.icon;
            const count = orders.filter((o) => o.status === key).length;
            return (
              <div
                key={key}
                className="bg-[#101010] rounded-xl p-4 border border-[#292929]"
              >
                <div className="flex items-center gap-2 mb-2">
                  <Icon className={`w-4 h-4 ${config.color.split(' ')[1]}`} />
                  <span className="text-sm text-[#A6A6A6]">{config.label}</span>
                </div>
                <p className="text-2xl font-semibold text-[#F5F5F5]">{count}</p>
              </div>
            );
          })}
        </div>

        {/* Search and Filter */}
        <div className="bg-[#101010] rounded-xl p-4 border border-[#292929] mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#A6A6A6]" />
              <Input
                type="text"
                placeholder="Search orders by customer, email, or order ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline">
              <Filter className="w-4 h-4 mr-2" />
              Filters
            </Button>
          </div>
        </div>

        {/* Orders Table */}
        <div className="bg-[#101010] rounded-xl border border-[#292929] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#292929] bg-[#151515]">
                  <th className="text-left py-4 px-4 text-sm font-semibold text-[#A6A6A6]">
                    Order ID
                  </th>
                  <th className="text-left py-4 px-4 text-sm font-semibold text-[#A6A6A6]">
                    Customer
                  </th>
                  <th className="text-left py-4 px-4 text-sm font-semibold text-[#A6A6A6]">
                    Items
                  </th>
                  <th className="text-left py-4 px-4 text-sm font-semibold text-[#A6A6A6]">
                    Total
                  </th>
                  <th className="text-left py-4 px-4 text-sm font-semibold text-[#A6A6A6]">
                    Date
                  </th>
                  <th className="text-left py-4 px-4 text-sm font-semibold text-[#A6A6A6]">
                    Status
                  </th>
                  <th className="text-right py-4 px-4 text-sm font-semibold text-[#A6A6A6]">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.length > 0 ? (
                  filteredOrders.map((order) => {
                    const config = statusConfig[order.status as keyof typeof statusConfig];
                    return (
                      <tr key={order.id} className="border-b border-[#292929] hover:bg-[#151515]">
                        <td className="py-4 px-4">
                          <span className="text-[#F5F5F5] font-mono">{order.id}</span>
                        </td>
                        <td className="py-4 px-4">
                          <div>
                            <p className="text-[#F5F5F5]">{order.customerName || 'Unknown'}</p>
                            <p className="text-sm text-[#A6A6A6]">{order.customerEmail || 'No email'}</p>
                          </div>
                        </td>
                        <td className="py-4 px-4 text-[#A6A6A6]">{order.items?.length || 0}</td>
                        <td className="py-4 px-4 text-[#F5F5F5] font-semibold">
                          PKR {(order.totalAmount || 0).toLocaleString()}
                        </td>
                        <td className="py-4 px-4 text-[#A6A6A6]">{new Date(order.createdAt).toLocaleDateString()}</td>
                        <td className="py-4 px-4">
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-semibold ${config.color}`}
                          >
                            {config.label}
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              className="p-2 text-[#A6A6A6] hover:text-[#F5F5F5] hover:bg-[#292929] rounded-lg transition-colors"
                              title="View Details"
                              onClick={() => router.push(`/admin/orders/${order.id}`)}
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={7} className="py-12 text-center">
                      <p className="text-[#A6A6A6]">No orders found</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between mt-6">
          <p className="text-sm text-[#A6A6A6]">
            Showing {filteredOrders.length} of {orders.length} orders
          </p>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" disabled>
              Previous
            </Button>
            <Button variant="outline" size="sm" disabled>
              Next
            </Button>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
