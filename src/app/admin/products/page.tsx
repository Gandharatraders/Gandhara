'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import AdminLayout from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Plus, Search, Edit, Trash2, Filter } from 'lucide-react';
import { Input } from '@/components/ui/input';

export default function AdminProductsPage() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const session = localStorage.getItem('admin-session');
    if (!session) {
      router.push('/admin/login');
    } else {
      setIsAuthenticated(true);
      fetchProducts();
    }
  }, [router]);

  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/products');
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error('Failed to fetch products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (productId: string) => {
    if (!confirm('Are you sure you want to delete this product? This action cannot be undone.')) {
      return;
    }

    setDeletingId(productId);

    try {
      const response = await fetch(`/api/products/${productId}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        await fetchProducts();
        alert('Product deleted successfully!');
      } else {
        alert('Failed to delete product');
      }
    } catch (error) {
      alert('Failed to delete product');
    } finally {
      setDeletingId(null);
    }
  };

  if (!isAuthenticated) {
    return null;
  }

  const filteredProducts = products.filter((product) =>
    (product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.sku.toLowerCase().includes(searchQuery.toLowerCase())) &&
    (categoryFilter === 'all' || product.category === categoryFilter)
  );

  return (
    <AdminLayout>
      <div className="p-6 lg:p-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-light text-[#F5F5F5] mb-2">
              Products <span className="font-semibold text-[#C7CBD0]">Management</span>
            </h1>
            <p className="text-[#A6A6A6]">
              Manage your product catalog, inventory, and pricing.
            </p>
          </div>
          <Button onClick={() => router.push('/admin/products/new')}>
            <Plus className="w-4 h-4 mr-2" />
            Add Product
          </Button>
        </div>

        {/* Search and Filter */}
        <div className="bg-[#101010] rounded-xl p-4 border border-[#292929] mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#A6A6A6]" />
              <Input
                type="text"
                placeholder="Search products by name or SKU..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-4 py-2.5 bg-[#151515] border border-[#292929] rounded-lg text-[#F5F5F5] focus:outline-none focus:ring-2 focus:ring-[#E50920] focus:border-transparent"
            >
              <option value="all">All Categories</option>
              <option value="mens">Men's Watches</option>
              <option value="womens">Women's Watches</option>
              <option value="antique">Antique Collection</option>
              <option value="gemstone">Gemstone Collection</option>
            </select>
          </div>
        </div>

        {/* Products Table */}
        <div className="bg-[#101010] rounded-xl border border-[#292929] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#292929] bg-[#151515]">
                  <th className="text-left py-4 px-4 text-sm font-semibold text-[#A6A6A6]">
                    Product
                  </th>
                  <th className="text-left py-4 px-4 text-sm font-semibold text-[#A6A6A6]">
                    SKU
                  </th>
                  <th className="text-left py-4 px-4 text-sm font-semibold text-[#A6A6A6]">
                    Category
                  </th>
                  <th className="text-left py-4 px-4 text-sm font-semibold text-[#A6A6A6]">
                    Price
                  </th>
                  <th className="text-left py-4 px-4 text-sm font-semibold text-[#A6A6A6]">
                    Stock
                  </th>
                  <th className="text-left py-4 px-4 text-sm font-semibold text-[#A6A6A6]">
                    Status
                  </th>
                  <th className="text-right py-4 px-4 text-sm font-semibold text-[#A6A6A6]">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.length > 0 ? (
                  filteredProducts.map((product) => (
                    <tr key={product.id} className="border-b border-[#292929] hover:bg-[#151515]">
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-16 h-16 bg-[#050505] rounded-lg overflow-hidden flex-shrink-0">
                            <img
                              src={product.images?.main || '/placeholder.jpg'}
                              alt={product.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div>
                            <p className="text-[#F5F5F5] font-medium">{product.name}</p>
                            <p className="text-sm text-[#A6A6A6] line-clamp-1">
                              {product.shortDescription}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-[#A6A6A6]">{product.sku}</td>
                      <td className="py-4 px-4 text-[#A6A6A6] capitalize">{product.category}</td>
                      <td className="py-4 px-4 text-[#F5F5F5]">
                        {product.salePrice ? (
                          <div>
                            <span className="text-[#E50920] font-semibold">
                              PKR {product.salePrice.toLocaleString()}
                            </span>
                            <span className="text-sm text-[#A6A6A6] line-through ml-2">
                              PKR {product.price.toLocaleString()}
                            </span>
                          </div>
                        ) : (
                          <span>PKR {product.price.toLocaleString()}</span>
                        )}
                      </td>
                      <td className="py-4 px-4 text-[#A6A6A6]">{product.stockQuantity}</td>
                      <td className="py-4 px-4">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-semibold ${
                            product.availability === 'in-stock'
                              ? 'bg-green-500/10 text-green-500'
                              : product.availability === 'low-stock'
                              ? 'bg-yellow-500/10 text-yellow-500'
                              : 'bg-red-500/10 text-red-500'
                          }`}
                        >
                          {product.availability}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => {
                              console.log('Edit clicked for product:', product.id);
                              router.push(`/admin/products/${product.id}/edit`);
                            }}
                            className="p-2 text-[#A6A6A6] hover:text-[#F5F5F5] hover:bg-[#292929] rounded-lg transition-colors cursor-pointer"
                            title="Edit"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => {
                              console.log('Delete clicked for product:', product.id);
                              handleDelete(product.id);
                            }}
                            disabled={deletingId === product.id}
                            className="p-2 text-[#A6A6A6] hover:text-[#E50920] hover:bg-[#292929] rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                            title="Delete"
                          >
                            {deletingId === product.id ? (
                              <div className="w-4 h-4 border-2 border-[#E50920] border-t-transparent rounded-full animate-spin" />
                            ) : (
                              <Trash2 className="w-4 h-4" />
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="py-12 text-center">
                      <p className="text-[#A6A6A6]">No products found</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between mt-6">
          <p className="text-sm text-[#A6A6A6]">
            Showing {filteredProducts.length} of {products.length} products
          </p>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" disabled>
              Previous
            </Button>
            <Button variant="outline" size="sm" disabled>
              Next
            </Button>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
