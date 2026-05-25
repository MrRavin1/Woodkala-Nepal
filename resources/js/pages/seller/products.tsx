import { Head, useForm } from '@inertiajs/react';
import { useState } from 'react';
import { Plus, Pencil, Trash2, X, ZoomIn } from 'lucide-react';
import SellerLayout from '@/layouts/seller-layout';

interface Category { id: number; name: string; }
interface Product {
    id: number; name: string; price: number; stock: number; is_active: boolean;
    material: string | null; dimensions: string | null; description: string | null;
    images: string[] | null; category: { id: number; name: string };
}

const INPUT = 'w-full h-10 bg-slate-50 border border-slate-200 rounded-lg px-3 text-sm text-slate-800 outline-none focus:ring-2 focus:ring-amber-400/40 focus:border-amber-400 transition-all';

function ImageUploader({ previews, onFiles }: { previews: string[]; onFiles: (f: File[]) => void }) {
    const [zoom, setZoom] = useState<string | null>(null);
    return (
        <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">Product Images</label>
            <label className="flex flex-col items-center justify-center w-full h-24 border-2 border-dashed border-slate-200 rounded-xl cursor-pointer hover:border-amber-400 hover:bg-amber-50/30 transition-all">
                <Plus className="w-5 h-5 text-slate-400 mb-1" />
                <span className="text-xs text-slate-400">Click to upload images</span>
                <input type="file" multiple accept="image/*" className="hidden" onChange={e => onFiles(Array.from(e.target.files ?? []))} />
            </label>
            {previews.length > 0 && (
                <div className="flex gap-2 flex-wrap">
                    {previews.map((src, i) => (
                        <div key={i} className="relative group w-14 h-14 rounded-lg overflow-hidden border border-slate-200">
                            <img src={src} alt="" className="w-full h-full object-cover" />
                            <button type="button" onClick={() => setZoom(src)}
                                className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <ZoomIn className="w-3.5 h-3.5 text-white" />
                            </button>
                        </div>
                    ))}
                </div>
            )}
            {zoom && (
                <div className="fixed inset-0 z-[200] bg-black/80 flex items-center justify-center p-4" onClick={() => setZoom(null)}>
                    <img src={zoom} alt="" className="max-w-full max-h-[85vh] rounded-xl object-contain" />
                </div>
            )}
        </div>
    );
}

