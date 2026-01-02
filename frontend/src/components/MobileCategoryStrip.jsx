import React from 'react';

const MobileCategoryStrip = ({ categories = [], active, setActive }) => {
  return (
    <div className="w-full block lg:hidden mb-4">
      <h3 className="text-lg font-semibold text-foreground mb-3">Categories</h3>
      <div className="flex flex-col gap-3">
        {categories.map(c => (
          <button
            key={c.id}
            onClick={() => setActive(c.label)}
            className={`w-full flex items-center gap-3 p-3 rounded-lg transition-all duration-200 border text-left ${active === c.label ? 'bg-orange-50 border-orange-300 shadow-sm' : 'bg-white border-border'}`}>
            <img src={c.img} alt={c.label} className="w-12 h-12 object-cover rounded-md flex-shrink-0" onError={(e) => { e.target.src = '/assets/images/no_image.png'; }} />
            <div className="text-sm font-medium leading-tight">{c.label}</div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default MobileCategoryStrip;
