import React from 'react';

const MobileCategorySidebar = ({ categories = [], active, setActive }) => {
  return (
    <nav className="w-20 flex flex-col items-center gap-3 py-4 overflow-y-auto no-scrollbar">
      {categories.map(c => (
        <button
          key={c.id}
          onClick={() => setActive(c.label)}
          className={`flex flex-col items-center gap-2 text-xs text-center w-full px-1 ${active === c.label ? 'text-orange-600' : 'text-foreground'}`}>
          <div className={`w-12 h-12 rounded-full bg-white flex items-center justify-center border ${active === c.label ? 'ring-2 ring-orange-300' : 'border-border'}`}>
            <img src={c.img} alt={c.label} className="w-10 h-10 object-cover rounded-full" onError={(e) => { e.target.src = '/assets/images/no_image.png'; }} />
          </div>
          <div className="text-[11px] mt-1 leading-tight">{c.label}</div>
        </button>
      ))}
    </nav>
  );
};

export default MobileCategorySidebar;
