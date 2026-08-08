(globalThis["TURBOPACK"] || (globalThis["TURBOPACK"] = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/src/App.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$context$2f$AppContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/context/AppContext.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$common$2f$AuthModal$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/common/AuthModal.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$landing$2f$LandingPage$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/landing/LandingPage.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$workspace$2f$WorkspacePage$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/workspace/WorkspacePage.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$admin$2f$AdminLoginPage$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/admin/AdminLoginPage.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$admin$2f$ControllerLandingPage$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/admin/ControllerLandingPage.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$components$2f$AnimatePresence$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/framer-motion/dist/es/components/AnimatePresence/index.mjs [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/framer-motion/dist/es/render/components/motion/proxy.mjs [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
'use client';
;
;
;
;
;
;
;
;
function App() {
    _s();
    const { viewMode, setViewMode, setAuthModalMode, setIsAuthModalOpen, user, logout, activeTab, setActiveTab } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$context$2f$AppContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useApp"])();
    const hasInitialized = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRef"])(false);
    const [forceRender, setForceRender] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(0);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "App.useEffect": ()=>{
            const handlePopState = {
                "App.useEffect.handlePopState": ()=>setForceRender({
                        "App.useEffect.handlePopState": (f)=>f + 1
                    }["App.useEffect.handlePopState"])
            }["App.useEffect.handlePopState"];
            window.addEventListener('popstate', handlePopState);
            return ({
                "App.useEffect": ()=>window.removeEventListener('popstate', handlePopState)
            })["App.useEffect"];
        }
    }["App.useEffect"], []);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "App.useEffect": ()=>{
            if (!hasInitialized.current) {
                hasInitialized.current = true;
                const isSuperAdmin = user?.role === 'super_admin';
                if (window.location.pathname === '/controller' || window.location.pathname === '/controller/') {
                    setViewMode('controller-landing');
                } else if (window.location.pathname.startsWith('/controller/')) {
                    if (user && isSuperAdmin) {
                        setViewMode('workspace');
                        // Update active tab based on URL
                        const sub = window.location.pathname.replace('/controller/', '');
                        if (sub) setActiveTab(`sa-${sub}`);
                    } else {
                        setViewMode('controller-landing');
                    }
                } else if (window.location.pathname.startsWith('/dashboard')) {
                    if (!user) {
                        logout(); // Clear any invalid session
                        setAuthModalMode('login');
                        setIsAuthModalOpen(true);
                        setViewMode('landing');
                    } else {
                        // Already logged in
                        setViewMode('workspace');
                    }
                } else if (window.location.pathname === '/') {
                    // ALWAYS MUST BE LANDING PAGE
                    setViewMode('landing');
                } else {
                    // Any other path - fallback to landing
                    setViewMode('landing');
                }
            }
        }
    }["App.useEffect"], [
        user,
        setAuthModalMode,
        setIsAuthModalOpen,
        setViewMode,
        logout
    ]);
    // Ensure URL stays synchronized with viewMode and user role
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "App.useEffect": ()=>{
            if (viewMode === 'workspace') {
                if (!user) return;
                const path = window.location.pathname;
                const isSA = activeTab?.startsWith('sa-') || activeTab === 'super-admin-dashboard';
                if (user.role === 'super_admin') {
                    // Super admin handling
                    if (path.startsWith('/dashboard') && isSA) {
                        setActiveTab('text-to-speech');
                    } else if (path.startsWith('/controller') && !isSA) {
                        setActiveTab('sa-overview');
                    } else {
                        const saPath = activeTab === 'sa-overview' ? '/controller' : `/controller/${activeTab.replace('sa-', '')}`;
                        window.history.replaceState({}, '', isSA ? saPath : `/dashboard/${activeTab}`);
                    }
                } else {
                    // Normal user must not be on /controller
                    if (path.startsWith('/controller')) {
                        window.history.replaceState({}, '', `/dashboard/${activeTab}`);
                    }
                    if (isSA) {
                        setActiveTab('text-to-speech');
                    } else {
                        window.history.replaceState({}, '', `/dashboard/${activeTab}`);
                    }
                }
            } else if (viewMode === 'admin-login' || viewMode === 'controller-landing') {
                if (!window.location.pathname.startsWith('/controller')) {
                    window.history.replaceState({}, '', '/controller');
                }
            } else {
                // Landing mode
                if (window.location.pathname !== '/') {
                    window.history.replaceState({}, '', '/');
                }
            }
        }
    }["App.useEffect"], [
        viewMode,
        user?.role,
        activeTab,
        setActiveTab,
        forceRender
    ]);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "flex min-h-screen flex-col",
        style: {
            background: 'var(--bg-base)',
            color: 'var(--text-primary)'
        },
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$common$2f$AuthModal$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AuthModal"], {}, void 0, false, {
                fileName: "[project]/src/App.tsx",
                lineNumber: 103,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$components$2f$AnimatePresence$2f$index$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AnimatePresence"], {
                mode: "wait",
                children: viewMode === 'landing' ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].div, {
                    initial: {
                        opacity: 0
                    },
                    animate: {
                        opacity: 1
                    },
                    exit: {
                        opacity: 0
                    },
                    transition: {
                        duration: 0.2
                    },
                    className: "flex-1",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$landing$2f$LandingPage$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["LandingPage"], {}, void 0, false, {
                        fileName: "[project]/src/App.tsx",
                        lineNumber: 114,
                        columnNumber: 13
                    }, this)
                }, "landing", false, {
                    fileName: "[project]/src/App.tsx",
                    lineNumber: 106,
                    columnNumber: 11
                }, this) : viewMode === 'controller-landing' ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].div, {
                    initial: {
                        opacity: 0
                    },
                    animate: {
                        opacity: 1
                    },
                    exit: {
                        opacity: 0
                    },
                    transition: {
                        duration: 0.2
                    },
                    className: "flex-1",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$admin$2f$ControllerLandingPage$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["ControllerLandingPage"], {}, void 0, false, {
                        fileName: "[project]/src/App.tsx",
                        lineNumber: 125,
                        columnNumber: 13
                    }, this)
                }, "controller-landing", false, {
                    fileName: "[project]/src/App.tsx",
                    lineNumber: 117,
                    columnNumber: 11
                }, this) : viewMode === 'admin-login' ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].div, {
                    initial: {
                        opacity: 0
                    },
                    animate: {
                        opacity: 1
                    },
                    exit: {
                        opacity: 0
                    },
                    transition: {
                        duration: 0.2
                    },
                    className: "flex-1",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$admin$2f$AdminLoginPage$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["AdminLoginPage"], {}, void 0, false, {
                        fileName: "[project]/src/App.tsx",
                        lineNumber: 136,
                        columnNumber: 13
                    }, this)
                }, "admin-login", false, {
                    fileName: "[project]/src/App.tsx",
                    lineNumber: 128,
                    columnNumber: 11
                }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$client$5d$__$28$ecmascript$29$__["motion"].div, {
                    initial: {
                        opacity: 0
                    },
                    animate: {
                        opacity: 1
                    },
                    exit: {
                        opacity: 0
                    },
                    transition: {
                        duration: 0.2
                    },
                    className: "flex-1",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$workspace$2f$WorkspacePage$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["WorkspacePage"], {}, void 0, false, {
                        fileName: "[project]/src/App.tsx",
                        lineNumber: 147,
                        columnNumber: 13
                    }, this)
                }, "workspace", false, {
                    fileName: "[project]/src/App.tsx",
                    lineNumber: 139,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/App.tsx",
                lineNumber: 104,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/App.tsx",
        lineNumber: 102,
        columnNumber: 5
    }, this);
}
_s(App, "qLvQnFAvAwiS+T6Bt4x4qjA20wo=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$context$2f$AppContext$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useApp"]
    ];
});
_c = App;
const __TURBOPACK__default__export__ = App;
var _c;
__turbopack_context__.k.register(_c, "App");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/App.tsx [app-client] (ecmascript, next/dynamic entry)", (function(__turbopack_context__){

