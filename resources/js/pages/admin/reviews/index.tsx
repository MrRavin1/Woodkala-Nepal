import { Head, useForm } from '@inertiajs/react';
import SellerLayout from '@/layouts/seller-layout';
import { Trash2, Star, Pencil, X } from 'lucide-react';
import { useState } from 'react';

interface Review { id: number; rating: number; comment: string | null; user: { name: string }; product: { name: string }; created_at: string; }

export default function AdminReviews({ reviews }: { reviews: Review[] }) {
    const del = useForm({});
    const edit = useForm({ rating: 5, comment: '' });
    const [editing, setEditing] = useState<Review | null>(null);

    function openEdit(r: Review) {
        setEditing(r);
        edit.setData({ rating: r.rating, comment: r.comment ?? '' });
    }

    function submitEdit(e: React.FormEvent) {
        e.preventDefault();
        edit.patch(`/admin/reviews/${editing!.id}`, { onSuccess: () => setEditing(null) });
    }

    return (
        <SellerLayout title="Reviews">
            <Head title="Reviews" />
            <div className="space-y-5">
                <div className="flex items-center justify-between">
                    <h1 className="text-xl font-bold" style={{ color: '#1A1A1A' }}>Reviews</h1>
                    <span className="text-sm" style={{ color: '#9A8070' }}>{reviews.length} total</span>
                </div>

                <div className="bg-white rounded-2xl border border-[#E8DDD0] overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead style={{ background: '#FDF9F5', borderBottom: '1px solid #E8DDD0' }}>
                            <tr>
                                {['Customer','Product','Rating','Comment','Date','Actions'].map(h => (
                                    <th key={h} className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-left" style={{ color: '#7A6A5A' }}>{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {reviews.length === 0 ? (
                                <tr><td colSpan={6} className="px-4 py-10 text-center text-sm" style={{ color: '#9A8070' }}>No reviews yet.</td></tr>
                            ) : reviews.map((r, i) => (
                                <tr key={r.id} style={{ borderBottom: i < reviews.length - 1 ? '1px solid #F0EDE8' : 'none' }}>
                                    <td className="px-4 py-3 font-medium" style={{ color: '#1A1A1A' }}>{r.user.name}</td>
                                    <td className="px-4 py-3 text-sm" style={{ color: '#6B5B4E' }}>{r.product.name}</td>
                                    <td className="px-4 py-3">
                                        <div className="flex gap-0.5">
                                            {[1,2,3,4,5].map(s => (
                                                <Star key={s} className="w-3.5 h-3.5" style={{ fill: s <= r.rating ? '#A67C52' : 'none', color: s <= r.rating ? '#A67C52' : '#DDD6CC' }} />
                                            ))}
                                        </div>
                                    </td>
                                    <td className="px-4 py-3 max-w-xs" style={{ color: '#6B5B4E' }}>
                                        <span className="line-clamp-2">{r.comment ?? '—'}</span>
                                    </td>
                                    <td className="px-4 py-3 text-xs" style={{ color: '#9A8070' }}>{new Date(r.created_at).toLocaleDateString()}</td>
                                    <td className="px-4 py-3">
                                        <div className="flex gap-1">
                                            <button onClick={() => openEdit(r)}
                                                className="p-1.5 rounded-lg hover:bg-amber-50 transition-colors" style={{ color: '#A67C52' }}>
                                                <Pencil className="w-3.5 h-3.5" />
                                            </button>
                                            <button onClick={() => { if (confirm('Delete this review?')) del.delete(`/admin/reviews/${r.id}`); }}
                                                className="p-1.5 rounded-lg hover:bg-red-50 transition-colors" style={{ color: '#dc2626' }}>
                                                <Trash2 className="w-3.5 h-3.5" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Edit Modal */}
            {editing && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 space-y-4">
                        <div className="flex items-center justify-between">
                            <h2 className="font-semibold text-base" style={{ color: '#1A1A1A' }}>Edit Review</h2>
                            <button onClick={() => setEditing(null)} className="p-1 rounded hover:bg-gray-100"><X className="w-4 h-4" /></button>
                        </div>
                        <p className="text-xs" style={{ color: '#9A8070' }}>
                            {editing.user.name} on <span className="font-medium">{editing.product.name}</span>
                        </p>
                        <form onSubmit={submitEdit} className="space-y-4">
                            <div>
                                <label className="text-xs font-medium mb-1 block" style={{ color: '#7A6A5A' }}>Rating</label>
                                <div className="flex gap-1">
                                    {[1,2,3,4,5].map(s => (
                                        <button type="button" key={s} onClick={() => edit.setData('rating', s)}>
                                            <Star className="w-6 h-6" style={{ fill: s <= edit.data.rating ? '#A67C52' : 'none', color: s <= edit.data.rating ? '#A67C52' : '#DDD6CC' }} />
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div>
                                <label className="text-xs font-medium mb-1 block" style={{ color: '#7A6A5A' }}>Comment</label>
                                <textarea
                                    value={edit.data.comment}
                                    onChange={e => edit.setData('comment', e.target.value)}
                                    rows={3}
                                    className="w-full border border-[#E8DDD0] rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#A67C52]"
                                    style={{ color: '#1A1A1A' }}
                                />
                            </div>
                            <div className="flex justify-end gap-2">
                                <button type="button" onClick={() => setEditing(null)}
                                    className="px-4 py-2 text-sm rounded-lg border border-[#E8DDD0] hover:bg-gray-50" style={{ color: '#6B5B4E' }}>
                                    Cancel
                                </button>
                                <button type="submit" disabled={edit.processing}
                                    className="px-4 py-2 text-sm rounded-lg text-white disabled:opacity-60"
                                    style={{ background: '#A67C52' }}>
                                    Save
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </SellerLayout>
    );
}
