import { Head, useForm } from '@inertiajs/react';
import SellerLayout from '@/layouts/seller-layout';
import { useState } from 'react';
import { Plus, Pencil, Trash2, X } from 'lucide-react';

interface Category { id: number; name: string; }
interface Product {
    id: number; name: string; price: number; stock: number;
    is_active: boolean; material: string | null; category: Category;
    images: string[] | null;
}

const card = "bg-white rounded-2xl border border-[#E8DDD0] overflow-hidden";
const th = "px-4 py-3 text-xs font-semibold uppercase tracking-wide text-left" ;
const td = "px-4 py-3 text-sm text-[#1A1A1A]";
const inp = "w-full h-10 px-3 rounded-lg text-sm border border-[#E8DDD0] bg-white text-[#1A1A1A] outline-none focus:border-[#A67C52] transition-colors";

export default function ProductsIndex({ products, categories }: { products: Product[]; categories: Category[] }) {
    const [showForm, setShowForm] = useState(false);
    const [editing, setEditing] = useState<Product | null>(null);

    const form = useForm({
        category_id: '', name: '', description: '', price: '',
        stock: '', material: '', dimensions: '', is_active: true as boolean,
        images: [] as File[],
    });

    function openCreate() { form.reset(); setEditing(null); setShowForm(true); }
    function openEdit(p: Product) {
        form.setData({ category_id: String(p.category.id), name: p.name, description: '', price: String(p.price), stock: String(p.stock), material: p.material ?? '', dimensions: '', is_active: p.is_active, images: [] });
        setEditing(p); setShowForm(true);
    }
    function submit(e: React.FormEvent) {
        e.preventDefault();
        const opts = { forceFormData: true, onSuccess: () => setShowForm(false) };
        editing ? form.post(`/admin/products/${editing.id}?_method=PATCH`, opts) : form.post('/admin/products', opts);
    }
    function deleteProduct(id: number) {
        if (confirm('Delete this product?')) useForm({}).delete(`/admin/products/${id}`);
    }

    return (
        <SellerLayout title="Products">
            <Head title="Products" />
            <div className="space-y-5">
                <div className="flex justify-between items-center">
                    <h1 className="text-xl font-bold" style={{ color: '#1A1A1A' }}>Products</h1>
                    <button onClick={openCreate} className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white transition-all" style={{ background: '#A67C52' }}>
                        <Plus className="w-4 h-4" /> Add Product
                    </button>
                </div>

                <div className={card}>
                    <table className="w-full text-sm">
                        <thead style={{ background: '#FDF9F5', borderBottom: '1px solid #E8DDD0' }}>
                            <tr>
                                {['Image','Name','Category','Price','Stock','Status','Actions'].map(h => (
                                    <th key={h} className={th} style={{ color: '#7A6A5A' }}>{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {products.map((p, i) => (
                                <tr key={p.id} style={{ borderBottom: i < products.length - 1 ? '1px solid #F0EDE8' : 'none' }}>
                                    <td className="px-4 py-3">
                                        {p.images?.[0]
                                            ? <img src={p.images[0].startsWith('http') ? p.images[0] : `/storage/${p.images[0]}`} alt={p.name} className="w-10 h-10 rounded-lg object-cover border border-[#E8DDD0]" />
                                            : <div className="w-10 h-10 rounded-lg bg-[#F5F0EB] flex items-center justify-center text-[#9A8070] text-xs">—</div>
                                        }
                                    </td>
                                    <td className={td + ' font-medium'}>{p.name}</td>
                                    <td className={td} style={{ color: '#6B5B4E' }}>{p.category.name}</td>
                                    <td className={td}>रू {Number(p.price).toLocaleString()}</td>
                                    <td className={td}>{p.stock}</td>
                                    <td className={td}>
                                        <span className="px-2.5 py-1 rounded-full text-xs font-medium" style={p.is_active ? { background: '#F0FDF4', color: '#16a34a' } : { background: '#FEF2F2', color: '#dc2626' }}>
                                            {p.is_active ? 'Active' : 'Inactive'}
                                        </span>
                                    </td>
                                    <td className={td}>
                                        <div className="flex gap-2">
                                            <button onClick={() => openEdit(p)} className="p-1.5 rounded-lg hover:bg-[#F5F0EB] transition-colors" style={{ color: '#A67C52' }}><Pencil className="w-3.5 h-3.5" /></button>
                                            <button onClick={() => deleteProduct(p.id)} className="p-1.5 rounded-lg hover:bg-red-50 transition-colors" style={{ color: '#dc2626' }}><Trash2 className="w-3.5 h-3.5" /></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {showForm && (
                    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 py-8 px-4">
                        <form onSubmit={submit} className="bg-white rounded-2xl p-6 w-full max-w-lg space-y-4 shadow-xl border border-[#E8DDD0] overflow-y-auto max-h-[90vh]">
                            <div className="flex justify-between items-center">
                                <h2 className="font-bold text-lg" style={{ color: '#1A1A1A' }}>{editing ? 'Edit Product' : 'Add Product'}</h2>
                                <button type="button" onClick={() => setShowForm(false)} className="p-1.5 rounded-lg hover:bg-[#F5F0EB]" style={{ color: '#6B5B4E' }}><X className="w-4 h-4" /></button>
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <div className="col-span-2"><label className="text-xs font-medium text-[#6B5B4E] mb-1 block">Name</label><input className={inp} value={form.data.name} onChange={e => form.setData('name', e.target.value)} required /></div>
                                <div className="col-span-2"><label className="text-xs font-medium text-[#6B5B4E] mb-1 block">Category</label>
                                    <select className={inp} value={form.data.category_id} onChange={e => form.setData('category_id', e.target.value)} required>
                                        <option value="">Select category</option>
                                        {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                    </select>
                                </div>
                                <div className="col-span-2"><label className="text-xs font-medium text-[#6B5B4E] mb-1 block">Description</label><textarea className={inp + ' h-20 py-2 resize-none'} value={form.data.description} onChange={e => form.setData('description', e.target.value)} /></div>
                                <div><label className="text-xs font-medium text-[#6B5B4E] mb-1 block">Price (NPR)</label><input type="number" className={inp} value={form.data.price} onChange={e => form.setData('price', e.target.value)} required /></div>
                                <div><label className="text-xs font-medium text-[#6B5B4E] mb-1 block">Stock</label><input type="number" className={inp} value={form.data.stock} onChange={e => form.setData('stock', e.target.value)} required /></div>
                                <div><label className="text-xs font-medium text-[#6B5B4E] mb-1 block">Material</label><input className={inp} value={form.data.material} onChange={e => form.setData('material', e.target.value)} placeholder="e.g. Teak Wood" /></div>
                                <div><label className="text-xs font-medium text-[#6B5B4E] mb-1 block">Dimensions</label><input className={inp} value={form.data.dimensions} onChange={e => form.setData('dimensions', e.target.value)} placeholder="e.g. 120×60×75 cm" /></div>
                                <div className="col-span-2"><label className="text-xs font-medium text-[#6B5B4E] mb-1 block">Images</label><input type="file" multiple accept="image/*" className="text-sm text-[#6B5B4E]" onChange={e => form.setData('images', Array.from(e.target.files ?? []))} /></div>
                                {editing && (
                                    <div className="col-span-2 flex items-center gap-2">
                                        <input type="checkbox" id="is_active" checked={form.data.is_active} onChange={e => form.setData('is_active', e.target.checked)} />
                                        <label htmlFor="is_active" className="text-sm text-[#1A1A1A]">Active</label>
                                    </div>
                                )}
                            </div>
                            <div className="flex gap-3 justify-end pt-2">
                                <button type="button" onClick={() => setShowForm(false)} className="px-4 py-2 rounded-xl text-sm border border-[#E8DDD0] text-[#6B5B4E] hover:bg-[#F5F0EB] transition-colors">Cancel</button>
                                <button type="submit" disabled={form.processing} className="px-4 py-2 rounded-xl text-sm font-semibold text-white disabled:opacity-60" style={{ background: '#A67C52' }}>
                                    {editing ? 'Update' : 'Create'}
                                </button>
                            </div>
                        </form>
                    </div>
                )}
            </div>
        </SellerLayout>
    );
}
