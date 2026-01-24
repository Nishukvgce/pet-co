import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { useCart } from '../../contexts/CartContext';
import Header from '../../components/ui/Header';
import Breadcrumb from '../../components/ui/Breadcrumb';
import ProductImageGallery from '../product-detail-page/components/ProductImageGallery';
import ProductInfo from '../product-detail-page/components/ProductInfo';
import ProductDetails from '../product-detail-page/components/ProductDetails';
import ProductFAQ from '../product-detail-page/components/ProductFAQ';
import ProductReviews from '../product-detail-page/components/ProductReviews';
import productApi from '../../services/productApi';
import dataService from '../../services/dataService';
import apiClient from '../../services/api';
import { extractAllProductImages } from '../../lib/productImageUtils';

const ProductFullPage = () => {
  const params = useParams();
  const [searchParams] = useSearchParams();
  const productId = params?.id || searchParams?.get('id') || '1';

  const { cartItems, addToCart, addToWishlist, removeFromWishlist, isInWishlist, getCartItemCount } = useCart();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const resolveImageUrl = (candidate) => {
    if (!candidate || typeof candidate !== 'string') return '';
    if (/^(https?:)?\/\//i.test(candidate) || candidate.startsWith('data:')) return candidate;
    if (/^[a-zA-Z]:\\/.test(candidate) || candidate.startsWith('\\\\') || candidate.startsWith('/') || candidate.includes('\\')) {
      const parts = candidate.split(/\\|\//);
      candidate = parts[parts.length - 1];
    }
    if (/^[^/]+\.[a-zA-Z0-9]+$/.test(candidate)) {
      candidate = `/admin/products/images/${candidate}`;
    }
    const base = apiClient?.defaults?.baseURL || '';
    return candidate.startsWith('/') ? `${base}${candidate}` : `${base}/${candidate}`;
  };

  useEffect(() => {
    const loadProduct = async () => {
      try {
        setLoading(true);
        setError(null);
        let productData = null;
        try {
          productData = await productApi.getById(productId);
        } catch (apiError) {
          const response = await dataService.getProducts();
          const products = response?.data || [];
          productData = products.find(p => p.id === productId || p.id === parseInt(productId));
          if (!productData) throw new Error(`Product with ID ${productId} not found`);
        }

        // Normalize product data and include metadata fields
        const normalizedProduct = {
          id: productData?.id,
          name: productData?.name || productData?.title,
          shortDescription: productData?.shortDescription || (productData?.description ? productData.description.substring(0, 100) + '...' : ''),
          description: productData?.description || 'No description available.',
          images: extractAllProductImages(productData),
          variants: (() => {
            // If product has explicit variants with pricing, use them
            if (productData?.variants && Array.isArray(productData.variants) && productData.variants.length > 0) {
              return productData.variants.map((variant, index) => ({
                id: variant?.id || `variant-${index}`,
                weight: variant?.weight || variant?.size || `Option ${index + 1}`,
                size: variant?.size || variant?.weight || `Option ${index + 1}`,
                label: variant?.label || variant?.weight || variant?.size || `Option ${index + 1}`,
                price: parseFloat(variant?.price || productData?.price || 0),
                originalPrice: parseFloat(variant?.originalPrice || variant?.mrp || productData?.originalPrice || productData?.mrp || variant?.price || productData?.price || 0),
                stock: variant?.stock || productData?.stock || productData?.stockQuantity || 10,
                perUnit: variant?.perUnit || null,
                unitType: variant?.unitType || (variant?.size ? 'size' : 'weight')
              }));
            }
            
            // Check metadata for variants
            if (productData?.metadata?.variants && Array.isArray(productData.metadata.variants) && productData.metadata.variants.length > 0) {
              return productData.metadata.variants.map((variant, index) => ({
                id: variant?.id || `variant-${index}`,
                weight: variant?.weight || variant?.size || `Option ${index + 1}`,
                size: variant?.size || variant?.weight || `Option ${index + 1}`,
                label: variant?.label || variant?.weight || variant?.size || `Option ${index + 1}`,
                price: parseFloat(variant?.price || productData?.price || 0),
                originalPrice: parseFloat(variant?.originalPrice || variant?.mrp || productData?.originalPrice || productData?.mrp || variant?.price || productData?.price || 0),
                stock: variant?.stock || productData?.stock || productData?.stockQuantity || 10,
                perUnit: variant?.perUnit || null,
                unitType: variant?.unitType || (variant?.size ? 'size' : 'weight')
              }));
            }
            
            // Create default variant from main product data
            return [
              {
                id: "default",
                weight: productData?.weight || "Default",
                size: productData?.size || "Default", 
                label: productData?.weight || productData?.size || "Default",
                price: parseFloat(productData?.price || productData?.salePrice || 0),
                originalPrice: parseFloat(productData?.originalPrice || productData?.mrp || productData?.price || productData?.salePrice || 0),
                stock: productData?.stock || productData?.stockQuantity || 10,
                perUnit: null,
                unitType: productData?.size ? 'size' : 'weight'
              }
            ];
          })(),
          badges: productData?.badges || [],
          features: productData?.features || [],
          ingredients: productData?.ingredients || '',
          benefits: productData?.benefits || [],
          nutrition: productData?.nutrition || {},
          metadata: productData?.metadata || {},
          rating: productData?.rating || productData?.ratingValue || 0,
          reviewCount: productData?.reviewCount || 0,
          category: productData?.category || productData?.categoryId,
          brand: productData?.brand || productData?.manufacturer || 'Brand'
        };

        setProduct(normalizedProduct);

        // Load related products
        try {
          const all = await productApi.getAll();
          const items = Array.isArray(all) ? all : [];
          const sameCategory = items.filter(p => (p?.category || p?.categoryId) === normalizedProduct.category && p?.id !== normalizedProduct.id).slice(0, 8);
          const normalizedRelated = sameCategory.map(p => ({
            id: p?.id,
            name: p?.name || p?.title,
            image: resolveImageUrl(p?.image || p?.imageUrl || p?.thumbnailUrl),
            rating: p?.rating || 4.5,
            reviewCount: p?.reviewCount || 0,
            badges: p?.badges || [],
            variants: [{ id: 'default', weight: p?.weight || 'Default', price: parseFloat(p?.price ?? p?.salePrice ?? 0) || 0, originalPrice: parseFloat(p?.originalPrice ?? p?.price ?? p?.salePrice ?? 0) || 0 }]
          }));
          setRelatedProducts(normalizedRelated);
        } catch (e) {
          setRelatedProducts([]);
        }
      } catch (err) {
        console.error('Error loading product:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (productId) loadProduct();
  }, [productId]);

  const breadcrumbItems = [
    { label: 'Home', path: '/homepage' },
    { label: product?.category || 'Category', path: `/shop-for-dogs?category=${product?.category}` },
    { label: product?.name || 'Product', path: `/product-full/${productId}` }
  ];

  const handleAddToCart = (item) => {
    if (!product) return;
    const variant = product?.variants?.find(v => v?.id === item?.variantId) || product?.variants?.[0];
    if (!variant) return;
    addToCart({ id: product.id, productId: product.id, variantId: variant.id, name: product.name, variant: variant.weight || variant.size, price: parseFloat(variant.price) || 0, originalPrice: parseFloat(variant.originalPrice) || parseFloat(variant.price) || 0, image: product.images?.[0], category: product.category, brand: product.brand }, item?.quantity || 1);
  };

  const handleAddToWishlist = () => {
    if (!product) return;
    const isIn = isInWishlist(product.id);
    if (isIn) removeFromWishlist(product.id); else addToWishlist({ id: product.id, name: product.name, image: product.images?.[0], price: parseFloat(product?.variants?.[0]?.price) || 0 });
  };

  if (loading) return (
    <div className="min-h-screen bg-gray-50">
      <Header cartItemCount={getCartItemCount()} cartItems={cartItems} onSearch={()=>{}} />
      <main className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">
          <div className="p-8">
            <div className="animate-pulse">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Image skeleton */}
                <div className="bg-gray-200 h-96 rounded-lg"></div>
                {/* Content skeleton */}
                <div className="space-y-6">
                  <div className="h-8 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-6 bg-gray-200 rounded w-1/2"></div>
                  <div className="space-y-3">
                    <div className="h-4 bg-gray-200 rounded"></div>
                    <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                    <div className="h-4 bg-gray-200 rounded w-4/6"></div>
                  </div>
                  <div className="h-12 bg-gray-200 rounded w-32"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
  
  if (error) return (
    <div className="min-h-screen bg-gray-50">
      <Header cartItemCount={getCartItemCount()} cartItems={cartItems} onSearch={()=>{}} />
      <main className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">
          <div className="p-8 text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Oops! Something went wrong</h2>
            <p className="text-gray-600 mb-4">Error loading product: {error}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary/90 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </main>
    </div>
  );
  
  if (!product) return (
    <div className="min-h-screen bg-gray-50">
      <Header cartItemCount={getCartItemCount()} cartItems={cartItems} onSearch={()=>{}} />
      <main className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">
          <div className="p-8 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Product Not Found</h2>
            <p className="text-gray-600 mb-4">The product you're looking for doesn't exist or may have been removed.</p>
            <a 
              href="/shop-for-dogs" 
              className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary/90 transition-colors inline-block"
            >
              Browse Products
            </a>
          </div>
        </div>
      </main>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Header cartItemCount={getCartItemCount()} cartItems={cartItems} onSearch={()=>{}} />
      
      {/* Hero Section with Breadcrumb */}
      <section className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <Breadcrumb customItems={breadcrumbItems} />
        </div>
      </section>

      {/* Main Product Section */}
      <section className="container mx-auto px-4 py-6 md:py-8">
        <div className="bg-white rounded-2xl shadow-sm border overflow-hidden mb-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
            {/* Product Images - Left Side */}
            <div className="bg-gray-50 p-4 md:p-6 lg:p-8">
              <div className="lg:sticky lg:top-24 lg:self-start">
                <ProductImageGallery 
                  images={product?.images} 
                  productName={product?.name} 
                />
              </div>
            </div>

            {/* Product Info - Right Side */}
            <div className="p-4 md:p-6 lg:p-8 lg:pl-6">
              <ProductInfo 
                product={product} 
                onAddToCart={handleAddToCart} 
                onAddToWishlist={handleAddToWishlist} 
                isInWishlist={isInWishlist(product.id)} 
              />
            </div>
          </div>
        </div>
      </section>

      {/* Product Details & Information Tabs */}
      <section className="container mx-auto px-4 pb-6 md:pb-8">
        <div className="bg-white rounded-2xl shadow-sm border overflow-hidden mb-6 md:mb-8">
          <div className="p-4 md:p-6 lg:p-8">
            <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-4 md:mb-6 border-b pb-3 md:pb-4">
              Product Information
            </h2>
            <ProductDetails product={product} />
          </div>
        </div>
      </section>

      {/* Reviews Section */}
      <section className="container mx-auto px-4 pb-6 md:pb-8">
        <div className="bg-white rounded-2xl shadow-sm border overflow-hidden mb-6 md:mb-8">
          <div className="p-4 md:p-6 lg:p-8">
            <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-4 md:mb-6 border-b pb-3 md:pb-4 flex items-center gap-3">
              <svg className="w-5 h-5 md:w-6 md:h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
              </svg>
              Customer Reviews
            </h2>
            <ProductReviews productId={product.id} />
          </div>
        </div>
      </section>

      {/* Trust Badges Section */}
      <section className="bg-primary/5 border-t">
        <div className="container mx-auto px-4 py-8 md:py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            <div className="text-center">
              <div className="w-12 h-12 md:w-16 md:h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3 md:mb-4">
                <svg className="w-6 h-6 md:w-8 md:h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
              <h3 className="font-semibold text-sm md:text-base text-gray-900 mb-1 md:mb-2">Fast Delivery</h3>
              <p className="text-xs md:text-sm text-gray-600">Quick and reliable shipping</p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 md:w-16 md:h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3 md:mb-4">
                <svg className="w-6 h-6 md:w-8 md:h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="font-semibold text-sm md:text-base text-gray-900 mb-1 md:mb-2">Quality Guaranteed</h3>
              <p className="text-xs md:text-sm text-gray-600">Premium pet products</p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 md:w-16 md:h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3 md:mb-4">
                <svg className="w-6 h-6 md:w-8 md:h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </div>
              <h3 className="font-semibold text-sm md:text-base text-gray-900 mb-1 md:mb-2">24/7 Support</h3>
              <p className="text-xs md:text-sm text-gray-600">Always here to help</p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 md:w-16 md:h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3 md:mb-4">
                <svg className="w-6 h-6 md:w-8 md:h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </div>
              <h3 className="font-semibold text-sm md:text-base text-gray-900 mb-1 md:mb-2">Easy Returns</h3>
              <p className="text-xs md:text-sm text-gray-600">Hassle-free returns</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ProductFullPage;
