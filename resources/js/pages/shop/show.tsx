import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Star, ShoppingCart, Store, Minus, Plus, Heart, ChevronLeft, ChevronRight, Shield, Truck, RefreshCw, MessageSquare, Trash2, Package } from 'lucide-react';
import ShopLayout from '@/components/shop-layout';
import { imgSrc } from '@/lib/img';

interface ReviewComment { id: number; body: string; user: { id: number; name: string }; created_at: string; }
interface Review { id: number; rating: number; comment: string | null; seller_reply: string | null; user: { id: number; name: string }; created_at: string; comments: ReviewComment[]; }
interface Product {
    id: number; name: string; slug: string; price: number; stock: number;
    seller_id: number | null;
    description: string | null; material: string | null; dimensions: string | null;
    images: string[] | null; category: { name: string };
    seller: { id: number; name: string; shop_name: string | null; shop_description: string | null; avatar: string | null } | null;
    reviews: Review[];
}

function Stars({ value, onChange, size = 'sm' }: { value: number; onChange?: (v: number) => void; size?: 'sm' | 'lg' }) {
    const cls = size === 'lg' ? 'w-6 h-6' : 'w-4 h-4';
    return (
        <div className="flex gap-0.5">
            {[1, 2, 3, 4, 5].map(s => (
                <button key={s} type="button" onClick={() => onChange?.(s)} className={onChange ? 'cursor-pointer' : 'cursor-default'}>
                    <Star className={`${cls} ${s <= value ? 'fill-primary text-primary' : 'text-border'} transition-colors`} />
                </button>
            ))}
        </div>
    );
}

