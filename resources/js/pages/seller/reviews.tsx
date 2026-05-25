import { Head, useForm } from '@inertiajs/react';
import { useState } from 'react';
import { Star, MessageSquare } from 'lucide-react';
import SellerLayout from '@/layouts/seller-layout';

interface Review {
    id: number;
    rating: number;
    comment: string | null;
    seller_reply: string | null;
    user: { name: string };
    product: { name: string };
    created_at: string;
}

function Stars({ value }: { value: number }) {
    return (
        <div className="flex gap-0.5">
            {[1,2,3,4,5].map(s => (
                <Star key={s} className={`w-3.5 h-3.5 ${s <= value ? 'fill-amber-400 text-amber-400' : 'text-gray-200'}`} />
            ))}
        </div>
    );
}

function ReplyForm({ review, onDone }: { review: Review; onDone: () => void }) {
    const form = useForm({ reply: review.seller_reply ?? '' });
    return (
        <form onSubmit={e => { e.preventDefault(); form.patch(`/seller/reviews/${review.id}/reply`, { onSuccess: onDone }); }}
            className="mt-3 space-y-2">
            <textarea
                className="w-full px-3 py-2 rounded-xl text-sm border border-[#E8DDD0] bg-white outline-none focus:border-[#A67C52] resize-none"
                rows={3} placeholder="Write your reply…"
                value={form.data.reply}
                onChange={e => form.setData('reply', e.target.value)}
            />
            <div className="flex gap-2">
                <button type="submit" disabled={form.processing}
                    className="px-4 py-1.5 rounded-lg text-sm font-medium text-white disabled:opacity-60"
                    style={{ background: '#A67C52' }}>
                    {review.seller_reply ? 'Update Reply' : 'Post Reply'}
                </button>
                <button type="button" onClick={onDone}
                    className="px-4 py-1.5 rounded-lg text-sm font-medium border border-[#E8DDD0]"
                    style={{ color: '#6B5B4E' }}>
                    Cancel
                </button>
            </div>
        </form>
    );
}

export default function SellerReviews({ reviews }: { reviews: Review[] }) {
    const [replyingId, setReplyingId] = useState<number | null>(null);

    return (
        <SellerLayout title="Reviews">
            <Head title="Reviews" />
            <div className="space-y-4">
                <h1 className="text-xl font-bold" style={{ color: '#1A1A1A' }}>Product Reviews</h1>

                {reviews.length === 0 && (
                    <div className="bg-white rounded-2xl border p-10 text-center" style={{ borderColor: '#E8DDD0' }}>
                        <MessageSquare className="w-8 h-8 mx-auto mb-2" style={{ color: '#C49A6C' }} />
                        <p className="text-sm" style={{ color: '#9A8070' }}>No reviews yet.</p>
                    </div>
                )}

                {reviews.map(r => (
                    <div key={r.id} className="bg-white rounded-2xl border p-5" style={{ borderColor: '#E8DDD0' }}>
                        <div className="flex items-start justify-between gap-4">
                            <div className="flex items-center gap-3">
                                <div className="w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm text-white shrink-0"
                                    style={{ background: '#A67C52' }}>
                                    {r.user.name[0].toUpperCase()}
                                </div>
                                <div>
                                    <p className="font-semibold text-sm" style={{ color: '#1A1A1A' }}>{r.user.name}</p>
                                    <Stars value={r.rating} />
                                </div>
                            </div>
                            <div className="text-right shrink-0">
                                <p className="text-xs" style={{ color: '#9A8070' }}>{new Date(r.created_at).toLocaleDateString()}</p>
                                <p className="text-xs font-medium mt-0.5" style={{ color: '#A67C52' }}>{r.product.name}</p>
                            </div>
                        </div>

                        {r.comment && (
                            <p className="mt-3 text-sm" style={{ color: '#4A3728' }}>{r.comment}</p>
                        )}

                        {/* Existing reply */}
                        {r.seller_reply && replyingId !== r.id && (
                            <div className="mt-3 rounded-xl px-4 py-3 text-sm" style={{ background: '#FDF9F5', borderLeft: '3px solid #A67C52' }}>
                                <p className="text-xs font-semibold mb-1" style={{ color: '#A67C52' }}>Your Reply</p>
                                <p style={{ color: '#4A3728' }}>{r.seller_reply}</p>
                            </div>
                        )}

                        {replyingId === r.id ? (
                            <ReplyForm review={r} onDone={() => setReplyingId(null)} />
                        ) : (
                            <button onClick={() => setReplyingId(r.id)}
                                className="mt-3 text-xs font-medium hover:underline"
                                style={{ color: '#A67C52' }}>
                                {r.seller_reply ? 'Edit Reply' : 'Reply'}
                            </button>
                        )}
                    </div>
                ))}
            </div>
        </SellerLayout>
    );
}
