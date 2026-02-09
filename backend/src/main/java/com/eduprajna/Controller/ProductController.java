package com.eduprajna.Controller;

import java.io.IOException;
import java.net.URLDecoder;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.concurrent.TimeUnit;
import java.util.stream.Collectors;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.http.CacheControl;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.eduprajna.config.CorsConfig;
import com.eduprajna.entity.Product;
import com.eduprajna.service.ProductService;
import com.eduprajna.service.StorageService;

@RestController
@RequestMapping("/api/admin/products")
// Allow local dev, Vercel preview and production frontend domains
@CrossOrigin(origins = { CorsConfig.LOCALHOST_3000, CorsConfig.LOCALHOST_5173, CorsConfig.LOCALHOST_IP_3000,
        CorsConfig.LOCALHOST_IP_5173, CorsConfig.AWS_CURRENT_IP_HTTP,
        CorsConfig.AWS_CURRENT_IP_HTTPS }, allowCredentials = "true")

public class ProductController {
    private final Logger log = LoggerFactory.getLogger(ProductController.class);

    @Autowired
    private ProductService productService;

    @Autowired
    private StorageService storageService;

    @Autowired
    private com.eduprajna.service.CloudinaryStorageService cloudinaryStorageService;

    @Autowired(required = false)
    private com.eduprajna.service.S3ImageService s3ImageService;

    // Customer-facing endpoint that filters out-of-stock products
    @GetMapping("/customer")
    public ResponseEntity<List<Product>> getCustomerProducts(
            @RequestParam(value = "category", required = false) String category,
            @RequestParam(value = "sub", required = false) String sub,
            @RequestParam(value = "type", required = false) String type,
            @RequestParam(value = "petType", required = false) String petType) {
        // Normalize type parameter (prioritize 'type' over 'petType')
        String effectiveType = normalizeTypeParameter(type, petType);

        // Normalize category and subcategory parameters
        String normalizedCategory = normalizeParameter(category);
        String normalizedSub = normalizeParameter(sub);

        log.info("ProductController: Customer request - type: '{}', category: '{}', sub: '{}'",
                effectiveType, normalizedCategory, normalizedSub);

        List<Product> products = getFilteredProductsWithType(normalizedCategory, normalizedSub, effectiveType);

        // Filter out products that are completely out of stock
        List<Product> inStockProducts = products.stream()
                .filter(this::hasAvailableStock)
                .collect(Collectors.toList());

        // Enrich all products with metadata for frontend display
        inStockProducts.forEach(this::enrichProductMetadata);

        log.info("ProductController: Returning {} in-stock products out of {} total products for customers",
                inStockProducts.size(), products.size());

        return ResponseEntity.ok()
                .cacheControl(CacheControl.maxAge(5, TimeUnit.MINUTES))
                .body(inStockProducts);
    }

    // Enhanced filtering method that handles type-first filtering
    private List<Product> getFilteredProductsWithType(String category, String sub, String type) {
        List<Product> products;

        try {
            log.info("ProductController: Filtering products - type: '{}', category: '{}', sub: '{}'",
                    type, category, sub);

            // Type-first filtering: if type provided, filter by type first
            if (type != null && !type.isBlank()) {
                products = productService.getFilteredProductsByType(type, category, sub);
                log.info("ProductController: Type-filtered query returned {} products", products.size());

                // If no products found with strict type filtering, try fallback strategies
                if (products.isEmpty()) {
                    log.info("ProductController: No products found by type '{}', trying category-based fallback", type);

                    List<Product> allProducts = productService.getAll();

                    if ("Pharmacy".equalsIgnoreCase(type)) {
                        // Fallback: find products by pharmacy-related categories
                        products = allProducts.stream()
                                .filter(p -> isPharmacyProduct(p, category, sub))
                                .collect(Collectors.toList());
                    } else if ("Dog".equalsIgnoreCase(type)) {
                        // Fallback: find products by dog-related categories or metadata
                        products = allProducts.stream()
                                .filter(p -> isDogProduct(p, category, sub))
                                .collect(Collectors.toList());
                    } else if ("Cat".equalsIgnoreCase(type)) {
                        // Fallback: find products by cat-related categories or metadata
                        products = allProducts.stream()
                                .filter(p -> isCatProduct(p, category, sub))
                                .collect(Collectors.toList());
                    } else if ("Outlet".equalsIgnoreCase(type)) {
                        // Fallback: find products by outlet-related categories or metadata
                        products = allProducts.stream()
                                .filter(p -> isOutletProduct(p, category, sub))
                                .collect(Collectors.toList());
                    }

                    log.info("ProductController: Fallback strategy found {} products", products.size());
                }
            } else {
                // Fallback to category/subcategory filtering
                products = productService.getFilteredProducts(category, sub);
                log.info("ProductController: Category-filtered query returned {} products", products.size());
            }

            return products;
        } catch (Exception e) {
            log.error("ProductController: Error filtering products", e);
            return productService.getAll();
        }
    }

    // Helper method to identify pharmacy products by category patterns
    private boolean isPharmacyProduct(Product p, String category, String sub) {
        if (p == null || !Boolean.TRUE.equals(p.getIsActive()))
            return false;

        // Check if product type is pharmacy
        if ("Pharmacy".equalsIgnoreCase(p.getType()))
            return true;

        // Check metadata for pharmacy indicators
        Map<String, Object> metadata = p.getMetadata();
        if (metadata != null) {
            Object metaType = metadata.get("type");
            Object petType = metadata.get("petType");
            if ("Pharmacy".equalsIgnoreCase(String.valueOf(metaType)) ||
                    "Pharmacy".equalsIgnoreCase(String.valueOf(petType))) {
                return true;
            }
        }

        // Check category patterns for pharmacy products
        String productCategory = p.getCategory();
        String productSubcategory = p.getSubcategory();

        if (productCategory != null) {
            String catLower = productCategory.toLowerCase();
            if (catLower.contains("pharmacy") || catLower.contains("medicine") ||
                    catLower.contains("supplement") || catLower.contains("prescription")) {

                // If specific category/subcategory filters provided, check them
                if (category != null && !category.isBlank()) {
                    if (!productCategory.toLowerCase().contains(category.toLowerCase())) {
                        return false;
                    }
                }

                if (sub != null && !sub.isBlank() && productSubcategory != null) {
                    if (!productSubcategory.toLowerCase().contains(sub.toLowerCase())) {
                        return false;
                    }
                }

                return true;
            }
        }

        return false;
    }

    // Helper method to identify dog products
    private boolean isDogProduct(Product p, String category, String sub) {
        if (p == null || !Boolean.TRUE.equals(p.getIsActive()))
            return false;

        // Check if product type is dog
        if ("Dog".equalsIgnoreCase(p.getType()))
            return true;

        // Check metadata for dog indicators
        Map<String, Object> metadata = p.getMetadata();
        if (metadata != null) {
            Object metaType = metadata.get("type");
            Object petType = metadata.get("petType");
            if ("Dog".equalsIgnoreCase(String.valueOf(metaType)) ||
                    "Dog".equalsIgnoreCase(String.valueOf(petType))) {
                return matchesCategoryAndSub(p, category, sub);
            }
        }

        // Check category patterns for dog products
        String productCategory = p.getCategory();
        if (productCategory != null && productCategory.toLowerCase().contains("dog")) {
            return matchesCategoryAndSub(p, category, sub);
        }

        return false;
    }

    // Helper method to identify cat products
    private boolean isCatProduct(Product p, String category, String sub) {
        if (p == null || !Boolean.TRUE.equals(p.getIsActive()))
            return false;

        // Check if product type is cat
        if ("Cat".equalsIgnoreCase(p.getType()))
            return true;

        // Check metadata for cat indicators
        Map<String, Object> metadata = p.getMetadata();
        if (metadata != null) {
            Object metaType = metadata.get("type");
            Object petType = metadata.get("petType");
            if ("Cat".equalsIgnoreCase(String.valueOf(metaType)) ||
                    "Cat".equalsIgnoreCase(String.valueOf(petType))) {
                return matchesCategoryAndSub(p, category, sub);
            }
        }

        // Check category patterns for cat products
        String productCategory = p.getCategory();
        if (productCategory != null && productCategory.toLowerCase().contains("cat")) {
            return matchesCategoryAndSub(p, category, sub);
        }

        return false;
    }

    // Helper method to identify outlet products
    private boolean isOutletProduct(Product p, String category, String sub) {
        if (p == null || !Boolean.TRUE.equals(p.getIsActive()))
            return false;

        // Check if product type is outlet
        if ("Outlet".equalsIgnoreCase(p.getType()))
            return true;

        // Check metadata for outlet indicators
        Map<String, Object> metadata = p.getMetadata();
        if (metadata != null) {
            Object metaType = metadata.get("type");
            Object petType = metadata.get("petType");
            if ("Outlet".equalsIgnoreCase(String.valueOf(metaType)) ||
                    "Outlet".equalsIgnoreCase(String.valueOf(petType))) {
                return matchesCategoryAndSub(p, category, sub);
            }
        }

        return false;
    }

    // Helper method to check category and subcategory matching
    private boolean matchesCategoryAndSub(Product p, String category, String sub) {
        String productCategory = p.getCategory();
        String productSubcategory = p.getSubcategory();

        // If specific category filter provided, check it
        if (category != null && !category.isBlank() && productCategory != null) {
            if (!productCategory.toLowerCase().contains(category.toLowerCase())) {
                return false;
            }
        }

        // If specific subcategory filter provided, check it
        if (sub != null && !sub.isBlank() && productSubcategory != null) {
            if (!productSubcategory.toLowerCase().contains(sub.toLowerCase())) {
                return false;
            }
        }

        return true;
    }

