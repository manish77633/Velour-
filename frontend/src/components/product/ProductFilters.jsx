import React from 'react';

const CATEGORIES = ['Men', 'Women', 'Kids'];
const SIZES      = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
const COLORS     = [
  { label: 'Black', value: '#1C1917' },
  { label: 'White', value: '#FAF7F2' },
  { label: 'Brown', value: '#8B6F5C' },
  { label: 'Blue',  value: '#4A6FA5' },
  { label: 'Green', value: '#6B8F71' },
  { label: 'Red',   value: '#C0392B' },
];

const ProductFilters = ({ filters, onChange, onReset }) => {
  const update = (key, value) => onChange({ ...filters, [key]: value, page: 1 });

  return (
    <aside className="space-y-7">
      {/* Category */}
      <div>
        <h3 className="text-xs font-semibold tracking-[0.18em] uppercase mb-3 pb-2 border-b border-soft">Category</h3>
        <div className="flex flex-col gap-2">
          <button onClick={() => update('category', '')}
            className={`flex items-center justify-between text-sm py-0.5 transition-colors hover:text-warm
              ${!filters.category ? 'font-semibold text-dark' : 'text-muted'}`}>
            <span>All</span>
          </button>
          {CATEGORIES.map((cat) => (
            <button key={cat} onClick={() => update('category', cat)}
              className={`flex items-center justify-between text-sm py-0.5 transition-colors hover:text-warm
                ${filters.category === cat ? 'font-semibold text-dark' : 'text-muted'}`}>
              <span>{cat}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Size */}
      <div>
        <h3 className="text-xs font-semibold tracking-[0.18em] uppercase mb-3 pb-2 border-b border-soft">Size</h3>
        <div className="grid grid-cols-4 gap-1.5">
          {SIZES.map((s) => (
            <button key={s} onClick={() => update('size', filters.size === s ? '' : s)}
              className={`py-1.5 text-xs border rounded-sm transition-all
                ${filters.size === s ? 'bg-dark text-white border-dark' : 'border-soft hover:border-dark text-dark'}`}>
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Color */}
      <div>
        <h3 className="text-xs font-semibold tracking-[0.18em] uppercase mb-3 pb-2 border-b border-soft">Color</h3>
        <div className="flex flex-wrap gap-2">
          {COLORS.map((c) => (
            <button key={c.value} onClick={() => update('color', filters.color === c.value ? '' : c.value)}
              title={c.label}
              className={`w-7 h-7 rounded-full transition-all
                ${filters.color === c.value ? 'ring-2 ring-offset-2 ring-dark' : ''}
                ${c.value === '#FAF7F2' ? 'border border-soft' : ''}`}
              style={{ background: c.value }}/>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div>
        <h3 className="text-xs font-semibold tracking-[0.18em] uppercase mb-3 pb-2 border-b border-soft">Price Range</h3>
        <input type="range" min={0} max={10000} step={100}
          value={filters.maxPrice || 10000}
          onChange={(e) => update('maxPrice', e.target.value)}
          className="w-full accent-warm cursor-pointer"/>
        <div className="flex justify-between text-xs text-muted mt-1">
          <span>₹0</span>
          <span>₹{Number(filters.maxPrice || 10000).toLocaleString()}</span>
        </div>
      </div>

      {/* Rating */}
      <div>
        <h3 className="text-xs font-semibold tracking-[0.18em] uppercase mb-3 pb-2 border-b border-soft">Min Rating</h3>
        {[4, 3, 2].map((r) => (
          <button key={r} onClick={() => update('minRating', filters.minRating === r ? '' : r)}
            className={`flex items-center gap-1.5 py-1 text-sm w-full transition-colors
              ${filters.minRating === r ? 'text-dark font-medium' : 'text-muted hover:text-dark'}`}>
            <span>{'★'.repeat(r)}{'☆'.repeat(5-r)}</span>
            <span>& up</span>
          </button>
        ))}
      </div>

      {/* Reset */}
      <button onClick={onReset}
        className="text-xs tracking-widest uppercase text-muted hover:text-dark transition-colors underline underline-offset-4">
        Clear All Filters
      </button>
    </aside>
  );
};

export default ProductFilters;
