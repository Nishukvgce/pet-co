import React, { useState } from 'react';
import { Heart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../contexts/CartContext';

/**
 * Premium, unified ProductCard for all sections (dogs, cats, pharmacy, outlet, etc.)
 * Props: p (product object)
 */
const ProductCard = ({ p }) => {
  const navigate = useNavigate();
  const { addToCart, addToWishlist, removeFromWishlist, isInWishlist } = useCart();
  const [variantIdx, setVariantIdx] = useState(0);
  
  // Normalize variants to handle both object and string formats
  const normalizeVariants = () => {
    if (!p.variants || p.variants.length === 0) {
      return [{ 
        id: 'default', 
        weight: 'Default', 
        label: 'Default',
        price: p.price, 
        originalPrice: p.originalPrice || p.original, 
        stock: p.stockQuantity ?? 1 
      }];
    }
    
    return p.variants.map((v, idx) => {
      if (typeof v === 'object') {
        // Build label with units from database (same logic as DogFood)
        let label = '';
        if (v.weight && v.weight.toString().trim()) {
          const weight = v.weight.toString().trim();
          const unit = v.weightUnit?.toString().trim() || '';
          label = unit ? `${weight}${unit}` : weight;
        } else if (v.size && v.size.toString().trim()) {
          const size = v.size.toString().trim();
          const unit = v.sizeUnit?.toString().trim() || '';
          label = unit ? `${size}${unit}` : size;
        } else if (v.label) {
          label = v.label.toString().trim();
        } else {
          label = `Variant ${idx + 1}`;
        }
        
        return {
          id: v.id || `variant-${idx}`,
          weight: v.weight || v.size || label,
          label: label,
          price: v.price || p.price || 0,
          originalPrice: v.originalPrice || v.original || p.originalPrice || p.original || v.price || p.price || 0,
          stock: v.stock ?? v.stockQuantity ?? p.stockQuantity ?? 1,
          weightUnit: v.weightUnit || '',
          sizeUnit: v.sizeUnit || ''
        };
      }
      // If variant is a string, use product price
      return {
        id: `variant-${idx}`,
        weight: String(v),
        label: String(v),
        price: p.price || 0,
        originalPrice: p.originalPrice || p.original || p.price || 0,
        stock: p.stockQuantity ?? 1
      };
    });
  };
  
  const variants = normalizeVariants();
  const currentVariant = variants[variantIdx];
  const currentPrice = Number(currentVariant.price) || 0;
  const originalPrice = Number(currentVariant.originalPrice) || 0;
  const discount = originalPrice > currentPrice ? Math.round(100 - (currentPrice / originalPrice) * 100) : 0;
  const isInStock = (currentVariant.stock ?? 1) > 0;
  const brand = p.brand || (p.filters && p.filters.brands && p.filters.brands[0]) || '';

  // Wishlist logic
  const wishlisted = isInWishlist && isInWishlist(p.id);
  const handleWishlist = (e) => {
    e.stopPropagation();
    if (wishlisted) {
      removeFromWishlist(p.id);
    } else {
      addToWishlist({ id: p.id, name: p.name, image: p.image, price: currentPrice, brand });
    }
  };

  // Add to cart
  const handleAddToCart = (e) => {
    e.stopPropagation();
    if (!isInStock) return;
    
    const cartItem = {
      id: p.id,
      productId: p.id,
      variantId: currentVariant.id,
      name: p.name,
      image: p.image,
      price: currentPrice,
      originalPrice: originalPrice,
      variant: currentVariant.label || currentVariant.weight,
      brand,
      quantity: 1,
      category: p.category || '',
    };
    
    addToCart(cartItem);
  };

  // Image fallback
  const getImageUrl = (imageUrl) => {
    if (!imageUrl) return '/assets/images/no_image.png';
    if (imageUrl.startsWith('http')) return imageUrl;
    if (imageUrl.startsWith('/admin/')) return `http://localhost:8080${imageUrl}`;
    return imageUrl;
  };

  return (
    <article className={`bg-white rounded-[2rem] border border-border/50 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden relative group h-full flex flex-col ${!isInStock ? 'opacity-80' : ''}`}
      style={{ cursor: 'pointer' }}
    >
      {/* Badges */}
      <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
        {discount > 0 && (
          <span className="bg-[#E63946] text-white text-[10px] sm:text-xs font-bold px-3 py-1 rounded-full shadow-sm tracking-wide">{discount}% OFF</span>
        )}
        {p.badges && p.badges.length > 0 && !discount && (
          <span className="bg-emerald-500 text-white text-[10px] sm:text-xs font-bold px-3 py-1 rounded-full shadow-sm tracking-wide">{p.badges[0]}</span>
        )}
      </div>

      {/* Wishlist icon - Transparent/Minimal */}
      <button
        className="absolute top-4 right-4 z-20 p-2 rounded-full hover:bg-black/5 transition-colors duration-200"
        onClick={handleWishlist}
        aria-label={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
      >
        <Heart 
          className={`transition-colors duration-200 drop-shadow-sm ${wishlisted ? 'text-red-500 fill-red-500' : 'text-white/90 hover:text-white fill-black/20'}`} 
          size={24} 
          strokeWidth={2}
        />
      </button>

      {/* Product Image - Square-ish aspect ratio */}
      <div className="aspect-square relative flex items-center justify-center bg-gray-50 overflow-hidden"
        onClick={() => navigate(`/product-detail-page?id=${p.id}`)}
      >
        <img
          src={getImageUrl(p.image)}
          alt={p.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          onError={e => { e.target.src = '/assets/images/no_image.png'; }}
        />
        {!isInStock && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center backdrop-blur-[2px]">
            <span className="text-white font-bold text-lg px-4 py-2 border-2 border-white rounded-lg">Out of Stock</span>
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="p-4 sm:p-5 flex flex-col flex-grow">
        <div className="mb-1">
          <h3
            className="text-lg font-bold text-gray-900 line-clamp-1 leading-tight group-hover:text-[#F37021] transition-colors"
            title={p.name}
            onClick={() => navigate(`/product-detail-page?id=${p.id}`)}
          >
            {p.name}
          </h3>
          {brand && <div className="text-sm text-gray-500 font-medium">by {brand}</div>}
        </div>

        {/* Variant Selector - Square Boxes */}
        <div className="mt-3 mb-4 min-h-[3.5rem]">
          {variants.length > 1 ? (
            <div className="flex flex-wrap gap-2">
              {variants.map((v, i) => {
                const active = i === variantIdx;
                const variantLabel = v.label || v.weight;
                const variantPrice = Number(v.price) || 0;
                
                return (
                  <button
                    key={i}
                    onClick={e => { e.stopPropagation(); setVariantIdx(i); }}
                    className={`flex flex-col items-center justify-center min-w-[3.5rem] h-[3.5rem] px-2 rounded-lg border transition-all duration-200 ${
                      active 
                        ? 'bg-[#F37021] text-white border-[#F37021] shadow-md transform scale-105' 
                        : 'bg-white text-gray-700 border-gray-200 hover:border-[#F37021] hover:shadow-sm'
                    }`}
                  >
                    <span className="text-xs font-bold leading-none mb-1">{variantLabel}</span>
                    <span className={`text-[10px] font-medium leading-none ${active ? 'text-white/90' : 'text-gray-500'}`}>
                      ₹{variantPrice.toFixed(0)}
                    </span>
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="h-[3.5rem]"></div> /* Spacer to keep card height consistent */
          )}
        </div>

        {/* Price and Add Button - Bottom aligned */}
        <div className="mt-auto flex items-end justify-between" onClick={e => e.stopPropagation()}>
          <div className="flex flex-col">
            <div className="text-xl sm:text-2xl font-bold text-gray-900 leading-none">₹{Number(currentPrice).toFixed(2)}</div>
            {originalPrice > currentPrice && (
              <div className="text-sm text-gray-400 line-through mt-1 font-medium">₹{Number(originalPrice).toFixed(2)}</div>
            )}
          </div>
          <button
            onClick={handleAddToCart}
            disabled={!isInStock}
            className={`px-6 py-2.5 rounded-full text-sm font-bold shadow-sm transition-all duration-200 active:scale-95 ${
              isInStock 
                ? 'bg-[#F37021] text-white hover:bg-[#E05F15] hover:shadow-md' 
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            {isInStock ? 'Add' : 'No Stock'}
          </button>
        </div>
      </div>
    </article>
  );
};

export default ProductCard;
