import React from 'react';

const categories = [
  {
    key: 'cat',
    label: 'Cat',
    to: '/shop-for-cats',
    local: '/assets/images/homecategory/cat.avif',
    fallback: 'https://images.unsplash.com/photo-1518791841217-8f162f1e1131?q=80&w=800&auto=format&fit=crop&ixlib=rb-4.0.3&s=3b3f6e8c9a0b4f3a7e6d3d6b5d6a9f3c'
  },
  {
    key: 'dog',
    label: 'Dog',
    to: '/shop-for-dogs',
    local: '/assets/images/homecategory/dog.jpg',
    fallback: 'https://images.unsplash.com/photo-1517849845537-4d257902454a?q=80&w=800&auto=format&fit=crop&ixlib=rb-4.0.3&s=6b5a0b8d1a2f3c4d5e6f7a8b9c0d1e2f'
  },
  {
    key: 'pet-parent',
    label: 'Pet parent',
    to: '/learn-with-petco',
    local: '/assets/images/homecategory/parents.webp',
    fallback: 'https://images.unsplash.com/photo-1525253086316-d0c936c814f8?q=80&w=800&auto=format&fit=crop&ixlib=rb-4.0.3&s=abcdef1234567890'
  },
  {
    key: 'fish',
    label: 'Fish',
    to: '/shop-for-fish',
    local: '/assets/images/homecategory/fish.webp',
    fallback: 'https://images.unsplash.com/photo-1504198453319-5ce911bafcde?q=80&w=800&auto=format&fit=crop&ixlib=rb-4.0.3&s=123456abcdef7890'
  },
  {
    key: 'rabbit',
    label: 'Rabbit',
    to: '/shop-for-rabbit',
    local: '/assets/images/homecategory/rabbit.jpg',
    fallback: 'https://images.unsplash.com/photo-1543852786-1cf6624b9987?q=80&w=800&auto=format&fit=crop&ixlib=rb-4.0.3&s=7890abcdef123456'
  },
  {
    key: 'birds',
    label: 'Birds',
    to: '/shop-for-birds',
    local: '/assets/images/homecategory/birds.webp',
    fallback: 'https://images.unsplash.com/photo-1501706362039-c6e8093a4b1c?q=80&w=800&auto=format&fit=crop&ixlib=rb-4.0.3&s=0fedcba987654321'
  },
];

const WhoShoppingFor = () => {
  return (
    <section className="py-8 lg:py-12 bg-background">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl lg:text-4xl font-heading font-bold mb-6 text-foreground">WHO YOU SHOPPING FOR?</h2>
        <p className="text-lg text-muted-foreground mb-6">Choose a category to find products curated for your pet</p>

        <div className="-mx-4 px-4 lg:mx-0 lg:px-0">
          <div className="grid grid-cols-2 md:grid-cols-6 gap-6">
            {categories.map(cat => (
              <article key={cat.key} className="text-center">
                <a href={cat.to} className="block">
                  <div className="relative rounded-2xl overflow-hidden bg-white shadow-sm" style={{ borderRadius: '14px' }}>
                    <div className="w-full aspect-square">
                      <img
                        src={cat.local}
                        onError={(e) => { e.target.onerror = null; e.target.src = cat.fallback; }}
                        alt={cat.label}
                        className="w-full h-full object-cover block"
                      />
                    </div>
                  </div>
                  <div className="mt-4 text-base font-medium text-foreground">{cat.label}</div>
                </a>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhoShoppingFor;
