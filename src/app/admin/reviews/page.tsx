'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import AdminLayout from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { CheckCircle, Star, Trash2, Calendar, Clock } from 'lucide-react';

export default function AdminReviewsPage() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const session = localStorage.getItem('admin-session');
    if (!session) {
      router.push('/admin/login');
    } else {
      setIsAuthenticated(true);
      fetchReviews();
    }
  }, [router]);

  const fetchReviews = async () => {
    try {
      const response = await fetch('/api/reviews');
      const data = await response.json();
      setReviews(data);
    } catch (error) {
      console.error('Failed to fetch reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (reviewId: string) => {
    try {
      const response = await fetch(`/api/reviews/${reviewId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ approved: true }),
      });

      if (response.ok) {
        alert('Review approved successfully!');
        fetchReviews();
      } else {
        alert('Failed to approve review');
      }
    } catch (error) {
      alert('Failed to approve review');
    }
  };

  const handleDelete = async (reviewId: string) => {
    if (!confirm('Are you sure you want to delete this review?')) {
      return;
    }

    try {
      const response = await fetch(`/api/reviews/${reviewId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        alert('Review deleted successfully!');
        fetchReviews();
      } else {
        alert('Failed to delete review');
      }
    } catch (error) {
      alert('Failed to delete review');
    }
  };

  if (!isAuthenticated) {
    return null;
  }

  if (loading) {
    return (
      <AdminLayout>
        <div className="p-6 lg:p-8">
          <p className="text-[#A6A6A6]">Loading reviews...</p>
        </div>
      </AdminLayout>
    );
  }

  const pendingReviews = reviews.filter((r) => !r.approved);
  const approvedReviews = reviews.filter((r) => r.approved);

  return (
    <AdminLayout>
      <div className="p-6 lg:p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-light text-[#F5F5F5] mb-2">
            Reviews <span className="font-semibold text-[#C7CBD0]">Management</span>
          </h1>
          <p className="text-[#A6A6A6]">
            Approve or delete customer reviews. Only approved reviews with 4+ stars will be shown on product pages.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-[#101010] rounded-xl p-6 border border-[#292929]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[#A6A6A6] text-sm">Total Reviews</p>
                <p className="text-3xl font-bold text-[#F5F5F5] mt-1">{reviews.length}</p>
              </div>
              <Star className="w-12 h-12 text-[#C7CBD0]" />
            </div>
          </div>
          <div className="bg-[#101010] rounded-xl p-6 border border-[#292929]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[#A6A6A6] text-sm">Pending Approval</p>
                <p className="text-3xl font-bold text-[#E50920] mt-1">{pendingReviews.length}</p>
              </div>
              <Clock className="w-12 h-12 text-[#E50920]" />
            </div>
          </div>
          <div className="bg-[#101010] rounded-xl p-6 border border-[#292929]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[#A6A6A6] text-sm">Approved</p>
                <p className="text-3xl font-bold text-green-500 mt-1">{approvedReviews.length}</p>
              </div>
              <CheckCircle className="w-12 h-12 text-green-500" />
            </div>
          </div>
        </div>

        {/* Pending Reviews */}
        {pendingReviews.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-[#F5F5F5] mb-4">Pending Reviews</h2>
            <div className="space-y-4">
              {pendingReviews.map((review) => (
                <div key={review.id} className="bg-[#101010] rounded-xl p-6 border border-[#292929]">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-[#F5F5F5] font-semibold">{review.customerName}</h3>
                        <div className="flex items-center gap-0.5">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-4 h-4 ${
                                i < review.rating ? 'fill-[#E50920] text-[#E50920]' : 'text-[#292929]'
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                      <p className="text-sm text-[#A6A6A6] mb-2">Order: {review.orderNumber}</p>
                      <p className="text-[#F5F5F5]">{review.comment}</p>
                      {review.photos && review.photos.length > 0 && (
                        <div className="mt-4 flex gap-2">
                          {review.photos.map((photo: string, index: number) => (
                            <img
                              key={index}
                              src={photo}
                              alt={`Review photo ${index + 1}`}
                              className="w-20 h-20 object-cover rounded-lg"
                            />
                          ))}
                        </div>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Button
                        onClick={() => handleApprove(review.id)}
                        className="bg-green-500 hover:bg-green-600"
                      >
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Approve
                      </Button>
                      <Button
                        onClick={() => handleDelete(review.id)}
                        variant="outline"
                        className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete
                      </Button>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-[#A6A6A6]">
                    <Calendar className="w-4 h-4" />
                    {new Date(review.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Approved Reviews */}
        <div>
          <h2 className="text-xl font-semibold text-[#F5F5F5] mb-4">Approved Reviews</h2>
          {approvedReviews.length === 0 ? (
            <div className="text-center py-12 text-[#A6A6A6]">
              No approved reviews yet.
            </div>
          ) : (
            <div className="space-y-4">
              {approvedReviews.map((review) => (
                <div key={review.id} className="bg-[#101010] rounded-xl p-6 border border-[#292929] opacity-60">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-[#F5F5F5] font-semibold">{review.customerName}</h3>
                        <div className="flex items-center gap-0.5">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-4 h-4 ${
                                i < review.rating ? 'fill-[#E50920] text-[#E50920]' : 'text-[#292929]'
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                      <p className="text-sm text-[#A6A6A6] mb-2">Order: {review.orderNumber}</p>
                      <p className="text-[#F5F5F5]">{review.comment}</p>
                      {review.photos && review.photos.length > 0 && (
                        <div className="mt-4 flex gap-2">
                          {review.photos.map((photo: string, index: number) => (
                            <img
                              key={index}
                              src={photo}
                              alt={`Review photo ${index + 1}`}
                              className="w-20 h-20 object-cover rounded-lg"
                            />
                          ))}
                        </div>
                      )}
                    </div>
                    <Button
                      onClick={() => handleDelete(review.id)}
                      variant="outline"
                      className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete
                    </Button>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-[#A6A6A6]">
                    <Calendar className="w-4 h-4" />
                    {new Date(review.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