    private List<Product> getFilteredProducts(String category, String sub) {
        List<Product> products;

        try {
            // Properly decode URL parameters to handle %20, +, and other encoded characters
            String decodedCategory = null;
            String decodedSub = null;

            if (category != null && !category.isBlank()) {
                decodedCategory = URLDecoder.decode(category, StandardCharsets.UTF_8);
                log.info("ProductController: Original category='{}', decoded category='{}'", category, decodedCategory);
            }

            if (sub != null && !sub.isBlank()) {
                decodedSub = URLDecoder.decode(sub, StandardCharsets.UTF_8);
                log.info("ProductController: Original sub='{}', decoded sub='{}'", sub, decodedSub);
            }

            // Use database-level filtering for better performance
            if ((decodedCategory != null && !decodedCategory.isBlank())
                    || (decodedSub != null && !decodedSub.isBlank())) {
                products = productService.getFilteredProducts(decodedCategory, decodedSub);
            } else {
                products = productService.getAll();
            }

            return products;
        } catch (Exception e) {
            log.error("ProductController: Error processing customer product request", e);
            return productService.getAll();
        }
    }

    // Overload to support type-based filtering (e.g., OUTLET)
    private List<Product> getFilteredProducts(String category, String sub, String type) {
        // Type-first filtering: if type provided, filter strictly by product.type or
        // metadata petType/type equality
        List<Product> base = getFilteredProducts(category, sub);
        if (type == null || type.isBlank())
            return base;

        final String typeParam = type.toLowerCase();
        List<Product> typed = base.stream().filter(p -> matchesTypeStrict(p, typeParam)).collect(Collectors.toList());
        return typed;
    }

    private boolean hasAvailableStock(Product product) {
        // Check if product is active and marked as in stock
        if (product.getIsActive() == null || !product.getIsActive() ||
                product.getInStock() == null || !product.getInStock()) {
            return false;
        }

        // If product has variants, check if any variant has stock
        if (product.hasVariants()) {
            return product.getVariantsInternal().stream()
                    .anyMatch(variant -> {
                        Object stockObj = variant.get("stock");
                        if (stockObj instanceof Number) {
                            return ((Number) stockObj).intValue() > 0;
                        } else if (stockObj instanceof String) {
                            try {
                                return Integer.parseInt((String) stockObj) > 0;
                            } catch (NumberFormatException e) {
                                return false;
                            }
                        }
                        return false;
                    });
        }

        // For non-variant products, check main stock quantity
        return product.getStockQuantity() != null && product.getStockQuantity() > 0;
    }

    @GetMapping
    public ResponseEntity<List<Product>> getAll(
            @RequestParam(value = "category", required = false) String category,
            @RequestParam(value = "sub", required = false) String sub,
            @RequestParam(value = "type", required = false) String type,
            @RequestParam(value = "petType", required = false) String petType) {
        // Normalize type parameter (prioritize 'type' over 'petType')
        String effectiveType = normalizeTypeParameter(type, petType);

        // Normalize category and subcategory parameters
        String normalizedCategory = normalizeParameter(category);
        String normalizedSub = normalizeParameter(sub);

        log.info("ProductController: Admin request - type: '{}', category: '{}', sub: '{}'",
                effectiveType, normalizedCategory, normalizedSub);

        List<Product> products = getFilteredProductsWithType(normalizedCategory, normalizedSub, effectiveType);

        // Enrich all products with metadata for frontend display
        products.forEach(this::enrichProductMetadata);

        log.info("ProductController: Returning {} products for admin panel", products.size());

        return ResponseEntity.ok()
                .cacheControl(CacheControl.maxAge(30, TimeUnit.SECONDS).cachePublic())
                .body(products);
    }

    @GetMapping("/test")
    public ResponseEntity<Map<String, Object>> testEndpoint() {
        Map<String, Object> response = new HashMap<>();
        response.put("message", "Backend is working!");
        response.put("timestamp", java.time.LocalDateTime.now().toString());

        List<Product> allProducts = productService.getAll();
        response.put("totalProducts", allProducts.size());

        // Debug: Show some sample products and their types
        List<Map<String, Object>> sampleProducts = new ArrayList<>();
        allProducts.stream().limit(5).forEach(p -> {
            Map<String, Object> productInfo = new HashMap<>();
            productInfo.put("id", p.getId());
            productInfo.put("name", p.getName());
            productInfo.put("type", p.getType());
            productInfo.put("category", p.getCategory());
            productInfo.put("subcategory", p.getSubcategory());

            // Check metadata for type info as well
            Map<String, Object> metadata = p.getMetadata();
            if (metadata != null) {
                productInfo.put("metadataType", metadata.get("type"));
                productInfo.put("metadataPetType", metadata.get("petType"));
            }

            sampleProducts.add(productInfo);
        });
        response.put("sampleProducts", sampleProducts);

        // Count by type
        Map<String, Long> typeCount = new HashMap<>();
        allProducts.forEach(p -> {
            String type = p.getType();
            if (type == null || type.isBlank()) {
                // Check metadata
                Map<String, Object> metadata = p.getMetadata();
                if (metadata != null) {
                    Object metaType = metadata.get("type");
                    Object petType = metadata.get("petType");
                    type = metaType != null ? metaType.toString() : (petType != null ? petType.toString() : "null");
                }
                if (type == null || type.isBlank())
                    type = "null";
            }
            typeCount.put(type, typeCount.getOrDefault(type, 0L) + 1);
        });
        response.put("typeDistribution", typeCount);

        return ResponseEntity.ok(response);
    }

    // Debug endpoint specifically for pharmacy products
    @GetMapping("/debug/pharmacy")
    public ResponseEntity<Map<String, Object>> debugPharmacyProducts() {
        Map<String, Object> response = new HashMap<>();

        // Get all products
        List<Product> allProducts = productService.getAll();

        // Find products that might be pharmacy products
        List<Product> pharmacyByType = allProducts.stream()
                .filter(p -> "Pharmacy".equalsIgnoreCase(p.getType()))
                .collect(Collectors.toList());

        List<Product> pharmacyByCategory = allProducts.stream()
                .filter(p -> {
                    String cat = p.getCategory();
                    return cat != null && (cat.toLowerCase().contains("pharmacy") ||
                            cat.toLowerCase().contains("medicine") ||
                            cat.toLowerCase().contains("supplement"));
                })
                .collect(Collectors.toList());

        List<Product> pharmacyByMetadata = allProducts.stream()
                .filter(p -> {
                    Map<String, Object> metadata = p.getMetadata();
                    if (metadata == null)
                        return false;
                    Object type = metadata.get("type");
                    Object petType = metadata.get("petType");
                    return ("Pharmacy".equalsIgnoreCase(String.valueOf(type))) ||
                            ("Pharmacy".equalsIgnoreCase(String.valueOf(petType)));
                })
                .collect(Collectors.toList());

        response.put("totalProducts", allProducts.size());
        response.put("pharmacyByType", pharmacyByType.size());
        response.put("pharmacyByCategory", pharmacyByCategory.size());
        response.put("pharmacyByMetadata", pharmacyByMetadata.size());

        // Show details of potential pharmacy products
        List<Map<String, Object>> potentialPharmacy = new ArrayList<>();
        pharmacyByCategory.stream().limit(10).forEach(p -> {
            Map<String, Object> info = new HashMap<>();
            info.put("id", p.getId());
            info.put("name", p.getName());
            info.put("type", p.getType());
            info.put("category", p.getCategory());
            info.put("subcategory", p.getSubcategory());
            info.put("isActive", p.getIsActive());
            info.put("inStock", p.getInStock());

            Map<String, Object> metadata = p.getMetadata();
            if (metadata != null) {
                info.put("metadataKeys", new ArrayList<>(metadata.keySet()));
                info.put("metadataType", metadata.get("type"));
                info.put("metadataPetType", metadata.get("petType"));
            }
            potentialPharmacy.add(info);
        });
        response.put("potentialPharmacyProducts", potentialPharmacy);

        return ResponseEntity.ok(response);
    }

    // Helper method to normalize type parameters with priority
    private String normalizeTypeParameter(String type, String petType) {
        if (type != null && !type.isBlank()) {
            return normalizeParameter(type);
        }
        if (petType != null && !petType.isBlank()) {
            return normalizeParameter(petType);
        }
        return null;
    }

    // Helper method to normalize and decode URL parameters
    private String normalizeParameter(String param) {
        if (param == null || param.isBlank()) {
            return null;
        }

        try {
            // Decode URL parameters and normalize
            String decoded = URLDecoder.decode(param, StandardCharsets.UTF_8);

            // Apply normalization mappings
            return normalizeParameterValue(decoded.trim());
        } catch (Exception e) {
            log.warn("ProductController: Failed to decode parameter '{}': {}", param, e.getMessage());
            return normalizeParameterValue(param.trim());
        }
    }

    // Helper method to apply parameter value normalization
    private String normalizeParameterValue(String value) {
        if (value == null || value.isBlank()) {
            return null;
        }

        String normalized = value.toLowerCase().trim();

        // Type normalization
        switch (normalized) {
            case "dog":
            case "dogs":
            case "canine":
                return "Dog";
            case "cat":
            case "cats":
            case "feline":
                return "Cat";
            case "pharmacy":
            case "medicine":
            case "medical":
                return "Pharmacy";
            case "outlet":
            case "clearance":
                return "Outlet";
        }

        // Category normalization
        switch (normalized) {
            case "dog-food":
            case "dogfood":
            case "food":
                return "Dog Food";
            case "cat-food":
            case "catfood":
                return "Cat Food";
            case "dog-treats":
            case "dogtreats":
            case "treats":
                return "Dog Treats";
            case "cat-treats":
            case "cattreats":
                return "Cat Treats";
            case "dog-toys":
            case "dogtoys":
            case "toys":
                return "Dog Toys";
            case "cat-toys":
            case "cattoys":
                return "Cat Toys";
            case "dog-grooming":
            case "doggrooming":
            case "grooming":
                return "Dog Grooming";
            case "cat-grooming":
            case "catgrooming":
                return "Cat Grooming";
        }

        // Subcategory normalization
        switch (normalized) {
            case "dry":
            case "dry-food":
                return "Dry Food";
            case "wet":
            case "wet-food":
                return "Wet Food";
            case "grain-free":
            case "grainfree":
                return "Grain Free";
            case "puppy":
            case "puppy-food":
                return "Puppy Food";
            case "kitten":
            case "kitten-food":
                return "Kitten Food";
            case "hypoallergenic":
            case "hypo":
                return "Hypoallergenic";
            case "veterinary":
            case "vet":
            case "veterinary-food":
                return "Veterinary Food";
            case "chicken-free":
            case "chickenfree":
                return "Chicken Free";
            default:
                // Return title case for unknown values
                return toTitleCase(value);
        }
    }

