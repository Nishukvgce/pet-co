import React, { useRef } from 'react';

const FilterDrawer = ({ open, onClose, sections = [], selected = {}, onToggle = () => {}, onClear = () => {}, onApply = () => {}, total = 0 }) => {
  const drawerContentRef = useRef(null);

  return (
    <div aria-hidden={!open} className={`fixed inset-0 z-50 pointer-events-none ${open ? '' : ''}`}>
      <div
        onClick={onClose}
        className={`absolute inset-0 bg-black/40 transition-opacity ${open ? 'opacity-100 pointer-events-auto' : 'opacity-0'}`}
      />

      <aside
        role="dialog"
        aria-modal="true"
        className={`fixed top-0 right-0 h-full bg-white w-full sm:w-96 shadow-xl transform transition-transform pointer-events-auto ${open ? 'translate-x-0' : 'translate-x-full'}`}
      >
        <div className="flex items-center justify-between p-4 border-b">
          <div>
            <div className="text-sm font-semibold">Filter</div>
            <div className="text-xs text-muted-foreground">{total} products</div>
          </div>
          <div>
            <button onClick={onClose} className="p-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-700" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 011.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        </div>

        <div ref={drawerContentRef} className="px-4 pt-4 pb-32 hide-scrollbar overflow-y-auto" style={{ maxHeight: 'calc(100vh - 140px)' }}>
          {sections.map(section => (
            <section key={section.id} className="mb-6">
              <h4 className="text-sm font-medium mb-3">{section.label}</h4>
              <div className="flex flex-wrap gap-2">
                {(section.options || []).map(opt => {
                  const isSelected = (selected[section.id] || []).includes(opt);
                  return (
                    <button
                      key={opt}
                      onClick={() => onToggle(section.id, opt)}
                      className={`text-xs px-3 py-1 border rounded ${isSelected ? 'bg-orange-50 border-orange-400 text-orange-700' : 'bg-white border-border'}`}>
                      {opt}
                    </button>
                  );
                })}
              </div>
            </section>
          ))}
        </div>

        <div className="fixed bottom-0 right-0 left-auto w-full sm:w-96 bg-white border-t p-4 flex items-center justify-between">
          <button onClick={onClear} className="text-sm text-orange-500">Clear All</button>
          <button onClick={onApply} className="bg-orange-500 text-white px-5 py-2 rounded">Apply Filters</button>
        </div>
      </aside>
    </div>
  );
};

export default FilterDrawer;
