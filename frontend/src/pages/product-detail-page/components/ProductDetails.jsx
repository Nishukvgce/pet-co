import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';

const ProductDetails = ({ product }) => {
  // Determine if product is a Pharmacy-type (dedicated pharmacy section)
  const hasPharmacyMeta = Boolean(product?.metadata?.pharmacy);
  const isPharmacy = product?.type === 'Pharmacy';
  const [activeTab, setActiveTab] = useState(isPharmacy ? 'pharmacy' : 'description');

  // If this is a dedicated Pharmacy product, show only the Pharmacy tab.
  // For other products, keep the normal tabs and append a Pharmacy tab when metadata exists.
  let tabs = [];
  if (isPharmacy) {
    tabs = [{ id: 'pharmacy', label: 'Pharmacy Info', icon: 'Rx' }];
  } else {
    tabs = [
      { id: 'description', label: 'Product Description', icon: 'FileText' },
      // { id: 'details', label: 'Product Details', icon: 'Info' },
      { id: 'manufacturer', label: 'Manufacturer Details', icon: 'Building' }
    ];
    if (hasPharmacyMeta) {
      tabs.push({ id: 'pharmacy', label: 'Pharmacy Info', icon: 'Rx' });
    }
  }

  // Extract product details from metadata or direct fields
  const productDetails = {
    suitableFor: product?.metadata?.suitableFor || product?.suitableFor || product?.petType || 'Adult Dogs & puppies',
    foodType: product?.metadata?.foodType || product?.foodType || product?.productType || 'Baked dry food',
    healthBenefits: product?.metadata?.healthBenefits || product?.healthBenefits || 'Prevents obesity, improves coat health',
    keyFeature: product?.metadata?.keyFeature || product?.keyFeature || product?.features?.[0] || 'Baked not overheated',
    manufacturingLocation: product?.metadata?.manufacturingLocation || product?.manufacturingLocation || product?.origin || 'India',
    safetyInformation: product?.metadata?.safetyInformation || product?.safetyInformation || 'Non-returnable',
    weightManagement: product?.metadata?.weightManagement || product?.weightManagement,
    strongerJoints: product?.metadata?.strongerJoints || product?.strongerJoints,
    gentleOnTummies: product?.metadata?.gentleOnTummies || product?.gentleOnTummies,
    noNasties: product?.metadata?.noNasties || product?.noNasties
  };

  const keyFeatures = [
    productDetails.weightManagement && {
      title: 'Weight Management Made Easy',
      description: 'Higher energy density means dogs need 25% less food than regular kibble, helping fight obesity and keep them active.'
    },
    productDetails.strongerJoints && {
      title: 'Stronger Joints, Shinier Coat',
      description: 'Glucosamine, chondroitin, and taurine support joint health, heart strength, and coat shine.'
    },
    productDetails.gentleOnTummies && {
      title: 'Gentle on Tummies',
      description: 'Psyllium husk improves digestion while ginger boosts immunity.'
    },
    productDetails.noNasties && {
      title: 'No Nasties, Just Love',
      description: '100% human-grade chicken, eggs, and rice. No fillers, no gluten, no sugar, no additives, no preservatives.'
    }
  ].filter(Boolean);

  return (
    <div className="space-y-6">
      {/* Tab Navigation */}
      <div className="flex flex-wrap gap-1 border-b border-border">
        {tabs?.map((tab) => (
          <button
            key={tab?.id}
            onClick={() => setActiveTab(tab?.id)}
            className={`flex items-center gap-2 px-4 py-3 font-body font-medium transition-colors duration-200 border-b-2 ${
              activeTab === tab?.id
                ? 'text-primary border-primary' : 'text-muted-foreground border-transparent hover:text-foreground'
            }`}
          >
            <Icon name={tab?.icon} size={16} />
            <span>{tab?.label}</span>
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="space-y-6">
        {activeTab === 'description' && (
          <div className="space-y-6">
            <h3 className="font-heading font-semibold text-xl text-foreground">
              Product Description
            </h3>
            
            <div
              className="product-description-html text-sm text-gray-700 leading-relaxed"
              dangerouslySetInnerHTML={{
                __html: product?.description ||
                  '<p>Give your doggo the goodness of real, clean preservative free food.</p>'
              }}
            />

            {keyFeatures.length > 0 && (
              <div className="space-y-4">
                <h4 className="font-heading font-semibold text-lg text-foreground">Key Features:</h4>
                <div className="space-y-4">
                  {keyFeatures.map((feature, index) => (
                    <div key={index} className="space-y-2">
                      <h5 className="font-medium text-foreground">{feature.title}</h5>
                      <p className="text-sm text-muted-foreground">{feature.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'details' && (
          <div className="space-y-6">
            <div className="bg-card rounded-lg border border-border overflow-hidden">
              <div className="bg-primary/5 px-4 py-3 border-b border-border">
                <h3 className="font-heading font-semibold text-lg text-foreground flex items-center gap-2">
                  <Icon name="Info" size={20} className="text-primary" />
                  Product Details
                </h3>
              </div>
              
              <div className="divide-y divide-border">
                <div className="px-4 py-3 flex justify-between items-center">
                  <span className="font-medium text-foreground">Suitable For</span>
                  <span className="text-muted-foreground">{productDetails.suitableFor}</span>
                </div>
                
                <div className="px-4 py-3 flex justify-between items-center">
                  <span className="font-medium text-foreground">Food Type</span>
                  <span className="text-muted-foreground">{productDetails.foodType}</span>
                </div>
                
                <div className="px-4 py-3 flex justify-between items-center">
                  <span className="font-medium text-foreground">Health Benefits</span>
                  <span className="text-muted-foreground text-right max-w-xs">{productDetails.healthBenefits}</span>
                </div>
                
                <div className="px-4 py-3 flex justify-between items-center">
                  <span className="font-medium text-foreground">Key Feature</span>
                  <span className="text-muted-foreground text-right max-w-xs">{productDetails.keyFeature}</span>
                </div>
                
                <div className="px-4 py-3 flex justify-between items-center">
                  <span className="font-medium text-foreground">Manufacturing Location</span>
                  <span className="text-muted-foreground">{productDetails.manufacturingLocation}</span>
                </div>
                
                <div className="px-4 py-3 flex justify-between items-center">
                  <span className="font-medium text-foreground">Safety Information</span>
                  <span className="text-muted-foreground">{productDetails.safetyInformation}</span>
                </div>
              </div>
            </div>

            {/* Additional product specifications */}
            {(product?.ingredients || product?.nutrition) && (
              <div className="bg-card rounded-lg border border-border p-6 space-y-4">
                <h4 className="font-heading font-semibold text-lg text-foreground">Nutritional Information</h4>
                
                {product?.ingredients && (
                  <div className="space-y-2">
                    <h5 className="font-medium text-foreground">Ingredients:</h5>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {typeof product.ingredients === 'string' ? product.ingredients : product.ingredients?.join?.(', ') || 'Not specified'}
                    </p>
                  </div>
                )}

                {product?.nutrition && typeof product.nutrition === 'object' && (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                    {Object.entries(product.nutrition).map(([key, value]) => (
                      <div key={key} className="text-center">
                        <div className="text-lg font-semibold text-primary">{value}</div>
                        <div className="text-xs text-muted-foreground capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {activeTab === 'manufacturer' && (
          <div className="space-y-6">
            <div className="bg-card rounded-lg border border-border overflow-hidden">
              <div className="bg-primary/5 px-4 py-3 border-b border-border">
                <h3 className="font-heading font-semibold text-lg text-foreground flex items-center gap-2">
                  <Icon name="Building" size={20} className="text-primary" />
                  Manufacturer Details
                </h3>
              </div>

              <div className="divide-y divide-border">
                {(product?.metadata?.manufacturer?.sku || product?.sku) && (
                  <div className="px-4 py-3 flex flex-wrap justify-between items-start gap-2">
                    <span className="font-medium text-foreground">SKU</span>
                    <span className="text-muted-foreground font-mono text-sm">{product?.metadata?.manufacturer?.sku || product?.sku}</span>
                  </div>
                )}

                {((product?.metadata?.manufacturer?.countryOfOrigin) || product?.countryOfOrigin) && (
                  <div className="px-4 py-3 flex flex-wrap justify-between items-start gap-2">
                    <span className="font-medium text-foreground">Country of Origin</span>
                    <span className="text-muted-foreground">{product?.metadata?.manufacturer?.countryOfOrigin || product?.countryOfOrigin}</span>
                  </div>
                )}

                {((product?.metadata?.manufacturer?.manufacturerName) || (product?.metadata?.manufacturer?.name) || product?.manufacturer) && (
                  <div className="px-4 py-3 flex flex-col gap-1">
                    <span className="font-medium text-foreground">Name & Address of Manufacturer</span>
                    <span className="text-muted-foreground text-sm leading-relaxed">
                      {product.metadata?.manufacturer?.manufacturerName || product.metadata?.manufacturer?.name || product?.manufacturer || 'Not specified'}
                      {product.metadata?.manufacturer?.address && (<div className="text-xs text-muted-foreground mt-2">{product.metadata.manufacturer.address}</div>)}
                      {!product.metadata?.manufacturer?.address && product?.manufacturerAddress && (<div className="text-xs text-muted-foreground mt-2">{product.manufacturerAddress}</div>)}
                    </span>
                  </div>
                )}

                {(product?.metadata?.manufacturer?.marketedBy || product?.marketedBy) && (
                  <div className="px-4 py-3 flex flex-col gap-1">
                    <span className="font-medium text-foreground">Marketed by</span>
                    <span className="text-muted-foreground text-sm leading-relaxed">{product.metadata?.manufacturer?.marketedBy || product?.marketedBy}</span>
                  </div>
                )}

                {/* Fallback if no specifics are present (consider top-level columns too) */}
                {!(product?.metadata?.manufacturer?.sku || product?.sku || product?.metadata?.manufacturer?.countryOfOrigin || product?.countryOfOrigin || product?.metadata?.manufacturer?.manufacturerName || product?.metadata?.manufacturer?.name || product?.manufacturer || product?.metadata?.manufacturer?.marketedBy || product?.marketedBy || product?.manufacturerAddress) && (
                  <div className="px-4 py-6 text-center text-muted-foreground">
                    <Icon name="Building" size={32} className="mx-auto mb-2 opacity-40" />
                    <p className="text-sm">No manufacturer details available for this product.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'pharmacy' && (
          <div className="space-y-6">
            <div className="bg-card rounded-lg border border-border p-6 space-y-4">
              <h3 className="font-heading font-semibold text-xl text-foreground flex items-center gap-2">
                <Icon name="Rx" size={20} className="text-primary" />
                Pharmacy Information
              </h3>

              {product?.metadata?.pharmacy ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium text-foreground mb-1">Prescription Required</h4>
                    <p className="text-muted-foreground">{product.metadata.pharmacy.prescriptionRequired ? 'Yes' : 'No'}</p>
                  </div>

                  {product.metadata.pharmacy.dosageForm && (
                    <div>
                      <h4 className="font-medium text-foreground mb-1">Dosage Form</h4>
                      <p className="text-muted-foreground">{product.metadata.pharmacy.dosageForm}</p>
                    </div>
                  )}

                  {product.metadata.pharmacy.strength && (
                    <div>
                      <h4 className="font-medium text-foreground mb-1">Strength</h4>
                      <p className="text-muted-foreground">{product.metadata.pharmacy.strength}</p>
                    </div>
                  )}

                  {product.metadata.pharmacy.activeIngredient && (
                    <div>
                      <h4 className="font-medium text-foreground mb-1">Active Ingredient</h4>
                      <p className="text-muted-foreground">{product.metadata.pharmacy.activeIngredient}</p>
                    </div>
                  )}

                  {product.metadata.pharmacy.manufacturer && (
                    <div>
                      <h4 className="font-medium text-foreground mb-1">Manufacturer</h4>
                      <p className="text-muted-foreground">{product.metadata.pharmacy.manufacturer}</p>
                    </div>
                  )}

                  {product.metadata.pharmacy.indications && (
                    <div className="md:col-span-2">
                      <h4 className="font-medium text-foreground mb-1">Indications</h4>
                      <p className="text-muted-foreground">{product.metadata.pharmacy.indications}</p>
                    </div>
                  )}

                  {product.metadata.pharmacy.contraindications && (
                    <div className="md:col-span-2">
                      <h4 className="font-medium text-foreground mb-1">Contraindications</h4>
                      <p className="text-muted-foreground">{product.metadata.pharmacy.contraindications}</p>
                    </div>
                  )}

                  {product.metadata.pharmacy.expiryDate && (
                    <div>
                      <h4 className="font-medium text-foreground mb-1">Expiry Date</h4>
                      <p className="text-muted-foreground">{product.metadata.pharmacy.expiryDate}</p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-muted-foreground">No pharmacy information available for this product.</div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'reviews' && (
          <div className="space-y-6">
            <div className="bg-card rounded-lg border border-border p-6">
              <h3 className="font-heading font-semibold text-xl text-foreground mb-4 flex items-center gap-2">
                <Icon name="Star" size={20} className="text-primary" />
                Customer Reviews
              </h3>
              
              <div className="text-center py-8 text-muted-foreground">
                <Icon name="MessageCircle" size={48} className="mx-auto mb-4 opacity-50" />
                <p>No reviews yet. Be the first to review this product!</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetails;