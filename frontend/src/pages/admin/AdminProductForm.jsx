// frontend/src/pages/admin/AdminProductForm.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { motion, Reorder, AnimatePresence } from 'framer-motion'; // Animation & Drag-Drop
import api from '../../services/api';
import { FiArrowLeft, FiPlus, FiX, FiImage, FiSave, FiCheck, FiMove, FiInfo } from 'react-icons/fi';
import toast from 'react-hot-toast';

const SIZES_MEN_WOMEN = ['XS','S','M','L','XL','XXL'];
const SIZES_KIDS       = ['2-3Y','4-5Y','6-7Y','8-9Y','10-11Y'];
const COLOR_PRESETS    = [
  { name:'Black',  hex:'#1C1917' }, { name:'White',  hex:'#FFFFFF' },
  { name:'Brown',  hex:'#8B6F5C' }, { name:'Beige',  hex:'#EDE8DF' },
  { name:'Navy',   hex:'#1e3a8a' }, { name:'Blue',   hex:'#4A6FA5' },
  { name:'Green',  hex:'#6B8F71' }, { name:'Red',    hex:'#C0392B' },
];

const EMPTY_FORM = {
  name:'', description:'', price:'', originalPrice:'',
  category:'Men', subCategory:'', stockQuantity:'',
  isFeatured: false, isActive: true,
  sizes:[], colors:[], images:[], tags:[],
};

// Animation Variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 100 } }
};

