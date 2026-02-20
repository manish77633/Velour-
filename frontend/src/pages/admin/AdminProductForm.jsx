// frontend/src/pages/admin/AdminProductForm.jsx
// Used for BOTH Add New Product AND Edit Product
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import api from '../../services/api';
import { FiArrowLeft, FiPlus, FiX, FiImage, FiSave } from 'react-icons/fi';
import toast from 'react-hot-toast';

const SIZES_MEN_WOMEN = ['XS','S','M','L','XL','XXL'];
const SIZES_KIDS       = ['2-3Y','4-5Y','6-7Y','8-9Y','10-11Y'];
const COLOR_PRESETS    = [
  { name:'Black',  hex:'#1C1917' },{ name:'White',  hex:'#FAF7F2' },
  { name:'Brown',  hex:'#8B6F5C' },{ name:'Beige',  hex:'#EDE8DF' },
  { name:'Accent', hex:'#C4A882' },{ name:'Blue',   hex:'#4A6FA5' },
  { name:'Green',  hex:'#6B8F71' },{ name:'Red',    hex:'#C0392B' },
];

const EMPTY_FORM = {
  name:'', description:'', price:'', originalPrice:'',
  category:'Men', subCategory:'', stockQuantity:'',
  isFeatured: false, isActive: true,
  sizes:[], colors:[], images:[], tags:[],
};

