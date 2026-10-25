'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Heart, ShoppingCart, Check } from 'lucide-react';
import { Product } from '@/types';
import { formatPrice } from '@/lib/utils';
import { motion } from 'framer-motion';
import { useCart } from '@/lib/cart-context';
import { useWishlist } from '@/lib/wishlist-context';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();

  const discountPercentage = product.salePrice
    ? Math.round(((product.price - product.salePrice) / product.price) * 100)
    : 0;

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    if (product.availability === 'out-of-stock') return;

    const selectedColor = product.colors && product.colors.length > 0 ? product.colors[0] : undefined;
    const selectedStrap = product.strapTypes && product.strapTypes.length > 0 ? product.strapTypes[0] : undefined;

    addToCart(product, 1, selectedColor, selectedStrap);
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
    }
  };

  return (
    <Link href={`/products/${product.slug}`}>
      <motion.div
        className="group relative bg-[#151515] rounded-xl overflow-hidden cursor-pointer"
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
        whileHover={{ y: -4 }}
        transition={{ duration: 0.2 }}
      >
        {/* Product Image */}
        <div className="relative aspect-[3/4] overflow-hidden bg-[#101010]">
          {product.images.main ? (
            <Image
              src={product.images.main}
              alt={product.name}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-[#A6A6A6]">
              No image
            </div>
          )}

          {/* Sale Badge */}
          {product.salePrice && (
            <div className="absolute top-2 left-2 bg-[#E50920] text-white text-[10px] font-semibold px-1.5 py-0.5 rounded">
              -{discountPercentage}%
            </div>
          )}

          {/* Wishlist Button */}
          <button
            className={`absolute top-2 right-2 w-8 h-8 bg-[#050505]/80 backdrop-blur-sm rounded-full flex items-center justify-center transition-colors opacity-0 group-hover:opacity-100 ${
              isInWishlist(product.id) ? 'text-[#E50920]' : 'text-[#A6A6A6] hover:text-[#E50920]'
            }`}
            onClick={handleWishlistToggle}
            aria-label={isInWishlist(product.id) ? 'Remove from wishlist' : 'Add to wishlist'}
          >
            <Heart className={`w-4 h-4 ${isInWishlist(product.id) ? 'fill-current' : ''}`} />
          </button>

          {/* Quick Add Button */}
          <button
            className={`absolute bottom-2 right-2 w-8 h-8 rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity ${
              addedToCart ? 'bg-green-500' : 'bg-[#E50920]'
            }`}
            onClick={handleQuickAdd}
            disabled={product.availability === 'out-of-stock'}
            aria-label="Add to cart"
          >
            {addedToCart ? <Check className="w-4 h-4" /> : <ShoppingCart className="w-4 h-4" />}
          </button>
        </div>

        {/* Product Info */}
        <div className="p-2 space-y-1">
          <h3 className="text-xs font-medium text-[#F5F5F5] line-clamp-2 group-hover:text-[#C7CBD0] transition-colors h-8">
            {product.name}
          </h3>

          <div className="flex items-center gap-1">
            {product.salePrice ? (
              <>
                <span className="text-xs font-semibold text-[#E50920]">
                  {formatPrice(product.salePrice)}
                </span>
                <span className="text-[10px] text-[#A6A6A6] line-through">
                  {formatPrice(product.price)}
                </span>
              </>
            ) : (
              <span className="text-xs font-semibold text-[#F5F5F5]">
                {formatPrice(product.price)}
              </span>
            )}
          </div>

          {/* Availability */}
          <div className="flex items-center gap-1">
            <span
              className={`w-1 h-1 rounded-full ${
                product.availability === 'in-stock'
                  ? 'bg-green-500'
                  : product.availability === 'low-stock'
                  ? 'bg-yellow-500'
                  : 'bg-red-500'
              }`}
            />
            <span className="text-[9px] text-[#A6A6A6] capitalize">
              {product.availability === 'in-stock'
                ? 'In Stock'
                : product.availability === 'low-stock'
                ? 'Low Stock'
                : 'Out of Stock'}
            </span>
          </div>
        </div>
      </motion.div>
    </Link>
  );
}
