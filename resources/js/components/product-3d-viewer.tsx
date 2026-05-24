import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { RotateCcw, ZoomIn, ZoomOut, Play, Pause } from 'lucide-react';

interface Props { src: string; alt: string; }

export default function Product3DViewer({ src, alt }: Props) {
    const mountRef = useRef<HTMLDivElement>(null);
    const stateRef = useRef({
        scene: null as THREE.Scene | null,
        camera: null as THREE.PerspectiveCamera | null,
        renderer: null as THREE.WebGLRenderer | null,
        mesh: null as THREE.Mesh | null,
        autoRotate: true,
        isDragging: false,
        lastX: 0, lastY: 0,
        rotX: 0, rotY: 0,
        velX: 0, velY: 0,
        zoom: 2.2,
        raf: 0,
        touches: [] as Touch[],
        lastPinchDist: 0,
    });
    const [autoRotate, setAutoRotate] = useState(true);
    const [zoom, setZoom] = useState(2.2);

    useEffect(() => {
        const el = mountRef.current;
        if (!el) return;
        const s = stateRef.current;
        const w = el.clientWidth, h = el.clientHeight;

        // Scene
        s.scene = new THREE.Scene();
        s.scene.background = null;

        // Camera
        s.camera = new THREE.PerspectiveCamera(45, w / h, 0.1, 100);
        s.camera.position.z = s.zoom;

        // Renderer
        s.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        s.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        s.renderer.setSize(w, h);
        s.renderer.shadowMap.enabled = true;
        s.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        s.renderer.toneMapping = THREE.ACESFilmicToneMapping;
        s.renderer.toneMappingExposure = 1.2;
        el.appendChild(s.renderer.domElement);

        // Lights
        const ambient = new THREE.AmbientLight(0xffffff, 0.4);
        s.scene.add(ambient);

        const key = new THREE.DirectionalLight(0xfff5e0, 2.5);
        key.position.set(3, 5, 3);
        key.castShadow = true;
        key.shadow.mapSize.set(1024, 1024);
        s.scene.add(key);

        const fill = new THREE.DirectionalLight(0xe8f0ff, 0.8);
        fill.position.set(-3, 2, -2);
        s.scene.add(fill);

        const rim = new THREE.DirectionalLight(0xffffff, 0.5);
        rim.position.set(0, -3, -3);
        s.scene.add(rim);

        // Ground shadow plane
        const shadowGeo = new THREE.PlaneGeometry(4, 4);
        const shadowMat = new THREE.ShadowMaterial({ opacity: 0.18 });
        const shadowPlane = new THREE.Mesh(shadowGeo, shadowMat);
        shadowPlane.rotation.x = -Math.PI / 2;
        shadowPlane.position.y = -0.85;
        shadowPlane.receiveShadow = true;
        s.scene.add(shadowPlane);

        // Product mesh — textured box (realistic product display)
        const loader = new THREE.TextureLoader();
        loader.load(src, (tex) => {
            tex.colorSpace = THREE.SRGBColorSpace;
            tex.anisotropy = s.renderer!.capabilities.getMaxAnisotropy();

            const geo = new THREE.BoxGeometry(1.4, 1.4, 0.08);
            const mat = new THREE.MeshStandardMaterial({
                map: tex,
                roughness: 0.35,
                metalness: 0.05,
                envMapIntensity: 1.0,
            });
            // Side/back faces — neutral wood tone
            const sideMat = new THREE.MeshStandardMaterial({ color: 0xc8a97a, roughness: 0.6, metalness: 0.0 });
            const mats = [sideMat, sideMat, sideMat, sideMat, mat, sideMat];
            s.mesh = new THREE.Mesh(geo, mats);
            s.mesh.castShadow = true;
            s.scene!.add(s.mesh);
        });

        // Animate
        function animate() {
            s.raf = requestAnimationFrame(animate);
            if (s.mesh) {
                if (s.autoRotate && !s.isDragging) {
                    s.rotY += 0.008;
                } else if (!s.isDragging) {
                    s.velX *= 0.92;
                    s.velY *= 0.92;
                    s.rotX += s.velY;
                    s.rotY += s.velX;
                }
                s.mesh.rotation.x = s.rotX;
                s.mesh.rotation.y = s.rotY;
            }
            s.camera!.position.z = s.zoom;
            s.renderer!.render(s.scene!, s.camera!);
        }
        animate();

        // Resize
        const ro = new ResizeObserver(() => {
            const w2 = el.clientWidth, h2 = el.clientHeight;
            s.camera!.aspect = w2 / h2;
            s.camera!.updateProjectionMatrix();
            s.renderer!.setSize(w2, h2);
        });
        ro.observe(el);

        return () => {
            cancelAnimationFrame(s.raf);
            ro.disconnect();
            s.renderer?.dispose();
            el.removeChild(s.renderer!.domElement);
        };
    }, [src]);

    // Sync react state → ref
    useEffect(() => { stateRef.current.autoRotate = autoRotate; }, [autoRotate]);
    useEffect(() => { stateRef.current.zoom = zoom; }, [zoom]);

    // Mouse events
    function onMouseDown(e: React.MouseEvent) {
        const s = stateRef.current;
        s.isDragging = true; s.lastX = e.clientX; s.lastY = e.clientY;
        s.velX = 0; s.velY = 0;
    }
    function onMouseMove(e: React.MouseEvent) {
        const s = stateRef.current;
        if (!s.isDragging) return;
        const dx = e.clientX - s.lastX, dy = e.clientY - s.lastY;
        s.velX = dx * 0.01; s.velY = dy * 0.01;
        s.rotY += dx * 0.01; s.rotX += dy * 0.01;
        s.lastX = e.clientX; s.lastY = e.clientY;
    }
    function onMouseUp() { stateRef.current.isDragging = false; }

    // Wheel zoom
    function onWheel(e: React.WheelEvent) {
        e.preventDefault();
        const next = Math.min(4.5, Math.max(1.2, stateRef.current.zoom + e.deltaY * 0.003));
        stateRef.current.zoom = next;
        setZoom(next);
    }

    // Touch events
    function onTouchStart(e: React.TouchEvent) {
        const s = stateRef.current;
        s.touches = Array.from(e.touches);
        if (e.touches.length === 1) {
            s.isDragging = true; s.lastX = e.touches[0].clientX; s.lastY = e.touches[0].clientY;
        } else if (e.touches.length === 2) {
            s.lastPinchDist = Math.hypot(
                e.touches[0].clientX - e.touches[1].clientX,
                e.touches[0].clientY - e.touches[1].clientY,
            );
        }
    }
    function onTouchMove(e: React.TouchEvent) {
        e.preventDefault();
        const s = stateRef.current;
        if (e.touches.length === 1 && s.isDragging) {
            const dx = e.touches[0].clientX - s.lastX, dy = e.touches[0].clientY - s.lastY;
            s.rotY += dx * 0.012; s.rotX += dy * 0.012;
            s.lastX = e.touches[0].clientX; s.lastY = e.touches[0].clientY;
        } else if (e.touches.length === 2) {
            const dist = Math.hypot(
                e.touches[0].clientX - e.touches[1].clientX,
                e.touches[0].clientY - e.touches[1].clientY,
            );
            const delta = (s.lastPinchDist - dist) * 0.01;
            const next = Math.min(4.5, Math.max(1.2, s.zoom + delta));
            s.zoom = next; setZoom(next);
            s.lastPinchDist = dist;
        }
    }
    function onTouchEnd() { stateRef.current.isDragging = false; }

    function reset() {
        const s = stateRef.current;
        s.rotX = 0; s.rotY = 0; s.velX = 0; s.velY = 0;
        s.zoom = 2.2; setZoom(2.2);
    }

    return (
        <div className="relative w-full h-full select-none">
            <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing rounded-2xl overflow-hidden"
                onMouseDown={onMouseDown} onMouseMove={onMouseMove} onMouseUp={onMouseUp} onMouseLeave={onMouseUp}
                onWheel={onWheel}
                onTouchStart={onTouchStart} onTouchMove={onTouchMove} onTouchEnd={onTouchEnd} />

            {/* Controls */}
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5 bg-background/80 backdrop-blur-md border border-border rounded-full px-3 py-1.5 shadow-lg">
                <button onClick={() => { const n = Math.max(1.2, zoom - 0.4); stateRef.current.zoom = n; setZoom(n); }}
                    className="p-1 hover:text-primary transition-colors" title="Zoom in">
                    <ZoomIn className="w-3.5 h-3.5" />
                </button>
                <div className="w-px h-3.5 bg-border" />
                <button onClick={() => { const n = Math.min(4.5, zoom + 0.4); stateRef.current.zoom = n; setZoom(n); }}
                    className="p-1 hover:text-primary transition-colors" title="Zoom out">
                    <ZoomOut className="w-3.5 h-3.5" />
                </button>
                <div className="w-px h-3.5 bg-border" />
                <button onClick={() => setAutoRotate(a => !a)}
                    className={`p-1 transition-colors ${autoRotate ? 'text-primary' : 'hover:text-primary'}`} title="Auto rotate">
                    {autoRotate ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                </button>
                <div className="w-px h-3.5 bg-border" />
                <button onClick={reset} className="p-1 hover:text-primary transition-colors" title="Reset">
                    <RotateCcw className="w-3.5 h-3.5" />
                </button>
            </div>

            {/* Hint */}
            <p className="absolute top-3 left-1/2 -translate-x-1/2 text-[10px] text-muted-foreground bg-background/70 backdrop-blur px-2.5 py-1 rounded-full pointer-events-none whitespace-nowrap">
                Drag to rotate · Scroll to zoom
            </p>
        </div>
    );
}
