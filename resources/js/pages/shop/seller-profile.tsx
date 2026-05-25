import { Head, Link } from '@inertiajs/react';
import { Store, Star, Package } from 'lucide-react';
import ShopLayout from '@/components/shop-layout';
import { imgSrc } from '@/lib/img';

interface Seller {
    id: number; name: string; shop_name: string | null;
    shop_description: string | null; avatar: string | null; created_at: string;
}
interface Product {
    id: number; name: string; slug: string; price: number;
    images: string[] | null; category: { name: string };
}

export default function SellerProfile({ seller, products, avg_rating }: {
    seller: Seller; products: Product[]; avg_rating: number;
}) {
    return (
        <ShopLayout>
            <Head title={`${seller.shop_name ?? seller.name} — Wood Kala`} />
            <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10 space-y-8">

                {/* Seller header */}
                <div className="flex items-center gap-5 bg-card border border-border rounded-2xl p-6">
                    <div className="w-20 h-20 rounded-2xl overflow-hidden bg-primary/10 flex items-center justify-center shrink-0">
                        {seller.avatar
                            ? <img src={`/storage/${seller.avatar}`} alt="" className="w-full h-full object-cover" />
                            : <Store className="w-8 h-8 text-primary" />}
                    </div>
                    <div className="flex-1 min-w-0">
                        <h1 className="text-xl font-bold">{seller.shop_name ?? seller.name}</h1>
                        {seller.shop_description && (
                            <p className="text-sm text-muted-foreground mt-1">{seller.shop_description}</p>
                        )}
                        <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1">
                                <Package className="w-3.5 h-3.5" />{products.length} products
                            </span>
                            {avg_rating > 0 && (
                                <span className="flex items-center gap-1">
                                    <Star className="w-3.5 h-3.5 fill-primary text-primary" />{avg_rating} avg rating
                                </span>
                            )}
                            <span>Member since {new Date(seller.created_at).getFullYear()}</span>
                        </div>
                    </div>
                </div>

                {/* Products */}
                <div>
                    <h2 className="text-lg font-bold mb-4">Products</h2>
                    {products.length === 0 ? (
                        <div className="text-center py-16 text-muted-foreground border border-border rounded-2xl">
                            <Package className="w-8 h-8 mx-auto mb-2 opacity-30" />
                            <p className="text-sm">No products listed yet.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                            {products.map(p => (
                                <Link key={p.id} href={`/shop/${p.slug}`}
                                    className="group block rounded-2xl overflow-hidden border border-border bg-card hover:shadow-lg transition-all hover:-translate-y-0.5">
                                    <div className="aspect-square bg-muted overflow-hidden">
                                        <img
                                            src={imgSrc(p.images) ?? 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=300&h=300&fit=crop&q=60'}
                                            alt={p.name}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                        />
                                    </div>
                                    <div className="p-3">
                                        <p className="text-xs text-muted-foreground">{p.category.name}</p>
                                        <p className="font-semibold text-sm mt-0.5 truncate">{p.name}</p>
                                        <p className="text-primary font-bold text-sm mt-1">रू {Number(p.price).toLocaleString()}</p>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </ShopLayout>
    );
}
