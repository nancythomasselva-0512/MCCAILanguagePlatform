(globalThis["TURBOPACK"] || (globalThis["TURBOPACK"] = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/src/components/landing/AnimatedCounter.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "AnimatedCounter",
    ()=>AnimatedCounter
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
const AnimatedCounter = ({ value })=>{
    _s();
    const [displayValue, setDisplayValue] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('0');
    const containerRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const animatedRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(false);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "AnimatedCounter.useEffect": ()=>{
            const observer = new IntersectionObserver({
                "AnimatedCounter.useEffect": (entries)=>{
                    const entry = entries[0];
                    if (entry.isIntersecting && !animatedRef.current) {
                        animatedRef.current = true;
                        animateValue();
                    }
                }
            }["AnimatedCounter.useEffect"], {
                threshold: 0.1
            });
            if (containerRef.current) {
                observer.observe(containerRef.current);
            }
            return ({
                "AnimatedCounter.useEffect": ()=>observer.disconnect()
            })["AnimatedCounter.useEffect"];
        }
    }["AnimatedCounter.useEffect"], [
        value
    ]);
    const animateValue = ()=>{
        // Parse value, suffixes and prefixes
        // 2M+ -> prefix = "", num = 2, suffix = "M+"
        // 100+ -> prefix = "", num = 100, suffix = "+"
        // 99.2% -> prefix = "", num = 99.2, suffix = "%"
        // <1s -> prefix = "<", num = 1, suffix = "s"
        let prefix = '';
        let suffix = '';
        let numericString = '';
        if (value.startsWith('<')) {
            prefix = '<';
            numericString = value.slice(1);
        } else {
            numericString = value;
        }
        // Extract numbers (including decimals)
        const match = numericString.match(/^([0-9.]+)(.*)$/);
        let targetNum = 0;
        if (match) {
            targetNum = parseFloat(match[1]);
            suffix = match[2];
        } else {
            // Fallback if no match
            setDisplayValue(value);
            return;
        }
        const duration = 1500; // ms
        const startTime = performance.now();
        const isDecimal = match[1].includes('.');
        const update = (now)=>{
            const elapsed = now - startTime;
            const progress = Math.min(elapsed / duration, 1);
            // Easing function (easeOutQuad)
            const easeProgress = progress * (2 - progress);
            const current = easeProgress * targetNum;
            let formatted = '';
            if (isDecimal) {
                formatted = current.toFixed(1);
            } else {
                formatted = Math.floor(current).toString();
            }
            setDisplayValue(`${prefix}${formatted}${suffix}`);
            if (progress < 1) {
                requestAnimationFrame(update);
            } else {
                setDisplayValue(value); // Ensure exact target string at the end
            }
        };
        requestAnimationFrame(update);
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
        ref: containerRef,
        children: displayValue
    }, void 0, false, {
        fileName: "[project]/src/components/landing/AnimatedCounter.tsx",
        lineNumber: 93,
        columnNumber: 10
    }, ("TURBOPACK compile-time value", void 0));
};
_s(AnimatedCounter, "MhddS7O/Z7ZaTqKGek4zxFsjBqs=");
_c = AnimatedCounter;
var _c;
__turbopack_context__.k.register(_c, "AnimatedCounter");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/landing/HeroNeuralSphere.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "HeroNeuralSphere",
    ()=>HeroNeuralSphere
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
const GLYPHS = [
    'A',
    'ஆ',
    '文',
    'Ω',
    '♫',
    '語',
    'हिं',
    'EN',
    'ES',
    'FR',
    'AR'
];
const HeroNeuralSphere = ()=>{
    _s();
    const canvasRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const mouseRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])({
        x: 0,
        y: 0,
        targetX: 0,
        targetY: 0,
        active: false
    });
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "HeroNeuralSphere.useEffect": ()=>{
            const canvas = canvasRef.current;
            if (!canvas) return;
            const ctx = canvas.getContext('2d');
            if (!ctx) return;
            let animationFrameId;
            let width = canvas.width = 500;
            let height = canvas.height = 500;
            // Core Sphere Points
            const corePoints = [];
            const numCorePoints = 160;
            const rCore = 120; // sphere radius
            for(let i = 0; i < numCorePoints; i++){
                const phi = Math.acos(1 - 2 * i / numCorePoints);
                const theta = Math.PI * (1 + Math.sqrt(5)) * i;
                corePoints.push({
                    x: rCore * Math.cos(theta) * Math.sin(phi),
                    y: rCore * Math.sin(theta) * Math.sin(phi),
                    z: rCore * Math.cos(phi),
                    color: i % 3 === 0 ? '#3b82f6' : i % 3 === 1 ? '#a855f7' : '#06b6d4'
                });
            }
            // Orbiting Glyphs (on outer tilted rings)
            const glyphs = [];
            for(let i = 0; i < GLYPHS.length; i++){
                glyphs.push({
                    angle: i * (Math.PI * 2) / GLYPHS.length,
                    r: 170,
                    glyph: GLYPHS[i],
                    speed: 0.006 + Math.random() * 0.004,
                    yOffset: (Math.random() - 0.5) * 50
                });
            }
            // Waveform dots orbiting the equator
            const waveDots = [];
            const numWaveDots = 45;
            for(let i = 0; i < numWaveDots; i++){
                waveDots.push({
                    angle: i * (Math.PI * 2) / numWaveDots,
                    r: 145
                });
            }
            let angleY = 0.003;
            let angleX = 0.0015;
            const handleMouseMove = {
                "HeroNeuralSphere.useEffect.handleMouseMove": (e)=>{
                    const rect = canvas.getBoundingClientRect();
                    const cx = rect.left + rect.width / 2;
                    const cy = rect.top + rect.height / 2;
                    mouseRef.current.targetX = (e.clientX - cx) * 0.0015;
                    mouseRef.current.targetY = (e.clientY - cy) * 0.0015;
                    mouseRef.current.active = true;
                }
            }["HeroNeuralSphere.useEffect.handleMouseMove"];
            const handleMouseLeave = {
                "HeroNeuralSphere.useEffect.handleMouseLeave": ()=>{
                    mouseRef.current.targetX = 0;
                    mouseRef.current.targetY = 0;
                    mouseRef.current.active = false;
                }
            }["HeroNeuralSphere.useEffect.handleMouseLeave"];
            window.addEventListener('mousemove', handleMouseMove);
            document.addEventListener('mouseleave', handleMouseLeave);
            const draw = {
                "HeroNeuralSphere.useEffect.draw": ()=>{
                    ctx.clearRect(0, 0, width, height);
                    const cx = width / 2;
                    const cy = height / 2;
                    // Soft mouse interpolation
                    mouseRef.current.x += (mouseRef.current.targetX - mouseRef.current.x) * 0.05;
                    mouseRef.current.y += (mouseRef.current.targetY - mouseRef.current.y) * 0.05;
                    const currentAngleY = angleY + mouseRef.current.x;
                    const currentAngleX = angleX + mouseRef.current.y;
                    const cosY = Math.cos(currentAngleY);
                    const sinY = Math.sin(currentAngleY);
                    const cosX = Math.cos(currentAngleX);
                    const sinX = Math.sin(currentAngleX);
                    // Rotate and Project Core Sphere Points
                    const projectedCore = [];
                    for(let i = 0; i < corePoints.length; i++){
                        const p = corePoints[i];
                        // Spin Y
                        let x1 = p.x * cosY - p.z * sinY;
                        let z1 = p.z * cosY + p.x * sinY;
                        // Spin X
                        let y2 = p.y * cosX - z1 * sinX;
                        let z2 = z1 * cosX + p.y * sinX;
                        // Update positions
                        p.x = x1;
                        p.y = y2;
                        p.z = z2;
                        const scale = 360 / (360 + z2);
                        projectedCore.push({
                            x: cx + p.x * scale,
                            y: cy + p.y * scale,
                            z: z2,
                            color: p.color,
                            rx: p.x,
                            ry: p.y
                        });
                    }
                    // 3D Sort for Sphere Points
                    projectedCore.sort({
                        "HeroNeuralSphere.useEffect.draw": (a, b)=>b.z - a.z
                    }["HeroNeuralSphere.useEffect.draw"]);
                    // Draw Sphere Core Connective Net (Back / Mid points)
                    for(let i = 0; i < projectedCore.length; i++){
                        const p1 = projectedCore[i];
                        if (p1.z > 50) continue; // skip deep-back connections for clarity
                        let connections = 0;
                        for(let j = i + 1; j < projectedCore.length; j++){
                            const p2 = projectedCore[j];
                            const dx = p1.rx - p2.rx;
                            const dy = p1.ry - p2.ry;
                            const dz = p1.z - p2.z;
                            const distSqr = dx * dx + dy * dy + dz * dz;
                            // 38 * 38 = 1444. Avoid Math.sqrt unless points are close
                            if (distSqr < 1444 && connections < 3) {
                                const dist3D = Math.sqrt(distSqr);
                                const alpha = (1 - dist3D / 38) * 0.12 * (1 - p1.z / 150);
                                ctx.beginPath();
                                ctx.moveTo(p1.x, p1.y);
                                ctx.lineTo(p2.x, p2.y);
                                ctx.strokeStyle = `rgba(59, 130, 246, ${alpha})`;
                                ctx.lineWidth = 0.5;
                                ctx.stroke();
                                connections++;
                            }
                        }
                    }
                    // Draw Core Sphere nodes
                    for(let i = 0; i < projectedCore.length; i++){
                        const p = projectedCore[i];
                        const size = (p.z > 0 ? 1.2 : 2.8) * (360 / (360 + p.z));
                        const alpha = Math.max(0.1, 1 - (p.z + rCore) / (rCore * 2));
                        if (p.z < 0) {
                            // Glow on front points
                            ctx.beginPath();
                            ctx.arc(p.x, p.y, size * 2.2, 0, Math.PI * 2);
                            ctx.fillStyle = p.color;
                            ctx.globalAlpha = alpha * 0.12;
                            ctx.fill();
                        }
                        ctx.beginPath();
                        ctx.arc(p.x, p.y, size, 0, Math.PI * 2);
                        ctx.fillStyle = p.color;
                        ctx.globalAlpha = alpha;
                        ctx.fill();
                        ctx.globalAlpha = 1.0;
                    }
                    // Draw Equatorial Waveform Orbit
                    const time = Date.now() * 0.003;
                    const waveProjected = [];
                    for(let i = 0; i < waveDots.length; i++){
                        const wd = waveDots[i];
                        wd.angle += 0.002; // slow orbit
                        // Calculate dynamic wave amplitude
                        const waveAmp = 15 * Math.sin(wd.angle * 6 + time);
                        // Base coordinate around equator
                        const rawX = wd.r * Math.cos(wd.angle);
                        const rawZ = wd.r * Math.sin(wd.angle);
                        const rawY = waveAmp; // dynamic y offset
                        // Rotate wave
                        let x1 = rawX * cosY - rawZ * sinY;
                        let z1 = rawZ * cosY + rawX * sinY;
                        let y2 = rawY * cosX - z1 * sinX;
                        let z2 = z1 * cosX + rawY * sinX;
                        const scale = 360 / (360 + z2);
                        waveProjected.push({
                            x: cx + x1 * scale,
                            y: cy + y2 * scale,
                            z: z2
                        });
                    }
                    // Draw continuous wavy outline path
                    ctx.beginPath();
                    for(let i = 0; i < waveProjected.length; i++){
                        const pt = waveProjected[i];
                        if (i === 0) ctx.moveTo(pt.x, pt.y);
                        else ctx.lineTo(pt.x, pt.y);
                    }
                    ctx.closePath();
                    ctx.strokeStyle = 'rgba(6, 182, 212, 0.25)';
                    ctx.lineWidth = 1.2;
                    ctx.stroke();
                    // Draw wave nodes
                    for(let i = 0; i < waveProjected.length; i++){
                        const pt = waveProjected[i];
                        const alpha = Math.max(0.1, 1 - (pt.z + 150) / 300);
                        ctx.beginPath();
                        ctx.arc(pt.x, pt.y, pt.z < 0 ? 2.5 : 1.2, 0, Math.PI * 2);
                        ctx.fillStyle = '#22d3ee';
                        ctx.globalAlpha = alpha;
                        ctx.fill();
                        ctx.globalAlpha = 1.0;
                    }
                    // Draw Orbiting Glyphs (Front vs Back rendering)
                    glyphs.forEach({
                        "HeroNeuralSphere.useEffect.draw": (g)=>{
                            g.angle += g.speed;
                            // Coordinates (tilted orbits)
                            const rawX = g.r * Math.cos(g.angle);
                            const rawZ = g.r * Math.sin(g.angle);
                            const rawY = g.yOffset + g.r * Math.sin(g.angle * 0.5) * 0.2; // organic slant
                            // Rotate
                            let x1 = rawX * cosY - rawZ * sinY;
                            let z1 = rawZ * cosY + rawX * sinY;
                            let y2 = rawY * cosX - z1 * sinX;
                            let z2 = z1 * cosX + rawY * sinX;
                            const scale = 360 / (360 + z2);
                            const sx = cx + x1 * scale;
                            const sy = cy + y2 * scale;
                            // Font size and transparency based on depth
                            const fontSize = Math.max(9, Math.floor(14 * scale));
                            const alpha = Math.max(0.12, 1 - (z2 + 180) / 360);
                            ctx.font = `black ${fontSize}px Inter, sans-serif`;
                            ctx.fillStyle = z2 < 0 ? '#ffffff' : '#94a3b8';
                            ctx.globalAlpha = alpha;
                            // Central glow behind front glyphs
                            if (z2 < -50) {
                                ctx.shadowBlur = 8;
                                ctx.shadowColor = '#06b6d4';
                            }
                            ctx.fillText(g.glyph, sx, sy);
                            ctx.shadowBlur = 0; // reset
                            ctx.globalAlpha = 1.0;
                            // Draw dotted flight trail from glyph back into sphere
                            if (z2 < 0 && Math.random() > 0.98) {
                                ctx.beginPath();
                                ctx.moveTo(sx, sy);
                                ctx.lineTo(cx, cy);
                                ctx.strokeStyle = 'rgba(168, 85, 247, 0.15)';
                                ctx.lineWidth = 0.5;
                                ctx.stroke();
                            }
                        }
                    }["HeroNeuralSphere.useEffect.draw"]);
                    // Draw central core halo
                    const coreGradient = ctx.createRadialGradient(cx, cy, 2, cx, cy, 75);
                    coreGradient.addColorStop(0, 'rgba(59, 130, 246, 0.18)');
                    coreGradient.addColorStop(0.5, 'rgba(168, 85, 247, 0.08)');
                    coreGradient.addColorStop(1, 'rgba(0,0,0,0)');
                    ctx.fillStyle = coreGradient;
                    ctx.beginPath();
                    ctx.arc(cx, cy, 75, 0, Math.PI * 2);
                    ctx.fill();
                    animationFrameId = requestAnimationFrame(draw);
                }
            }["HeroNeuralSphere.useEffect.draw"];
            draw();
            const handleResize = {
                "HeroNeuralSphere.useEffect.handleResize": ()=>{
                    if (!canvas) return;
                    const size = Math.min(500, canvas.parentElement?.clientWidth || 500);
                    width = canvas.width = size;
                    height = canvas.height = size;
                }
            }["HeroNeuralSphere.useEffect.handleResize"];
            handleResize();
            window.addEventListener('resize', handleResize);
            return ({
                "HeroNeuralSphere.useEffect": ()=>{
                    cancelAnimationFrame(animationFrameId);
                    window.removeEventListener('mousemove', handleMouseMove);
                    document.removeEventListener('mouseleave', handleMouseLeave);
                    window.removeEventListener('resize', handleResize);
                }
            })["HeroNeuralSphere.useEffect"];
        }
    }["HeroNeuralSphere.useEffect"], []);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "relative flex items-center justify-center w-full h-full max-w-[500px] aspect-square mx-auto",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "absolute inset-0 -z-10 rounded-full blur-3xl opacity-30 bg-radial from-teal-500/20 via-emerald-500/10 to-transparent"
            }, void 0, false, {
                fileName: "[project]/src/components/landing/HeroNeuralSphere.tsx",
                lineNumber: 321,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("canvas", {
                ref: canvasRef,
                className: "w-full h-full select-none pointer-events-none"
            }, void 0, false, {
                fileName: "[project]/src/components/landing/HeroNeuralSphere.tsx",
                lineNumber: 322,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/landing/HeroNeuralSphere.tsx",
        lineNumber: 319,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
_s(HeroNeuralSphere, "Qimi1+XRgPM/xwIviNOompZCtaA=");
_c = HeroNeuralSphere;
var _c;
__turbopack_context__.k.register(_c, "HeroNeuralSphere");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/landing/HeroShaderBackground.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "HeroShaderBackground",
    ()=>HeroShaderBackground
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
const HeroShaderBackground = ()=>{
    _s();
    const canvasRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "HeroShaderBackground.useEffect": ()=>{
            const canvas = canvasRef.current;
            if (!canvas) return;
            const ctx = canvas.getContext('2d');
            if (!ctx) return;
            let animationFrameId;
            let width = canvas.width = window.innerWidth;
            let height = canvas.height = window.innerHeight;
            const handleResize = {
                "HeroShaderBackground.useEffect.handleResize": ()=>{
                    if (!canvas) return;
                    width = canvas.width = window.innerWidth;
                    height = canvas.height = window.innerHeight;
                }
            }["HeroShaderBackground.useEffect.handleResize"];
            window.addEventListener('resize', handleResize);
            // Particles/Orbs for ChromaFlow (#ff5f03 momentum flow)
            const orbs = [
                {
                    x: width * 0.2,
                    y: height * 0.3,
                    vx: 0.8,
                    vy: 0.6,
                    radius: 280,
                    color: 'rgba(255, 95, 3, 0.22)'
                },
                {
                    x: width * 0.8,
                    y: height * 0.4,
                    vx: -0.7,
                    vy: 0.5,
                    radius: 320,
                    color: 'rgba(255, 115, 20, 0.18)'
                },
                {
                    x: width * 0.5,
                    y: height * 0.7,
                    vx: 0.5,
                    vy: -0.8,
                    radius: 360,
                    color: 'rgba(242, 101, 34, 0.20)'
                },
                {
                    x: width * 0.3,
                    y: height * 0.8,
                    vx: -0.6,
                    vy: -0.4,
                    radius: 240,
                    color: 'rgba(255, 130, 40, 0.15)'
                }
            ];
            let time = 0;
            const render = {
                "HeroShaderBackground.useEffect.render": ()=>{
                    time += 0.015;
                    ctx.clearRect(0, 0, width, height);
                    // Base background color light gray #EFEFEF
                    ctx.fillStyle = '#EFEFEF';
                    ctx.fillRect(0, 0, width, height);
                    // 1. Swirl & Waves (#ffffff & #f0f0f0 detail swirl)
                    ctx.save();
                    ctx.fillStyle = 'rgba(255, 255, 255, 0.75)';
                    ctx.beginPath();
                    for(let x = 0; x <= width; x += 20){
                        const y = Math.sin(x * 0.003 + time * 0.8) * 120 + Math.cos(x * 0.002 - time * 0.5) * 80 + height * 0.4;
                        if (x === 0) ctx.moveTo(x, y);
                        else ctx.lineTo(x, y);
                    }
                    ctx.lineTo(width, height);
                    ctx.lineTo(0, height);
                    ctx.closePath();
                    ctx.fill();
                    ctx.restore();
                    // 2. ChromaFlow (#ff5f03 orange flow hotspots)
                    orbs.forEach({
                        "HeroShaderBackground.useEffect.render": (orb)=>{
                            orb.x += orb.vx * 0.8;
                            orb.y += orb.vy * 0.8;
                            if (orb.x < -100 || orb.x > width + 100) orb.vx *= -1;
                            if (orb.y < -100 || orb.y > height + 100) orb.vy *= -1;
                            const grad = ctx.createRadialGradient(orb.x, orb.y, 0, orb.x, orb.y, orb.radius);
                            grad.addColorStop(0, orb.color);
                            grad.addColorStop(0.6, 'rgba(255, 95, 3, 0.05)');
                            grad.addColorStop(1, 'transparent');
                            ctx.fillStyle = grad;
                            ctx.beginPath();
                            ctx.arc(orb.x, orb.y, orb.radius, 0, Math.PI * 2);
                            ctx.fill();
                        }
                    }["HeroShaderBackground.useEffect.render"]);
                    // 3. FlutedGlass Vertical Ridge Shader lines
                    ctx.fillStyle = 'rgba(255, 255, 255, 0.08)';
                    const ridgeWidth = 24;
                    for(let x = 0; x < width; x += ridgeWidth * 2){
                        ctx.fillRect(x + Math.sin(time + x * 0.01) * 6, 0, ridgeWidth, height);
                    }
                    // 4. FilmGrain noise simulation
                    ctx.fillStyle = 'rgba(0, 0, 0, 0.025)';
                    for(let i = 0; i < 400; i++){
                        const gx = Math.random() * width;
                        const gy = Math.random() * height;
                        ctx.fillRect(gx, gy, 1.5, 1.5);
                    }
                    animationFrameId = requestAnimationFrame(render);
                }
            }["HeroShaderBackground.useEffect.render"];
            render();
            return ({
                "HeroShaderBackground.useEffect": ()=>{
                    window.removeEventListener('resize', handleResize);
                    cancelAnimationFrame(animationFrameId);
                }
            })["HeroShaderBackground.useEffect"];
        }
    }["HeroShaderBackground.useEffect"], []);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("canvas", {
        ref: canvasRef,
        className: "absolute inset-0 z-10 w-full h-full pointer-events-none opacity-90 dark:opacity-40 transition-opacity duration-500"
    }, void 0, false, {
        fileName: "[project]/src/components/landing/HeroShaderBackground.tsx",
        lineNumber: 104,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
_s(HeroShaderBackground, "UJgi7ynoup7eqypjnwyX/s32POg=");
_c = HeroShaderBackground;
var _c;
__turbopack_context__.k.register(_c, "HeroShaderBackground");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/components/landing/LandingPage.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "LandingPage",
    ()=>LandingPage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/framer-motion/dist/es/render/components/motion/proxy.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$components$2f$AnimatePresence$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/framer-motion/dist/es/components/AnimatePresence/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$mic$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Mic$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/mic.mjs [app-client] (ecmascript) <export default as Mic>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$volume$2d$2$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Volume2$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/volume-2.mjs [app-client] (ecmascript) <export default as Volume2>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$languages$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Languages$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/languages.mjs [app-client] (ecmascript) <export default as Languages>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$file$2d$headphone$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__FileAudio$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/file-headphone.mjs [app-client] (ecmascript) <export default as FileAudio>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$right$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowRight$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/arrow-right.mjs [app-client] (ecmascript) <export default as ArrowRight>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$zap$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Zap$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/zap.mjs [app-client] (ecmascript) <export default as Zap>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$globe$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Globe$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/globe.mjs [app-client] (ecmascript) <export default as Globe>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$shield$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Shield$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/shield.mjs [app-client] (ecmascript) <export default as Shield>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$clock$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Clock$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/clock.mjs [app-client] (ecmascript) <export default as Clock>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$check$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CheckCircle2$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/circle-check.mjs [app-client] (ecmascript) <export default as CheckCircle2>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$users$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Users$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/users.mjs [app-client] (ecmascript) <export default as Users>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chart$2d$column$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__BarChart3$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/chart-column.mjs [app-client] (ecmascript) <export default as BarChart3>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$headphones$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Headphones$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/headphones.mjs [app-client] (ecmascript) <export default as Headphones>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$plus$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Plus$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/plus.mjs [app-client] (ecmascript) <export default as Plus>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$server$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Server$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/server.mjs [app-client] (ecmascript) <export default as Server>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$database$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Database$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/database.mjs [app-client] (ecmascript) <export default as Database>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$right$2d$left$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowRightLeft$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/arrow-right-left.mjs [app-client] (ecmascript) <export default as ArrowRightLeft>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$file$2d$code$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__FileCode$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/file-code.mjs [app-client] (ecmascript) <export default as FileCode>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/x.mjs [app-client] (ecmascript) <export default as X>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$menu$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Menu$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/menu.mjs [app-client] (ecmascript) <export default as Menu>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$mail$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Mail$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/mail.mjs [app-client] (ecmascript) <export default as Mail>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$phone$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Phone$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/phone.mjs [app-client] (ecmascript) <export default as Phone>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$map$2d$pin$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__MapPin$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/map-pin.mjs [app-client] (ecmascript) <export default as MapPin>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$sun$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Sun$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/sun.mjs [app-client] (ecmascript) <export default as Sun>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$moon$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Moon$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/moon.mjs [app-client] (ecmascript) <export default as Moon>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$context$2f$AppContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/context/AppContext.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$landing$2f$AnimatedCounter$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/landing/AnimatedCounter.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$landing$2f$HeroShaderBackground$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/landing/HeroShaderBackground.tsx [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature();
'use client';
;
;
;
;
;
;
// ── STARBURST COMPASS ICON FOR PARTNER BADGE ─────────────────────────────────
const StarburstIcon = ()=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
        xmlns: "http://www.w3.org/2000/svg",
        viewBox: "0 0 100 100",
        className: "w-5 h-5 sm:w-6 sm:h-6 fill-current text-[#E8704E] shrink-0",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
            d: "m19.6 66.5 19.7-11 .3-1-.3-.5h-1l-3.3-.2-11.2-.3L14 53l-9.5-.5-2.4-.5L0 49l.2-1.5 2-1.3 2.9.2 6.3.5 9.5.6 6.9.4L38 49.1h1.6l.2-.7-.5-.4-.4-.4L29 41l-10.6-7-5.6-4.1-3-2-1.5-2-.6-4.2 2.7-3 3.7.3.9.2 3.7 2.9 8 6.1L37 36l1.5 1.2.6-.4.1-.3-.7-1.1L33 25l-6-10.4-2.7-4.3-.7-2.6c-.3-1-.4-2-.4-3l3-4.2L28 0l4.2.6L33.8 2l2.6 6 4.1 9.3L47 29.9l2 3.8 1 3.4.3 1h.7v-.5l.5-7.2 1-8.7 1-11.2.3-3.2 1.6-3.8 3-2L61 2.6l2 2.9-.3 1.8-1.1 7.7L59 27.1l-1.5 8.2h.9l1-1.1 4.1-5.4 6.9-8.6 3-3.5L77 13l2.3-1.8h4.3l3.1 4.7-1.4 4.9-4.4 5.6-3.7 4.7-5.3 7.1-3.2 5.7.3.4h.7l12-2.6 6.4-1.1 7.6-1.3 3.5 1.6.4 1.6-1.4 3.4-8.2 2-9.6 2-14.3 3.3-.2.1.2.3 6.4.6 2.8.2h6.8l12.6 1 3.3 2 1.9 2.7-.3 2-5.1 2.6-6.8-1.6-16-3.8-5.4-1.3h-.8v.4l4.6 4.5 8.3 7.5L89 80.1l.5 2.4-1.3 2-1.4-.2-9.2-7-3.6-3-8-6.8h-.5v.7l1.8 2.7 9.8 14.7.5 4.5-.7 1.4-2.6 1-2.7-.6-5.8-8-6-9-4.7-8.2-.5.4-2.9 30.2-1.3 1.5-3 1.2-2.5-2-1.4-3 1.4-6.2 1.6-8 1.3-6.4 1.2-7.9.7-2.6v-.2H49L43 72l-9 12.3-7.2 7.6-1.7.7-3-1.5.3-2.8L24 86l10-12.8 6-7.9 4-4.6-.1-.5h-.3L17.2 77.4l-4.7.6-2-2 .2-3 1-1 8-5.5Z"
        }, void 0, false, {
            fileName: "[project]/src/components/landing/LandingPage.tsx",
            lineNumber: 22,
            columnNumber: 5
        }, ("TURBOPACK compile-time value", void 0))
    }, void 0, false, {
        fileName: "[project]/src/components/landing/LandingPage.tsx",
        lineNumber: 21,
        columnNumber: 3
    }, ("TURBOPACK compile-time value", void 0));
_c = StarburstIcon;
// ── TEXT ROLL HOVER BUTTON COMPONENT ─────────────────────────────────────────
const TextRollButton = ({ text, onClick, bgClass = "bg-gray-900 text-white", iconBgClass = "bg-white text-gray-900", arrowColorClass = "", paddingClass = "pl-5 pr-2 py-2" })=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
        onClick: onClick,
        className: `group relative inline-flex items-center gap-3 rounded-full font-medium text-[13px] sm:text-[14px] cursor-pointer ${bgClass} ${paddingClass} transition-all duration-300 shadow-md`,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex flex-col h-[20px] overflow-hidden leading-[20px]",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "transform group-hover:-translate-y-full transition-transform duration-500 ease-[cubic-bezier(0.25,0.1,0.25,1)]",
                        children: text
                    }, void 0, false, {
                        fileName: "[project]/src/components/landing/LandingPage.tsx",
                        lineNumber: 47,
                        columnNumber: 7
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: "transform group-hover:-translate-y-full transition-transform duration-500 ease-[cubic-bezier(0.25,0.1,0.25,1)]",
                        children: text
                    }, void 0, false, {
                        fileName: "[project]/src/components/landing/LandingPage.tsx",
                        lineNumber: 50,
                        columnNumber: 7
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/landing/LandingPage.tsx",
                lineNumber: 46,
                columnNumber: 5
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: `w-6 h-6 sm:w-7 sm:h-7 rounded-full flex items-center justify-center transition-transform duration-500 ease-[cubic-bezier(0.25,0.1,0.25,1)] group-hover:-rotate-45 ${iconBgClass}`,
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$right$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowRight$3e$__["ArrowRight"], {
                    size: 14,
                    className: arrowColorClass
                }, void 0, false, {
                    fileName: "[project]/src/components/landing/LandingPage.tsx",
                    lineNumber: 55,
                    columnNumber: 7
                }, ("TURBOPACK compile-time value", void 0))
            }, void 0, false, {
                fileName: "[project]/src/components/landing/LandingPage.tsx",
                lineNumber: 54,
                columnNumber: 5
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/landing/LandingPage.tsx",
        lineNumber: 42,
        columnNumber: 3
    }, ("TURBOPACK compile-time value", void 0));
