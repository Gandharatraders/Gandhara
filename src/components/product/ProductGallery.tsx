'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Product } from '@/types';

interface ProductGalleryProps {
  product: Product;
  selectedColor?: string;
}

export default function ProductGallery({ product, selectedColor }: ProductGalleryProps) {
  const [selectedImage, setSelectedImage] = useState(0);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);

  // Get images based on selected color
  const getImagesForColor = (color: string | undefined) => {
    if (!color || !product.colorImages) {
      const allImages = [
        product.images.main,
        product.images.gallery1,
        product.images.gallery2,
        product.images.gallery3,
        product.images.gallery4,
        product.images.gallery5,
      ];
      
      // Filter out undefined/null/empty images and duplicates
      const validImages = allImages.filter(img => img && img !== '');
      const uniqueImages = Array.from(new Set(validImages));
      
      return uniqueImages;
    }
    
    const colorData = product.colorImages[color];
    if (colorData && colorData.length > 0) {
      const validImages = colorData.filter(img => img && img !== '');
      const uniqueImages = Array.from(new Set(validImages));
      return uniqueImages;
    }
    
    // Fallback to default images
    const allImages = [
      product.images.main,
      product.images.gallery1,
      product.images.gallery2,
      product.images.gallery3,
      product.images.gallery4,
      product.images.gallery5,
    ];
    
    const validImages = allImages.filter(img => img && img !== '');
    const uniqueImages = Array.from(new Set(validImages));
    
    return uniqueImages;
  };

  const allImages = getImagesForColor(selectedColor);
  
  // Ensure minimum 3 and maximum 10 images
  const images = allImages.slice(0, 10);

  const hasVideo = product.video && product.video !== '';

  // Reset selected image when color changes
  useEffect(() => {
    setSelectedImage(0);
    setIsVideoPlaying(false);
  }, [selectedColor]);

  return (
    <div className="space-y-4 w-full">
      {/* Main Image / Video */}
      <div className="relative aspect-[16/9] w-full bg-[#101010] rounded-xl overflow-hidden">
        {selectedImage === 0 && product.video && isVideoPlaying ? (
          <video
            src={product.video}
            autoPlay
            muted
            loop
            className="w-full h-full object-contain"
            onError={() => setIsVideoPlaying(false)}
          />
        ) : images[selectedImage] ? (
          <Image
            src={images[selectedImage]}
            alt={`${product.name} - View ${selectedImage + 1}`}
            fill
            className="object-contain"
            priority
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <p className="text-[#A6A6A6]">No image available</p>
          </div>
        )}

        {/* Video toggle button */}
        {selectedImage === 0 && hasVideo && !isVideoPlaying && (
          <button
            onClick={() => setIsVideoPlaying(true)}
            className="absolute inset-0 flex items-center justify-center bg-black/50 hover:bg-black/60 transition-colors group"
            aria-label="Play product video"
          >
            <div className="w-16 h-16 bg-[#E50920] rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
              <svg className="w-8 h-8 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>
          </button>
        )}
      </div>

      {/* Text below image */}
      <div className="text-center py-4">
        <p className="text-sm text-[#A6A6A6]">this text should be shown below the image</p>
      </div>

      {/* Thumbnails */}
      <div className="grid grid-cols-6 gap-2">
        {images.map((image, index) => (
          image && (
            <button
              key={index}
              onClick={() => {
                setSelectedImage(index);
                setIsVideoPlaying(false);
              }}
              className={`relative aspect-[16/9] bg-[#101010] rounded-lg overflow-hidden border-2 transition-colors ${
                selectedImage === index
                  ? 'border-[#E50920]'
                  : 'border-transparent hover:border-[#292929]'
              }`}
              aria-label={`View image ${index + 1}`}
            >
              <Image
                src={image}
                alt={`${product.name} thumbnail ${index + 1}`}
                fill
                className="object-cover"
              />
            </button>
          )
        ))}

        {/* Video thumbnail */}
        {hasVideo && (
          <button
            onClick={() => {
              setSelectedImage(0);
              setIsVideoPlaying(true);
            }}
            className={`relative aspect-[16/9] bg-[#101010] rounded-lg overflow-hidden border-2 transition-colors ${
              selectedImage === 0 && isVideoPlaying
                ? 'border-[#E50920]'
                : 'border-transparent hover:border-[#292929]'
            }`}
            aria-label="Watch product video"
          >
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-8 h-8 bg-[#E50920]/80 rounded-full flex items-center justify-center">
                <svg className="w-4 h-4 text-white ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </div>
            </div>
          </button>
        )}
      </div>

      {/* Show warning if less than 3 images */}
      {images.length < 3 && (
        <div className="text-center py-2">
          <p className="text-xs text-yellow-500">
            Only {images.length} image{images.length !== 1 ? 's' : ''} available. Please upload at least 3 images.
          </p>
        </div>
      )}
    </div>
  );
}