__turbopack_context__.n(__turbopack_context__.i("[project]/src/App.tsx [app-client] (ecmascript)"));
}),
"[project]/src/providers/providerManager.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "providerManager",
    ()=>providerManager
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/utils/api.ts [app-client] (ecmascript)");
;
const providerManager = {
    /**
   * Synthesize text to speech via FastAPI SaaS tool proxy
   */ async getActiveProviders () {
        try {
            const data = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["apiRequest"])("/tools/active-providers");
            return data || {};
        } catch (e) {
            return {};
        }
    },
    /**
   * Synthesize text to speech via FastAPI SaaS tool proxy
   */ async synthesizeSpeech (text, voice, _openAiKey, _elevenLabsKey) {
        const formData = new FormData();
        formData.append("text", text);
        formData.append("voice", voice);
        const data = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["apiRequest"])("/tools/synthesize", {
            method: "POST",
            body: formData
        });
        // Fallback stream playback URL or simulated synthesized sound
        return data.audio_url || "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3";
    },
    /**
   * Transcribe uploaded audio file via FastAPI SaaS tool proxy
   */ async transcribeAudio (file, _openAiKey, _deepgramKey, language = 'en') {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("language", language);
        formData.append("feature_name", "Audio To Text");
        const data = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["apiRequest"])("/tools/transcribe", {
            method: "POST",
            body: formData
        });
        return data.text || "";
    },
    /**
   * Real-time Voice Recording / Transcription (with failover handled in FastAPI backend)
   */ async transcribeVoice (file, _openAiKey, _deepgramKey, language = 'en-US', _onFailover) {
        const langCode = language.split('-')[0];
        const formData = new FormData();
        formData.append("file", file);
        formData.append("language", langCode);
        formData.append("feature_name", "Transcription");
        const data = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["apiRequest"])("/tools/transcribe", {
            method: "POST",
            body: formData
        });
        return {
            text: data.text || "",
            finalProvider: data.provider || "openai"
        };
    },
    /**
   * Translate text via FastAPI SaaS tool proxy
   */ async translateText (text, sourceLang, targetLang, _openAiKey, _deepLKey) {
        const formData = new FormData();
        formData.append("text", text);
        formData.append("source_lang", sourceLang);
        formData.append("target_lang", targetLang);
        const data = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["apiRequest"])("/tools/translate", {
            method: "POST",
            body: formData
        });
        return {
            text: data.text || data.translated_text || "",
            detectedLang: data.detected_lang || ""
        };
    }
};
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/services/ttsService.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ttsService",
    ()=>ttsService
]);
const ttsAudioCache = new Map();
class TTSService {
    state = 'idle';
    options;
    currentChunks = [];
    currentChunkIndex = 0;
    langCode = 'en-US';
    langName = 'English';
    currentAudioFallback = null;
    voicesLoaded = false;
    langMap = {
        'English': 'en-US',
        'Tamil': 'ta-IN',
        'Hindi': 'hi-IN',
        'Spanish': 'es-ES',
        'French': 'fr-FR',
        'German': 'de-DE',
        'Portuguese': 'pt-PT',
        'Arabic': 'ar-SA',
        'Japanese': 'ja-JP',
        'Korean': 'ko-KR',
        'Chinese (Simplified)': 'zh-CN',
        'Russian': 'ru-RU',
        'Italian': 'it-IT',
        'Malayalam': 'ml-IN',
        'Telugu': 'te-IN',
        'Dutch': 'nl-NL',
        'Polish': 'pl-PL',
        'Turkish': 'tr-TR',
        'Vietnamese': 'vi-VN',
        'Thai': 'th-TH',
        'Indonesian': 'id-ID',
        'Bengali': 'bn-IN',
        'Urdu': 'ur-PK',
        'Swahili': 'sw-KE'
    };
    constructor(){
        if (("TURBOPACK compile-time value", "object") !== 'undefined' && 'speechSynthesis' in window) {
            this.refreshVoices();
            window.speechSynthesis.onvoiceschanged = ()=>{
                this.refreshVoices();
            };
        }
    }
    refreshVoices() {
        const voices = window.speechSynthesis.getVoices();
        if (voices.length > 0) {
            this.voicesLoaded = true;
        }
        return voices;
    }
    setState(newState) {
        console.log(`TTS State changed: ${this.state} -> ${newState}`);
        this.state = newState;
        if (this.options?.onStateChange) {
            this.options.onStateChange(newState);
        }
    }
    async ensureVoicesLoaded() {
        return new Promise((resolve)=>{
            let voices = this.refreshVoices();
            if (voices.length > 0) {
                resolve(voices);
                return;
            }
            console.log("TTS: Waiting for onvoiceschanged before selecting a voice...");
            window.speechSynthesis.onvoiceschanged = ()=>{
                voices = this.refreshVoices();
                console.log(`TTS: onvoiceschanged fired. Loaded ${voices.length} voices.`);
                resolve(voices);
            };
            // Fallback timeout in case onvoiceschanged never fires
            setTimeout(()=>{
                voices = this.refreshVoices();
                console.log(`TTS: Timeout reached. Loaded ${voices.length} voices.`);
                resolve(voices);
            }, 1000);
        });
    }
    async play(text, langName, options) {
        this.stop(); // Clean up anything currently running
        this.options = options;
        // Auto Detect uses English as a fallback if detected language isn't passed properly
        this.langName = langName === 'Auto Detect' ? 'English' : langName;
        this.langCode = this.langMap[this.langName] || 'en-US';
        if (!text.trim()) {
            this.setState('idle');
            return;
        }
        // Split long text into chunks by sentence endings to prevent speech engine from cutting out
        const sentenceChunks = text.match(/[^.!?]+[.!?]+|\s*[^.!?]+$/g) || [
            text
        ];
        // Further split chunks that are too long (e.g., > 200 chars)
        this.currentChunks = sentenceChunks.flatMap((chunk)=>{
            if (chunk.length <= 200) return [
                chunk
            ];
            return chunk.match(/.{1,200}(\s|$)/g) || [
                chunk
            ];
        }).map((c)=>c.trim()).filter(Boolean);
        this.currentChunkIndex = 0;
        this.setState('playing');
        await this.speakNextChunk();
    }
    pause() {
        if (this.state === 'playing') {
            if (this.currentAudioFallback) {
                this.currentAudioFallback.pause();
            } else {
                window.speechSynthesis.pause();
            }
            this.setState('paused');
        }
    }
    resume() {
        if (this.state === 'paused') {
            if (this.currentAudioFallback) {
                this.currentAudioFallback.play();
            } else {
                window.speechSynthesis.resume();
            }
            this.setState('playing');
        }
    }
    stop() {
        window.speechSynthesis.cancel();
        if (this.currentAudioFallback) {
            this.currentAudioFallback.pause();
            this.currentAudioFallback.currentTime = 0;
            this.currentAudioFallback = null;
        }
        this.currentChunks = [];
        this.currentChunkIndex = 0;
        if (this.state !== 'idle') {
            this.setState('idle');
        }
    }
    async speakNextChunk() {
        if (this.currentChunkIndex >= this.currentChunks.length) {
            console.log("TTS: Finished all chunks.");
            this.setState('idle');
            return;
        }
        const chunk = this.currentChunks[this.currentChunkIndex];
        console.log(`TTS: speakNextChunk index ${this.currentChunkIndex}/${this.currentChunks.length}. Lang requested: ${this.langCode}`);
        // 1. Reload all available SpeechSynthesis voices
        // 2. Wait for speechSynthesis.onvoiceschanged before selecting a voice
        // 3. Refresh the voice list using speechSynthesis.getVoices()
        const voices = await this.ensureVoicesLoaded();
        const baseLang = this.langCode.split('-')[0];
        // 7. Log Total voices available
        console.log(`TTS: Total voices available: ${voices.length}`);
        let voice;
        if (baseLang === 'ta') {
            // 4. When the selected language is Tamil: Automatically select the best available ta-IN voice. Do not use any English voice.
            // 5. Verify that the selected voice language starts with: ta
            const tamilVoices = voices.filter((v)=>v.lang.toLowerCase().startsWith('ta') || v.name.toLowerCase().includes('tamil'));
            console.log(`TTS: Tamil voices found: ${tamilVoices.length}`);
            if (tamilVoices.length > 0) {
                // 9. If multiple Tamil voices exist, automatically select the highest quality voice.
                // Google voices are typically higher quality, then Microsoft. Also check localService if possible.
                voice = tamilVoices.find((v)=>v.name.includes('Google') || !v.localService) || tamilVoices.find((v)=>v.name.includes('Microsoft')) || tamilVoices[0];
                console.log(`TTS: Selected Tamil voice: "${voice.name}"`);
                console.log(`TTS: Voice language: ${voice.lang}`);
            // 8. If a Tamil voice is found, disable the fallback warning: "No native voice found for Tamil."
            // (This happens automatically because voice is defined and isFallback is false)
            }
        } else {
            // 13. Ensure the same implementation works for all supported languages
            // Exact match
            voice = voices.find((v)=>v.lang === this.langCode);
            // Base language match
            if (!voice) {
                voice = voices.find((v)=>v.lang.startsWith(baseLang));
            }
            // Name match
            if (!voice) {
                voice = voices.find((v)=>v.name.toLowerCase().includes(this.langName.toLowerCase()));
            }
            if (voice) {
                console.log(`TTS: Selected native voice: "${voice.name}"`);
                console.log(`TTS: Voice language: ${voice.lang}`);
            }
        }
        if (!voice && baseLang !== 'ta') {
            console.log(`TTS: No native voice found for ${this.langCode} (${this.langName}).`);
        }
        // 6. If a Tamil voice exists, always use it instead of the online fallback.
        let isFallback = false;
        if (!voice) {
            isFallback = true;
        }
        if (isFallback) {
            console.log(`TTS: Native voice found: false`);
            console.log(`TTS: Trying online provider failover loop...`);
            if (this.currentChunkIndex === 0 && this.options?.onWarning) {
                this.options.onWarning(`Using cloud ${this.langName} voice.`);
            }
            const cacheKey = `${this.langCode}_${chunk}`;
            let audioUrl = "";
            if (ttsAudioCache.has(cacheKey)) {
                audioUrl = ttsAudioCache.get(cacheKey);
                console.log(`TTS: Cache Hit! Reusing previously generated audio for chunk.`);
            } else {
                // Zero-Key Google TTS Fallback for all languages
                const googleLangCode = this.langCode.split('-')[0];
                audioUrl = `https://translate.google.com/translate_tts?ie=UTF-8&tl=${googleLangCode}&client=tw-ob&q=${encodeURIComponent(chunk.substring(0, 200))}`;
                ttsAudioCache.set(cacheKey, audioUrl);
                if (!audioUrl) {
                    const finalErrorMsg = "TTS audio generation failed.";
                    console.error(`TTS: All configured online fallback providers failed. Errors: ${finalErrorMsg}`);
                    if (this.options?.onWarning) {
                        this.options.onWarning(`Online TTS Providers Failed. ${finalErrorMsg}`);
                    }
                    this.setState('error');
                    return;
                }
            }
            this.currentAudioFallback = new Audio(audioUrl);
            this.currentAudioFallback.onplay = ()=>{
                // 7. Log Speech started
                console.log(`TTS: Speech started [Online Fallback]`);
            };
            this.currentAudioFallback.onended = ()=>{
                // 7. Log Speech ended
                console.log(`TTS: Speech ended [Online Fallback]`);
                console.log(`TTS: Online chunk finished.`);
                this.currentAudioFallback = null;
                this.currentChunkIndex++;
                this.speakNextChunk();
            };
            this.currentAudioFallback.onerror = (e)=>{
                // 7. Log Any speech errors
                console.error("TTS: Any speech errors: Audio Playback Error:", e);
                if (this.options?.onWarning) {
                    this.options.onWarning("Browser failed to decode or play the audio stream. Invalid audio format.");
                }
                this.currentAudioFallback = null;
                this.setState('error');
            };
            try {
                console.log(`TTS: Playback started...`);
                await this.currentAudioFallback.play();
                console.log(`TTS: Audio playback confirmed active by browser.`);
                return;
            } catch (e) {
                console.error(`TTS: Any speech errors: Play promise rejected by browser:`, e.message);
                if (this.options?.onWarning) {
                    this.options.onWarning(`Audio playback blocked by browser: ${e.message}`);
                }
                this.setState('error');
                return;
            }
        }
        // 10. Ensure the Listen button correctly reads complete Tamil Unicode text
        const utt = new SpeechSynthesisUtterance(chunk);
        utt.lang = this.langCode;
        if (voice) {
            utt.voice = voice;
            // explicitly enforce language for the utterance to match the native voice if needed
            if (baseLang === 'ta') {
                utt.lang = voice.lang || 'ta-IN';
            }
        }
        utt.onstart = ()=>{
            // 7. Log Speech started
            console.log(`TTS: Speech started [Native]`);
        };
        utt.onend = ()=>{
            // 7. Log Speech ended
            console.log(`TTS: Speech ended [Native]`);
            console.log(`TTS: Native chunk finished.`);
            this.currentChunkIndex++;
            this.speakNextChunk();
        };
        utt.onerror = (e)=>{
            if (e.error !== 'canceled' && e.error !== 'interrupted') {
                // 7. Log Any speech errors
                console.error("TTS: Any speech errors: SpeechSynthesis Error:", e);
                if (this.options?.onWarning) {
                    this.options.onWarning(`Audio playback encountered an error: ${e.error}`);
                }
                this.setState('error');
            } else {
                console.log(`TTS: Speech ${e.error} [Native]`);
            }
        };
        console.log(`TTS: Playing native speech chunk: "${chunk.substring(0, 30)}..."`);
        window.speechSynthesis.speak(utt);
    }
    getState() {
        return this.state;
    }
}
const ttsService = new TTSService();
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=src_1eo2hrt._.js.map