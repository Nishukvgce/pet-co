import apiClient from '../services/api';

// Resolve image candidate (string or product object) to an absolute URL usable by the frontend.
// Handles full URLs, data URIs, relative paths returned by the backend, filenames, and product objects.
export function resolveImageUrl(candidate) {
  if (!candidate && candidate !== 0) return '';

  // If caller passed a product object, try to derive the best image field
  if (typeof candidate === 'object') {
    // Common fields where image may be stored
    const tryFields = [
      'imageUrl', 'image', 'thumbnailUrl', 'thumbnail', 'images', 'metadata', 'image_path', 'originalImage'
    ];

    for (const key of tryFields) {
      if (candidate[key]) {
        const v = candidate[key];
        if (Array.isArray(v) && v.length > 0) return resolveImageUrl(v[0]);
        if (typeof v === 'object' && v !== null) {
          // nested metadata.images
          if (v.images && Array.isArray(v.images) && v.images.length > 0) return resolveImageUrl(v.images[0]);
          continue;
        }
        return resolveImageUrl(String(v));
      }
    }

    // Try metadata.images specifically
    try {
      const meta = candidate.metadata || (candidate.data && candidate.data.metadata);
      if (meta && meta.images && Array.isArray(meta.images) && meta.images.length > 0) {
        return resolveImageUrl(meta.images[0]);
      }
    } catch (err) { /* ignore */ }

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
