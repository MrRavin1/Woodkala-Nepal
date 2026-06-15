import { useState, useRef, useEffect } from 'react';
import { usePage, router } from '@inertiajs/react';
import { Bell, ShoppingBag, Star, MessageSquare, Store, X, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface Notification {
    id: string;
    type: string;
    title: string;
    body: string;
    url: string | null;
    created_at: string;
}

const TYPE_CONFIG: Record<string, { icon: React.ReactNode; bg: string; dot: string }> = {
    order_placed:   { icon: <ShoppingBag className="w-4 h-4" />, bg: 'bg-green-100 text-green-600',  dot: 'bg-green-500' },
    order_status:   { icon: <ShoppingBag className="w-4 h-4" />, bg: 'bg-blue-100 text-blue-600',    dot: 'bg-blue-500' },
    new_review:     { icon: <Star className="w-4 h-4" />,        bg: 'bg-amber-100 text-amber-600',  dot: 'bg-amber-500' },
    review_comment: { icon: <MessageSquare className="w-4 h-4" />, bg: 'bg-primary/10 text-primary', dot: 'bg-primary' },
    seller_status:  { icon: <Store className="w-4 h-4" />,       bg: 'bg-purple-100 text-purple-600', dot: 'bg-purple-500' },
};

const DEFAULT_CONFIG = { icon: <Bell className="w-4 h-4" />, bg: 'bg-gray-100 text-gray-500', dot: 'bg-gray-400' };

export default function NotificationBell() {
    const { notifications = [], unread_count = 0 } = usePage<{
        notifications: Notification[];
        unread_count: number;
    }>().props;

    const [open, setOpen] = useState(false);
    const [readIds, setReadIds] = useState<Set<string>>(new Set());
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handler(e: MouseEvent) {
            if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
        }
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    function markRead(id: string, url: string | null) {
        setReadIds(s => new Set([...s, id]));
        setOpen(false);
        router.post(`/notifications/${id}/read`, {}, {
            preserveScroll: true,
            preserveState: true,
            onSuccess: () => { if (url) window.location.href = url; },
        });
    }

    function markAllRead() {
        setReadIds(new Set(notifications.map(n => n.id)));
        router.post('/notifications/read-all', {}, { preserveScroll: true, preserveState: true });
    }

    const displayCount = Math.max(0, unread_count - readIds.size);

    return (
        <div ref={ref} className="relative">
            <button onClick={() => setOpen(v => !v)}
                className="relative p-2 rounded-xl hover:bg-accent transition-colors">
                <Bell className={`w-5 h-5 ${displayCount > 0 ? 'text-primary' : ''}`} />
                <AnimatePresence>
                    {displayCount > 0 && (
                        <motion.span
                            key={displayCount}
                            initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}
                            className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center px-1">
                            {displayCount > 9 ? '9+' : displayCount}
                        </motion.span>
                    )}
                </AnimatePresence>
            </button>

            <AnimatePresence>
                {open && (
                    <motion.div
                        initial={{ opacity: 0, y: 8, scale: 0.96 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 8, scale: 0.96 }}
                        transition={{ duration: 0.15 }}
                        className="absolute right-0 top-full mt-2 w-96 bg-white border border-border rounded-2xl shadow-2xl z-50 overflow-hidden"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-muted/30">
                            <div className="flex items-center gap-2">
                                <p className="font-bold text-sm">Notifications</p>
                                {displayCount > 0 && (
                                    <span className="text-[10px] font-bold bg-red-500 text-white px-1.5 py-0.5 rounded-full">
                                        {displayCount} new
                                    </span>
                                )}
                            </div>
                            <div className="flex items-center gap-2">
                                {displayCount > 0 && (
                                    <button onClick={markAllRead}
                                        className="flex items-center gap-1 text-xs text-primary hover:underline font-medium">
                                        <Check className="w-3 h-3" /> Mark all read
                                    </button>
                                )}
                                <button onClick={() => setOpen(false)} className="p-1 rounded-lg hover:bg-accent transition-colors">
                                    <X className="w-3.5 h-3.5 text-muted-foreground" />
                                </button>
                            </div>
                        </div>

                        {/* List */}
                        <div className="max-h-[420px] overflow-y-auto divide-y divide-border">
                            {notifications.length === 0 ? (
                                <div className="py-12 text-center">
                                    <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center mx-auto mb-3">
                                        <Bell className="w-5 h-5 text-muted-foreground/40" />
                                    </div>
                                    <p className="text-sm font-medium text-muted-foreground">You're all caught up!</p>
                                    <p className="text-xs text-muted-foreground/60 mt-1">No new notifications</p>
                                </div>
                            ) : notifications.map(n => {
                                const config = TYPE_CONFIG[n.type] ?? DEFAULT_CONFIG;
                                const isUnread = !readIds.has(n.id);
                                return (
                                    <button key={n.id} onClick={() => markRead(n.id, n.url)}
                                        className={`w-full flex items-start gap-3 px-4 py-3.5 hover:bg-muted/40 transition-colors text-left relative ${isUnread ? 'bg-primary/[0.03]' : ''}`}>
                                        {/* Unread dot */}
                                        {isUnread && (
                                            <span className={`absolute left-1.5 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full ${config.dot}`} />
                                        )}
                                        {/* Icon */}
                                        <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${config.bg}`}>
                                            {config.icon}
                                        </div>
                                        {/* Content */}
                                        <div className="flex-1 min-w-0">
                                            <p className={`text-sm leading-tight ${isUnread ? 'font-semibold' : 'font-medium'}`}>{n.title}</p>
                                            <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed line-clamp-2">{n.body}</p>
                                            <p className="text-[10px] text-muted-foreground/50 mt-1.5">{n.created_at}</p>
                                        </div>
                                    </button>
                                );
                            })}
                        </div>

                        {/* Footer */}
                        {notifications.length > 0 && (
                            <div className="px-4 py-2.5 border-t border-border bg-muted/20 text-center">
                                <p className="text-xs text-muted-foreground">Showing last {notifications.length} notifications</p>
                            </div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
