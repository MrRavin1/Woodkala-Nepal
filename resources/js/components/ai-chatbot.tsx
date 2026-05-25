import { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Bot, User, Minimize2 } from 'lucide-react';

interface Message { role: 'user' | 'bot'; text: string; }

const QUICK = [
    'How do I track my order?',
    'How do I return a product?',
    'How do I become a seller?',
    'How do I change my password?',
    'What payment methods are accepted?',
];

const BOT_ANSWERS: Record<string, string> = {
    'track':    'Go to **My Orders** in your dashboard to see real-time order status and tracking info.',
    'return':   'Contact us within 7 days of delivery. Go to your order detail page and click "Request Return".',
    'seller':   'Click **Sell** in the navbar or visit /seller/register to set up your shop for free.',
    'password': 'Go to **Settings → Security** to update your password. You can also use "Forgot password" on the login page.',
    'payment':  'We accept **Khalti**, **eSewa**, and **Cash on Delivery** across all 77 districts of Nepal.',
    'default':  'I\'m here to help! You can ask me about orders, returns, payments, seller registration, account settings, or privacy. What do you need?',
};

function getBotReply(msg: string): string {
    const m = msg.toLowerCase();
    if (m.includes('track') || m.includes('order') || m.includes('status') || m.includes('shipping')) return BOT_ANSWERS.track;
    if (m.includes('return') || m.includes('refund') || m.includes('exchange')) return BOT_ANSWERS.return;
    if (m.includes('sell') || m.includes('seller') || m.includes('shop') || m.includes('artisan')) return BOT_ANSWERS.seller;
    if (m.includes('password') || m.includes('security') || m.includes('2fa') || m.includes('login')) return BOT_ANSWERS.password;
    if (m.includes('pay') || m.includes('khalti') || m.includes('esewa') || m.includes('cod') || m.includes('cash')) return BOT_ANSWERS.payment;
    if (m.includes('privacy') || m.includes('data') || m.includes('delete')) return 'Your data is stored securely and never shared with third parties. You can delete your account anytime from **Settings → Profile → Danger Zone**.';
    if (m.includes('deliver') || m.includes('shipping') || m.includes('district')) return 'We deliver to all **77 districts** of Nepal. Delivery is **free** on all orders.';
    if (m.includes('hello') || m.includes('hi') || m.includes('hey')) return 'Hello! I\'m the Wood Kala assistant. How can I help you today?';
    return BOT_ANSWERS.default;
}

function renderText(text: string) {
    // Bold **text**
    return text.split(/(\*\*[^*]+\*\*)/).map((part, i) =>
        part.startsWith('**') ? <strong key={i}>{part.slice(2, -2)}</strong> : part
    );
}

export default function AIChatbot() {
    const [open, setOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([
        { role: 'bot', text: 'Hi! I\'m your Wood Kala assistant. Ask me anything about orders, payments, returns, seller registration, or account settings.' }
    ]);
    const [input, setInput] = useState('');
    const [typing, setTyping] = useState(false);
    const bottomRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, typing]);

    function send(text: string) {
        if (!text.trim()) return;
        const userMsg: Message = { role: 'user', text: text.trim() };
        setMessages(m => [...m, userMsg]);
        setInput('');
        setTyping(true);
        setTimeout(() => {
            setTyping(false);
            setMessages(m => [...m, { role: 'bot', text: getBotReply(text) }]);
        }, 800);
    }

    return (
        <>
            {/* Floating button */}
            <button
                onClick={() => setOpen(o => !o)}
                className="fixed bottom-6 right-6 z-[200] w-14 h-14 bg-primary text-primary-foreground rounded-2xl shadow-2xl flex items-center justify-center hover:brightness-110 active:scale-95 transition-all pulse-gold"
                aria-label="Open AI assistant"
            >
                {open ? <X className="w-5 h-5" /> : <MessageCircle className="w-5 h-5" />}
            </button>

            {/* Chat panel */}
            {open && (
                <div className="fixed bottom-24 right-6 z-[199] w-[340px] sm:w-[380px] flex flex-col rounded-2xl shadow-2xl border border-border overflow-hidden"
                    style={{ height: '520px', background: 'var(--background)' }}>

                    {/* Header */}
                    <div className="flex items-center gap-3 px-4 py-3 bg-primary text-primary-foreground shrink-0">
                        <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center">
                            <Bot className="w-4 h-4" />
                        </div>
                        <div className="flex-1">
                            <p className="font-semibold text-sm">Wood Kala Assistant</p>
                            <p className="text-xs text-primary-foreground/70">Always here to help</p>
                        </div>
                        <button onClick={() => setOpen(false)} className="p-1 rounded-lg hover:bg-white/15 transition-colors">
                            <Minimize2 className="w-4 h-4" />
                        </button>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
                        {messages.map((m, i) => (
                            <div key={i} className={`flex gap-2 ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                {m.role === 'bot' && (
                                    <div className="w-7 h-7 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                                        <Bot className="w-3.5 h-3.5 text-primary" />
                                    </div>
                                )}
                                <div className={`max-w-[80%] px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed ${
                                    m.role === 'user'
                                        ? 'bg-primary text-primary-foreground rounded-br-sm'
                                        : 'bg-muted text-foreground rounded-bl-sm'
                                }`}>
                                    {renderText(m.text)}
                                </div>
                                {m.role === 'user' && (
                                    <div className="w-7 h-7 rounded-xl bg-primary/20 flex items-center justify-center shrink-0 mt-0.5">
                                        <User className="w-3.5 h-3.5 text-primary" />
                                    </div>
                                )}
                            </div>
                        ))}
                        {typing && (
                            <div className="flex gap-2 justify-start">
                                <div className="w-7 h-7 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                                    <Bot className="w-3.5 h-3.5 text-primary" />
                                </div>
                                <div className="bg-muted px-4 py-3 rounded-2xl rounded-bl-sm flex gap-1 items-center">
                                    {[0, 1, 2].map(i => (
                                        <span key={i} className="w-1.5 h-1.5 bg-muted-foreground rounded-full animate-bounce"
                                            style={{ animationDelay: `${i * 0.15}s` }} />
                                    ))}
                                </div>
                            </div>
                        )}
                        <div ref={bottomRef} />
                    </div>

                    {/* Quick replies */}
                    {messages.length <= 1 && (
                        <div className="px-4 pb-2 flex gap-1.5 overflow-x-auto shrink-0">
                            {QUICK.slice(0, 3).map(q => (
                                <button key={q} onClick={() => send(q)}
                                    className="shrink-0 text-xs bg-muted hover:bg-accent border border-border px-3 py-1.5 rounded-full transition-colors whitespace-nowrap">
                                    {q}
                                </button>
                            ))}
                        </div>
                    )}

                    {/* Input */}
                    <div className="px-3 py-3 border-t border-border shrink-0">
                        <form onSubmit={e => { e.preventDefault(); send(input); }} className="flex gap-2">
                            <input
                                value={input}
                                onChange={e => setInput(e.target.value)}
                                placeholder="Ask me anything..."
                                className="flex-1 bg-muted rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/40 transition-all"
                            />
                            <button type="submit" disabled={!input.trim()}
                                className="w-10 h-10 bg-primary text-primary-foreground rounded-xl flex items-center justify-center hover:brightness-110 transition disabled:opacity-40 shrink-0">
                                <Send className="w-4 h-4" />
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
}
