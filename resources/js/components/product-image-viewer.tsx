import { useEffect, useRef, useState } from 'react';
import { X, RotateCcw } from 'lucide-react';
import { imgSrc } from '@/lib/img';

interface Props {
    images: string[] | null;
    name: string;
    onClose: () => void;
}

export default function ProductImageViewer({ images, name, onClose }: Props) {
    const containerRef = useRef<HTMLDivElement>(null);
    const [rotX, setRotX] = useState(0);
    const [rotY, setRotY] = useState(0);
    const [dragging, setDragging] = useState(false);
    const lastPos = useRef({ x: 0, y: 0 });
    const velocity = useRef({ x: 0, y: 0 });
    const rafRef = useRef<number>(0);

    // Inertia animation
    useEffect(() => {
        function animate() {
            if (!dragging) {
                velocity.current.x *= 0.92;
                velocity.current.y *= 0.92;
                if (Math.abs(velocity.current.x) > 0.1 || Math.abs(velocity.current.y) > 0.1) {
                    setRotX(r => r + velocity.current.y);
                    setRotY(r => r + velocity.current.x);
                    rafRef.current = requestAnimationFrame(animate);
                }
            }
        }
        rafRef.current = requestAnimationFrame(animate);
        return () => cancelAnimationFrame(rafRef.current);
    }, [dragging]);

    function onPointerDown(e: React.PointerEvent) {
        setDragging(true);
        lastPos.current = { x: e.clientX, y: e.clientY };
        (e.target as HTMLElement).setPointerCapture(e.pointerId);
    }

    function onPointerMove(e: React.PointerEvent) {
        if (!dragging) return;
        const dx = e.clientX - lastPos.current.x;
        const dy = e.clientY - lastPos.current.y;
        velocity.current = { x: dx * 0.5, y: dy * 0.5 };
        setRotY(r => r + dx * 0.5);
        setRotX(r => r - dy * 0.5);
        lastPos.current = { x: e.clientX, y: e.clientY };
    }

    function onPointerUp() { setDragging(false); }

    function reset() {
        setRotX(0);
        setRotY(0);
        velocity.current = { x: 0, y: 0 };
    }

    // Close on Escape
    useEffect(() => {
        const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
        window.addEventListener('keydown', handler);
        return () => window.removeEventListener('keydown', handler);
    }, [onClose]);

    const src = imgSrc(images) ?? 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=600&h=600&fit=crop&q=80';

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
            onClick={onClose}>
            <div className="relative bg-card rounded-3xl shadow-2xl p-6 max-w-sm w-full mx-4"
                onClick={e => e.stopPropagation()}>

                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                    <p className="text-sm font-semibold text-muted-foreground">3D View — drag to rotate</p>
                    <div className="flex gap-2">
                        <button onClick={reset}
                            className="p-1.5 rounded-lg hover:bg-accent transition-colors text-muted-foreground hover:text-foreground"
                            title="Reset rotation">
                            <RotateCcw className="w-4 h-4" />
                        </button>
                        <button onClick={onClose}
                            className="p-1.5 rounded-lg hover:bg-accent transition-colors text-muted-foreground hover:text-foreground">
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                </div>

                {/* 3D Stage */}
                <div ref={containerRef}
                    className="aspect-square rounded-2xl overflow-hidden bg-muted cursor-grab active:cursor-grabbing select-none"
                    style={{ perspective: '800px' }}
                    onPointerDown={onPointerDown}
                    onPointerMove={onPointerMove}
                    onPointerUp={onPointerUp}
                    onPointerLeave={onPointerUp}>
                    <div style={{
                        width: '100%',
                        height: '100%',
                        transform: `rotateX(${rotX}deg) rotateY(${rotY}deg)`,
                        transformStyle: 'preserve-3d',
                        transition: dragging ? 'none' : 'transform 0.05s linear',
                    }}>
                        <img src={src} alt={name}
                            className="w-full h-full object-cover pointer-events-none"
                            draggable={false} />
                    </div>
                </div>

                <p className="text-center text-xs text-muted-foreground mt-3">{name}</p>
            </div>
        </div>
    );
}