    // Helper method to convert string to title case
    private String toTitleCase(String input) {
        if (input == null || input.isEmpty()) {
            return input;
        }

        return Arrays.stream(input.split("\\s+"))
                .map(word -> word.substring(0, 1).toUpperCase() + word.substring(1).toLowerCase())
                .collect(Collectors.joining(" "));
    }

    private boolean listContainsIgnoreCase(Object maybeList, String needle) {
        if (maybeList == null)
            return false;
        if (maybeList instanceof java.util.List) {
            for (Object o : (java.util.List<?>) maybeList) {
                if (o != null && o.toString().toLowerCase().contains(needle))
                    return true;
            }
        } else {
            return maybeList.toString().toLowerCase().contains(needle);
        }
        return false;
    }

    @SuppressWarnings({ "rawtypes", "unchecked" })
    private boolean matchesCategory(Product p, String catParam) {
        if (p == null)
            return false;
        if (p.getCategory() != null && p.getCategory().toLowerCase().contains(catParam))
            return true;
        Map<String, Object> md = p.getMetadata();
        if (md != null) {
            Object petType = md.get("petType");
            if (petType != null && petType.toString().toLowerCase().contains(catParam))
                return true;

            Object filters = md.get("filters");
            if (filters instanceof Map) {
                Map f = (Map) filters;
                for (Object k : f.keySet()) {
                    Object v = f.get(k);
                    if (listContainsIgnoreCase(v, catParam))
                        return true;
                }
            }
        }
        return false;
    }

    @SuppressWarnings({ "rawtypes", "unchecked" })
    private boolean matchesSubcategory(Product p, String subParam) {
        if (p == null)
            return false;
        if (p.getSubcategory() != null && p.getSubcategory().toLowerCase().contains(subParam))
            return true;
        Map<String, Object> md = p.getMetadata();
        if (md != null) {
            Object label = md.get("subcategoryLabel");
            if (label != null && label.toString().toLowerCase().contains(subParam))
                return true;

            Object filters = md.get("filters");
            if (filters instanceof Map) {
                Map f = (Map) filters;
                for (Object k : f.keySet()) {
                    String key = k == null ? "" : k.toString().toLowerCase();
                    if (key.contains("sub")) {
                        Object v = f.get(k);
                        if (listContainsIgnoreCase(v, subParam))
                            return true;
                    }
                }
            }
        }
        return false;
    }

    // Determine whether product matches a requested type (dog/cat/pharmacy/outlet)
    @SuppressWarnings({ "rawtypes" })
    private boolean matchesTypeStrict(Product p, String typeParam) {
        if (p == null)
            return false;
        try {
            // Strict: check dedicated column, then metadata equality only
            if (p.getType() != null && p.getType().equalsIgnoreCase(typeParam))
                return true;
            Map<String, Object> md = p.getMetadata();
            if (md != null) {
                Object pt = md.get("petType");
                if (pt != null && pt.toString().equalsIgnoreCase(typeParam))
                    return true;
                Object t = md.get("type");
                if (t != null && t.toString().equalsIgnoreCase(typeParam))
                    return true;
            }
        } catch (Exception ignored) {
        }
        return false;
    }

    @GetMapping("/{id}")
    public ResponseEntity<Product> getById(@PathVariable Long id) {
        Product p = productService.getById(id);
        if (p == null)
            return ResponseEntity.notFound().build();

        // Enrich metadata with column values for frontend editing
        enrichProductMetadata(p);

        return ResponseEntity.ok()
                .cacheControl(CacheControl.maxAge(30, TimeUnit.SECONDS).cachePublic())
                .body(p);
    }

    // Enrich product metadata with values from separate columns for frontend
    // compatibility
    @SuppressWarnings("unchecked")
    private void enrichProductMetadata(Product p) {
        if (p == null)
            return;
        try {
            Map<String, Object> md = p.getMetadata();
            if (md == null)
                md = new HashMap<>();

            // Only add essential data that frontend needs for display
            // Avoid duplicating data that's already in columns

            // Add features as array format for frontend (parse JSON string back to array)
            if (p.getFeatures() != null && !p.getFeatures().isBlank()) {
                try {
                    String featuresJson = p.getFeatures();
                    if (featuresJson.startsWith("[") && featuresJson.endsWith("]")) {
                        List<String> featuresList = new ArrayList<>();
                        String content = featuresJson.substring(1, featuresJson.length() - 1);
                        if (!content.isBlank()) {
                            String[] items = content.split("\",\\s*\"");
                            for (String item : items) {
                                String cleaned = item.replace("\"", "").trim();
                                if (!cleaned.isEmpty()) {
                                    featuresList.add(cleaned);
                                }
                            }
                        }
                        md.put("features", featuresList);
                    } else {
                        List<String> featuresList = new ArrayList<>();
                        featuresList.add(featuresJson);
                        md.put("features", featuresList);
                    }
                } catch (Exception e) {
                    // On error, ensure we still set an empty array
                    md.put("features", new ArrayList<>());
                }
            } else {
                md.put("features", new ArrayList<>());
            }

            // Add nutrition object for frontend convenience
            Map<String, String> nutrition = new HashMap<>();
            if (p.getNutritionProtein() != null && !p.getNutritionProtein().isBlank()) {
                nutrition.put("protein", p.getNutritionProtein());
            }
            if (p.getNutritionFat() != null && !p.getNutritionFat().isBlank()) {
                nutrition.put("fat", p.getNutritionFat());
            }
            if (p.getNutritionFiber() != null && !p.getNutritionFiber().isBlank()) {
                nutrition.put("fiber", p.getNutritionFiber());
            }
            if (p.getNutritionMoisture() != null && !p.getNutritionMoisture().isBlank()) {
                nutrition.put("moisture", p.getNutritionMoisture());
            }
            if (p.getNutritionAsh() != null && !p.getNutritionAsh().isBlank()) {
                nutrition.put("ash", p.getNutritionAsh());
            }
            if (p.getNutritionCalories() != null && !p.getNutritionCalories().isBlank()) {
                nutrition.put("calories", p.getNutritionCalories());
            }
            if (!nutrition.isEmpty()) {
                md.put("nutrition", nutrition);
            }

            // Parse flavors and colors from JSON strings to arrays if needed
            if (p.getFlavors() != null && !p.getFlavors().isBlank()) {
                try {
                    String flavorsStr = p.getFlavors();
                    if (flavorsStr.startsWith("[") && flavorsStr.endsWith("]")) {
                        List<String> flavorsList = new ArrayList<>();
                        String content = flavorsStr.substring(1, flavorsStr.length() - 1);
                        if (!content.isBlank()) {
                            String[] items = content.split("\",\\s*\"");
                            for (String item : items) {
                                String cleaned = item.replace("\"", "").trim();
                                if (!cleaned.isEmpty()) {
                                    flavorsList.add(cleaned);
                                }
                            }
                        }
                        md.put("flavors", flavorsList);
                    }
                } catch (Exception e) {
                    // Keep as string if parsing fails
                }
            }

            if (p.getColors() != null && !p.getColors().isBlank()) {
                try {
                    String colorsStr = p.getColors();
                    if (colorsStr.startsWith("[") && colorsStr.endsWith("]")) {
                        List<String> colorsList = new ArrayList<>();
                        String content = colorsStr.substring(1, colorsStr.length() - 1);
                        if (!content.isBlank()) {
                            String[] items = content.split("\",\\s*\"");
                            for (String item : items) {
                                String cleaned = item.replace("\"", "").trim();
                                if (!cleaned.isEmpty()) {
                                    colorsList.add(cleaned);
                                }
                            }
                        }
                        md.put("colors", colorsList);
                    }
                } catch (Exception e) {
                    // Keep as string if parsing fails
                }
            }

            // Add pharmacy object for frontend convenience (include all stored pharmacy
            // columns)
            Map<String, Object> pharmacy = new HashMap<>();
            if (p.getPrescriptionRequired() != null) {
                pharmacy.put("prescriptionRequired", p.getPrescriptionRequired());
            }
            if (p.getDosageForm() != null && !p.getDosageForm().isBlank()) {
                pharmacy.put("dosageForm", p.getDosageForm());
            }
            if (p.getStrength() != null && !p.getStrength().isBlank()) {
                pharmacy.put("strength", p.getStrength());
            }
            if (p.getActiveIngredient() != null && !p.getActiveIngredient().isBlank()) {
                pharmacy.put("activeIngredient", p.getActiveIngredient());
            }
            if (p.getManufacturer() != null && !p.getManufacturer().isBlank()) {
                pharmacy.put("manufacturer", p.getManufacturer());
            }
            if (p.getIndications() != null && !p.getIndications().isBlank()) {
                pharmacy.put("indications", p.getIndications());
            }
            if (p.getContraindications() != null && !p.getContraindications().isBlank()) {
                pharmacy.put("contraindications", p.getContraindications());
            }
            if (p.getExpiryDate() != null && !p.getExpiryDate().isBlank()) {
                pharmacy.put("expiryDate", p.getExpiryDate());
            }
            if (!pharmacy.isEmpty()) {
                md.put("pharmacy", pharmacy);
            }

            // Add filters object for frontend convenience (from extracted columns)
            Map<String, Object> filters = new HashMap<>();
            if (p.getBrands() != null && !p.getBrands().isBlank()) {
                try {
                    // Parse JSON array back to List for frontend
                    String brandsStr = p.getBrands();
                    if (brandsStr.startsWith("[") && brandsStr.endsWith("]")) {
                        List<String> brandsList = new ArrayList<>();
                        String content = brandsStr.substring(1, brandsStr.length() - 1);
                        if (!content.isBlank()) {
                            String[] items = content.split("\",\\s*\"");
                            for (String item : items) {
                                String cleaned = item.replace("\"", "").trim();
                                if (!cleaned.isEmpty()) {
                                    brandsList.add(cleaned);
                                }
                            }
                        }
                        filters.put("brands", brandsList);
                    }
                } catch (Exception e) {
                    // Keep as string if parsing fails
                }
            }
            if (p.getProductWeights() != null && !p.getProductWeights().isBlank()) {
                try {
                    String weightsStr = p.getProductWeights();
                    if (weightsStr.startsWith("[") && weightsStr.endsWith("]")) {
                        List<String> weightsList = new ArrayList<>();
                        String content = weightsStr.substring(1, weightsStr.length() - 1);
                        if (!content.isBlank()) {
                            String[] items = content.split("\",\\s*\"");
                            for (String item : items) {
                                String cleaned = item.replace("\"", "").trim();
                                if (!cleaned.isEmpty()) {
                                    weightsList.add(cleaned);
                                }
                            }
                        }
                        filters.put("weights", weightsList);
                    }
                } catch (Exception e) {
                    // Keep as string if parsing fails
                }
            }
            if (p.getPriceRanges() != null && !p.getPriceRanges().isBlank()) {
                try {
                    String priceRangesStr = p.getPriceRanges();
                    if (priceRangesStr.startsWith("[") && priceRangesStr.endsWith("]")) {
                        List<String> priceRangesList = new ArrayList<>();
                        String content = priceRangesStr.substring(1, priceRangesStr.length() - 1);
                        if (!content.isBlank()) {
                            String[] items = content.split("\",\\s*\"");
                            for (String item : items) {
                                String cleaned = item.replace("\"", "").trim();
                                if (!cleaned.isEmpty()) {
                                    priceRangesList.add(cleaned);
                                }
                            }
                        }
                        filters.put("priceRanges", priceRangesList);
                    }
                } catch (Exception e) {
                    // Keep as string if parsing fails
                }
            }
            // Add other filter fields as needed by frontend
            if (p.getLifeStages() != null && !p.getLifeStages().isBlank()) {
                try {
                    String lifeStagesStr = p.getLifeStages();
                    if (lifeStagesStr.startsWith("[") && lifeStagesStr.endsWith("]")) {
                        List<String> lifeStagesList = new ArrayList<>();
                        String content = lifeStagesStr.substring(1, lifeStagesStr.length() - 1);
                        if (!content.isBlank()) {
                            String[] items = content.split("\",\\s*\"");
                            for (String item : items) {
                                String cleaned = item.replace("\"", "").trim();
                                if (!cleaned.isEmpty()) {
                                    lifeStagesList.add(cleaned);
                                }
                            }
                        }
                        filters.put("lifeStages", lifeStagesList);
                    }
                } catch (Exception e) {
                }
            }
            if (!filters.isEmpty()) {
                md.put("filters", filters);
            }

            // Update metadata back to product
            p.setMetadata(md);

        } catch (Exception e) {
            try {
                log.warn("Failed to enrich product metadata for {}: {}", p.getId(), e.getMessage());
            } catch (Exception ignored) {
            }
        }
    }

