// Utility function to extract all images from a product object
// Handles various image storage locations in the product data structure

import { resolveImageUrl } from './imageUtils';

/**
 * Extract all available images from a product object
 * @param {Object} product - Product object from API
 * @returns {Array} Array of resolved image URLs
 */
export function extractAllProductImages(product) {
  if (!product) return [];
  
  let imageUrls = [];
  
  // Priority 1: metadata.images (where backend stores images)
  if (product.metadata?.images && Array.isArray(product.metadata.images)) {
    imageUrls = product.metadata.images.map(resolveImageUrl).filter(Boolean);
  }
  
  // Priority 2: direct images array (legacy/fallback)
  else if (product.images && Array.isArray(product.images)) {
    imageUrls = product.images.map(resolveImageUrl).filter(Boolean);
  }
  
  // Priority 3: gallery array
  else if (product.gallery && Array.isArray(product.gallery)) {
    imageUrls = product.gallery.map(resolveImageUrl).filter(Boolean);
  }
  
  // Priority 4: single image fields (fallback)
  else {
    const singleImageFields = ['imageUrl', 'image', 'thumbnailUrl', 'thumbnail'];
    for (const field of singleImageFields) {
      if (product[field] && product[field].trim() !== '') {
        const resolved = resolveImageUrl(product[field]);
        if (resolved) {
          imageUrls = [resolved];
          break;
        }
      }
    }
  }
  
  // Remove duplicates and filter out invalid URLs
  const uniqueUrls = [...new Set(imageUrls.filter(url => url && url.trim() !== ''))];
  
  // Debug logging
  console.log('extractAllProductImages:', {
    productId: product.id,
    productName: product.name,
    metadataImages: product.metadata?.images?.length || 0,
    directImages: product.images?.length || 0,
    extractedUrls: uniqueUrls.length,
    urls: uniqueUrls
  });
  
  return uniqueUrls;
}

/**
 * Get the primary image URL for a product (first available image)
 * @param {Object} product - Product object from API
 * @returns {String} Primary image URL or empty string
 */
export function getPrimaryProductImage(product) {
  const allImages = extractAllProductImages(product);
  return allImages.length > 0 ? allImages[0] : '';
}

/**
 * Check if a product has multiple images for gallery display
 * @param {Object} product - Product object from API
 * @returns {Boolean} True if product has more than one image
 */
export function hasMultipleImages(product) {
  const allImages = extractAllProductImages(product);
  return allImages.length > 1;
}

export default {
  extractAllProductImages,
  getPrimaryProductImage,
  hasMultipleImages
};