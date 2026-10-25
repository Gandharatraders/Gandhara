'use client';

import { useState } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { CheckCircle, Upload, Star, Send, X } from 'lucide-react';

export default function ConfirmOrderPage() {
  const [orderNumber, setOrderNumber] = useState('');
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
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
        if (foundOrder.status !== 'delivered') {
          setError('Order must be delivered before you can confirm receipt and review.');
          setLoading(false);
          return;
        }
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

  return (
    <>
      <Header />

      <main className="pt-20 min-h-screen bg-[#050505]">
        <section className="py-16 bg-gradient-to-b from-[#101010] to-[#050505]">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl md:text-5xl font-light text-[#F5F5F5] mb-4">
              Confirm Order <span className="font-semibold text-[#C7CBD0]">Receipt</span>
            </h1>
            <p className="text-[#A6A6A6] text-lg mb-8">
              Enter your order number to confirm receipt and leave a review
            </p>

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
                  className="px-8 py-4 bg-[#E50920] text-white font-semibold rounded-lg hover:bg-[#ff3333] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Searching...' : 'Find Order'}
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

        {order && !reviewSubmitted && (
          <section className="py-12">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="bg-[#101010] rounded-2xl border border-[#292929] overflow-hidden">
                <div className="p-6 border-b border-[#292929]">
                  <div className="flex items-center gap-3 mb-4">
                    <CheckCircle className="w-8 h-8 text-green-500" />
                    <h2 className="text-2xl font-semibold text-[#F5F5F5]">
                      Order #{order.orderNumber}
                    </h2>
                  </div>
                  <p className="text-[#A6A6A6]">
                    Order Status: <span className="text-green-500 font-semibold uppercase">{order.status}</span>
                  </p>
                </div>

                <div className="p-6">
                  <h3 className="text-xl font-semibold text-[#F5F5F5] mb-6">
                    Confirm Receipt & Leave a Review
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
                      <label className="block text-sm text-[#A6A6A6] mb-2">Upload Photos (Optional, max 5)</label>
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
                                <X className="w-4 h-4" />
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
                  Confirm Another Order
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
