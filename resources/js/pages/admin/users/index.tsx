import { Head, useForm } from '@inertiajs/react';
import SellerLayout from '@/layouts/seller-layout';
import { Trash2, Store } from 'lucide-react';

interface User { id: number; name: string; email: string; role: string; phone: string | null; shop_name: string | null; orders_count: number; created_at: string; }

const ROLE_STYLE: Record<string, { background: string; color: string }> = {
    customer: { background: '#EFF6FF', color: '#1d4ed8' },
    seller:   { background: '#FDF0E6', color: '#A67C52' },
    admin:    { background: '#F0FDF4', color: '#15803d' },
};

function UserRow({ user }: { user: User }) {
    const roleForm = useForm({ role: user.role });
    const delForm = useForm({});

    return (
        <tr style={{ borderBottom: '1px solid #F0EDE8' }}>
            <td className="px-4 py-3">
                <p className="text-sm font-medium" style={{ color: '#1A1A1A' }}>{user.name}</p>
                {user.shop_name && <p className="flex items-center gap-1 text-xs" style={{ color: '#A67C52' }}><Store className="w-3 h-3" /> {user.shop_name}</p>}
            </td>
            <td className="px-4 py-3 text-sm" style={{ color: '#6B5B4E' }}>{user.email}</td>
            <td className="px-4 py-3">
                <select
                    className="h-8 px-2 rounded-lg text-xs border border-[#E8DDD0] bg-white outline-none focus:border-[#A67C52]"
                    style={{ color: ROLE_STYLE[roleForm.data.role]?.color ?? '#1A1A1A' }}
                    value={roleForm.data.role}
                    onChange={e => {
                        roleForm.setData('role', e.target.value);
                        roleForm.patch(`/admin/users/${user.id}/role`, { preserveScroll: true });
                    }}>
                    <option value="customer">Customer</option>
                    <option value="seller">Seller</option>
                    <option value="admin">Admin</option>
                </select>
            </td>
            <td className="px-4 py-3 text-sm" style={{ color: '#6B5B4E' }}>{user.phone ?? '—'}</td>
            <td className="px-4 py-3 text-sm" style={{ color: '#1A1A1A' }}>{user.orders_count}</td>
            <td className="px-4 py-3 text-xs" style={{ color: '#9A8070' }}>{new Date(user.created_at).toLocaleDateString()}</td>
            <td className="px-4 py-3">
                <button
                    onClick={() => { if (confirm(`Delete ${user.name}?`)) delForm.delete(`/admin/users/${user.id}`); }}
                    className="p-1.5 rounded-lg hover:bg-red-50 transition-colors" style={{ color: '#dc2626' }}>
                    <Trash2 className="w-3.5 h-3.5" />
                </button>
            </td>
        </tr>
    );
}

export default function UsersIndex({ users }: { users: User[] }) {
    const buyers  = users.filter(u => u.role === 'customer');
    const sellers = users.filter(u => u.role === 'seller');
    const admins  = users.filter(u => u.role === 'admin');

    return (
        <SellerLayout title="Users">
            <Head title="Users" />
            <div className="space-y-5">
                <div className="flex items-center justify-between">
                    <h1 className="text-xl font-bold" style={{ color: '#1A1A1A' }}>Users</h1>
                    <div className="flex gap-3 text-xs font-medium">
                        <span className="px-2.5 py-1 rounded-full" style={{ background: '#EFF6FF', color: '#1d4ed8' }}>{buyers.length} Buyers</span>
                        <span className="px-2.5 py-1 rounded-full" style={{ background: '#FDF0E6', color: '#A67C52' }}>{sellers.length} Sellers</span>
                        <span className="px-2.5 py-1 rounded-full" style={{ background: '#F0FDF4', color: '#15803d' }}>{admins.length} Admins</span>
                    </div>
                </div>

                <div className="bg-white rounded-2xl border border-[#E8DDD0] overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead style={{ background: '#FDF9F5', borderBottom: '1px solid #E8DDD0' }}>
                            <tr>
                                {['Name','Email','Role','Phone','Orders','Joined','Action'].map(h => (
                                    <th key={h} className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-left" style={{ color: '#7A6A5A' }}>{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {users.length === 0
                                ? <tr><td colSpan={7} className="px-4 py-10 text-center text-sm" style={{ color: '#9A8070' }}>No users found.</td></tr>
                                : users.map(u => <UserRow key={u.id} user={u} />)
                            }
                        </tbody>
                    </table>
                </div>
            </div>
        </SellerLayout>
    );
}
