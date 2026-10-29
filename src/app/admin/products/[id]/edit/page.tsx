'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import AdminLayout from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowLeft, Upload, X } from 'lucide-react';
import { Suspense } from 'react';

function EditProductContent() {
  const router = useRouter();
  const params = useParams();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [product, setProduct] = useState<any>(null);
  const [images, setImages] = useState<File[]>([]);
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [video, setVideo] = useState<File | null>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    sku: '',
    slug: '',
    category: 'mens',
    brand: '',
    price: '',
    salePrice: '',
    stockQuantity: '',
    availability: 'in-stock',
    shortDescription: '',
    fullDescription: '',
    status: 'active',
    featured: false,
    colors: '',
    strapTypes: '',
    specifications: '',
    shippingInfo: '',
    returnInfo: '',
    careInfo: ''
  });

  useEffect(() => {
    const session = localStorage.getItem('admin-session');
    if (!session) {
      router.push('/admin/login');
    } else {
      setIsAuthenticated(true);
      
      // Load product data from API
      fetchProduct();
    }
  }, [router, params]);

  const fetchProduct = async () => {
    try {
      const { id } = await params;
      const response = await fetch(`/api/products/${id}`);
      const data = await response.json();
      if (data) {
        setProduct(data);
        // Migrate premium category to antique
        const category = data.category === 'premium' ? 'antique' : data.category;
        setFormData({
          name: data.name || '',
          sku: data.sku || '',
          slug: data.slug || '',
          category: category,
          brand: data.brand || '',
          price: (data.price || 0).toString(),
          salePrice: (data.salePrice || 0).toString(),
          stockQuantity: (data.stockQuantity || 0).toString(),
          availability: data.availability || 'in-stock',
          shortDescription: data.shortDescription || '',
          fullDescription: data.fullDescription || '',
          status: data.status || 'active',
          featured: data.featured || false,
          colors: Array.isArray(data.colors) ? data.colors.join(', ') : (data.colors || ''),
          strapTypes: Array.isArray(data.strapTypes) ? data.strapTypes.join(', ') : (data.strapTypes || ''),
          specifications: JSON.stringify(data.specifications || {}),
          shippingInfo: data.shippingInfo || '',
          returnInfo: data.returnInfo || '',
          careInfo: data.careInfo || ''
        });
        
        // Set existing image URLs
        if (data.images) {
          const urls = [
            data.images.main,
            data.images.gallery1,
            data.images.gallery2,
            data.images.gallery3,
            data.images.gallery4,
            data.images.gallery5
          ].filter(url => url && url !== '');
          setImageUrls(urls);
        }
        
        // Set existing video URL
        if (data.video) {
          setVideoUrl(data.video);
        }
      } else {
        router.push('/admin/products');
      }
    } catch (error) {
      console.error('Failed to fetch product:', error);
      router.push('/admin/products');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Auto-generate SKU if empty
      const autoSku = formData.sku || `SKU-${Date.now()}`;

      // Auto-generate slug if empty
      const autoSlug = formData.slug || formData.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');

      // Upload new images if any
      let finalImageUrls = imageUrls;
      if (images.length > 0) {
        const uploadedUrls: string[] = [];
        for (const image of images) {
          const formData = new FormData();
          formData.append('file', image);
          formData.append('type', 'images');

          try {
            const response = await fetch('/api/upload', {
              method: 'POST',
              body: formData
            });
            const data = await response.json();
            uploadedUrls.push(data.url);
          } catch (error) {
            console.error('Failed to upload image:', error);
          }
        }
        finalImageUrls = uploadedUrls;
      }

      // Upload new video if any
      let finalVideoUrl = videoUrl;
      if (video) {
        const videoFormData = new FormData();
        videoFormData.append('file', video);
        videoFormData.append('type', 'videos');

        try {
          const videoResponse = await fetch('/api/upload', {
            method: 'POST',
            body: videoFormData
          });
          const videoData = await videoResponse.json();
          finalVideoUrl = videoData.url;
        } catch (error) {
          console.error('Failed to upload video:', error);
        }
      }

      // Parse specifications
      let parsedSpecifications = {};
      try {
        parsedSpecifications = formData.specifications ? JSON.parse(formData.specifications) : {};
      } catch (error) {
        alert('Invalid JSON format in Specifications field. Please ensure it is valid JSON (e.g., {"key": "value"}). Leave empty if not needed.');
        setIsSubmitting(false);
        return;
      }

      const productData = {
        ...formData,
        sku: autoSku,
        slug: autoSlug,
        price: parseFloat(formData.price),
        salePrice: formData.salePrice ? parseFloat(formData.salePrice) : null,
        stockQuantity: parseInt(formData.stockQuantity),
        colors: formData.colors.split(',').map(c => c.trim()),
        strapTypes: formData.strapTypes ? formData.strapTypes.split(',').map(c => c.trim()) : [],
        specifications: parsedSpecifications,
        featured: formData.featured,
        brand: formData.brand,
        images: finalImageUrls.length > 0 ? {
          main: finalImageUrls[0],
          gallery1: finalImageUrls[1] || finalImageUrls[0],
          gallery2: finalImageUrls[2] || finalImageUrls[0],
          gallery3: finalImageUrls[3] || finalImageUrls[0],
          gallery4: finalImageUrls[4] || finalImageUrls[0],
          gallery5: finalImageUrls[5] || finalImageUrls[0]
        } : product.images,
        video: finalVideoUrl || product.video,
        updatedAt: new Date().toISOString()
      };

      const { id } = await params;
      const response = await fetch(`/api/products/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productData)
      });

      if (response.ok) {
        alert('Product updated successfully!');
        router.push('/admin/products');
      } else {
        alert('Failed to update product');
      }
    } catch (error) {
      alert('Failed to update product');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 5) {
      alert('Maximum 5 images allowed');
      return;
    }
    setImages(files);

    // Upload images immediately
    const uploadedUrls: string[] = [];
    for (const file of files) {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('type', 'images');

      try {
        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData
        });
        const data = await response.json();
        uploadedUrls.push(data.url);
      } catch (error) {
        console.error('Failed to upload image:', error);
      }
    }
    setImageUrls(uploadedUrls);
  };

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
    setImageUrls(imageUrls.filter((_, i) => i !== index));
  };

  const handleVideoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setVideo(file);

      const formData = new FormData();
      formData.append('file', file);
      formData.append('type', 'videos');

      try {
        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData
        });
        const data = await response.json();
        setVideoUrl(data.url);
      } catch (error) {
        console.error('Failed to upload video:', error);
      }
    }
  };

  const removeVideo = () => {
    setVideo(null);
    setVideoUrl(null);
  };

  if (!isAuthenticated || !product) {
    return null;
  }

  return (
    <AdminLayout>
      <div className="p-6 lg:p-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.push('/admin/products')}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-3xl font-light text-[#F5F5F5] mb-2">
              Edit <span className="font-semibold text-[#C7CBD0]">Product</span>
            </h1>
            <p className="text-[#A6A6A6]">
              Update product information for {product.name}.
            </p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="max-w-3xl">
          <div className="bg-[#101010] rounded-xl p-6 border border-[#292929] space-y-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-[#F5F5F5]">Basic Information</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-[#A6A6A6] mb-2">
                    Product Name *
                  </label>
                  <Input
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Enter product name"
                  />
                </div>

                <div>
                  <label className="block text-sm text-[#A6A6A6] mb-2">
                    SKU (Optional)
                  </label>
                  <Input
                    value={formData.sku}
                    onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                    placeholder="Enter SKU (e.g., ROLX-SUB-001)"
                  />
                </div>

                <div>
                  <label className="block text-sm text-[#A6A6A6] mb-2">
                    Slug (Optional)
                  </label>
                  <Input
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    placeholder="product-slug (auto-generated if empty)"
                  />
                </div>

                <div>
                  <label className="block text-sm text-[#A6A6A6] mb-2">
                    Category *
                  </label>
                  <select
                    required
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-4 py-2.5 bg-[#151515] border border-[#292929] rounded-lg text-[#F5F5F5] focus:outline-none focus:ring-2 focus:ring-[#E50920] focus:border-transparent"
                  >
                    <option value="mens">Men's Watches</option>
                    <option value="womens">Women's Watches</option>
                    <option value="antique">Antique Collection</option>
                    <option value="gemstone">Gemstone Collection</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm text-[#A6A6A6] mb-2">
                    Brand *
                  </label>
                  <select
                    required
                    value={formData.brand}
                    onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                    className="w-full px-4 py-2.5 bg-[#151515] border border-[#292929] rounded-lg text-[#F5F5F5] focus:outline-none focus:ring-2 focus:ring-[#E50920] focus:border-transparent"
                  >
                    <option value="">Select Brand</option>
                    <option value="Rolex">Rolex</option>
                    <option value="Rado">Rado</option>
                    <option value="Tissot">Tissot</option>
                    <option value="Omega">Omega</option>
                    <option value="Cartier">Cartier</option>
                    <option value="Seiko">Seiko</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm text-[#A6A6A6] mb-2">
                    Availability *
                  </label>
                  <select
                    required
                    value={formData.availability}
                    onChange={(e) => setFormData({ ...formData, availability: e.target.value })}
                    className="w-full px-4 py-2.5 bg-[#151515] border border-[#292929] rounded-lg text-[#F5F5F5] focus:outline-none focus:ring-2 focus:ring-[#E50920] focus:border-transparent"
                  >
                    <option value="in-stock">In Stock</option>
                    <option value="low-stock">Low Stock</option>
                    <option value="out-of-stock">Out of Stock</option>
                  </select>
                </div>

                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="featured"
                    checked={formData.featured}
                    onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                    className="w-5 h-5 rounded border-[#292929] bg-[#151515] text-[#E50920] focus:ring-2 focus:ring-[#E50920] focus:ring-offset-0 focus:ring-offset-[#050505]"
                  />
                  <label htmlFor="featured" className="text-sm text-[#F5F5F5]">
                    Mark as Featured Product
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-sm text-[#A6A6A6] mb-2">
                  Short Description *
                </label>
                <Input
                  required
                  value={formData.shortDescription}
                  onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
                  placeholder="Brief product description"
                />
              </div>

              <div>
                <label className="block text-sm text-[#A6A6A6] mb-2">
                  Full Description *
                </label>
                <textarea
                  required
                  rows={4}
                  value={formData.fullDescription}
                  onChange={(e) => setFormData({ ...formData, fullDescription: e.target.value })}
                  placeholder="Detailed product description"
                  className="w-full px-4 py-2.5 bg-[#151515] border border-[#292929] rounded-lg text-[#F5F5F5] placeholder-[#555555] focus:outline-none focus:ring-2 focus:ring-[#E50920] focus:border-transparent resize-none"
                />
              </div>
            </div>

            {/* Pricing */}
            <div className="space-y-4 pt-4 border-t border-[#292929]">
              <h2 className="text-lg font-semibold text-[#F5F5F5]">Pricing</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-[#A6A6A6] mb-2">
                    Price (PKR) *
                  </label>
                  <Input
                    required
                    type="number"
                    min="0"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    placeholder="Enter price"
                  />
                </div>

                <div>
                  <label className="block text-sm text-[#A6A6A6] mb-2">
                    Sale Price (PKR) (Optional)
                  </label>
                  <Input
                    type="number"
                    min="0"
                    value={formData.salePrice}
                    onChange={(e) => setFormData({ ...formData, salePrice: e.target.value })}
                    placeholder="Enter sale price"
                  />
                </div>

                <div>
                  <label className="block text-sm text-[#A6A6A6] mb-2">
                    Stock Quantity *
                  </label>
                  <Input
                    required
                    type="number"
                    min="0"
                    value={formData.stockQuantity}
                    onChange={(e) => setFormData({ ...formData, stockQuantity: e.target.value })}
                    placeholder="Enter stock quantity"
                  />
                </div>
              </div>
            </div>

            {/* Media Upload */}
            <div className="space-y-4 pt-4 border-t border-[#292929]">
              <h2 className="text-lg font-semibold text-[#F5F5F5]">Media Upload</h2>
              
              <div>
                <label className="block text-sm text-[#A6A6A6] mb-2">
                  Product Images (2-5 images)
                </label>
                <div className="border-2 border-dashed border-[#292929] rounded-lg p-8 text-center">
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    id="image-upload"
                  />
                  <label
                    htmlFor="image-upload"
                    className="cursor-pointer flex flex-col items-center gap-2"
                  >
                    <Upload className="w-12 h-12 text-[#A6A6A6]" />
                    <span className="text-[#A6A6A6]">Click to upload images</span>
                    <span className="text-xs text-[#555555]">Max 5 images</span>
                  </label>
                </div>
              </div>

              {imageUrls.length > 0 && (
                <div className="grid grid-cols-5 gap-2">
                  {imageUrls.map((url, index) => (
                    <div key={index} className="relative aspect-square bg-[#151515] rounded-lg overflow-hidden">
                      <img
                        src={url}
                        alt={`Upload ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute top-1 right-1 w-6 h-6 bg-[#E50920] rounded-full flex items-center justify-center text-white"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <div>
                <label className="block text-sm text-[#A6A6A6] mb-2">
                  Product Video
                </label>
                <div className="border-2 border-dashed border-[#292929] rounded-lg p-8 text-center">
                  <input
                    type="file"
                    accept="video/*"
                    onChange={handleVideoUpload}
                    className="hidden"
                    id="video-upload"
                  />
                  <label
                    htmlFor="video-upload"
                    className="cursor-pointer flex flex-col items-center gap-2"
                  >
                    <Upload className="w-12 h-12 text-[#A6A6A6]" />
                    <span className="text-[#A6A6A6]">Click to upload video</span>
                  </label>
                </div>
              </div>

              {videoUrl && (
                <div className="relative">
                  <video
                    src={videoUrl}
                    muted
                    loop
                    className="w-full max-w-sm rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={removeVideo}
                    className="absolute top-2 right-2 w-8 h-8 bg-[#E50920] rounded-full flex items-center justify-center text-white"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}

              <div className="bg-[#151515] rounded-lg p-4 flex items-start gap-3">
                <Upload className="w-5 h-5 text-[#E50920] flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm text-[#F5F5F5] font-medium mb-1">Note</p>
                  <p className="text-sm text-[#A6A6A6]">
                    Leave blank to keep existing images/video. Upload new files to replace them.
                  </p>
                </div>
              </div>
            </div>

            {/* Additional Fields */}
            <div className="space-y-4 pt-4 border-t border-[#292929]">
              <h2 className="text-lg font-semibold text-[#F5F5F5]">Additional Details</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-[#A6A6A6] mb-2">
                    Colors (comma-separated)
                  </label>
                  <Input
                    value={formData.colors}
                    onChange={(e) => setFormData({ ...formData, colors: e.target.value })}
                    placeholder="Black, Silver, Blue"
                  />
                </div>

                <div>
                  <label className="block text-sm text-[#A6A6A6] mb-2">
                    Strap Types (comma-separated)
                  </label>
                  <Input
                    value={formData.strapTypes}
                    onChange={(e) => setFormData({ ...formData, strapTypes: e.target.value })}
                    placeholder="Leather, Steel"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm text-[#A6A6A6] mb-2">
                  Specifications (JSON format)
                </label>
                <textarea
                  rows={3}
                  value={formData.specifications}
                  onChange={(e) => setFormData({ ...formData, specifications: e.target.value })}
                  placeholder='{"caseMaterial": "316L Stainless Steel", "caseDiameter": "42mm"}'
                  className="w-full px-4 py-2.5 bg-[#151515] border border-[#292929] rounded-lg text-[#F5F5F5] placeholder-[#555555] focus:outline-none focus:ring-2 focus:ring-[#E50920] focus:border-transparent resize-none"
                />
              </div>

              <div>
                <label className="block text-sm text-[#A6A6A6] mb-2">
                  Shipping Info
                </label>
                <Input
                  value={formData.shippingInfo}
                  onChange={(e) => setFormData({ ...formData, shippingInfo: e.target.value })}
                  placeholder="Shipping information"
                />
              </div>

              <div>
                <label className="block text-sm text-[#A6A6A6] mb-2">
                  Return Info
                </label>
                <Input
                  value={formData.returnInfo}
                  onChange={(e) => setFormData({ ...formData, returnInfo: e.target.value })}
                  placeholder="Return policy"
                />
              </div>

              <div>
                <label className="block text-sm text-[#A6A6A6] mb-2">
                  Care Info
                </label>
                <Input
                  value={formData.careInfo}
                  onChange={(e) => setFormData({ ...formData, careInfo: e.target.value })}
                  placeholder="Care instructions"
                />
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-4 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push('/admin/products')}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button type="submit" className="flex-1" disabled={isSubmitting}>
                {isSubmitting ? 'Updating...' : 'Update Product'}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
}

export default function EditProductPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-[#050505] text-[#A6A6A6]">Loading...</div>}>
      <EditProductContent />
    </Suspense>
  );
}
