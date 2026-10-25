'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import AdminLayout from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowLeft, Upload, X, AlertCircle } from 'lucide-react';

export default function NewProductPage() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [images, setImages] = useState<File[]>([]);
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [video, setVideo] = useState<File | null>(null);

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
    status: 'active',
    featured: false,
    shortDescription: '',
    fullDescription: '',
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
    }
  }, [router]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const imageFiles = files.filter(f => f.type.startsWith('image/'));

    if (images.length + imageFiles.length > 10) {
      alert('Maximum 10 images allowed.');
      return;
    }

    // Upload each image
    const uploadedUrls: string[] = [];
    for (const file of imageFiles) {
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
        alert(`Failed to upload ${file.name}`);
      }
    }

    setImages([...images, ...imageFiles]);
    setImageUrls([...imageUrls, ...uploadedUrls]);
  };

  const handleVideoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('video/')) {
        alert('Please upload a video file.');
        return;
      }

      // Validate video duration (max 1 minute)
      const videoElement = document.createElement('video');
      videoElement.preload = 'metadata';
      videoElement.src = URL.createObjectURL(file);
      videoElement.onloadedmetadata = () => {
        URL.revokeObjectURL(videoElement.src);
        if (videoElement.duration > 60) {
          alert('Video must be maximum 1 minute long.');
          return;
        }
        setVideo(file);
      };
    }
  };

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
    setImageUrls(imageUrls.filter((_, i) => i !== index));
  };

  const removeVideo = () => {
    setVideo(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate uploads
    if (images.length < 2) {
      alert('Minimum 2 images required.');
      return;
    }

    if (images.length > 5) {
      alert('Maximum 5 images allowed.');
      return;
    }

    if (!video) {
      alert('One video is required.');
      return;
    }

    setIsSubmitting(true);

    try {
      // Check if images are uploaded
      if (imageUrls.length === 0) {
        alert('Please upload at least 2 images before submitting.');
        setIsSubmitting(false);
        return;
      }

      // Upload video
      const videoFormData = new FormData();
      videoFormData.append('file', video);
      videoFormData.append('type', 'videos');

      const videoResponse = await fetch('/api/upload', {
        method: 'POST',
        body: videoFormData
      });

      if (!videoResponse.ok) {
        const errorData = await videoResponse.json();
        alert(`Failed to upload video: ${errorData.error || 'Unknown error'}`);
        setIsSubmitting(false);
        return;
      }

      const videoData = await videoResponse.json();

      // Use already uploaded image URLs
      const finalImageUrls = imageUrls;

      // Create product with uploaded files
      let parsedSpecifications = {};
      try {
        parsedSpecifications = formData.specifications ? JSON.parse(formData.specifications) : {};
      } catch (error) {
        alert('Invalid JSON format in Specifications field. Please ensure it is valid JSON (e.g., {"key": "value"}). Leave empty if not needed.');
        setIsSubmitting(false);
        return;
      }

      // Auto-generate SKU if empty
      const autoSku = formData.sku || `SKU-${Date.now()}`;

      // Auto-generate slug if empty
      const autoSlug = formData.slug || formData.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');

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
        images: {
          main: finalImageUrls[0],
          gallery1: finalImageUrls[1] || finalImageUrls[0],
          gallery2: finalImageUrls[2] || finalImageUrls[0],
          gallery3: finalImageUrls[3] || finalImageUrls[0],
          gallery4: finalImageUrls[4] || finalImageUrls[0],
          gallery5: finalImageUrls[5] || finalImageUrls[0]
        },
        video: videoData.url,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      const response = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productData)
      });

      if (response.ok) {
        alert('Product added successfully!');
        router.push('/admin/products');
      } else {
        const errorData = await response.json();
        alert(`Failed to add product: ${errorData.error || 'Unknown error'}`);
      }
    } catch (error: any) {
      console.error('Error adding product:', error);
      alert(`Failed to add product: ${error.message || 'Unknown error'}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isAuthenticated) {
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
              Add <span className="font-semibold text-[#C7CBD0]">New Product</span>
            </h1>
            <p className="text-[#A6A6A6]">
              Create a new product for your catalog.
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

            {/* Image Upload */}
            <div className="space-y-4 pt-4 border-t border-[#292929]">
              <h2 className="text-lg font-semibold text-[#F5F5F5]">Product Images</h2>
              <p className="text-sm text-[#A6A6A6]">
                Upload minimum 3 images (maximum 10) showing different angles of the watch.
              </p>

              <div className="bg-[#151515] rounded-xl p-6 border-2 border-dashed border-[#292929]">
                <input
                  type="file"
                  id="image-upload"
                  multiple
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
                <label
                  htmlFor="image-upload"
                  className="flex flex-col items-center justify-center cursor-pointer"
                >
                  <Upload className="w-12 h-12 text-[#C7CBD0] mb-4" />
                  <p className="text-[#F5F5F5] mb-2">Click to upload images</p>
                  <p className="text-sm text-[#A6A6A6]">
                    JPG, PNG (max 10 images, minimum 3 required)
                  </p>
                </label>
              </div>

              {images.length > 0 && (
                <div className="space-y-3">
                  <p className="text-sm font-medium text-[#F5F5F5]">
                    Uploaded Images ({images.length}/10)
                  </p>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {images.map((file, index) => (
                      <div
                        key={index}
                        className="relative bg-[#151515] rounded-lg overflow-hidden aspect-square"
                      >
                        <img
                          src={URL.createObjectURL(file)}
                          alt={`Upload ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute top-2 right-2 p-1 bg-[#050505]/80 rounded-full hover:bg-[#E50920] transition-colors"
                        >
                          <X className="w-4 h-4 text-white" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Video Upload */}
            <div className="space-y-4 pt-4 border-t border-[#292929]">
              <h2 className="text-lg font-semibold text-[#F5F5F5]">Product Video</h2>
              <p className="text-sm text-[#A6A6A6]">
                Upload a video showing the watch (maximum 1 minute).
              </p>

              <div className="bg-[#151515] rounded-xl p-6 border-2 border-dashed border-[#292929]">
                <input
                  type="file"
                  id="video-upload"
                  accept="video/*"
                  onChange={handleVideoUpload}
                  className="hidden"
                />
                <label
                  htmlFor="video-upload"
                  className="flex flex-col items-center justify-center cursor-pointer"
                >
                  <Upload className="w-12 h-12 text-[#C7CBD0] mb-4" />
                  <p className="text-[#F5F5F5] mb-2">Click to upload video</p>
                  <p className="text-sm text-[#A6A6A6]">
                    MP4, WebM (maximum 1 minute)
                  </p>
                </label>
              </div>

              {video && (
                <div className="bg-[#151515] rounded-lg p-4 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-16 h-16 bg-[#050505] rounded flex items-center justify-center">
                        <svg className="w-8 h-8 text-[#C7CBD0]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-sm text-[#F5F5F5]">{video.name}</p>
                        <p className="text-xs text-[#A6A6A6]">
                          {(video.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={removeVideo}
                      className="p-2 text-[#A6A6A6] hover:text-[#E50920] transition-colors"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                  <video
                    src={URL.createObjectURL(video)}
                    muted
                    loop
                    className="w-full max-w-sm rounded-lg"
                  />
                </div>
              )}
            </div>

            {/* Note */}
            <div className="bg-[#151515] rounded-lg p-4 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-[#E50920] flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm text-[#F5F5F5] font-medium mb-1">Note</p>
                <p className="text-sm text-[#A6A6A6]">
                  Minimum 2 images and maximum 5 images, plus 1 video are required. Files will be uploaded to the server 
                  and stored in the public/uploads folder. Data is stored in JSON files in the data folder.
                </p>
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
                {isSubmitting ? 'Adding...' : 'Add Product'}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
}