    @GetMapping("/{id}/stock")
    public ResponseEntity<Map<String, Object>> getStockInfo(@PathVariable Long id) {
        Product p = productService.getById(id);
        if (p == null)
            return ResponseEntity.notFound().build();

        Map<String, Object> stockInfo = new HashMap<>();
        stockInfo.put("productId", p.getId());
        stockInfo.put("productName", p.getName());
        stockInfo.put("inStock", p.getInStock());
        stockInfo.put("stockQuantity", p.getStockQuantity());
        stockInfo.put("isActive", p.getIsActive());

        // Calculate if product is available
        boolean available = true;
        String status = "In Stock";

        if (p.getInStock() != null && !p.getInStock()) {
            available = false;
            status = "Explicitly marked as out of stock";
        } else if (p.getStockQuantity() != null && p.getStockQuantity() <= 0) {
            available = false;
            status = "Stock quantity is " + p.getStockQuantity();
        } else if (!p.getIsActive()) {
            available = false;
            status = "Product is inactive";
        }

        stockInfo.put("available", available);
        stockInfo.put("status", status);

        return ResponseEntity.ok(stockInfo);
    }

    @PostMapping(consumes = { "multipart/form-data" })
    public ResponseEntity<Product> create(
            @RequestPart("product") Product p,
            @RequestParam(value = "image", required = false) MultipartFile imageFile,
            @RequestParam(value = "images", required = false) MultipartFile[] images) throws IOException {
        // Normalize and extract all fields from metadata to separate columns
        normalizeAndExtractFields(p);

        // Filter out null/empty fields before saving
        filterNullFields(p);
        // Support both single 'image' (backwards compatibility) and multiple 'images'
        // If UPLOAD_DIR env var is set we prefer local storage for development
        boolean preferLocal = System.getenv("UPLOAD_DIR") != null && !System.getenv("UPLOAD_DIR").isEmpty();
        if (images != null && images.length > 0) {
            // Filter and upload only valid image files; ignore others
            List<MultipartFile> imgs = new java.util.ArrayList<>();
            for (MultipartFile m : images) {
                if (m == null || m.isEmpty())
                    continue;
                if (storageService.isImage(m) || storageService.detectImageExtension(m) != null) {
                    imgs.add(m);
                } else {
                    try {
                        log.warn("Ignoring non-image upload part: {}", m.getOriginalFilename());
                    } catch (Exception ignored) {
                    }
                }
            }
            List<String> urls = imagesWithUpload(imgs.toArray(new MultipartFile[0]));
            if (!urls.isEmpty()) {
                // store full list in metadata and keep first as imageUrl for legacy
                p.getMetadata().put("images", urls);
                p.setImageUrl(urls.get(0));
            }
        } else if (imageFile != null && !imageFile.isEmpty()) {
            if (!storageService.isImage(imageFile) && storageService.detectImageExtension(imageFile) == null) {
                try {
                    log.warn("Ignoring non-image single upload: {}", imageFile.getOriginalFilename());
                } catch (Exception ignored) {
                }
            } else {
                String imageUrl = null;

                // Debug logging for S3 service availability
                if (s3ImageService == null) {
                    log.warn("S3ImageService is NULL. Skipping S3 upload. Check if 'aws.region' property is set.");
                } else {
                    log.info("S3ImageService is ACTIVE. Attempting S3 upload...");
                }

                // Try S3 first (primary storage) if available
                if (s3ImageService != null) {
                    try {
                        imageUrl = s3ImageService.uploadProductImage(imageFile);
                        p.getMetadata().put("images", java.util.List.of(imageUrl));
                        p.setImageUrl(imageUrl);
                        log.info("Successfully uploaded single image to S3: {}", imageUrl);
                    } catch (Exception s3e) {
                        log.warn("S3 upload failed for single image: {}", s3e.getMessage());
                    }
                }

                // Fallback to Cloudinary if S3 is not available or failed
                if (imageUrl == null) {
                    try {
                        com.eduprajna.service.CloudinaryStorageService.UploadResult cres = cloudinaryStorageService
                                .upload(imageFile);
                        if (cres != null && cres.getUrl() != null) {
                            imageUrl = cres.getUrl();
                            p.setImageUrl(cres.getUrl());
                            p.setImagePublicId(cres.getPublicId());
                            p.getMetadata().put("images", java.util.List.of(cres.getUrl()));
                            log.info("Successfully uploaded single image to Cloudinary as fallback: {}", imageUrl);
                        }
                    } catch (Exception ce) {
                        log.warn("Cloudinary upload also failed, trying local storage: {}", ce.getMessage());

                        // Final fallback to local storage
                        try {
                            String local = storageService.store(imageFile);
                            if (local != null) {
                                imageUrl = local;
                                p.getMetadata().put("images", java.util.List.of(local));
                                p.setImageUrl(local);
                                log.info("Successfully stored single image locally as final fallback: {}", imageUrl);
                            }
                        } catch (Exception se) {
                            log.error("All storage methods failed for single image: {}", se.getMessage());
                        }
                    }
                }
            }
        }

        // Save the product
        Product saved = productService.save(p);

        // Enrich metadata with column values for frontend display
        enrichProductMetadata(saved);

        return ResponseEntity.ok(saved);
    }

