import { Head, Link, router } from '@inertiajs/react';
import { useRef, useState } from 'react';

import { motion, AnimatePresence } from 'motion/react';
import { SlidersHorizontal, Search, X, ChevronDown, ChevronUp, ShoppingCart } from 'lucide-react';
import ShopLayout from '@/components/shop-layout';
import { imgSrc } from '@/lib/img';

interface Category { id: number; name: string; slug: string; }
interface Product  { id: number; name: string; slug: string; price: number; stock: number; images: string[] | null; category: Category; }
interface Paginated<T> { data: T[]; links: { url: string | null; label: string; active: boolean }[]; }

function ProductCard({ product }: { product: Product }) {
    const [loaded, setLoaded] = useState(false);
    const [tilt, setTilt] = useState({ x: 0, y: 0, mx: 0.5, my: 0.5 });
    const cardRef = useRef<HTMLDivElement>(null);

    function onMouseMove(e: React.MouseEvent) {
        const rect = cardRef.current!.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width;
        const y = (e.clientY - rect.top)  / rect.height;
        setTilt({ x: (y - 0.5) * -35, y: (x - 0.5) * 35, mx: x, my: y });
    }
    function onMouseLeave() { setTilt({ x: 0, y: 0, mx: 0.5, my: 0.5 }); }

    const isActive = tilt.x !== 0 || tilt.y !== 0;

    return (
        <div ref={cardRef}
            className="group rounded-2xl border border-border bg-card hover:shadow-2xl transition-shadow duration-300"
            style={{
                transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) scale(${isActive ? 1.07 : 1})`,
                transition: isActive ? 'transform 0.08s linear' : 'transform 0.6s cubic-bezier(0.23,1,0.32,1)',
                transformStyle: 'preserve-3d',
                willChange: 'transform',
            }}
            onMouseMove={onMouseMove}
            onMouseLeave={onMouseLeave}>

            <div className="aspect-square bg-muted relative rounded-t-2xl overflow-hidden">
                {!loaded && <div className="skeleton-wood absolute inset-0" />}
                <img
                    src={imgSrc(product.images) ?? 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=400&h=400&fit=crop&q=60'}
                    alt={product.name}
                    onLoad={() => setLoaded(true)}
                    className={`w-full h-full object-cover ${loaded ? 'opacity-100' : 'opacity-0'}`} />

                {/* Glare overlay */}
                <div className="absolute inset-0 pointer-events-none rounded-t-2xl transition-opacity duration-200"
                    style={{
                        opacity: isActive ? 0.18 : 0,
                        background: `radial-gradient(circle at ${tilt.mx * 100}% ${tilt.my * 100}%, rgba(255,255,255,0.9) 0%, transparent 65%)`,
                    }} />

                {product.stock === 0 && (
                    <div className="absolute inset-0 bg-background/60 flex items-center justify-center">
                        <span className="bg-destructive text-white text-xs font-bold px-3 py-1 rounded-full">Out of Stock</span>
                    </div>
                )}
                {product.stock > 0 && (
                    <div className="absolute inset-0 flex items-end justify-center pb-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <Link href={`/shop/${product.slug}`}
                            className="bg-primary text-primary-foreground text-xs font-semibold px-4 py-2 rounded-full shadow-lg flex items-center gap-1.5">
                            <ShoppingCart className="w-3.5 h-3.5" /> Quick View
                        </Link>
                    </div>
                )}
            </div>

            <Link href={`/shop/${product.slug}`} className="block p-4">
                <p className="text-xs text-muted-foreground uppercase tracking-wide">{product.category.name}</p>
                <p className="font-semibold mt-0.5 truncate">{product.name}</p>
                <p className="text-primary font-bold mt-1">रू {Number(product.price).toLocaleString()}</p>
            </Link>
        </div>
    );
}

function FilterSection({ title, children }: { title: string; children: React.ReactNode }) {
    const [open, setOpen] = useState(true);
    return (
        <div className="border-b border-border pb-4 mb-4 last:border-0 last:mb-0 last:pb-0">
            <button onClick={() => setOpen(o => !o)} className="flex items-center justify-between w-full mb-3 group">
                <p className="font-semibold text-sm group-hover:text-primary transition-colors">{title}</p>
                {open ? <ChevronUp className="w-3.5 h-3.5 text-muted-foreground" /> : <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" />}
            </button>
            {open && <div className="fade-up">{children}</div>}
        </div>
    );
}

export default function ShopIndex({ products, categories, filters }: {
    products: Paginated<Product>; categories: Category[]; filters: Record<string, string>;
}) {
    const [search, setSearch] = useState(filters.search ?? '');
    const [sidebarOpen, setSidebarOpen] = useState(false);

    function apply(params: Record<string, string>) {
        router.get('/shop', { ...filters, ...params, page: '1' }, { preserveState: true, replace: true });
    }

    const hasFilters = !!(filters.category || filters.min_price || filters.max_price || filters.search || filters.in_stock);

    const FilterPanel = () => (
        <div>
            <FilterSection title="Category">
                <ul className="space-y-0.5">
                    <li>
                        <button onClick={() => apply({ category: '' })}
                            className={`text-sm w-full text-left px-3 py-2 rounded-xl transition-colors ${!filters.category ? 'bg-primary text-primary-foreground font-semibold' : 'hover:bg-accent'}`}>
                            All Products
                        </button>
                    </li>
                    {categories.map(c => (
                        <li key={c.id}>
                            <button onClick={() => apply({ category: c.slug })}
                                className={`text-sm w-full text-left px-3 py-2 rounded-xl transition-colors ${filters.category === c.slug ? 'bg-primary text-primary-foreground font-semibold' : 'hover:bg-accent'}`}>
                                {c.name}
                            </button>
                        </li>
                    ))}
                </ul>
            </FilterSection>

            <FilterSection title="Price Range (रू)">
                <div className="flex gap-2 items-center">
                    <input type="number" placeholder="Min"
                        className="w-full bg-muted rounded-xl px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/40"
                        defaultValue={filters.min_price} onBlur={e => apply({ min_price: e.target.value })} />
                    <span className="text-muted-foreground text-sm shrink-0">–</span>
                    <input type="number" placeholder="Max"
                        className="w-full bg-muted rounded-xl px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/40"
                        defaultValue={filters.max_price} onBlur={e => apply({ max_price: e.target.value })} />
                </div>
            </FilterSection>

            <FilterSection title="Availability">
                <label className="flex items-center gap-2 cursor-pointer text-sm">
                    <input type="checkbox" className="accent-primary w-4 h-4"
                        checked={filters.in_stock === '1'}
                        onChange={e => apply({ in_stock: e.target.checked ? '1' : '' })} />
                    In Stock Only
                </label>
            </FilterSection>

            {hasFilters && (
                <button onClick={() => { setSearch(''); router.get('/shop', {}, { replace: true }); }}
                    className="flex items-center gap-1.5 text-sm text-destructive hover:underline mt-2">
                    <X className="w-3.5 h-3.5" /> Clear all filters
                </button>
            )}
        </div>
    );

    return (
        <ShopLayout>
            <Head title="Shop — Wood Kala" />
            <div className="max-w-7xl mx-auto px-5 sm:px-6 py-10">

                {/* Top bar */}
                <div className="flex flex-col sm:flex-row gap-3 mb-8 items-start sm:items-center justify-between">
                    <div>
                        <h1 className="serif text-2xl font-bold">All Products</h1>
                        <p className="text-sm text-muted-foreground mt-0.5">{products.data.length} items</p>
                    </div>
                    <div className="flex gap-2 w-full sm:w-auto">
                        <form onSubmit={e => { e.preventDefault(); apply({ search }); }} className="flex flex-1 sm:w-60">
                            <div className="relative w-full">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
                                <input className="w-full bg-muted rounded-xl pl-9 pr-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/40 transition-all"
                                    placeholder="Search products..." value={search} onChange={e => setSearch(e.target.value)} />
                            </div>
                        </form>
                        <select className="bg-muted rounded-xl px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/40 cursor-pointer"
                            value={filters.sort ?? ''} onChange={e => apply({ sort: e.target.value })}>
                            <option value="">Latest</option>
                            <option value="price_asc">Price: Low–High</option>
                            <option value="price_desc">Price: High–Low</option>
                            <option value="rating">Top Rated</option>
                            <option value="popular">Most Popular</option>
                        </select>
                        <button onClick={() => setSidebarOpen(!sidebarOpen)}
                            className={`md:hidden p-2.5 rounded-xl transition-colors ${sidebarOpen ? 'bg-primary text-primary-foreground' : 'bg-muted hover:bg-accent'}`}>
                            <SlidersHorizontal className="w-4 h-4" />
                        </button>
                    </div>
                </div>

                <div className="flex gap-7">
                    {/* Desktop sidebar — collapsible */}
                    <aside className="hidden md:block w-52 shrink-0">
                        <div className="bg-card border border-border rounded-2xl p-5 sticky top-24">
                            <div className="flex items-center justify-between mb-4">
                                <p className="font-bold text-sm">Filters</p>
                                {hasFilters && <span className="text-xs bg-primary text-primary-foreground px-2 py-0.5 rounded-full">Active</span>}
                            </div>
                            <FilterPanel />
                        </div>
                    </aside>

                    {/* Mobile sidebar drawer */}
                    {sidebarOpen && (
                        <div className="fixed inset-0 z-50 md:hidden">
                            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />
                            <div className="absolute left-0 top-0 bottom-0 w-72 bg-background p-6 overflow-y-auto shadow-2xl">
                                <div className="flex justify-between items-center mb-6">
                                    <p className="font-bold">Filters</p>
                                    <button onClick={() => setSidebarOpen(false)} className="p-1.5 rounded-lg hover:bg-accent transition-colors">
                                        <X className="w-4 h-4" />
                                    </button>
                                </div>
                                <FilterPanel />
                            </div>
                        </div>
                    )}

                    {/* Product grid */}
                    <div className="flex-1">
                        {products.data.length === 0 ? (
                            <div className="py-24 text-center border border-border rounded-2xl bg-card">
                                <div className="w-20 h-20 rounded-2xl overflow-hidden mx-auto mb-4 shadow-lg">
                                    <img src="https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=200&h=200&fit=crop&q=70" alt="no results" className="w-full h-full object-cover opacity-60" />
                                </div>
                                <p className="serif text-xl font-bold">No products found</p>
                                <p className="text-muted-foreground text-sm mt-2">Try adjusting your filters</p>
                                <button onClick={() => router.get('/shop', {})}
                                    className="mt-5 btn-gold inline-block">Clear Filters</button>
                            </div>
                        ) : (
                            <>
                                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
                                    <AnimatePresence mode="popLayout">
                                        {products.data.map((p, i) => (
                                            <motion.div key={p.id}
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, scale: 0.95 }}
                                                transition={{ delay: i * 0.04, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}>
                                                <ProductCard product={p} />
                                            </motion.div>
                                        ))}
                                    </AnimatePresence>
                                </div>
                                <div className="flex gap-1.5 mt-10 justify-center flex-wrap">
                                    {products.links.map((l, i) => (
                                        <button key={i} disabled={!l.url}
                                            onClick={() => l.url && router.get(l.url)}
                                            className={`px-3.5 py-2 rounded-xl text-sm font-medium transition-colors ${l.active ? 'bg-primary text-primary-foreground shadow-md' : 'bg-muted hover:bg-accent'} disabled:opacity-40`}
                                            dangerouslySetInnerHTML={{ __html: l.label }}
                                        />
                                    ))}
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </ShopLayout>
    );
}
