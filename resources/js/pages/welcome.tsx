import { Head, Link } from '@inertiajs/react';
import { motion, useScroll, useTransform } from 'motion/react';
import { useRef } from 'react';
import { ArrowRight, Ruler, Leaf, Hammer, Wrench, Star } from 'lucide-react';
import ShopLayout from '@/components/shop-layout';
import { imgSrc } from '@/lib/img';
import { useScrollReveal } from '@/hooks/use-scroll-reveal';

interface Category { id: number; name: string; slug: string; products_count: number; }
interface Product  { id: number; name: string; slug: string; price: number; images: string[] | null; category: { name: string }; }

const CAT_IMAGES: Record<string, string> = {
    chairs:      'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=600&q=85',
    tables:      'https://images.unsplash.com/photo-1538688525198-9b88f6f53126?w=600&q=85',
    beds:        'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=600&q=85',
    sofas:       'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&q=85',
    decor:       'https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=600&q=85',
    'living-room':'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&q=85',
    bedroom:     'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=800&q=85',
    office:      'https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=800&q=85',
    default:     'https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=600&q=85',
};

const SERVICES = [
    { icon: Ruler,  title: 'Custom Design',   desc: 'Tailored to your exact space and vision' },
    { icon: Leaf,   title: 'Quality Wood',     desc: 'Sustainably sourced Sal, Teak & Rosewood' },
    { icon: Hammer, title: 'Expert Craft',     desc: 'Skilled artisans with decades of experience' },
    { icon: Wrench, title: 'Installation',     desc: 'White-glove delivery and setup included' },
];

function ProductCard({ product, index }: { product: Product; index: number }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ delay: index * 0.08, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        >
            <Link href={`/shop/${product.slug}`}
                className="group block overflow-hidden bg-card border border-border hover:shadow-2xl transition-all duration-500 hover:-translate-y-1 rounded-2xl">
                <div className="aspect-[4/3] overflow-hidden bg-muted">
                    {product.images?.[0]
                        ? <img src={imgSrc(product.images) ?? ''} alt={product.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                        : <img src={CAT_IMAGES.default} alt={product.name} className="w-full h-full object-cover opacity-40" />
                    }
                </div>
                <div className="p-5">
                    <p className="text-xs text-muted-foreground uppercase tracking-widest mb-1">{product.category.name}</p>
                    <p className="serif font-semibold text-base">{product.name}</p>
                    <p className="text-primary font-medium mt-2 text-sm">रू {Number(product.price).toLocaleString()}</p>
                </div>
            </Link>
        </motion.div>
    );
}