    @PutMapping(value = "/{id}", consumes = { "multipart/form-data" })
    public ResponseEntity<Product> update(
            @PathVariable Long id,
            @RequestPart("product") Product p,
            @RequestParam(value = "image", required = false) MultipartFile imageFile,
            @RequestParam(value = "images", required = false) MultipartFile[] images) throws IOException {
        p.setId(id);

        // Preserve existing images from metadata before normalization
        List<String> existingImages = new ArrayList<>();
        if (p.getMetadata() != null && p.getMetadata().get("images") instanceof List) {
            try {
                List<?> imgList = (List<?>) p.getMetadata().get("images");
                for (Object img : imgList) {
                    if (img != null)
                        existingImages.add(img.toString());
                }
            } catch (Exception e) {
                try {
                    log.warn("Failed to preserve existing images: {}", e.getMessage());
                } catch (Exception ignored) {
                }
            }
        }

        // Normalize and extract all fields from metadata to separate columns
        normalizeAndExtractFields(p);

        // Filter out null/empty fields before saving
        filterNullFields(p);

        if (images != null && images.length > 0) {
            for (MultipartFile m : images) {
                if (m != null && !m.isEmpty() && !storageService.isImage(m)) {
                    return ResponseEntity.badRequest().build();
                }
            }
            List<String> newUrls = imagesWithUpload(images);
            if (!newUrls.isEmpty()) {
                // Smart merge: combine existing and new, removing ALL duplicates
                List<String> allImages = new ArrayList<>(existingImages);
                allImages.addAll(newUrls);

                // Remove duplicates by content (not just URL) - more sophisticated
                // deduplication
                List<String> uniqueImages = removeDuplicateImageUrls(allImages);

                p.getMetadata().put("images", uniqueImages);
                p.setImageUrl(uniqueImages.get(0));

                log.info("Updated product with {} unique images (had {} total before deduplication)",
                        uniqueImages.size(), allImages.size());
            } else if (!existingImages.isEmpty()) {
                // No new images, but clean up existing duplicates
                List<String> uniqueImages = removeDuplicateImageUrls(existingImages);
                p.getMetadata().put("images", uniqueImages);
                p.setImageUrl(uniqueImages.get(0));
            }
        } else if (imageFile != null && !imageFile.isEmpty()) {
            if (!storageService.isImage(imageFile)) {
                return ResponseEntity.badRequest().build();
            }

            String imageUrl = null;

            // Debug logging for S3 service availability
            if (s3ImageService == null) {
                log.warn("S3ImageService is NULL (update). Skipping S3 upload. Check if 'aws.region' property is set.");
            } else {
                log.info("S3ImageService is ACTIVE (update). Attempting S3 upload...");
            }

            // Try S3 first (primary storage) if available
            if (s3ImageService != null) {
                try {
                    imageUrl = s3ImageService.uploadProductImage(imageFile);
                    p.getMetadata().put("images", java.util.List.of(imageUrl));
                    p.setImageUrl(imageUrl);
                    log.info("Successfully uploaded update image to S3: {}", imageUrl);
                } catch (Exception s3e) {
                    log.warn("S3 upload failed for update image: {}", s3e.getMessage());
                }
            }

            // Fallback to Cloudinary if S3 is not available or failed
            if (imageUrl == null) {
                try {
                    com.eduprajna.service.CloudinaryStorageService.UploadResult res = cloudinaryStorageService
                            .upload(imageFile);
                    if (res != null) {
                        imageUrl = res.getUrl();
                        p.setImageUrl(res.getUrl());
                        p.setImagePublicId(res.getPublicId());
                        p.getMetadata().put("images", java.util.List.of(res.getUrl()));
                        log.info("Successfully uploaded update image to Cloudinary as fallback: {}", imageUrl);
                    }
                } catch (Exception ce) {
                    log.warn("Cloudinary upload also failed, trying local storage: {}", ce.getMessage());

                    // Final fallback to local storage
                    try {
                        String local = storageService.store(imageFile);
                        if (local != null) {
                            imageUrl = local;
                            p.getMetadata().put("images", java.util.List.of(local));
                            p.setImageUrl(local);
                            log.info("Successfully stored update image locally as final fallback: {}", imageUrl);
                        }
                    } catch (Exception se) {
                        log.error("All storage methods failed for update image: {}", se.getMessage());
                    }
                }
            }
        } else if (!existingImages.isEmpty()) {
            // No new images uploaded, preserve existing images
            p.getMetadata().put("images", existingImages);
            if (p.getImageUrl() == null || p.getImageUrl().isEmpty()) {
                p.setImageUrl(existingImages.get(0));
            }
        }

        // Save the product
        Product saved = productService.save(p);

        // Enrich metadata with column values for frontend display
        enrichProductMetadata(saved);

        return ResponseEntity.ok(saved);
    }

    /**
     * Patch endpoint to update a single variant's stock count.
     * This avoids multipart handling when only a simple numeric update is needed.
     */
    @PatchMapping("/{id}/variant/{variantId}/stock")
    public ResponseEntity<Product> updateVariantStock(
            @PathVariable Long id,
            @PathVariable String variantId,
            @RequestParam("stock") Integer stock) {
        try {
            Product existing = productService.getById(id);
            if (existing == null)
                return ResponseEntity.notFound().build();

            // Ensure metadata and variants structure
            Map<String, Object> md = existing.getMetadata();
            if (md == null)
                md = new java.util.HashMap<>();
            Object variantsObj = md.get("variants");
            if (!(variantsObj instanceof java.util.List)) {
                // if variants missing, nothing to update
                return ResponseEntity.badRequest().build();
            }

            @SuppressWarnings("unchecked")
            java.util.List<Map<String, Object>> variants = (java.util.List<Map<String, Object>>) variantsObj;
            boolean found = false;
            for (Map<String, Object> v : variants) {
                Object vid = v.get("id");
                if (vid != null && vid.toString().equals(variantId)) {
                    // store as Integer or String - prefer integer
                    v.put("stock", stock);
                    found = true;
                    break;
                }
            }

            if (!found)
                return ResponseEntity.notFound().build();

            // persist changes
            existing.setMetadata(md);
            Product saved = productService.save(existing);
            return ResponseEntity.ok(saved);
        } catch (Exception e) {
            try {
                log.error("Failed to update variant stock", e);
            } catch (Exception ignored) {
            }
            return ResponseEntity.status(500).build();
        }
    }