export default function AdminProductForm() {
  const { id }   = useParams();       // exists → edit mode
  const isEdit   = Boolean(id);
  const navigate = useNavigate();

  const [form,    setForm]    = useState(EMPTY_FORM);
  const [loading, setLoading] = useState(false);
  const [fetching,setFetching]= useState(isEdit);
  const [imgInput,setImgInput]= useState('');
  const [tagInput,setTagInput]= useState('');

  // Load product for edit
  useEffect(() => {
    if (!isEdit) return;
    api.get(`/products/${id}`).then(({ data }) => {
      const p = data.product;
      setForm({
        name:         p.name        || '',
        description:  p.description || '',
        price:        p.price       || '',
        originalPrice:p.originalPrice || '',
        category:     p.category    || 'Men',
        subCategory:  p.subCategory || '',
        stockQuantity:p.stockQuantity || '',
        isFeatured:   p.isFeatured  || false,
        isActive:     p.isActive !== false,
        sizes:        p.sizes   || [],
        colors:       p.colors  || [],
        images:       p.images  || [],
        tags:         p.tags    || [],
      });
    }).catch(() => toast.error('Failed to load product'))
      .finally(() => setFetching(false));
  }, [id, isEdit]);

  const set = (key, val) => setForm((f) => ({ ...f, [key]: val }));

  // Toggle size
  const toggleSize = (s) => {
    set('sizes', form.sizes.includes(s)
      ? form.sizes.filter((x) => x !== s)
      : [...form.sizes, s]);
  };

  // Toggle color
  const toggleColor = (hex) => {
    set('colors', form.colors.includes(hex)
      ? form.colors.filter((x) => x !== hex)
      : [...form.colors, hex]);
  };

  // Add image URL
  const addImage = () => {
    const url = imgInput.trim();
    if (!url) return;
    if (!url.startsWith('http')) { toast.error('Enter a valid image URL'); return; }
    set('images', [...form.images, url]);
    setImgInput('');
  };

  // Add tag
  const addTag = (e) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      const tag = tagInput.trim().toLowerCase();
      if (!form.tags.includes(tag)) set('tags', [...form.tags, tag]);
      setTagInput('');
    }
  };

  const validate = () => {
    if (!form.name.trim())        { toast.error('Product name is required');    return false; }
    if (!form.description.trim()) { toast.error('Description is required');     return false; }
    if (!form.price || form.price <= 0) { toast.error('Valid price is required'); return false; }
    if (!form.stockQuantity)      { toast.error('Stock quantity is required');  return false; }
    if (form.sizes.length === 0)  { toast.error('Select at least one size');    return false; }
    if (form.images.length === 0) { toast.error('Add at least one image URL');  return false; }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      const payload = {
        ...form,
        price:         Number(form.price),
        originalPrice: form.originalPrice ? Number(form.originalPrice) : null,
        stockQuantity: Number(form.stockQuantity),
      };
      if (isEdit) {
        await api.put(`/products/${id}`, payload);
        toast.success('Product updated!');
      } else {
        await api.post('/products', payload);
        toast.success('Product added!');
      }
      navigate('/admin/products');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save product');
    } finally { setLoading(false); }
  };

  const sizesArr = form.category === 'Kids' ? SIZES_KIDS : SIZES_MEN_WOMEN;

  if (fetching) return (
    <div className="flex items-center justify-center h-64">
      <div className="w-8 h-8 border-2 border-soft border-t-warm rounded-full animate-spin"/>
    </div>
  );

  return (
    <div>
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Link to="/admin/products"
          className="w-9 h-9 flex items-center justify-center border border-soft rounded-sm hover:border-dark transition-colors">
          <FiArrowLeft size={16}/>
        </Link>
        <div>
          <h1 className="font-display text-3xl">{isEdit ? 'Edit Product' : 'Add New Product'}</h1>
          <p className="text-sm text-muted mt-0.5">{isEdit ? 'Update product details' : 'Fill in details to add a new product'}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* ── LEFT COL: Main Info ── */}
          <div className="lg:col-span-2 space-y-5">

            {/* Basic Info */}
            <div className="bg-white rounded-sm border border-soft p-6">
              <h2 className="font-display text-lg mb-5 pb-3 border-b border-soft">Basic Information</h2>
              <div className="space-y-4">
                <div>
                  <label className="form-label">Product Name *</label>
                  <input value={form.name} onChange={(e) => set('name', e.target.value)}
                    className="input-field mt-1.5" placeholder="e.g. Classic Linen Shirt" required/>
                </div>
                <div>
                  <label className="form-label">Description *</label>
                  <textarea value={form.description} onChange={(e) => set('description', e.target.value)}
                    className="input-field mt-1.5 resize-none" rows={4}
                    placeholder="Describe the product, fabric, fit, and features..."/>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="form-label">Category *</label>
                    <select value={form.category} onChange={(e) => set('category', e.target.value)}
                      className="input-field mt-1.5">
                      <option>Men</option>
                      <option>Women</option>
                      <option>Kids</option>
                    </select>
                  </div>
                  <div>
                    <label className="form-label">Sub Category</label>
                    <input value={form.subCategory} onChange={(e) => set('subCategory', e.target.value)}
                      className="input-field mt-1.5" placeholder="e.g. Shirts, Dresses, T-Shirts"/>
                  </div>
                </div>
              </div>
            </div>

            {/* Pricing & Stock */}
            <div className="bg-white rounded-sm border border-soft p-6">
              <h2 className="font-display text-lg mb-5 pb-3 border-b border-soft">Pricing & Stock</h2>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="form-label">Selling Price (₹) *</label>
                  <input type="number" min="0" value={form.price}
                    onChange={(e) => set('price', e.target.value)}
                    className="input-field mt-1.5" placeholder="2499"/>
                </div>
                <div>
                  <label className="form-label">Original Price (₹)</label>
                  <input type="number" min="0" value={form.originalPrice}
                    onChange={(e) => set('originalPrice', e.target.value)}
                    className="input-field mt-1.5" placeholder="3499 (optional)"/>
                  <p className="text-xs text-muted mt-1">Leave empty if no discount</p>
                </div>
                <div>
                  <label className="form-label">Stock Quantity *</label>
                  <input type="number" min="0" value={form.stockQuantity}
                    onChange={(e) => set('stockQuantity', e.target.value)}
                    className="input-field mt-1.5" placeholder="50"/>
                </div>
              </div>
              {form.price && form.originalPrice && Number(form.originalPrice) > Number(form.price) && (
                <div className="mt-3 p-2.5 bg-green-50 border border-green-200 rounded-sm text-xs text-green-700">
                  ✓ Discount: {Math.round(((form.originalPrice - form.price) / form.originalPrice) * 100)}% off
                </div>
              )}
            </div>

            {/* Images */}
            <div className="bg-white rounded-sm border border-soft p-6">
              <h2 className="font-display text-lg mb-5 pb-3 border-b border-soft">Product Images</h2>
              <p className="text-xs text-muted mb-3">Paste image URLs (from Unsplash, your server, Cloudinary, etc.)</p>

              {/* Image preview grid */}
              {form.images.length > 0 && (
                <div className="grid grid-cols-4 gap-2 mb-4">
                  {form.images.map((img, i) => (
                    <div key={i} className="relative aspect-[3/4] rounded-sm overflow-hidden bg-soft group">
                      <img src={img} alt="" className="w-full h-full object-cover"/>
                      <button type="button" onClick={() => set('images', form.images.filter((_,j) => j !== i))}
                        className="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white rounded-full text-xs
                                   flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <FiX size={10}/>
                      </button>
                      {i === 0 && <span className="absolute bottom-1 left-1 text-[9px] bg-dark text-white px-1 rounded">Main</span>}
                    </div>
                  ))}
                </div>
              )}

              <div className="flex gap-2">
                <div className="relative flex-1">
                  <FiImage size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted"/>
                  <input value={imgInput} onChange={(e) => setImgInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addImage())}
                    className="input-field pl-9 text-sm" placeholder="https://images.unsplash.com/..."/>
                </div>
                <button type="button" onClick={addImage}
                  className="btn-outline py-2.5 px-4 text-xs flex items-center gap-1.5">
                  <FiPlus size={13}/> Add
                </button>
              </div>
              <p className="text-xs text-muted mt-2">Press Enter or click Add. First image = main image.</p>
            </div>

            {/* Sizes */}
            <div className="bg-white rounded-sm border border-soft p-6">
              <h2 className="font-display text-lg mb-4 pb-3 border-b border-soft">Available Sizes *</h2>
              <div className="flex flex-wrap gap-2">
                {sizesArr.map((s) => (
                  <button key={s} type="button" onClick={() => toggleSize(s)}
                    className={`px-4 py-2 text-sm border rounded-sm transition-all font-medium
                      ${form.sizes.includes(s) ? 'bg-dark text-white border-dark' : 'border-soft hover:border-dark'}`}>
                    {s}
                  </button>
                ))}
              </div>
              {form.sizes.length === 0 && (
                <p className="text-xs text-red-400 mt-2">Select at least one size</p>
              )}
            </div>

            {/* Colors */}
            <div className="bg-white rounded-sm border border-soft p-6">
              <h2 className="font-display text-lg mb-4 pb-3 border-b border-soft">Available Colors</h2>
              <div className="flex flex-wrap gap-3 mb-3">
                {COLOR_PRESETS.map(({ name, hex }) => (
                  <div key={hex} className="flex flex-col items-center gap-1">
                    <button type="button" onClick={() => toggleColor(hex)}
                      className={`w-9 h-9 rounded-full border-3 transition-all
                        ${form.colors.includes(hex) ? 'ring-2 ring-offset-2 ring-dark border-dark' : 'border-transparent'}
                        ${hex === '#FAF7F2' ? 'border border-soft' : ''}`}
                      style={{ background: hex }} title={name}/>
                    <span className="text-[9px] text-muted">{name}</span>
                  </div>
                ))}
              </div>
              {form.colors.length > 0 && (
                <p className="text-xs text-muted">{form.colors.length} color{form.colors.length > 1 ? 's' : ''} selected</p>
              )}
            </div>

            {/* Tags */}
            <div className="bg-white rounded-sm border border-soft p-6">
              <h2 className="font-display text-lg mb-4 pb-3 border-b border-soft">Tags</h2>
              <div className="flex flex-wrap gap-2 mb-3">
                {form.tags.map((tag) => (
                  <span key={tag} className="flex items-center gap-1.5 bg-soft text-dark text-xs px-3 py-1 rounded-full">
                    {tag}
                    <button type="button" onClick={() => set('tags', form.tags.filter((t) => t !== tag))}>
                      <FiX size={10}/>
                    </button>
                  </span>
                ))}
              </div>
              <input value={tagInput} onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={addTag}
                className="input-field text-sm" placeholder="Type a tag and press Enter (e.g. summer, casual, linen)"/>
            </div>
          </div>

          {/* ── RIGHT COL: Settings ── */}
          <div className="space-y-5">

            {/* Status */}
            <div className="bg-white rounded-sm border border-soft p-5">
              <h2 className="font-display text-lg mb-4 pb-3 border-b border-soft">Status</h2>
              <div className="space-y-3">
                <label className="flex items-center justify-between cursor-pointer">
                  <span>
                    <p className="text-sm font-medium">Active</p>
                    <p className="text-xs text-muted">Visible on shop page</p>
                  </span>
                  <button type="button" onClick={() => set('isActive', !form.isActive)}
                    className={`relative w-11 h-6 rounded-full transition-colors ${form.isActive ? 'bg-green-500' : 'bg-gray-200'}`}>
                    <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform
                      ${form.isActive ? 'translate-x-5' : ''}`}/>
                  </button>
                </label>
                <label className="flex items-center justify-between cursor-pointer">
                  <span>
                    <p className="text-sm font-medium">Featured</p>
                    <p className="text-xs text-muted">Show on homepage</p>
                  </span>
                  <button type="button" onClick={() => set('isFeatured', !form.isFeatured)}
                    className={`relative w-11 h-6 rounded-full transition-colors ${form.isFeatured ? 'bg-warm' : 'bg-gray-200'}`}>
                    <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform
                      ${form.isFeatured ? 'translate-x-5' : ''}`}/>
                  </button>
                </label>
              </div>
            </div>

            {/* Summary Card */}
            <div className="bg-white rounded-sm border border-soft p-5">
              <h2 className="font-display text-lg mb-4 pb-3 border-b border-soft">Summary</h2>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted">Category</span>
                  <span className="font-medium">{form.category || '—'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted">Price</span>
                  <span className="font-medium">{form.price ? `₹${Number(form.price).toLocaleString()}` : '—'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted">Stock</span>
                  <span className="font-medium">{form.stockQuantity || '—'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted">Sizes</span>
                  <span className="font-medium">{form.sizes.length > 0 ? form.sizes.join(', ') : '—'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted">Images</span>
                  <span className="font-medium">{form.images.length} added</span>
                </div>
              </div>
            </div>

            {/* Save Button */}
            <button type="submit" disabled={loading}
              className="btn-primary w-full justify-center py-3.5 disabled:opacity-60">
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"/>
                  Saving...
                </span>
              ) : (
                <><FiSave size={15}/> {isEdit ? 'Update Product' : 'Save Product'}</>
              )}
            </button>
            <Link to="/admin/products"
              className="btn-outline w-full justify-center py-3 text-xs">
              Cancel
            </Link>
          </div>
        </div>
      </form>
    </div>
  );
}
