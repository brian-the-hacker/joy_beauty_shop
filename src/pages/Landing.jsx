import { useState, useEffect, useRef, useCallback } from 'react'
import { Link } from 'react-router-dom'
import {
  ArrowRight, Star, Sparkles, Shield, Leaf,
  ChevronLeft, ChevronRight, Phone, Mail,
  Search, X, ZoomIn, Building2
} from 'lucide-react'
import logoImg from '../assets/logo.png'

/* ─── Static data ────────────────────────────────────────────── */
const features = [
  { icon: Sparkles, title: 'Crafted for African Hair',  desc: 'Formulations developed specifically for the textures, needs, and styles of African hair — effective by design, not by chance.' },
  { icon: Leaf,     title: 'Quality in Every Batch',    desc: 'Consistent formulation standards and controlled production ensure every product performs exactly as expected.' },
  { icon: Shield,   title: 'Reliable Manufacturing',    desc: 'From careful raw material selection through to finished product, quality is built into every step of what we do.' },
]
const reviews = [
  { name: 'Mercy W.',  role: 'Salon Owner',          text: '"The Joi Moulding Gel Wax gives my clients the cleanest, longest-lasting styles. It has become a staple product in our salon."', stars: 5 },
  { name: 'Fatuma A.', role: 'Loyal Customer',        text: '"The Leave-In Treatment has completely transformed my hair routine. Lightweight, actually effective, and smells amazing."', stars: 5 },
  { name: 'Brian O.',  role: 'Distributor, Mombasa',  text: '"Consistent quality and great packaging every time. Joi products practically sell themselves once customers try them."', stars: 5 },
]

const HERO_BG   = 'https://images.pexels.com/photos/3065209/pexels-photo-3065209.jpeg?auto=compress&cs=tinysrgb&w=1600'
const STORY_IMG = 'src/assets/DSC_1073.jpg'
const API_URL   = 'https://joy-beauty-shop-dashboard.onrender.com/api/products'

/* ─── Cache helpers (stale-while-revalidate) ─────────────────── */
const CACHE_KEY = 'joi_products_v2'
const CACHE_TTL = 1000 * 60 * 30 // 30 minutes

function readCache() {
  try {
    const raw = localStorage.getItem(CACHE_KEY)
    if (!raw) return null
    const { data, ts } = JSON.parse(raw)
    return { data, expired: Date.now() - ts > CACHE_TTL }
  } catch { return null }
}

function writeCache(data) {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify({ data, ts: Date.now() }))
  } catch { /* storage full — silently skip */ }
}

/* ─── Global keyframes + utility classes ────────────────────── */
const STYLES = `
  @keyframes floatA      { 0%,100%{transform:translateY(0)}           50%{transform:translateY(-16px)} }
  @keyframes floatC      { 0%,100%{transform:translateY(0) scale(1)}  50%{transform:translateY(-5px) scale(1.004)} }
  @keyframes orbFloat    { 0%,100%{transform:translate(0,0)}          33%{transform:translate(10px,-16px)} 66%{transform:translate(-7px,9px)} }
  @keyframes fadeIn      { from{opacity:0}                            to{opacity:1} }
  @keyframes fadeUp      { from{opacity:0;transform:translateY(22px)} to{opacity:1;transform:translateY(0)} }
  @keyframes shimmer     { to{background-position:200% center} }
  @keyframes skeletonShimmer { 0%{background-position:-200% 0} 100%{background-position:200% 0} }
  @keyframes marquee     { from{transform:translateX(0)}              to{transform:translateX(-50%)} }
  @keyframes blink       { 0%,100%{opacity:.35}                       50%{opacity:1} }
  @keyframes pulseGlow   { 0%,100%{box-shadow:0 0 0 0 rgba(160,104,0,0)} 50%{box-shadow:0 0 18px 4px rgba(160,104,0,.12)} }
  @keyframes spin        { to{transform:rotate(360deg)} }
  @keyframes lineGrow    { from{width:0}                              to{width:44px} }
  @keyframes backdropIn  { from{opacity:0}                            to{opacity:1} }
  @keyframes modalIn     { from{opacity:0;transform:scale(.96) translateY(16px)} to{opacity:1;transform:scale(1) translateY(0)} }
  @keyframes imgReveal   { from{opacity:0} to{opacity:1} }

  /* ── Skeleton shimmer ── */
  .joi-skeleton {
    background: linear-gradient(90deg, #f0ede8 25%, #e8e3db 50%, #f0ede8 75%);
    background-size: 200% 100%;
    animation: skeletonShimmer 1.5s ease-in-out infinite;
  }

  /* ── LQIP blur-up image wrapper ── */
  .joi-img-wrap { position: relative; overflow: hidden; }
  .joi-img-lqip {
    position: absolute; inset: 0; width: 100%; height: 100%;
    object-fit: cover; object-position: center top;
    filter: blur(12px); transform: scale(1.08);
    transition: opacity .4s ease;
  }
  .joi-img-main {
    position: relative; width: 100%; height: 100%;
    object-fit: cover; object-position: center top;
    opacity: 0; transition: opacity .55s ease;
    display: block;
  }
  .joi-img-main.loaded { opacity: 1; }
  .joi-img-main.loaded + .joi-img-lqip,
  .joi-img-lqip.hidden { opacity: 0; pointer-events: none; }

  /* ── Mobile product grid ── */
  .joi-prod-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 14px;
    padding: 0 16px;
  }
  .joi-prod-card {
    background: #fff;
    border-radius: 16px;
    overflow: hidden;
    border: 1px solid #e8e2d8;
    box-shadow: 0 2px 12px rgba(0,0,0,.06);
    cursor: pointer;
    transition: transform .3s ease, box-shadow .3s ease;
    display: flex;
    flex-direction: column;
  }
  .joi-prod-card:active { transform: scale(0.97); box-shadow: 0 1px 6px rgba(0,0,0,.08); }
  .joi-prod-img {
    width: 100%;
    aspect-ratio: 3/4;
    object-fit: cover;
    object-position: center top;
    display: block;
  }
  .joi-prod-body {
    padding: 10px 10px 14px;
    flex: 1;
    display: flex;
    flex-direction: column;
  }
  .joi-prod-cat {
    font-size: 9px;
    letter-spacing: .14em;
    text-transform: uppercase;
    color: rgba(140,90,0,.6);
    margin-bottom: 4px;
    font-family: 'Montserrat', sans-serif;
  }
  .joi-prod-name {
    font-size: 0.88rem;
    font-weight: 400;
    font-family: 'Cormorant Garamond', serif;
    color: #1a1a1a;
    line-height: 1.35;
    margin: 0;
  }
  .joi-prod-tap {
    margin-top: 8px;
    font-size: 9px;
    color: #a06800;
    letter-spacing: .06em;
    font-family: 'Montserrat', sans-serif;
  }

  /* ── Mobile hero tweaks ── */
  @media (max-width: 480px) {
    .hero-title { font-size: clamp(2rem,12vw,3.2rem) !important; }
    .hero-sub   { font-size: 0.78rem !important; }
    .hero-btns  { flex-direction: column !important; align-items: stretch !important; }
    .hero-btns a { text-align: center !important; }
    .wt-badge   { flex-direction: column !important; gap: 4px !important; }
  }

  /* ── Lightbox thumbnail scrollbar hide ── */
  .joi-thumbstrip::-webkit-scrollbar { display: none; }
  .joi-thumbstrip { -ms-overflow-style:none; scrollbar-width:none; }

  /* ── Slider scrollbar hide ── */
  .joi-slider::-webkit-scrollbar { display: none; }
  .joi-slider { -ms-overflow-style:none; scrollbar-width:none; }
`

