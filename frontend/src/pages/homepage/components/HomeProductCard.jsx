import React, { useMemo, useState } from 'react';
import { useCart } from '../../../contexts/CartContext';
import apiClient from '../../../services/api';

const resolveImageUrl = (src) => {
  if (!src) return '/assets/images/no_image.png';
  if (src.startsWith('http://') || src.startsWith('https://') || src.startsWith('data:')) return src;
  const base = apiClient?.defaults?.baseURL || '';
  return src.startsWith('/') ? `${base}${src}` : `${base}/${src}`;
};

const formatCurrency = (n) => {
  if (n === undefined || n === null) return '';
  const num = typeof n === 'number' ? n : parseFloat(n) || 0;
  return `₹${num.toLocaleString('en-IN', { maximumFractionDigits: 2, minimumFractionDigits: 0 })}`;
};

const pickVariant = (product, variantId) => {
  if (!product) return null;
  const variants = Array.isArray(product.variants) && product.variants.length ? product.variants : (Array.isArray(product.metadata?.variants) ? product.metadata.variants : []);
  if (!variants || variants.length === 0) return null;
  if (!variantId) return variants[0];
  return variants.find(v => (v?.id || v?.variantId || v?.code) === variantId) || variants[0];
};

const HomeProductCard = ({ p }) => {
  const { addToCart, addToWishlist, isInWishlist } = useCart();
  const variants = useMemo(() => Array.isArray(p?.variants) && p.variants.length ? p.variants : (Array.isArray(p?.metadata?.variants) ? p.metadata.variants : []), [p]);
  const [selectedVariantId, setSelectedVariantId] = useState(variants && variants.length ? (variants[0].id || variants[0].variantId || variants[0].code) : null);

  const selectedVariant = useMemo(() => pickVariant(p, selectedVariantId), [p, selectedVariantId]);

  const imageSrc = resolveImageUrl(p.image || p.imageUrl || (p.images && p.images[0]) || '');

  const price = selectedVariant?.price || p.salePrice || p.price || p.unitPrice || p.mrp || 0;
  const original = selectedVariant?.originalPrice || p.originalPrice || p.mrp || null;

  const handleAddToCart = () => {
    const productForCart = {
      id: `${p.id}`,
      productId: p.id,
      name: p.name || p.title || p.productName,
      image: imageSrc,
      price: price,
      originalPrice: original || price,
      variantId: selectedVariant?.id || selectedVariant?.variantId || null,
      variant: selectedVariant?.label || selectedVariant?.name || selectedVariant?.weight || selectedVariant?.size || p.weight || p.size || 'Default',
      category: p.category,
      brand: p.brand
    };
    addToCart(productForCart, 1);
  };

  const formatVariantLabel = (v) => {
    if (!v) return '';
    const rawLabel = v.label || v.name || '';
    if (rawLabel && String(rawLabel).trim() !== '') return String(rawLabel).trim();

    // weight/size heuristics
    const weightVal = v.weight || v.weightValue || v.weight_in_grams || v.size || v.sizeValue || v.value || v.qty;
    const weightUnit = v.weightUnit || v.weight_unit || v.sizeUnit || v.size_unit || v.unit || v.unitType || p?.weightUnit || p?.sizeUnit || '';
    if (weightVal) {
      const val = String(weightVal).trim();
      return weightUnit ? `${val}${weightUnit}` : val;
    }

    return '';
  };

  const toggleWishlist = () => {
    try {
      if (isInWishlist(p.id)) {
        return;
      }
      addToWishlist({ id: p.id, name: p.name || p.title, image: imageSrc, price });
    } catch (e) {
      // ignore
    }
  };

  return (
    <div className="bg-white rounded-md shadow-md p-4 flex flex-col h-full min-h-[360px]">
      <div className="relative flex-shrink-0 flex items-center justify-center h-48 bg-white">
        <img src={imageSrc} alt={p.name || p.title} className="max-h-44 object-contain" />
        {original && Number(original) > Number(price) ? (
          <div className="absolute top-3 right-3 bg-red-600 text-white text-xs font-semibold px-2 py-1 rounded">{Math.round(((original - price) / original) * 100)}% off</div>
        ) : null}
      </div>

      <div className="mt-3 flex-1 flex flex-col">
        <h3 className="text-sm text-center text-gray-800 font-semibold line-clamp-2">{p.name || p.title}</h3>

        {variants && variants.length > 0 ? (
          <div className="mt-3 flex items-center justify-center">
            <div className="flex items-center space-x-2 overflow-x-auto hide-scrollbar py-1">
              {variants.map((v) => {
                const vid = (v.id || v.variantId || v.code) + '';
                const label = formatVariantLabel(v) || '';
                const vPrice = v.price || v.salePrice || v.mrp || p.price || 0;
                const selected = String(selectedVariantId) === vid;
                return (
                  <button
                    key={vid}
                    onClick={() => setSelectedVariantId(vid)}
                    className={`flex-shrink-0 w-20 h-16 flex flex-col items-center justify-center rounded-md border transition-all duration-150 ${selected ? 'bg-[#ff7a00] border-[#ff7a00] text-white shadow-lg' : 'bg-white border-gray-200 text-gray-800'}`}
                  >
                    <div className="text-[11px] font-medium">{label}</div>
                    <div className="text-sm font-semibold mt-1">{formatCurrency(vPrice)}</div>
                  </button>
                );
              })}
            </div>
          </div>
        ) : null}

        <div className="mt-3 flex items-center justify-between">
          <div>
            {original && Number(original) > Number(price) ? (
              <div className="text-sm text-red-600 line-through">{formatCurrency(original)}</div>
            ) : null}
            <div className="text-2xl font-extrabold text-gray-900 mt-1">{formatCurrency(price)}</div>
          </div>

          <button
            onClick={handleAddToCart}
            className="ml-4 w-14 h-14 rounded-full bg-[#ff7a00] hover:bg-orange-600 text-white font-semibold flex items-center justify-center shadow-lg"
            aria-label="Add to cart"
          >
            Add
          </button>
        </div>

        <div className="mt-2 flex items-center justify-between text-xs text-gray-500">
          <div>{p.rating ? `${p.rating} ★` : null}</div>
          <button onClick={toggleWishlist} className="text-[#ff7a00]">{isInWishlist(p.id) ? 'In Wishlist' : 'Add To Wishlist'}</button>
        </div>
      </div>
    </div>
  );
};

export default HomeProductCard;
