import { useState, useEffect, useRef, useCallback } from 'react'
import { Link } from 'react-router-dom'
import {
  ArrowRight, Star, Sparkles, Shield, Leaf,
  ChevronLeft, ChevronRight, Phone, Mail,
  Search, X, ZoomIn, Building2
} from 'lucide-react'
import logoImg from '../assets/logo.png'
import STORY_IMG from '../assets/DSC_1073.jpg'

/* ─── Static data ────────────────────────────────────────────── */
const features = [
  { icon: Sparkles, title: 'Crafted for African Hair', desc: 'Formulations developed specifically for the textures, needs, and styles of African hair — effective by design, not by chance.' },
  { icon: Leaf,     title: 'Quality in Every Batch',   desc: 'Consistent formulation standards and controlled production ensure every product performs exactly as expected.' },
  { icon: Shield,   title: 'Reliable Manufacturing',   desc: 'From careful raw material selection through to finished product, quality is built into every step of what we do.' },
]
const reviews = [
  { name: 'Mercy W.',  role: 'Salon Owner',         text: '"The Joi Moulding Gel Wax gives my clients the cleanest, longest-lasting styles. It has become a staple product in our salon."', stars: 5 },
  { name: 'Fatuma A.', role: 'Loyal Customer',       text: '"The Leave-In Treatment has completely transformed my hair routine. Lightweight, actually effective, and smells amazing."', stars: 5 },
  { name: 'Brian O.',  role: 'Distributor, Mombasa', text: '"Consistent quality and great packaging every time. Joi products practically sell themselves once customers try them."', stars: 5 },
]

const HERO_BG = 'https://images.pexels.com/photos/3065209/pexels-photo-3065209.jpeg?auto=compress&cs=tinysrgb&w=1600'
const API_URL = 'https://joy-beauty-shop-dashboard.onrender.com/api/products'

/* ─── Cache helpers ──────────────────────────────────────────── */
const CACHE_KEY = 'joi_products_v2'
const CACHE_TTL = 1000 * 60 * 5

function readCache() {
  try {
    const raw = localStorage.getItem(CACHE_KEY)
    if (!raw) return null
    const { data, ts } = JSON.parse(raw)
    return { data, expired: Date.now() - ts > CACHE_TTL }
  } catch { return null }
}

function writeCache(data) {
  try { localStorage.setItem(CACHE_KEY, JSON.stringify({ data, ts: Date.now() })) } catch {}
}

