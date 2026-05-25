import { Link, usePage } from '@inertiajs/react';
import { motion } from 'motion/react';
import { LayoutDashboard, Package, ShoppingCart, Tag, Users, Star, LogOut, Store, ChevronRight, UserCircle, BadgeCheck, Wallet } from 'lucide-react';

const SELLER_NAV = [
    { href: '/seller/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { href: '/seller/products',  icon: Package,         label: 'Products' },
    { href: '/seller/orders',    icon: ShoppingCart,    label: 'Orders' },
    { href: '/seller/reviews',   icon: Star,            label: 'Reviews' },
    { href: '/seller/payouts',   icon: Wallet,          label: 'Payouts' },
    { href: '/seller/profile',   icon: UserCircle,      label: 'Shop Profile' },
];

const ADMIN_NAV = [
    { href: '/admin',            icon: LayoutDashboard, label: 'Dashboard' },
    { href: '/admin/products',   icon: Package,         label: 'Products' },
    { href: '/admin/categories', icon: Tag,             label: 'Categories' },
    { href: '/admin/orders',     icon: ShoppingCart,    label: 'Orders' },
    { href: '/admin/users',      icon: Users,           label: 'Customers' },
    { href: '/admin/sellers',    icon: BadgeCheck,      label: 'Sellers' },
    { href: '/admin/reviews',    icon: Star,            label: 'Reviews' },
];

export default function SellerLayout({ children, title }: { children: React.ReactNode; title?: string }) {
    const { url, props } = usePage<{ auth: { user: { name: string; shop_name?: string } } }>();
    const user = props.auth?.user;
    const isAdmin = url.startsWith('/admin');
    const nav = isAdmin ? ADMIN_NAV : SELLER_NAV;
    const panelLabel = isAdmin ? 'Admin Panel' : 'Seller Panel';

    return (
        <div className="min-h-screen flex" style={{ background: '#F5F3F0' }}>
            <aside className="w-60 shrink-0 flex flex-col border-r" style={{ background: '#FFFFFF', borderColor: '#E8DDD0' }}>
                <div className="h-16 flex items-center gap-3 px-5 border-b" style={{ borderColor: '#E8DDD0' }}>
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center shadow-sm"
                        style={{ background: 'linear-gradient(135deg, #C49A6C, #8B6340)' }}>
                        <Store className="w-4 h-4 text-white" />
                    </div>
                    <div>
                        <p className="font-bold text-sm leading-none" style={{ color: '#1A1A1A', fontFamily: "'Playfair Display', serif" }}>Wood Kala</p>
                        <p className="text-[10px] font-semibold uppercase tracking-widest mt-0.5" style={{ color: '#A67C52' }}>{panelLabel}</p>
                    </div>
                </div>

                {!isAdmin && user?.shop_name && (
                    <div className="px-5 py-3 border-b" style={{ borderColor: '#E8DDD0', background: '#FDF9F5' }}>
                        <p className="text-[10px] uppercase tracking-widest font-medium" style={{ color: '#9A8070' }}>Your Shop</p>
                        <p className="text-sm font-semibold mt-0.5 truncate" style={{ color: '#2C1F14' }}>{user.shop_name}</p>
                    </div>
                )}

                <nav className="flex-1 px-3 py-4 space-y-0.5">
                    {nav.map(({ href, icon: Icon, label }) => {
                        const active = href === '/admin' ? url === '/admin' : url.startsWith(href);
                        return (
                            <Link key={href} href={href}
                                className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200"
                                style={active
                                    ? { background: '#FDF0E6', color: '#A67C52', borderLeft: '3px solid #A67C52' }
                                    : { color: '#6B5B4E' }
                                }
                                onMouseEnter={e => { if (!active) (e.currentTarget as HTMLElement).style.background = '#F5F0EB'; }}
                                onMouseLeave={e => { if (!active) (e.currentTarget as HTMLElement).style.background = 'transparent'; }}
                            >
                                <Icon className="w-4 h-4 shrink-0" />
                                {label}
                                {active && <motion.div layoutId="nav-indicator" className="ml-auto w-1.5 h-1.5 rounded-full" style={{ background: '#A67C52' }} />}
                            </Link>
                        );
                    })}
                </nav>

                <div className="px-3 pb-4 pt-4 space-y-0.5 border-t" style={{ borderColor: '#E8DDD0' }}>
                    <Link href="/shop"
                        className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all"
                        style={{ color: '#6B5B4E' }}
                        onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = '#F5F0EB'; }}
                        onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'transparent'; }}>
                        <Store className="w-4 h-4" /> View Shop
                    </Link>
                    <Link href="/logout" method="post" as="button"
                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all"
                        style={{ color: '#dc2626' }}
                        onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = '#FEF2F2'; }}
                        onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'transparent'; }}>
                        <LogOut className="w-4 h-4" /> Sign Out
                    </Link>
                </div>
            </aside>

            <div className="flex-1 flex flex-col min-w-0">
                <header className="h-16 flex items-center justify-between px-6 border-b shrink-0"
                    style={{ background: '#FFFFFF', borderColor: '#E8DDD0' }}>
                    <div className="flex items-center gap-2 text-sm" style={{ color: '#6B5B4E' }}>
                        <span className="font-medium" style={{ color: '#1A1A1A' }}>{panelLabel}</span>
                        {title && (
                            <>
                                <ChevronRight className="w-3.5 h-3.5" />
                                <span className="font-semibold" style={{ color: '#A67C52' }}>{title}</span>
                            </>
                        )}
                    </div>
                    <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg overflow-hidden flex items-center justify-center font-bold text-sm text-white shrink-0"
                            style={{ background: '#A67C52' }}>
                            {(user as any)?.avatar
                                ? <img src={`/storage/${(user as any).avatar}`} alt="" className="w-full h-full object-cover" />
                                : user?.name?.[0]?.toUpperCase()}
                        </div>
                        <div>
                            <p className="text-sm font-semibold leading-none" style={{ color: '#1A1A1A' }}>{user?.name}</p>
                            <p className="text-[11px] mt-0.5" style={{ color: '#9A8070' }}>{isAdmin ? 'Administrator' : 'Seller'}</p>
                        </div>
                    </div>
                </header>
                <main className="flex-1 p-6 overflow-auto">{children}</main>
            </div>
        </div>
    );
}