    // Normalize and extract all fields from metadata to separate columns
    @SuppressWarnings({ "rawtypes", "unchecked" })
    private void normalizeAndExtractFields(Product p) {
        if (p == null)
            return;
        try {
            Map<String, Object> md = p.getMetadata();
            if (md == null)
                md = new HashMap<>();

            // Extract type (Dog/Cat/Pharmacy/Outlet) to separate column
            String t = p.getType();
            if ((t == null || t.isBlank()) && md != null) {
                Object mv = md.get("type");
                if (mv != null) {
                    p.setType(mv.toString());
                }
                // Remove type from metadata to avoid duplication
                md.remove("type");
            }

            // Extract foodType (Veg/Non-Veg) to separate column - prioritize top-level,
            // then metadata
            String foodType = p.getFoodType();
            if (foodType == null || foodType.isBlank()) {
                Object ft = md.get("foodType");
                if (ft != null)
                    foodType = ft.toString();
            }
            if (foodType != null && !foodType.isBlank()) {
                // Normalize foodType values
                if ("VEG".equalsIgnoreCase(foodType) || "Veg".equalsIgnoreCase(foodType)) {
                    p.setFoodType("Veg");
                } else if ("NON_VEG".equalsIgnoreCase(foodType) || "Non-Veg".equalsIgnoreCase(foodType)
                        || "Non-VEG".equalsIgnoreCase(foodType)) {
                    p.setFoodType("Non-Veg");
                } else {
                    p.setFoodType(foodType);
                }
            }

            // Extract features array to features column (store as JSON string)
            // Check both top-level features field and metadata.features
            Object featuresObj = md.get("features");
            if (featuresObj != null) {
                if (featuresObj instanceof List) {
                    // Convert List to JSON array string format: ["feature1", "feature2"]
                    List<?> featuresList = (List<?>) featuresObj;
                    if (!featuresList.isEmpty()) {
                        StringBuilder jsonBuilder = new StringBuilder("[");
                        boolean first = true;
                        for (Object feature : featuresList) {
                            if (feature != null && !feature.toString().trim().isEmpty()) {
                                if (!first)
                                    jsonBuilder.append(", ");
                                jsonBuilder.append("\"").append(feature.toString().replace("\"", "\\\"")).append("\"");
                                first = false;
                            }
                        }
                        jsonBuilder.append("]");
                        p.setFeatures(jsonBuilder.toString());
                    }
                } else if (featuresObj instanceof String && !((String) featuresObj).isBlank()) {
                    p.setFeatures((String) featuresObj);
                }
            }

            // Extract nutrition information to separate columns
            // Check both top-level and metadata for nutrition data
            Object nutritionObj = md.get("nutrition");
            if (nutritionObj instanceof Map) {
                Map<String, Object> nutrition = (Map<String, Object>) nutritionObj;

                Object protein = nutrition.get("protein");
                if (protein != null && !protein.toString().isBlank()) {
                    p.setNutritionProtein(protein.toString());
                }

                Object fat = nutrition.get("fat");
                if (fat != null && !fat.toString().isBlank()) {
                    p.setNutritionFat(fat.toString());
                }

                Object fiber = nutrition.get("fiber");
                if (fiber != null && !fiber.toString().isBlank()) {
                    p.setNutritionFiber(fiber.toString());
                }

                Object moisture = nutrition.get("moisture");
                if (moisture != null && !moisture.toString().isBlank()) {
                    p.setNutritionMoisture(moisture.toString());
                }

                Object ash = nutrition.get("ash");
                if (ash != null && !ash.toString().isBlank()) {
                    p.setNutritionAsh(ash.toString());
                }

                Object calories = nutrition.get("calories");
                if (calories != null && !calories.toString().isBlank()) {
                    p.setNutritionCalories(calories.toString());
                }
            }

            // Extract pet and product attribute fields to separate columns
            Object petTypeObj = md.get("petType");
            if (petTypeObj != null && !petTypeObj.toString().isBlank()) {
                p.setPetType(petTypeObj.toString());
            }

            Object materialObj = md.get("material");
            if (materialObj != null && !materialObj.toString().isBlank()) {
                p.setMaterial(materialObj.toString());
            }

            Object scentObj = md.get("scent");
            if (scentObj != null && !scentObj.toString().isBlank()) {
                p.setScent(scentObj.toString());
            }

            Object suitableForObj = md.get("suitableFor");
            if (suitableForObj != null && !suitableForObj.toString().isBlank()) {
                p.setSuitableFor(suitableForObj.toString());
            }

            Object treatTypeObj = md.get("treatType");
            if (treatTypeObj != null && !treatTypeObj.toString().isBlank()) {
                p.setTreatType(treatTypeObj.toString());
            }

            Object textureObj = md.get("texture");
            if (textureObj != null && !textureObj.toString().isBlank()) {
                p.setTexture(textureObj.toString());
            }

            Object subcategoryLabelObj = md.get("subcategoryLabel");
            if (subcategoryLabelObj != null && !subcategoryLabelObj.toString().isBlank()) {
                p.setSubcategoryLabel(subcategoryLabelObj.toString());
            }

            Object servingSizeObj = md.get("servingSize");
            if (servingSizeObj != null && !servingSizeObj.toString().isBlank()) {
                p.setServingSize(servingSizeObj.toString());
            }

            Object packCountObj = md.get("packCount");
            if (packCountObj != null && !packCountObj.toString().isBlank()) {
                p.setPackCount(packCountObj.toString());
            }

            Object weightUnitObj = md.get("weightUnit");
            if (weightUnitObj != null && !weightUnitObj.toString().isBlank()) {
                p.setWeightUnit(weightUnitObj.toString());
            }

            // Extract flavors and colors (can be arrays or strings)
            Object flavorsObj = md.get("flavors");
            if (flavorsObj != null) {
                if (flavorsObj instanceof List) {
                    List<?> flavorsList = (List<?>) flavorsObj;
                    if (!flavorsList.isEmpty()) {
                        StringBuilder jsonBuilder = new StringBuilder("[");
                        boolean first = true;
                        for (Object flavor : flavorsList) {
                            if (flavor != null && !flavor.toString().trim().isEmpty()) {
                                if (!first)
                                    jsonBuilder.append(", ");
                                jsonBuilder.append("\"").append(flavor.toString().replace("\"", "\\\"")).append("\"");
                                first = false;
                            }
                        }
                        jsonBuilder.append("]");
                        p.setFlavors(jsonBuilder.toString());
                    }
                } else if (!flavorsObj.toString().isBlank()) {
                    p.setFlavors(flavorsObj.toString());
                }
            }

            Object colorsObj = md.get("colors");
            if (colorsObj != null) {
                if (colorsObj instanceof List) {
                    List<?> colorsList = (List<?>) colorsObj;
                    if (!colorsList.isEmpty()) {
                        StringBuilder jsonBuilder = new StringBuilder("[");
                        boolean first = true;
                        for (Object color : colorsList) {
                            if (color != null && !color.toString().trim().isEmpty()) {
                                if (!first)
                                    jsonBuilder.append(", ");
                                jsonBuilder.append("\"").append(color.toString().replace("\"", "\\\"")).append("\"");
                                first = false;
                            }
                        }
                        jsonBuilder.append("]");
                        p.setColors(jsonBuilder.toString());
                    }
                } else if (!colorsObj.toString().isBlank()) {
                    p.setColors(colorsObj.toString());
                }
            }

            // Extract pharmacy fields from metadata.pharmacy object
            Object pharmacyObj = md.get("pharmacy");
            if (pharmacyObj instanceof Map) {
                Map<String, Object> pharmacy = (Map<String, Object>) pharmacyObj;

                Object prescriptionReq = pharmacy.get("prescriptionRequired");
                if (prescriptionReq != null) {
                    p.setPrescriptionRequired(Boolean.parseBoolean(prescriptionReq.toString()));
                }

                Object dosageForm = pharmacy.get("dosageForm");
                if (dosageForm != null && !dosageForm.toString().isBlank()) {
                    p.setDosageForm(dosageForm.toString());
                }

                Object strength = pharmacy.get("strength");
                if (strength != null && !strength.toString().isBlank()) {
                    p.setStrength(strength.toString());
                }

                Object activeIngredient = pharmacy.get("activeIngredient");
                if (activeIngredient != null && !activeIngredient.toString().isBlank()) {
                    p.setActiveIngredient(activeIngredient.toString());
                }

                Object manufacturer = pharmacy.get("manufacturer");
                if (manufacturer != null && !manufacturer.toString().isBlank()) {
                    p.setManufacturer(manufacturer.toString());
                }

                Object indications = pharmacy.get("indications");
                if (indications != null && !indications.toString().isBlank()) {
                    p.setIndications(indications.toString());
                }

                Object contraindications = pharmacy.get("contraindications");
                if (contraindications != null && !contraindications.toString().isBlank()) {
                    p.setContraindications(contraindications.toString());
                }

                Object expiryDate = pharmacy.get("expiryDate");
                if (expiryDate != null && !expiryDate.toString().isBlank()) {
                    p.setExpiryDate(expiryDate.toString());
                }
            }

            // Extract filter information from metadata.filters to separate columns for
            // efficient querying
            Object filtersObj = md.get("filters");
            if (filtersObj instanceof Map) {
                Map<String, Object> filters = (Map<String, Object>) filtersObj;

                // Extract brands array
                Object brandsObj = filters.get("brands");
                if (brandsObj instanceof List) {
                    List<?> brandsList = (List<?>) brandsObj;
                    if (!brandsList.isEmpty()) {
                        StringBuilder jsonBuilder = new StringBuilder("[");
                        boolean first = true;
                        for (Object brand : brandsList) {
                            if (brand != null && !brand.toString().trim().isEmpty()) {
                                if (!first)
                                    jsonBuilder.append(", ");
                                jsonBuilder.append("\"").append(brand.toString().replace("\"", "\\\"")).append("\"");
                                first = false;
                            }
                        }
                        jsonBuilder.append("]");
                        p.setBrands(jsonBuilder.toString());
                    }
                }

                // Extract lifeStages array
                Object lifeStagesObj = filters.get("lifeStages");
                if (lifeStagesObj instanceof List) {
                    List<?> lifeStagesList = (List<?>) lifeStagesObj;
                    if (!lifeStagesList.isEmpty()) {
                        StringBuilder jsonBuilder = new StringBuilder("[");
                        boolean first = true;
                        for (Object stage : lifeStagesList) {
                            if (stage != null && !stage.toString().trim().isEmpty()) {
                                if (!first)
                                    jsonBuilder.append(", ");
                                jsonBuilder.append("\"").append(stage.toString().replace("\"", "\\\"")).append("\"");
                                first = false;
                            }
                        }
                        jsonBuilder.append("]");
                        p.setLifeStages(jsonBuilder.toString());
                    }
                }

                // Extract breedSizes array
                Object breedSizesObj = filters.get("breedSizes");
                if (breedSizesObj instanceof List) {
                    List<?> breedSizesList = (List<?>) breedSizesObj;
                    if (!breedSizesList.isEmpty()) {
                        StringBuilder jsonBuilder = new StringBuilder("[");
                        boolean first = true;
                        for (Object size : breedSizesList) {
                            if (size != null && !size.toString().trim().isEmpty()) {
                                if (!first)
                                    jsonBuilder.append(", ");
                                jsonBuilder.append("\"").append(size.toString().replace("\"", "\\\"")).append("\"");
                                first = false;
                            }
                        }
                        jsonBuilder.append("]");
                        p.setBreedSizes(jsonBuilder.toString());
                    }
                }

                // Extract specialDiets array
                Object specialDietsObj = filters.get("specialDiets");
                if (specialDietsObj instanceof List) {
                    List<?> specialDietsList = (List<?>) specialDietsObj;
                    if (!specialDietsList.isEmpty()) {
                        StringBuilder jsonBuilder = new StringBuilder("[");
                        boolean first = true;
                        for (Object diet : specialDietsList) {
                            if (diet != null && !diet.toString().trim().isEmpty()) {
                                if (!first)
                                    jsonBuilder.append(", ");
                                jsonBuilder.append("\"").append(diet.toString().replace("\"", "\\\"")).append("\"");
                                first = false;
                            }
                        }
                        jsonBuilder.append("]");
                        p.setSpecialDiets(jsonBuilder.toString());
                    }
                }

                // Extract proteinSource array
                Object proteinSourceObj = filters.get("proteinSource");
                if (proteinSourceObj instanceof List) {
                    List<?> proteinSourceList = (List<?>) proteinSourceObj;
                    if (!proteinSourceList.isEmpty()) {
                        StringBuilder jsonBuilder = new StringBuilder("[");
                        boolean first = true;
                        for (Object protein : proteinSourceList) {
                            if (protein != null && !protein.toString().trim().isEmpty()) {
                                if (!first)
                                    jsonBuilder.append(", ");
                                jsonBuilder.append("\"").append(protein.toString().replace("\"", "\\\"")).append("\"");
                                first = false;
                            }
                        }
                        jsonBuilder.append("]");
                        p.setProteinSources(jsonBuilder.toString());
                    }
                }

                // Extract weights array
                Object weightsObj = filters.get("weights");
                if (weightsObj instanceof List) {
                    List<?> weightsList = (List<?>) weightsObj;
                    if (!weightsList.isEmpty()) {
                        StringBuilder jsonBuilder = new StringBuilder("[");
                        boolean first = true;
                        for (Object weight : weightsList) {
                            if (weight != null && !weight.toString().trim().isEmpty()) {
                                if (!first)
                                    jsonBuilder.append(", ");
                                jsonBuilder.append("\"").append(weight.toString().replace("\"", "\\\"")).append("\"");
                                first = false;
                            }
                        }
                        jsonBuilder.append("]");
                        p.setProductWeights(jsonBuilder.toString());
                    }
                }

                // Extract priceRanges array
                Object priceRangesObj = filters.get("priceRanges");
                if (priceRangesObj instanceof List) {
                    List<?> priceRangesList = (List<?>) priceRangesObj;
                    if (!priceRangesList.isEmpty()) {
                        StringBuilder jsonBuilder = new StringBuilder("[");
                        boolean first = true;
                        for (Object range : priceRangesList) {
                            if (range != null && !range.toString().trim().isEmpty()) {
                                if (!first)
                                    jsonBuilder.append(", ");
                                jsonBuilder.append("\"").append(range.toString().replace("\"", "\\\"")).append("\"");
                                first = false;
                            }
                        }
                        jsonBuilder.append("]");
                        p.setPriceRanges(jsonBuilder.toString());
                    }
                }
            }

            // Ensure metadata doesn't duplicate data stored in columns - remove redundant
            // entries
            // Keep variants and images in metadata as they are complex structures
            if (p.getFeatures() != null && !p.getFeatures().isBlank()) {
                md.remove("features");
            }
            if (p.getPetType() != null && !p.getPetType().isBlank()) {
                md.remove("petType");
            }
            if (p.getMaterial() != null && !p.getMaterial().isBlank()) {
                md.remove("material");
            }
            if (p.getScent() != null && !p.getScent().isBlank()) {
                md.remove("scent");
            }
            if (p.getSuitableFor() != null && !p.getSuitableFor().isBlank()) {
                md.remove("suitableFor");
            }
            if (p.getTreatType() != null && !p.getTreatType().isBlank()) {
                md.remove("treatType");
            }
            if (p.getTexture() != null && !p.getTexture().isBlank()) {
                md.remove("texture");
            }
            if (p.getSubcategoryLabel() != null && !p.getSubcategoryLabel().isBlank()) {
                md.remove("subcategoryLabel");
            }
            if (p.getServingSize() != null && !p.getServingSize().isBlank()) {
                md.remove("servingSize");
            }
            if (p.getPackCount() != null && !p.getPackCount().isBlank()) {
                md.remove("packCount");
            }
            if (p.getWeightUnit() != null && !p.getWeightUnit().isBlank()) {
                md.remove("weightUnit");
            }
            if (p.getFlavors() != null && !p.getFlavors().isBlank()) {
                md.remove("flavors");
            }
            if (p.getColors() != null && !p.getColors().isBlank()) {
                md.remove("colors");
            }
            if (p.getPrescriptionRequired() != null || p.getDosageForm() != null ||
                    p.getStrength() != null || p.getActiveIngredient() != null ||
                    p.getManufacturer() != null || p.getIndications() != null ||
                    p.getContraindications() != null || p.getExpiryDate() != null) {
                md.remove("pharmacy");
            }
            // Remove filters from metadata after extracting to columns
            if (p.getBrands() != null || p.getLifeStages() != null ||
                    p.getBreedSizes() != null || p.getSpecialDiets() != null ||
                    p.getProteinSources() != null || p.getProductWeights() != null ||
                    p.getPriceRanges() != null) {
                md.remove("filters");
            }
            if (p.getNutritionProtein() != null || p.getNutritionFat() != null ||
                    p.getNutritionFiber() != null || p.getNutritionMoisture() != null ||
                    p.getNutritionAsh() != null || p.getNutritionCalories() != null) {
                // Keep nutrition in metadata for backward compatibility but mark as extracted
                // Don't remove it as it might be used by frontend
            }

            // Validate and ensure variants are properly stored
            Object variantsObj = md.get("variants");
            int variantCount = 0;
            if (variantsObj instanceof List) {
                List<?> variantsList = (List<?>) variantsObj;
                variantCount = variantsList.size();

                // Validate each variant has minimum required fields (lenient validation)
                for (int i = 0; i < variantsList.size(); i++) {
                    Object variantObj = variantsList.get(i);
                    if (variantObj instanceof Map) {
                        Map<?, ?> variant = (Map<?, ?>) variantObj;

                        // Log variant details for debugging
                        try {
                            log.debug("Variant {}: id={}, weight={}, size={}, price={}, stock={}",
                                    i + 1,
                                    variant.get("id"),
                                    variant.get("weight"),
                                    variant.get("size"),
                                    variant.get("price"),
                                    variant.get("stock"));
                        } catch (Exception ignored) {
                        }

                        // Optional: Warn if variant is missing important fields
                        if (!variant.containsKey("id") || variant.get("id") == null) {
                            log.warn("Variant {} is missing 'id' field", i + 1);
                        }
                        if (!variant.containsKey("price") && !variant.containsKey("originalPrice")) {
                            log.warn("Variant {} is missing price information", i + 1);
                        }
                        if (!variant.containsKey("stock")) {
                            log.warn("Variant {} is missing 'stock' field, defaulting to 0", i + 1);
                        }
                    }
                }

                // Recalculate total stock from variants
                int totalStock = 0;
                for (Object varObj : variantsList) {
                    if (varObj instanceof Map) {
                        Map<?, ?> variant = (Map<?, ?>) varObj;
                        Object stockObj = variant.get("stock");
                        if (stockObj != null) {
                            try {
                                if (stockObj instanceof Number) {
                                    totalStock += ((Number) stockObj).intValue();
                                } else {
                                    totalStock += Integer.parseInt(stockObj.toString());
                                }
                            } catch (NumberFormatException e) {
                                log.warn("Invalid stock value for variant {}: {}", variant.get("id"), stockObj);
                            }
                        }
                    }
                }

                // Update product stock from variants
                p.setStockQuantity(totalStock);
                p.setInStock(totalStock > 0);

                try {
                    log.info("Variants processed: {} variants found, total stock: {}, inStock: {}",
                            variantCount, totalStock, p.getInStock());
                } catch (Exception ignored) {
                }
            }

            // Validate required fields
            if (p.getName() == null || p.getName().isBlank()) {
                throw new IllegalArgumentException("Product name is required");
            }
            if (p.getBrand() == null || p.getBrand().isBlank()) {
                throw new IllegalArgumentException("Product brand is required");
            }
            if (p.getType() == null || p.getType().isBlank()) {
                throw new IllegalArgumentException("Product type (Dog/Cat/Pharmacy/Outlet) is required");
            }

            // foodType is optional - only applies to food products
            if (p.getFoodType() == null || p.getFoodType().isBlank()) {
                log.debug("Product foodType not provided, setting to null");
                p.setFoodType(null);
            }

            // Update metadata back to product (this includes variants)
            p.setMetadata(md);

            try {
                log.info(
                        "Product normalized - name: {}, brand: {}, type: {}, foodType: {}, features: {}, nutrition: {}/{}/{}/{}/{}/{}, variants: {}",
                        p.getName(), p.getBrand(), p.getType(), p.getFoodType(),
                        (p.getFeatures() != null ? "present" : "null"),
                        p.getNutritionProtein(), p.getNutritionFat(), p.getNutritionFiber(),
                        p.getNutritionMoisture(), p.getNutritionAsh(), p.getNutritionCalories(),
                        variantCount);
            } catch (Exception ignored) {
            }
        } catch (IllegalArgumentException e) {
            // Re-throw validation errors
            throw e;
        } catch (Exception e) {
            try {
                log.error("Error normalizing product fields: {}", e.getMessage(), e);
            } catch (Exception ignored) {
            }
            throw new IllegalStateException("Failed to process product data: " + e.getMessage());
        }
    }

