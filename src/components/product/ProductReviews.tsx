'use client';

import { useState, useEffect } from 'react';
import { Star } from 'lucide-react';

interface ProductReviewsProps {
  productId: string;
}

interface Review {
  id: string;
  productId: string;
  customerName: string;
  rating: number;
  comment: string;
  photos?: string[];
  createdAt: string;
}

export default function ProductReviews({ productId }: ProductReviewsProps) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReviews();
  }, [productId]);

  const fetchReviews = async () => {
    try {
      const response = await fetch(`/api/reviews?productId=${productId}&approvedOnly=true`);
      const data = await response.json();
      setReviews(data);
    } catch (error) {
      console.error('Failed to fetch reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  const averageRating = reviews.length > 0
    ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
    : 0;

  if (loading) {
    return <div className="text-center py-8 text-[#A6A6A6]">Loading reviews...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Rating Summary */}
      <div className="bg-[#101010] rounded-xl p-6 border border-[#292929]">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-2xl font-semibold text-[#F5F5F5] mb-2">Customer Reviews</h3>
            <p className="text-[#A6A6A6]">{reviews.length} reviews</p>
          </div>
          <div className="text-right">
            <div className="text-4xl font-bold text-[#F5F5F5]">{averageRating.toFixed(1)}</div>
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-5 h-5 ${
                    i < Math.round(averageRating) ? 'fill-[#E50920] text-[#E50920]' : 'text-[#292929]'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Reviews List */}
      <div className="space-y-4">
        {reviews.length === 0 ? (
          <div className="text-center py-8 text-[#A6A6A6]">
            No reviews yet. Customers can leave reviews after confirming order receipt.
          </div>
        ) : (
          reviews.slice(0, 3).map((review) => (
            <div key={review.id} className="bg-[#101010] rounded-xl p-6 border border-[#292929]">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-semibold text-[#F5F5F5]">{review.customerName}</h4>
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
                  <p className="text-xs text-[#A6A6A6]">
                    {new Date(review.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </p>
                </div>
              </div>
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
          ))
        )}
      </div>
    </div>
  );
}
