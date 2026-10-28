'use client';

import { useEffect, useState } from 'react';
import { notFound, useParams } from 'next/navigation';
import ProductGallery from '@/components/product/ProductGallery';
import ProductCard from '@/components/product/ProductCard';
import ProductReviews from '@/components/product/ProductReviews';
import { Button } from '@/components/ui/button';
import { getProductBySlug, getProductsByCategory } from '@/lib/data';
import { formatPrice } from '@/lib/utils';
import { useCart } from '@/lib/cart-context';
import { useRouter } from 'next/navigation';

export default function ProductContent() {
  const params = useParams();
  const slug = params.slug as string;
  const [product, setProduct] = useState<any>(null);
  const [relatedProducts, setRelatedProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();
  const router = useRouter();
  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState<string | undefined>();
  const [selectedStrap, setSelectedStrap] = useState<string | undefined>();
  const [addedToCart, setAddedToCart] = useState(false);

  useEffect(() => {
    getProductBySlug(slug).then(p => {
      if (!p) {
        notFound();
      }
      setProduct(p);
      setSelectedColor(p?.colors[0]);
      setSelectedStrap(p?.strapTypes?.[0]);
      setLoading(false);

      // Fetch related products by category
      getProductsByCategory(p.category).then(products => {
        setRelatedProducts(products.filter((prod: any) => prod.slug !== slug).slice(0, 4));
      });
    });
  }, [slug]);

  useEffect(() => {
    // Update page title
    if (product) {
      document.title = product.seoTitle || `${product.name} | Gandhara Traders Company`;
    }
  }, [product]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#050505]">
        <p className="text-[#A6A6A6]">Loading product...</p>
      </div>
    );
  }

  if (!product) {
    notFound();
  }

  const discountPercentage = product.salePrice
    ? Math.round(((product.price - product.salePrice) / product.price) * 100)
    : 0;

  const handleAddToCart = () => {
    if (product.availability === 'out-of-stock') return;
    
    addToCart(product, quantity, selectedColor, selectedStrap);
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  const handleBuyNow = () => {
    handleAddToCart();
    router.push('/checkout');
  };

  const decreaseQuantity = () => {
    if (quantity > 1) setQuantity(quantity - 1);
  };

  const increaseQuantity = () => {
    if (quantity < product.stockQuantity) setQuantity(quantity + 1);
  };

  return (
    <>
      <main className="pt-20">
        {/* Breadcrumb */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="text-sm text-[#A6A6A6]">
            <a href="/" className="hover:text-[#F5F5F5]">Home</a>
            <span className="mx-2">/</span>
            <a href={`/collections/${product.category}${product.category === 'gemstone' ? '' : '-watches'}`} className="hover:text-[#F5F5F5] capitalize">
              {product.category}'s Collection
            </a>
            <span className="mx-2">/</span>
            <span className="text-[#F5F5F5]">{product.name}</span>
          </nav>
        </div>

        {/* Product Detail */}
        <section className="py-12 bg-[#050505]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 gap-8">
              {/* Gallery */}
              <ProductGallery product={product} selectedColor={selectedColor} />

              {/* Product Info */}
              <div className="space-y-6">
                <div>
                  <p className="text-sm text-[#A6A6A6] mb-2">SKU: {product.sku}</p>
                  <h1 className="text-3xl md:text-4xl font-light text-[#F5F5F5] mb-4">
                    {product.name}
                  </h1>
                  <p className="text-[#A6A6A6]">{product.shortDescription}</p>
                </div>

                {/* Price */}
                <div className="flex items-center gap-4">
                  {product.salePrice ? (
                    <>
                      <span className="text-3xl font-semibold text-[#E50920]">
                        {formatPrice(product.salePrice)}
                      </span>
                      <span className="text-xl text-[#A6A6A6] line-through">
                        {formatPrice(product.price)}
                      </span>
                      <span className="bg-[#E50920] text-white text-sm font-semibold px-2 py-1 rounded">
                        -{discountPercentage}%
                      </span>
                    </>
                  ) : (
                    <span className="text-3xl font-semibold text-[#F5F5F5]">
                      {formatPrice(product.price)}
                    </span>
                  )}
                </div>

                {/* Availability */}
                <div className="flex items-center gap-2">
                  <span
                    className={`w-3 h-3 rounded-full ${
                      product.availability === 'in-stock'
                        ? 'bg-green-500'
                        : product.availability === 'low-stock'
                        ? 'bg-yellow-500'
                        : 'bg-red-500'
                    }`}
                  />
                  <span className="text-sm text-[#A6A6A6] capitalize">
                    {product.availability === 'in-stock'
                      ? 'In Stock'
                      : product.availability === 'low-stock'
                      ? 'Low Stock'
                      : 'Out of Stock'}
                  </span>
                  {product.stockQuantity > 0 && (
                    <span className="text-sm text-[#A6A6A6]">
                      ({product.stockQuantity} available)
                    </span>
                  )}
                </div>

                {/* Color Selection */}
                {product.colors.length > 0 && (
                  <div>
                    <h3 className="text-sm font-semibold text-[#F5F5F5] mb-3">Color</h3>
                    <div className="flex gap-2">
                      {product.colors.map((color: string) => (
                        <button
                          key={color}
                          onClick={() => setSelectedColor(color)}
                          className={`px-4 py-2 border rounded-lg text-sm transition-colors ${
                            selectedColor === color
                              ? 'border-[#E50920] text-[#E50920]'
                              : 'border-[#292929] text-[#A6A6A6] hover:border-[#C7CBD0] hover:text-[#F5F5F5]'
                          }`}
                        >
                          {color}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Strap Selection */}
                {product.strapTypes && product.strapTypes.length > 0 && (
                  <div>
                    <h3 className="text-sm font-semibold text-[#F5F5F5] mb-3">Strap Type</h3>
                    <div className="flex gap-2">
                      {product.strapTypes.map((strap: string) => (
                        <button
                          key={strap}
                          onClick={() => setSelectedStrap(strap)}
                          className={`px-4 py-2 border rounded-lg text-sm transition-colors ${
                            selectedStrap === strap
                              ? 'border-[#E50920] text-[#E50920]'
                              : 'border-[#292929] text-[#A6A6A6] hover:border-[#C7CBD0] hover:text-[#F5F5F5]'
                          }`}
                        >
                          {strap}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Quantity */}
                <div>
                  <h3 className="text-sm font-semibold text-[#F5F5F5] mb-3">Quantity</h3>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center border border-[#292929] rounded-lg">
                      <button
                        onClick={decreaseQuantity}
                        disabled={quantity <= 1}
                        className="px-4 py-2 text-[#A6A6A6] hover:text-[#F5F5F5] transition-colors disabled:opacity-50"
                      >
                        -
                      </button>
                      <span className="px-4 py-2 text-[#F5F5F5]">{quantity}</span>
                      <button
                        onClick={increaseQuantity}
                        disabled={quantity >= product.stockQuantity}
                        className="px-4 py-2 text-[#A6A6A6] hover:text-[#F5F5F5] transition-colors disabled:opacity-50"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button
                    size="lg"
                    className="flex-1"
                    onClick={handleAddToCart}
                    disabled={product.availability === 'out-of-stock'}
                  >
                    {addedToCart ? 'Added!' : 'Add to Cart'}
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    className="flex-1"
                    onClick={handleBuyNow}
                    disabled={product.availability === 'out-of-stock'}
                  >
                    Buy Now
                  </Button>
                </div>

                {/* Shipping Info */}
                <div className="border-t border-[#292929] pt-6 space-y-3">
                  <div className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-[#C7CBD0] flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                    </svg>
                    <p className="text-sm text-[#A6A6A6]">{product.shippingInfo}</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-[#C7CBD0] flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    <p className="text-sm text-[#A6A6A6]">{product.returnInfo}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Product Description */}
        <section className="py-12 bg-[#101010]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Description */}
              <div>
                <h2 className="text-2xl font-light text-[#F5F5F5] mb-6">
                  Product <span className="font-semibold text-[#C7CBD0]">Description</span>
                </h2>
                <p className="text-[#A6A6A6] leading-relaxed whitespace-pre-line">
                  {product.fullDescription}
                </p>
              </div>

              {/* Specifications */}
              {product.specifications && (
                <div>
                  <h2 className="text-2xl font-light text-[#F5F5F5] mb-6">
                    <span className="font-semibold text-[#C7CBD0]">Specifications</span>
                  </h2>
                  <dl className="space-y-3">
                    {Object.entries(product.specifications).map(([key, value]) => (
                      <div key={key} className="flex justify-between border-b border-[#292929] pb-2">
                        <dt className="text-sm text-[#A6A6A6] capitalize">
                          {key.replace(/([A-Z])/g, ' $1').trim()}
                        </dt>
                        <dd className="text-sm text-[#F5F5F5]">{String(value)}</dd>
                      </div>
                    ))}
                  </dl>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Customer Reviews */}
        <section className="py-12 bg-[#050505]">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <ProductReviews productId={product.id} />
          </div>
        </section>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <section className="py-12 bg-[#050505]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <h2 className="text-2xl font-light text-[#F5F5F5] mb-8">
                Related <span className="font-semibold text-[#C7CBD0]">Products</span>
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {relatedProducts.map((relatedProduct) => (
                  <ProductCard key={relatedProduct.id} product={relatedProduct} />
                ))}
              </div>
            </div>
          </section>
        )}
      </main>
    </>
  );
}