    // Helper to upload multiple files and return their URLs with content-based
    // deduplication
    private List<String> imagesWithUpload(MultipartFile[] images) {
        List<String> urls = new java.util.ArrayList<>();
        Set<String> contentHashes = new HashSet<>(); // Track content to prevent duplicates

        for (MultipartFile img : images) {
            try {
                if (img == null || img.isEmpty())
                    continue;

                // Calculate content hash to check for duplicates
                String contentHash = calculateImageHash(img);
                if (contentHashes.contains(contentHash)) {
                    log.info("Skipping duplicate image based on content hash: {}", contentHash);
                    continue; // Skip if we already processed this image content
                }
                contentHashes.add(contentHash);

                String finalUrl = null;

                // Try S3 first (primary storage for production) if available
                if (s3ImageService != null) {
                    try {
                        finalUrl = s3ImageService.uploadProductImage(img);
                        log.info("Successfully uploaded image to S3: {}", finalUrl);
                    } catch (Exception s3e) {
                        log.warn("S3 upload failed: {}", s3e.getMessage());
                    }
                }

                // Fallback to Cloudinary if S3 is not available or failed
                if (finalUrl == null) {
                    try {
                        com.eduprajna.service.CloudinaryStorageService.UploadResult res = cloudinaryStorageService
                                .upload(img);
                        if (res != null && res.getUrl() != null) {
                            finalUrl = res.getUrl();
                            log.info("Successfully uploaded image to Cloudinary as fallback: {}", finalUrl);
                        }
                    } catch (Exception ce) {
                        log.warn("Cloudinary upload also failed, trying local storage: {}", ce.getMessage());

                        // Final fallback to local storage
                        try {
                            finalUrl = storageService.store(img);
                            log.info("Stored image locally as final fallback: {}", finalUrl);
                        } catch (Exception le) {
                            log.error(
                                    "All storage methods failed for image: S3, Cloudinary, and local storage all failed");
                            continue; // Skip this image if all methods fail
                        }
                    }
                }

                // Only add ONE URL per unique image
                if (finalUrl != null) {
                    urls.add(finalUrl);
                }

            } catch (Exception ex) {
                log.warn("Failed to process image: {}", ex.getMessage());
            }
        }
        return urls;
    }

    // Calculate content hash for image deduplication
    private String calculateImageHash(MultipartFile file) {
        try {
            java.security.MessageDigest md = java.security.MessageDigest.getInstance("MD5");
            byte[] hashBytes = md.digest(file.getBytes());
            StringBuilder hashBuilder = new StringBuilder();
            for (byte b : hashBytes) {
                hashBuilder.append(String.format("%02x", b));
            }
            return hashBuilder.toString();
        } catch (Exception e) {
            // Fallback to filename + size if hashing fails
            return file.getOriginalFilename() + "_" + file.getSize();
        }
    }

    // Remove duplicate image URLs using sophisticated pattern matching
    private List<String> removeDuplicateImageUrls(List<String> imageUrls) {
        if (imageUrls == null || imageUrls.isEmpty()) {
            return new ArrayList<>();
        }

        Set<String> uniqueImages = new HashSet<>();
        List<String> result = new ArrayList<>();

        for (String url : imageUrls) {
            if (url == null || url.trim().isEmpty())
                continue;

            String normalizedUrl = normalizeImageUrl(url);

            // Only add if we haven't seen this normalized URL before
            if (uniqueImages.add(normalizedUrl)) {
                result.add(url); // Keep original URL format
                log.debug("Added unique image: {} (normalized: {})", url, normalizedUrl);
            } else {
                log.debug("Skipped duplicate image: {} (normalized: {})", url, normalizedUrl);
            }
        }

        log.info("Deduplication: {} original URLs -> {} unique URLs", imageUrls.size(), result.size());
        return result;
    }

    // Normalize image URLs to detect duplicates with different formats
    private String normalizeImageUrl(String url) {
        if (url == null)
            return "";

        String normalized = url.trim().toLowerCase();

        // Extract filename from both local and cloud URLs
        String filename = null;

        if (normalized.contains("/admin/products/images/")) {
            // Local URL: /admin/products/images/1768898387861_image.jpg
            filename = normalized.substring(normalized.lastIndexOf('/') + 1);
        } else if (normalized.contains("cloudinary.com")) {
            // Cloudinary URL: extract filename from path
            filename = normalized.substring(normalized.lastIndexOf('/') + 1);
        } else if (normalized.contains("amazonaws.com")) {
            // S3 URL: extract filename from path
            filename = normalized.substring(normalized.lastIndexOf('/') + 1);
        } else {
            // Use full URL as fallback
            filename = normalized;
        }

        // Remove query parameters and fragments
        if (filename != null && filename.contains("?")) {
            filename = filename.substring(0, filename.indexOf("?"));
        }

        return filename != null ? filename : normalized;
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        // Load product to get image URL before deleting DB row
        try {
            Product existing = productService.getById(id);
            if (existing != null) {
                boolean deletedSomething = false;
                // Try Cloudinary public id first
                if (existing.getImagePublicId() != null && !existing.getImagePublicId().isEmpty()) {
                    try {
                        cloudinaryStorageService.delete(existing.getImagePublicId());
                        deletedSomething = true;
                    } catch (Exception e) {
                        try {
                            log.warn("Cloudinary deletion failed: {}", e.getMessage());
                        } catch (Exception ignored) {
                        }
                    }
                }

                // If not deleted via Cloudinary, try to delete by URL or local filename
                if (!deletedSomething && existing.getImageUrl() != null) {
                    try {
                        // If imageUrl looks like an absolute URL, ask Cloudinary to delete by URL
                        // (service handles it)
                        if (existing.getImageUrl().startsWith("http://")
                                || existing.getImageUrl().startsWith("https://")) {
                            try {
                                cloudinaryStorageService.delete(existing.getImageUrl());
                                deletedSomething = true;
                            } catch (Exception e) {
                            }
                        } else {
                            // Treat as local path: extract filename and delete from local storage
                            String filename = storageService.extractFilenameFromUrl(existing.getImageUrl());
                            if (filename != null)
                                storageService.delete(filename);
                        }
                    } catch (Exception ex) {
                        try {
                            log.warn("Failed to delete stored image: {}", ex.getMessage());
                        } catch (Exception ignored) {
                        }
                    }
                }
            }
        } catch (Exception ignored) {
            // Ignore errors during image deletion; proceed to delete DB row
        }
        productService.delete(id);
        return ResponseEntity.noContent().build();
    }

