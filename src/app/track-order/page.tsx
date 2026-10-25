'use client';

import { useState } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Search, Package, Truck, CheckCircle, Clock, XCircle, Star, Upload, Send } from 'lucide-react';

export default function TrackOrderPage() {
  const [orderNumber, setOrderNumber] = useState('');
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewSubmitted, setReviewSubmitted] = useState(false);
  const [reviewData, setReviewData] = useState({
    rating: 5,
    comment: '',
    photos: [] as File[],
  });

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderNumber.trim()) {
      setError('Please enter an order number');
      return;
    }

    setLoading(true);
    setError('');
    setOrder(null);

    try {
      const response = await fetch('/api/orders');
      const orders = await response.json();
      const foundOrder = orders.find((o: any) => o.orderNumber === orderNumber.toUpperCase());

      if (foundOrder) {
        setOrder(foundOrder);
      } else {
        setError('Order not found. Please check your order number and try again.');
      }
    } catch (err) {
      setError('Failed to fetch order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 5) {
      alert('Maximum 5 photos allowed');
      return;
    }
    setReviewData({ ...reviewData, photos: files });
  };

  const removePhoto = (index: number) => {
    setReviewData({
      ...reviewData,
      photos: reviewData.photos.filter((_, i) => i !== index),
    });
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewData.comment.trim()) {
      alert('Please write a review');
      return;
    }

    // Upload photos
    const uploadedPhotos: string[] = [];
    for (const photo of reviewData.photos) {
      const formData = new FormData();
      formData.append('file', photo);
      formData.append('type', 'reviews');

      try {
        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });
        const data = await response.json();
        uploadedPhotos.push(data.url);
      } catch (error) {
        console.error('Failed to upload photo:', error);
      }
    }

    // Submit review
    try {
      const response = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: order.items[0].productId,
          customerName: order.customerName,
          rating: reviewData.rating,
          comment: reviewData.comment,
          photos: uploadedPhotos,
          orderNumber: order.orderNumber,
        }),
      });

      if (response.ok) {
        setReviewSubmitted(true);
        // Update order status to confirmed
        await fetch(`/api/orders/${order.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status: 'confirmed' }),
        });
      } else {
        alert('Failed to submit review');
      }
    } catch (error) {
      alert('Failed to submit review');
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'confirmed':
      case 'processing':
        return <Clock className="w-6 h-6 text-yellow-500" />;
      case 'shipped':
        return <Truck className="w-6 h-6 text-blue-500" />;
      case 'delivered':
        return <CheckCircle className="w-6 h-6 text-green-500" />;
      case 'cancelled':
        return <XCircle className="w-6 h-6 text-red-500" />;
      default:
        return <Package className="w-6 h-6 text-[#A6A6A6]" />;
    }
  };

  const getStatusText = (status: string) => {
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  return (
    <>
      <Header />

      <main className="pt-20 min-h-screen bg-[#050505]">
        {/* Hero Section */}
        <section className="py-16 bg-gradient-to-b from-[#101010] to-[#050505]">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl md:text-5xl font-light text-[#F5F5F5] mb-4">
              Track Your <span className="font-semibold text-[#C7CBD0]">Order</span>
            </h1>
            <p className="text-[#A6A6A6] text-lg mb-8">
              Enter your order number to check the status of your order
            </p>

            {/* Search Form */}
            <form onSubmit={handleSearch} className="max-w-2xl mx-auto">
              <div className="flex gap-4">
                <input
                  type="text"
                  value={orderNumber}
                  onChange={(e) => setOrderNumber(e.target.value)}
                  placeholder="Enter Order Number (e.g., ORD-870690)"
                  className="flex-1 px-6 py-4 bg-[#151515] border border-[#292929] rounded-lg text-[#F5F5F5] placeholder-[#555555] focus:outline-none focus:ring-2 focus:ring-[#E50920] focus:border-transparent text-lg"
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="px-8 py-4 bg-[#E50920] text-white font-semibold rounded-lg hover:bg-[#ff3333] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <Search className="w-5 h-5" />
                      Track
                    </>
                  )}
                </button>
              </div>
            </form>

            {error && (
              <div className="mt-6 p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
                <p className="text-red-500">{error}</p>
              </div>
            )}
          </div>
        </section>

        {/* Order Details */}
        {order && (
          <section className="py-12">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="bg-[#101010] rounded-2xl border border-[#292929] overflow-hidden">
                {/* Order Header */}
                <div className="p-6 border-b border-[#292929]">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                      <h2 className="text-2xl font-semibold text-[#F5F5F5] mb-2">
                        Order #{order.orderNumber}
                      </h2>
                      <p className="text-[#A6A6A6]">
                        Placed on {new Date(order.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      {getStatusIcon(order.status)}
                      <span className="text-lg font-semibold text-[#F5F5F5]">
                        {getStatusText(order.status)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Order Items */}
                <div className="p-6 border-b border-[#292929]">
                  <h3 className="text-lg font-semibold text-[#F5F5F5] mb-4">Order Items</h3>
                  <div className="space-y-4">
                    {order.items.map((item: any, index: number) => (
                      <div key={index} className="flex items-center justify-between py-4 border-b border-[#292929] last:border-0">
                        <div className="flex-1">
                          <p className="text-[#F5F5F5] font-medium">{item.productName}</p>
                          <p className="text-sm text-[#A6A6A6]">SKU: {item.sku}</p>
                          <p className="text-sm text-[#A6A6A6]">
                            Qty: {item.quantity} | {item.selectedColor} | {item.selectedStrap}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-[#F5F5F5] font-semibold">
                            PKR {item.totalPrice.toLocaleString()}
                          </p>
                          <p className="text-sm text-[#A6A6A6]">
                            PKR {item.unitPrice.toLocaleString()} each
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Order Summary */}
                <div className="p-6 border-b border-[#292929]">
                  <h3 className="text-lg font-semibold text-[#F5F5F5] mb-4">Order Summary</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between text-[#A6A6A6]">
                      <span>Subtotal</span>
                      <span>PKR {order.subtotal.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-[#A6A6A6]">
                      <span>Shipping</span>
                      <span>PKR {order.shippingCost.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-xl font-semibold text-[#F5F5F5] pt-2 border-t border-[#292929]">
                      <span>Total</span>
                      <span>PKR {order.totalAmount.toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                {/* Shipping Address */}
                <div className="p-6 border-b border-[#292929]">
                  <h3 className="text-lg font-semibold text-[#F5F5F5] mb-4">Shipping Address</h3>
                  <div className="text-[#A6A6A6] space-y-1">
                    <p className="text-[#F5F5F5] font-medium">{order.shippingAddress.fullName}</p>
                    <p>{order.shippingAddress.phone}</p>
                    <p>{order.shippingAddress.email}</p>
                    <p>{order.shippingAddress.address}</p>
                    <p>{order.shippingAddress.city}, {order.shippingAddress.country}</p>
                  </div>
                </div>

                {/* Payment Info */}
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-[#F5F5F5] mb-4">Payment Information</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between text-[#A6A6A6]">
                      <span>Payment Method</span>
                      <span className="text-[#F5F5F5] uppercase">{order.paymentMethod}</span>
                    </div>
                    <div className="flex justify-between text-[#A6A6A6]">
                      <span>Payment Status</span>
                      <span className={`${
                        order.paymentStatus === 'paid' ? 'text-green-500' : 'text-yellow-500'
                      } uppercase`}>
                        {order.paymentStatus}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Review Form - Only show when order is delivered */}
        {order && order.status === 'delivered' && !reviewSubmitted && (
          <section className="py-12">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="bg-[#101010] rounded-2xl border border-[#292929] overflow-hidden">
                <div className="p-6 border-b border-[#292929]">
                  <div className="flex items-center gap-3 mb-2">
                    <CheckCircle className="w-8 h-8 text-green-500" />
                    <h2 className="text-2xl font-semibold text-[#F5F5F5]">
                      Confirm Receipt & Leave a Review
                    </h2>
                  </div>
                  <p className="text-[#A6A6A6]">
                    Order Status: <span className="text-green-500 font-semibold uppercase">{order.status}</span>
                  </p>
                </div>

                <div className="p-6">
                  <h3 className="text-xl font-semibold text-[#F5F5F5] mb-6">
                    Write a Review for Your Order
                  </h3>

                  <form onSubmit={handleSubmitReview} className="space-y-6">
                    {/* Product Info */}
                    <div className="bg-[#151515] rounded-lg p-4">
                      <p className="text-[#F5F5F5] font-medium">{order.items[0].productName}</p>
                      <p className="text-sm text-[#A6A6A6]">SKU: {order.items[0].sku}</p>
                    </div>

                    {/* Rating */}
                    <div>
                      <label className="block text-sm text-[#A6A6A6] mb-2">Your Rating *</label>
                      <div className="flex gap-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            onClick={() => setReviewData({ ...reviewData, rating: star })}
                            className="p-2 hover:bg-[#292929] rounded-lg transition-colors"
                          >
                            <Star
                              className={`w-8 h-8 ${
                                star <= reviewData.rating ? 'fill-[#E50920] text-[#E50920]' : 'text-[#292929]'
                              }`}
                            />
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Review Comment */}
                    <div>
                      <label className="block text-sm text-[#A6A6A6] mb-2">Your Review *</label>
                      <textarea
                        value={reviewData.comment}
                        onChange={(e) => setReviewData({ ...reviewData, comment: e.target.value })}
                        required
                        rows={4}
                        className="w-full px-4 py-2.5 bg-[#151515] border border-[#292929] rounded-lg text-[#F5F5F5] placeholder-[#555555] focus:outline-none focus:ring-2 focus:ring-[#E50920] focus:border-transparent resize-none"
                        placeholder="Share your experience with this product..."
                      />
                    </div>

                    {/* Photo Upload */}
                    <div>
                      <label className="block text-sm text-[#A66A6A6] mb-2">Upload Photos (Optional, max 5)</label>
                      <div className="border-2 border-dashed border-[#292929] rounded-lg p-8 text-center hover:border-[#C7CBD0] transition-colors">
                        <input
                          type="file"
                          multiple
                          accept="image/*"
                          onChange={handlePhotoUpload}
                          className="hidden"
                          id="photo-upload"
                        />
                        <label
                          htmlFor="photo-upload"
                          className="cursor-pointer flex flex-col items-center gap-2"
                        >
                          <Upload className="w-8 h-8 text-[#A6A6A6]" />
                          <span className="text-[#A6A6A6]">Click to upload photos</span>
                        </label>
                      </div>

                      {reviewData.photos.length > 0 && (
                        <div className="mt-4 grid grid-cols-5 gap-2">
                          {reviewData.photos.map((photo, index) => (
                            <div key={index} className="relative aspect-square bg-[#151515] rounded-lg overflow-hidden">
                              <img
                                src={URL.createObjectURL(photo)}
                                alt={`Review photo ${index + 1}`}
                                className="w-full h-full object-cover"
                              />
                              <button
                                type="button"
                                onClick={() => removePhoto(index)}
                                className="absolute top-1 right-1 w-6 h-6 bg-[#E50920] rounded-full flex items-center justify-center text-white"
                              >
                                <XCircle className="w-4 h-4" />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Submit Button */}
                    <button
                      type="submit"
                      className="w-full py-4 bg-[#E50920] text-white font-semibold rounded-lg hover:bg-[#ff3333] transition-colors flex items-center justify-center gap-2"
                    >
                      <Send className="w-5 h-5" />
                      Confirm Receipt & Submit Review
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </section>
        )}

        {reviewSubmitted && (
          <section className="py-12">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
              <div className="bg-[#101010] rounded-2xl border border-[#292929] p-12">
                <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                <h2 className="text-2xl font-semibold text-[#F5F5F5] mb-2">
                  Review Submitted Successfully!
                </h2>
                <p className="text-[#A6A6A6] mb-6">
                  Thank you for confirming your order receipt. Your review will be visible after admin approval.
                </p>
                <button
                  onClick={() => {
                    setOrder(null);
                    setOrderNumber('');
                    setReviewSubmitted(false);
                    setReviewData({ rating: 5, comment: '', photos: [] });
                  }}
                  className="px-6 py-3 bg-[#292929] text-[#F5F5F5] font-semibold rounded-lg hover:bg-[#3a3a3a] transition-colors"
                >
                  Track Another Order
                </button>
              </div>
            </div>
          </section>
        )}
      </main>

      <Footer />
    </>
  );
}
