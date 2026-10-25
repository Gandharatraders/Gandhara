'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import AdminLayout from '@/components/admin/AdminLayout';
import { getProducts } from '@/lib/data';
import {
  Package,
  ShoppingCart,
  TrendingUp,
  AlertTriangle,
  ArrowRight,
} from 'lucide-react';

export default function AdminDashboardPage() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for admin session
    const session = localStorage.getItem('admin-session');
    if (!session) {
      router.push('/admin/login');
    } else {
      setIsAuthenticated(true);
      // Fetch products
      getProducts().then(data => {
        setProducts(data);
        setLoading(false);
      });
    }
  }, [router]);

  if (!isAuthenticated) {
    return null;
  }

  if (loading) {
    return (
      <AdminLayout>
        <div className="p-6 lg:p-8">
          <p className="text-[#A6A6A6]">Loading dashboard...</p>
        </div>
      </AdminLayout>
    );
  }

  // Calculate stats from data
  const totalProducts = products.length;
  const inStockProducts = products.filter(p => p.availability === 'in-stock').length;
  const lowStockProducts = products.filter(p => p.availability === 'low-stock').length;
  const outOfStockProducts = products.filter(p => p.availability === 'out-of-stock').length;

  const stats = [
    {
      label: 'Total Products',
      value: totalProducts,
      icon: Package,
      color: 'text-[#C7CBD0]',
      bgColor: 'bg-[#C7CBD0]/10',
    },
    {
      label: 'In Stock',
      value: inStockProducts,
      icon: TrendingUp,
      color: 'text-green-500',
      bgColor: 'bg-green-500/10',
    },
    {
      label: 'Low Stock',
      value: lowStockProducts,
      icon: AlertTriangle,
      color: 'text-yellow-500',
      bgColor: 'bg-yellow-500/10',
    },
    {
      label: 'Out of Stock',
      value: outOfStockProducts,
      icon: ShoppingCart,
      color: 'text-red-500',
      bgColor: 'bg-red-500/10',
    },
  ];

  return (
    <AdminLayout>
      <div className="p-6 lg:p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-light text-[#F5F5F5] mb-2">
            Dashboard <span className="font-semibold text-[#C7CBD0]">Overview</span>
          </h1>
          <p className="text-[#A6A6A6]">
            Welcome back! Here's what's happening with your store today.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.label}
                className="bg-[#101010] rounded-xl p-6 border border-[#292929]"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                    <Icon className={`w-6 h-6 ${stat.color}`} />
                  </div>
                </div>
                <p className="text-3xl font-semibold text-[#F5F5F5] mb-1">
                  {stat.value}
                </p>
                <p className="text-sm text-[#A6A6A6]">{stat.label}</p>
              </div>
            );
          })}
        </div>

        {/* Quick Actions */}
        <div className="bg-[#101010] rounded-xl p-6 border border-[#292929] mb-8">
          <h2 className="text-xl font-semibold text-[#F5F5F5] mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <button
              onClick={() => router.push('/admin/products/new')}
              className="flex items-center justify-between p-4 bg-[#151515] rounded-lg hover:bg-[#1a1a1a] transition-colors group"
            >
              <span className="text-[#F5F5F5]">Add New Product</span>
              <ArrowRight className="w-5 h-5 text-[#A6A6A6] group-hover:text-[#F5F5F5] transition-colors" />
            </button>
            <button
              onClick={() => router.push('/admin/products')}
              className="flex items-center justify-between p-4 bg-[#151515] rounded-lg hover:bg-[#1a1a1a] transition-colors group"
            >
              <span className="text-[#F5F5F5]">Manage Products</span>
              <ArrowRight className="w-5 h-5 text-[#A6A6A6] group-hover:text-[#F5F5F5] transition-colors" />
            </button>
            <button
              onClick={() => router.push('/admin/orders')}
              className="flex items-center justify-between p-4 bg-[#151515] rounded-lg hover:bg-[#1a1a1a] transition-colors group"
            >
              <span className="text-[#F5F5F5]">View Orders</span>
              <ArrowRight className="w-5 h-5 text-[#A6A6A6] group-hover:text-[#F5F5F5] transition-colors" />
            </button>
          </div>
        </div>

        {/* Recent Products */}
        <div className="bg-[#101010] rounded-xl p-6 border border-[#292929]">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-[#F5F5F5]">Recent Products</h2>
            <button
              onClick={() => router.push('/admin/products')}
              className="text-sm text-[#E50920] hover:underline"
            >
              View All
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#292929]">
                  <th className="text-left py-3 px-4 text-sm font-semibold text-[#A6A6A6]">
                    Product
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-[#A6A6A6]">
                    SKU
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-[#A6A6A6]">
                    Price
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-[#A6A6A6]">
                    Stock
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-[#A6A6A6]">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {products.slice(0, 5).map((product) => (
                  <tr key={product.id} className="border-b border-[#292929] hover:bg-[#151515]">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-[#050505] rounded-lg overflow-hidden">
                          <img
                            src={product.images?.main || '/placeholder.jpg'}
                            alt={product.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <span className="text-[#F5F5F5]">{product.name}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-[#A6A6A6]">{product.sku}</td>
                    <td className="py-3 px-4 text-[#F5F5F5]">
                      PKR {(product.salePrice || product.price).toLocaleString()}
                    </td>
                    <td className="py-3 px-4 text-[#A6A6A6]">{product.stockQuantity}</td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-semibold ${
                          product.availability === 'in-stock'
                            ? 'bg-green-500/10 text-green-500'
                            : product.availability === 'low-stock'
                            ? 'bg-yellow-500/10 text-yellow-500'
                            : 'bg-red-500/10 text-red-500'
                        }`}
                      >
                        {product.availability}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