export default function SellerProducts({ products, categories }: { products: Product[]; categories: Category[] }) {
    const [showForm, setShowForm] = useState(false);
    const [editing, setEditing] = useState<Product | null>(null);
    const [previews, setPreviews] = useState<string[]>([]);
    const form = useForm({ category_id: '', name: '', description: '', price: '', stock: '', material: '', dimensions: '', is_active: true as boolean, images: [] as File[] });
    const deleteForm = useForm({});

    function openCreate() { form.reset(); setPreviews([]); setEditing(null); setShowForm(true); }
    function openEdit(p: Product) {
        form.setData({ category_id: String(p.category.id), name: p.name, description: p.description ?? '', price: String(p.price), stock: String(p.stock), material: p.material ?? '', dimensions: p.dimensions ?? '', is_active: p.is_active, images: [] });
        setPreviews(p.images?.map(img => `/storage/${img}`) ?? []);
        setEditing(p); setShowForm(true);
    }
    function submit(e: React.FormEvent) {
        e.preventDefault();
        const opts = { forceFormData: true, onSuccess: () => { setShowForm(false); setPreviews([]); form.reset(); } };
        editing ? form.post(`/seller/products/${editing.id}`, opts) : form.post('/seller/products', opts);
    }

    return (
        <SellerLayout title="Products">
            <Head title="Products — Seller Panel" />
            <div className="space-y-5">

                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-xl font-bold text-slate-800">Products</h1>
                        <p className="text-slate-500 text-sm mt-0.5">{products.length} listing{products.length !== 1 ? 's' : ''}</p>
                    </div>
                    <button onClick={openCreate}
                        className="inline-flex items-center gap-2 text-white px-4 py-2.5 rounded-lg text-sm font-semibold transition-all"
                        style={{ background: '#A67C52' }}
                        onMouseEnter={e => (e.currentTarget.style.background = '#8B6340')}
                        onMouseLeave={e => (e.currentTarget.style.background = '#A67C52')}>
                        <Plus className="w-4 h-4" /> Add Product
                    </button>
                </div>

                {/* Table */}
                <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                    {products.length === 0 ? (
                        <div className="py-20 text-center space-y-3">
                            <p className="text-slate-400">No products yet.</p>
                            <button onClick={openCreate} className="text-sm hover:underline" style={{ color: '#A67C52' }}>Add your first product →</button>
                        </div>
                    ) : (
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="text-left text-xs text-slate-400 uppercase tracking-wide border-b border-slate-100 bg-slate-50">
                                    <th className="px-5 py-3">Product</th>
                                    <th className="px-5 py-3">Category</th>
                                    <th className="px-5 py-3">Price</th>
                                    <th className="px-5 py-3">Stock</th>
                                    <th className="px-5 py-3">Status</th>
                                    <th className="px-5 py-3"></th>
                                </tr>
                            </thead>
                            <tbody>
                                {products.map(p => (
                                    <tr key={p.id} className="border-b border-slate-50 last:border-0 hover:bg-slate-50 transition-colors">
                                        <td className="px-5 py-3">
                                            <div className="flex items-center gap-3">
                                                <div className="w-9 h-9 rounded-lg overflow-hidden bg-slate-100 shrink-0">
                                                    {p.images?.[0]
                                                        ? <img src={`/storage/${p.images[0]}`} alt="" className="w-full h-full object-cover" />
                                                        : <div className="w-full h-full bg-slate-200" />
                                                    }
                                                </div>
                                                <span className="font-medium text-slate-800">{p.name}</span>
                                            </div>
                                        </td>
                                        <td className="px-5 py-3 text-slate-500">{p.category.name}</td>
                                        <td className="px-5 py-3 font-semibold text-slate-800">रू {Number(p.price).toLocaleString()}</td>
                                        <td className="px-5 py-3">
                                            <span className={p.stock <= 5 ? 'text-red-600 font-semibold' : 'text-slate-600'}>{p.stock}</span>
                                            {p.stock <= 5 && <span className="ml-1 text-xs text-red-500">Low</span>}
                                        </td>
                                        <td className="px-5 py-3">
                                            <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${p.is_active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'}`}>
                                                {p.is_active ? 'Active' : 'Inactive'}
                                            </span>
                                        </td>
                                        <td className="px-5 py-3">
                                            <div className="flex items-center gap-1">
                                                <button onClick={() => openEdit(p)} className="p-1.5 rounded-lg hover:bg-blue-50 text-blue-600 transition-colors">
                                                    <Pencil className="w-3.5 h-3.5" />
                                                </button>
                                                <button onClick={() => confirm('Delete this product?') && deleteForm.delete(`/seller/products/${p.id}`)}
                                                    className="p-1.5 rounded-lg hover:bg-red-50 text-red-500 transition-colors">
                                                    <Trash2 className="w-3.5 h-3.5" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>

            {/* Modal */}
            {showForm && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
                    <form onSubmit={submit} className="bg-white rounded-2xl p-6 w-full max-w-lg space-y-4 my-auto shadow-2xl">
                        <div className="flex items-center justify-between">
                            <h2 className="font-bold text-lg text-slate-800">{editing ? 'Edit Product' : 'Add Product'}</h2>
                            <button type="button" onClick={() => setShowForm(false)} className="p-1.5 rounded-lg hover:bg-slate-100 transition-colors">
                                <X className="w-4 h-4 text-slate-500" />
                            </button>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <div className="col-span-2">
                                <label className="text-sm font-medium text-slate-700 block mb-1">Product Name</label>
                                <input className={INPUT} value={form.data.name} onChange={e => form.setData('name', e.target.value)} placeholder="e.g. Teak Dining Table" required />
                                {form.errors.name && <p className="text-red-500 text-xs mt-1">{form.errors.name}</p>}
                            </div>
                            <div className="col-span-2">
                                <label className="text-sm font-medium text-slate-700 block mb-1">Category</label>
                                <select className={INPUT} value={form.data.category_id} onChange={e => form.setData('category_id', e.target.value)} required>
                                    <option value="">Select category</option>
                                    {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                </select>
                            </div>
                            <div className="col-span-2">
                                <label className="text-sm font-medium text-slate-700 block mb-1">Description</label>
                                <textarea className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-800 outline-none focus:ring-2 focus:ring-amber-400/40 focus:border-amber-400 resize-none transition-all" rows={2}
                                    value={form.data.description} onChange={e => form.setData('description', e.target.value)} placeholder="Describe your product..." />
                            </div>
                            <div>
                                <label className="text-sm font-medium text-slate-700 block mb-1">Price (रू)</label>
                                <input type="number" min="0" className={INPUT} value={form.data.price} onChange={e => form.setData('price', e.target.value)} required />
                            </div>
                            <div>
                                <label className="text-sm font-medium text-slate-700 block mb-1">Stock</label>
                                <input type="number" min="0" className={INPUT} value={form.data.stock} onChange={e => form.setData('stock', e.target.value)} required />
                            </div>
                            <div>
                                <label className="text-sm font-medium text-slate-700 block mb-1">Material</label>
                                <input className={INPUT} value={form.data.material} onChange={e => form.setData('material', e.target.value)} placeholder="e.g. Teak Wood" />
                            </div>
                            <div>
                                <label className="text-sm font-medium text-slate-700 block mb-1">Dimensions</label>
                                <input className={INPUT} value={form.data.dimensions} onChange={e => form.setData('dimensions', e.target.value)} placeholder="120×60×75 cm" />
                            </div>
                            <div className="col-span-2">
                                <ImageUploader previews={previews} onFiles={files => { form.setData('images', files); setPreviews(files.map(f => URL.createObjectURL(f))); }} />
                            </div>
                            {editing && (
                                <div className="col-span-2 flex items-center gap-2">
                                    <input type="checkbox" id="is_active" checked={form.data.is_active} onChange={e => form.setData('is_active', e.target.checked)} className="w-4 h-4" style={{ accentColor: '#A67C52' }} />
                                    <label htmlFor="is_active" className="text-sm text-slate-700 cursor-pointer">Active (visible to buyers)</label>
                                </div>
                            )}
                        </div>

                        <div className="flex gap-3 justify-end pt-2 border-t border-slate-100">
                            <button type="button" onClick={() => setShowForm(false)} className="border border-slate-200 px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors">Cancel</button>
                            <button type="submit" disabled={form.processing}
                                className="text-white px-5 py-2.5 rounded-lg text-sm font-semibold transition-all disabled:opacity-60"
                                style={{ background: '#A67C52' }}
                                onMouseEnter={e => (e.currentTarget.style.background = '#8B6340')}
                                onMouseLeave={e => (e.currentTarget.style.background = '#A67C52')}>
                                {form.processing ? 'Saving...' : editing ? 'Update' : 'Add Product'}
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </SellerLayout>
    );
}