_c1 = TextRollButton;
const ThreeDInteractiveCard = ({ children, className = '', glowColor = 'rgba(37,99,235,0.15)', onClick })=>{
    _s();
    const cardRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const contentRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(null);
    const handleMouseMove = (e)=>{
        if (!cardRef.current) return;
        const rect = cardRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const xc = rect.width / 2;
        const yc = rect.height / 2;
        const rY = (x - xc) / xc * 10;
        const rX = -((y - yc) / yc) * 10;
        // Direct DOM manipulation to avoid React re-renders on mousemove
        cardRef.current.style.transform = `perspective(1000px) rotateX(${rX}deg) rotateY(${rY}deg) scale3d(1.025, 1.025, 1.025)`;
        if (contentRef.current) {
            contentRef.current.style.transform = 'translateZ(25px)';
        }
        const glow = cardRef.current.querySelector('.card-3d-glow');
        if (glow) {
            glow.style.background = `radial-gradient(circle 220px at ${x}px ${y}px, ${glowColor}, transparent 80%)`;
        }
    };
    const handleMouseLeave = ()=>{
        if (cardRef.current) {
            cardRef.current.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
        }
        if (contentRef.current) {
            contentRef.current.style.transform = 'translateZ(0px)';
        }
        const glow = cardRef.current?.querySelector('.card-3d-glow');
        if (glow) {
            glow.style.background = 'transparent';
        }
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        ref: cardRef,
        onMouseMove: handleMouseMove,
        onMouseLeave: handleMouseLeave,
        onClick: onClick,
        style: {
            transform: 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)',
            transformStyle: 'preserve-3d'
        },
        className: `bg-white dark:bg-[#0a1120]/85 border border-[#DDE5F0] dark:border-white/5 rounded-[28px] shadow-lg dark:shadow-2xl transition-all duration-300 relative overflow-hidden group select-none ${className}`,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "card-3d-glow absolute inset-0 pointer-events-none transition-all duration-300"
            }, void 0, false, {
                fileName: "[project]/src/components/landing/LandingPage.tsx",
                lineNumber: 126,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#2563eb]/10 dark:via-white/10 to-transparent"
            }, void 0, false, {
                fileName: "[project]/src/components/landing/LandingPage.tsx",
                lineNumber: 127,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                ref: contentRef,
                style: {
                    transform: 'translateZ(0px)',
                    transformStyle: 'preserve-3d'
                },
                className: "transition-transform duration-300 h-full w-full",
                children: children
            }, void 0, false, {
                fileName: "[project]/src/components/landing/LandingPage.tsx",
                lineNumber: 128,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/landing/LandingPage.tsx",
        lineNumber: 115,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
_s(ThreeDInteractiveCard, "gGYMWo+4H4e+dG3RhpdOuRezMvI=");
_c2 = ThreeDInteractiveCard;
// ── CONSTANTS ──
const TOOLS = [
    {
        id: 'voice-to-text',
        icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$mic$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Mic$3e$__["Mic"], {
            size: 22
        }, void 0, false, {
            fileName: "[project]/src/components/landing/LandingPage.tsx",
            lineNumber: 156,
            columnNumber: 11
        }, ("TURBOPACK compile-time value", void 0)),
        label: 'Voice to Text',
        tagline: 'Real-time Capturing',
        description: 'Convert live speech or voice recordings to accurate text in real-time with automatic language detection.',
        accentColor: '#3b82f6',
        glowColor: 'rgba(59, 130, 246, 0.2)',
        status: 'ONNX Engine Ready',
        features: [
            'Live recording',
            'Auto detection',
            'Download TXT'
        ]
    },
    {
        id: 'text-to-speech',
        icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$volume$2d$2$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Volume2$3e$__["Volume2"], {
            size: 22
        }, void 0, false, {
            fileName: "[project]/src/components/landing/LandingPage.tsx",
            lineNumber: 167,
            columnNumber: 11
        }, ("TURBOPACK compile-time value", void 0)),
        label: 'Text to Voice',
        tagline: 'High-Fidelity Synthesis',
        description: 'Transform written text into natural-sounding speech. Choose speed, pitch, and voice preset options.',
        accentColor: '#a855f7',
        glowColor: 'rgba(168, 85, 247, 0.2)',
        status: '12 voices loaded',
        features: [
            '20+ neural voices',
            'Speed control',
            'MP3 download'
        ]
    },
    {
        id: 'translation',
        icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$languages$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Languages$3e$__["Languages"], {
            size: 22
        }, void 0, false, {
            fileName: "[project]/src/components/landing/LandingPage.tsx",
            lineNumber: 178,
            columnNumber: 11
        }, ("TURBOPACK compile-time value", void 0)),
        label: 'Text Translation',
        tagline: 'Multi-lingual Mapping',
        description: 'Translate text between 100+ languages instantly. Play translated speech output with natural phrasing.',
        accentColor: '#10b981',
        glowColor: 'rgba(16, 185, 129, 0.2)',
        status: 'Offline Translating',
        features: [
            '100+ languages',
            'Source detection',
            'Audio output'
        ]
    },
    {
        id: 'audio-transcription',
        icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$file$2d$headphone$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__FileAudio$3e$__["FileAudio"], {
            size: 22
        }, void 0, false, {
            fileName: "[project]/src/components/landing/LandingPage.tsx",
            lineNumber: 189,
            columnNumber: 11
        }, ("TURBOPACK compile-time value", void 0)),
        label: 'Audio to Text',
        tagline: 'Timeline Segmentation',
        description: 'Upload audio files (MP3, WAV, M4A) to generate accurate transcripts equipped with automatic timestamp dividers.',
        accentColor: '#f59e0b',
        glowColor: 'rgba(245, 158, 11, 0.2)',
        status: 'All formats supported',
        features: [
            'Multiple file formats',
            'Timestamps',
            'Inline editor'
        ]
    }
];
const STATS = [
    {
        icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$users$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Users$3e$__["Users"], {
            size: 20
        }, void 0, false, {
            fileName: "[project]/src/components/landing/LandingPage.tsx",
            lineNumber: 201,
            columnNumber: 11
        }, ("TURBOPACK compile-time value", void 0)),
        value: '2M+',
        label: 'Active Users',
        percent: 85,
        color: '#3b82f6'
    },
    {
        icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$globe$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Globe$3e$__["Globe"], {
            size: 20
        }, void 0, false, {
            fileName: "[project]/src/components/landing/LandingPage.tsx",
            lineNumber: 202,
            columnNumber: 11
        }, ("TURBOPACK compile-time value", void 0)),
        value: '100+',
        label: 'Languages',
        percent: 92,
        color: '#06b6d4'
    },
    {
        icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$chart$2d$column$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__BarChart3$3e$__["BarChart3"], {
            size: 20
        }, void 0, false, {
            fileName: "[project]/src/components/landing/LandingPage.tsx",
            lineNumber: 203,
            columnNumber: 11
        }, ("TURBOPACK compile-time value", void 0)),
        value: '99.2%',
        label: 'Accuracy',
        percent: 99,
        color: '#10b981'
    },
    {
        icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$clock$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Clock$3e$__["Clock"], {
            size: 20
        }, void 0, false, {
            fileName: "[project]/src/components/landing/LandingPage.tsx",
            lineNumber: 204,
            columnNumber: 11
        }, ("TURBOPACK compile-time value", void 0)),
        value: '<1s',
        label: 'Response Time',
        percent: 88,
        color: '#a855f7'
    }
];
const LandingPage = ()=>{
    _s1();
    const { user, setViewMode, setActiveTab, globalConfig, setIsAuthModalOpen, setAuthModalMode, logout, theme, toggleTheme } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$context$2f$AppContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useApp"])();
    const [isPlansModalOpen, setIsPlansModalOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [billingCycle, setBillingCycle] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("monthly");
    const [dbPlans, setDbPlans] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [mobileMenuOpen, setMobileMenuOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [londonTime, setLondonTime] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('');
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "LandingPage.useEffect": ()=>{
            fetch('/api/billing/plans').then({
                "LandingPage.useEffect": (res)=>res.json()
            }["LandingPage.useEffect"]).then({
                "LandingPage.useEffect": (data)=>{
                    if (Array.isArray(data) && data.length > 0) {
                        setDbPlans(data);
                    }
                }
            }["LandingPage.useEffect"]).catch({
                "LandingPage.useEffect": ()=>{}
            }["LandingPage.useEffect"]);
        }
    }["LandingPage.useEffect"], []);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "LandingPage.useEffect": ()=>{
            const updateTime = {
                "LandingPage.useEffect.updateTime": ()=>{
                    try {
                        const formatter = new Intl.DateTimeFormat('en-GB', {
                            timeZone: 'Europe/London',
                            hour: '2-digit',
                            minute: '2-digit',
                            hour12: false
                        });
                        setLondonTime(formatter.format(new Date()));
                    } catch (e) {
                        const d = new Date();
                        setLondonTime(`${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`);
                    }
                }
            }["LandingPage.useEffect.updateTime"];
            updateTime();
            const timer = setInterval(updateTime, 1000);
            return ({
                "LandingPage.useEffect": ()=>clearInterval(timer)
            })["LandingPage.useEffect"];
        }
    }["LandingPage.useEffect"], []);
    const launchTool = (tab)=>{
        setActiveTab(tab);
        if (user) logout(); // Wipe session to force re-login
        setAuthModalMode('login');
        setIsAuthModalOpen(true);
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("main", {
        id: "landing",
        className: "overflow-x-hidden relative min-h-screen text-slate-900 dark:text-slate-100",
        style: {
            background: 'var(--bg-base)'
        },
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                className: "relative min-h-screen h-[100vh] h-[100svh] flex flex-col justify-between overflow-hidden bg-[#EFEFEF] dark:bg-[#080d18] text-gray-900 dark:text-white border-b border-gray-200 dark:border-white/5",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$landing$2f$HeroShaderBackground$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["HeroShaderBackground"], {}, void 0, false, {
                        fileName: "[project]/src/components/landing/LandingPage.tsx",
                        lineNumber: 267,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("header", {
                        className: "relative z-20 w-full max-w-[1440px] mx-auto p-2 sm:p-3",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("nav", {
                            className: "bg-white dark:bg-slate-900 rounded-full p-[5px] shadow-md border border-slate-200 dark:border-white/10 flex items-center justify-between",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex items-center gap-3 pl-1",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            onClick: ()=>{
                                                if (user) logout();
                                                setAuthModalMode('login');
                                                setIsAuthModalOpen(true);
                                            },
                                            className: "flex items-center gap-2 cursor-pointer",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                                                    src: "/logo.png?v=3",
                                                    alt: "Logo",
                                                    className: "h-8 sm:h-9 md:h-10 w-auto object-contain hover:scale-105 dark:invert-0 dark:brightness-100 invert brightness-90 filter transition-all duration-200"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/landing/LandingPage.tsx",
                                                    lineNumber: 282,
                                                    columnNumber: 17
                                                }, ("TURBOPACK compile-time value", void 0)),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "font-extrabold text-sm sm:text-base tracking-tight text-gray-900 dark:text-white",
                                                    children: globalConfig?.branding?.platform_name || 'Fluentia'
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/landing/LandingPage.tsx",
                                                    lineNumber: 283,
                                                    columnNumber: 17
                                                }, ("TURBOPACK compile-time value", void 0))
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/landing/LandingPage.tsx",
                                            lineNumber: 274,
                                            columnNumber: 15
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "hidden md:flex items-center gap-6 text-[14px] font-medium text-gray-900 dark:text-gray-100 pl-4",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                                    href: "#ai-language-tools",
                                                    className: "hover:text-teal-600 dark:hover:text-teal-400 transition-colors duration-300",
                                                    children: "AI Tools"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/landing/LandingPage.tsx",
                                                    lineNumber: 288,
                                                    columnNumber: 17
                                                }, ("TURBOPACK compile-time value", void 0)),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                                    href: "#about-studio",
                                                    className: "hover:text-teal-600 dark:hover:text-teal-400 transition-colors duration-300",
                                                    children: "Capabilities"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/landing/LandingPage.tsx",
                                                    lineNumber: 289,
                                                    columnNumber: 17
                                                }, ("TURBOPACK compile-time value", void 0)),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                                    href: "#pricing",
                                                    className: "hover:text-teal-600 dark:hover:text-teal-400 transition-colors duration-300",
                                                    children: "Pricing"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/landing/LandingPage.tsx",
                                                    lineNumber: 290,
                                                    columnNumber: 17
                                                }, ("TURBOPACK compile-time value", void 0)),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                                    href: "#contact",
                                                    className: "hover:text-teal-600 dark:hover:text-teal-400 transition-colors duration-300",
                                                    children: "Contact"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/landing/LandingPage.tsx",
                                                    lineNumber: 291,
                                                    columnNumber: 17
                                                }, ("TURBOPACK compile-time value", void 0))
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/landing/LandingPage.tsx",
                                            lineNumber: 287,
                                            columnNumber: 15
                                        }, ("TURBOPACK compile-time value", void 0))
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/landing/LandingPage.tsx",
                                    lineNumber: 273,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "hidden md:flex items-center gap-3 pr-1",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            id: "landing-theme-toggle-btn",
                                            onClick: (e)=>{
                                                e.preventDefault();
                                                toggleTheme();
                                            },
                                            className: "flex h-8 w-8 items-center justify-center rounded-full transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer flex-shrink-0 bg-gray-100 dark:bg-white/10 text-gray-800 dark:text-gray-200 border border-gray-300 dark:border-white/15",
                                            title: theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode',
                                            "aria-label": "Toggle theme",
                                            children: theme === 'light' ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$moon$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Moon$3e$__["Moon"], {
                                                size: 16,
                                                className: "transition-transform duration-300 hover:rotate-12"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/landing/LandingPage.tsx",
                                                lineNumber: 307,
                                                columnNumber: 38
                                            }, ("TURBOPACK compile-time value", void 0)) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$sun$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Sun$3e$__["Sun"], {
                                                size: 16,
                                                className: "transition-transform duration-300 hover:rotate-45"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/landing/LandingPage.tsx",
                                                lineNumber: 307,
                                                columnNumber: 121
                                            }, ("TURBOPACK compile-time value", void 0))
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/landing/LandingPage.tsx",
                                            lineNumber: 297,
                                            columnNumber: 15
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(TextRollButton, {
                                            text: "Launch AI Workstation",
                                            onClick: ()=>{
                                                if (user) logout();
                                                setAuthModalMode('login');
                                                setIsAuthModalOpen(true);
                                            }
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/landing/LandingPage.tsx",
                                            lineNumber: 309,
                                            columnNumber: 15
                                        }, ("TURBOPACK compile-time value", void 0))
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/landing/LandingPage.tsx",
                                    lineNumber: 296,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: ()=>setMobileMenuOpen(!mobileMenuOpen),
                                    className: "md:hidden bg-gray-900 text-white rounded-full p-2.5 flex items-center justify-center",
                                    "aria-label": "Toggle menu",
                                    children: mobileMenuOpen ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__["X"], {
                                        size: 18
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/landing/LandingPage.tsx",
                                        lineNumber: 325,
                                        columnNumber: 33
                                    }, ("TURBOPACK compile-time value", void 0)) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$menu$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Menu$3e$__["Menu"], {
                                        size: 18
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/landing/LandingPage.tsx",
                                        lineNumber: 325,
                                        columnNumber: 51
                                    }, ("TURBOPACK compile-time value", void 0))
                                }, void 0, false, {
                                    fileName: "[project]/src/components/landing/LandingPage.tsx",
                                    lineNumber: 320,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0))
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/landing/LandingPage.tsx",
                            lineNumber: 271,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0))
                    }, void 0, false, {
                        fileName: "[project]/src/components/landing/LandingPage.tsx",
                        lineNumber: 270,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$components$2f$AnimatePresence$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AnimatePresence"], {
                        children: mobileMenuOpen && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].div, {
                            initial: {
                                opacity: 0
                            },
                            animate: {
                                opacity: 1
                            },
                            exit: {
                                opacity: 0
                            },
                            className: "fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex flex-col justify-end",
                            onClick: ()=>setMobileMenuOpen(false),
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].div, {
                                initial: {
                                    y: "100%"
                                },
                                animate: {
                                    y: 0
                                },
                                exit: {
                                    y: "100%"
                                },
                                transition: {
                                    duration: 0.5,
                                    ease: [
                                        0.32,
                                        0.72,
                                        0,
                                        1
                                    ]
                                },
                                onClick: (e)=>e.stopPropagation(),
                                className: "bg-white dark:bg-slate-900 rounded-2xl mx-3 mb-3 p-6 shadow-2xl space-y-6",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex items-center justify-between border-b border-gray-100 dark:border-white/10 pb-4",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "text-xs font-bold text-gray-400 uppercase tracking-wider",
                                                children: "Navigation"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/landing/LandingPage.tsx",
                                                lineNumber: 349,
                                                columnNumber: 19
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex items-center gap-3",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                        onClick: ()=>toggleTheme(),
                                                        className: "flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 dark:bg-white/10 text-gray-800 dark:text-gray-200 border border-gray-300 dark:border-white/15",
                                                        "aria-label": "Toggle theme",
                                                        children: theme === 'light' ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$moon$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Moon$3e$__["Moon"], {
                                                            size: 16
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/landing/LandingPage.tsx",
                                                            lineNumber: 356,
                                                            columnNumber: 44
                                                        }, ("TURBOPACK compile-time value", void 0)) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$sun$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Sun$3e$__["Sun"], {
                                                            size: 16
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/landing/LandingPage.tsx",
                                                            lineNumber: 356,
                                                            columnNumber: 65
                                                        }, ("TURBOPACK compile-time value", void 0))
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/landing/LandingPage.tsx",
                                                        lineNumber: 351,
                                                        columnNumber: 21
                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                        onClick: ()=>setMobileMenuOpen(false),
                                                        className: "text-gray-500",
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__["X"], {
                                                            size: 20
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/landing/LandingPage.tsx",
                                                            lineNumber: 359,
                                                            columnNumber: 23
                                                        }, ("TURBOPACK compile-time value", void 0))
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/landing/LandingPage.tsx",
                                                        lineNumber: 358,
                                                        columnNumber: 21
                                                    }, ("TURBOPACK compile-time value", void 0))
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/components/landing/LandingPage.tsx",
                                                lineNumber: 350,
                                                columnNumber: 19
                                            }, ("TURBOPACK compile-time value", void 0))
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/landing/LandingPage.tsx",
                                        lineNumber: 348,
                                        columnNumber: 17
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex flex-col space-y-4 text-[28px] font-medium text-gray-900 dark:text-white",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                                href: "#ai-language-tools",
                                                onClick: ()=>setMobileMenuOpen(false),
                                                children: "AI Tools"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/landing/LandingPage.tsx",
                                                lineNumber: 364,
                                                columnNumber: 19
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                                href: "#about-studio",
                                                onClick: ()=>setMobileMenuOpen(false),
                                                children: "Capabilities"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/landing/LandingPage.tsx",
                                                lineNumber: 365,
                                                columnNumber: 19
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                                href: "#pricing",
                                                onClick: ()=>setMobileMenuOpen(false),
                                                children: "Pricing"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/landing/LandingPage.tsx",
                                                lineNumber: 366,
                                                columnNumber: 19
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                                href: "#contact",
                                                onClick: ()=>setMobileMenuOpen(false),
                                                children: "Contact"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/landing/LandingPage.tsx",
                                                lineNumber: 367,
                                                columnNumber: 19
                                            }, ("TURBOPACK compile-time value", void 0))
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/landing/LandingPage.tsx",
                                        lineNumber: 363,
                                        columnNumber: 17
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(TextRollButton, {
                                        text: "Launch AI Workstation",
                                        bgClass: "bg-[#F26522] hover:bg-[#e05a1a] text-white w-full justify-between",
                                        arrowColorClass: "text-[#F26522]",
                                        onClick: ()=>{
                                            setMobileMenuOpen(false);
                                            if (user) logout();
                                            setAuthModalMode('login');
                                            setIsAuthModalOpen(true);
                                        }
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/landing/LandingPage.tsx",
                                        lineNumber: 369,
                                        columnNumber: 17
                                    }, ("TURBOPACK compile-time value", void 0))
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/landing/LandingPage.tsx",
                                lineNumber: 340,
                                columnNumber: 15
                            }, ("TURBOPACK compile-time value", void 0))
                        }, void 0, false, {
                            fileName: "[project]/src/components/landing/LandingPage.tsx",
                            lineNumber: 333,
                            columnNumber: 13
                        }, ("TURBOPACK compile-time value", void 0))
                    }, void 0, false, {
                        fileName: "[project]/src/components/landing/LandingPage.tsx",
                        lineNumber: 331,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "relative z-20 max-w-[1440px] w-full mx-auto px-5 sm:px-8 lg:px-12 pb-14 sm:pb-16 lg:pb-20 flex-1 flex flex-col justify-end",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-[13px] sm:text-[14px] text-gray-900 dark:text-gray-100 tracking-wide font-semibold mb-5 sm:mb-8 uppercase",
                                children: [
                                    "[ ",
                                    globalConfig?.branding?.platform_name || 'Fluentia',
                                    " LANGUAGE PLATFORM ]"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/landing/LandingPage.tsx",
                                lineNumber: 387,
                                columnNumber: 11
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                                className: "text-[clamp(1.75rem,7vw,4.2rem)] sm:text-[clamp(2.5rem,5vw,4.2rem)] font-medium leading-[1.08] tracking-[-0.03em] text-gray-900 dark:text-white max-w-5xl",
                                children: [
                                    globalConfig?.branding?.platform_name || 'Fluentia',
                                    " — Next-Gen",
                                    ' ',
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("br", {
                                        className: "hidden sm:block"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/landing/LandingPage.tsx",
                                        lineNumber: 393,
                                        columnNumber: 13
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "sm:hidden",
                                        children: " "
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/landing/LandingPage.tsx",
                                        lineNumber: 394,
                                        columnNumber: 13
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    "AI Language Platform for Voice,",
                                    ' ',
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("br", {
                                        className: "hidden sm:block"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/landing/LandingPage.tsx",
                                        lineNumber: 396,
                                        columnNumber: 13
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "sm:hidden",
                                        children: " "
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/landing/LandingPage.tsx",
                                        lineNumber: 397,
                                        columnNumber: 13
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    "Speech & Real-Time Translation."
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/landing/LandingPage.tsx",
                                lineNumber: 391,
                                columnNumber: 11
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "mt-4 text-sm sm:text-base text-gray-700 dark:text-gray-300 max-w-2xl font-medium leading-relaxed",
                                children: "Local client-side Whisper transcription, multi-speaker neural voice synthesis, and zero-latency document translation loaded into a high-performance desktop workstation."
                            }, void 0, false, {
                                fileName: "[project]/src/components/landing/LandingPage.tsx",
                                lineNumber: 401,
                                columnNumber: 11
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "mt-8 sm:mt-10 flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-5",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(TextRollButton, {
                                        text: "Launch AI Workstation",
                                        bgClass: "bg-[#F26522] hover:bg-[#e05a1a] text-white",
                                        arrowColorClass: "text-[#F26522]",
                                        paddingClass: "pl-5 sm:pl-6 pr-2 py-2",
                                        onClick: ()=>{
                                            if (user) logout();
                                            setAuthModalMode('login');
                                            setIsAuthModalOpen(true);
                                        }
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/landing/LandingPage.tsx",
                                        lineNumber: 406,
                                        columnNumber: 13
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "bg-white dark:bg-slate-900 rounded-[4px] px-3.5 py-2 flex items-center gap-2 border border-slate-200 dark:border-white/10 shadow-[0_2px_8px_rgba(0,0,0,0.08)] hover:shadow-[0_4px_16px_rgba(0,0,0,0.12)] transition-shadow duration-300 cursor-pointer",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(StarburstIcon, {}, void 0, false, {
                                                fileName: "[project]/src/components/landing/LandingPage.tsx",
                                                lineNumber: 419,
                                                columnNumber: 15
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "text-[13px] sm:text-[14px] font-medium text-gray-900 dark:text-white",
                                                children: "Certified AI Engine"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/landing/LandingPage.tsx",
                                                lineNumber: 420,
                                                columnNumber: 15
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "text-[10px] sm:text-[11px] font-bold bg-gray-900 text-white px-1.5 sm:px-2 py-0.5 rounded ml-1",
                                                children: "v2.4 Active"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/landing/LandingPage.tsx",
                                                lineNumber: 423,
                                                columnNumber: 15
                                            }, ("TURBOPACK compile-time value", void 0))
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/landing/LandingPage.tsx",
                                        lineNumber: 418,
                                        columnNumber: 13
                                    }, ("TURBOPACK compile-time value", void 0))
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/landing/LandingPage.tsx",
                                lineNumber: 405,
                                columnNumber: 11
                            }, ("TURBOPACK compile-time value", void 0))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/landing/LandingPage.tsx",
                        lineNumber: 386,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/landing/LandingPage.tsx",
                lineNumber: 264,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                id: "about-studio",
                className: "bg-white dark:bg-[#030712] pt-16 sm:pt-20 lg:pt-32 pb-12 sm:pb-16 lg:pb-24 overflow-hidden border-b border-gray-100 dark:border-white/5",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "max-w-[1440px] mx-auto",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "px-5 sm:px-8 lg:px-12 flex items-center gap-3 mb-6 sm:mb-8",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-gray-900 text-white text-[11px] sm:text-[12px] font-semibold flex items-center justify-center",
                                    children: "1"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/landing/LandingPage.tsx",
                                    lineNumber: 436,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "text-[12px] sm:text-[13px] font-medium border border-gray-200 dark:border-white/10 text-gray-900 dark:text-gray-100 rounded-full px-3 sm:px-4 py-1 sm:py-1.5",
                                    children: [
                                        "Introducing ",
                                        globalConfig?.branding?.platform_name || 'Fluentia',
                                        " Engine"
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/landing/LandingPage.tsx",
                                    lineNumber: 439,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0))
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/landing/LandingPage.tsx",
                            lineNumber: 435,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                            className: "text-[clamp(1.5rem,4vw,3.2rem)] font-medium leading-[1.12] tracking-[-0.02em] text-gray-900 dark:text-white mb-12 sm:mb-16 lg:mb-28 px-5 sm:px-8 lg:px-12",
                            children: [
                                "Neural speech processing, delivering",
                                ' ',
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("br", {
                                    className: "hidden sm:block"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/landing/LandingPage.tsx",
                                    lineNumber: 447,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0)),
                                "unmatched accuracy across 100+ languages."
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/landing/LandingPage.tsx",
                            lineNumber: 445,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "hidden lg:grid grid-cols-[26%_1fr_48%] items-end gap-6 xl:gap-8 px-5 sm:px-8 lg:px-12",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "self-end overflow-hidden rounded-2xl aspect-[438/346] shadow-lg group",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                                        src: "https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260516_090123_74be96d4-9c1b-40cf-932a-96f4f4babed3.png&w=1280&q=85",
                                        alt: "AI Speech Intelligence",
                                        className: "w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/landing/LandingPage.tsx",
                                        lineNumber: 455,
                                        columnNumber: 15
                                    }, ("TURBOPACK compile-time value", void 0))
                                }, void 0, false, {
                                    fileName: "[project]/src/components/landing/LandingPage.tsx",
                                    lineNumber: 454,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "self-start flex flex-col justify-end items-start pb-2",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "text-[16px] xl:text-[18px] leading-[1.65] font-medium text-gray-900 dark:text-gray-200 mb-6",
                                            children: [
                                                "Through deep learning models, ",
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("br", {}, void 0, false, {
                                                    fileName: "[project]/src/components/landing/LandingPage.tsx",
                                                    lineNumber: 465,
                                                    columnNumber: 47
                                                }, ("TURBOPACK compile-time value", void 0)),
                                                "client-side Whisper processing, and ",
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("br", {}, void 0, false, {
                                                    fileName: "[project]/src/components/landing/LandingPage.tsx",
                                                    lineNumber: 466,
                                                    columnNumber: 53
                                                }, ("TURBOPACK compile-time value", void 0)),
                                                "neural voice cloning, we empower global teams."
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/landing/LandingPage.tsx",
                                            lineNumber: 464,
                                            columnNumber: 15
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(TextRollButton, {
                                            text: "Explore AI Modules",
                                            bgClass: "bg-[#F26522] hover:bg-[#e05a1a] text-white",
                                            arrowColorClass: "text-[#F26522]",
                                            onClick: ()=>document.getElementById('ai-language-tools')?.scrollIntoView({
                                                    behavior: 'smooth'
                                                })
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/landing/LandingPage.tsx",
                                            lineNumber: 469,
                                            columnNumber: 15
                                        }, ("TURBOPACK compile-time value", void 0))
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/landing/LandingPage.tsx",
                                    lineNumber: 463,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "self-end overflow-hidden rounded-2xl aspect-[3/2] shadow-lg group",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                                        src: "https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260516_090133_c157d30b-a99a-4477-bec1-a446149ec3f2.png&w=1280&q=85",
                                        alt: "Language Workstation",
                                        className: "w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/landing/LandingPage.tsx",
                                        lineNumber: 479,
                                        columnNumber: 15
                                    }, ("TURBOPACK compile-time value", void 0))
                                }, void 0, false, {
                                    fileName: "[project]/src/components/landing/LandingPage.tsx",
                                    lineNumber: 478,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0))
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/landing/LandingPage.tsx",
                            lineNumber: 452,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "lg:hidden px-5 sm:px-8 space-y-8",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "text-[15px] sm:text-[17px] leading-[1.6] font-medium text-gray-900 dark:text-gray-200",
                                    children: "Through deep learning models, client-side Whisper processing, and neural voice cloning, we empower global teams to automate language workflows."
                                }, void 0, false, {
                                    fileName: "[project]/src/components/landing/LandingPage.tsx",
                                    lineNumber: 489,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(TextRollButton, {
                                    text: "Explore AI Modules",
                                    bgClass: "bg-[#F26522] hover:bg-[#e05a1a] text-white",
                                    arrowColorClass: "text-[#F26522]",
                                    onClick: ()=>document.getElementById('ai-language-tools')?.scrollIntoView({
                                            behavior: 'smooth'
                                        })
                                }, void 0, false, {
                                    fileName: "[project]/src/components/landing/LandingPage.tsx",
                                    lineNumber: 492,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex flex-col sm:flex-row gap-4 sm:gap-5 pt-4",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "sm:w-[45%] aspect-[438/346] rounded-xl sm:rounded-2xl overflow-hidden shadow-md",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                                                src: "https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260516_090123_74be96d4-9c1b-40cf-932a-96f4f4babed3.png&w=1280&q=85",
                                                alt: "AI Speech Intelligence",
                                                className: "w-full h-full object-cover"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/landing/LandingPage.tsx",
                                                lineNumber: 500,
                                                columnNumber: 17
                                            }, ("TURBOPACK compile-time value", void 0))
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/landing/LandingPage.tsx",
                                            lineNumber: 499,
                                            columnNumber: 15
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "sm:w-[55%] aspect-[900/600] rounded-xl sm:rounded-2xl overflow-hidden shadow-md",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                                                src: "https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260516_090133_c157d30b-a99a-4477-bec1-a446149ec3f2.png&w=1280&q=85",
                                                alt: "Language Workstation",
                                                className: "w-full h-full object-cover"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/landing/LandingPage.tsx",
                                                lineNumber: 507,
                                                columnNumber: 17
                                            }, ("TURBOPACK compile-time value", void 0))
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/landing/LandingPage.tsx",
                                            lineNumber: 506,
                                            columnNumber: 15
                                        }, ("TURBOPACK compile-time value", void 0))
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/landing/LandingPage.tsx",
                                    lineNumber: 498,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0))
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/landing/LandingPage.tsx",
                            lineNumber: 488,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0))
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/landing/LandingPage.tsx",
                    lineNumber: 433,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0))
            }, void 0, false, {
                fileName: "[project]/src/components/landing/LandingPage.tsx",
                lineNumber: 432,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                id: "ai-language-tools",
                className: "bg-[#F5F5F5] dark:bg-[#090f1d] pt-16 sm:pt-20 lg:pt-28 pb-16 sm:pb-20 lg:pb-28",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "max-w-[1440px] mx-auto",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "px-5 sm:px-8 lg:px-12 flex items-center gap-3 mb-6 sm:mb-8",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-gray-900 text-white text-[11px] sm:text-[12px] font-semibold flex items-center justify-center",
                                    children: "2"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/landing/LandingPage.tsx",
                                    lineNumber: 523,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "text-[12px] sm:text-[13px] font-medium border border-gray-300 dark:border-white/10 text-gray-900 dark:text-gray-100 rounded-full px-3 sm:px-4 py-1 sm:py-1.5",
                                    children: "Featured AI Workstations"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/landing/LandingPage.tsx",
                                    lineNumber: 526,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0))
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/landing/LandingPage.tsx",
                            lineNumber: 522,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                            className: "text-[clamp(1.75rem,7vw,4.2rem)] sm:text-[clamp(2.5rem,5vw,4.2rem)] font-medium leading-[1.08] tracking-[-0.03em] text-gray-900 dark:text-white mb-10 sm:mb-14 lg:mb-16 px-5 sm:px-8 lg:px-12",
                            children: "Our AI Modules"
                        }, void 0, false, {
                            fileName: "[project]/src/components/landing/LandingPage.tsx",
                            lineNumber: 532,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6 lg:gap-7 px-5 sm:px-8 lg:px-12",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex flex-col group cursor-pointer",
                                    onClick: ()=>launchTool('voice-to-text'),
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "aspect-[329/246] rounded-2xl overflow-hidden bg-[#1a1d2e] relative shadow-md",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("video", {
                                                    src: "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260516_122702_390f5305-8719-41d5-ae80-d23ab3796c28.mp4",
                                                    autoPlay: true,
                                                    muted: true,
                                                    loop: true,
                                                    playsInline: true,
                                                    className: "w-full h-full object-cover"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/landing/LandingPage.tsx",
                                                    lineNumber: 542,
                                                    columnNumber: 17
                                                }, ("TURBOPACK compile-time value", void 0)),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "absolute bottom-4 left-4 h-9 w-9 group-hover:w-[154px] rounded-full bg-white shadow-lg flex items-center justify-between px-2.5 transition-all duration-300 ease-in-out overflow-hidden z-20",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: "text-[13px] font-medium text-gray-900 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 delay-100",
                                                            children: "Launch Voice AI"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/landing/LandingPage.tsx",
                                                            lineNumber: 553,
                                                            columnNumber: 19
                                                        }, ("TURBOPACK compile-time value", void 0)),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                                            className: "w-3.5 h-3.5 text-gray-900 transform -rotate-45 group-hover:rotate-0 transition-transform duration-300 shrink-0",
                                                            viewBox: "0 0 24 24",
                                                            fill: "none",
                                                            stroke: "currentColor",
                                                            strokeWidth: "2.5",
                                                            strokeLinecap: "round",
                                                            strokeLinejoin: "round",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                                    d: "M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/components/landing/LandingPage.tsx",
                                                                    lineNumber: 557,
                                                                    columnNumber: 21
                                                                }, ("TURBOPACK compile-time value", void 0)),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                                    d: "M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/components/landing/LandingPage.tsx",
                                                                    lineNumber: 558,
                                                                    columnNumber: 21
                                                                }, ("TURBOPACK compile-time value", void 0))
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/components/landing/LandingPage.tsx",
                                                            lineNumber: 556,
                                                            columnNumber: 19
                                                        }, ("TURBOPACK compile-time value", void 0))
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/components/landing/LandingPage.tsx",
                                                    lineNumber: 552,
                                                    columnNumber: 17
                                                }, ("TURBOPACK compile-time value", void 0))
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/landing/LandingPage.tsx",
                                            lineNumber: 541,
                                            columnNumber: 15
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "text-[13px] sm:text-[14px] text-gray-600 dark:text-gray-400 mt-4 leading-relaxed",
                                            children: "Real-time client-side speech recognition with automatic timestamp alignment and multi-speaker detection."
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/landing/LandingPage.tsx",
                                            lineNumber: 562,
                                            columnNumber: 15
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                            className: "text-[14px] sm:text-[15px] font-semibold text-gray-900 dark:text-white mt-1",
                                            children: "Voice-to-Text & Audio Transcription"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/landing/LandingPage.tsx",
                                            lineNumber: 565,
                                            columnNumber: 15
                                        }, ("TURBOPACK compile-time value", void 0))
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/landing/LandingPage.tsx",
                                    lineNumber: 540,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex flex-col group cursor-pointer",
                                    onClick: ()=>launchTool('translation'),
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "aspect-square rounded-2xl overflow-hidden bg-[#6b6b6b] relative shadow-md",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("video", {
                                                    src: "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260516_123323_f909c2b8-ff6c-4edf-882b-8ebcdbe389b5.mp4",
                                                    autoPlay: true,
                                                    muted: true,
                                                    loop: true,
                                                    playsInline: true,
                                                    className: "w-full h-full object-cover"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/landing/LandingPage.tsx",
                                                    lineNumber: 573,
                                                    columnNumber: 17
                                                }, ("TURBOPACK compile-time value", void 0)),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "absolute bottom-4 left-4 h-9 w-9 group-hover:w-[168px] rounded-full bg-gray-900 text-white shadow-lg flex items-center justify-between px-2.5 transition-all duration-300 ease-in-out overflow-hidden z-20",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: "text-[13px] font-medium text-white whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 delay-100",
                                                            children: "Launch Translator"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/landing/LandingPage.tsx",
                                                            lineNumber: 584,
                                                            columnNumber: 19
                                                        }, ("TURBOPACK compile-time value", void 0)),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$right$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowRight$3e$__["ArrowRight"], {
                                                            size: 14,
                                                            className: "text-white transform -rotate-45 group-hover:rotate-0 transition-transform duration-300 shrink-0"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/landing/LandingPage.tsx",
                                                            lineNumber: 587,
                                                            columnNumber: 19
                                                        }, ("TURBOPACK compile-time value", void 0))
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/components/landing/LandingPage.tsx",
                                                    lineNumber: 583,
                                                    columnNumber: 17
                                                }, ("TURBOPACK compile-time value", void 0))
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/landing/LandingPage.tsx",
                                            lineNumber: 572,
                                            columnNumber: 15
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "text-[13px] sm:text-[14px] text-gray-600 dark:text-gray-400 mt-4 leading-relaxed",
                                            children: "Neural machine translation supporting 100+ global languages with formatting retention and speech playback."
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/landing/LandingPage.tsx",
                                            lineNumber: 590,
                                            columnNumber: 15
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                            className: "text-[14px] sm:text-[15px] font-semibold text-gray-900 dark:text-white mt-1",
                                            children: "Real-Time Multi-Lingual Translation"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/landing/LandingPage.tsx",
                                            lineNumber: 593,
                                            columnNumber: 15
                                        }, ("TURBOPACK compile-time value", void 0))
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/landing/LandingPage.tsx",
                                    lineNumber: 571,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0))
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/landing/LandingPage.tsx",
                            lineNumber: 537,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0))
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/landing/LandingPage.tsx",
                    lineNumber: 520,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0))
            }, void 0, false, {
                fileName: "[project]/src/components/landing/LandingPage.tsx",
                lineNumber: 519,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                className: "relative py-8 px-4",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "mx-auto max-w-7xl",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4",
                        children: STATS.map((s)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(ThreeDInteractiveCard, {
                                glowColor: `color-mix(in srgb, ${s.color} 20%, transparent)`,
                                className: "p-6 cursor-default",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex justify-between items-start mb-4",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "p-3 rounded-2xl flex items-center justify-center text-white",
                                                style: {
                                                    background: s.color
                                                },
                                                children: s.icon
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/landing/LandingPage.tsx",
                                                lineNumber: 615,
                                                columnNumber: 19
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                                className: "w-10 h-10 rotate-[-90deg]",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("circle", {
                                                        cx: "20",
                                                        cy: "20",
                                                        r: "16",
                                                        fill: "transparent",
                                                        stroke: "var(--border-base)",
                                                        strokeWidth: "3"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/landing/LandingPage.tsx",
                                                        lineNumber: 623,
                                                        columnNumber: 21
                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].circle, {
                                                        cx: "20",
                                                        cy: "20",
                                                        r: "16",
                                                        fill: "transparent",
                                                        stroke: s.color,
                                                        strokeWidth: "3",
                                                        strokeDasharray: 100,
                                                        initial: {
                                                            strokeDashoffset: 100
                                                        },
                                                        whileInView: {
                                                            strokeDashoffset: 100 - s.percent
                                                        },
                                                        viewport: {
                                                            once: true
                                                        },
                                                        transition: {
                                                            duration: 1.2,
                                                            ease: 'easeOut'
                                                        }
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/landing/LandingPage.tsx",
                                                        lineNumber: 624,
                                                        columnNumber: 21
                                                    }, ("TURBOPACK compile-time value", void 0))
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/components/landing/LandingPage.tsx",
                                                lineNumber: 622,
                                                columnNumber: 19
                                            }, ("TURBOPACK compile-time value", void 0))
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/landing/LandingPage.tsx",
                                        lineNumber: 614,
                                        columnNumber: 17
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "font-display text-3xl font-black tracking-tight text-slate-900 dark:text-white mb-0.5",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$landing$2f$AnimatedCounter$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AnimatedCounter"], {
                                            value: s.value
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/landing/LandingPage.tsx",
                                            lineNumber: 636,
                                            columnNumber: 19
                                        }, ("TURBOPACK compile-time value", void 0))
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/landing/LandingPage.tsx",
                                        lineNumber: 635,
                                        columnNumber: 17
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "text-[10px] font-extrabold tracking-wider uppercase text-slate-700 dark:text-slate-400",
                                        children: s.label
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/landing/LandingPage.tsx",
                                        lineNumber: 638,
                                        columnNumber: 17
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "mt-4 pt-3 border-t border-[#DDE5F0] dark:border-white/5 flex items-center justify-between text-[9px] text-slate-500 dark:text-slate-400 font-bold",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                children: "Engine accuracy rate"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/landing/LandingPage.tsx",
                                                lineNumber: 642,
                                                columnNumber: 19
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "text-emerald-600 dark:text-emerald-400",
                                                children: "Stable"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/landing/LandingPage.tsx",
                                                lineNumber: 643,
                                                columnNumber: 19
                                            }, ("TURBOPACK compile-time value", void 0))
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/landing/LandingPage.tsx",
                                        lineNumber: 641,
                                        columnNumber: 17
                                    }, ("TURBOPACK compile-time value", void 0))
                                ]
                            }, s.label, true, {
                                fileName: "[project]/src/components/landing/LandingPage.tsx",
                                lineNumber: 609,
                                columnNumber: 15
                            }, ("TURBOPACK compile-time value", void 0)))
                    }, void 0, false, {
                        fileName: "[project]/src/components/landing/LandingPage.tsx",
                        lineNumber: 607,
                        columnNumber: 11
                    }, ("TURBOPACK compile-time value", void 0))
                }, void 0, false, {
                    fileName: "[project]/src/components/landing/LandingPage.tsx",
                    lineNumber: 606,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0))
            }, void 0, false, {
                fileName: "[project]/src/components/landing/LandingPage.tsx",
                lineNumber: 605,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                id: "about",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                        className: "py-10 px-4 relative overflow-hidden",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "mx-auto max-w-5xl",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "mb-14 text-center",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                            className: "font-display text-3xl sm:text-5xl font-extrabold text-slate-900 dark:text-white",
                                            children: [
                                                "Interactive AI",
                                                ' ',
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "bg-gradient-to-r from-teal-600 to-emerald-600 dark:from-teal-400 dark:to-emerald-400 bg-clip-text text-transparent font-black",
                                                    children: "Process Flow"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/landing/LandingPage.tsx",
                                                    lineNumber: 662,
                                                    columnNumber: 15
                                                }, ("TURBOPACK compile-time value", void 0))
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/landing/LandingPage.tsx",
                                            lineNumber: 660,
                                            columnNumber: 13
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "mx-auto mt-3 max-w-xl text-xs sm:text-sm text-slate-700 dark:text-slate-300 font-semibold",
                                            children: "Watch your voice files transform inside our client-side pipelines. Minimal network latencies, complete privacy."
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/landing/LandingPage.tsx",
                                            lineNumber: 666,
                                            columnNumber: 13
                                        }, ("TURBOPACK compile-time value", void 0))
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/landing/LandingPage.tsx",
                                    lineNumber: 659,
                                    columnNumber: 11
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "relative grid gap-6 sm:grid-cols-2 lg:grid-cols-4",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "pointer-events-none absolute top-12 left-[12%] hidden h-0.5 w-[76%] lg:block",
                                            style: {
                                                background: 'linear-gradient(to right, #14b8a6, #0d9488, #10b981, #059669)'
                                            }
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/landing/LandingPage.tsx",
                                            lineNumber: 674,
                                            columnNumber: 13
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        [
                                            {
                                                idx: '01',
                                                title: 'Input Capture',
                                                desc: 'Speak, type, or drag-and-drop raw audio streams directly inside the web browser.',
                                                icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$mic$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Mic$3e$__["Mic"], {
                                                    size: 16
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/landing/LandingPage.tsx",
                                                    lineNumber: 678,
                                                    columnNumber: 148
                                                }, ("TURBOPACK compile-time value", void 0))
                                            },
                                            {
                                                idx: '02',
                                                title: 'AI Processing',
                                                desc: 'Our ONNX runtime extracts acoustic spectrogram parameters locally.',
                                                icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$server$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Server$3e$__["Server"], {
                                                    size: 16
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/landing/LandingPage.tsx",
                                                    lineNumber: 679,
                                                    columnNumber: 134
                                                }, ("TURBOPACK compile-time value", void 0))
                                            },
                                            {
                                                idx: '03',
                                                title: 'Neural Translation',
                                                desc: 'Transformers map tokens and semantic fields into target accent dictionaries.',
                                                icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$languages$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Languages$3e$__["Languages"], {
                                                    size: 16
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/landing/LandingPage.tsx",
                                                    lineNumber: 680,
                                                    columnNumber: 149
                                                }, ("TURBOPACK compile-time value", void 0))
                                            },
                                            {
                                                idx: '04',
                                                title: 'Output Generation',
                                                desc: 'Export formatted transcripts, download MP3 synthesis, or copy translations.',
                                                icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$plus$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Plus$3e$__["Plus"], {
                                                    size: 16
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/landing/LandingPage.tsx",
                                                    lineNumber: 681,
                                                    columnNumber: 147
                                                }, ("TURBOPACK compile-time value", void 0))
                                            }
                                        ].map((w)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(ThreeDInteractiveCard, {
                                                glowColor: "rgba(168, 85, 247, 0.12)",
                                                className: "p-5",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "flex justify-between items-start mb-4",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "flex h-9 w-9 items-center justify-center rounded-xl text-white font-display text-sm font-black shadow-lg",
                                                                style: {
                                                                    background: 'linear-gradient(135deg, #14b8a6, #10b981)'
                                                                },
                                                                children: w.idx
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/components/landing/LandingPage.tsx",
                                                                lineNumber: 689,
                                                                columnNumber: 19
                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "text-slate-600 dark:text-slate-400 group-hover:scale-105 transition-transform",
                                                                children: w.icon
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/components/landing/LandingPage.tsx",
                                                                lineNumber: 693,
                                                                columnNumber: 19
                                                            }, ("TURBOPACK compile-time value", void 0))
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/components/landing/LandingPage.tsx",
                                                        lineNumber: 688,
                                                        columnNumber: 17
                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                        className: "mb-2 font-bold text-slate-900 dark:text-white text-base",
                                                        children: w.title
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/landing/LandingPage.tsx",
                                                        lineNumber: 695,
                                                        columnNumber: 17
                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                        className: "text-xs leading-relaxed text-slate-700 dark:text-slate-300 font-semibold",
                                                        children: w.desc
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/landing/LandingPage.tsx",
                                                        lineNumber: 696,
                                                        columnNumber: 17
                                                    }, ("TURBOPACK compile-time value", void 0))
                                                ]
                                            }, w.idx, true, {
                                                fileName: "[project]/src/components/landing/LandingPage.tsx",
                                                lineNumber: 683,
                                                columnNumber: 15
                                            }, ("TURBOPACK compile-time value", void 0)))
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/landing/LandingPage.tsx",
                                    lineNumber: 671,
                                    columnNumber: 11
                                }, ("TURBOPACK compile-time value", void 0))
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/landing/LandingPage.tsx",
                            lineNumber: 657,
                            columnNumber: 9
                        }, ("TURBOPACK compile-time value", void 0))
                    }, void 0, false, {
                        fileName: "[project]/src/components/landing/LandingPage.tsx",
                        lineNumber: 656,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                        className: "py-10 px-4 relative",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "mx-auto max-w-6xl",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "mb-14 text-center",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                            className: "font-display text-3xl sm:text-5xl font-extrabold text-slate-900 dark:text-white",
                                            children: [
                                                "Enterprise",
                                                ' ',
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "bg-gradient-to-r from-teal-600 to-emerald-600 dark:from-teal-400 dark:to-emerald-400 bg-clip-text text-transparent font-black",
                                                    children: "Infrastructure"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/landing/LandingPage.tsx",
                                                    lineNumber: 713,
                                                    columnNumber: 15
                                                }, ("TURBOPACK compile-time value", void 0))
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/landing/LandingPage.tsx",
                                            lineNumber: 711,
                                            columnNumber: 13
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "mx-auto mt-4 max-w-xl text-xs sm:text-sm text-slate-700 dark:text-slate-300 font-semibold",
                                            children: "Engineered with modern browser compilation tools for maximum execution efficiency."
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/landing/LandingPage.tsx",
                                            lineNumber: 717,
                                            columnNumber: 13
                                        }, ("TURBOPACK compile-time value", void 0))
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/landing/LandingPage.tsx",
                                    lineNumber: 710,
                                    columnNumber: 11
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
                                    children: [
                                        {
                                            icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$zap$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Zap$3e$__["Zap"], {
                                                size: 18
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/landing/LandingPage.tsx",
                                                lineNumber: 724,
                                                columnNumber: 23
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            title: 'Sub-Second Latencies',
                                            desc: 'Localized models process acoustic pipelines with zero routing handshakes.',
                                            color: '#f59e0b'
                                        },
                                        {
                                            icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$shield$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Shield$3e$__["Shield"], {
                                                size: 18
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/landing/LandingPage.tsx",
                                                lineNumber: 725,
                                                columnNumber: 23
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            title: 'Privacy Sandbox',
                                            desc: 'Executes safely on device. No voice data or documents ever leave your machine.',
                                            color: '#10b981'
                                        },
                                        {
                                            icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$globe$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Globe$3e$__["Globe"], {
                                                size: 18
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/landing/LandingPage.tsx",
                                                lineNumber: 726,
                                                columnNumber: 23
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            title: 'Global Translations',
                                            desc: 'Integrated transformer networks support regional dialects and Tamil accents.',
                                            color: '#3b82f6'
                                        },
                                        {
                                            icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$headphones$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Headphones$3e$__["Headphones"], {
                                                size: 18
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/landing/LandingPage.tsx",
                                                lineNumber: 727,
                                                columnNumber: 23
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            title: 'Speech Intonation',
                                            desc: 'Diverse presets simulate human prosody, volume waves, and intonations.',
                                            color: '#a855f7'
                                        },
                                        {
                                            icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$database$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Database$3e$__["Database"], {
                                                size: 18
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/landing/LandingPage.tsx",
                                                lineNumber: 728,
                                                columnNumber: 23
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            title: 'Zero Cache Logging',
                                            desc: 'No accounts, cookies, or credentials are required. Load the URL and work.',
                                            color: '#f97316'
                                        },
                                        {
                                            icon: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$file$2d$code$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__FileCode$3e$__["FileCode"], {
                                                size: 18
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/landing/LandingPage.tsx",
                                                lineNumber: 729,
                                                columnNumber: 23
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            title: 'ONNX Accelerations',
                                            desc: 'Uses WASM assembly vectors to run models at native GPU/CPU limits.',
                                            color: '#ec4899'
                                        }
                                    ].map((feat)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(ThreeDInteractiveCard, {
                                            glowColor: `color-mix(in srgb, ${feat.color} 18%, transparent)`,
                                            className: "p-5",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "mb-4 flex h-9 w-9 items-center justify-center rounded-xl text-white shadow",
                                                    style: {
                                                        background: feat.color
                                                    },
                                                    children: feat.icon
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/landing/LandingPage.tsx",
                                                    lineNumber: 736,
                                                    columnNumber: 17
                                                }, ("TURBOPACK compile-time value", void 0)),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                    className: "mb-1.5 font-bold text-slate-900 dark:text-white text-base",
                                                    children: feat.title
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/landing/LandingPage.tsx",
                                                    lineNumber: 740,
                                                    columnNumber: 17
                                                }, ("TURBOPACK compile-time value", void 0)),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                    className: "text-xs leading-relaxed text-slate-700 dark:text-slate-300 font-semibold",
                                                    children: feat.desc
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/landing/LandingPage.tsx",
                                                    lineNumber: 741,
                                                    columnNumber: 17
                                                }, ("TURBOPACK compile-time value", void 0))
                                            ]
                                        }, feat.title, true, {
                                            fileName: "[project]/src/components/landing/LandingPage.tsx",
                                            lineNumber: 731,
                                            columnNumber: 15
                                        }, ("TURBOPACK compile-time value", void 0)))
                                }, void 0, false, {
                                    fileName: "[project]/src/components/landing/LandingPage.tsx",
                                    lineNumber: 722,
                                    columnNumber: 11
                                }, ("TURBOPACK compile-time value", void 0))
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/landing/LandingPage.tsx",
                            lineNumber: 708,
                            columnNumber: 9
                        }, ("TURBOPACK compile-time value", void 0))
                    }, void 0, false, {
                        fileName: "[project]/src/components/landing/LandingPage.tsx",
                        lineNumber: 707,
                        columnNumber: 7
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                        className: "py-10 px-4 relative overflow-hidden",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "mx-auto max-w-5xl text-center relative z-10",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "mb-10 text-center",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                            className: "font-display text-3xl sm:text-5xl font-extrabold text-slate-900 dark:text-white",
                                            children: [
                                                "Supported",
                                                ' ',
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "bg-gradient-to-r from-teal-600 to-emerald-600 dark:from-teal-400 dark:to-emerald-400 bg-clip-text text-transparent font-black",
                                                    children: "Languages Network"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/landing/LandingPage.tsx",
                                                    lineNumber: 758,
                                                    columnNumber: 15
                                                }, ("TURBOPACK compile-time value", void 0))
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/landing/LandingPage.tsx",
                                            lineNumber: 756,
                                            columnNumber: 13
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                            className: "mx-auto mt-3 max-w-xl text-xs sm:text-sm text-slate-700 dark:text-slate-300 font-semibold",
                                            children: "Dotted connection paths track our regional translation relays and Tamil dictionary synchronizers."
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/landing/LandingPage.tsx",
                                            lineNumber: 762,
                                            columnNumber: 13
                                        }, ("TURBOPACK compile-time value", void 0))
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/landing/LandingPage.tsx",
                                    lineNumber: 755,
                                    columnNumber: 11
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "relative h-64 sm:h-80 w-full max-w-4xl mx-auto bg-white dark:bg-black/40 border border-[#DDE5F0] dark:border-white/5 rounded-[28px] p-4 shadow-lg flex items-center justify-center overflow-hidden mb-8",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "absolute inset-0 bg-radial from-cyan-500/5 via-transparent to-transparent pointer-events-none"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/landing/LandingPage.tsx",
                                            lineNumber: 769,
                                            columnNumber: 13
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                            className: "w-4/5 h-full opacity-20 dark:opacity-15 text-slate-500 dark:text-slate-400",
                                            viewBox: "0 0 1000 500",
                                            fill: "currentColor",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                    d: "M150,150 Q180,100 240,120 Q300,140 280,220 Q240,280 180,240 Z"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/landing/LandingPage.tsx",
                                                    lineNumber: 773,
                                                    columnNumber: 15
                                                }, ("TURBOPACK compile-time value", void 0)),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                    d: "M220,280 Q250,340 280,420 Q250,450 200,410 Q160,350 180,300 Z"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/landing/LandingPage.tsx",
                                                    lineNumber: 774,
                                                    columnNumber: 15
                                                }, ("TURBOPACK compile-time value", void 0)),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                    d: "M500,120 Q550,80 620,100 Q680,120 650,200 Q580,260 520,210 Z"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/landing/LandingPage.tsx",
                                                    lineNumber: 775,
                                                    columnNumber: 15
                                                }, ("TURBOPACK compile-time value", void 0)),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                    d: "M550,220 Q600,280 580,360 Q530,380 490,340 Z"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/landing/LandingPage.tsx",
                                                    lineNumber: 776,
                                                    columnNumber: 15
                                                }, ("TURBOPACK compile-time value", void 0)),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                    d: "M720,150 Q780,120 850,160 Q880,220 820,280 Q760,250 740,180 Z"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/landing/LandingPage.tsx",
                                                    lineNumber: 777,
                                                    columnNumber: 15
                                                }, ("TURBOPACK compile-time value", void 0)),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                                    d: "M800,320 Q850,300 890,340 Q840,410 790,380 Z"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/landing/LandingPage.tsx",
                                                    lineNumber: 778,
                                                    columnNumber: 15
                                                }, ("TURBOPACK compile-time value", void 0))
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/landing/LandingPage.tsx",
                                            lineNumber: 772,
                                            columnNumber: 13
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "absolute inset-0 pointer-events-none",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "absolute top-[28%] left-[25%] flex h-3 w-3",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: "animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-60"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/landing/LandingPage.tsx",
                                                            lineNumber: 785,
                                                            columnNumber: 17
                                                        }, ("TURBOPACK compile-time value", void 0)),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: "relative inline-flex rounded-full h-3 w-3 bg-cyan-500"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/landing/LandingPage.tsx",
                                                            lineNumber: 786,
                                                            columnNumber: 17
                                                        }, ("TURBOPACK compile-time value", void 0))
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/components/landing/LandingPage.tsx",
                                                    lineNumber: 784,
                                                    columnNumber: 15
                                                }, ("TURBOPACK compile-time value", void 0)),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "absolute top-[25%] left-[56%] flex h-3 w-3",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: "animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-60"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/landing/LandingPage.tsx",
                                                            lineNumber: 790,
                                                            columnNumber: 17
                                                        }, ("TURBOPACK compile-time value", void 0)),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: "relative inline-flex rounded-full h-3 w-3 bg-teal-500"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/landing/LandingPage.tsx",
                                                            lineNumber: 791,
                                                            columnNumber: 17
                                                        }, ("TURBOPACK compile-time value", void 0))
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/components/landing/LandingPage.tsx",
                                                    lineNumber: 789,
                                                    columnNumber: 15
                                                }, ("TURBOPACK compile-time value", void 0)),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "absolute top-[42%] left-[64%] flex h-3 w-3",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: "animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-60"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/landing/LandingPage.tsx",
                                                            lineNumber: 795,
                                                            columnNumber: 17
                                                        }, ("TURBOPACK compile-time value", void 0)),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: "relative inline-flex rounded-full h-3 w-3 bg-emerald-500"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/landing/LandingPage.tsx",
                                                            lineNumber: 796,
                                                            columnNumber: 17
                                                        }, ("TURBOPACK compile-time value", void 0))
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/components/landing/LandingPage.tsx",
                                                    lineNumber: 794,
                                                    columnNumber: 15
                                                }, ("TURBOPACK compile-time value", void 0)),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "absolute top-[32%] left-[82%] flex h-3 w-3",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: "animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-60"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/landing/LandingPage.tsx",
                                                            lineNumber: 800,
                                                            columnNumber: 17
                                                        }, ("TURBOPACK compile-time value", void 0)),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            className: "relative inline-flex rounded-full h-3 w-3 bg-cyan-500"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/landing/LandingPage.tsx",
                                                            lineNumber: 801,
                                                            columnNumber: 17
                                                        }, ("TURBOPACK compile-time value", void 0))
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/components/landing/LandingPage.tsx",
                                                    lineNumber: 799,
                                                    columnNumber: 15
                                                }, ("TURBOPACK compile-time value", void 0)),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                                    className: "absolute inset-0 w-full h-full",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].path, {
                                                            d: "M 255 145 Q 400 80 565 130",
                                                            fill: "none",
                                                            stroke: "rgba(6, 182, 212, 0.45)",
                                                            strokeWidth: "1.5",
                                                            strokeDasharray: "5 3"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/landing/LandingPage.tsx",
                                                            lineNumber: 806,
                                                            columnNumber: 17
                                                        }, ("TURBOPACK compile-time value", void 0)),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].path, {
                                                            d: "M 565 130 Q 600 200 645 215",
                                                            fill: "none",
                                                            stroke: "rgba(16, 185, 129, 0.45)",
                                                            strokeWidth: "1.5",
                                                            strokeDasharray: "5 3"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/landing/LandingPage.tsx",
                                                            lineNumber: 810,
                                                            columnNumber: 17
                                                        }, ("TURBOPACK compile-time value", void 0)),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].path, {
                                                            d: "M 825 165 Q 750 180 645 215",
                                                            fill: "none",
                                                            stroke: "rgba(20, 184, 166, 0.45)",
                                                            strokeWidth: "1.5",
                                                            strokeDasharray: "5 3"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/landing/LandingPage.tsx",
                                                            lineNumber: 814,
                                                            columnNumber: 17
                                                        }, ("TURBOPACK compile-time value", void 0))
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/components/landing/LandingPage.tsx",
                                                    lineNumber: 805,
                                                    columnNumber: 15
                                                }, ("TURBOPACK compile-time value", void 0))
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/landing/LandingPage.tsx",
                                            lineNumber: 782,
                                            columnNumber: 13
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            className: "absolute bottom-4 px-3.5 py-1.5 rounded-full bg-white/95 dark:bg-black/80 border border-[#DDE5F0] dark:border-white/10 text-[10px] font-extrabold text-slate-800 dark:text-slate-200 backdrop-blur-md flex items-center gap-1.5 shadow-lg select-none",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/landing/LandingPage.tsx",
                                                    lineNumber: 823,
                                                    columnNumber: 15
                                                }, ("TURBOPACK compile-time value", void 0)),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    children: "Translating Live Speech Stream (Tamil ➔ English)"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/landing/LandingPage.tsx",
                                                    lineNumber: 824,
                                                    columnNumber: 15
                                                }, ("TURBOPACK compile-time value", void 0))
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/landing/LandingPage.tsx",
                                            lineNumber: 822,
                                            columnNumber: 13
                                        }, ("TURBOPACK compile-time value", void 0))
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/landing/LandingPage.tsx",
                                    lineNumber: 768,
                                    columnNumber: 11
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "flex flex-wrap justify-center gap-2 max-w-4xl mx-auto",
                                    children: [
                                        'English',
                                        'Tamil (தமிழ்)',
                                        'Hindi (हिन्दी)',
                                        'Spanish',
                                        'French',
                                        'German',
                                        'Italian',
                                        'Japanese',
                                        'Arabic',
                                        'Russian',
                                        'Dutch',
                                        'Korean',
                                        '+80 more'
                                    ].map((lang)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "rounded-full px-4 py-2 text-xs font-bold bg-white dark:bg-white/[0.02] border border-[#DDE5F0] dark:border-white/[0.06] text-slate-800 dark:text-slate-300 transition-all hover:scale-105 shadow-sm",
                                            children: lang
                                        }, lang, false, {
                                            fileName: "[project]/src/components/landing/LandingPage.tsx",
                                            lineNumber: 831,
                                            columnNumber: 15
                                        }, ("TURBOPACK compile-time value", void 0)))
                                }, void 0, false, {
                                    fileName: "[project]/src/components/landing/LandingPage.tsx",
                                    lineNumber: 829,
                                    columnNumber: 11
                                }, ("TURBOPACK compile-time value", void 0))
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/landing/LandingPage.tsx",
                            lineNumber: 753,
                            columnNumber: 9
                        }, ("TURBOPACK compile-time value", void 0))
                    }, void 0, false, {
                        fileName: "[project]/src/components/landing/LandingPage.tsx",
                        lineNumber: 752,
                        columnNumber: 7
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/landing/LandingPage.tsx",
                lineNumber: 654,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                id: "ai-language-tools",
                className: "relative py-10 px-4",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "mx-auto max-w-7xl",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "mb-14 text-center",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    className: "inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-[10px] font-extrabold uppercase tracking-widest bg-teal-500/10 dark:bg-teal-500/10 border border-teal-500/30 text-teal-700 dark:text-teal-400 mb-4 shadow-[0_0_15px_rgba(37,99,235,0.1)]",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$zap$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Zap$3e$__["Zap"], {
                                            size: 11
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/landing/LandingPage.tsx",
                                            lineNumber: 852,
                                            columnNumber: 15
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        " AI Language Workstation"
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/landing/LandingPage.tsx",
                                    lineNumber: 851,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                    className: "font-display text-3xl sm:text-5xl font-extrabold text-slate-900 dark:text-white",
                                    children: [
                                        "Center Stage",
                                        ' ',
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 dark:from-teal-400 dark:via-cyan-400 dark:to-emerald-400 bg-clip-text text-transparent font-black",
                                            children: "Product Showcase"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/landing/LandingPage.tsx",
                                            lineNumber: 856,
                                            columnNumber: 15
                                        }, ("TURBOPACK compile-time value", void 0))
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/landing/LandingPage.tsx",
                                    lineNumber: 854,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "mx-auto mt-4 max-w-2xl text-sm sm:text-base text-slate-700 dark:text-slate-300 font-semibold",
                                    children: "Select a workbench and deploy our localized browser networks. Low bundle weights, sub-20ms rendering loops, and complete privacy."
                                }, void 0, false, {
                                    fileName: "[project]/src/components/landing/LandingPage.tsx",
                                    lineNumber: 860,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0))
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/landing/LandingPage.tsx",
                            lineNumber: 850,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "grid gap-6 sm:grid-cols-2 lg:grid-cols-4",
                            children: TOOLS.map((tool)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(ThreeDInteractiveCard, {
                                    glowColor: tool.glowColor,
                                    onClick: ()=>launchTool(tool.id),
                                    className: "flex flex-col",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "p-6 flex flex-col justify-between h-full w-full",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "relative h-28 w-full mb-5 rounded-2xl bg-slate-50 dark:bg-black/40 border border-[#DDE5F0] dark:border-white/5 overflow-hidden flex items-center justify-center shadow-inner",
                                                children: [
                                                    tool.id === 'voice-to-text' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "flex gap-1.5 items-end justify-center h-10 w-full px-6",
                                                        children: [
                                                            [
                                                                1,
                                                                3,
                                                                2,
                                                                4,
                                                                3,
                                                                5,
                                                                3,
                                                                2,
                                                                4,
                                                                1
                                                            ].map((val, idx)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].span, {
                                                                    className: "w-1.5 bg-teal-600 dark:bg-teal-500 rounded-full",
                                                                    animate: {
                                                                        height: [
                                                                            `${val * 12}%`,
                                                                            `${val * 20}%`,
                                                                            `${val * 12}%`
                                                                        ]
                                                                    },
                                                                    transition: {
                                                                        repeat: Infinity,
                                                                        duration: 1.0,
                                                                        delay: idx * 0.08
                                                                    }
                                                                }, idx, false, {
                                                                    fileName: "[project]/src/components/landing/LandingPage.tsx",
                                                                    lineNumber: 881,
                                                                    columnNumber: 27
                                                                }, ("TURBOPACK compile-time value", void 0))),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "absolute top-2.5 right-2.5 flex items-center gap-1 bg-red-100 dark:bg-red-500/10 px-1.5 py-0.5 rounded border border-red-200 dark:border-red-500/30",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                        className: "h-1.5 w-1.5 rounded-full bg-red-500 animate-pulse"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/components/landing/LandingPage.tsx",
                                                                        lineNumber: 889,
                                                                        columnNumber: 27
                                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                        className: "text-[7px] font-extrabold text-red-700 dark:text-red-500 uppercase tracking-widest",
                                                                        children: "Live Mic"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/components/landing/LandingPage.tsx",
                                                                        lineNumber: 890,
                                                                        columnNumber: 27
                                                                    }, ("TURBOPACK compile-time value", void 0))
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/components/landing/LandingPage.tsx",
                                                                lineNumber: 888,
                                                                columnNumber: 25
                                                            }, ("TURBOPACK compile-time value", void 0))
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/components/landing/LandingPage.tsx",
                                                        lineNumber: 879,
                                                        columnNumber: 23
                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                    tool.id === 'text-to-speech' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "flex flex-col gap-2 w-4/5",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "flex justify-between items-center text-[7px] text-emerald-700 dark:text-emerald-400 font-extrabold uppercase tracking-wider",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                        children: "Synthesizing Voice"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/components/landing/LandingPage.tsx",
                                                                        lineNumber: 898,
                                                                        columnNumber: 27
                                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                        children: "480Hz"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/components/landing/LandingPage.tsx",
                                                                        lineNumber: 899,
                                                                        columnNumber: 27
                                                                    }, ("TURBOPACK compile-time value", void 0))
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/components/landing/LandingPage.tsx",
                                                                lineNumber: 897,
                                                                columnNumber: 25
                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "flex gap-1 h-6 items-center",
                                                                children: [
                                                                    4,
                                                                    2,
                                                                    7,
                                                                    5,
                                                                    8,
                                                                    3,
                                                                    6,
                                                                    2,
                                                                    5,
                                                                    4,
                                                                    8,
                                                                    3
                                                                ].map((h, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].span, {
                                                                        className: "flex-1 bg-emerald-600 dark:bg-emerald-500 rounded-full",
                                                                        style: {
                                                                            height: `${h * 10}%`
                                                                        },
                                                                        animate: {
                                                                            scaleY: [
                                                                                1,
                                                                                1.4,
                                                                                1
                                                                            ]
                                                                        },
                                                                        transition: {
                                                                            repeat: Infinity,
                                                                            duration: 1.2,
                                                                            delay: i * 0.05
                                                                        }
                                                                    }, i, false, {
                                                                        fileName: "[project]/src/components/landing/LandingPage.tsx",
                                                                        lineNumber: 903,
                                                                        columnNumber: 29
                                                                    }, ("TURBOPACK compile-time value", void 0)))
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/components/landing/LandingPage.tsx",
                                                                lineNumber: 901,
                                                                columnNumber: 25
                                                            }, ("TURBOPACK compile-time value", void 0))
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/components/landing/LandingPage.tsx",
                                                        lineNumber: 896,
                                                        columnNumber: 23
                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                    tool.id === 'translation' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "flex items-center gap-2 justify-center w-full text-[9px] font-extrabold",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "px-2.5 py-1 rounded bg-white dark:bg-white/5 border border-[#DDE5F0] dark:border-white/10 text-slate-800 dark:text-slate-300 shadow-sm",
                                                                children: "English"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/components/landing/LandingPage.tsx",
                                                                lineNumber: 917,
                                                                columnNumber: 25
                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].div, {
                                                                animate: {
                                                                    rotate: [
                                                                        0,
                                                                        180,
                                                                        180,
                                                                        360
                                                                    ]
                                                                },
                                                                transition: {
                                                                    repeat: Infinity,
                                                                    duration: 3.5,
                                                                    ease: 'easeInOut'
                                                                },
                                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$right$2d$left$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowRightLeft$3e$__["ArrowRightLeft"], {
                                                                    size: 10,
                                                                    className: "text-emerald-600 dark:text-emerald-500"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/components/landing/LandingPage.tsx",
                                                                    lineNumber: 919,
                                                                    columnNumber: 27
                                                                }, ("TURBOPACK compile-time value", void 0))
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/components/landing/LandingPage.tsx",
                                                                lineNumber: 918,
                                                                columnNumber: 25
                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "px-2.5 py-1 rounded bg-white dark:bg-white/5 border border-[#DDE5F0] dark:border-white/10 text-emerald-700 dark:text-emerald-400 shadow-sm",
                                                                children: "Tamil"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/components/landing/LandingPage.tsx",
                                                                lineNumber: 921,
                                                                columnNumber: 25
                                                            }, ("TURBOPACK compile-time value", void 0))
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/components/landing/LandingPage.tsx",
                                                        lineNumber: 916,
                                                        columnNumber: 23
                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                    tool.id === 'audio-transcription' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "w-11/12 flex flex-col gap-1 px-2",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "flex justify-between text-[7px] text-amber-700 dark:text-amber-500 font-extrabold tracking-wider uppercase",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                        children: "transcription.wav"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/components/landing/LandingPage.tsx",
                                                                        lineNumber: 928,
                                                                        columnNumber: 27
                                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                        children: "00:14 / 01:25"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/components/landing/LandingPage.tsx",
                                                                        lineNumber: 929,
                                                                        columnNumber: 27
                                                                    }, ("TURBOPACK compile-time value", void 0))
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/components/landing/LandingPage.tsx",
                                                                lineNumber: 927,
                                                                columnNumber: 25
                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "h-6 bg-white dark:bg-white/5 rounded border border-[#DDE5F0] dark:border-white/5 relative overflow-hidden flex items-center px-1",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        className: "absolute top-0 bottom-0 left-1/2 w-[1px] bg-amber-500/40 animate-pulse"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/components/landing/LandingPage.tsx",
                                                                        lineNumber: 932,
                                                                        columnNumber: 27
                                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        className: "flex gap-0.5 w-full items-end h-4 opacity-50",
                                                                        children: [
                                                                            2,
                                                                            5,
                                                                            3,
                                                                            8,
                                                                            4,
                                                                            6,
                                                                            3,
                                                                            2,
                                                                            5,
                                                                            7,
                                                                            4,
                                                                            3,
                                                                            6,
                                                                            2,
                                                                            5,
                                                                            3,
                                                                            4,
                                                                            1
                                                                        ].map((val, idx)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                className: "flex-1 bg-amber-600 dark:bg-amber-500 rounded-sm",
                                                                                style: {
                                                                                    height: `${val * 10}%`
                                                                                }
                                                                            }, idx, false, {
                                                                                fileName: "[project]/src/components/landing/LandingPage.tsx",
                                                                                lineNumber: 935,
                                                                                columnNumber: 31
                                                                            }, ("TURBOPACK compile-time value", void 0)))
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/components/landing/LandingPage.tsx",
                                                                        lineNumber: 933,
                                                                        columnNumber: 27
                                                                    }, ("TURBOPACK compile-time value", void 0))
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/components/landing/LandingPage.tsx",
                                                                lineNumber: 931,
                                                                columnNumber: 25
                                                            }, ("TURBOPACK compile-time value", void 0))
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/components/landing/LandingPage.tsx",
                                                        lineNumber: 926,
                                                        columnNumber: 23
                                                    }, ("TURBOPACK compile-time value", void 0))
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/components/landing/LandingPage.tsx",
                                                lineNumber: 876,
                                                columnNumber: 19
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex-1 flex flex-col justify-between",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "flex items-center gap-2.5 mb-2.5",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        className: "flex h-9 w-9 items-center justify-center rounded-xl text-white shadow-md",
                                                                        style: {
                                                                            background: tool.accentColor
                                                                        },
                                                                        children: tool.icon
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/components/landing/LandingPage.tsx",
                                                                        lineNumber: 948,
                                                                        columnNumber: 25
                                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                                        className: "font-display text-base font-extrabold text-slate-900 dark:text-white tracking-tight leading-none",
                                                                        children: tool.label
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/components/landing/LandingPage.tsx",
                                                                        lineNumber: 952,
                                                                        columnNumber: 25
                                                                    }, ("TURBOPACK compile-time value", void 0))
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/components/landing/LandingPage.tsx",
                                                                lineNumber: 947,
                                                                columnNumber: 23
                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "flex items-center justify-between text-[9px] font-extrabold uppercase tracking-widest text-slate-500 dark:text-slate-400 mb-2",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                        children: tool.tagline
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/components/landing/LandingPage.tsx",
                                                                        lineNumber: 956,
                                                                        columnNumber: 25
                                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                        className: "text-emerald-600 dark:text-emerald-400",
                                                                        children: tool.status
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/components/landing/LandingPage.tsx",
                                                                        lineNumber: 957,
                                                                        columnNumber: 25
                                                                    }, ("TURBOPACK compile-time value", void 0))
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/components/landing/LandingPage.tsx",
                                                                lineNumber: 955,
                                                                columnNumber: 23
                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                className: "text-xs leading-relaxed text-slate-700 dark:text-slate-300 font-semibold mb-4",
                                                                children: tool.description
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/components/landing/LandingPage.tsx",
                                                                lineNumber: 960,
                                                                columnNumber: 23
                                                            }, ("TURBOPACK compile-time value", void 0))
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/components/landing/LandingPage.tsx",
                                                        lineNumber: 946,
                                                        columnNumber: 21
                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "flex flex-wrap gap-1 mb-4",
                                                                children: tool.features.map((f)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                        className: "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[9px] font-extrabold tracking-wide bg-slate-100 dark:bg-white/[0.02] border border-[#DDE5F0] dark:border-white/[0.04] text-slate-700 dark:text-slate-300",
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$check$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CheckCircle2$3e$__["CheckCircle2"], {
                                                                                size: 8,
                                                                                className: "text-emerald-600 dark:text-emerald-500"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/src/components/landing/LandingPage.tsx",
                                                                                lineNumber: 968,
                                                                                columnNumber: 29
                                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                                            f
                                                                        ]
                                                                    }, f, true, {
                                                                        fileName: "[project]/src/components/landing/LandingPage.tsx",
                                                                        lineNumber: 967,
                                                                        columnNumber: 27
                                                                    }, ("TURBOPACK compile-time value", void 0)))
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/components/landing/LandingPage.tsx",
                                                                lineNumber: 965,
                                                                columnNumber: 23
                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                className: "group/btn w-full flex items-center justify-center gap-2 rounded-xl py-2.5 text-xs font-extrabold transition-all duration-300 cursor-pointer text-white shadow",
                                                                style: {
                                                                    background: tool.accentColor
                                                                },
                                                                children: [
                                                                    "Deploy Module",
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$right$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowRight$3e$__["ArrowRight"], {
                                                                        size: 11,
                                                                        className: "transition-transform group-hover/btn:translate-x-0.5"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/components/landing/LandingPage.tsx",
                                                                        lineNumber: 981,
                                                                        columnNumber: 25
                                                                    }, ("TURBOPACK compile-time value", void 0))
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/components/landing/LandingPage.tsx",
                                                                lineNumber: 974,
                                                                columnNumber: 23
                                                            }, ("TURBOPACK compile-time value", void 0))
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/components/landing/LandingPage.tsx",
                                                        lineNumber: 963,
                                                        columnNumber: 21
                                                    }, ("TURBOPACK compile-time value", void 0))
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/components/landing/LandingPage.tsx",
                                                lineNumber: 945,
                                                columnNumber: 19
                                            }, ("TURBOPACK compile-time value", void 0))
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/landing/LandingPage.tsx",
                                        lineNumber: 873,
                                        columnNumber: 17
                                    }, ("TURBOPACK compile-time value", void 0))
                                }, tool.id, false, {
                                    fileName: "[project]/src/components/landing/LandingPage.tsx",
                                    lineNumber: 867,
                                    columnNumber: 15
                                }, ("TURBOPACK compile-time value", void 0)))
                        }, void 0, false, {
                            fileName: "[project]/src/components/landing/LandingPage.tsx",
                            lineNumber: 865,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0))
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/landing/LandingPage.tsx",
                    lineNumber: 848,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0))
            }, void 0, false, {
                fileName: "[project]/src/components/landing/LandingPage.tsx",
                lineNumber: 847,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                id: "pricing",
                className: "py-20 sm:py-28 px-4 relative overflow-hidden bg-slate-50/50 dark:bg-[#070d1e]/20 border-y border-slate-200 dark:border-white/5",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-teal-500/10 via-emerald-500/10 to-cyan-500/10 dark:from-teal-500/15 dark:via-emerald-500/20 dark:to-cyan-500/15 rounded-full blur-[120px] pointer-events-none"
                    }, void 0, false, {
                        fileName: "[project]/src/components/landing/LandingPage.tsx",
                        lineNumber: 999,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "mx-auto max-w-5xl text-center relative z-10",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "space-y-4 mb-16",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-[10px] font-extrabold uppercase tracking-widest bg-teal-500/10 dark:bg-teal-500/10 border border-teal-500/30 text-teal-700 dark:text-teal-400 mb-4 shadow-[0_0_15px_rgba(37,99,235,0.1)]",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$zap$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Zap$3e$__["Zap"], {
                                                size: 11
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/landing/LandingPage.tsx",
                                                lineNumber: 1004,
                                                columnNumber: 15
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            " Pricing Plans"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/landing/LandingPage.tsx",
                                        lineNumber: 1003,
                                        columnNumber: 13
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                        className: "font-display text-4xl sm:text-6xl font-black tracking-tight text-slate-900 dark:text-white",
                                        children: [
                                            "SaaS",
                                            ' ',
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "bg-gradient-to-r from-teal-600 via-emerald-600 to-cyan-600 dark:from-teal-400 dark:via-emerald-400 dark:to-cyan-400 bg-clip-text text-transparent",
                                                children: "Plan Details"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/landing/LandingPage.tsx",
                                                lineNumber: 1008,
                                                columnNumber: 15
                                            }, ("TURBOPACK compile-time value", void 0))
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/landing/LandingPage.tsx",
                                        lineNumber: 1006,
                                        columnNumber: 13
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "mx-auto max-w-2xl text-sm sm:text-base text-slate-700 dark:text-slate-300 font-bold leading-relaxed",
                                        children: "Start with our full-featured Free Trial and upgrade as your team grows."
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/landing/LandingPage.tsx",
                                        lineNumber: 1012,
                                        columnNumber: 13
                                    }, ("TURBOPACK compile-time value", void 0))
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/landing/LandingPage.tsx",
                                lineNumber: 1002,
                                columnNumber: 11
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "relative z-10 flex items-center justify-center gap-3 pt-2 mb-10",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: ()=>setBillingCycle('monthly'),
                                        className: `px-5 py-2 rounded-full text-xs font-black uppercase tracking-[0.15em] transition-all duration-200 ${billingCycle === 'monthly' ? 'bg-teal-500 text-white shadow-[0_4px_14px_rgba(20,184,166,0.4)]' : 'bg-white/70 dark:bg-white/5 text-slate-500 dark:text-slate-400 border border-teal-200/60 dark:border-teal-900/40 hover:border-teal-300'}`,
                                        children: "Monthly"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/landing/LandingPage.tsx",
                                        lineNumber: 1018,
                                        columnNumber: 13
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: ()=>setBillingCycle('yearly'),
                                        className: `px-5 py-2 rounded-full text-xs font-black uppercase tracking-[0.15em] transition-all duration-200 flex items-center gap-2 ${billingCycle === 'yearly' ? 'bg-teal-500 text-white shadow-[0_4px_14px_rgba(20,184,166,0.4)]' : 'bg-white/70 dark:bg-white/5 text-slate-500 dark:text-slate-400 border border-teal-200/60 dark:border-teal-900/40 hover:border-teal-300'}`,
                                        children: [
                                            "Yearly",
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: `px-2 py-0.5 rounded-full text-[9px] font-black tracking-wider ${billingCycle === 'yearly' ? 'bg-white/30 text-white' : 'bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800'}`,
                                                children: "Save 30%"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/landing/LandingPage.tsx",
                                                lineNumber: 1037,
                                                columnNumber: 15
                                            }, ("TURBOPACK compile-time value", void 0))
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/landing/LandingPage.tsx",
                                        lineNumber: 1028,
                                        columnNumber: 13
                                    }, ("TURBOPACK compile-time value", void 0))
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/landing/LandingPage.tsx",
                                lineNumber: 1017,
                                columnNumber: 11
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto items-stretch",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(ThreeDInteractiveCard, {
                                        glowColor: "rgba(59, 130, 246, 0.15)",
                                        className: "p-8 flex flex-col justify-between items-start text-left bg-white dark:bg-[#070d1e]/90 border border-slate-200 dark:border-white/5 rounded-3xl shadow-xl relative",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "w-full",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "flex justify-between items-center mb-4",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "px-3 py-1 rounded-full text-[10px] font-black uppercase bg-teal-500/10 text-teal-600 dark:text-teal-400 tracking-wider",
                                                                children: "Most Popular"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/components/landing/LandingPage.tsx",
                                                                lineNumber: 1053,
                                                                columnNumber: 19
                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "text-sm font-bold text-slate-500 dark:text-slate-400",
                                                                children: "7 Days Trial"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/components/landing/LandingPage.tsx",
                                                                lineNumber: 1056,
                                                                columnNumber: 19
                                                            }, ("TURBOPACK compile-time value", void 0))
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/components/landing/LandingPage.tsx",
                                                        lineNumber: 1052,
                                                        columnNumber: 17
                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                        className: "font-display text-3xl font-black text-slate-900 dark:text-white mb-2",
                                                        children: "Free Trial"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/landing/LandingPage.tsx",
                                                        lineNumber: 1058,
                                                        columnNumber: 17
                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                        className: "text-xs text-slate-600 dark:text-slate-300 font-semibold mb-6",
                                                        children: [
                                                            "Perfect for experiencing the complete ",
                                                            globalConfig?.branding?.platform_name || 'Fluentia',
                                                            " platform workstation locally on your device."
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/components/landing/LandingPage.tsx",
                                                        lineNumber: 1059,
                                                        columnNumber: 17
                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "h-[1px] bg-slate-200 dark:bg-white/5 my-4"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/landing/LandingPage.tsx",
                                                        lineNumber: 1062,
                                                        columnNumber: 17
                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
                                                        className: "space-y-4",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                                                className: "flex items-center gap-3",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$check$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CheckCircle2$3e$__["CheckCircle2"], {
                                                                        size: 16,
                                                                        className: "text-emerald-500 flex-shrink-0"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/components/landing/LandingPage.tsx",
                                                                        lineNumber: 1065,
                                                                        columnNumber: 21
                                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                                className: "text-xs font-bold text-slate-800 dark:text-white",
                                                                                children: "7 Days Trial Period"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/src/components/landing/LandingPage.tsx",
                                                                                lineNumber: 1067,
                                                                                columnNumber: 23
                                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                                className: "text-[10px] text-slate-500",
                                                                                children: "Unrestricted system access"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/src/components/landing/LandingPage.tsx",
                                                                                lineNumber: 1068,
                                                                                columnNumber: 23
                                                                            }, ("TURBOPACK compile-time value", void 0))
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/src/components/landing/LandingPage.tsx",
                                                                        lineNumber: 1066,
                                                                        columnNumber: 21
                                                                    }, ("TURBOPACK compile-time value", void 0))
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/components/landing/LandingPage.tsx",
                                                                lineNumber: 1064,
                                                                columnNumber: 19
                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                                                className: "flex items-center gap-3",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$check$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CheckCircle2$3e$__["CheckCircle2"], {
                                                                        size: 16,
                                                                        className: "text-emerald-500 flex-shrink-0"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/components/landing/LandingPage.tsx",
                                                                        lineNumber: 1072,
                                                                        columnNumber: 21
                                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                                className: "text-xs font-bold text-slate-800 dark:text-white",
                                                                                children: "Audio Processing"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/src/components/landing/LandingPage.tsx",
                                                                                lineNumber: 1074,
                                                                                columnNumber: 23
                                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                                className: "text-[10px] text-slate-500",
                                                                                children: "30 minutes of translation & transcription"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/src/components/landing/LandingPage.tsx",
                                                                                lineNumber: 1075,
                                                                                columnNumber: 23
                                                                            }, ("TURBOPACK compile-time value", void 0))
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/src/components/landing/LandingPage.tsx",
                                                                        lineNumber: 1073,
                                                                        columnNumber: 21
                                                                    }, ("TURBOPACK compile-time value", void 0))
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/components/landing/LandingPage.tsx",
                                                                lineNumber: 1071,
                                                                columnNumber: 19
                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                                                className: "flex items-center gap-3",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$check$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CheckCircle2$3e$__["CheckCircle2"], {
                                                                        size: 16,
                                                                        className: "text-emerald-500 flex-shrink-0"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/components/landing/LandingPage.tsx",
                                                                        lineNumber: 1079,
                                                                        columnNumber: 21
                                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                                className: "text-xs font-bold text-slate-800 dark:text-white",
                                                                                children: "Translation Services"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/src/components/landing/LandingPage.tsx",
                                                                                lineNumber: 1081,
                                                                                columnNumber: 23
                                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                                className: "text-[10px] text-slate-500",
                                                                                children: "25,000 characters processed"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/src/components/landing/LandingPage.tsx",
                                                                                lineNumber: 1082,
                                                                                columnNumber: 23
                                                                            }, ("TURBOPACK compile-time value", void 0))
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/src/components/landing/LandingPage.tsx",
                                                                        lineNumber: 1080,
                                                                        columnNumber: 21
                                                                    }, ("TURBOPACK compile-time value", void 0))
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/components/landing/LandingPage.tsx",
                                                                lineNumber: 1078,
                                                                columnNumber: 19
                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                                                className: "flex items-center gap-3",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$check$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CheckCircle2$3e$__["CheckCircle2"], {
                                                                        size: 16,
                                                                        className: "text-emerald-500 flex-shrink-0"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/components/landing/LandingPage.tsx",
                                                                        lineNumber: 1086,
                                                                        columnNumber: 21
                                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                                className: "text-xs font-bold text-slate-800 dark:text-white",
                                                                                children: "Text-to-Speech (TTS)"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/src/components/landing/LandingPage.tsx",
                                                                                lineNumber: 1088,
                                                                                columnNumber: 23
                                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                                className: "text-[10px] text-slate-500",
                                                                                children: "10,000 synthesis characters"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/src/components/landing/LandingPage.tsx",
                                                                                lineNumber: 1089,
                                                                                columnNumber: 23
                                                                            }, ("TURBOPACK compile-time value", void 0))
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/src/components/landing/LandingPage.tsx",
                                                                        lineNumber: 1087,
                                                                        columnNumber: 21
                                                                    }, ("TURBOPACK compile-time value", void 0))
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/components/landing/LandingPage.tsx",
                                                                lineNumber: 1085,
                                                                columnNumber: 19
                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                                                className: "flex items-center gap-3",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$check$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CheckCircle2$3e$__["CheckCircle2"], {
                                                                        size: 16,
                                                                        className: "text-emerald-500 flex-shrink-0"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/components/landing/LandingPage.tsx",
                                                                        lineNumber: 1093,
                                                                        columnNumber: 21
                                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                                className: "text-xs font-bold text-slate-800 dark:text-white",
                                                                                children: "Cloud Storage Allocation"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/src/components/landing/LandingPage.tsx",
                                                                                lineNumber: 1095,
                                                                                columnNumber: 23
                                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                                className: "text-[10px] text-slate-500",
                                                                                children: "100 MB secure isolated storage"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/src/components/landing/LandingPage.tsx",
                                                                                lineNumber: 1096,
                                                                                columnNumber: 23
                                                                            }, ("TURBOPACK compile-time value", void 0))
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/src/components/landing/LandingPage.tsx",
                                                                        lineNumber: 1094,
                                                                        columnNumber: 21
                                                                    }, ("TURBOPACK compile-time value", void 0))
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/components/landing/LandingPage.tsx",
                                                                lineNumber: 1092,
                                                                columnNumber: 19
                                                            }, ("TURBOPACK compile-time value", void 0))
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/components/landing/LandingPage.tsx",
                                                        lineNumber: 1063,
                                                        columnNumber: 17
                                                    }, ("TURBOPACK compile-time value", void 0))
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/components/landing/LandingPage.tsx",
                                                lineNumber: 1051,
                                                columnNumber: 15
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "w-full mt-8",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                    onClick: ()=>{
                                                        if (!user) {
                                                            setAuthModalMode('login');
                                                            setIsAuthModalOpen(true);
                                                        } else {
                                                            setViewMode('workspace');
                                                            window.scrollTo({
                                                                top: 0,
                                                                behavior: 'smooth'
                                                            });
                                                        }
                                                    },
                                                    className: "w-full py-3 px-6 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold cursor-pointer transition-colors shadow-lg text-center block",
                                                    children: "Start 7-Day Free Trial"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/landing/LandingPage.tsx",
                                                    lineNumber: 1102,
                                                    columnNumber: 17
                                                }, ("TURBOPACK compile-time value", void 0))
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/landing/LandingPage.tsx",
                                                lineNumber: 1101,
                                                columnNumber: 15
                                            }, ("TURBOPACK compile-time value", void 0))
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/landing/LandingPage.tsx",
                                        lineNumber: 1047,
                                        columnNumber: 13
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(ThreeDInteractiveCard, {
                                        glowColor: "rgba(168, 85, 247, 0.15)",
                                        className: "p-8 flex flex-col justify-between items-start text-left bg-white dark:bg-[#070d1e]/90 border border-slate-200 dark:border-white/5 rounded-3xl shadow-xl",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "w-full",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "flex justify-between items-center mb-4",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "px-3 py-1 rounded-full text-[10px] font-black uppercase bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 tracking-wider",
                                                                children: "Paid Tiers"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/components/landing/LandingPage.tsx",
                                                                lineNumber: 1118,
                                                                columnNumber: 19
                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "text-sm font-bold text-slate-500 dark:text-slate-400",
                                                                children: "Post-Trial Options"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/components/landing/LandingPage.tsx",
                                                                lineNumber: 1121,
                                                                columnNumber: 19
                                                            }, ("TURBOPACK compile-time value", void 0))
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/components/landing/LandingPage.tsx",
                                                        lineNumber: 1117,
                                                        columnNumber: 17
                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                        className: "font-display text-3xl font-black text-slate-900 dark:text-white mb-2",
                                                        children: "Upgrade Plans"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/landing/LandingPage.tsx",
                                                        lineNumber: 1123,
                                                        columnNumber: 17
                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                        className: "text-xs text-slate-600 dark:text-slate-300 font-semibold mb-6",
                                                        children: "After your 7-day trial concludes, select one of our premium enterprise tiers:"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/landing/LandingPage.tsx",
                                                        lineNumber: 1124,
                                                        columnNumber: 17
                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "h-[1px] bg-slate-200 dark:bg-white/5 my-4"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/landing/LandingPage.tsx",
                                                        lineNumber: 1127,
                                                        columnNumber: 17
                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "space-y-4",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/40 border border-slate-100 dark:border-white/5 flex justify-between items-center",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                                                                className: "text-sm font-extrabold text-slate-900 dark:text-white",
                                                                                children: "Starter Plan"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/src/components/landing/LandingPage.tsx",
                                                                                lineNumber: 1131,
                                                                                columnNumber: 23
                                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                                className: "text-[10px] text-slate-500",
                                                                                children: "60 mins audio / 100k translation / 50k TTS"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/src/components/landing/LandingPage.tsx",
                                                                                lineNumber: 1132,
                                                                                columnNumber: 23
                                                                            }, ("TURBOPACK compile-time value", void 0))
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/src/components/landing/LandingPage.tsx",
                                                                        lineNumber: 1130,
                                                                        columnNumber: 21
                                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                        className: "text-base font-black text-teal-600 dark:text-teal-400",
                                                                        children: billingCycle === "yearly" ? "$13/mo" : "$19/mo"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/components/landing/LandingPage.tsx",
                                                                        lineNumber: 1134,
                                                                        columnNumber: 21
                                                                    }, ("TURBOPACK compile-time value", void 0))
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/components/landing/LandingPage.tsx",
                                                                lineNumber: 1129,
                                                                columnNumber: 19
                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/40 border border-slate-100 dark:border-white/5 flex justify-between items-center",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                                                                className: "text-sm font-extrabold text-slate-900 dark:text-white",
                                                                                children: "Professional Plan"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/src/components/landing/LandingPage.tsx",
                                                                                lineNumber: 1139,
                                                                                columnNumber: 23
                                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                                className: "text-[10px] text-slate-500",
                                                                                children: "300 mins audio / 500k translation / 250k TTS"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/src/components/landing/LandingPage.tsx",
                                                                                lineNumber: 1140,
                                                                                columnNumber: 23
                                                                            }, ("TURBOPACK compile-time value", void 0))
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/src/components/landing/LandingPage.tsx",
                                                                        lineNumber: 1138,
                                                                        columnNumber: 21
                                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                        className: "text-base font-black text-teal-600 dark:text-teal-400",
                                                                        children: billingCycle === "yearly" ? "$34/mo" : "$49/mo"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/components/landing/LandingPage.tsx",
                                                                        lineNumber: 1142,
                                                                        columnNumber: 21
                                                                    }, ("TURBOPACK compile-time value", void 0))
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/components/landing/LandingPage.tsx",
                                                                lineNumber: 1137,
                                                                columnNumber: 19
                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/40 border border-slate-100 dark:border-white/5 flex justify-between items-center",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                                                                className: "text-sm font-extrabold text-slate-900 dark:text-white",
                                                                                children: "Enterprise Plan"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/src/components/landing/LandingPage.tsx",
                                                                                lineNumber: 1147,
                                                                                columnNumber: 23
                                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                                className: "text-[10px] text-slate-500",
                                                                                children: "1200 mins audio / 2M translation / 1M TTS"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/src/components/landing/LandingPage.tsx",
                                                                                lineNumber: 1148,
                                                                                columnNumber: 23
                                                                            }, ("TURBOPACK compile-time value", void 0))
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/src/components/landing/LandingPage.tsx",
                                                                        lineNumber: 1146,
                                                                        columnNumber: 21
                                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                        className: "text-base font-black text-teal-600 dark:text-teal-400",
                                                                        children: billingCycle === "yearly" ? "$104/mo" : "$149/mo"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/components/landing/LandingPage.tsx",
                                                                        lineNumber: 1150,
                                                                        columnNumber: 21
                                                                    }, ("TURBOPACK compile-time value", void 0))
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/components/landing/LandingPage.tsx",
                                                                lineNumber: 1145,
                                                                columnNumber: 19
                                                            }, ("TURBOPACK compile-time value", void 0))
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/components/landing/LandingPage.tsx",
                                                        lineNumber: 1128,
                                                        columnNumber: 17
                                                    }, ("TURBOPACK compile-time value", void 0))
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/components/landing/LandingPage.tsx",
                                                lineNumber: 1116,
                                                columnNumber: 15
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "w-full mt-8",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                    onClick: ()=>setIsPlansModalOpen(true),
                                                    className: "w-full py-3 px-6 rounded-xl border border-slate-200 dark:border-white/10 hover:bg-slate-50 dark:hover:bg-white/5 text-slate-900 dark:text-white text-xs font-bold cursor-pointer transition-colors text-center block",
                                                    children: "Explore Pricing Details"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/landing/LandingPage.tsx",
                                                    lineNumber: 1155,
                                                    columnNumber: 17
                                                }, ("TURBOPACK compile-time value", void 0))
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/landing/LandingPage.tsx",
                                                lineNumber: 1154,
                                                columnNumber: 15
                                            }, ("TURBOPACK compile-time value", void 0))
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/landing/LandingPage.tsx",
                                        lineNumber: 1112,
                                        columnNumber: 13
                                    }, ("TURBOPACK compile-time value", void 0))
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/landing/LandingPage.tsx",
                                lineNumber: 1045,
                                columnNumber: 11
                            }, ("TURBOPACK compile-time value", void 0))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/landing/LandingPage.tsx",
                        lineNumber: 1001,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/landing/LandingPage.tsx",
                lineNumber: 997,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("section", {
                id: "contact",
                className: "py-14 px-4 relative",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "mx-auto max-w-4xl overflow-hidden rounded-[36px] p-8 sm:p-12 text-center relative border border-[#DDE5F0] dark:border-white/10 shadow-2xl bg-white dark:bg-[#070d1e]/85",
                    style: {
                        backdropFilter: 'blur(25px)'
                    },
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "pointer-events-none absolute inset-0 rounded-[36px]",
                            style: {
                                background: 'radial-gradient(ellipse at top right, rgba(6, 182, 212, 0.08), transparent 50%)'
                            }
                        }, void 0, false, {
                            fileName: "[project]/src/components/landing/LandingPage.tsx",
                            lineNumber: 1174,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "flex flex-col items-center justify-center space-y-6",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                    className: "font-display text-3xl font-black text-slate-900 dark:text-white sm:text-5xl",
                                    children: "Get in Touch"
                                }, void 0, false, {
                                    fileName: "[project]/src/components/landing/LandingPage.tsx",
                                    lineNumber: 1178,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "text-slate-600 dark:text-slate-300 max-w-2xl text-center mb-8",
                                    children: "Have questions about our enterprise plans, custom integrations, or need technical support? Our team is ready to help you build the future of AI language processing."
                                }, void 0, false, {
                                    fileName: "[project]/src/components/landing/LandingPage.tsx",
                                    lineNumber: 1181,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-3xl mt-4",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                            href: "https://mail.google.com/mail/?view=cm&fs=1&to=aachinancy@gmail.com",
                                            target: "_blank",
                                            rel: "noopener noreferrer",
                                            className: "block p-6 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-white/5 flex flex-col items-center text-center transition-transform hover:scale-105 cursor-pointer",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "w-12 h-12 bg-teal-100 dark:bg-teal-900/30 rounded-full flex items-center justify-center mb-4",
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$mail$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Mail$3e$__["Mail"], {
                                                        className: "text-teal-600 dark:text-teal-400",
                                                        size: 24
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/landing/LandingPage.tsx",
                                                        lineNumber: 1188,
                                                        columnNumber: 19
                                                    }, ("TURBOPACK compile-time value", void 0))
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/landing/LandingPage.tsx",
                                                    lineNumber: 1187,
                                                    columnNumber: 17
                                                }, ("TURBOPACK compile-time value", void 0)),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                                    className: "font-bold text-slate-900 dark:text-white mb-1",
                                                    children: "Email Us"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/landing/LandingPage.tsx",
                                                    lineNumber: 1190,
                                                    columnNumber: 17
                                                }, ("TURBOPACK compile-time value", void 0)),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "text-sm text-teal-600 dark:text-teal-400 hover:underline",
                                                    children: "aachinancy@gmail.com"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/landing/LandingPage.tsx",
                                                    lineNumber: 1191,
                                                    columnNumber: 17
                                                }, ("TURBOPACK compile-time value", void 0))
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/landing/LandingPage.tsx",
                                            lineNumber: 1186,
                                            columnNumber: 15
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                            href: "tel:+18005550199",
                                            className: "block p-6 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-white/5 flex flex-col items-center text-center transition-transform hover:scale-105 cursor-pointer",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "w-12 h-12 bg-teal-100 dark:bg-teal-900/30 rounded-full flex items-center justify-center mb-4",
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$phone$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Phone$3e$__["Phone"], {
                                                        className: "text-teal-600 dark:text-teal-400",
                                                        size: 24
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/landing/LandingPage.tsx",
                                                        lineNumber: 1196,
                                                        columnNumber: 19
                                                    }, ("TURBOPACK compile-time value", void 0))
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/landing/LandingPage.tsx",
                                                    lineNumber: 1195,
                                                    columnNumber: 17
                                                }, ("TURBOPACK compile-time value", void 0)),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                                    className: "font-bold text-slate-900 dark:text-white mb-1",
                                                    children: "Call Us"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/landing/LandingPage.tsx",
                                                    lineNumber: 1198,
                                                    columnNumber: 17
                                                }, ("TURBOPACK compile-time value", void 0)),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "text-sm text-teal-600 dark:text-teal-400 hover:underline",
                                                    children: "+1 (800) 555-0199"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/landing/LandingPage.tsx",
                                                    lineNumber: 1199,
                                                    columnNumber: 17
                                                }, ("TURBOPACK compile-time value", void 0))
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/landing/LandingPage.tsx",
                                            lineNumber: 1194,
                                            columnNumber: 15
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                            href: "https://maps.google.com/?q=MMIP,MCC,Tambaram,600059",
                                            target: "_blank",
                                            rel: "noopener noreferrer",
                                            className: "block p-6 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-white/5 flex flex-col items-center text-center transition-transform hover:scale-105 cursor-pointer",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    className: "w-12 h-12 bg-teal-100 dark:bg-teal-900/30 rounded-full flex items-center justify-center mb-4",
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$map$2d$pin$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__MapPin$3e$__["MapPin"], {
                                                        className: "text-teal-600 dark:text-teal-400",
                                                        size: 24
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/landing/LandingPage.tsx",
                                                        lineNumber: 1204,
                                                        columnNumber: 19
                                                    }, ("TURBOPACK compile-time value", void 0))
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/landing/LandingPage.tsx",
                                                    lineNumber: 1203,
                                                    columnNumber: 17
                                                }, ("TURBOPACK compile-time value", void 0)),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                                    className: "font-bold text-slate-900 dark:text-white mb-1",
                                                    children: "Office"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/landing/LandingPage.tsx",
                                                    lineNumber: 1206,
                                                    columnNumber: 17
                                                }, ("TURBOPACK compile-time value", void 0)),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    className: "text-sm text-slate-600 dark:text-slate-400",
                                                    children: [
                                                        "MMIP, MCC, Tambaram",
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("br", {}, void 0, false, {
                                                            fileName: "[project]/src/components/landing/LandingPage.tsx",
                                                            lineNumber: 1207,
                                                            columnNumber: 97
                                                        }, ("TURBOPACK compile-time value", void 0)),
                                                        "600059"
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/components/landing/LandingPage.tsx",
                                                    lineNumber: 1207,
                                                    columnNumber: 17
                                                }, ("TURBOPACK compile-time value", void 0))
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/components/landing/LandingPage.tsx",
                                            lineNumber: 1202,
                                            columnNumber: 15
                                        }, ("TURBOPACK compile-time value", void 0))
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/landing/LandingPage.tsx",
                                    lineNumber: 1185,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0))
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/components/landing/LandingPage.tsx",
                            lineNumber: 1177,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0))
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/landing/LandingPage.tsx",
                    lineNumber: 1169,
                    columnNumber: 9
                }, ("TURBOPACK compile-time value", void 0))
            }, void 0, false, {
                fileName: "[project]/src/components/landing/LandingPage.tsx",
                lineNumber: 1168,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            isPlansModalOpen && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fadeIn",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "bg-white dark:bg-slate-900 rounded-3xl p-8 max-w-2xl w-full shadow-2xl relative border border-[#DDE5F0] dark:border-white/10",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            onClick: ()=>setIsPlansModalOpen(false),
                            className: "absolute top-4 right-4 text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__["X"], {
                                size: 24
                            }, void 0, false, {
                                fileName: "[project]/src/components/landing/LandingPage.tsx",
                                lineNumber: 1218,
                                columnNumber: 15
                            }, ("TURBOPACK compile-time value", void 0))
                        }, void 0, false, {
                            fileName: "[project]/src/components/landing/LandingPage.tsx",
                            lineNumber: 1217,
                            columnNumber: 13
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                            className: "text-2xl font-bold text-slate-900 dark:text-white mb-6",
                            children: "Premium Plan Details"
                        }, void 0, false, {
                            fileName: "[project]/src/components/landing/LandingPage.tsx",
                            lineNumber: 1220,
                            columnNumber: 13
                        }, ("TURBOPACK compile-time value", void 0)),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "space-y-4 max-h-[70vh] overflow-y-auto pr-2",
                            children: (()=>{
                                const FEATURE_LABEL_MAP = {
                                    v2t_live: `Live Voice-to-Text Speech Capture`,
                                    v2t_vocab: 'Custom Speech Vocabulary & Noise Filtering',
                                    v2t_export: 'Real-time Transcript Export (SRT/VTT)',
                                    t2v_neural: `Neural Multi-Speaker Voices`,
                                    t2v_controls: 'Pitch, Speed & Accent Controls',
                                    t2v_download: 'HD Audio Download (WAV / MP3)',
                                    trans_instant: `Instant Multi-Language Translation`,
                                    doc_5pages: 'Document Upload (Up to 5 Pages)',
                                    doc_25pages: 'Document Upload (Up to 25 Pages)',
                                    doc_parallel: 'High-Speed Parallel Document Chunking',
                                    audio_whatsapp: 'WhatsApp Audio Transcribe (.ogg/.m4a)',
                                    audio_long: 'Long Audio Processing (60+ mins)',
                                    audio_timestamps: 'Automated Timestamps & Word Counts',
                                    cloud_storage: `Cloud Storage & History`,
                                    custom_api: 'Custom API & Webhooks Access',
                                    audio_processing: `Live Voice-to-Text Speech Capture`,
                                    translation_services: `Fast Multi-Language Translation`,
                                    text_to_speech: `Voice Synthesis TTS`,
                                    read_aloud: 'Read Aloud & Audio Narration',
                                    whatsapp_audio: 'WhatsApp Audio Transcribe (.ogg/.m4a)',
                                    doc_ocr: 'Document OCR & PDF Intelligence',
                                    auto_detect: 'Multi-Language Auto Detection',
                                    custom_vocab: 'Custom AI Vocabulary & Glossary',
                                    parallel_chunks: 'High-Speed Parallel Processing',
                                    font_selector: 'Dynamic Font Family Selector',
                                    theme_toggle: 'Dark / Light Glassmorphism Theme',
                                    audio_export: 'Export HD Audio (WAV / MP3)',
                                    srt_vtt_export: 'Export Subtitles (SRT / VTT)',
                                    enterprise_support: '24/7 Dedicated Enterprise Support',
                                    tenant_branding: 'Custom Tenant Domain & Branding',
                                    audit_logs: 'Security & Audit Logging',
                                    high_priority_queue: 'High Priority Processing Queue',
                                    unlimited_history: 'Unlimited Activity History'
                                };
                                const plansToDisplay = dbPlans.length > 0 ? dbPlans : [
                                    {
                                        id: '1',
                                        name: 'Starter',
                                        price: 19,
                                        transcription_limit: 60,
                                        translation_limit: 100000,
                                        tts_limit: 50000,
                                        storage_limit: 500,
                                        features: [
                                            'v2t_live',
                                            't2v_neural',
                                            'trans_instant',
                                            'doc_5pages',
                                            'audio_whatsapp',
                                            'cloud_storage'
                                        ]
                                    },
                                    {
                                        id: '2',
                                        name: 'Professional',
                                        price: 49,
                                        transcription_limit: 300,
                                        translation_limit: 500000,
                                        tts_limit: 250000,
                                        storage_limit: 5000,
                                        features: [
                                            'v2t_live',
                                            'v2t_vocab',
                                            'v2t_export',
                                            't2v_neural',
                                            't2v_controls',
                                            't2v_download',
                                            'trans_instant',
                                            'doc_25pages',
                                            'audio_whatsapp',
                                            'audio_long',
                                            'cloud_storage'
                                        ]
                                    },
                                    {
                                        id: '3',
                                        name: 'Enterprise',
                                        price: 149,
                                        transcription_limit: 1200,
                                        translation_limit: 2000000,
                                        tts_limit: 1000000,
                                        storage_limit: 10000,
                                        features: [
                                            'v2t_live',
                                            'v2t_vocab',
                                            'v2t_export',
                                            't2v_neural',
                                            't2v_controls',
                                            't2v_download',
                                            'trans_instant',
                                            'doc_25pages',
                                            'doc_parallel',
                                            'audio_whatsapp',
                                            'audio_long',
                                            'audio_timestamps',
                                            'cloud_storage',
                                            'custom_api'
                                        ]
                                    }
                                ];
                                return plansToDisplay.map((plan)=>{
                                    const mPrice = plan.price;
                                    const displayPrice = billingCycle === "yearly" ? `₹${(mPrice * 10).toFixed(0)}/yr` : `₹${mPrice}/mo`;
                                    const featureLabels = plan.features && plan.features.length > 0 ? plan.features.map((fId)=>FEATURE_LABEL_MAP[fId] || fId) : [
                                        `${plan.transcription_limit} mins Voice-to-Text`,
                                        `Instant Translation`,
                                        `Text-to-Voice TTS`,
                                        `${plan.storage_limit} MB Storage`
                                    ];
                                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "p-5 border border-slate-200 dark:border-white/10 rounded-2xl bg-slate-50 dark:bg-slate-800/50 space-y-3",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex justify-between items-center border-b border-slate-200/60 dark:border-slate-700/60 pb-3",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                                        className: "font-extrabold text-lg text-slate-900 dark:text-white",
                                                        children: [
                                                            plan.name,
                                                            " Plan"
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/components/landing/LandingPage.tsx",
                                                        lineNumber: 1277,
                                                        columnNumber: 25
                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "text-base font-black text-teal-600 dark:text-teal-400",
                                                        children: displayPrice
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/landing/LandingPage.tsx",
                                                        lineNumber: 1278,
                                                        columnNumber: 25
                                                    }, ("TURBOPACK compile-time value", void 0))
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/components/landing/LandingPage.tsx",
                                                lineNumber: 1276,
                                                columnNumber: 23
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("ul", {
                                                className: "text-xs text-slate-700 dark:text-slate-300 grid grid-cols-1 sm:grid-cols-2 gap-2",
                                                children: featureLabels.map((featText, fIdx)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("li", {
                                                        className: "flex items-center gap-2",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$circle$2d$check$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__CheckCircle2$3e$__["CheckCircle2"], {
                                                                size: 14,
                                                                className: "text-teal-500 flex-shrink-0"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/components/landing/LandingPage.tsx",
                                                                lineNumber: 1283,
                                                                columnNumber: 29
                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                children: featText
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/components/landing/LandingPage.tsx",
                                                                lineNumber: 1284,
                                                                columnNumber: 29
                                                            }, ("TURBOPACK compile-time value", void 0))
                                                        ]
                                                    }, fIdx, true, {
                                                        fileName: "[project]/src/components/landing/LandingPage.tsx",
                                                        lineNumber: 1282,
                                                        columnNumber: 27
                                                    }, ("TURBOPACK compile-time value", void 0)))
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/landing/LandingPage.tsx",
                                                lineNumber: 1280,
                                                columnNumber: 23
                                            }, ("TURBOPACK compile-time value", void 0))
                                        ]
                                    }, plan.id, true, {
                                        fileName: "[project]/src/components/landing/LandingPage.tsx",
                                        lineNumber: 1275,
                                        columnNumber: 21
                                    }, ("TURBOPACK compile-time value", void 0));
                                });
                            })()
                        }, void 0, false, {
                            fileName: "[project]/src/components/landing/LandingPage.tsx",
                            lineNumber: 1222,
                            columnNumber: 13
                        }, ("TURBOPACK compile-time value", void 0))
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/components/landing/LandingPage.tsx",
                    lineNumber: 1216,
                    columnNumber: 11
                }, ("TURBOPACK compile-time value", void 0))
            }, void 0, false, {
                fileName: "[project]/src/components/landing/LandingPage.tsx",
                lineNumber: 1215,
                columnNumber: 9
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/landing/LandingPage.tsx",
        lineNumber: 262,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
_s1(LandingPage, "SwM9oZReuHsatuSd8k2VpxNopKQ=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$context$2f$AppContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useApp"]
    ];
});
_c3 = LandingPage;
var _c, _c1, _c2, _c3;
__turbopack_context__.k.register(_c, "StarburstIcon");
__turbopack_context__.k.register(_c1, "TextRollButton");
__turbopack_context__.k.register(_c2, "ThreeDInteractiveCard");
__turbopack_context__.k.register(_c3, "LandingPage");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=src_components_landing_0q4x1k5._.js.map