let stylesInjected = false
function injectStyles() {
  if (stylesInjected || typeof document === 'undefined') return
  const el = document.createElement('style')
  el.textContent = STYLES
  document.head.appendChild(el)
  stylesInjected = true
}

/* ─── Preload above-the-fold images ─────────────────────────── */
function preloadImages(products, count = 4) {
  if (typeof document === 'undefined') return
  products.slice(0, count).forEach(p => {
    if (!p.img) return
    const link = document.createElement('link')
    link.rel  = 'preload'
    link.as   = 'image'
    link.href = p.img
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

/* ─── Progressive image (LQIP blur-up) ──────────────────────── */
/**
 * Shows a tiny blurred placeholder immediately, then cross-fades to
 * the full image once it's downloaded. Zero layout shift.
 *
 * Props:
 *   src       – full-size URL (600w or zoom)
 *   srcSet    – responsive srcset string
 *   sizes     – sizes attribute
 *   lqip      – tiny ~40px URL for the blur placeholder
 *   alt, style, className, eager
 */
function ProgressiveImage({ src, srcSet, sizes, lqip, alt = '', style = {}, className = '', eager = false }) {
  const [loaded, setLoaded] = useState(false)
  const imgRef = useRef(null)

  // If the image is already in browser cache it fires load before React mounts
  useEffect(() => {
    if (imgRef.current?.complete) setLoaded(true)
  }, [])

  return (
    <div className="joi-img-wrap" style={style}>
      {/* Full image */}
      <img
        ref={imgRef}
        src={src}
        srcSet={srcSet}
        sizes={sizes}
        alt={alt}
        loading={eager ? 'eager' : 'lazy'}
        decoding="async"
        fetchpriority={eager ? 'high' : 'auto'}
        className={`joi-img-main${loaded ? ' loaded' : ''} ${className}`}
        style={{ position: 'relative', width: '100%', height: '100%' }}
        onLoad={() => setLoaded(true)}
      />
      {/* LQIP placeholder — sits on top until main image loads */}
      {lqip && (
        <img
          src={lqip}
          alt=""
          aria-hidden="true"
          className={`joi-img-lqip${loaded ? ' hidden' : ''}`}
        />
      )}
    </div>
  )
}

/* ─── Skeleton cards ─────────────────────────────────────────── */
function SkeletonDesktopCard() {
  return (
    <div style={{ border: '1px solid #e8e2d8', borderRadius: 4, overflow: 'hidden', background: '#fff' }}>
      <div className="joi-skeleton" style={{ height: 290, width: '100%' }} />
      <div style={{ padding: '1.1rem 1.2rem 1.3rem' }}>
        <div className="joi-skeleton" style={{ height: 18, width: '70%', borderRadius: 3, marginBottom: 10 }} />
        <div className="joi-skeleton" style={{ height: 11, width: '100%', borderRadius: 3, marginBottom: 6 }} />
        <div className="joi-skeleton" style={{ height: 11, width: '80%', borderRadius: 3, marginBottom: 6 }} />
        <div className="joi-skeleton" style={{ height: 11, width: '55%', borderRadius: 3 }} />
      </div>
    </div>
  )
}

function SkeletonMobileCard() {
  return (
    <div className="joi-prod-card" style={{ pointerEvents: 'none' }}>
      <div className="joi-skeleton" style={{ width: '100%', aspectRatio: '3/4' }} />
      <div className="joi-prod-body">
        <div className="joi-skeleton" style={{ height: 8, width: '50%', borderRadius: 3, marginBottom: 8 }} />
        <div className="joi-skeleton" style={{ height: 14, width: '85%', borderRadius: 3, marginBottom: 6 }} />
        <div className="joi-skeleton" style={{ height: 9, width: '35%', borderRadius: 3, marginTop: 8 }} />
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

  const startIdx    = products.findIndex(p => (p.id ?? p.name) === (product.id ?? product.name))
  const [currentIdx, setCurrentIdx] = useState(startIdx >= 0 ? startIdx : 0)
  const current     = products.length > 0 ? products[currentIdx] : product

  const goPrev = useCallback(() => {
    setZoomed(false); setPanX(0); setPanY(0)
    setCurrentIdx(i => Math.max(0, i - 1))
  }, [])
  const goNext = useCallback(() => {
    setZoomed(false); setPanX(0); setPanY(0)
    setCurrentIdx(i => Math.min(products.length - 1, i + 1))
  }, [products.length])

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

  // Use high-res zoom image in lightbox
  const zoomSrc = current.img_zoom || current.img

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, zIndex: 9999,
        background: 'rgba(0,0,0,.93)',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        animation: 'backdropIn .22s ease',
      }}>

      {/* Top bar */}
      <div
        onClick={e => e.stopPropagation()}
        style={{
          position: 'absolute', top: 0, left: 0, right: 0, zIndex: 10,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '14px 18px',
          background: 'linear-gradient(to bottom,rgba(0,0,0,.65),transparent)',
          pointerEvents: 'none',
        }}>
        <div style={{ pointerEvents: 'auto', color: 'rgba(255,255,255,.5)', fontSize: 11, letterSpacing: '.22em', textTransform: 'uppercase', fontFamily: "'Montserrat',sans-serif" }}>
          {current.cat || 'Product'}
          {products.length > 1 && (
            <span style={{ marginLeft: 10, color: 'rgba(255,255,255,.3)' }}>
              {currentIdx + 1} / {products.length}
            </span>
          )}
        </div>
        <div style={{ pointerEvents: 'auto', display: 'flex', gap: 8, alignItems: 'center' }}>
          <button
            onClick={() => setZoomed(z => !z)}
            title={zoomed ? 'Fit to screen' : 'Zoom in'}
            style={{
              background: zoomed ? 'rgba(160,104,0,.35)' : 'rgba(255,255,255,.12)',
              border: `1px solid ${zoomed ? 'rgba(160,104,0,.7)' : 'rgba(255,255,255,.22)'}`,
              borderRadius: 4, width: 40, height: 40,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', color: zoomed ? '#FFD700' : '#fff', transition: 'all .22s',
            }}>
            <ZoomIn size={16} />
          </button>
          <button
            onClick={onClose}
            style={{
              background: 'rgba(255,255,255,.12)',
              border: '1px solid rgba(255,255,255,.22)',
              borderRadius: 4, width: 40, height: 40,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', color: '#fff', transition: 'all .22s',
            }}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,.22)'}
            onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,.12)'}>
            <X size={16} />
          </button>
        </div>
      </div>

      {/* Main content */}
      <div
        onClick={e => e.stopPropagation()}
        style={{
          display: 'flex',
          flexDirection: isMobile ? 'column' : 'row',
          width: '100%', height: '100vh',
          maxWidth: 1140,
          paddingTop: 56,
          paddingBottom: products.length > 1 ? (isMobile ? 0 : 70) : 0,
          boxSizing: 'border-box',
          animation: 'modalIn .32s cubic-bezier(.25,.46,.45,.94)',
        }}>

        {/* Image pane */}
        <div
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
          onClick={() => { if (!isPanning) setZoomed(z => !z) }}
          style={{
            flex: isMobile ? '0 0 54vh' : '1 1 0',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            position: 'relative', overflow: 'hidden',
            cursor: zoomed ? (isPanning ? 'grabbing' : 'grab') : 'zoom-in',
            background: 'rgba(255,255,255,.03)',
          }}>

          <img
            src={zoomSrc}
            alt={current.name}
            draggable={false}
            loading="eager"
            style={{
              maxWidth: zoomed ? 'none' : '100%',
              maxHeight: zoomed ? 'none' : '100%',
              objectFit: 'contain',
              transform: zoomed
                ? `translate(${panX}px,${panY}px) scale(2.2)`
                : 'translate(0,0) scale(1)',
              transformOrigin: 'center center',
              transition: isPanning ? 'none' : 'transform .4s cubic-bezier(.25,.46,.45,.94)',
              userSelect: 'none', WebkitUserDrag: 'none', display: 'block',
            }}
          />

          {current.tag && (
            <div style={{ position: 'absolute', top: 14, left: 14, padding: '5px 13px', background: 'rgba(255,255,255,.93)', border: '1px solid rgba(140,90,0,.3)', color: '#a06800', fontSize: 8, letterSpacing: '.16em', textTransform: 'uppercase', borderRadius: 2, fontFamily: "'Montserrat',sans-serif", pointerEvents: 'none' }}>
              {current.tag}
            </div>
          )}

          {!zoomed && (
            <div style={{ position: 'absolute', bottom: 14, right: 14, background: 'rgba(0,0,0,.55)', borderRadius: 20, padding: '5px 14px', display: 'flex', alignItems: 'center', gap: 6, color: 'rgba(255,255,255,.72)', fontSize: 10, letterSpacing: '.08em', fontFamily: "'Montserrat',sans-serif", pointerEvents: 'none' }}>
              <ZoomIn size={12} /> Click to zoom
            </div>
          )}
          {zoomed && (
            <div style={{ position: 'absolute', bottom: 14, right: 14, background: 'rgba(160,104,0,.75)', borderRadius: 20, padding: '5px 14px', color: '#fff', fontSize: 10, letterSpacing: '.08em', fontFamily: "'Montserrat',sans-serif", pointerEvents: 'none' }}>
              Drag to pan · click to fit
            </div>
          )}
        </div>

        {/* Info pane */}
        <div style={{
          width: isMobile ? '100%' : 300, flexShrink: 0,
          display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
          padding: isMobile ? '20px 20px 28px' : '2.5rem 2rem',
          background: '#111', overflowY: 'auto', boxSizing: 'border-box',
        }}>
          <div>
            {current.cat && (
              <div style={{ fontSize: 8, letterSpacing: '.24em', textTransform: 'uppercase', color: 'rgba(160,104,0,.7)', marginBottom: 12, fontFamily: "'Montserrat',sans-serif" }}>
                {current.cat}
              </div>
            )}
            <h2 style={{ fontSize: 'clamp(1.3rem,4vw,1.75rem)', fontWeight: 400, fontFamily: "'Cormorant Garamond',serif", color: '#fff', lineHeight: 1.2, marginBottom: 14 }}>
              {current.name}
            </h2>
            <div style={{ width: 32, height: 1, background: '#a06800', marginBottom: 16 }} />
            {current.desc && (
              <p style={{ color: 'rgba(255,255,255,.52)', fontSize: 13, lineHeight: 1.95, margin: 0 }}>
                {current.desc}
              </p>
            )}
          </div>
          <div style={{ borderTop: '1px solid rgba(255,255,255,.08)', paddingTop: 20, marginTop: 24 }}>
            <p style={{ fontSize: 11, color: 'rgba(255,255,255,.32)', letterSpacing: '.04em', marginBottom: 12, fontFamily: "'Montserrat',sans-serif" }}>
              Interested in stocking this product?
            </p>
            <a
              href="mailto:Wellssolutions2015@gmail.com"
              style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '12px 28px', background: '#a06800', color: '#fff', fontSize: 9, letterSpacing: '.2em', textTransform: 'uppercase', textDecoration: 'none', fontWeight: 600, transition: 'background .25s', borderRadius: 2, fontFamily: "'Montserrat',sans-serif" }}
              onMouseEnter={e => e.currentTarget.style.background = '#8a5a00'}
              onMouseLeave={e => e.currentTarget.style.background = '#a06800'}>
              Enquire Now <ArrowRight size={12} />
            </a>
          </div>
        </div>
      </div>

      {/* Prev / Next arrows */}
      {products.length > 1 && (
        <>
          <button
            onClick={e => { e.stopPropagation(); goPrev() }}
            disabled={!hasPrev}
            style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', width: 46, height: 46, borderRadius: '50%', background: hasPrev ? 'rgba(255,255,255,.12)' : 'rgba(255,255,255,.04)', border: `1px solid ${hasPrev ? 'rgba(255,255,255,.22)' : 'rgba(255,255,255,.08)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: hasPrev ? 'pointer' : 'default', color: hasPrev ? '#fff' : 'rgba(255,255,255,.2)', transition: 'all .22s', zIndex: 10 }}
            onMouseEnter={e => { if (hasPrev) e.currentTarget.style.background = 'rgba(255,255,255,.22)' }}
            onMouseLeave={e => e.currentTarget.style.background = hasPrev ? 'rgba(255,255,255,.12)' : 'rgba(255,255,255,.04)'}>
            <ChevronLeft size={20} />
          </button>
          <button
            onClick={e => { e.stopPropagation(); goNext() }}
            disabled={!hasNext}
            style={{ position: 'absolute', right: isMobile ? 14 : 314, top: '50%', transform: 'translateY(-50%)', width: 46, height: 46, borderRadius: '50%', background: hasNext ? 'rgba(255,255,255,.12)' : 'rgba(255,255,255,.04)', border: `1px solid ${hasNext ? 'rgba(255,255,255,.22)' : 'rgba(255,255,255,.08)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: hasNext ? 'pointer' : 'default', color: hasNext ? '#fff' : 'rgba(255,255,255,.2)', transition: 'all .22s', zIndex: 10 }}
            onMouseEnter={e => { if (hasNext) e.currentTarget.style.background = 'rgba(255,255,255,.22)' }}
            onMouseLeave={e => e.currentTarget.style.background = hasNext ? 'rgba(255,255,255,.12)' : 'rgba(255,255,255,.04)'}>
            <ChevronRight size={20} />
          </button>
        </>
      )}

      {/* Thumbnail strip */}
      {products.length > 1 && (
        <div
          onClick={e => e.stopPropagation()}
          className="joi-thumbstrip"
          style={{ position: 'absolute', bottom: 0, left: 0, right: isMobile ? 0 : 300, height: 70, display: 'flex', alignItems: 'center', gap: 6, padding: '0 18px', overflowX: 'auto', background: 'linear-gradient(to top,rgba(0,0,0,.7),rgba(0,0,0,.35))' }}>
          {products.map((p, i) => (
            <div
              key={p.id ?? p.name}
              onClick={() => { setZoomed(false); setPanX(0); setPanY(0); setCurrentIdx(i) }}
              style={{ width: 46, height: 52, flexShrink: 0, borderRadius: 3, overflow: 'hidden', border: `2px solid ${i === currentIdx ? '#a06800' : 'rgba(255,255,255,.15)'}`, cursor: 'pointer', opacity: i === currentIdx ? 1 : 0.5, transform: i === currentIdx ? 'scale(1.08)' : 'scale(1)', transition: 'all .22s' }}>
              <img
                src={p.img_sm || p.img}
                alt={p.name}
                style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center top', display: 'block' }}
              />
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
    <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden' }}>
      {[{ size: 300, top: '8%',  left: '-6%',  dur: 14 },
        { size: 180, top: '58%', right: '-4%', dur: 18 },
        { size: 120, top: '28%', right: '14%', dur: 11 }].map((o, i) => (
        <div key={i} style={{ position: 'absolute', width: o.size, height: o.size, borderRadius: '50%', background: 'radial-gradient(circle,rgba(160,104,0,.06) 0%,transparent 70%)', top: o.top, left: o.left, right: o.right, animation: `orbFloat ${o.dur}s ease-in-out ${i * -3}s infinite` }} />
      ))}
    </div>
  )
}

/* ─── Floating product bubble (hero deco) ────────────────────── */
function FloatingBubble({ img, size, top, left, right, bottom, delay, duration }) {
  if (!img) return null
  return (
    <div style={{ position: 'absolute', width: size, height: size, top, left, right, bottom, borderRadius: '50%', overflow: 'hidden', opacity: 0.22, pointerEvents: 'none', animation: `floatA ${duration}s ease-in-out ${delay}s infinite`, zIndex: 1, border: '2px solid rgba(255,255,255,.22)', boxShadow: '0 18px 50px rgba(0,0,0,.14)' }}>
      <img src={img} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'brightness(.95) saturate(1.1)' }} />
    </div>
  )
}

/* ─── Desktop product card ───────────────────────────────────── */
function DesktopCard({ p, i, onZoom }) {
  const [hov, setHov] = useState(false)
  const isAboveFold   = i < 4

  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      onClick={() => onZoom(p)}
      style={{
        background: '#fff',
        border: `1px solid ${hov ? 'rgba(140,90,0,.4)' : '#e0dbd0'}`,
        borderRadius: 4, overflow: 'hidden', cursor: 'pointer',
        transition: 'all .4s cubic-bezier(.25,.46,.45,.94)',
        transform: hov ? 'translateY(-7px) scale(1.012)' : 'translateY(0) scale(1)',
        boxShadow: hov ? '0 22px 50px rgba(0,0,0,.11)' : '0 4px 18px rgba(0,0,0,.07)',
        animation: `floatC ${3.2 + (i % 3) * .55}s ease-in-out ${i * .14}s infinite`,
        display: 'flex', flexDirection: 'column', position: 'relative',
      }}>

      {/* Image with LQIP blur-up */}
      <div style={{ position: 'relative', height: 290, overflow: 'hidden', background: '#f7f6f2', flexShrink: 0 }}>
        <ProgressiveImage
          src={p.img}
          srcSet={p.img_sm ? `${p.img_sm} 300w, ${p.img} 600w` : undefined}
          sizes="(max-width: 640px) 50vw, 295px"
          lqip={p.img_lqip}
          alt={p.name}
          eager={isAboveFold}
          style={{ width: '100%', height: '100%' }}
        />

        {/* Gradient overlay */}
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top,rgba(0,0,0,.25) 0%,transparent 55%)', pointerEvents: 'none' }} />

        {/* Image scale on hover */}
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: `url(${p.img})`,
          backgroundSize: 'cover', backgroundPosition: 'center top',
          opacity: 0, transition: 'opacity .65s ease, transform .65s ease',
          transform: hov ? 'scale(1.07)' : 'scale(1)',
          pointerEvents: 'none',
        }} />

        {p.tag && (
          <div style={{ position: 'absolute', top: 12, left: 12, padding: '4px 11px', background: 'rgba(255,255,255,.93)', border: '1px solid rgba(140,90,0,.28)', color: '#a06800', fontSize: 8, letterSpacing: '.16em', textTransform: 'uppercase', borderRadius: 2 }}>
            {p.tag}
          </div>
        )}
        {p.cat && (
          <div style={{ position: 'absolute', bottom: 11, left: 12, color: 'rgba(255,255,255,.88)', fontSize: 9, letterSpacing: '.24em', textTransform: 'uppercase' }}>
            {p.cat}
          </div>
        )}
        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: hov ? 1 : 0, transition: 'opacity .28s', pointerEvents: 'none' }}>
          <div style={{ background: 'rgba(0,0,0,.42)', borderRadius: '50%', width: 44, height: 44, display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(255,255,255,.35)' }}>
            <ZoomIn size={18} color="#fff" />
          </div>
        </div>
      </div>

      <div style={{ padding: '1.1rem 1.2rem 1.3rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
        <h3 style={{ fontSize: '1.05rem', fontWeight: 400, fontFamily: "'Cormorant Garamond',serif", color: '#1a1a1a', lineHeight: 1.3, marginBottom: 6 }}>
          {p.name}
        </h3>
        {p.desc && (
          <p style={{ color: '#888', fontSize: 11.5, lineHeight: 1.72, flex: 1, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
            {p.desc}
          </p>
        )}
        <p style={{ fontSize: 9.5, color: 'rgba(140,90,0,.6)', marginTop: 8, letterSpacing: '.08em', fontFamily: "'Montserrat',sans-serif" }}>
          Click to view details →
        </p>
      </div>
    </div>
  )
}

/* ─── Mobile product card ─────────────────────────────────────── */
function MobileCard({ p, onZoom, eager = false }) {
  return (
    <div className="joi-prod-card" onClick={() => onZoom(p)}>
      <div style={{ position: 'relative', aspectRatio: '3/4', overflow: 'hidden', background: '#f7f6f2' }}>
        <ProgressiveImage
          src={p.img_sm || p.img}
          srcSet={p.img_sm ? `${p.img_sm} 300w, ${p.img} 600w` : undefined}
          sizes="50vw"
          lqip={p.img_lqip}
          alt={p.name}
          eager={eager}
          style={{ width: '100%', height: '100%' }}
        />
        <div style={{ position: 'absolute', bottom: 8, right: 8, background: 'rgba(0,0,0,.5)', borderRadius: '50%', width: 30, height: 30, display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(255,255,255,.3)' }}>
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

/* ─── Search & Filter bar ────────────────────────────────────── */
function SearchFilterBar({ query, setQuery, activeFilter, setActiveFilter, allCats, isMobile }) {
  const [focused, setFocused] = useState(false)
  return (
    <div style={{ maxWidth: 860, margin: '0 auto', marginBottom: isMobile ? 24 : 44, padding: '0 1rem' }}>
      <div style={{ position: 'relative', marginBottom: 14, border: `1.5px solid ${focused ? '#a06800' : '#e0dbd0'}`, background: '#fff', transition: 'border .25s', display: 'flex', alignItems: 'center', borderRadius: isMobile ? 12 : 2, boxShadow: focused ? '0 0 0 3px rgba(160,104,0,.08)' : 'none' }}>
        <Search size={15} color="rgba(140,90,0,.55)" style={{ marginLeft: 14, flexShrink: 0 }} />
        <input
          type="text" value={query} onChange={e => setQuery(e.target.value)}
          onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
          placeholder="Search products…"
          style={{ flex: 1, padding: '12px 12px', background: 'transparent', border: 'none', outline: 'none', color: '#1a1a1a', fontSize: isMobile ? 14 : 12, fontFamily: "'Montserrat',sans-serif" }}
        />
        {query && (
          <button onClick={() => setQuery('')} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '0 12px', color: 'rgba(140,90,0,.6)', display: 'flex', alignItems: 'center' }}>
            <X size={14} />
          </button>
        )}
      </div>
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', justifyContent: isMobile ? 'flex-start' : 'center', overflowX: isMobile ? 'auto' : 'visible', paddingBottom: isMobile ? 4 : 0 }}>
        {allCats.map(cat => (
          <button
            key={cat}
            onClick={() => setActiveFilter(cat)}
            style={{ padding: isMobile ? '7px 14px' : '7px 16px', background: activeFilter === cat ? 'rgba(160,104,0,.1)' : 'transparent', border: `1px solid ${activeFilter === cat ? 'rgba(140,90,0,.5)' : '#e0dbd0'}`, color: activeFilter === cat ? '#a06800' : '#888', fontSize: 9, letterSpacing: '.18em', textTransform: 'uppercase', cursor: 'pointer', transition: 'all .22s', fontFamily: "'Montserrat',sans-serif", whiteSpace: 'nowrap', borderRadius: isMobile ? 20 : 2 }}>
            {cat}
          </button>
        ))}
      </div>
    </div>
  )
}

/* ─── Product Slider (desktop featured) ─────────────────────── */
function ProductSlider({ products, loading, onZoom }) {
  const [idx, setIdx]   = useState(0)
  const trackRef        = useRef(null)
  const { ref, vis }    = useVisible(0.05)
  const CARD_W = 295, GAP = 18

  const prev = () => setIdx(i => Math.max(0, i - 1))
  const next = () => setIdx(i => Math.min(products.length - 1, i + 1))

  useEffect(() => {
    if (!trackRef.current) return
    trackRef.current.scrollTo({ left: idx * (CARD_W + GAP), behavior: 'smooth' })
  }, [idx])

  const SKELETON_COUNT = 4

  return (
    <section ref={ref} style={{ padding: '4rem 0 5.5rem', position: 'relative', background: '#f7f6f2' }}>
      {!loading && products[0] && <FloatingBubble img={products[0].img_sm || products[0].img} size={80} top="-24px" right="5%" delay={0} duration={5} />}
      {!loading && products[3] && <FloatingBubble img={products[3].img_sm || products[3].img} size={65} bottom="36px" left="2%" delay={1.5} duration={6} />}

      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 1rem', position: 'relative', zIndex: 2 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 32, flexWrap: 'wrap', gap: 12, opacity: vis ? 1 : 0, transform: vis ? 'none' : 'translateY(18px)', transition: 'all .7s' }}>
          <div>
            <div style={{ fontSize: 9, letterSpacing: '.45em', textTransform: 'uppercase', color: '#a06800', marginBottom: 9, fontFamily: "'Montserrat',sans-serif" }}>Product Range</div>
            <h2 style={{ fontSize: 'clamp(1.8rem,5vw,3rem)', fontWeight: 300, fontFamily: "'Cormorant Garamond',serif", color: '#1a1a1a', lineHeight: 1.1 }}>Our Range</h2>
          </div>
          {!loading && (
            <div style={{ display: 'flex', gap: 10 }}>
              {[{ fn: prev, dis: idx === 0, Icon: ChevronLeft }, { fn: next, dis: idx >= products.length - 1, Icon: ChevronRight }].map(({ fn, dis, Icon }, ki) => (
                <button key={ki} onClick={fn} disabled={dis} style={{ width: 44, height: 44, border: `1px solid ${dis ? '#e0dbd0' : 'rgba(140,90,0,.4)'}`, background: 'transparent', cursor: dis ? 'default' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: dis ? '#ccc' : '#a06800', transition: 'all .28s' }}>
                  <Icon size={18} />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Skeleton or real cards */}
        <div
          ref={trackRef}
          className="joi-slider"
          style={{ display: 'flex', gap: GAP, overflowX: 'auto', scrollSnapType: 'x mandatory', WebkitOverflowScrolling: 'touch', paddingBottom: 4 }}>
          {loading
            ? Array(SKELETON_COUNT).fill(0).map((_, i) => (
                <div key={i} style={{ scrollSnapAlign: 'start', width: CARD_W, minWidth: CARD_W }}>
                  <SkeletonDesktopCard />
                </div>
              ))
            : products.map((p, i) => (
                <div key={p.id ?? i} style={{ scrollSnapAlign: 'start', width: CARD_W, minWidth: CARD_W }}>
                  <DesktopCard p={p} i={i} onZoom={onZoom} />
                </div>
              ))
          }
        </div>

        {/* Dots */}
        {!loading && (
          <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginTop: 22 }}>
            {products.map((_, i) => (
              <button key={i} onClick={() => setIdx(i)} style={{ width: i === idx ? 26 : 8, height: 8, borderRadius: 4, background: i === idx ? '#a06800' : 'rgba(140,90,0,.2)', border: 'none', cursor: 'pointer', transition: 'all .32s cubic-bezier(.25,.46,.45,.94)' }} />
            ))}
          </div>
        )}

        <div style={{ textAlign: 'center', marginTop: 32 }}>
          <a
            href="#collections"
            style={{ padding: '12px 34px', border: '1px solid rgba(140,90,0,.35)', color: '#a06800', fontSize: 10, letterSpacing: '.22em', textTransform: 'uppercase', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 9, transition: 'all .28s', fontFamily: "'Montserrat',sans-serif" }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(160,104,0,.07)'; e.currentTarget.style.borderColor = 'rgba(140,90,0,.6)' }}
            onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = 'rgba(140,90,0,.35)' }}>
            View Full Range <ArrowRight size={13} />
          </a>
        </div>
      </div>
    </section>
  )
}

/* ─── Product Showcase ───────────────────────────────────────── */
function ProductShowcase({ products, loading, onZoom }) {
  const { ref, vis }              = useVisible(0.05)
  const [query, setQuery]         = useState('')
  const [activeFilter, setFilter] = useState('All')
  const [visibleCount, setVisible] = useState(12)
  const isMobile                  = useIsMobile()
  const SKELETON_COUNT            = isMobile ? 6 : 8

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
    <section id="collections" ref={ref} style={{ padding: isMobile ? '3rem 0 4rem' : '5rem 1rem', position: 'relative', overflow: 'hidden', background: '#fff' }}>
      {!isMobile && !loading && (
        <>
          <FloatingBubble img={products[2]?.img_sm} size={120} top="8%"  right="-20px" delay={0} duration={7} />
          <FloatingBubble img={products[4]?.img_sm} size={80}  bottom="4%" left="-12px"  delay={2} duration={8} />
        </>
      )}
      <div style={{ maxWidth: 1280, margin: '0 auto', position: 'relative', zIndex: 2 }}>

        {/* Heading */}
        <div style={{ textAlign: 'center', marginBottom: isMobile ? 24 : 44, padding: isMobile ? '0 1rem' : 0, opacity: vis ? 1 : 0, transform: vis ? 'none' : 'translateY(22px)', transition: 'all .75s' }}>
          <div style={{ fontSize: 9, letterSpacing: '.45em', textTransform: 'uppercase', color: '#a06800', marginBottom: 10, fontFamily: "'Montserrat',sans-serif" }}>Browse Our Range</div>
          <h2 style={{ fontSize: 'clamp(1.8rem,5vw,3.2rem)', fontWeight: 300, fontFamily: "'Cormorant Garamond',serif", color: '#1a1a1a', marginBottom: 6 }}>Our Products</h2>
          <p style={{ color: '#aaa', fontSize: 11, letterSpacing: '.08em', fontFamily: "'Montserrat',sans-serif" }}>
            {isMobile ? 'Tap any product to view details' : 'Click any product to view details and enquire'}
          </p>
        </div>

        {/* Search + Filter — only show when products are loaded */}
        {!loading && (
          <SearchFilterBar
            query={query} setQuery={setQuery}
            activeFilter={activeFilter} setActiveFilter={setFilter}
            allCats={ALL_CATS} isMobile={isMobile}
          />
        )}

        {/* Skeleton grid */}
        {loading ? (
          isMobile ? (
            <div className="joi-prod-grid">
              {Array(SKELETON_COUNT).fill(0).map((_, i) => <SkeletonMobileCard key={i} />)}
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(min(100%,275px),1fr))', gap: '20px' }}>
              {Array(SKELETON_COUNT).fill(0).map((_, i) => <SkeletonDesktopCard key={i} />)}
            </div>
          )
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '4rem 1rem', color: '#bbb', fontFamily: "'Cormorant Garamond',serif", fontSize: '1.5rem' }}>
            No products match <span style={{ color: '#a06800' }}>"{query}"</span>
          </div>
        ) : (
          <>
            {isMobile ? (
              <div className="joi-prod-grid">
                {visible.map((p, i) => (
                  <MobileCard key={p.id ?? p.name} p={p} onZoom={onZoom} eager={i < 4} />
                ))}
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(min(100%,275px),1fr))', gap: '20px' }}>
                {visible.map((p, i) => <DesktopCard key={p.id ?? p.name} p={p} i={i} onZoom={onZoom} />)}
              </div>
            )}

            {hasMore && (
              <div style={{ textAlign: 'center', marginTop: 28, padding: isMobile ? '0 16px' : 0 }}>
                <button
                  onClick={() => setVisible(c => c + 12)}
                  style={{ padding: '13px 36px', border: '1px solid rgba(140,90,0,.35)', color: '#a06800', background: 'transparent', fontSize: 10, letterSpacing: '.22em', textTransform: 'uppercase', cursor: 'pointer', transition: 'all .28s', fontFamily: "'Montserrat',sans-serif", borderRadius: isMobile ? 24 : 2, width: isMobile ? '100%' : 'auto' }}
                  onMouseEnter={e => { e.currentTarget.style.background = 'rgba(160,104,0,.07)'; e.currentTarget.style.borderColor = 'rgba(140,90,0,.6)' }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = 'rgba(140,90,0,.35)' }}>
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
    <section id="story" ref={ref} style={{ padding: '6rem 2rem', background: '#faf9f6', borderBottom: '1px solid #e8e2d8', position: 'relative', overflow: 'hidden' }}>
      <FloatingOrbs />
      <div style={{ maxWidth: 1100, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(min(100%,280px),1fr))', gap: '4.5rem', alignItems: 'center', position: 'relative', zIndex: 1 }}>

        <div style={{ position: 'relative', opacity: vis ? 1 : 0, transform: vis ? 'translateX(0)' : 'translateX(-30px)', transition: 'all .9s ease' }}>
          <div style={{ position: 'absolute', top: -16, left: -16, right: 16, bottom: 16, border: '1px solid rgba(140,90,0,.16)', zIndex: 0, pointerEvents: 'none' }} />
          <img src={STORY_IMG} alt="Joi Story" style={{ width: '100%', height: 440, objectFit: 'cover', position: 'relative', zIndex: 1, filter: 'brightness(.91) saturate(1.05)', display: 'block' }} />
          <div style={{ position: 'absolute', bottom: -18, right: -18, background: 'linear-gradient(135deg,#FFD700,#FFE34D)', padding: '1rem 1.4rem', zIndex: 2, boxShadow: '0 10px 36px rgba(0,0,0,.13)' }}>
            <div style={{ fontSize: 8, letterSpacing: '.2em', textTransform: 'uppercase', color: '#1a1a1a', fontWeight: 700, fontFamily: "'Montserrat',sans-serif" }}>Proudly</div>
            <div style={{ fontSize: '1.4rem', fontWeight: 300, fontFamily: "'Cormorant Garamond',serif", color: '#1a1a1a', lineHeight: 1.1 }}>Made in Kenya</div>
          </div>
        </div>

        <div style={{ opacity: vis ? 1 : 0, transform: vis ? 'translateX(0)' : 'translateX(30px)', transition: 'all .9s ease .15s' }}>
          <div style={{ fontSize: 9, letterSpacing: '.45em', textTransform: 'uppercase', color: '#a06800', marginBottom: 14, fontFamily: "'Montserrat',sans-serif" }}>Our Story</div>
          <h2 style={{ fontSize: 'clamp(1.8rem,4vw,3rem)', fontWeight: 300, fontFamily: "'Cormorant Garamond',serif", color: '#1a1a1a', lineHeight: 1.2, marginBottom: 18 }}>
            Built for Africa.{' '}
            <span style={{ background: 'linear-gradient(135deg,#a06800,#c28a00)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Made with Joy.</span>
          </h2>
          <div style={{ width: 0, height: 1, background: '#a06800', marginBottom: 22, animation: vis ? 'lineGrow .8s ease .4s forwards' : 'none' }} />
          <p style={{ color: '#555', fontSize: 14, lineHeight: 1.9, marginBottom: 14 }}>
            Joi began with a simple but powerful observation: African consumers deserved quality beauty and hair care products that truly understood their needs — without the premium price tag.
          </p>
          <p style={{ color: '#777', fontSize: 13, lineHeight: 1.9, marginBottom: 14 }}>
            Every Joi product is built from the ground up with African hair at the centre of every formulation decision. From raw material selection to texture, fragrance, and finish — the African consumer experience was never an afterthought. It was the starting point.
          </p>
          <p style={{ color: '#777', fontSize: 13, lineHeight: 1.9, marginBottom: 30 }}>
            The name says it all. Not just a brand — a feeling. The joy of a good hair day, the confidence of a well-maintained look, the satisfaction of a product that does exactly what it promises.
          </p>
          <Link
            to="/about"
            style={{ display: 'inline-flex', alignItems: 'center', gap: 8, color: '#a06800', fontSize: 10, letterSpacing: '.22em', textTransform: 'uppercase', textDecoration: 'none', borderBottom: '1px solid rgba(140,90,0,.35)', paddingBottom: 3, fontFamily: "'Montserrat',sans-serif" }}
            onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(140,90,0,.8)'}
            onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(140,90,0,.35)'}>
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
    <section ref={ref} style={{ padding: '4.5rem 1rem', maxWidth: 1280, margin: '0 auto' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(min(100%,210px),1fr))', gap: 20 }}>
        {features.map(({ icon: Icon, title, desc }, i) => (
          <div key={title} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', padding: '2.2rem 1.4rem', border: '1px solid #e8e2d8', background: '#faf9f6', opacity: vis ? 1 : 0, transform: vis ? 'translateY(0)' : 'translateY(30px)', transition: `all .72s ease ${i * .17}s` }}>
            <div style={{ width: 50, height: 50, border: '1px solid rgba(140,90,0,.32)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16, background: 'rgba(160,104,0,.05)', animation: `pulseGlow 3.5s ease-in-out ${i * .8}s infinite` }}>
              <Icon size={19} color="#a06800" />
            </div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 400, fontFamily: "'Cormorant Garamond',serif", color: '#1a1a1a', marginBottom: 9 }}>{title}</h3>
            <p style={{ color: '#777', fontSize: 11.5, lineHeight: 1.85 }}>{desc}</p>
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
    const t = setInterval(() => setActive(a => (a + 1) % reviews.length), 4500)
    return () => clearInterval(t)
  }, [])
  return (
    <section ref={ref} style={{ padding: '5rem 1rem', background: '#f7f6f2', borderTop: '1px solid #e8e2d8', borderBottom: '1px solid #e8e2d8', overflow: 'hidden' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 40, opacity: vis ? 1 : 0, transform: vis ? 'none' : 'translateY(18px)', transition: 'all .7s' }}>
          <div style={{ fontSize: 9, letterSpacing: '.45em', textTransform: 'uppercase', color: '#a06800', marginBottom: 10, fontFamily: "'Montserrat',sans-serif" }}>What People Say</div>
          <h2 style={{ fontSize: 'clamp(1.8rem,4vw,3rem)', fontWeight: 300, fontFamily: "'Cormorant Garamond',serif", color: '#1a1a1a' }}>Voices of Joy</h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(min(100%,250px),1fr))', gap: 16 }}>
          {reviews.map((r, i) => (
            <div
              key={r.name}
              onClick={() => setActive(i)}
              style={{ padding: '2rem', border: `1px solid ${i === active ? 'rgba(140,90,0,.38)' : '#e8e2d8'}`, background: i === active ? '#fff' : '#faf9f6', opacity: vis ? 1 : 0, transform: vis ? 'translateY(0)' : 'translateY(28px)', transition: `all .7s ease ${i * .13}s,border .35s,background .35s`, boxShadow: i === active ? '0 8px 36px rgba(0,0,0,.07)' : 'none', cursor: 'pointer', borderRadius: 4 }}>
              <div style={{ display: 'flex', gap: 3, marginBottom: 12 }}>
                {Array(r.stars).fill(0).map((_, si) => <Star key={si} size={12} fill="#a06800" color="#a06800" />)}
              </div>
              <p style={{ fontSize: '1rem', fontStyle: 'italic', fontFamily: "'Cormorant Garamond',serif", color: '#444', lineHeight: 1.85, marginBottom: 16 }}>{r.text}</p>
              <div style={{ color: '#1a1a1a', fontSize: 12, fontWeight: 500, fontFamily: "'Montserrat',sans-serif" }}>{r.name}</div>
              <div style={{ color: 'rgba(140,90,0,.65)', fontSize: 10.5, marginTop: 3, fontFamily: "'Montserrat',sans-serif" }}>{r.role}</div>
            </div>
          ))}
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginTop: 22 }}>
          {reviews.map((_, i) => <button key={i} onClick={() => setActive(i)} style={{ width: i === active ? 22 : 8, height: 8, borderRadius: 4, background: i === active ? '#a06800' : 'rgba(140,90,0,.2)', border: 'none', cursor: 'pointer', transition: 'all .28s' }} />)}
        </div>
      </div>
    </section>
  )
}

/* ─── CTA Banner ─────────────────────────────────────────────── */
function CtaBanner() {
  const { ref, vis } = useVisible()
  return (
    <section ref={ref} style={{ padding: '6rem 1rem', position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', inset: 0, backgroundImage: 'url(https://images.pexels.com/photos/4041392/pexels-photo-4041392.jpeg?auto=compress&cs=tinysrgb&w=1600)', backgroundSize: 'cover', backgroundPosition: 'center', filter: 'brightness(.52)' }} />
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg,rgba(255,250,240,.1),rgba(160,104,0,.07))' }} />
      <div style={{ position: 'relative', textAlign: 'center', maxWidth: 580, margin: '0 auto', zIndex: 2, opacity: vis ? 1 : 0, transform: vis ? 'translateY(0)' : 'translateY(28px)', transition: 'all .85s ease' }}>
        <div style={{ fontSize: 9, letterSpacing: '.45em', textTransform: 'uppercase', color: '#e8c870', marginBottom: 16, fontFamily: "'Montserrat',sans-serif" }}>Work With Joi</div>
        <h2 style={{ fontSize: 'clamp(1.8rem,5vw,3.3rem)', fontWeight: 300, fontFamily: "'Cormorant Garamond',serif", color: '#fff', lineHeight: 1.2, marginBottom: 16 }}>
          Quality Hair Care Products,{' '}
          <span style={{ background: 'linear-gradient(135deg,#FFD700,#FFEC99)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Proudly Made in Kenya.</span>
        </h2>
        <p style={{ color: 'rgba(255,255,255,.7)', fontSize: 13, lineHeight: 1.9, marginBottom: 34 }}>
          Interested in stocking our range, becoming a distributor, or simply want to learn more about what we manufacture? We'd love to hear from you.
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 18 }}>
          <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap', justifyContent: 'center' }}>
            <a href="tel:0748635395" style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'rgba(255,255,255,.75)', fontSize: 13, textDecoration: 'none', transition: 'color .22s', fontFamily: "'Montserrat',sans-serif" }} onMouseEnter={e => e.currentTarget.style.color = '#FFD700'} onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,.75)'}><Phone size={14} color="#FFD700" />0748 635 395</a>
            <a href="mailto:Wellssolutions2015@gmail.com" style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'rgba(255,255,255,.75)', fontSize: 13, textDecoration: 'none', transition: 'color .22s', fontFamily: "'Montserrat',sans-serif" }} onMouseEnter={e => e.currentTarget.style.color = '#FFD700'} onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,.75)'}><Mail size={14} color="#FFD700" />Wellssolutions2015@gmail.com</a>
          </div>
          <a
            href="mailto:Wellssolutions2015@gmail.com"
            style={{ padding: '13px 36px', background: 'linear-gradient(135deg,#FFD700,#FFE34D)', color: '#1a1a1a', fontSize: 10, letterSpacing: '.22em', textTransform: 'uppercase', textDecoration: 'none', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: 10, transition: 'transform .28s', fontFamily: "'Montserrat',sans-serif" }}
            onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
            onMouseLeave={e => e.currentTarget.style.transform = 'none'}>
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
  const px = (mouse.x - .5) * 14, py = (mouse.y - .5) * 14

  return (
    <section style={{ position: 'relative', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', inset: '-10%', backgroundImage: `url(${HERO_BG})`, backgroundSize: 'cover', backgroundPosition: 'center 30%', transform: `translate(${px * .28}px,${py * .28}px)`, transition: 'transform .1s linear', filter: 'brightness(.48)' }} />
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg,rgba(0,0,0,.18) 0%,rgba(0,0,0,.42) 55%,rgba(0,0,0,.6) 100%)' }} />
      <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(255,255,255,.018) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.018) 1px,transparent 1px)', backgroundSize: '68px 68px' }} />
      <FloatingOrbs />

      {/* Hero product bubbles — only render when loaded */}
      {!loading && products[0] && <FloatingBubble img={products[0].img_sm || products[0].img} size={145} top="10%"   right="5%"   delay={0}   duration={6} />}
      {!loading && products[1] && <FloatingBubble img={products[1].img_sm || products[1].img} size={105} bottom="20%" right="7%"   delay={1.5} duration={7} />}
      {!loading && products[2] && <FloatingBubble img={products[2].img_sm || products[2].img} size={90}  top="22%"   left="3.5%"  delay={.8}  duration={5.5} />}
      {!loading && products[3] && <FloatingBubble img={products[3].img_sm || products[3].img} size={72}  bottom="28%" left="5%"   delay={2.5} duration={6.5} />}

      <div style={{ position: 'relative', zIndex: 2, textAlign: 'center', padding: '8.5rem 1.2rem 3rem', maxWidth: 860, width: '100%' }}>

        <div
          className="wt-badge"
          style={{ display: 'inline-flex', alignItems: 'center', gap: 10, background: 'rgba(255,255,255,.1)', border: '1px solid rgba(255,215,0,.35)', backdropFilter: 'blur(8px)', padding: '10px 20px', borderRadius: 2, marginBottom: 28, marginTop: '-10rem', opacity: 0, animation: 'fadeIn 1s ease .05s forwards' }}>
          <Building2 size={14} color="#FFD700" />
          <span style={{ fontSize: 10, letterSpacing: '.22em', textTransform: 'uppercase', color: 'rgba(255,255,255,.9)', fontFamily: "'Montserrat',sans-serif", fontWeight: 600 }}>Wellstrend Creations Ltd</span>
          <span style={{ width: 1, height: 14, background: 'rgba(255,215,0,.35)' }} />
          <span style={{ fontSize: 9, letterSpacing: '.16em', textTransform: 'uppercase', color: 'rgba(255,215,0,.85)', fontFamily: "'Montserrat',sans-serif" }}>Est. Kenya</span>
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 22, opacity: 0, animation: 'fadeIn 1s ease .2s forwards' }}>
          <div style={{ position: 'relative', width: 140, height: 140, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ position: 'absolute', inset: -10, borderRadius: '50%', background: 'radial-gradient(circle,rgba(255,215,0,.14) 0%,transparent 72%)', pointerEvents: 'none' }} />
            <div style={{ position: 'absolute', inset: 0, borderRadius: '50%', background: 'rgba(255,255,255,.09)', border: '1px solid rgba(255,255,255,.18)', backdropFilter: 'blur(6px)', boxShadow: '0 8px 36px rgba(255,215,0,.1)' }} />
            <img src={logoImg} alt="Joi" style={{ position: 'relative', zIndex: 1, height: 88, width: 'auto', objectFit: 'contain', filter: 'drop-shadow(0 5px 20px rgba(0,0,0,.4)) brightness(1.1)' }} />
          </div>
        </div>

        <div style={{ fontSize: 9, letterSpacing: '.5em', textTransform: 'uppercase', color: '#e8c870', marginBottom: 18, opacity: 0, animation: 'fadeIn 1s ease .42s forwards', fontFamily: "'Montserrat',sans-serif" }}>
          Premium Hair &amp; Beauty · Proudly Made in Kenya
        </div>

        <h1
          className="hero-title"
          style={{ fontSize: 'clamp(2.4rem,9vw,6.2rem)', fontWeight: 300, fontFamily: "'Cormorant Garamond',serif", lineHeight: 1.06, marginBottom: 18, opacity: 0, animation: 'fadeUp 1s ease .52s forwards' }}>
          <span style={{ display: 'block', color: '#fff' }}>Unlocking Beauty,</span>
          <span style={{ display: 'block', background: 'linear-gradient(135deg,#FFD700 0%,#FFEC99 50%,#FFD700 100%)', backgroundSize: '200% auto', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', animation: 'shimmer 4s linear infinite 1.5s' }}>
            Spreading the Joi
          </span>
        </h1>

        <p
          className="hero-sub"
          style={{ color: 'rgba(255,255,255,.72)', fontSize: 'clamp(.78rem,2vw,.94rem)', lineHeight: 1.95, maxWidth: 520, margin: '0 auto 2.4rem', fontWeight: 300, opacity: 0, animation: 'fadeUp 1s ease .68s forwards', fontFamily: "'Montserrat',sans-serif" }}>
          High-quality, affordable hair care products designed for African consumers — formulated with care, consistency, and joy at every step.
        </p>

        <div
          className="hero-btns"
          style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap', opacity: 0, animation: 'fadeUp 1s ease .86s forwards' }}>
          <a
            href="#collections"
            style={{ padding: '13px 32px', background: 'linear-gradient(135deg,#FFD700,#FFE34D)', color: '#1a1a1a', fontSize: 10, letterSpacing: '.22em', textTransform: 'uppercase', textDecoration: 'none', fontWeight: 700, display: 'inline-block', transition: 'transform .28s', fontFamily: "'Montserrat',sans-serif" }}
            onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
            onMouseLeave={e => e.currentTarget.style.transform = 'none'}>
            Explore Products
          </a>
          <a
            href="#story"
            style={{ padding: '13px 32px', background: 'transparent', border: '1px solid rgba(255,215,0,.55)', color: '#FFD700', fontSize: 10, letterSpacing: '.22em', textTransform: 'uppercase', textDecoration: 'none', transition: 'all .28s', fontFamily: "'Montserrat',sans-serif" }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,215,0,.1)'; e.currentTarget.style.borderColor = 'rgba(255,215,0,.9)' }}
            onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = 'rgba(255,215,0,.55)' }}>
            Our Story
          </a>
        </div>
      </div>

      <div style={{ position: 'absolute', bottom: 28, left: '50%', transform: 'translateX(-50%)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, opacity: 0, animation: 'fadeIn 1s ease 1.6s forwards' }}>
        <span style={{ fontSize: 8, letterSpacing: '.35em', color: 'rgba(255,215,0,.65)', textTransform: 'uppercase', fontFamily: "'Montserrat',sans-serif" }}>Scroll</span>
        <div style={{ width: 1, height: 34, background: 'linear-gradient(to bottom,rgba(255,215,0,.65),transparent)', animation: 'blink 2s ease-in-out infinite' }} />
      </div>
    </section>
  )
}

/* ─── Root ───────────────────────────────────────────────────── */
export default function Landing() {
  const [products, setProducts] = useState([])
  const [loading, setLoading]   = useState(true)
  const [zoomedProduct, setZoomed] = useState(null)

  useEffect(() => { injectStyles() }, [])

  useEffect(() => {
    let cancelled = false

    async function loadProducts() {
      // ── Step 1: serve from cache immediately if available ──────
      const cache = readCache()
      if (cache) {
        setProducts(cache.data)
        setLoading(false)
        // If cache is fresh, skip the network call entirely
        if (!cache.expired) return
      }

      // ── Step 2: fetch from network (fresh load or revalidation) ─
      try {
        const res  = await fetch(API_URL)
        if (!res.ok) throw new Error('Network response not ok')
        const json = await res.json()
        const list = (Array.isArray(json) ? json : (Array.isArray(json.data) ? json.data : []))
          .filter(p => p.active !== false)

        if (cancelled) return

        // Only update state + cache if data actually changed
        const cached = readCache()
        if (!cached || JSON.stringify(list) !== JSON.stringify(cached.data)) {
          setProducts(list)
          preloadImages(list, 4)   // preload first 4 images
          writeCache(list)
        }

        setLoading(false)
      } catch {
        // Network failed — if we already have cached data, keep showing it
        if (!cancelled) setLoading(false)
      }
    }

    loadProducts()
    return () => { cancelled = true }
  }, [])

  // Preload images when products first arrive from network
  useEffect(() => {
    if (products.length > 0) preloadImages(products, 4)
  }, [products])

  const openZoom  = useCallback(p => setZoomed(p), [])
  const closeZoom = useCallback(() => setZoomed(null), [])

  return (
    <div style={{ background: '#fff', fontFamily: "'Montserrat',sans-serif" }}>
      {zoomedProduct && (
        <Lightbox
          product={zoomedProduct}
          products={products}
          onClose={closeZoom}
        />
      )}

      {/* Hero renders immediately — no loading gate */}
      <Hero products={products} loading={loading} />

      {/* Gold marquee */}
      <div style={{ background: 'linear-gradient(90deg,#FFD700,#FFE34D,#FFEC99,#FFE34D,#FFD700)', padding: '11px 0', overflow: 'hidden' }}>
        <div style={{ display: 'flex', whiteSpace: 'nowrap', animation: 'marquee 30s linear infinite' }}>
          {Array(12).fill(0).map((_, i) => (
            <span key={i} style={{ fontSize: 9, letterSpacing: '.28em', textTransform: 'uppercase', color: '#1a1a1a', fontWeight: 700, paddingRight: 40, fontFamily: "'Montserrat',sans-serif" }}>
              Joi Hair Care &nbsp;·&nbsp; Quality in Every Batch &nbsp;·&nbsp; Made for African Hair &nbsp;·&nbsp; Unlocking Beauty, Spreading the Joi &nbsp;·&nbsp;
            </span>
          ))}
        </div>
      </div>

      <OurStory />
      <Features />

      {/* Product sections handle their own skeleton state */}
      <ProductSlider   products={products} loading={loading} onZoom={openZoom} />
      <ProductShowcase products={products} loading={loading} onZoom={openZoom} />

      <Testimonials />
      <CtaBanner />
    </div>
  )
}