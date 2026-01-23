import apiClient from '../services/api';

// Resolve image candidate (string or product object) to an absolute URL usable by the frontend.
// Handles full URLs, data URIs, relative paths returned by the backend, filenames, and product objects.
export function resolveImageUrl(candidate) {
  if (!candidate && candidate !== 0) return '';

  // If caller passed a product object, try to derive the best image field
  if (typeof candidate === 'object') {
    // First check metadata.images (priority since that's where backend stores images)
    try {
      const meta = candidate.metadata || (candidate.data && candidate.data.metadata);
      if (meta && meta.images && Array.isArray(meta.images) && meta.images.length > 0) {
        // Return first valid image from metadata.images
        for (const img of meta.images) {
          const resolved = resolveImageUrl(img);
          if (resolved) return resolved;
        }
      }
    } catch (err) { /* ignore */ }

    // Common fields where image may be stored (fallback)
    const tryFields = [
      'images', 'imageUrl', 'image', 'thumbnailUrl', 'thumbnail', 'image_path', 'originalImage'
    ];

    for (const key of tryFields) {
      if (candidate[key]) {
        const v = candidate[key];
        if (Array.isArray(v) && v.length > 0) {
          // Return first valid image from array
          for (const img of v) {
            const resolved = resolveImageUrl(img);
            if (resolved) return resolved;
          }
        }
        if (typeof v === 'object' && v !== null) {
          continue; // Skip nested objects for now
        }
        return resolveImageUrl(String(v));
      }
    }

    return '';
  }

  if (typeof candidate !== 'string') return '';
  const trimmed = candidate.trim();
  if (!trimmed) return '';

  // Already absolute or data URI
  if (/^https?:\/\//i.test(trimmed) || trimmed.startsWith('data:')) {
    return trimmed;
  }

  // Normalize Windows backslashes and unsafe prefixes
  let path = trimmed.replace(/\\/g, '/');

  // If path looks like an absolute OS path (C:/... or /mnt/...), extract filename
  if (/^[a-zA-Z]:\//.test(path) || path.startsWith('\\') || path.startsWith('/mnt/')) {
    const parts = path.split('/');
    path = parts[parts.length - 1] || path;
  }

  const base = apiClient?.defaults?.baseURL || '';

  // If backend returned a path starting with '/', treat it as absolute to API
  if (path.startsWith('/')) {
    return `${base}${path}`;
  }

  // If path already contains 'api/' assume it's relative to base
  if (/^api\//i.test(path)) return `${base}/${path}`;

  // If it's a filename like 'photo.jpg', map to admin images route when possible
  if (/^[^/]+\.[a-zA-Z0-9]{2,5}$/.test(path)) {
    return `${base}/admin/products/images/${path}`;
  }

  // Last-resort: append to base
  return `${base}/${path}`;
}

export default { resolveImageUrl };
