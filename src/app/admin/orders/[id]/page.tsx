'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useParams } from 'next/navigation';
import AdminLayout from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Package, Truck, CheckCircle, XCircle, Clock, User, MapPin, CreditCard } from 'lucide-react';
import { formatPrice } from '@/lib/utils';

const statusConfig = {
  pending: { label: 'Pending', color: 'bg-yellow-500/10 text-yellow-500', icon: Clock },
  confirmed: { label: 'Confirmed', color: 'bg-blue-500/10 text-blue-500', icon: CheckCircle },
  processing: { label: 'Processing', color: 'bg-purple-500/10 text-purple-500', icon: Package },
  shipped: { label: 'Shipped', color: 'bg-cyan-500/10 text-cyan-500', icon: Truck },
  delivered: { label: 'Delivered', color: 'bg-green-500/10 text-green-500', icon: CheckCircle },
  cancelled: { label: 'Cancelled', color: 'bg-red-500/10 text-red-500', icon: XCircle },
};

function OrderDetailContent() {
  const router = useRouter();
  const params = useParams();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    const session = localStorage.getItem('admin-session');
    if (!session) {
      router.push('/admin/login');
    } else {
      setIsAuthenticated(true);
      fetchOrder();
    }
  }, [router]);

  const fetchOrder = async () => {
    try {
      const { id } = await params;
      console.log('Fetching order with ID:', id);
      
      const response = await fetch(`/api/orders/${id}`);
      console.log('API response status:', response.status);
      
      if (response.ok) {
        const data = await response.json();
        console.log('Order fetched from API:', data);
        setOrder(data);
      } else {
        console.log('API failed, trying localStorage fallback');
        // Try localStorage fallback
        const orders = JSON.parse(localStorage.getItem('crownix-orders') || '[]');
        console.log('Orders in localStorage:', orders);
        const foundOrder = orders.find((o: any) => o.id === id);
        console.log('Found order in localStorage:', foundOrder);
        setOrder(foundOrder);
      }
    } catch (error) {
      console.error('Failed to fetch order:', error);
      // Try localStorage fallback
      const { id } = await params;
      const orders = JSON.parse(localStorage.getItem('crownix-orders') || '[]');
      const foundOrder = orders.find((o: any) => o.id === id);
      if (foundOrder) {
        setOrder(foundOrder);
      }
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (newStatus: string) => {
    setUpdating(true);
    try {
      const response = await fetch(`/api/orders/${order.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        const updatedOrder = await response.json();
        setOrder(updatedOrder);
      } else {
        // Fallback to localStorage
        const orders = JSON.parse(localStorage.getItem('crownix-orders') || '[]');
        const updatedOrders = orders.map((o: any) =>
          o.id === order.id ? { ...o, status: newStatus, updatedAt: new Date().toISOString() } : o
        );
        localStorage.setItem('crownix-orders', JSON.stringify(updatedOrders));
        setOrder({ ...order, status: newStatus, updatedAt: new Date().toISOString() });
      }
    } catch (error) {
      console.error('Failed to update order:', error);
    } finally {
      setUpdating(false);
    }
  };

  if (!isAuthenticated) return null;

  if (loading) {
    return (
      <AdminLayout>
        <div className="p-6 lg:p-8">
          <p className="text-[#A6A6A6]">Loading order details...</p>
        </div>
      </AdminLayout>
    );
  }

  if (!order) {
    return (
      <AdminLayout>
        <div className="p-6 lg:p-8">
          <Button onClick={() => router.push('/admin/orders')} variant="outline" className="mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Orders
          </Button>
          <p className="text-[#A6A6A6] mb-2">Order not found</p>
          <p className="text-sm text-[#A6A6A6]">Order ID: loading...</p>
        </div>
      </AdminLayout>
    );
  }

  const config = statusConfig[order.status as keyof typeof statusConfig];
  const StatusIcon = config.icon;

  return (
    <AdminLayout>
      <div className="p-6 lg:p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button onClick={() => router.push('/admin/orders')} variant="outline" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <div>
              <h1 className="text-2xl font-light text-[#F5F5F5]">
                Order <span className="font-semibold text-[#C7CBD0]">#{order.orderNumber || order.id}</span>
              </h1>
              <p className="text-sm text-[#A6A6A6]">Placed on {new Date(order.createdAt).toLocaleDateString()}</p>
            </div>
          </div>
          <div className={`px-4 py-2 rounded-full flex items-center gap-2 ${config.color}`}>
            <StatusIcon className="w-4 h-4" />
            <span className="text-sm font-semibold">{config.label}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Order Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Customer Information */}
            <div className="bg-[#101010] rounded-xl p-6 border border-[#292929]">
              <h2 className="text-lg font-semibold text-[#F5F5F5] mb-4 flex items-center gap-2">
                <User className="w-5 h-5" />
                Customer Information
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-[#A6A6A6] mb-1">Name</p>
                  <p className="text-[#F5F5F5]">{order.customerName || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-[#A6A6A6] mb-1">Email</p>
                  <p className="text-[#F5F5F5]">{order.customerEmail || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-[#A6A6A6] mb-1">Phone</p>
                  <p className="text-[#F5F5F5]">{order.customerPhone || 'N/A'}</p>
                </div>
              </div>
            </div>

            {/* Shipping Address */}
            <div className="bg-[#101010] rounded-xl p-6 border border-[#292929]">
              <h2 className="text-lg font-semibold text-[#F5F5F5] mb-4 flex items-center gap-2">
                <MapPin className="w-5 h-5" />
                Shipping Address
              </h2>
              <div className="bg-[#151515] rounded-lg p-4">
                <p className="text-[#F5F5F5]">{order.shippingAddress?.fullName || 'N/A'}</p>
                <p className="text-[#A6A6A6]">{order.shippingAddress?.phone || 'N/A'}</p>
                <p className="text-[#A6A6A6]">{order.shippingAddress?.email || 'N/A'}</p>
                <p className="text-[#A6A6A6]">{order.shippingAddress?.address || 'N/A'}</p>
                <p className="text-[#A6A6A6]">
                  {order.shippingAddress?.city || 'N/A'}, {order.shippingAddress?.country || 'N/A'}
                </p>
              </div>
            </div>

            {/* Order Items */}
            <div className="bg-[#101010] rounded-xl p-6 border border-[#292929]">
              <h2 className="text-lg font-semibold text-[#F5F5F5] mb-4 flex items-center gap-2">
                <Package className="w-5 h-5" />
                Order Items
              </h2>
              <div className="space-y-3">
                {order.items?.map((item: any, index: number) => (
                  <div key={index} className="flex items-center justify-between bg-[#151515] rounded-lg p-4">
                    <div className="flex-1">
                      <p className="text-[#F5F5F5] font-medium">{item.productName}</p>
                      <p className="text-sm text-[#A6A6A6]">SKU: {item.sku}</p>
                      <p className="text-sm text-[#A6A6A6]">Qty: {item.quantity}</p>
                      {(item.selectedColor || item.selectedStrap) && (
                        <div className="flex gap-2 mt-1">
                          {item.selectedColor && (
                            <span className="text-xs text-[#A6A6A6]">{item.selectedColor}</span>
                          )}
                          {item.selectedStrap && (
                            <span className="text-xs text-[#A6A6A6]">{item.selectedStrap}</span>
                          )}
                        </div>
                      )}
                    </div>
                    <p className="text-[#F5F5F5] font-semibold">
                      PKR {item.totalPrice?.toLocaleString() || item.unitPrice?.toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Order Summary & Status */}
          <div className="space-y-6">
            {/* Payment Information */}
            <div className="bg-[#101010] rounded-xl p-6 border border-[#292929]">
              <h2 className="text-lg font-semibold text-[#F5F5F5] mb-4 flex items-center gap-2">
                <CreditCard className="w-5 h-5" />
                Payment Information
              </h2>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-[#A6A6A6]">Method</span>
                  <span className="text-[#F5F5F5] capitalize">{order.paymentMethod || 'COD'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-[#A6A6A6]">Status</span>
                  <span className="text-[#F5F5F5] capitalize">{order.paymentStatus || 'Pending'}</span>
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="bg-[#101010] rounded-xl p-6 border border-[#292929]">
              <h2 className="text-lg font-semibold text-[#F5F5F5] mb-4">Order Summary</h2>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-[#A6A6A6]">Subtotal</span>
                  <span className="text-[#F5F5F5]">{formatPrice(order.subtotal || 0)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-[#A6A6A6]">Shipping</span>
                  <span className="text-[#F5F5F5]">{formatPrice(order.shippingCost || 0)}</span>
                </div>
                <div className="flex justify-between text-lg font-semibold pt-3 border-t border-[#292929]">
                  <span className="text-[#F5F5F5]">Total</span>
                  <span className="text-[#F5F5F5]">{formatPrice(order.totalAmount || order.total || 0)}</span>
                </div>
              </div>
            </div>

            {/* Update Status */}
            <div className="bg-[#101010] rounded-xl p-6 border border-[#292929]">
              <h2 className="text-lg font-semibold text-[#F5F5F5] mb-4">Update Order Status</h2>
              <div className="space-y-2">
                {Object.entries(statusConfig).map(([key, config]) => {
                  const Icon = config.icon;
                  return (
                    <button
                      key={key}
                      onClick={() => updateOrderStatus(key)}
                      disabled={updating || order.status === key}
                      className={`w-full flex items-center gap-3 p-3 rounded-lg border transition-all ${
                        order.status === key
                          ? 'border-[#C7CBD0] bg-[#151515]'
                          : 'border-[#292929] hover:border-[#C7CBD0] hover:bg-[#151515]'
                      } disabled:opacity-50 disabled:cursor-not-allowed`}
                    >
                      <Icon className={`w-4 h-4 ${config.color.split(' ')[1]}`} />
                      <span className="text-[#F5F5F5]">{config.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

export default function OrderDetailPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-[#050505] text-[#A6A6A6]">Loading...</div>}>
      <OrderDetailContent />
    </Suspense>
  );
}