function CommentSection({ review, authUserId }: { review: Review; authUserId: number | null }) {
    const [open, setOpen] = useState(false);
    const form = useForm({ body: '' });
    const delForm = useForm({});

    function submit(e: React.FormEvent) {
        e.preventDefault();
        form.post(`/reviews/${review.id}/comments`, {
            onSuccess: () => form.reset(),
        });
    }

    return (
        <div className="mt-3">
            <button onClick={() => setOpen(v => !v)}
                className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary transition-colors">
                <MessageSquare className="w-3.5 h-3.5" />
                {review.comments.length > 0 ? `${review.comments.length} comment${review.comments.length > 1 ? 's' : ''}` : 'Add comment'}
            </button>

            <AnimatePresence>
                {open && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2 }} className="overflow-hidden">
                        <div className="mt-3 pl-4 border-l-2 border-border space-y-3">
                            {review.comments.map(c => (
                                <div key={c.id} className="flex items-start gap-2 group">
                                    <div className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                                        {c.user.name[0].toUpperCase()}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <span className="text-xs font-semibold">{c.user.name}</span>
                                        <span className="text-[10px] text-muted-foreground ml-2">{new Date(c.created_at).toLocaleDateString()}</span>
                                        <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{c.body}</p>
                                    </div>
                                    {authUserId === c.user.id && (
                                        <button onClick={() => delForm.delete(`/review-comments/${c.id}`, { preserveScroll: true })}
                                            className="opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive shrink-0">
                                            <Trash2 className="w-3 h-3" />
                                        </button>
                                    )}
                                </div>
                            ))}

                            {authUserId && (
                                <form onSubmit={submit} className="flex gap-2">
                                    <input
                                        className="flex-1 bg-muted rounded-lg px-3 py-1.5 text-xs outline-none focus:ring-1 focus:ring-ring"
                                        placeholder="Write a comment…"
                                        value={form.data.body}
                                        onChange={e => form.setData('body', e.target.value)}
                                        maxLength={500}
                                    />
                                    <button type="submit" disabled={form.processing || !form.data.body.trim()}
                                        className="px-3 py-1.5 bg-primary text-primary-foreground rounded-lg text-xs font-medium disabled:opacity-50 hover:opacity-90 transition">
                                        Post
                                    </button>
                                </form>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

export default function ShopShow({ product, avg_rating, user_review, related = [], wishlisted = false, can_review = false }: {
    product: Product; avg_rating: number; user_review: Review | null;
    related?: { id: number; name: string; slug: string; price: number; images: string[] | null; category: { name: string } }[];
    wishlisted?: boolean;
    can_review?: boolean;
}) {
    const { auth } = usePage<{ auth: { user: { id: number } | null } }>().props;
    const isOwnProduct = auth.user?.id === product.seller_id;
    const images = product.images ?? [];
    const [editingReview, setEditingReview] = useState(false);
    const [imgIdx, setImgIdx] = useState(0);
    const [zoomed, setZoomed] = useState(false);
    const [zoomPos, setZoomPos] = useState({ x: 50, y: 50 });
    const viewerRef = useRef<HTMLDivElement>(null);

    function onMouseMove(e: React.MouseEvent) {
        const rect = viewerRef.current!.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;
        setZoomPos({ x, y });
    }
    const cartForm = useForm({ product_id: product.id, quantity: 1 });
    const reviewForm = useForm({ product_id: product.id, rating: user_review?.rating ?? 5, comment: user_review?.comment ?? '' });
    const wishlistForm = useForm({});
    const buyNowForm = useForm({ product_id: product.id, quantity: 1 });

    const activeSrc = imgSrc(images, imgIdx)
        ?? 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=600&h=600&fit=crop&q=80';

    return (
        <ShopLayout>
            <Head title={`${product.name} — Wood Kala`} />

            <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
                {/* Breadcrumb */}
                <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6 flex-wrap">
                    <Link href="/shop" className="hover:text-primary transition-colors">Shop</Link>
                    <span>/</span>
                    <Link href={`/shop?category=${product.category.name.toLowerCase()}`} className="hover:text-primary transition-colors">{product.category.name}</Link>
                    <span>/</span>
                    <span className="text-foreground truncate max-w-[200px]">{product.name}</span>
                </nav>

                <div className="grid lg:grid-cols-[1fr_480px] gap-10">
                    {/* ── LEFT: Viewer ── */}
                    <div className="space-y-3">
                    {/* Main viewer */}
                        <div ref={viewerRef}
                            className="aspect-square rounded-2xl bg-muted relative shadow-xl overflow-hidden"
                            style={{ cursor: zoomed ? 'zoom-out' : 'zoom-in' }}
                            onMouseMove={onMouseMove}
                            onMouseEnter={() => setZoomed(true)}
                            onMouseLeave={() => setZoomed(false)}
                            onClick={() => setZoomed(v => !v)}>
                            <AnimatePresence mode="wait">
                                <motion.div key={imgIdx}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: 0.25 }}
                                    className="w-full h-full">
                                    <img
                                        src={activeSrc}
                                        alt={product.name}
                                        className="w-full h-full object-cover transition-transform duration-200"
                                        style={{
                                            transformOrigin: `${zoomPos.x}% ${zoomPos.y}%`,
                                            transform: zoomed ? 'scale(2)' : 'scale(1)',
                                        }}
                                        draggable={false}
                                    />
                                </motion.div>
                            </AnimatePresence>
                            {images.length > 1 && (
                                <>
                                    <button onClick={() => setImgIdx(i => (i - 1 + images.length) % images.length)}
                                        className="absolute left-3 top-1/2 -translate-y-1/2 bg-background/80 backdrop-blur p-2 rounded-xl hover:bg-background transition-colors shadow">
                                        <ChevronLeft className="w-4 h-4" />
                                    </button>
                                    <button onClick={() => setImgIdx(i => (i + 1) % images.length)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 bg-background/80 backdrop-blur p-2 rounded-xl hover:bg-background transition-colors shadow">
                                        <ChevronRight className="w-4 h-4" />
                                    </button>
                                </>
                            )}
                        </div>

                        {/* Thumbnails */}
                        {images.length > 1 && (
                            <div className="flex gap-2 overflow-x-auto pb-1">
                                {images.map((img, i) => (
                                    <button key={i} onClick={() => setImgIdx(i)}
                                        className={`w-16 h-16 rounded-xl overflow-hidden shrink-0 border-2 transition-all duration-200 ${i === imgIdx ? 'border-primary shadow-md scale-105' : 'border-transparent opacity-70 hover:opacity-100'}`}>
                                        <img src={imgSrc([img]) ?? ''} alt="" className="w-full h-full object-cover" />
                                    </button>
                                ))}
                            </div>
                        )}

                        {/* Trust badges */}
                        <div className="grid grid-cols-3 gap-2 pt-1">
                            {[
                                { icon: <Truck className="w-4 h-4" />, label: 'Free Delivery', sub: 'Orders over रू 2000' },
                                { icon: <Shield className="w-4 h-4" />, label: 'Secure Payment', sub: 'Khalti & COD' },
                                { icon: <RefreshCw className="w-4 h-4" />, label: 'Easy Returns', sub: '7-day policy' },
                            ].map(b => (
                                <div key={b.label} className="flex flex-col items-center text-center bg-muted rounded-xl p-2.5 gap-1">
                                    <span className="text-primary">{b.icon}</span>
                                    <p className="text-[11px] font-semibold leading-tight">{b.label}</p>
                                    <p className="text-[10px] text-muted-foreground leading-tight">{b.sub}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* ── RIGHT: Product Info ── */}
                    <div className="space-y-5">
                        <div>
                            <p className="text-xs font-semibold text-primary uppercase tracking-widest">{product.category.name}</p>
                            <h1 className="text-3xl font-bold mt-1 leading-tight">{product.name}</h1>
                            <div className="flex items-center gap-3 mt-2">
                                <Stars value={Math.round(avg_rating)} />
                                <span className="text-sm text-muted-foreground">{avg_rating ? avg_rating.toFixed(1) : '—'} · {product.reviews.length} reviews</span>
                            </div>
                        </div>

                        {/* Price */}
                        <div className="flex items-baseline gap-3">
                            <span className="text-4xl font-bold text-primary">रू {Number(product.price).toLocaleString()}</span>
                            <span className={`text-sm font-semibold px-2.5 py-0.5 rounded-full ${product.stock > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'}`}>
                                {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                            </span>
                        </div>

                        {product.description && (
                            <p className="text-muted-foreground text-sm leading-relaxed border-l-2 border-primary/30 pl-3">{product.description}</p>
                        )}

                        {/* CTA */}
                        {isOwnProduct ? (
                            <div className="bg-muted border border-border rounded-xl p-4 text-sm text-muted-foreground text-center flex items-center justify-center gap-2">
                                <Package className="w-4 h-4 shrink-0" /> This is your product — you can't buy your own listing.
                            </div>
                        ) : product.stock > 0 && auth.user ? (
                            <div className="space-y-2.5">
                                <form onSubmit={e => { e.preventDefault(); cartForm.post('/cart'); }} className="flex gap-2.5">
                                    <div className="flex items-center border border-border rounded-xl overflow-hidden bg-muted">
                                        <button type="button" onClick={() => { const q = Math.max(1, cartForm.data.quantity - 1); cartForm.setData('quantity', q); buyNowForm.setData('quantity', q); }}
                                            className="px-3 py-3 hover:bg-accent transition-colors">
                                            <Minus className="w-3.5 h-3.5" />
                                        </button>
                                        <span className="px-4 font-bold text-sm min-w-[2.5rem] text-center">{cartForm.data.quantity}</span>
                                        <button type="button" onClick={() => { const q = Math.min(product.stock, cartForm.data.quantity + 1); cartForm.setData('quantity', q); buyNowForm.setData('quantity', q); }}
                                            className="px-3 py-3 hover:bg-accent transition-colors">
                                            <Plus className="w-3.5 h-3.5" />
                                        </button>
                                    </div>
                                    <button type="submit" disabled={cartForm.processing}
                                        className="flex-1 bg-primary text-primary-foreground rounded-xl font-semibold text-sm flex items-center justify-center gap-2 hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-60 shadow-md shadow-primary/20">
                                        <ShoppingCart className="w-4 h-4" /> Add to Cart
                                    </button>
                                    <button type="button"
                                        onClick={() => wishlistForm.post(`/wishlist/${product.id}`, { preserveScroll: true })}
                                        className={`p-3 rounded-xl border-2 transition-all ${wishlisted ? 'bg-rose-50 border-rose-300 text-rose-500' : 'border-border hover:border-rose-300 hover:text-rose-500'}`}>
                                        <Heart className={`w-4 h-4 ${wishlisted ? 'fill-rose-500 text-rose-500' : ''}`} />
                                    </button>
                                </form>
                                <button type="button" disabled={buyNowForm.processing}
                                    onClick={() => buyNowForm.post('/cart', { onSuccess: () => window.location.href = '/checkout' })}
                                    className="w-full py-3 rounded-xl font-bold text-sm border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground active:scale-[0.98] transition-all disabled:opacity-60">
                                    {buyNowForm.processing ? 'Processing…' : 'Buy Now'}
                                </button>
                            </div>
                        ) : !auth.user ? (
                            <Link href="/login"
                                className="w-full bg-primary text-primary-foreground rounded-xl font-semibold text-sm flex items-center justify-center gap-2 py-3.5 hover:opacity-90 transition shadow-md shadow-primary/20">
                                <ShoppingCart className="w-4 h-4" /> Login to Purchase
                            </Link>
                        ) : (
                            <div className="bg-destructive/10 text-destructive rounded-xl p-3 text-sm font-medium text-center">Out of Stock</div>
                        )}

                        {/* Craftsmanship */}
                        <div className="border border-border rounded-2xl overflow-hidden">
                            <div className="bg-muted/60 px-5 py-3 border-b border-border">
                                <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Product Details</p>
                            </div>
                            <div className="divide-y divide-border text-sm">
                                {product.material && (
                                    <div className="px-5 py-3.5">
                                        <p className="font-semibold">Material</p>
                                        <p className="text-xs text-muted-foreground mt-0.5">{product.material}</p>
                                    </div>
                                )}
                                {product.dimensions && (
                                    <div className="px-5 py-3.5">
                                        <p className="font-semibold">Dimensions</p>
                                        <p className="text-xs text-muted-foreground mt-0.5">{product.dimensions}</p>
                                    </div>
                                )}
                                <div className="px-5 py-3.5">
                                    <p className="font-semibold">Availability</p>
                                    <p className="text-xs text-muted-foreground mt-0.5">
                                        {product.stock > 0 ? `${product.stock} units available` : 'Currently out of stock'}
                                    </p>
                                </div>
                                <div className="px-5 py-3.5">
                                    <p className="font-semibold">Custom Orders</p>
                                    <p className="text-xs text-muted-foreground mt-0.5">
                                        <a href="https://wa.me/9779815069169?text=Hello%2C%20I%27m%20interested%20in%20a%20custom%20furniture%20inquiry%20from%20Wood%20Kala%20Nepal."
                                            target="_blank" rel="noopener noreferrer" className="text-primary hover:underline font-medium">
                                            Contact us
                                        </a>{' '}for custom size or finish.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Seller */}
                        {product.seller && (
                            <Link href={`/shop/seller/${product.seller.id}`}
                                className="flex items-center gap-3 bg-muted rounded-xl p-3.5 hover:bg-accent transition-colors">
                                <div className="w-10 h-10 bg-primary/10 rounded-xl overflow-hidden flex items-center justify-center shrink-0">
                                    {product.seller.avatar
                                        ? <img src={`/storage/${product.seller.avatar}`} alt="" className="w-full h-full object-cover" />
                                        : <Store className="w-5 h-5 text-primary" />}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="font-semibold text-sm">{product.seller.shop_name ?? product.seller.name}</p>
                                    {product.seller.shop_description && <p className="text-xs text-muted-foreground mt-0.5 truncate">{product.seller.shop_description}</p>}
                                </div>
                                <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0" />
                            </Link>
                        )}
                    </div>
                </div>

                {/* ── Reviews ── */}
                <div className="mt-14 space-y-5">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-bold">Customer Reviews</h2>
                        <div className="flex items-center gap-2">
                            <Stars value={Math.round(avg_rating)} />
                            <span className="font-bold text-sm">{avg_rating ? avg_rating.toFixed(1) : '—'}</span>
                            <span className="text-muted-foreground text-sm">({product.reviews.length})</span>
                        </div>
                    </div>

                    {auth.user && !isOwnProduct && can_review && !user_review && (
                        <form onSubmit={e => { e.preventDefault(); reviewForm.post('/reviews'); }}
                            className="bg-card border border-border rounded-2xl p-5 space-y-3">
                            <h3 className="font-semibold text-sm">Write a Review</h3>
                            <Stars value={reviewForm.data.rating} onChange={v => reviewForm.setData('rating', v)} size="lg" />
                            <textarea className="w-full bg-muted rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-ring resize-none"
                                rows={3} placeholder="Share your experience…"
                                value={reviewForm.data.comment} onChange={e => reviewForm.setData('comment', e.target.value)} />
                            {reviewForm.errors.product && (
                                <p className="text-xs text-destructive">{reviewForm.errors.product}</p>
                            )}
                            <button type="submit" disabled={reviewForm.processing}
                                className="bg-primary text-primary-foreground px-5 py-2 rounded-xl text-sm font-medium hover:opacity-90 transition disabled:opacity-60">
                                Submit
                            </button>
                        </form>
                    )}
                    {auth.user && !isOwnProduct && !can_review && !user_review && (
                        <div className="bg-muted border border-border rounded-2xl p-4 text-sm text-muted-foreground flex items-center gap-2">
                            <Package className="w-4 h-4 shrink-0" />
                            You can only review this product after your order has been delivered.
                        </div>
                    )}

                    <div className="space-y-3">
                        {product.reviews.map(r => (
                            <div key={r.id} className="bg-card border border-border rounded-2xl p-4">
                                <div className="flex items-start justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-9 h-9 bg-primary/10 text-primary rounded-full flex items-center justify-center font-bold text-sm">
                                            {r.user.name[0].toUpperCase()}
                                        </div>
                                        <div>
                                            <p className="font-semibold text-sm">{r.user.name}</p>
                                            <Stars value={r.rating} />
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <p className="text-xs text-muted-foreground">{new Date(r.created_at).toLocaleDateString()}</p>
                                        {user_review?.id === r.id && (
                                            <button onClick={() => setEditingReview(v => !v)}
                                                className="text-xs text-primary hover:underline">
                                                {editingReview ? 'Cancel' : 'Edit'}
                                            </button>
                                        )}
                                    </div>
                                </div>
                                {editingReview && user_review?.id === r.id ? (
                                    <form onSubmit={e => { e.preventDefault(); reviewForm.patch(`/reviews/${user_review.id}`, { onSuccess: () => setEditingReview(false) }); }}
                                        className="mt-3 space-y-2">
                                        <Stars value={reviewForm.data.rating} onChange={v => reviewForm.setData('rating', v)} size="lg" />
                                        <textarea className="w-full bg-muted rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-ring resize-none"
                                            rows={3} value={reviewForm.data.comment ?? ''}
                                            onChange={e => reviewForm.setData('comment', e.target.value)} />
                                        <button type="submit" disabled={reviewForm.processing}
                                            className="bg-primary text-primary-foreground px-5 py-2 rounded-xl text-sm font-medium hover:opacity-90 transition disabled:opacity-60">
                                            Update
                                        </button>
                                    </form>
                                ) : (
                                    <>
                                        {r.comment && <p className="text-sm text-muted-foreground mt-2 leading-relaxed">{r.comment}</p>}
                                        {r.seller_reply && (
                                            <div className="mt-2 rounded-xl px-3 py-2 text-sm" style={{ background: '#FDF9F5', borderLeft: '3px solid #A67C52' }}>
                                                <p className="text-xs font-semibold mb-0.5" style={{ color: '#A67C52' }}>Seller Reply</p>
                                                <p className="text-muted-foreground">{r.seller_reply}</p>
                                            </div>
                                        )}
                                        <CommentSection review={r} authUserId={auth.user?.id ?? null} />
                                    </>
                                )}
                            </div>
                        ))}
                        {product.reviews.length === 0 && (
                            <div className="py-10 text-center text-muted-foreground border border-border rounded-2xl">
                                <MessageSquare className="w-8 h-8 mx-auto mb-2 opacity-30" />
                                <p className="text-sm">No reviews yet. Be the first!</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* ── Related ── */}
                {related.length > 0 && (
                    <div className="mt-14 space-y-5">
                        <h2 className="text-xl font-bold">You May Also Like</h2>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                            {related.map((p, i) => (
                                <motion.div key={p.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}>
                                    <Link href={`/shop/${p.slug}`}
                                        className="group block rounded-2xl overflow-hidden border border-border bg-card hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                                        <div className="aspect-square bg-muted overflow-hidden">
                                            <img src={imgSrc(p.images) ?? 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=300&h=300&fit=crop&q=60'}
                                                alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                        </div>
                                        <div className="p-3">
                                            <p className="text-xs text-muted-foreground">{p.category.name}</p>
                                            <p className="font-semibold text-sm truncate mt-0.5">{p.name}</p>
                                            <p className="text-primary font-bold text-sm mt-1">रू {Number(p.price).toLocaleString()}</p>
                                        </div>
                                    </Link>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </ShopLayout>
    );
}
