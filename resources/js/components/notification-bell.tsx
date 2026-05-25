import { useState, useRef, useEffect } from 'react';
import { usePage, router } from '@inertiajs/react';
import { Bell, ShoppingBag, Star, MessageSquare, Store, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface Notification {
    id: string;
    type: string;
    title: string;
    body: string;
    url: string | null;
    created_at: string;
}

const TYPE_ICON: Record<string, React.ReactNode> = {
    order_placed:   <ShoppingBag className="w-4 h-4 text-green-600" />,
    order_status:   <ShoppingBag className="w-4 h-4 text-blue-600" />,
    new_review:     <Star className="w-4 h-4 text-amber-500" />,
    review_comment: <MessageSquare className="w-4 h-4 text-primary" />,
    seller_status:  <Store className="w-4 h-4 text-purple-600" />,
};

export default function NotificationBell() {
    const { notifications = [], unread_count = 0 } = usePage<{
        notifications: Notification[];
        unread_count: number;
    }>().props;

    const [open, setOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handler(e: MouseEvent) {
            if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
        }
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    function markRead(id: string, url: string | null) {
        router.post(`/notifications/${id}/read`, {}, { preserveScroll: true, preserveState: true });
        if (url) router.visit(url);
        setOpen(false);
    }

    function markAllRead() {
        router.post('/notifications/read-all', {}, { preserveScroll: true, preserveState: true });
    }

    return (
        <div ref={ref} className="relative">
            <button onClick={() => setOpen(v => !v)}
                className="relative p-2 rounded-xl hover:bg-accent transition-colors">
                <Bell className="w-5 h-5" />
                {unread_count > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                        {unread_count > 9 ? '9+' : unread_count}
                    </span>
                )}
            </button>

            <AnimatePresence>
                {open && (
                    <motion.div
                        initial={{ opacity: 0, y: 8, scale: 0.96 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 8, scale: 0.96 }}
                        transition={{ duration: 0.15 }}
                        className="absolute right-0 top-full mt-2 w-80 bg-white border border-border rounded-2xl shadow-2xl z-50 overflow-hidden"
                    >
                        <div className="flex items-center justify-between px-4 py-3 border-b border-border">
                            <p className="font-semibold text-sm">Notifications</p>
                            <div className="flex items-center gap-2">
                                {unread_count > 0 && (
                                    <button onClick={markAllRead}
                                        className="text-xs text-primary hover:underline">
                                        Mark all read
                                    </button>
                                )}
                                <button onClick={() => setOpen(false)}>
                                    <X className="w-4 h-4 text-muted-foreground" />
                                </button>
                            </div>
                        </div>

                        <div className="max-h-80 overflow-y-auto divide-y divide-border">
                            {notifications.length === 0 ? (
                                <div className="py-10 text-center">
                                    <Bell className="w-8 h-8 mx-auto mb-2 text-muted-foreground/30" />
                                    <p className="text-sm text-muted-foreground">No notifications yet</p>
                                </div>
                            ) : notifications.map(n => (
                                <button key={n.id} onClick={() => markRead(n.id, n.url)}
                                    className="w-full flex items-start gap-3 px-4 py-3 hover:bg-muted/50 transition-colors text-left">
                                    <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center shrink-0 mt-0.5">
                                        {TYPE_ICON[n.type] ?? <Bell className="w-4 h-4 text-muted-foreground" />}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-semibold leading-tight">{n.title}</p>
                                        <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed line-clamp-2">{n.body}</p>
                                        <p className="text-[10px] text-muted-foreground/60 mt-1">{n.created_at}</p>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