export default function Welcome({ canRegister = true, featured = [], categories = [], total_products = 0 }: {
    canRegister?: boolean; featured: Product[]; categories: Category[]; total_products: number;
}) {
    useScrollReveal();
    const heroRef = useRef<HTMLElement>(null);
    const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
    const heroY = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);
    const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

    return (
        <ShopLayout>
            <Head title="Wood Kala Nepal — Premium Handcrafted Furniture" />

            {/* ── Hero: Full-width immersive with parallax ── */}
            <section ref={heroRef} className="relative h-screen min-h-[600px] flex items-center justify-center overflow-hidden">
                <motion.div style={{ y: heroY }} className="absolute inset-0">
                    <img
                        src="https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=1800&q=90"
                        alt="Premium wooden interior"
                        className="w-full h-full object-cover"
                    />
                </motion.div>
                <div className="absolute inset-0 bg-black/45" />
                <motion.div style={{ opacity: heroOpacity }}
                    className="relative z-10 text-center text-white px-6 max-w-3xl mx-auto space-y-7">
                    <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.6 }}
                        className="text-xs font-medium tracking-[0.3em] uppercase text-white/70">
                        Handcrafted in Nepal
                    </motion.p>
                    <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                        className="serif text-5xl md:text-7xl font-bold leading-tight">
                        Furniture That<br />
                        <span className="italic text-[#C49A6C]">Tells a Story</span>
                    </motion.h1>
                    <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5, duration: 0.6 }}
                        className="text-white/70 text-base max-w-md mx-auto leading-relaxed">
                        Each piece is crafted by skilled Nepali artisans using sustainably sourced wood — built to last generations.
                    </motion.p>
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.65, duration: 0.6 }}
                        className="flex flex-wrap gap-4 justify-center pt-2">
                        <Link href="/shop"
                            className="group inline-flex items-center gap-3 border border-white/60 text-white px-8 py-4 text-sm font-medium tracking-widest uppercase hover:bg-white hover:text-[#1A1A1A] transition-all duration-300">
                            Explore Collection
                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </Link>
                        {canRegister && (
                            <Link href="/seller/login"
                                className="inline-flex items-center gap-2 bg-[#A67C52] text-white px-8 py-4 text-sm font-medium tracking-widest uppercase hover:bg-[#8B6340] transition-all duration-300">
                                Start Selling
                            </Link>
                        )}
                    </motion.div>
                    {/* Stats */}
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.85, duration: 0.6 }}
                        className="flex justify-center gap-12 pt-4 border-t border-white/15">
                        {[{ v: `${total_products}+`, l: 'Products' }, { v: `${categories.length}`, l: 'Categories' }, { v: '77', l: 'Districts' }].map((s, i) => (
                            <motion.div key={s.l} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.9 + i * 0.1 }}
                                className="text-center">
                                <p className="serif text-2xl font-bold">{s.v}</p>
                                <p className="text-xs text-white/50 mt-0.5 tracking-widest uppercase">{s.l}</p>
                            </motion.div>
                        ))}
                    </motion.div>
                </motion.div>
                {/* Scroll indicator */}
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2 }}
                    className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/40">
                    <div className="w-px h-12 bg-white/20 animate-pulse" />
                    <p className="text-[10px] tracking-widest uppercase">Scroll</p>
                </motion.div>
            </section>

            {/* ── Services ── */}
            <section className="max-w-6xl mx-auto px-6 py-20">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                    {SERVICES.map((s, i) => {
                        const Icon = s.icon;
                        return (
                            <motion.div key={s.title}
                                initial={{ opacity: 0, y: 24 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: '-40px' }}
                                transition={{ delay: i * 0.1, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                                className="text-center space-y-3">
                                <motion.div whileHover={{ scale: 1.1, rotate: 3 }} transition={{ type: 'spring', stiffness: 300 }}
                                    className="w-12 h-12 border border-primary/30 flex items-center justify-center mx-auto">
                                    <Icon className="w-5 h-5 text-primary" strokeWidth={1.5} />
                                </motion.div>
                                <p className="serif font-semibold text-sm">{s.title}</p>
                                <p className="text-xs text-muted-foreground leading-relaxed">{s.desc}</p>
                            </motion.div>
                        );
                    })}
                </div>
            </section>

            {/* ── Category Masonry ── */}
            <section className="max-w-7xl mx-auto px-6 pb-20">
                <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                    transition={{ duration: 0.5 }} className="flex items-end justify-between mb-10">
                    <div>
                        <p className="text-xs text-primary uppercase tracking-[0.25em] mb-2">Browse</p>
                        <h2 className="serif text-3xl font-bold">Our Collections</h2>
                    </div>
                    <Link href="/shop" className="text-sm text-muted-foreground hover:text-primary transition-colors tracking-wide">View All →</Link>
                </motion.div>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 auto-rows-[220px]">
                    {[
                        { href: '/shop?category=sofas', img: CAT_IMAGES.sofas, title: 'Living Room', sub: 'Sofas & Seating', span: 'col-span-1 md:row-span-2' },
                        { href: '/shop?category=beds', img: CAT_IMAGES.beds, title: 'Bedroom', sub: '', span: '' },
                        { href: '/shop?category=tables', img: CAT_IMAGES.tables, title: 'Dining', sub: '', span: '' },
                        { href: '/shop?category=chairs', img: CAT_IMAGES.office, title: 'Office & Study', sub: '', span: 'col-span-1 md:col-span-2' },
                    ].map((cat, i) => (
                        <motion.div key={cat.href}
                            initial={{ opacity: 0, scale: 0.96 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true, margin: '-40px' }}
                            transition={{ delay: i * 0.1, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                            className={cat.span}>
                            <Link href={cat.href} className="group relative overflow-hidden bg-muted block w-full h-full">
                                <img src={cat.img} alt={cat.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                                <div className="absolute bottom-6 left-6">
                                    <p className="serif text-xl md:text-2xl font-bold text-white">{cat.title}</p>
                                    {cat.sub && <p className="text-white/60 text-xs mt-1 tracking-widest uppercase">{cat.sub}</p>}
                                </div>
                            </Link>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* ── Featured Products ── */}
            {featured.length > 0 && (
                <section className="max-w-7xl mx-auto px-6 pb-20">
                    <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                        transition={{ duration: 0.5 }} className="flex items-end justify-between mb-10">
                        <div>
                            <p className="text-xs text-primary uppercase tracking-[0.25em] mb-2">Handpicked</p>
                            <h2 className="serif text-3xl font-bold">Featured Pieces</h2>
                        </div>
                        <Link href="/shop" className="text-sm text-muted-foreground hover:text-primary transition-colors">View All →</Link>
                    </motion.div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
                        {featured.slice(0, 8).map((p, i) => <ProductCard key={p.id} product={p} index={i} />)}
                    </div>
                </section>
            )}

            {/* ── Glassmorphism CTA Banner ── */}
            <section className="max-w-7xl mx-auto px-6 pb-20">
                <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                    transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                    className="relative overflow-hidden rounded-3xl">
                    <img src="https://images.unsplash.com/photo-1504148455328-c376907d081c?w=1400&q=85"
                        alt="Woodworking" className="absolute inset-0 w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-r from-[#1A1A1A]/90 via-[#1A1A1A]/70 to-transparent" />
                    {/* Glassmorphism overlay card */}
                    <div className="relative z-10 px-12 py-16 max-w-lg">
                        <p className="text-xs text-[#C49A6C] uppercase tracking-[0.25em] mb-4">For Artisans</p>
                        <h2 className="serif text-4xl font-bold text-white leading-tight mb-4">
                            Turn your craft<br />into a business.
                        </h2>
                        <p className="text-white/60 text-sm leading-relaxed mb-8">
                            Join Nepal's finest woodcraft marketplace. Free setup, 0% commission on first 10 orders, nationwide reach.
                        </p>
                        <Link href="/seller/login"
                            className="inline-flex items-center gap-3 border border-white/50 text-white px-8 py-4 text-sm font-medium tracking-widest uppercase hover:bg-white hover:text-[#1A1A1A] transition-all duration-300 group">
                            Start Selling Free
                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </div>
                    {/* Floating glass card */}
                    <motion.div
                        initial={{ opacity: 0, x: 40 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.3, duration: 0.6 }}
                        className="absolute right-12 top-1/2 -translate-y-1/2 hidden lg:block">
                        <div className="glass rounded-2xl p-6 w-56 space-y-4">
                            {[
                                { label: 'Active Sellers', value: '240+' },
                                { label: 'Products Listed', value: '1,800+' },
                                { label: 'Orders Delivered', value: '5,200+' },
                            ].map(s => (
                                <div key={s.label}>
                                    <p className="text-white/50 text-xs">{s.label}</p>
                                    <p className="text-white font-bold text-lg serif">{s.value}</p>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                </motion.div>
            </section>

            {/* ── Testimonials ── */}
            <section className="max-w-6xl mx-auto px-6 pb-24">
                <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                    transition={{ duration: 0.5 }} className="text-center mb-12">
                    <p className="text-xs text-primary uppercase tracking-[0.25em] mb-2">Reviews</p>
                    <h2 className="serif text-3xl font-bold">What Our Customers Say</h2>
                </motion.div>
                <div className="grid md:grid-cols-3 gap-6">
                    {[
                        { name: 'Priya Sharma', loc: 'Kathmandu', text: 'The dining table is absolutely stunning. The craftsmanship is beyond what I expected — it feels like a family heirloom.', rating: 5 },
                        { name: 'Rohan Thapa', loc: 'Pokhara', text: 'Ordered a custom bookshelf and it arrived perfectly. The wood grain is beautiful and the finish is flawless.', rating: 5 },
                        { name: 'Anita Gurung', loc: 'Biratnagar', text: 'Fast delivery, excellent packaging, and the quality is top-notch. Will definitely order again!', rating: 5 },
                    ].map((t, i) => (
                        <motion.div key={t.name}
                            initial={{ opacity: 0, y: 24 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: '-40px' }}
                            transition={{ delay: i * 0.12, duration: 0.5 }}
                            className="neu-card p-6 space-y-4">
                            <div className="flex gap-0.5">
                                {Array.from({ length: t.rating }).map((_, j) => (
                                    <Star key={j} className="w-4 h-4 fill-amber-400 text-amber-400" />
                                ))}
                            </div>
                            <p className="text-sm text-muted-foreground leading-relaxed italic">"{t.text}"</p>
                            <div>
                                <p className="font-semibold text-sm">{t.name}</p>
                                <p className="text-xs text-muted-foreground">{t.loc}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </section>
        </ShopLayout>
    );
}
