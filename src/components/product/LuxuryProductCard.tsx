'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Heart, ShoppingCart, Check, Crown } from 'lucide-react';
import { Product } from '@/types';
import { formatPrice } from '@/lib/utils';
import { motion } from 'framer-motion';
import { useCart } from '@/lib/cart-context';
import { useWishlist } from '@/lib/wishlist-context';

interface LuxuryProductCardProps {
  product: Product;
}

export default function LuxuryProductCard({ product }: LuxuryProductCardProps) {
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
        className="group relative bg-gradient-to-br from-[#0a0a0a] to-[#151515] rounded-2xl overflow-hidden cursor-pointer border border-[#1a1a1a] hover:border-[#C7CBD0]/30 transition-all duration-500"
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
        whileHover={{ y: -4, boxShadow: '0 20px 40px rgba(199, 203, 208, 0.1)' }}
        transition={{ duration: 0.4 }}
      >
        {/* Premium Border Glow */}
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-[#C7CBD0]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

        {/* Vertical Layout */}
        <div className="flex flex-col">
          {/* Product Image - Full Width */}
          <div className="relative w-full aspect-[4/3] overflow-hidden bg-gradient-to-b from-[#0d0d0d] to-[#050505]">
            {product.images.main ? (
              <>
                <Image
                  src={product.images.main}
                  alt={product.name}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                  priority
                />
                {/* Elegant shadow overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent opacity-60" />
              </>
            ) : (
              <div className="w-full h-full flex items-center justify-center text-[#A6A6A6]">
                <Crown className="w-12 h-12 opacity-30" />
              </div>
            )}

            {/* Sale Badge - Bottom Left */}
            {product.salePrice && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute bottom-4 left-4 z-20"
              >
                <div className="bg-gradient-to-r from-[#E50920] to-[#ff3333] text-white text-xs font-bold px-3 py-1.5 rounded-lg shadow-lg">
                  <span className="text-xs">SAVE {discountPercentage}%</span>
                </div>
              </motion.div>
            )}

            {/* Wishlist Button */}
            <button
              className={`absolute top-4 right-4 z-20 w-10 h-10 bg-[#050505]/80 backdrop-blur-md rounded-full flex items-center justify-center transition-all duration-300 border border-[#292929] hover:border-[#E50920] hover:bg-[#E50920] ${
                isInWishlist(product.id) ? 'bg-[#E50920] border-[#E50920]' : 'opacity-0 group-hover:opacity-100'
              }`}
              onClick={handleWishlistToggle}
              aria-label={isInWishlist(product.id) ? 'Remove from wishlist' : 'Add to wishlist'}
            >
              <Heart className={`w-4 h-4 ${isInWishlist(product.id) ? 'fill-current' : ''}`} />
            </button>

            {/* Quick Add Button */}
            <button
              className={`absolute bottom-4 right-4 z-20 w-10 h-10 rounded-full flex items-center justify-center text-white transition-all duration-300 shadow-lg ${
                addedToCart
                  ? 'bg-green-500 border-green-500'
                  : 'bg-[#E50920] border-[#E50920] hover:bg-[#ff3333]'
              } border opacity-0 group-hover:opacity-100`}
              onClick={handleQuickAdd}
              disabled={product.availability === 'out-of-stock'}
              aria-label="Add to cart"
            >
              {addedToCart ? <Check className="w-4 h-4" /> : <ShoppingCart className="w-4 h-4" />}
            </button>
          </div>

          {/* Product Info - Below Image */}
          <div className="w-full p-5 space-y-3 flex flex-col">
            {/* Brand */}
            {product.brand && (
              <p className="text-[10px] font-semibold tracking-[0.2em] text-[#C7CBD0] uppercase">
                {product.brand}
              </p>
            )}

            {/* Product Name */}
            <h3 className="text-sm font-semibold text-[#F5F5F5] line-clamp-2 group-hover:text-[#C7CBD0] transition-colors">
              {product.name}
            </h3>

            {/* Price */}
            <div className="flex items-center gap-2">
              {product.salePrice ? (
                <>
                  <span className="text-lg font-bold text-[#E50920]">
                    {formatPrice(product.salePrice)}
                  </span>
                  <span className="text-sm text-[#A6A6A6] line-through">
                    {formatPrice(product.price)}
                  </span>
                </>
              ) : (
                <span className="text-lg font-bold text-[#F5F5F5]">
                  {formatPrice(product.price)}
                </span>
              )}
            </div>

            {/* Stock Status */}
            <div className="flex items-center gap-2 pt-2">
              <span
                className={`w-1.5 h-1.5 rounded-full ${
                  product.availability === 'in-stock'
                    ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]'
                    : product.availability === 'low-stock'
                    ? 'bg-yellow-500 shadow-[0_0_8px_rgba(234,179,8,0.5)]'
                    : 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]'
                }`}
              />
              <span className="text-[10px] font-medium text-[#A6A6A6] uppercase tracking-wider">
                {product.availability === 'in-stock'
                  ? 'In Stock'
                  : product.availability === 'low-stock'
                  ? 'Limited'
                  : 'Sold Out'}
              </span>
            </div>
          </div>
        </div>
      </motion.div>
    </Link>
  );
}