/* ─── Global styles ──────────────────────────────────────────── */
const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400&family=Montserrat:wght@400;500;600;700&display=swap');

  *, *::before, *::after { box-sizing: border-box; }

  @keyframes floatA      { 0%,100%{transform:translateY(0)}           50%{transform:translateY(-14px)} }
  @keyframes orbFloat    { 0%,100%{transform:translate(0,0)}          33%{transform:translate(10px,-14px)} 66%{transform:translate(-7px,8px)} }
  @keyframes fadeIn      { from{opacity:0}                            to{opacity:1} }
  @keyframes fadeUp      { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
  @keyframes shimmer     { to{background-position:200% center} }
  @keyframes skeletonPulse { 0%,100%{opacity:.6} 50%{opacity:1} }
  @keyframes marquee     { from{transform:translateX(0)}              to{transform:translateX(-50%)} }
  @keyframes blink       { 0%,100%{opacity:.3}                        50%{opacity:1} }
  @keyframes pulseGlow   { 0%,100%{box-shadow:0 0 0 0 rgba(160,104,0,0)} 50%{box-shadow:0 0 20px 5px rgba(160,104,0,.14)} }
  @keyframes lineGrow    { from{width:0}                              to{width:52px} }
  @keyframes backdropIn  { from{opacity:0}                            to{opacity:1} }
  @keyframes modalIn     { from{opacity:0;transform:scale(.97) translateY(12px)} to{opacity:1;transform:scale(1) translateY(0)} }

  /* ── Skeleton ── */
  .joi-skeleton {
    background: linear-gradient(90deg,#ede9e2 0%,#e4dfd5 50%,#ede9e2 100%);
    background-size: 300% 100%;
    animation: skeletonPulse 1.8s ease-in-out infinite;
  }

  /* ── LQIP image ── */
  .joi-img-wrap { position:relative; overflow:hidden; width:100%; height:100%; }
  .joi-img-lqip {
    position:absolute; inset:0; width:100%; height:100%;
    object-fit:cover; object-position:center top;
    filter:blur(14px); transform:scale(1.1);
    transition:opacity .5s ease;
  }
  .joi-img-main {
    position:relative; width:100%; height:100%;
    object-fit:cover; object-position:center top;
    opacity:0; transition:opacity .6s ease; display:block;
  }
  .joi-img-main.loaded { opacity:1; }
  .joi-img-lqip.hidden { opacity:0; pointer-events:none; }

  /* ── Desktop product card ── */
  .joi-desk-card {
    background:#fff;
    border:1px solid #e0dbd0;
    border-radius:2px;
    overflow:hidden;
    cursor:pointer;
    transition:transform .45s cubic-bezier(.25,.46,.45,.94),
               box-shadow .45s cubic-bezier(.25,.46,.45,.94),
               border-color .25s;
    display:flex;
    flex-direction:column;
    will-change:transform;
  }
  .joi-desk-card:hover {
    transform:translateY(-10px) scale(1.013);
    box-shadow:0 28px 64px rgba(0,0,0,.13), 0 6px 18px rgba(0,0,0,.06);
    border-color:rgba(140,90,0,.45);
  }
  .joi-desk-card-img {
    position:relative;
    height:340px;
    overflow:hidden;
    background:#f5f3ee;
    flex-shrink:0;
  }
  .joi-desk-card-img > .joi-img-wrap img {
    transition:transform .65s cubic-bezier(.25,.46,.45,.94);
  }
  .joi-desk-card:hover .joi-desk-card-img > .joi-img-wrap img {
    transform:scale(1.07);
  }
  .joi-desk-card-body {
    padding:1.4rem 1.5rem 1.7rem;
    flex:1; display:flex; flex-direction:column;
    border-top:1px solid #f0ece4;
  }
  .joi-desk-zoom-overlay {
    position:absolute; inset:0;
    display:flex; align-items:center; justify-content:center;
    opacity:0; transition:opacity .28s;
    pointer-events:none;
    background:rgba(0,0,0,.06);
  }
  .joi-desk-card:hover .joi-desk-zoom-overlay { opacity:1; }

  /* ── Mobile product grid ── */
  .joi-prod-grid {
    display:grid;
    grid-template-columns:repeat(2,1fr);
    gap:14px;
    padding:0 16px;
  }
  .joi-prod-card {
    background:#fff;
    border-radius:16px;
    overflow:hidden;
    border:1px solid #e8e2d8;
    box-shadow:0 2px 12px rgba(0,0,0,.06);
    cursor:pointer;
    transition:transform .3s ease, box-shadow .3s ease;
    display:flex;
    flex-direction:column;
  }
  .joi-prod-card:active { transform:scale(0.97); }
  .joi-prod-body { padding:10px 10px 14px; flex:1; display:flex; flex-direction:column; }
  .joi-prod-cat  { font-size:9px; letter-spacing:.14em; text-transform:uppercase; color:rgba(140,90,0,.6); margin-bottom:4px; font-family:'Montserrat',sans-serif; }
  .joi-prod-name { font-size:.88rem; font-weight:400; font-family:'Cormorant Garamond',serif; color:#1a1a1a; line-height:1.35; margin:0; }
  .joi-prod-tap  { margin-top:8px; font-size:9px; color:#a06800; letter-spacing:.06em; font-family:'Montserrat',sans-serif; }

  /* ── Slider scrollbar hide ── */
  .joi-slider::-webkit-scrollbar { display:none; }
  .joi-slider { -ms-overflow-style:none; scrollbar-width:none; }

  /* ── Lightbox thumbstrip ── */
  .joi-thumbstrip::-webkit-scrollbar { display:none; }
  .joi-thumbstrip { -ms-overflow-style:none; scrollbar-width:none; }

  /* ── Feature card ── */
  .joi-feature-card {
    display:flex; flex-direction:column; align-items:center; text-align:center;
    padding:2.8rem 2rem;
    border:1px solid #e8e2d8;
    background:#faf9f6;
    transition:transform .35s ease, box-shadow .35s ease, border-color .25s, background .25s;
  }
  .joi-feature-card:hover {
    transform:translateY(-6px);
    box-shadow:0 18px 52px rgba(0,0,0,.09);
    border-color:rgba(140,90,0,.3);
    background:#fff;
  }

  /* ── Testimonial card ── */
  .joi-testi-card {
    padding:2.4rem 2rem;
    border:1px solid #e8e2d8;
    background:#faf9f6;
    cursor:pointer;
    border-radius:4px;
    transition:all .35s ease;
  }
  .joi-testi-card.active, .joi-testi-card:hover {
    background:#fff;
    border-color:rgba(140,90,0,.38);
    box-shadow:0 10px 44px rgba(0,0,0,.09);
    transform:translateY(-4px);
  }

  /* ── Search bar ── */
  .joi-search-wrap {
    position:relative; border:1.5px solid #ddd8cf;
    background:#fff; display:flex; align-items:center;
    border-radius:3px; transition:border-color .25s, box-shadow .25s;
  }
  .joi-search-wrap.focused {
    border-color:#a06800;
    box-shadow:0 0 0 4px rgba(160,104,0,.1);
  }
  .joi-search-input {
    flex:1; padding:14px 14px; background:transparent;
    border:none; outline:none; color:#1a1a1a;
    font-size:14px; font-family:'Montserrat',sans-serif;
  }

  /* ── Category pill ── */
  .joi-cat-pill {
    padding:8px 18px;
    border:1px solid #e0dbd0;
    background:transparent;
    color:#888;
    font-size:9.5px; letter-spacing:.18em; text-transform:uppercase;
    cursor:pointer; transition:all .22s;
    font-family:'Montserrat',sans-serif; white-space:nowrap;
    border-radius:2px;
  }
  .joi-cat-pill:hover { border-color:rgba(140,90,0,.4); color:#a06800; }
  .joi-cat-pill.active {
    background:rgba(160,104,0,.1);
    border-color:rgba(140,90,0,.55);
    color:#a06800;
  }
  @media (max-width:640px) {
    .joi-cat-pill { border-radius:20px; }
  }

  /* ── Mobile hero tweaks ── */
  @media (max-width:480px) {
    .hero-title { font-size:clamp(2rem,11vw,3rem) !important; }
    .hero-sub   { font-size:.78rem !important; }
    .hero-btns  { flex-direction:column !important; align-items:stretch !important; }
    .hero-btns a { text-align:center !important; }
    .wt-badge   { flex-direction:column !important; gap:4px !important; }
  }
`

let stylesInjected = false
function injectStyles() {
  if (stylesInjected || typeof document === 'undefined') return
  const el = document.createElement('style')
  el.textContent = STYLES
  document.head.appendChild(el)
  stylesInjected = true
}

/* ─── Preload images ──────────────────────────────────────────── */
function preloadImages(products, count = 4) {
  if (typeof document === 'undefined') return
  products.slice(0, count).forEach(p => {
    if (!p.img) return
    const link = document.createElement('link')
    link.rel = 'preload'; link.as = 'image'; link.href = p.img
    if (p.img_sm) link.imageSrcset = `${p.img_sm} 300w, ${p.img} 600w`
    document.head.appendChild(link)
  })
}

/* ─── Hooks ──────────────────────────────────────────────────── */
function useVisible(threshold = 0.08) {
  const ref = useRef(null)
  const [vis, setVis] = useState(false)
  useEffect(() => {
    const el = ref.current; if (!el) return
    const o = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVis(true); o.disconnect() } },
      { threshold }
    )
    o.observe(el); return () => o.disconnect()
  }, [threshold])
  return { ref, vis }
}

function useIsMobile() {
  const [mobile, setMobile] = useState(
    () => typeof window !== 'undefined' ? window.innerWidth < 640 : false
  )
  useEffect(() => {
    const c = () => setMobile(window.innerWidth < 640)
    window.addEventListener('resize', c); return () => window.removeEventListener('resize', c)
  }, [])
  return mobile
}

/* ─── Progressive image ───────────────────────────────────────── */
function ProgressiveImage({ src, srcSet, sizes, lqip, alt = '', style = {}, className = '', eager = false }) {
  const [loaded, setLoaded] = useState(false)
  const imgRef = useRef(null)
  useEffect(() => { if (imgRef.current?.complete) setLoaded(true) }, [])
  return (
    <div className="joi-img-wrap" style={style}>
      <img
        ref={imgRef}
        src={src} srcSet={srcSet} sizes={sizes} alt={alt}
        loading={eager ? 'eager' : 'lazy'}
        decoding="async"
        fetchpriority={eager ? 'high' : 'auto'}
        className={`joi-img-main${loaded ? ' loaded' : ''} ${className}`}
        onLoad={() => setLoaded(true)}
      />
      {lqip && <img src={lqip} alt="" aria-hidden="true" className={`joi-img-lqip${loaded ? ' hidden' : ''}`} />}
    </div>
  )
}

/* ─── Skeleton cards ─────────────────────────────────────────── */
function SkeletonDesktopCard() {
  return (
    <div style={{ border:'1px solid #e8e2d8', borderRadius:2, overflow:'hidden', background:'#fff' }}>
      <div className="joi-skeleton" style={{ height:340, width:'100%' }} />
      <div style={{ padding:'1.4rem 1.5rem 1.7rem' }}>
        <div className="joi-skeleton" style={{ height:11, width:'38%', borderRadius:3, marginBottom:14 }} />
        <div className="joi-skeleton" style={{ height:22, width:'72%', borderRadius:3, marginBottom:14 }} />
        <div className="joi-skeleton" style={{ height:11, width:'100%', borderRadius:3, marginBottom:6 }} />
        <div className="joi-skeleton" style={{ height:11, width:'82%', borderRadius:3, marginBottom:6 }} />
        <div className="joi-skeleton" style={{ height:11, width:'58%', borderRadius:3 }} />
      </div>
    </div>
  )
}

function SkeletonMobileCard() {
  return (
    <div className="joi-prod-card" style={{ pointerEvents:'none' }}>
      <div className="joi-skeleton" style={{ width:'100%', aspectRatio:'3/4' }} />
      <div className="joi-prod-body">
        <div className="joi-skeleton" style={{ height:8, width:'50%', borderRadius:3, marginBottom:8 }} />
        <div className="joi-skeleton" style={{ height:14, width:'85%', borderRadius:3, marginBottom:6 }} />
        <div className="joi-skeleton" style={{ height:9, width:'35%', borderRadius:3, marginTop:8 }} />
      </div>
    </div>
  )
}

/* ─── Lightbox ───────────────────────────────────────────────── */
function Lightbox({ product, products = [], onClose }) {
  const [zoomed, setZoomed]       = useState(false)
  const [panX, setPanX]           = useState(0)
  const [panY, setPanY]           = useState(0)
  const [isPanning, setIsPanning] = useState(false)
  const panStart                  = useRef(null)
  const isMobile                  = typeof window !== 'undefined' && window.innerWidth < 640

  const startIdx = products.findIndex(p => (p.id ?? p.name) === (product.id ?? product.name))
  const [currentIdx, setCurrentIdx] = useState(startIdx >= 0 ? startIdx : 0)
  const current = products.length > 0 ? products[currentIdx] : product

  const goPrev = useCallback(() => { setZoomed(false); setPanX(0); setPanY(0); setCurrentIdx(i => Math.max(0, i - 1)) }, [])
  const goNext = useCallback(() => { setZoomed(false); setPanX(0); setPanY(0); setCurrentIdx(i => Math.min(products.length - 1, i + 1)) }, [products.length])

  useEffect(() => {
    const h = e => {
      if (e.key === 'Escape')     onClose()
      if (e.key === 'ArrowLeft')  goPrev()
      if (e.key === 'ArrowRight') goNext()
    }
    document.addEventListener('keydown', h)
    document.body.style.overflow = 'hidden'
    return () => { document.removeEventListener('keydown', h); document.body.style.overflow = '' }
  }, [onClose, goPrev, goNext])

  useEffect(() => { if (!zoomed) { setPanX(0); setPanY(0) } }, [zoomed, currentIdx])

  const onPointerDown = e => {
    if (!zoomed) return
    setIsPanning(true)
    panStart.current = { x: e.clientX - panX, y: e.clientY - panY }
    e.currentTarget.setPointerCapture(e.pointerId)
  }
  const onPointerMove = e => {
    if (!isPanning || !panStart.current) return
    setPanX(e.clientX - panStart.current.x)
    setPanY(e.clientY - panStart.current.y)
  }
  const onPointerUp = () => { setIsPanning(false); panStart.current = null }

  const hasPrev = currentIdx > 0
  const hasNext = currentIdx < products.length - 1
  const zoomSrc = current.img_zoom || current.img

  return (
    <div onClick={onClose} style={{ position:'fixed', inset:0, zIndex:9999, background:'rgba(0,0,0,.95)', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', animation:'backdropIn .22s ease' }}>
      {/* Top bar */}
      <div onClick={e => e.stopPropagation()} style={{ position:'absolute', top:0, left:0, right:0, zIndex:10, display:'flex', alignItems:'center', justifyContent:'space-between', padding:'16px 22px', background:'linear-gradient(to bottom,rgba(0,0,0,.7),transparent)', pointerEvents:'none' }}>
        <div style={{ pointerEvents:'auto', color:'rgba(255,255,255,.48)', fontSize:10, letterSpacing:'.28em', textTransform:'uppercase', fontFamily:"'Montserrat',sans-serif" }}>
          {current.cat || 'Product'}
          {products.length > 1 && <span style={{ marginLeft:12, color:'rgba(255,255,255,.26)' }}>{currentIdx + 1} / {products.length}</span>}
        </div>
        <div style={{ pointerEvents:'auto', display:'flex', gap:8, alignItems:'center' }}>
          <button onClick={() => setZoomed(z => !z)} title={zoomed ? 'Fit' : 'Zoom'} style={{ background:zoomed ? 'rgba(160,104,0,.3)' : 'rgba(255,255,255,.1)', border:`1px solid ${zoomed ? 'rgba(160,104,0,.7)' : 'rgba(255,255,255,.2)'}`, borderRadius:3, width:42, height:42, display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer', color:zoomed ? '#FFD700' : '#fff', transition:'all .22s' }}>
            <ZoomIn size={16} />
          </button>
          <button onClick={onClose} style={{ background:'rgba(255,255,255,.1)', border:'1px solid rgba(255,255,255,.2)', borderRadius:3, width:42, height:42, display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer', color:'#fff', transition:'all .22s' }} onMouseEnter={e => e.currentTarget.style.background='rgba(255,255,255,.2)'} onMouseLeave={e => e.currentTarget.style.background='rgba(255,255,255,.1)'}>
            <X size={16} />
          </button>
        </div>
      </div>

      {/* Main */}
      <div onClick={e => e.stopPropagation()} style={{ display:'flex', flexDirection:isMobile ? 'column' : 'row', width:'100%', height:'100vh', maxWidth:1200, paddingTop:60, paddingBottom:products.length > 1 ? (isMobile ? 0 : 72) : 0, boxSizing:'border-box', animation:'modalIn .32s cubic-bezier(.25,.46,.45,.94)' }}>
        {/* Image */}
        <div onPointerDown={onPointerDown} onPointerMove={onPointerMove} onPointerUp={onPointerUp} onPointerCancel={onPointerUp} onClick={() => { if (!isPanning) setZoomed(z => !z) }} style={{ flex:isMobile ? '0 0 54vh' : '1 1 0', display:'flex', alignItems:'center', justifyContent:'center', position:'relative', overflow:'hidden', cursor:zoomed ? (isPanning ? 'grabbing' : 'grab') : 'zoom-in', background:'rgba(255,255,255,.02)' }}>
          <img src={zoomSrc} alt={current.name} draggable={false} loading="eager" style={{ maxWidth:zoomed ? 'none' : '100%', maxHeight:zoomed ? 'none' : '100%', objectFit:'contain', transform:zoomed ? `translate(${panX}px,${panY}px) scale(2.2)` : 'translate(0,0) scale(1)', transformOrigin:'center center', transition:isPanning ? 'none' : 'transform .4s cubic-bezier(.25,.46,.45,.94)', userSelect:'none', WebkitUserDrag:'none', display:'block' }} />
          {current.tag && <div style={{ position:'absolute', top:16, left:16, padding:'5px 14px', background:'rgba(255,255,255,.94)', border:'1px solid rgba(140,90,0,.3)', color:'#a06800', fontSize:8, letterSpacing:'.18em', textTransform:'uppercase', borderRadius:2, fontFamily:"'Montserrat',sans-serif", pointerEvents:'none' }}>{current.tag}</div>}
          {!zoomed && <div style={{ position:'absolute', bottom:14, right:14, background:'rgba(0,0,0,.52)', borderRadius:20, padding:'5px 14px', display:'flex', alignItems:'center', gap:6, color:'rgba(255,255,255,.8)', fontSize:10, letterSpacing:'.08em', fontFamily:"'Montserrat',sans-serif", pointerEvents:'none' }}><ZoomIn size={12} /> Click to zoom</div>}
          {zoomed && <div style={{ position:'absolute', bottom:14, right:14, background:'rgba(160,104,0,.75)', borderRadius:20, padding:'5px 14px', color:'#fff', fontSize:10, letterSpacing:'.08em', fontFamily:"'Montserrat',sans-serif", pointerEvents:'none' }}>Drag to pan · click to fit</div>}
        </div>

        {/* Info */}
        <div style={{ width:isMobile ? '100%' : 330, flexShrink:0, display:'flex', flexDirection:'column', justifyContent:'space-between', padding:isMobile ? '22px 22px 30px' : '2.8rem 2.4rem', background:'#111', overflowY:'auto', boxSizing:'border-box' }}>
          <div>
            {current.cat && <div style={{ fontSize:8, letterSpacing:'.28em', textTransform:'uppercase', color:'rgba(160,104,0,.7)', marginBottom:14, fontFamily:"'Montserrat',sans-serif" }}>{current.cat}</div>}
            <h2 style={{ fontSize:'clamp(1.4rem,4vw,2rem)', fontWeight:400, fontFamily:"'Cormorant Garamond',serif", color:'#fff', lineHeight:1.2, marginBottom:16 }}>{current.name}</h2>
            <div style={{ width:36, height:1, background:'#a06800', marginBottom:18 }} />
            {current.desc && <p style={{ color:'rgba(255,255,255,.48)', fontSize:13.5, lineHeight:2, margin:0 }}>{current.desc}</p>}
          </div>
          <div style={{ borderTop:'1px solid rgba(255,255,255,.08)', paddingTop:22, marginTop:28 }}>
            <p style={{ fontSize:11, color:'rgba(255,255,255,.3)', letterSpacing:'.04em', marginBottom:14, fontFamily:"'Montserrat',sans-serif" }}>Interested in stocking this product?</p>
            <a href="mailto:Wellssolutions2015@gmail.com" style={{ display:'inline-flex', alignItems:'center', gap:8, padding:'13px 30px', background:'#a06800', color:'#fff', fontSize:9, letterSpacing:'.22em', textTransform:'uppercase', textDecoration:'none', fontWeight:600, transition:'background .25s', borderRadius:2, fontFamily:"'Montserrat',sans-serif" }} onMouseEnter={e => e.currentTarget.style.background='#8a5a00'} onMouseLeave={e => e.currentTarget.style.background='#a06800'}>
              Enquire Now <ArrowRight size={12} />
            </a>
          </div>
        </div>
      </div>

      {/* Arrows */}
      {products.length > 1 && (
        <>
          <button onClick={e => { e.stopPropagation(); goPrev() }} disabled={!hasPrev} style={{ position:'absolute', left:16, top:'50%', transform:'translateY(-50%)', width:48, height:48, borderRadius:'50%', background:hasPrev ? 'rgba(255,255,255,.12)' : 'rgba(255,255,255,.04)', border:`1px solid ${hasPrev ? 'rgba(255,255,255,.22)' : 'rgba(255,255,255,.08)'}`, display:'flex', alignItems:'center', justifyContent:'center', cursor:hasPrev ? 'pointer' : 'default', color:hasPrev ? '#fff' : 'rgba(255,255,255,.2)', transition:'all .22s', zIndex:10 }} onMouseEnter={e => { if (hasPrev) e.currentTarget.style.background='rgba(255,255,255,.22)' }} onMouseLeave={e => e.currentTarget.style.background=hasPrev ? 'rgba(255,255,255,.12)' : 'rgba(255,255,255,.04)'}><ChevronLeft size={20} /></button>
          <button onClick={e => { e.stopPropagation(); goNext() }} disabled={!hasNext} style={{ position:'absolute', right:isMobile ? 16 : 346, top:'50%', transform:'translateY(-50%)', width:48, height:48, borderRadius:'50%', background:hasNext ? 'rgba(255,255,255,.12)' : 'rgba(255,255,255,.04)', border:`1px solid ${hasNext ? 'rgba(255,255,255,.22)' : 'rgba(255,255,255,.08)'}`, display:'flex', alignItems:'center', justifyContent:'center', cursor:hasNext ? 'pointer' : 'default', color:hasNext ? '#fff' : 'rgba(255,255,255,.2)', transition:'all .22s', zIndex:10 }} onMouseEnter={e => { if (hasNext) e.currentTarget.style.background='rgba(255,255,255,.22)' }} onMouseLeave={e => e.currentTarget.style.background=hasNext ? 'rgba(255,255,255,.12)' : 'rgba(255,255,255,.04)'}><ChevronRight size={20} /></button>
        </>
      )}

      {/* Thumb strip */}
      {products.length > 1 && (
        <div onClick={e => e.stopPropagation()} className="joi-thumbstrip" style={{ position:'absolute', bottom:0, left:0, right:isMobile ? 0 : 330, height:72, display:'flex', alignItems:'center', gap:7, padding:'0 20px', overflowX:'auto', background:'linear-gradient(to top,rgba(0,0,0,.75),rgba(0,0,0,.28))' }}>
          {products.map((p, i) => (
            <div key={p.id ?? p.name} onClick={() => { setZoomed(false); setPanX(0); setPanY(0); setCurrentIdx(i) }} style={{ width:48, height:54, flexShrink:0, borderRadius:3, overflow:'hidden', border:`2px solid ${i === currentIdx ? '#a06800' : 'rgba(255,255,255,.14)'}`, cursor:'pointer', opacity:i === currentIdx ? 1 : 0.48, transform:i === currentIdx ? 'scale(1.1)' : 'scale(1)', transition:'all .22s' }}>
              <img src={p.img_sm || p.img} alt={p.name} style={{ width:'100%', height:'100%', objectFit:'cover', objectPosition:'center top', display:'block' }} />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

/* ─── Floating orbs ──────────────────────────────────────────── */
function FloatingOrbs() {
  return (
    <div style={{ position:'absolute', inset:0, pointerEvents:'none', overflow:'hidden' }}>
      {[{ size:320, top:'6%',  left:'-7%',  dur:14 },
        { size:200, top:'55%', right:'-5%', dur:18 },
        { size:130, top:'25%', right:'13%', dur:12 }].map((o, i) => (
        <div key={i} style={{ position:'absolute', width:o.size, height:o.size, borderRadius:'50%', background:'radial-gradient(circle,rgba(160,104,0,.055) 0%,transparent 72%)', top:o.top, left:o.left, right:o.right, animation:`orbFloat ${o.dur}s ease-in-out ${i*-3}s infinite` }} />
      ))}
    </div>
  )
}

/* ─── Floating bubble ────────────────────────────────────────── */
function FloatingBubble({ img, size, top, left, right, bottom, delay, duration }) {
  if (!img) return null
  return (
    <div style={{ position:'absolute', width:size, height:size, top, left, right, bottom, borderRadius:'50%', overflow:'hidden', opacity:.2, pointerEvents:'none', animation:`floatA ${duration}s ease-in-out ${delay}s infinite`, zIndex:1, border:'2px solid rgba(255,255,255,.2)', boxShadow:'0 20px 60px rgba(0,0,0,.16)' }}>
      <img src={img} alt="" style={{ width:'100%', height:'100%', objectFit:'cover', filter:'brightness(.92) saturate(1.15)' }} />
    </div>
  )
}

/* ─── Section label ──────────────────────────────────────────── */
function SectionLabel({ children }) {
  return (
    <div style={{ fontSize:9, letterSpacing:'.48em', textTransform:'uppercase', color:'#a06800', marginBottom:10, fontFamily:"'Montserrat',sans-serif" }}>
      {children}
    </div>
  )
}

/* ─── Desktop product card ───────────────────────────────────── */
function DesktopCard({ p, i, onZoom }) {
  const isAboveFold = i < 4
  return (
    <div className="joi-desk-card" onClick={() => onZoom(p)}>
      <div className="joi-desk-card-img">
        <ProgressiveImage
          src={p.img}
          srcSet={p.img_sm ? `${p.img_sm} 300w, ${p.img} 600w` : undefined}
          sizes="(max-width:640px) 50vw, 320px"
          lqip={p.img_lqip}
          alt={p.name}
          eager={isAboveFold}
          style={{ width:'100%', height:'100%' }}
        />
        {/* Dark gradient bottom overlay */}
        <div style={{ position:'absolute', inset:0, background:'linear-gradient(to top,rgba(0,0,0,.32) 0%,transparent 50%)', pointerEvents:'none' }} />
        {p.tag && (
          <div style={{ position:'absolute', top:14, left:14, padding:'5px 13px', background:'rgba(255,255,255,.94)', border:'1px solid rgba(140,90,0,.28)', color:'#a06800', fontSize:8, letterSpacing:'.18em', textTransform:'uppercase', borderRadius:2, fontFamily:"'Montserrat',sans-serif" }}>{p.tag}</div>
        )}
        {p.cat && (
          <div style={{ position:'absolute', bottom:12, left:14, color:'rgba(255,255,255,.92)', fontSize:9, letterSpacing:'.26em', textTransform:'uppercase', fontFamily:"'Montserrat',sans-serif", textShadow:'0 1px 4px rgba(0,0,0,.4)' }}>{p.cat}</div>
        )}
        <div className="joi-desk-zoom-overlay">
          <div style={{ background:'rgba(0,0,0,.45)', borderRadius:'50%', width:52, height:52, display:'flex', alignItems:'center', justifyContent:'center', border:'1px solid rgba(255,255,255,.4)' }}>
            <ZoomIn size={20} color="#fff" />
          </div>
        </div>
      </div>
      <div className="joi-desk-card-body">
        <h3 style={{ fontSize:'1.12rem', fontWeight:400, fontFamily:"'Cormorant Garamond',serif", color:'#1a1a1a', lineHeight:1.3, marginBottom:8, letterSpacing:'.01em' }}>{p.name}</h3>
        {p.desc && (
          <p style={{ color:'#8a8580', fontSize:12, lineHeight:1.82, flex:1, display:'-webkit-box', WebkitLineClamp:3, WebkitBoxOrient:'vertical', overflow:'hidden', margin:0 }}>{p.desc}</p>
        )}
        <div style={{ display:'flex', alignItems:'center', gap:6, marginTop:14, color:'rgba(140,90,0,.62)', fontSize:9.5, letterSpacing:'.1em', fontFamily:"'Montserrat',sans-serif" }}>
          <span>View details</span>
          <ArrowRight size={11} />
        </div>
      </div>
    </div>
  )
}

/* ─── Mobile product card ─────────────────────────────────────── */
function MobileCard({ p, onZoom, eager = false }) {
  return (
    <div className="joi-prod-card" onClick={() => onZoom(p)}>
      <div style={{ position:'relative', aspectRatio:'3/4', overflow:'hidden', background:'#f7f6f2' }}>
        <ProgressiveImage src={p.img_sm || p.img} srcSet={p.img_sm ? `${p.img_sm} 300w, ${p.img} 600w` : undefined} sizes="50vw" lqip={p.img_lqip} alt={p.name} eager={eager} style={{ width:'100%', height:'100%' }} />
        <div style={{ position:'absolute', bottom:8, right:8, background:'rgba(0,0,0,.52)', borderRadius:'50%', width:30, height:30, display:'flex', alignItems:'center', justifyContent:'center', border:'1px solid rgba(255,255,255,.28)' }}>
          <ZoomIn size={13} color="#fff" />
        </div>
      </div>
      <div className="joi-prod-body">
        {p.cat && <div className="joi-prod-cat">{p.cat}</div>}
        <h3 className="joi-prod-name">{p.name}</h3>
        <div className="joi-prod-tap">Tap to view →</div>
      </div>
    </div>
  )
}

/* ─── Search & Filter ────────────────────────────────────────── */
function SearchFilterBar({ query, setQuery, activeFilter, setActiveFilter, allCats, isMobile }) {
  const [focused, setFocused] = useState(false)
  return (
    <div style={{ maxWidth:920, margin:'0 auto', marginBottom:isMobile ? 24 : 50, padding:'0 1rem' }}>
      <div className={`joi-search-wrap${focused ? ' focused' : ''}`} style={{ marginBottom:16, borderRadius:isMobile ? 12 : 3 }}>
        <Search size={16} color="rgba(140,90,0,.55)" style={{ marginLeft:16, flexShrink:0 }} />
        <input type="text" value={query} onChange={e => setQuery(e.target.value)} onFocus={() => setFocused(true)} onBlur={() => setFocused(false)} placeholder="Search products…" className="joi-search-input" style={{ fontSize:isMobile ? 14 : 13 }} />
        {query && <button onClick={() => setQuery('')} style={{ background:'none', border:'none', cursor:'pointer', padding:'0 14px', color:'rgba(140,90,0,.6)', display:'flex', alignItems:'center' }}><X size={14} /></button>}
      </div>
      <div style={{ display:'flex', gap:8, flexWrap:'wrap', justifyContent:isMobile ? 'flex-start' : 'center', overflowX:isMobile ? 'auto' : 'visible', paddingBottom:isMobile ? 4 : 0 }}>
        {allCats.map(cat => (
          <button key={cat} onClick={() => setActiveFilter(cat)} className={`joi-cat-pill${activeFilter === cat ? ' active' : ''}`}>{cat}</button>
        ))}
      </div>
    </div>
  )
}

/* ─── Product Slider ─────────────────────────────────────────── */
function ProductSlider({ products, loading, onZoom }) {
  const [idx, setIdx] = useState(0)
  const trackRef      = useRef(null)
  const { ref, vis }  = useVisible(0.05)
  const CARD_W = 320, GAP = 20

  const prev = () => setIdx(i => Math.max(0, i - 1))
  const next = () => setIdx(i => Math.min(products.length - 1, i + 1))

  useEffect(() => {
    if (!trackRef.current) return
    trackRef.current.scrollTo({ left: idx * (CARD_W + GAP), behavior: 'smooth' })
  }, [idx])

  return (
    <section ref={ref} style={{ padding:'5.5rem 0 6.5rem', position:'relative', background:'#f7f6f2', borderTop:'1px solid #ede9e0', borderBottom:'1px solid #ede9e0' }}>
      {!loading && products[0] && <FloatingBubble img={products[0].img_sm || products[0].img} size={90} top="-28px" right="5%" delay={0} duration={5.5} />}
      {!loading && products[3] && <FloatingBubble img={products[3].img_sm || products[3].img} size={72} bottom="32px" left="2%" delay={1.5} duration={6.5} />}

      <div style={{ maxWidth:1360, margin:'0 auto', padding:'0 2rem', position:'relative', zIndex:2 }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-end', marginBottom:36, flexWrap:'wrap', gap:14, opacity:vis ? 1 : 0, transform:vis ? 'none' : 'translateY(18px)', transition:'all .7s' }}>
          <div>
            <SectionLabel>Product Range</SectionLabel>
            <h2 style={{ fontSize:'clamp(2rem,5vw,3.5rem)', fontWeight:300, fontFamily:"'Cormorant Garamond',serif", color:'#1a1a1a', lineHeight:1.1, letterSpacing:'-.01em' }}>Our Range</h2>
          </div>
          {!loading && (
            <div style={{ display:'flex', gap:10, alignItems:'center' }}>
              <span style={{ fontSize:11, color:'#bbb', fontFamily:"'Montserrat',sans-serif", letterSpacing:'.06em', marginRight:4 }}>{idx + 1} / {products.length}</span>
              {[{ fn:prev, dis:idx === 0, Icon:ChevronLeft }, { fn:next, dis:idx >= products.length - 1, Icon:ChevronRight }].map(({ fn, dis, Icon }, ki) => (
                <button key={ki} onClick={fn} disabled={dis} style={{ width:46, height:46, border:`1px solid ${dis ? '#e0dbd0' : 'rgba(140,90,0,.45)'}`, background:'transparent', cursor:dis ? 'default' : 'pointer', display:'flex', alignItems:'center', justifyContent:'center', color:dis ? '#ccc' : '#a06800', transition:'all .28s', borderRadius:2 }} onMouseEnter={e => { if (!dis) e.currentTarget.style.background='rgba(160,104,0,.07)' }} onMouseLeave={e => e.currentTarget.style.background='transparent'}>
                  <Icon size={18} />
                </button>
              ))}
            </div>
          )}
        </div>

        <div ref={trackRef} className="joi-slider" style={{ display:'flex', gap:GAP, overflowX:'auto', scrollSnapType:'x mandatory', WebkitOverflowScrolling:'touch', paddingBottom:4 }}>
          {loading
            ? Array(4).fill(0).map((_, i) => <div key={i} style={{ scrollSnapAlign:'start', width:CARD_W, minWidth:CARD_W }}><SkeletonDesktopCard /></div>)
            : products.map((p, i) => <div key={p.id ?? i} style={{ scrollSnapAlign:'start', width:CARD_W, minWidth:CARD_W }}><DesktopCard p={p} i={i} onZoom={onZoom} /></div>)
          }
        </div>

        {!loading && (
          <div style={{ display:'flex', justifyContent:'center', gap:8, marginTop:24 }}>
            {products.map((_, i) => <button key={i} onClick={() => setIdx(i)} style={{ width:i === idx ? 28 : 8, height:8, borderRadius:4, background:i === idx ? '#a06800' : 'rgba(140,90,0,.2)', border:'none', cursor:'pointer', transition:'all .32s cubic-bezier(.25,.46,.45,.94)' }} />)}
          </div>
        )}

        <div style={{ textAlign:'center', marginTop:38 }}>
          <a href="#collections" style={{ padding:'13px 38px', border:'1px solid rgba(140,90,0,.38)', color:'#a06800', fontSize:10, letterSpacing:'.22em', textTransform:'uppercase', textDecoration:'none', display:'inline-flex', alignItems:'center', gap:10, transition:'all .28s', fontFamily:"'Montserrat',sans-serif", borderRadius:2 }} onMouseEnter={e => { e.currentTarget.style.background='rgba(160,104,0,.07)'; e.currentTarget.style.borderColor='rgba(140,90,0,.65)' }} onMouseLeave={e => { e.currentTarget.style.background='transparent'; e.currentTarget.style.borderColor='rgba(140,90,0,.38)' }}>
            View Full Range <ArrowRight size={13} />
          </a>
        </div>
      </div>
    </section>
  )
}

/* ─── Product Showcase ───────────────────────────────────────── */
function ProductShowcase({ products, loading, onZoom }) {
  const { ref, vis }               = useVisible(0.05)
  const [query, setQuery]          = useState('')
  const [activeFilter, setFilter]  = useState('All')
  const [visibleCount, setVisible] = useState(12)
  const isMobile                   = useIsMobile()

  const ALL_CATS = ['All', ...Array.from(new Set(products.map(p => p.cat).filter(Boolean)))]

  const filtered = products.filter(p => {
    const matchCat = activeFilter === 'All' || p.cat === activeFilter
    const q = query.toLowerCase()
    return matchCat && (!q || [p.name, p.cat, p.desc, p.tag].some(s => s?.toLowerCase().includes(q)))
  })

  useEffect(() => { setVisible(12) }, [activeFilter, query])

  const visible = filtered.slice(0, visibleCount)
  const hasMore = visibleCount < filtered.length

  return (
    <section id="collections" ref={ref} style={{ padding:isMobile ? '3rem 0 4rem' : '5.5rem 2rem 6.5rem', position:'relative', overflow:'hidden', background:'#fff' }}>
      {!isMobile && !loading && (
        <>
          <FloatingBubble img={products[2]?.img_sm} size={130} top="7%"  right="-24px" delay={0} duration={7} />
          <FloatingBubble img={products[4]?.img_sm} size={90} bottom="4%" left="-16px" delay={2} duration={8} />
        </>
      )}
      <div style={{ maxWidth:1360, margin:'0 auto', position:'relative', zIndex:2 }}>

        <div style={{ textAlign:'center', marginBottom:isMobile ? 28 : 54, padding:isMobile ? '0 1rem' : 0, opacity:vis ? 1 : 0, transform:vis ? 'none' : 'translateY(22px)', transition:'all .75s' }}>
          <SectionLabel>Browse Our Range</SectionLabel>
          <h2 style={{ fontSize:'clamp(2rem,5vw,3.5rem)', fontWeight:300, fontFamily:"'Cormorant Garamond',serif", color:'#1a1a1a', marginBottom:8, letterSpacing:'-.01em' }}>Our Products</h2>
          <p style={{ color:'#b0a898', fontSize:11, letterSpacing:'.1em', fontFamily:"'Montserrat',sans-serif" }}>
            {isMobile ? 'Tap any product to view details' : 'Click any product to explore and enquire'}
          </p>
        </div>

        {!loading && <SearchFilterBar query={query} setQuery={setQuery} activeFilter={activeFilter} setActiveFilter={setFilter} allCats={ALL_CATS} isMobile={isMobile} />}

        {loading ? (
          isMobile
            ? <div className="joi-prod-grid">{Array(6).fill(0).map((_, i) => <SkeletonMobileCard key={i} />)}</div>
            : <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(min(100%,300px),1fr))', gap:22 }}>{Array(8).fill(0).map((_, i) => <SkeletonDesktopCard key={i} />)}</div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign:'center', padding:'5rem 1rem', color:'#bbb', fontFamily:"'Cormorant Garamond',serif", fontSize:'1.6rem' }}>
            No products match <span style={{ color:'#a06800' }}>"{query}"</span>
          </div>
        ) : (
          <>
            {isMobile
              ? <div className="joi-prod-grid">{visible.map((p, i) => <MobileCard key={p.id ?? p.name} p={p} onZoom={onZoom} eager={i < 4} />)}</div>
              : <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(min(100%,300px),1fr))', gap:22 }}>{visible.map((p, i) => <DesktopCard key={p.id ?? p.name} p={p} i={i} onZoom={onZoom} />)}</div>
            }
            {hasMore && (
              <div style={{ textAlign:'center', marginTop:34, padding:isMobile ? '0 16px' : 0 }}>
                <button onClick={() => setVisible(c => c + 12)} style={{ padding:'14px 42px', border:'1px solid rgba(140,90,0,.38)', color:'#a06800', background:'transparent', fontSize:10, letterSpacing:'.22em', textTransform:'uppercase', cursor:'pointer', transition:'all .28s', fontFamily:"'Montserrat',sans-serif", borderRadius:isMobile ? 24 : 2, width:isMobile ? '100%' : 'auto' }} onMouseEnter={e => { e.currentTarget.style.background='rgba(160,104,0,.07)'; e.currentTarget.style.borderColor='rgba(140,90,0,.65)' }} onMouseLeave={e => { e.currentTarget.style.background='transparent'; e.currentTarget.style.borderColor='rgba(140,90,0,.38)' }}>
                  Load More
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  )
}

/* ─── Our Story ──────────────────────────────────────────────── */
function OurStory() {
  const { ref, vis } = useVisible(0.07)
  return (
    <section id="story" ref={ref} style={{ padding:'7rem 2rem', background:'#faf9f6', borderBottom:'1px solid #e8e2d8', position:'relative', overflow:'hidden' }}>
      <FloatingOrbs />
      <div style={{ maxWidth:1160, margin:'0 auto', display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(min(100%,300px),1fr))', gap:'5rem', alignItems:'center', position:'relative', zIndex:1 }}>

        <div style={{ position:'relative', opacity:vis ? 1 : 0, transform:vis ? 'translateX(0)' : 'translateX(-32px)', transition:'all .9s ease' }}>
          <div style={{ position:'absolute', top:-18, left:-18, right:18, bottom:18, border:'1px solid rgba(140,90,0,.18)', zIndex:0, pointerEvents:'none' }} />
          <img src={STORY_IMG} alt="Joi Story" style={{ width:'100%', height:460, objectFit:'cover', position:'relative', zIndex:1, filter:'brightness(.9) saturate(1.06)', display:'block' }} />
          <div style={{ position:'absolute', bottom:-20, right:-20, background:'linear-gradient(135deg,#FFD700,#FFE34D)', padding:'1.1rem 1.5rem', zIndex:2, boxShadow:'0 12px 40px rgba(0,0,0,.14)' }}>
            <div style={{ fontSize:8, letterSpacing:'.22em', textTransform:'uppercase', color:'#1a1a1a', fontWeight:700, fontFamily:"'Montserrat',sans-serif" }}>Proudly</div>
            <div style={{ fontSize:'1.5rem', fontWeight:300, fontFamily:"'Cormorant Garamond',serif", color:'#1a1a1a', lineHeight:1.1 }}>Made in Kenya</div>
          </div>
        </div>

        <div style={{ opacity:vis ? 1 : 0, transform:vis ? 'translateX(0)' : 'translateX(32px)', transition:'all .9s ease .15s' }}>
          <SectionLabel>Our Story</SectionLabel>
          <h2 style={{ fontSize:'clamp(2rem,4vw,3.3rem)', fontWeight:300, fontFamily:"'Cormorant Garamond',serif", color:'#1a1a1a', lineHeight:1.18, marginBottom:20, letterSpacing:'-.01em' }}>
            Built for Africa.{' '}
            <span style={{ background:'linear-gradient(135deg,#a06800,#c28a00)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>Made with Joy.</span>
          </h2>
          <div style={{ width:0, height:1, background:'#a06800', marginBottom:24, animation:vis ? 'lineGrow .85s ease .45s forwards' : 'none' }} />
          <p style={{ color:'#555', fontSize:14.5, lineHeight:1.95, marginBottom:16 }}>
            Joi began with a simple but powerful observation: African consumers deserved quality beauty and hair care products that truly understood their needs — without the premium price tag.
          </p>
          <p style={{ color:'#777', fontSize:13.5, lineHeight:1.95, marginBottom:16 }}>
            Every Joi product is built from the ground up with African hair at the centre of every formulation decision. From raw material selection to texture, fragrance, and finish — the African consumer experience was never an afterthought. It was the starting point.
          </p>
          <p style={{ color:'#777', fontSize:13.5, lineHeight:1.95, marginBottom:34 }}>
            The name says it all. Not just a brand — a feeling. The joy of a good hair day, the confidence of a well-maintained look, the satisfaction of a product that does exactly what it promises.
          </p>
          <Link to="/about" style={{ display:'inline-flex', alignItems:'center', gap:9, color:'#a06800', fontSize:10, letterSpacing:'.24em', textTransform:'uppercase', textDecoration:'none', borderBottom:'1px solid rgba(140,90,0,.35)', paddingBottom:4, fontFamily:"'Montserrat',sans-serif", transition:'border-color .22s' }} onMouseEnter={e => e.currentTarget.style.borderColor='rgba(140,90,0,.85)'} onMouseLeave={e => e.currentTarget.style.borderColor='rgba(140,90,0,.35)'}>
            Read Our Full Story <ArrowRight size={12} />
          </Link>
        </div>
      </div>
    </section>
  )
}

/* ─── Features ───────────────────────────────────────────────── */
function Features() {
  const { ref, vis } = useVisible()
  return (
    <section ref={ref} style={{ padding:'5.5rem 2rem', maxWidth:1360, margin:'0 auto' }}>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(min(100%,240px),1fr))', gap:24 }}>
        {features.map(({ icon: Icon, title, desc }, i) => (
          <div key={title} className="joi-feature-card" style={{ opacity:vis ? 1 : 0, transform:vis ? 'translateY(0)' : 'translateY(32px)', transition:`all .75s ease ${i * .18}s` }}>
            <div style={{ width:60, height:60, border:'1px solid rgba(140,90,0,.3)', display:'flex', alignItems:'center', justifyContent:'center', marginBottom:22, background:'rgba(160,104,0,.05)', animation:`pulseGlow 3.8s ease-in-out ${i * .9}s infinite` }}>
              <Icon size={23} color="#a06800" />
            </div>
            <h3 style={{ fontSize:'1.2rem', fontWeight:400, fontFamily:"'Cormorant Garamond',serif", color:'#1a1a1a', marginBottom:12, letterSpacing:'.01em' }}>{title}</h3>
            <p style={{ color:'#888', fontSize:12.5, lineHeight:1.92 }}>{desc}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

/* ─── Testimonials ───────────────────────────────────────────── */
function Testimonials() {
  const { ref, vis } = useVisible()
  const [active, setActive] = useState(0)
  useEffect(() => {
    const t = setInterval(() => setActive(a => (a + 1) % reviews.length), 4800)
    return () => clearInterval(t)
  }, [])
  return (
    <section ref={ref} style={{ padding:'6.5rem 2rem', background:'#f7f6f2', borderTop:'1px solid #e8e2d8', borderBottom:'1px solid #e8e2d8', overflow:'hidden' }}>
      <div style={{ maxWidth:1360, margin:'0 auto' }}>
        <div style={{ textAlign:'center', marginBottom:52, opacity:vis ? 1 : 0, transform:vis ? 'none' : 'translateY(18px)', transition:'all .7s' }}>
          <SectionLabel>What People Say</SectionLabel>
          <h2 style={{ fontSize:'clamp(2rem,4vw,3.3rem)', fontWeight:300, fontFamily:"'Cormorant Garamond',serif", color:'#1a1a1a', letterSpacing:'-.01em' }}>Voices of Joy</h2>
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(min(100%,280px),1fr))', gap:20 }}>
          {reviews.map((r, i) => (
            <div key={r.name} onClick={() => setActive(i)} className={`joi-testi-card${i === active ? ' active' : ''}`} style={{ opacity:vis ? 1 : 0, transform:vis ? 'translateY(0)' : 'translateY(28px)', transition:`opacity .7s ease ${i * .13}s, transform .7s ease ${i * .13}s, background .35s, border-color .35s, box-shadow .35s, transform .35s` }}>
              <div style={{ display:'flex', gap:3, marginBottom:16 }}>
                {Array(r.stars).fill(0).map((_, si) => <Star key={si} size={13} fill="#a06800" color="#a06800" />)}
              </div>
              <p style={{ fontSize:'1.06rem', fontStyle:'italic', fontFamily:"'Cormorant Garamond',serif", color:'#444', lineHeight:1.9, marginBottom:22 }}>{r.text}</p>
              <div style={{ width:28, height:1, background:'rgba(140,90,0,.28)', marginBottom:14 }} />
              <div style={{ color:'#1a1a1a', fontSize:12, fontWeight:600, fontFamily:"'Montserrat',sans-serif", letterSpacing:'.04em' }}>{r.name}</div>
              <div style={{ color:'rgba(140,90,0,.65)', fontSize:11, marginTop:4, fontFamily:"'Montserrat',sans-serif" }}>{r.role}</div>
            </div>
          ))}
        </div>
        <div style={{ display:'flex', justifyContent:'center', gap:8, marginTop:28 }}>
          {reviews.map((_, i) => <button key={i} onClick={() => setActive(i)} style={{ width:i === active ? 24 : 8, height:8, borderRadius:4, background:i === active ? '#a06800' : 'rgba(140,90,0,.2)', border:'none', cursor:'pointer', transition:'all .3s' }} />)}
        </div>
      </div>
    </section>
  )
}

/* ─── CTA Banner ─────────────────────────────────────────────── */
function CtaBanner() {
  const { ref, vis } = useVisible()
  return (
    <section ref={ref} style={{ padding:'7rem 2rem', position:'relative', overflow:'hidden' }}>
      <div style={{ position:'absolute', inset:0, backgroundImage:'url(https://images.pexels.com/photos/4041392/pexels-photo-4041392.jpeg?auto=compress&cs=tinysrgb&w=1600)', backgroundSize:'cover', backgroundPosition:'center', filter:'brightness(.42)' }} />
      <div style={{ position:'absolute', inset:0, background:'linear-gradient(135deg,rgba(0,0,0,.2),rgba(160,104,0,.06))' }} />
      <div style={{ position:'relative', textAlign:'center', maxWidth:640, margin:'0 auto', zIndex:2, opacity:vis ? 1 : 0, transform:vis ? 'translateY(0)' : 'translateY(28px)', transition:'all .85s ease' }}>
        <SectionLabel>Work With Joi</SectionLabel>
        <h2 style={{ fontSize:'clamp(2rem,5vw,3.7rem)', fontWeight:300, fontFamily:"'Cormorant Garamond',serif", color:'#fff', lineHeight:1.18, marginBottom:18, letterSpacing:'-.01em' }}>
          Quality Hair Care Products,{' '}
          <span style={{ background:'linear-gradient(135deg,#FFD700,#FFEC99)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>Proudly Made in Kenya.</span>
        </h2>
        <p style={{ color:'rgba(255,255,255,.68)', fontSize:14, lineHeight:2, marginBottom:40, fontFamily:"'Montserrat',sans-serif" }}>
          Interested in stocking our range, becoming a distributor, or simply want to learn more? We'd love to hear from you.
        </p>
        <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:22 }}>
          <div style={{ display:'flex', gap:30, flexWrap:'wrap', justifyContent:'center' }}>
            <a href="tel:0748635395" style={{ display:'flex', alignItems:'center', gap:9, color:'rgba(255,255,255,.74)', fontSize:13, textDecoration:'none', transition:'color .22s', fontFamily:"'Montserrat',sans-serif" }} onMouseEnter={e => e.currentTarget.style.color='#FFD700'} onMouseLeave={e => e.currentTarget.style.color='rgba(255,255,255,.74)'}><Phone size={15} color="#FFD700" />0748 635 395</a>
            <a href="mailto:Wellssolutions2015@gmail.com" style={{ display:'flex', alignItems:'center', gap:9, color:'rgba(255,255,255,.74)', fontSize:13, textDecoration:'none', transition:'color .22s', fontFamily:"'Montserrat',sans-serif" }} onMouseEnter={e => e.currentTarget.style.color='#FFD700'} onMouseLeave={e => e.currentTarget.style.color='rgba(255,255,255,.74)'}><Mail size={15} color="#FFD700" />Wellssolutions2015@gmail.com</a>
          </div>
          <a href="mailto:Wellssolutions2015@gmail.com" style={{ padding:'14px 42px', background:'linear-gradient(135deg,#FFD700,#FFE34D)', color:'#1a1a1a', fontSize:10, letterSpacing:'.24em', textTransform:'uppercase', textDecoration:'none', fontWeight:700, display:'inline-flex', alignItems:'center', gap:10, transition:'transform .28s, box-shadow .28s', fontFamily:"'Montserrat',sans-serif", borderRadius:2 }} onMouseEnter={e => { e.currentTarget.style.transform='translateY(-3px)'; e.currentTarget.style.boxShadow='0 16px 40px rgba(255,215,0,.3)' }} onMouseLeave={e => { e.currentTarget.style.transform='none'; e.currentTarget.style.boxShadow='none' }}>
            Enquire Now <ArrowRight size={13} />
          </a>
        </div>
      </div>
    </section>
  )
}

/* ─── Hero ───────────────────────────────────────────────────── */
function Hero({ products, loading }) {
  const [mouse, setMouse] = useState({ x: .5, y: .5 })
  useEffect(() => {
    const h = e => setMouse({ x: e.clientX / window.innerWidth, y: e.clientY / window.innerHeight })
    window.addEventListener('mousemove', h); return () => window.removeEventListener('mousemove', h)
  }, [])
  const px = (mouse.x - .5) * 12, py = (mouse.y - .5) * 12

  return (
    <section style={{ position:'relative', minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', overflow:'hidden' }}>
      <div style={{ position:'absolute', inset:'-10%', backgroundImage:`url(${HERO_BG})`, backgroundSize:'cover', backgroundPosition:'center 30%', transform:`translate(${px*.28}px,${py*.28}px)`, transition:'transform .12s linear', filter:'brightness(.44)' }} />
      <div style={{ position:'absolute', inset:0, background:'linear-gradient(180deg,rgba(0,0,0,.15) 0%,rgba(0,0,0,.4) 52%,rgba(0,0,0,.65) 100%)' }} />
      <div style={{ position:'absolute', inset:0, backgroundImage:'linear-gradient(rgba(255,255,255,.016) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.016) 1px,transparent 1px)', backgroundSize:'72px 72px' }} />
      <FloatingOrbs />

      {!loading && products[0] && <FloatingBubble img={products[0].img_sm || products[0].img} size={158} top="9%"   right="5%"   delay={0}   duration={6.2} />}
      {!loading && products[1] && <FloatingBubble img={products[1].img_sm || products[1].img} size={118} bottom="18%" right="7%"   delay={1.5} duration={7.1} />}
      {!loading && products[2] && <FloatingBubble img={products[2].img_sm || products[2].img} size={98}  top="20%"   left="3.5%"  delay={.9}  duration={5.8} />}
      {!loading && products[3] && <FloatingBubble img={products[3].img_sm || products[3].img} size={78}  bottom="26%" left="5%"   delay={2.5} duration={6.8} />}

      <div style={{ position:'relative', zIndex:2, textAlign:'center', padding:'8.5rem 1.5rem 3.5rem', maxWidth:900, width:'100%' }}>

        {/* Company badge */}
        <div className="wt-badge" style={{ display:'inline-flex', alignItems:'center', gap:10, background:'rgba(255,255,255,.09)', border:'1px solid rgba(255,215,0,.32)', backdropFilter:'blur(10px)', padding:'11px 22px', borderRadius:2, marginBottom:30, marginTop:'-10rem', opacity:0, animation:'fadeIn 1s ease .05s forwards' }}>
          <Building2 size={14} color="#FFD700" />
          <span style={{ fontSize:10, letterSpacing:'.22em', textTransform:'uppercase', color:'rgba(255,255,255,.9)', fontFamily:"'Montserrat',sans-serif", fontWeight:600 }}>Wellstrend Creations Ltd</span>
          <span style={{ width:1, height:14, background:'rgba(255,215,0,.32)' }} />
          <span style={{ fontSize:9, letterSpacing:'.16em', textTransform:'uppercase', color:'rgba(255,215,0,.85)', fontFamily:"'Montserrat',sans-serif" }}>Est. Kenya</span>
        </div>

        {/* Logo */}
        <div style={{ display:'flex', justifyContent:'center', marginBottom:24, opacity:0, animation:'fadeIn 1s ease .2s forwards' }}>
          <div style={{ position:'relative', width:150, height:150, display:'flex', alignItems:'center', justifyContent:'center' }}>
            <div style={{ position:'absolute', inset:-12, borderRadius:'50%', background:'radial-gradient(circle,rgba(255,215,0,.12) 0%,transparent 75%)', pointerEvents:'none' }} />
            <div style={{ position:'absolute', inset:0, borderRadius:'50%', background:'rgba(255,255,255,.08)', border:'1px solid rgba(255,255,255,.16)', backdropFilter:'blur(8px)', boxShadow:'0 8px 40px rgba(255,215,0,.1)' }} />
            <img src={logoImg} alt="Joi" style={{ position:'relative', zIndex:1, height:92, width:'auto', objectFit:'contain', filter:'drop-shadow(0 5px 22px rgba(0,0,0,.45)) brightness(1.1)' }} />
          </div>
        </div>

        {/* Eyebrow */}
        <div style={{ fontSize:9.5, letterSpacing:'.52em', textTransform:'uppercase', color:'#e8c870', marginBottom:20, opacity:0, animation:'fadeIn 1s ease .42s forwards', fontFamily:"'Montserrat',sans-serif", fontWeight:500 }}>
          Premium Hair &amp; Beauty · Proudly Made in Kenya
        </div>

        {/* Headline */}
        <h1 className="hero-title" style={{ fontSize:'clamp(2.6rem,9vw,7rem)', fontWeight:300, fontFamily:"'Cormorant Garamond',serif", lineHeight:1.03, marginBottom:20, opacity:0, animation:'fadeUp 1s ease .52s forwards', letterSpacing:'-.02em' }}>
          <span style={{ display:'block', color:'#fff' }}>Unlocking Beauty,</span>
          <span style={{ display:'block', background:'linear-gradient(135deg,#FFD700 0%,#FFEC99 50%,#FFD700 100%)', backgroundSize:'200% auto', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', animation:'shimmer 4.5s linear infinite 1.8s' }}>Spreading the Joi</span>
        </h1>

        {/* Sub */}
        <p className="hero-sub" style={{ color:'rgba(255,255,255,.7)', fontSize:'clamp(.8rem,2vw,.98rem)', lineHeight:2, maxWidth:560, margin:'0 auto 2.8rem', fontWeight:400, opacity:0, animation:'fadeUp 1s ease .68s forwards', fontFamily:"'Montserrat',sans-serif" }}>
          High-quality, affordable hair care products designed for African consumers — formulated with care, consistency, and joy at every step.
        </p>

        {/* Buttons */}
        <div className="hero-btns" style={{ display:'flex', gap:12, justifyContent:'center', flexWrap:'wrap', opacity:0, animation:'fadeUp 1s ease .86s forwards' }}>
          <a href="#collections" style={{ padding:'14px 38px', background:'linear-gradient(135deg,#FFD700,#FFE34D)', color:'#1a1a1a', fontSize:10, letterSpacing:'.24em', textTransform:'uppercase', textDecoration:'none', fontWeight:700, display:'inline-block', transition:'transform .28s, box-shadow .28s', fontFamily:"'Montserrat',sans-serif", borderRadius:2 }} onMouseEnter={e => { e.currentTarget.style.transform='translateY(-2px)'; e.currentTarget.style.boxShadow='0 14px 36px rgba(255,215,0,.3)' }} onMouseLeave={e => { e.currentTarget.style.transform='none'; e.currentTarget.style.boxShadow='none' }}>
            Explore Products
          </a>
          <a href="#story" style={{ padding:'14px 38px', background:'transparent', border:'1px solid rgba(255,215,0,.52)', color:'#FFD700', fontSize:10, letterSpacing:'.24em', textTransform:'uppercase', textDecoration:'none', transition:'all .28s', fontFamily:"'Montserrat',sans-serif", borderRadius:2 }} onMouseEnter={e => { e.currentTarget.style.background='rgba(255,215,0,.1)'; e.currentTarget.style.borderColor='rgba(255,215,0,.88)' }} onMouseLeave={e => { e.currentTarget.style.background='transparent'; e.currentTarget.style.borderColor='rgba(255,215,0,.52)' }}>
            Our Story
          </a>
        </div>
      </div>

      {/* Scroll indicator */}
      <div style={{ position:'absolute', bottom:30, left:'50%', transform:'translateX(-50%)', display:'flex', flexDirection:'column', alignItems:'center', gap:7, opacity:0, animation:'fadeIn 1s ease 1.8s forwards' }}>
        <span style={{ fontSize:8, letterSpacing:'.38em', color:'rgba(255,215,0,.6)', textTransform:'uppercase', fontFamily:"'Montserrat',sans-serif" }}>Scroll</span>
        <div style={{ width:1, height:36, background:'linear-gradient(to bottom,rgba(255,215,0,.6),transparent)', animation:'blink 2.2s ease-in-out infinite' }} />
      </div>
    </section>
  )
}

/* ─── Root ───────────────────────────────────────────────────── */
export default function Landing() {
  const [products, setProducts]    = useState([])
  const [loading, setLoading]      = useState(true)
  const [zoomedProduct, setZoomed] = useState(null)

  useEffect(() => { injectStyles() }, [])

  useEffect(() => {
    let cancelled = false
    async function loadProducts() {
      if (window.location.search.includes('refresh')) {
        localStorage.removeItem(CACHE_KEY)
        if (window.history?.replaceState) {
          const url = new URL(window.location.href)
          url.searchParams.delete('refresh')
          window.history.replaceState({}, '', url)
        }
      }
      const cache = readCache()
      const previousData = cache?.data ?? null
      if (cache) { setProducts(cache.data); setLoading(false); if (!cache.expired) return }
      try {
        const res  = await fetch(API_URL)
        if (!res.ok) throw new Error('Network response not ok')
        const json = await res.json()
        const list = (Array.isArray(json) ? json : (Array.isArray(json.data) ? json.data : []))
          .filter(p => p.active !== false)
        if (cancelled) return
        if (JSON.stringify(list) !== JSON.stringify(previousData)) { setProducts(list); preloadImages(list, 4); writeCache(list) }
        setLoading(false)
      } catch (err) {
        if (!cancelled) setLoading(false)
        console.error('Failed to fetch products:', err)
      }
    }
    loadProducts()
    return () => { cancelled = true }
  }, [])

  useEffect(() => { if (products.length > 0) preloadImages(products, 4) }, [products])

  const openZoom  = useCallback(p => setZoomed(p), [])
  const closeZoom = useCallback(() => setZoomed(null), [])

  return (
    <div style={{ background:'#fff', fontFamily:"'Montserrat',sans-serif" }}>
      {zoomedProduct && <Lightbox product={zoomedProduct} products={products} onClose={closeZoom} />}

      <Hero products={products} loading={loading} />

      {/* Gold marquee */}
      <div style={{ background:'linear-gradient(90deg,#FFD700,#FFE34D,#FFEC99,#FFE34D,#FFD700)', padding:'13px 0', overflow:'hidden' }}>
        <div style={{ display:'flex', whiteSpace:'nowrap', animation:'marquee 32s linear infinite' }}>
          {Array(12).fill(0).map((_, i) => (
            <span key={i} style={{ fontSize:10.5, letterSpacing:'.28em', textTransform:'uppercase', color:'#1a1a1a', fontWeight:700, paddingRight:44, fontFamily:"'Montserrat',sans-serif" }}>
              Joi Hair Care &nbsp;·&nbsp; Quality in Every Batch &nbsp;·&nbsp; Made for African Hair &nbsp;·&nbsp; Unlocking Beauty, Spreading the Joi &nbsp;·&nbsp;
            </span>
          ))}
        </div>
      </div>

      <OurStory />
      <Features />
      <ProductSlider   products={products} loading={loading} onZoom={openZoom} />
      <ProductShowcase products={products} loading={loading} onZoom={openZoom} />
      <Testimonials />
      <CtaBanner />
    </div>
  )
}