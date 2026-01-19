package com.eduprajna.Controller;

import java.util.List;
import java.util.concurrent.TimeUnit;

import org.springframework.http.CacheControl;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.eduprajna.config.CorsConfig;
import com.eduprajna.entity.Category;
import com.eduprajna.repository.CategoryRepository;

@RestController
@RequestMapping("/api/categories")
// Allow local dev, Vercel preview and production frontend domains
@CrossOrigin(origins = {CorsConfig.LOCALHOST_3000, CorsConfig.LOCALHOST_5173, CorsConfig.LOCALHOST_IP_3000, CorsConfig.LOCALHOST_IP_5173, CorsConfig.VERCEL_OLD, CorsConfig.VERCEL_NEW, CorsConfig.PROD_DOMAIN_1, CorsConfig.PROD_DOMAIN_2}, allowCredentials = "true")
public class CategoryController {
    private final CategoryRepository categoryRepository;

    public CategoryController(CategoryRepository categoryRepository) {
        this.categoryRepository = categoryRepository;
    }

    @GetMapping("")
    public ResponseEntity<List<Category>> getAllCategories() {
        List<Category> cats = categoryRepository.findAll();
        return ResponseEntity.ok()
                .cacheControl(CacheControl.maxAge(60, TimeUnit.SECONDS).cachePublic())
                .body(cats);
    }

        @GetMapping("/{id}")
        public ResponseEntity<Category> getCategoryById(@PathVariable Long id) {
        return categoryRepository.findById(id)
            .map(cat -> ResponseEntity.ok()
                .cacheControl(CacheControl.maxAge(60, TimeUnit.SECONDS).cachePublic())
                .body(cat))
            .orElseGet(() -> ResponseEntity.notFound().build());
        }
}