export default function AdminProductForm() {
  const { id }   = useParams();
  const isEdit   = Boolean(id);
  const navigate = useNavigate();

  const [form,    setForm]    = useState(EMPTY_FORM);
  const [loading, setLoading] = useState(false);
  const [fetching,setFetching]= useState(isEdit);
  const [imgInput,setImgInput]= useState('');
  const [tagInput,setTagInput]= useState('');

  // Load product logic (Unchanged)
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

  // Handlers (Unchanged Logic)
  const toggleSize = (s) => {
    set('sizes', form.sizes.includes(s) ? form.sizes.filter((x) => x !== s) : [...form.sizes, s]);
  };

  const toggleColor = (hex) => {
    set('colors', form.colors.includes(hex) ? form.colors.filter((x) => x !== hex) : [...form.colors, hex]);
  };

  const addImage = () => {
    const url = imgInput.trim();
    if (!url) return;
    if (!url.startsWith('http')) { toast.error('Enter a valid image URL'); return; }
    set('images', [...form.images, url]);
    setImgInput('');
  };

  const addTag = (e) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault(); // Prevent form submit on enter
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
        toast.success('Product updated successfully');
      } else {
        await api.post('/products', payload);
        toast.success('Product added successfully');
      }
      navigate('/admin/products');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save product');
    } finally { setLoading(false); }
  };

  const sizesArr = form.category === 'Kids' ? SIZES_KIDS : SIZES_MEN_WOMEN;

  if (fetching) return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="w-10 h-10 border-2 border-soft border-t-warm rounded-full animate-spin"/>
    </div>
  );

  return (
    <motion.div 
      initial="hidden" 
      animate="visible" 
      variants={containerVariants}
      className="pb-10"
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="flex items-center gap-4 mb-8">
        <Link to="/admin/products"
          className="w-10 h-10 flex items-center justify-center bg-white border border-soft rounded-lg text-muted hover:text-dark hover:border-warm transition-all duration-300 shadow-sm hover:shadow">
          <FiArrowLeft size={18}/>
        </Link>
        <div>
          <h1 className="font-display text-3xl font-normal text-dark">
            {isEdit ? 'Edit Product' : 'Add New Product'}
          </h1>
          <p className="text-sm text-muted mt-1 tracking-wide font-light">
            {isEdit ? 'Update product details and inventory' : 'Fill in the details to create a new product'}
          </p>
        </div>
      </motion.div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* ── LEFT COLUMN: Main Form ── */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Section: Basic Info */}
          <motion.div variants={itemVariants} className="bg-white rounded-xl border border-soft p-8 shadow-sm hover:shadow-md transition-shadow duration-300">
            <h2 className="font-display text-xl text-dark mb-6 flex items-center gap-2">
              Basic Information
            </h2>
            <div className="space-y-6">
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-muted mb-1.5 block">Product Name</label>
                <input 
                  value={form.name} 
                  onChange={(e) => set('name', e.target.value)}
                  className="w-full bg-gray-50 border border-soft rounded-lg px-4 py-3 text-dark focus:outline-none focus:ring-1 focus:ring-warm focus:border-warm transition-all placeholder:text-muted/50"
                  placeholder="e.g. Classic Linen Shirt" 
                />
              </div>
              
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-muted mb-1.5 block">Description</label>
                <textarea 
                  value={form.description} 
                  onChange={(e) => set('description', e.target.value)}
                  className="w-full bg-gray-50 border border-soft rounded-lg px-4 py-3 text-dark focus:outline-none focus:ring-1 focus:ring-warm focus:border-warm transition-all placeholder:text-muted/50 min-h-[120px] resize-none"
                  placeholder="Describe the product details..."
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-muted mb-1.5 block">Category</label>
                  <div className="relative">
                    <select 
                      value={form.category} 
                      onChange={(e) => set('category', e.target.value)}
                      className="w-full bg-gray-50 border border-soft rounded-lg px-4 py-3 text-dark focus:outline-none focus:ring-1 focus:ring-warm focus:border-warm appearance-none cursor-pointer"
                    >
                      <option>Men</option>
                      <option>Women</option>
                      <option>Kids</option>
                      <option>Accessories</option>
                    </select>
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-muted">▼</div>
                  </div>
                </div>
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-muted mb-1.5 block">Sub Category</label>
                  <input 
                    value={form.subCategory} 
                    onChange={(e) => set('subCategory', e.target.value)}
                    className="w-full bg-gray-50 border border-soft rounded-lg px-4 py-3 text-dark focus:outline-none focus:ring-1 focus:ring-warm focus:border-warm"
                    placeholder="e.g. Shirts, Pants"
                  />
                </div>
              </div>
            </div>
          </motion.div>

          {/* Section: Images (Drag & Drop) */}
          <motion.div variants={itemVariants} className="bg-white rounded-xl border border-soft p-8 shadow-sm hover:shadow-md transition-shadow duration-300">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-display text-xl text-dark">Product Images</h2>
              <span className="text-xs text-muted bg-gray-50 px-2 py-1 rounded border border-soft">
                Drag to reorder
              </span>
            </div>

            {/* Reorder Group for Drag and Drop */}
            <Reorder.Group 
              axis="y" 
              values={form.images} 
              onReorder={(newOrder) => set('images', newOrder)}
              className="space-y-3 mb-6"
            >
              <AnimatePresence initial={false}>
                {form.images.map((img, index) => (
                  <Reorder.Item 
                    key={img} 
                    value={img}
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    whileDrag={{ scale: 1.02, boxShadow: "0px 10px 20px rgba(0,0,0,0.1)" }}
                    className="relative bg-white border border-soft rounded-lg p-2 flex items-center gap-4 group cursor-grab active:cursor-grabbing"
                  >
                    {/* Handle */}
                    <div className="pl-2 text-muted/50 hover:text-muted">
                      <FiMove size={16}/>
                    </div>

                    {/* Thumbnail */}
                    <div className="w-16 h-20 bg-gray-100 rounded overflow-hidden flex-shrink-0 border border-soft">
                      <img src={img} alt="Product" className="w-full h-full object-cover"/>
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-muted truncate">{img}</p>
                      {index === 0 && (
                        <span className="inline-block mt-1 text-[10px] font-bold uppercase tracking-wider bg-dark text-white px-2 py-0.5 rounded-full">
                          Main Image
                        </span>
                      )}
                    </div>

                    {/* Remove Btn */}
                    <button 
                      type="button"
                      onClick={() => set('images', form.images.filter(url => url !== img))}
                      className="p-2 text-muted hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors mr-2"
                    >
                      <FiX size={16}/>
                    </button>
                  </Reorder.Item>
                ))}
              </AnimatePresence>
            </Reorder.Group>

            {/* Add Image Input */}
            <div className="relative">
              <FiImage size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted"/>
              <input 
                value={imgInput} 
                onChange={(e) => setImgInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addImage())}
                className="w-full pl-12 pr-20 py-3 bg-gray-50 border border-soft rounded-lg text-sm focus:outline-none focus:border-warm transition-all"
                placeholder="Paste image URL and press Enter..."
              />
              <button 
                type="button" 
                onClick={addImage}
                className="absolute right-2 top-1/2 -translate-y-1/2 px-3 py-1.5 bg-white border border-soft rounded text-xs font-medium hover:border-dark transition-colors"
              >
                Add
              </button>
            </div>
          </motion.div>

          {/* Section: Pricing & Stock */}
          <motion.div variants={itemVariants} className="bg-white rounded-xl border border-soft p-8 shadow-sm hover:shadow-md transition-shadow duration-300">
            <h2 className="font-display text-xl text-dark mb-6">Inventory & Pricing</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-muted mb-1.5 block">Price (₹)</label>
                <input 
                  type="number" 
                  min="0" 
                  value={form.price}
                  onChange={(e) => set('price', e.target.value)}
                  className="w-full bg-gray-50 border border-soft rounded-lg px-4 py-3 text-dark focus:border-warm focus:ring-0" 
                  placeholder="0.00"
                />
              </div>
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-muted mb-1.5 block">Original Price</label>
                <input 
                  type="number" 
                  min="0" 
                  value={form.originalPrice}
                  onChange={(e) => set('originalPrice', e.target.value)}
                  className="w-full bg-gray-50 border border-soft rounded-lg px-4 py-3 text-dark focus:border-warm focus:ring-0" 
                  placeholder="Optional"
                />
              </div>
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-muted mb-1.5 block">Stock Quantity</label>
                <input 
                  type="number" 
                  min="0" 
                  value={form.stockQuantity}
                  onChange={(e) => set('stockQuantity', e.target.value)}
                  className="w-full bg-gray-50 border border-soft rounded-lg px-4 py-3 text-dark focus:border-warm focus:ring-0" 
                  placeholder="0"
                />
              </div>
            </div>
            {/* Discount Badge Preview */}
            {form.price && form.originalPrice && Number(form.originalPrice) > Number(form.price) && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                className="mt-4 inline-flex items-center gap-2 px-3 py-2 bg-green-50 text-green-700 rounded border border-green-200 text-xs font-medium"
              >
                <FiCheck size={12}/>
                Calculated Discount: {Math.round(((form.originalPrice - form.price) / form.originalPrice) * 100)}% OFF
              </motion.div>
            )}
          </motion.div>

          {/* Section: Variants (Sizes/Colors) */}
          <motion.div variants={itemVariants} className="bg-white rounded-xl border border-soft p-8 shadow-sm hover:shadow-md transition-shadow duration-300">
            <h2 className="font-display text-xl text-dark mb-6">Product Variants</h2>
            
            {/* Sizes */}
            <div className="mb-6">
              <label className="text-xs font-bold uppercase tracking-wider text-muted mb-3 block">Available Sizes</label>
              <div className="flex flex-wrap gap-2">
                {sizesArr.map((s) => (
                  <button 
                    key={s} 
                    type="button" 
                    onClick={() => toggleSize(s)}
                    className={`min-w-[48px] h-10 px-3 rounded text-sm font-medium transition-all duration-200 border
                      ${form.sizes.includes(s) 
                        ? 'bg-dark text-white border-dark shadow-md scale-105' 
                        : 'bg-white text-muted border-soft hover:border-warm hover:text-dark'}`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Colors */}
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-muted mb-3 block">Available Colors</label>
              <div className="flex flex-wrap gap-3">
                {COLOR_PRESETS.map(({ name, hex }) => (
                  <button 
                    key={hex} 
                    type="button" 
                    onClick={() => toggleColor(hex)}
                    className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 relative group
                      ${form.colors.includes(hex) ? 'ring-2 ring-offset-2 ring-warm scale-110' : 'hover:scale-105'}`}
                    style={{ backgroundColor: hex }}
                    title={name}
                  >
                    {/* Checkmark for active */}
                    {form.colors.includes(hex) && (
                      <FiCheck size={14} className={hex === '#FFFFFF' || hex === '#FAF7F2' ? 'text-dark' : 'text-white'}/>
                    )}
                    {/* Border for light colors */}
                    {(hex === '#FFFFFF' || hex === '#FAF7F2') && (
                      <span className="absolute inset-0 rounded-full border border-soft/50"/>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        {/* ── RIGHT COLUMN: Sidebar ── */}
        <div className="space-y-6">
          
          {/* Status Card (Sticky) */}
          <motion.div variants={itemVariants} className="bg-white rounded-xl border border-soft p-6 shadow-sm sticky top-6">
            <h2 className="font-display text-lg text-dark mb-4 pb-4 border-b border-soft">Publish Settings</h2>
            
            <div className="space-y-5">
              {/* Active Toggle */}
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-sm text-dark">Active Status</p>
                  <p className="text-[11px] text-muted">Visible on store</p>
                </div>
                <button 
                  type="button" 
                  onClick={() => set('isActive', !form.isActive)}
                  className={`w-12 h-6 rounded-full relative transition-colors duration-300 focus:outline-none ${form.isActive ? 'bg-green-500' : 'bg-gray-200'}`}
                >
                  <motion.div 
                    layout 
                    className="w-4 h-4 bg-white rounded-full shadow absolute top-1"
                    initial={false}
                    animate={{ left: form.isActive ? 28 : 4 }}
                  />
                </button>
              </div>

              {/* Featured Toggle */}
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-sm text-dark">Featured Product</p>
                  <p className="text-[11px] text-muted">Show on homepage</p>
                </div>
                <button 
                  type="button" 
                  onClick={() => set('isFeatured', !form.isFeatured)}
                  className={`w-12 h-6 rounded-full relative transition-colors duration-300 focus:outline-none ${form.isFeatured ? 'bg-warm' : 'bg-gray-200'}`}
                >
                  <motion.div 
                    layout 
                    className="w-4 h-4 bg-white rounded-full shadow absolute top-1"
                    initial={false}
                    animate={{ left: form.isFeatured ? 28 : 4 }}
                  />
                </button>
              </div>
            </div>

            {/* Quick Summary */}
            <div className="mt-6 pt-6 border-t border-soft">
              <div className="space-y-2 text-xs">
                <div className="flex justify-between text-muted">
                  <span>Images</span>
                  <span className="font-medium text-dark">{form.images.length}</span>
                </div>
                <div className="flex justify-between text-muted">
                  <span>Sizes</span>
                  <span className="font-medium text-dark">{form.sizes.length}</span>
                </div>
                <div className="flex justify-between text-muted">
                  <span>Colors</span>
                  <span className="font-medium text-dark">{form.colors.length}</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-6 space-y-3">
              <button 
                type="submit" 
                disabled={loading}
                className="btn-primary w-full py-3 text-sm flex items-center justify-center gap-2 group hover:shadow-lg transform transition-all active:scale-[0.98]"
              >
                {loading ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"/> : <FiSave size={16}/>}
                <span>{isEdit ? 'Update Product' : 'Save Product'}</span>
              </button>
              
              <Link 
                to="/admin/products"
                className="w-full py-3 text-sm text-muted font-medium border border-transparent hover:border-soft rounded-lg flex items-center justify-center transition-all hover:bg-gray-50"
              >
                Cancel
              </Link>
            </div>
          </motion.div>

          {/* Tags Section */}
          <motion.div variants={itemVariants} className="bg-white rounded-xl border border-soft p-6 shadow-sm">
            <h2 className="font-display text-lg text-dark mb-4">Product Tags</h2>
            <div className="relative mb-3">
               <input 
                  value={tagInput} 
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={addTag}
                  className="w-full bg-gray-50 border border-soft rounded-lg px-3 py-2 text-sm focus:border-warm focus:outline-none" 
                  placeholder="Type tag & enter..."
                />
            </div>
            <div className="flex flex-wrap gap-2">
              <AnimatePresence>
                {form.tags.map((tag) => (
                  <motion.span 
                    key={tag}
                    initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}
                    className="inline-flex items-center gap-1.5 bg-warm/10 text-warm text-[10px] font-bold uppercase tracking-wide px-2.5 py-1 rounded-full border border-warm/20"
                  >
                    {tag}
                    <button type="button" onClick={() => set('tags', form.tags.filter(t => t !== tag))}>
                      <FiX size={10} className="hover:text-red-500 transition-colors"/>
                    </button>
                  </motion.span>
                ))}
              </AnimatePresence>
              {form.tags.length === 0 && <span className="text-xs text-muted italic">No tags added</span>}
            </div>
          </motion.div>
        </div>
      </form>
    </motion.div>
  );
}