    // Serve uploaded images via API so frontend can display them
    @GetMapping("/images/{filename:.+}")
    public ResponseEntity<Resource> getImage(@PathVariable String filename) throws IOException {
        long start = System.currentTimeMillis();
        Resource resource = null;
        long readDuration = 0;
        MediaType contentType = null;
        try {
            resource = storageService.loadAsResource(filename);
            readDuration = System.currentTimeMillis() - start;
            contentType = storageService.probeMediaType(filename);
        } catch (IOException ioe) {
            try {
                log.warn("Requested image not found: {}", filename);
            } catch (Exception ignored) {
            }
            return ResponseEntity.notFound().build();
        }

        // Log small diagnostic info to help debug cold-start vs file-read slowness
        try {
            log.info("Image request served: {} (readDuration={} ms)", filename, readDuration);
        } catch (Exception ignored) {
        }

        return ResponseEntity.ok()
                .header(HttpHeaders.CACHE_CONTROL, "max-age=86400, public")
                .header("X-Served-By", "local-storage")
                .header("X-Read-Duration-ms", String.valueOf(readDuration))
                .contentType(contentType)
                .body(resource);
    }

    // List all stored image filenames (or absolute URLs)
    @GetMapping("/images")
    public ResponseEntity<List<String>> listImages() {
        // Only list image files
        List<String> files = storageService.listAll();
        List<String> urls = files.stream()
                .filter(name -> storageService.isImageFilename(name))
                .map(name -> "/api/admin/products/images/" + name)
                .collect(Collectors.toList());
        return ResponseEntity.ok(urls);
    }

    // Admin utility: remove non-image files from upload folder (useful for dev
    // cleanup)
    @PostMapping("/images/cleanup")
    public ResponseEntity<List<String>> cleanupUploads() {
        List<String> deleted = storageService.sanitizeUploads();
        return ResponseEntity.ok(deleted);
    }

    // Admin utility: Fix duplicate images in existing products
    @PostMapping("/fix-duplicate-images")
    public ResponseEntity<Map<String, Object>> fixDuplicateImages() {
        List<Product> allProducts = productService.getAll();
        int fixedCount = 0;
        int totalDuplicatesRemoved = 0;

        for (Product product : allProducts) {
            try {
                Map<String, Object> metadata = product.getMetadata();
                if (metadata != null && metadata.get("images") instanceof List) {
                    @SuppressWarnings("unchecked")
                    List<String> images = (List<String>) metadata.get("images");

                    if (images.size() > 1) {
                        int originalSize = images.size();
                        List<String> uniqueImages = removeDuplicateImageUrls(images);

                        if (uniqueImages.size() < originalSize) {
                            // Update product with deduplicated images
                            metadata.put("images", uniqueImages);
                            product.setMetadata(metadata);
                            product.setImageUrl(uniqueImages.get(0));

                            productService.save(product);

                            fixedCount++;
                            totalDuplicatesRemoved += (originalSize - uniqueImages.size());

                            log.info("Fixed product {} - reduced from {} to {} images",
                                    product.getId(), originalSize, uniqueImages.size());
                        }
                    }
                }
            } catch (Exception e) {
                log.warn("Failed to fix duplicates for product {}: {}", product.getId(), e.getMessage());
            }
        }

        Map<String, Object> result = new HashMap<>();
        result.put("message", "Duplicate image cleanup completed");
        result.put("productsFixed", fixedCount);
        result.put("duplicatesRemoved", totalDuplicatesRemoved);
        result.put("totalProducts", allProducts.size());

        return ResponseEntity.ok(result);
    }

    // Filter out null/empty fields to prevent storing unnecessary defaults and null
    // values
    private void filterNullFields(Product p) {
        if (p == null)
            return;

        try {
            // Set null for empty strings in main fields
            if (p.getDescription() != null && p.getDescription().trim().isEmpty())
                p.setDescription(null);
            if (p.getShortDescription() != null && p.getShortDescription().trim().isEmpty())
                p.setShortDescription(null);
            if (p.getBrand() != null && p.getBrand().trim().isEmpty())
                p.setBrand(null);
            if (p.getCategory() != null && p.getCategory().trim().isEmpty())
                p.setCategory(null);
            if (p.getSubcategory() != null && p.getSubcategory().trim().isEmpty())
                p.setSubcategory(null);
            if (p.getIngredients() != null && p.getIngredients().trim().isEmpty())
                p.setIngredients(null);
            if (p.getBenefits() != null && p.getBenefits().trim().isEmpty())
                p.setBenefits(null);
            if (p.getFeatures() != null && p.getFeatures().trim().isEmpty())
                p.setFeatures(null);

            // Clear zero values for price fields (only store actual prices)
            if (p.getPrice() != null && p.getPrice() == 0.0)
                p.setPrice(null);
            if (p.getOriginalPrice() != null && p.getOriginalPrice() == 0.0)
                p.setOriginalPrice(null);

            // Clear empty nutrition fields
            if (p.getNutritionProtein() != null && p.getNutritionProtein().trim().isEmpty())
                p.setNutritionProtein(null);
            if (p.getNutritionFat() != null && p.getNutritionFat().trim().isEmpty())
                p.setNutritionFat(null);
            if (p.getNutritionFiber() != null && p.getNutritionFiber().trim().isEmpty())
                p.setNutritionFiber(null);
            if (p.getNutritionMoisture() != null && p.getNutritionMoisture().trim().isEmpty())
                p.setNutritionMoisture(null);
            if (p.getNutritionAsh() != null && p.getNutritionAsh().trim().isEmpty())
                p.setNutritionAsh(null);
            if (p.getNutritionCalories() != null && p.getNutritionCalories().trim().isEmpty())
                p.setNutritionCalories(null);

            // Clear empty product attribute fields
            if (p.getFoodType() != null && p.getFoodType().trim().isEmpty())
                p.setFoodType(null);
            if (p.getType() != null && p.getType().trim().isEmpty())
                p.setType(null);
            if (p.getPetType() != null && p.getPetType().trim().isEmpty())
                p.setPetType(null);
            if (p.getMaterial() != null && p.getMaterial().trim().isEmpty())
                p.setMaterial(null);
            if (p.getScent() != null && p.getScent().trim().isEmpty())
                p.setScent(null);
            if (p.getSuitableFor() != null && p.getSuitableFor().trim().isEmpty())
                p.setSuitableFor(null);
            if (p.getTreatType() != null && p.getTreatType().trim().isEmpty())
                p.setTreatType(null);
            if (p.getTexture() != null && p.getTexture().trim().isEmpty())
                p.setTexture(null);
            if (p.getSubcategoryLabel() != null && p.getSubcategoryLabel().trim().isEmpty())
                p.setSubcategoryLabel(null);
            if (p.getServingSize() != null && p.getServingSize().trim().isEmpty())
                p.setServingSize(null);
            if (p.getPackCount() != null && p.getPackCount().trim().isEmpty())
                p.setPackCount(null);
            if (p.getWeightUnit() != null && p.getWeightUnit().trim().isEmpty())
                p.setWeightUnit(null);
            if (p.getFlavors() != null && p.getFlavors().trim().isEmpty())
                p.setFlavors(null);
            if (p.getColors() != null && p.getColors().trim().isEmpty())
                p.setColors(null);

            // Clear empty pharmacy fields
            if (p.getDosageForm() != null && p.getDosageForm().trim().isEmpty())
                p.setDosageForm(null);
            if (p.getStrength() != null && p.getStrength().trim().isEmpty())
                p.setStrength(null);
            if (p.getActiveIngredient() != null && p.getActiveIngredient().trim().isEmpty())
                p.setActiveIngredient(null);
            if (p.getManufacturer() != null && p.getManufacturer().trim().isEmpty())
                p.setManufacturer(null);
            if (p.getIndications() != null && p.getIndications().trim().isEmpty())
                p.setIndications(null);
            if (p.getContraindications() != null && p.getContraindications().trim().isEmpty())
                p.setContraindications(null);
            if (p.getExpiryDate() != null && p.getExpiryDate().trim().isEmpty())
                p.setExpiryDate(null);

            // Clear empty filter fields
            if (p.getBrands() != null && p.getBrands().trim().isEmpty())
                p.setBrands(null);
            if (p.getLifeStages() != null && p.getLifeStages().trim().isEmpty())
                p.setLifeStages(null);
            if (p.getBreedSizes() != null && p.getBreedSizes().trim().isEmpty())
                p.setBreedSizes(null);
            if (p.getSpecialDiets() != null && p.getSpecialDiets().trim().isEmpty())
                p.setSpecialDiets(null);
            if (p.getProteinSources() != null && p.getProteinSources().trim().isEmpty())
                p.setProteinSources(null);
            if (p.getProductWeights() != null && p.getProductWeights().trim().isEmpty())
                p.setProductWeights(null);
            if (p.getPriceRanges() != null && p.getPriceRanges().trim().isEmpty())
                p.setPriceRanges(null);

            log.debug("Filtered null/empty fields for product: {}", p.getName());
        } catch (Exception e) {
            log.warn("Failed to filter null fields for product: {}", e.getMessage());
        }
    }
}