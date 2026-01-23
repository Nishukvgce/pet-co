// Test utility to verify image extraction and display
// Run this in browser console on any product page to debug image issues

export function debugProductImages(productData) {
  if (!productData) {
    console.log('No product data provided');
    return;
  }

  console.group(`🔍 Image Debug for Product: ${productData.name || productData.id}`);
  
  // Show all possible image locations
  console.log('📊 Raw Image Data:');
  console.table({
    'metadata.images': productData.metadata?.images || null,
    'images': productData.images || null,
    'imageUrl': productData.imageUrl || null,
    'image': productData.image || null,
    'gallery': productData.gallery || null
  });

  // Count images in each location
  const counts = {
    'metadata.images': Array.isArray(productData.metadata?.images) ? productData.metadata.images.length : 0,
    'direct images': Array.isArray(productData.images) ? productData.images.length : 0,
    'single imageUrl': productData.imageUrl ? 1 : 0,
    'gallery': Array.isArray(productData.gallery) ? productData.gallery.length : 0
  };
  
  console.log('📈 Image Counts:');
  console.table(counts);

  // Show metadata.images in detail if it exists
  if (productData.metadata?.images) {
    console.log('🖼️ Metadata Images (Primary Source):');
    productData.metadata.images.forEach((img, index) => {
      console.log(`${index + 1}: ${img}`);
    });
    
    // Check for duplicates
    const unique = [...new Set(productData.metadata.images)];
    if (unique.length !== productData.metadata.images.length) {
      console.warn(`⚠️ Found ${productData.metadata.images.length - unique.length} duplicate images!`);
      console.log('Duplicates:', productData.metadata.images.filter((img, index) => 
        productData.metadata.images.indexOf(img) !== index
      ));
    }
  }

  // Test image resolution
  if (typeof extractAllProductImages !== 'undefined') {
    const extracted = extractAllProductImages(productData);
    console.log(`✅ Extracted ${extracted.length} unique images:`);
    extracted.forEach((url, index) => {
      console.log(`${index + 1}: ${url}`);
    });
  } else {
    console.log('❌ extractAllProductImages utility not available');
  }

  // Test image loading
  console.log('🔗 Testing Image URLs:');
  const imagesToTest = productData.metadata?.images || productData.images || [];
  imagesToTest.slice(0, 3).forEach((url, index) => { // Test first 3 images
    const img = new Image();
    img.onload = () => console.log(`✅ Image ${index + 1} loads successfully: ${url}`);
    img.onerror = () => console.error(`❌ Image ${index + 1} failed to load: ${url}`);
    img.src = url.startsWith('http') ? url : `${window.location.origin}${url}`;
  });

  console.groupEnd();
}

// Auto-run if on product page
if (typeof window !== 'undefined') {
  // Add to window for easy access in console
  window.debugProductImages = debugProductImages;
  
  console.log('🔧 Image Debug Utility Loaded!');
  console.log('Usage: debugProductImages(productData)');
  console.log('Or inspect current product: debugCurrentProduct()');
  
  // Helper to debug current product if React state is accessible
  window.debugCurrentProduct = () => {
    // Try to find product data from React state (this is a best-effort attempt)
    const reactRoot = document.querySelector('#root')._reactInternalInstance ||
                      document.querySelector('#root')._reactInternals;
    
    if (reactRoot) {
      console.log('🔍 Searching for product data in React state...');
      // This is a simplified approach - in real scenarios you'd need to traverse the React fiber tree
      console.log('💡 Please call debugProductImages(productData) directly with your product object');
    } else {
      console.log('❌ Could not access React state. Please call debugProductImages(productData) manually.');
    }
  };
}