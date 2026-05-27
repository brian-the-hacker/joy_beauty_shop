import { useState, useEffect, useRef } from 'react'
import { ArrowRight, Star, Sparkles, Shield, Leaf, ChevronLeft, ChevronRight, ShoppingBag, Search, X, Heart } from 'lucide-react'

/* ─── Data ─────────────────────────────────────────────────── */
const features = [
  { icon: Sparkles, title: 'Gold-Infused Formulas', desc: 'Enriched with precious metals and rare botanical extracts.' },
  { icon: Leaf, title: 'Clean & Cruelty-Free', desc: 'No parabens, no sulfates. Pure luxury with a clean conscience.' },
  { icon: Shield, title: 'Dermatologist Tested', desc: 'Clinically proven efficacy on all skin tones and types.' },
]

const reviews = [
  { name: 'Amara J.', role: 'Beauty Editor', text: '"Velvet Noir Serum changed my skin in 14 days. I get stopped on the street now."', stars: 5 },
  { name: 'Sofia R.', role: 'Model & Influencer', text: '"Charles Beauty Shop is the only brand I trust before a shoot. The Gold Radiance Cream is everything."', stars: 5 },
  { name: 'Kezia M.', role: 'Dermatologist', text: '"I recommend Charles Beauty Shop to my clients daily. Clinically clean, genuinely effective."', stars: 5 },
]

/* ─── Price formatting helper ─────────────────────────────────── */
function formatPrice(price) {
  if (typeof price === 'number') return `ksh ${price.toFixed(0)}`
  return String(price).startsWith('ksh') ? price : `ksh ${price}`
}

/* ─── Keyframes ─────────────────────────────────────────────── */
const STYLES = `
  @keyframes landingFloatA {
    0%,100% { transform: translateY(0px); }
    50%      { transform: translateY(-18px); }
  }
  @keyframes landingFloatC {
    0%,100% { transform: translateY(0px) scale(1); }
    50%      { transform: translateY(-6px) scale(1.005); }
  }
  @keyframes landingOrbFloat {
    0%,100% { transform: translate(0,0) scale(1); }
    33%      { transform: translate(12px,-18px) scale(1.06); }
    66%      { transform: translate(-8px,10px) scale(0.95); }
  }
  @keyframes landingFadeIn  { from { opacity:0 } to { opacity:1 } }
  @keyframes landingFadeUp  { from { opacity:0; transform:translateY(24px) } to { opacity:1; transform:translateY(0) } }
  @keyframes landingShimmer { to { background-position: 200% center } }
  @keyframes landingMarquee { from { transform:translateX(0) } to { transform:translateX(-50%) } }
  @keyframes landingBlink   { 0%,100%{opacity:.4} 50%{opacity:1} }
  @keyframes landingPulse   { 0%,100%{box-shadow:0 0 0 0 rgba(255,215,0,0)} 50%{box-shadow:0 0 20px 4px rgba(255,215,0,.15)} }
  @keyframes landingScaleIn { from{opacity:0;transform:scale(.9)} to{opacity:1;transform:scale(1)} }
  @keyframes spin { to { transform: rotate(360deg) } }
`

let stylesInjected = false
function injectStyles() {
  if (stylesInjected || typeof document === 'undefined') return
  const el = document.createElement('style')
  el.textContent = STYLES
  document.head.appendChild(el)
  stylesInjected = true
}

/* ─── Hooks ─────────────────────────────────────────────────── */
function useVisible(threshold = 0.1) {
  const ref = useRef(null)
  const [vis, setVis] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const o = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setVis(true); o.disconnect() }
    }, { threshold })
    o.observe(el)
    return () => o.disconnect()
  }, [threshold])
  return { ref, vis }
}

/* ─── FIX: initialise isMobile synchronously on first render ─── */
function useIsMobile() {
  const [mobile, setMobile] = useState(() =>
    typeof window !== 'undefined' ? window.innerWidth < 640 : false
  )
  useEffect(() => {
    const check = () => setMobile(window.innerWidth < 640)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])
  return mobile
}

/* ─── Floating product bubble ──────────────────────────────── */
function FloatingProduct({ img, size, top, left, right, bottom, delay, duration, rotate }) {
  if (!img) return null
  return (
    <div style={{
      position: 'absolute', width: size, height: size,
      top, left, right, bottom,
      borderRadius: '50%', overflow: 'hidden',
      opacity: 0.4, pointerEvents: 'none',
      animation: `landingFloatA ${duration}s ease-in-out ${delay}s infinite`,
      zIndex: 1,
      boxShadow: '0 20px 60px rgba(0,0,0,.5),inset 0 0 30px rgba(255,215,0,.15)',
      border: '2px solid rgba(255,215,0,.2)',
      transform: `rotate(${rotate ?? 0}deg)`,
    }}>
      <img src={img} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'brightness(.8) saturate(1.2)' }} />
    </div>
  )
}

/* ─── Floating orbs ─────────────────────────────────────────── */
function FloatingOrbs() {
  return (
    <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden' }}>
      {[
        { size: 320, top: '10%', left: '-8%', dur: 14 },
        { size: 200, top: '60%', right: '-5%', dur: 18 },
        { size: 140, top: '30%', right: '15%', dur: 11 },
      ].map((orb, i) => (
        <div key={i} style={{
          position: 'absolute', width: orb.size, height: orb.size, borderRadius: '50%',
          background: 'radial-gradient(circle,rgba(255,215,0,.09) 0%,transparent 70%)',
          top: orb.top, left: orb.left, right: orb.right,
          animation: `landingOrbFloat ${orb.dur}s ease-in-out infinite`,
          animationDelay: `${i * -3}s`,
        }} />
      ))}
    </div>
  )
}

/* ─── ProductCard ───────────────────────────────────────────── */
function ProductCard({ p, i, isActive, mobilePin }) {
  const [hover, setHover] = useState(false)
  const [liked, setLiked] = useState(false)
  const [added, setAdded] = useState(false)
  const active = hover || isActive

  const pinHeights = [170, 210, 185, 230, 155, 200, 220, 175, 195, 215]
  const imgH = mobilePin ? pinHeights[i % pinHeights.length] : 240

  const handleAdd = (e) => {
    e.stopPropagation()
    setAdded(true)
    setTimeout(() => setAdded(false), 1800)
  }

  const cardInner = (
    <div
      onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      onTouchStart={() => setHover(true)} onTouchEnd={() => setTimeout(() => setHover(false), 700)}
      style={{
        background: 'rgba(27,58,107,.7)',
        border: `1px solid ${active ? 'rgba(255,215,0,.6)' : 'rgba(255,215,0,.15)'}`,
        borderRadius: mobilePin ? 14 : 4,
        overflow: 'hidden', cursor: 'pointer',
        transition: 'all .45s cubic-bezier(.25,.46,.45,.94)',
        transform: mobilePin
          ? (active ? 'translateY(-4px)' : 'none')
          : (active ? 'translateY(-10px) scale(1.02)' : 'translateY(0) scale(1)'),
        boxShadow: active
          ? '0 32px 80px rgba(0,0,0,.6),0 0 50px rgba(255,215,0,.2)'
          : '0 8px 30px rgba(0,0,0,.35)',
        animation: mobilePin
          ? 'none'
          : `landingFloatC ${3.2 + (i % 3) * .6}s ease-in-out ${i * .15}s infinite`,
        position: 'relative', display: 'flex', flexDirection: 'column',
        /* FIX: ensure card is always visible */
        opacity: 1,
        width: '100%',
      }}>

      {/* Heart button */}
      <button
        onClick={(e) => { e.stopPropagation(); setLiked(!liked) }}
        style={{
          position: 'absolute', top: 8, right: 8,
          width: 32, height: 32, borderRadius: '50%',
          background: 'rgba(15,36,71,.85)', border: '1px solid rgba(255,255,255,.15)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer', zIndex: 10, transition: 'all .2s', padding: 0,
        }}
      >
        <Heart size={14} fill={liked ? '#ff5050' : 'none'} color={liked ? '#ff5050' : 'rgba(255,255,255,.85)'} />
      </button>

      {/* Image */}
      <div style={{ position: 'relative', height: imgH, overflow: 'hidden', flexShrink: 0 }}>
        <img
          src={p.img} alt={p.name}
          loading="lazy"
          style={{
            width: '100%', height: '100%', objectFit: 'cover',
            transition: 'transform .7s ease',
            transform: active ? 'scale(1.12)' : 'scale(1)',
            filter: 'brightness(.88) saturate(1.1)',
            display: 'block',
          }}
        />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top,rgba(27,58,107,.95) 0%,rgba(27,58,107,.3) 40%,transparent 60%)' }} />
        <div style={{
          position: 'absolute', top: 12, left: 12,
          padding: '5px 12px', background: 'rgba(27,58,107,.9)',
          border: '1px solid rgba(255,215,0,.5)',
          color: '#FFD700', fontSize: 8, letterSpacing: '.16em',
          textTransform: 'uppercase', backdropFilter: 'blur(6px)',
          borderRadius: mobilePin ? 16 : 0,
        }}>
          {p.tag}
        </div>
        {!mobilePin && (
          <div style={{ position: 'absolute', bottom: 12, left: 12, color: 'rgba(255,215,0,.6)', fontSize: 9, letterSpacing: '.26em', textTransform: 'uppercase' }}>
            {p.cat}
          </div>
        )}
        {!mobilePin && (
          <div style={{
            position: 'absolute', inset: 0,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            opacity: active ? 1 : 0, transition: 'opacity .3s',
            background: 'rgba(27,58,107,.4)',
          }}>
            <div style={{
              width: 52, height: 52, borderRadius: '50%',
              background: 'rgba(255,215,0,.2)', border: '1px solid rgba(255,215,0,.6)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              backdropFilter: 'blur(8px)',
            }}>
              <ShoppingBag size={20} color="#FFD700" />
            </div>
          </div>
        )}
      </div>

      {/* Info */}
      <div style={{ padding: mobilePin ? '10px 10px 12px' : '1.2rem 1.3rem 1.4rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
        {mobilePin && (
          <div style={{ fontSize: 7, letterSpacing: '.14em', textTransform: 'uppercase', color: 'rgba(255,215,0,.55)', marginBottom: 3 }}>
            {p.cat}
          </div>
        )}
        <h3 style={{
          fontSize: mobilePin ? '0.85rem' : '1.1rem',
          fontWeight: 400, fontFamily: "'Cormorant Garamond',serif",
          color: '#fff', marginBottom: mobilePin ? 4 : 7,
          lineHeight: 1.3,
        }}>
          {p.name}
        </h3>
        {!mobilePin && (
          <p style={{ color: 'rgba(255,255,255,.48)', fontSize: 11.5, lineHeight: 1.75, marginBottom: 16, flex: 1 }}>
            {p.desc}
          </p>
        )}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 6, marginTop: mobilePin ? 'auto' : 0 }}>
          <span style={{
            fontSize: mobilePin ? '0.95rem' : '1.3rem',
            fontWeight: 300, fontFamily: "'Cormorant Garamond',serif",
            background: 'linear-gradient(135deg,#FFD700,#FFEC99)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          }}>
            {formatPrice(p.price)}
          </span>
          <button
            onClick={handleAdd}
            style={{
              padding: mobilePin ? '6px 10px' : '8px 14px',
              background: active ? 'rgba(255,215,0,.2)' : 'transparent',
              border: '1px solid rgba(255,215,0,.45)',
              color: '#FFD700', fontSize: mobilePin ? 8 : 9,
              letterSpacing: '.15em', textTransform: 'uppercase',
              cursor: 'pointer', display: 'flex', alignItems: 'center',
              gap: 5, transition: 'all .3s',
              fontFamily: "'Montserrat',sans-serif",
              whiteSpace: 'nowrap',
              borderRadius: mobilePin ? 6 : 0,
            }}
          >
            {added ? '✓' : <ShoppingBag size={mobilePin ? 8 : 10} />}
            {!mobilePin && (added ? 'Added' : 'Add')}
          </button>
        </div>
      </div>
    </div>
  )

  /* ─── FIX: use inline styles instead of CSS classes for mobile masonry ─── */
  if (mobilePin) {
    return (
      <div style={{
        breakInside: 'avoid',
        pageBreakInside: 'avoid',
        display: 'inline-block',
        width: '100%',
        marginBottom: 12,
        verticalAlign: 'top',
      }}>
        {cardInner}
      </div>
    )
  }
  return cardInner
}

/* ─── Search & Filter ───────────────────────────────────────── */
function SearchFilterBar({ query, setQuery, activeFilter, setActiveFilter, allCats }) {
  const [focused, setFocused] = useState(false)
  return (
    <div style={{ maxWidth: 860, margin: '0 auto 44px', padding: '0 1rem' }}>
      <div style={{
        position: 'relative', marginBottom: 18,
        border: `1px solid ${focused ? 'rgba(255,215,0,.6)' : 'rgba(255,215,0,.2)'}`,
        background: 'rgba(27,58,107,.6)', backdropFilter: 'blur(8px)',
        transition: 'border .3s', display: 'flex', alignItems: 'center',
      }}>
        <Search size={15} color="rgba(255,215,0,.6)" style={{ marginLeft: 16, flexShrink: 0 }} />
        <input
          type="text" value={query}
          onChange={e => setQuery(e.target.value)}
          onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
          placeholder="Search products…"
          style={{ flex: 1, padding: '13px 14px', background: 'transparent', border: 'none', outline: 'none', color: '#fff', fontSize: 12, letterSpacing: '.04em', fontFamily: "'Montserrat',sans-serif" }}
        />
        {query && (
          <button onClick={() => setQuery('')} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '0 14px', color: 'rgba(255,215,0,.6)', display: 'flex', alignItems: 'center' }}>
            <X size={14} />
          </button>
        )}
      </div>
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', justifyContent: 'center' }}>
        {allCats.map(cat => (
          <button key={cat} onClick={() => setActiveFilter(cat)} style={{
            padding: '7px 16px',
            background: activeFilter === cat ? 'rgba(255,215,0,.15)' : 'transparent',
            border: `1px solid ${activeFilter === cat ? 'rgba(255,215,0,.6)' : 'rgba(255,215,0,.2)'}`,
            color: activeFilter === cat ? '#FFD700' : 'rgba(255,255,255,.45)',
            fontSize: 9, letterSpacing: '.18em', textTransform: 'uppercase',
            cursor: 'pointer', transition: 'all .25s',
            fontFamily: "'Montserrat',sans-serif", whiteSpace: 'nowrap',
          }}>{cat}</button>
        ))}
      </div>
    </div>
  )
}

/* ─── ProductSlider ─────────────────────────────────────────── */
function ProductSlider({ products }) {
  const [idx, setIdx] = useState(0)
  const trackRef = useRef(null)
  const { ref, vis } = useVisible(0.05)
  const CARD_W = 280, GAP = 16

  const prev = () => setIdx(i => Math.max(0, i - 1))
  const next = () => setIdx(i => Math.min(products.length - 1, i + 1))

  useEffect(() => {
    if (!trackRef.current) return
    trackRef.current.scrollTo({ left: idx * (CARD_W + GAP), behavior: 'smooth' })
  }, [idx])

  if (!products.length) return null

  return (
    <section ref={ref} style={{ padding: '4rem 0 6rem', position: 'relative' }}>
      <FloatingProduct img={products[0]?.img} size={90} top="-30px" right="5%" delay={0} duration={5} rotate={8} />
      <FloatingProduct img={products[Math.min(3, products.length - 1)]?.img} size={70} bottom="40px" left="2%" delay={1.5} duration={6} rotate={-5} />
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 1rem', position: 'relative', zIndex: 2 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 36, flexWrap: 'wrap', gap: 14, opacity: vis ? 1 : 0, transform: vis ? 'none' : 'translateY(20px)', transition: 'all .7s ease' }}>
          <div>
            <div style={{ fontSize: 9, letterSpacing: '.45em', textTransform: 'uppercase', color: '#FFD700', marginBottom: 10 }}>Curated Essentials</div>
            <h2 style={{ fontSize: 'clamp(1.8rem,5vw,3.2rem)', fontWeight: 300, fontFamily: "'Cormorant Garamond',serif", color: '#fff', lineHeight: 1.1 }}>The Collection</h2>
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            {[{ fn: prev, dis: idx === 0, Icon: ChevronLeft }, { fn: next, dis: idx >= products.length - 1, Icon: ChevronRight }].map(({ fn, dis, Icon }, ki) => (
              <button key={ki} onClick={fn} disabled={dis} style={{ width: 44, height: 44, border: `1px solid ${dis ? 'rgba(255,215,0,.2)' : 'rgba(255,215,0,.5)'}`, background: 'transparent', cursor: dis ? 'default' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: dis ? 'rgba(255,215,0,.25)' : '#FFD700', transition: 'all .3s' }}>
                <Icon size={18} />
              </button>
            ))}
          </div>
        </div>

        <div ref={trackRef} style={{ display: 'flex', gap: GAP, overflowX: 'auto', scrollSnapType: 'x mandatory', WebkitOverflowScrolling: 'touch', paddingBottom: 16, scrollbarWidth: 'none' }}>
          {products.map((p, i) => (
            <div key={p.id} style={{ scrollSnapAlign: 'start', width: CARD_W, minWidth: CARD_W }}>
              <ProductCard p={p} i={i} isActive={i === idx} mobilePin={false} />
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginTop: 24 }}>
          {products.map((_, i) => (
            <button key={i} onClick={() => setIdx(i)} style={{ width: i === idx ? 28 : 8, height: 8, borderRadius: 4, background: i === idx ? '#FFD700' : 'rgba(255,215,0,.25)', border: 'none', cursor: 'pointer', transition: 'all .35s cubic-bezier(.25,.46,.45,.94)' }} />
          ))}
        </div>

        <div style={{ textAlign: 'center', marginTop: 36 }}>
          <a href="#collections" style={{ padding: '13px 36px', border: '1px solid rgba(255,215,0,.4)', color: '#FFD700', fontSize: 10, letterSpacing: '.22em', textTransform: 'uppercase', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 10, transition: 'all .3s', fontFamily: "'Montserrat',sans-serif" }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,215,0,.08)'; e.currentTarget.style.borderColor = 'rgba(255,215,0,.7)' }}
            onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = 'rgba(255,215,0,.4)' }}
          >View All Products <ArrowRight size={13} /></a>
        </div>
      </div>
    </section>
  )
}

/* ─── ProductShowcase Grid + Pinterest Mobile ──────────────────── */
function ProductShowcase({ products }) {
  const { ref, vis } = useVisible(0.05)
  const [query, setQuery] = useState('')
  const [activeFilter, setActiveFilter] = useState('All')
  const [visibleCount, setVisibleCount] = useState(12)
  const isMobile = useIsMobile()

  const ALL_CATS = ['All', ...Array.from(new Set(products.map(p => p.cat)))]

  const filtered = products.filter(p => {
    const matchesCat = activeFilter === 'All' || p.cat === activeFilter
    const q = query.toLowerCase()
    const matchesQ = !q || [p.name, p.cat, p.desc, p.tag].some(s => s && s.toLowerCase().includes(q))
    return matchesCat && matchesQ
  })

  useEffect(() => { setVisibleCount(12) }, [activeFilter, query])

  const visible = filtered.slice(0, visibleCount)
  const hasMore = visibleCount < filtered.length

  if (!products.length) return null

  /* ─── FIX: inline styles replace CSS classes entirely ─── */
  const mobileGridStyle = {
    columnCount: 2,
    columnGap: '12px',
    padding: '0 8px',
  }
  const desktopGridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 270px), 1fr))',
    gap: '20px',
  }

  return (
    <section id="collections" ref={ref} style={{ padding: '5rem 1rem', position: 'relative', overflow: 'hidden' }}>
      <FloatingProduct img={products[2]?.img} size={130} top="8%" right="-25px" delay={0} duration={7} />
      <FloatingProduct img={products[Math.min(4, products.length - 1)]?.img} size={90} bottom="4%" left="-15px" delay={2} duration={8} />
      <div style={{ maxWidth: 1280, margin: '0 auto', position: 'relative', zIndex: 2 }}>
        <div style={{ textAlign: 'center', marginBottom: 44, opacity: vis ? 1 : 0, transform: vis ? 'none' : 'translateY(24px)', transition: 'all .8s' }}>
          <div style={{ fontSize: 9, letterSpacing: '.45em', textTransform: 'uppercase', color: '#FFD700', marginBottom: 12 }}>Shop By Category</div>
          <h2 style={{ fontSize: 'clamp(1.8rem,5vw,3.2rem)', fontWeight: 300, fontFamily: "'Cormorant Garamond',serif", color: '#fff', marginBottom: 8 }}>Our Products</h2>
          <p style={{ color: 'rgba(255,255,255,.3)', fontSize: 11, letterSpacing: '.1em' }}>Search or filter to find your perfect match</p>
        </div>

        <SearchFilterBar query={query} setQuery={setQuery} activeFilter={activeFilter} setActiveFilter={setActiveFilter} allCats={ALL_CATS} />

        {filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '4rem 1rem', color: 'rgba(255,255,255,.35)', fontFamily: "'Cormorant Garamond',serif", fontSize: '1.5rem' }}>
            No products match <span style={{ color: '#FFD700' }}>"{query}"</span>
          </div>
        ) : (
          <>
            {/* ─── FIX: grid container uses inline styles, no className ─── */}
            <div style={isMobile ? mobileGridStyle : desktopGridStyle}>
              {visible.map((p, i) => (
                <ProductCard key={p.id} p={p} i={i} mobilePin={isMobile} />
              ))}
            </div>

            {hasMore && (
              <div style={{ textAlign: 'center', marginTop: 28 }}>
                <button
                  onClick={() => setVisibleCount(c => c + 12)}
                  style={{
                    padding: '13px 36px', border: '1px solid rgba(255,215,0,.4)',
                    color: '#FFD700', background: 'transparent', fontSize: 10,
                    letterSpacing: '.22em', textTransform: 'uppercase',
                    cursor: 'pointer', transition: 'all .3s',
                    fontFamily: "'Montserrat',sans-serif",
                    borderRadius: isMobile ? 8 : 0,
                  }}
                  onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,215,0,.08)'; e.currentTarget.style.borderColor = 'rgba(255,215,0,.7)' }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = 'rgba(255,215,0,.4)' }}
                >
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

/* ─── Features ──────────────────────────────────────────────── */
function Features() {
  const { ref, vis } = useVisible()
  return (
    <section ref={ref} style={{ padding: '4.5rem 1rem', maxWidth: 1280, margin: '0 auto', position: 'relative', overflow: 'hidden' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(min(100%,220px),1fr))', gap: 20, position: 'relative', zIndex: 2 }}>
        {features.map(({ icon: Icon, title, desc }, i) => (
          <div key={title} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', padding: '2.2rem 1.5rem', border: '1px solid rgba(255,215,0,.1)', background: 'rgba(27,58,107,.45)', opacity: vis ? 1 : 0, transform: vis ? 'translateY(0)' : 'translateY(32px)', transition: `all .75s ease ${i * .18}s` }}>
            <div style={{ width: 50, height: 50, border: '1px solid rgba(255,215,0,.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 18, background: 'rgba(255,215,0,.06)', animation: `landingPulse 3.5s ease-in-out ${i * .8}s infinite` }}>
              <Icon size={19} color="#FFD700" />
            </div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 400, fontFamily: "'Cormorant Garamond',serif", color: '#fff', marginBottom: 10 }}>{title}</h3>
            <p style={{ color: 'rgba(255,255,255,.44)', fontSize: 11.5, lineHeight: 1.85 }}>{desc}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

/* ─── Testimonials ──────────────────────────────────────────── */
function Testimonials() {
  const { ref, vis } = useVisible()
  const [active, setActive] = useState(0)
  useEffect(() => {
    const t = setInterval(() => setActive(a => (a + 1) % reviews.length), 4500)
    return () => clearInterval(t)
  }, [])

  return (
    <section ref={ref} style={{ padding: '5rem 1rem', background: 'rgba(15,36,71,.85)', borderTop: '1px solid rgba(255,215,0,.08)', borderBottom: '1px solid rgba(255,215,0,.08)', overflow: 'hidden', position: 'relative' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', position: 'relative', zIndex: 2 }}>
        <div style={{ textAlign: 'center', marginBottom: 44, opacity: vis ? 1 : 0, transform: vis ? 'none' : 'translateY(20px)', transition: 'all .7s' }}>
          <div style={{ fontSize: 9, letterSpacing: '.45em', textTransform: 'uppercase', color: '#FFD700', marginBottom: 12 }}>What They Say</div>
          <h2 style={{ fontSize: 'clamp(1.8rem,4vw,3rem)', fontWeight: 300, fontFamily: "'Cormorant Garamond',serif", color: '#fff' }}>Words of Radiance</h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(min(100%,260px),1fr))', gap: 18 }}>
          {reviews.map((r, i) => (
            <div key={r.name} style={{ padding: '2.2rem', border: `1px solid ${i === active ? 'rgba(255,215,0,.35)' : 'rgba(255,215,0,.12)'}`, background: i === active ? 'rgba(27,58,107,.75)' : 'rgba(27,58,107,.5)', opacity: vis ? 1 : 0, transform: vis ? 'translateY(0)' : 'translateY(30px)', transition: `all .7s ease ${i * .15}s,border .4s,background .4s`, boxShadow: i === active ? '0 0 40px rgba(255,215,0,.1)' : 'none', cursor: 'pointer' }} onClick={() => setActive(i)}>
              <div style={{ display: 'flex', gap: 3, marginBottom: 14 }}>
                {Array(r.stars).fill(0).map((_, si) => <Star key={si} size={12} fill="#FFD700" color="#FFD700" />)}
              </div>
              <p style={{ fontSize: '1rem', fontStyle: 'italic', fontFamily: "'Cormorant Garamond',serif", color: 'rgba(255,255,255,.85)', lineHeight: 1.85, marginBottom: 18 }}>{r.text}</p>
              <div style={{ color: '#fff', fontSize: 12, fontWeight: 500 }}>{r.name}</div>
              <div style={{ color: 'rgba(255,215,0,.6)', fontSize: 10.5, marginTop: 3 }}>{r.role}</div>
            </div>
          ))}
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginTop: 24 }}>
          {reviews.map((_, i) => (
            <button key={i} onClick={() => setActive(i)} style={{ width: i === active ? 24 : 8, height: 8, borderRadius: 4, background: i === active ? '#FFD700' : 'rgba(255,215,0,.25)', border: 'none', cursor: 'pointer', transition: 'all .3s' }} />
          ))}
        </div>
      </div>
    </section>
  )
}

/* ─── CTA Banner ────────────────────────────────────────────── */
function CtaBanner() {
  const { ref, vis } = useVisible()
  const [email, setEmail] = useState('')
  const [joined, setJoined] = useState(false)

  return (
    <section ref={ref} style={{ padding: '6rem 1rem', position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', inset: 0, backgroundImage: 'url(https://images.pexels.com/photos/4041392/pexels-photo-4041392.jpeg?auto=compress&cs=tinysrgb&w=1600)', backgroundSize: 'cover', backgroundPosition: 'center', filter: 'brightness(.18)' }} />
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg,rgba(27,58,107,.92),rgba(255,215,0,.07))' }} />
      <div style={{ position: 'relative', textAlign: 'center', maxWidth: 580, margin: '0 auto', zIndex: 2, opacity: vis ? 1 : 0, transform: vis ? 'translateY(0)' : 'translateY(30px)', transition: 'all .85s ease' }}>
        <div style={{ fontSize: 9, letterSpacing: '.45em', textTransform: 'uppercase', color: '#FFD700', marginBottom: 18 }}>Exclusive Offer</div>
        <h2 style={{ fontSize: 'clamp(1.8rem,5vw,3.4rem)', fontWeight: 300, fontFamily: "'Cormorant Garamond',serif", color: '#fff', lineHeight: 1.2, marginBottom: 18 }}>
          Discover Your Glow.{' '}
          <span style={{ background: 'linear-gradient(135deg,#FFD700,#FFEC99)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>15% Off Your First Order.</span>
        </h2>
        <p style={{ color: 'rgba(255,255,255,.5)', fontSize: 13, lineHeight: 1.9, marginBottom: 32 }}>Join the Charles Beauty inner circle. Early access to new collections, exclusive drops, and curated beauty secrets.</p>
        {joined ? (
          <div style={{ padding: '18px 28px', border: '1px solid rgba(255,215,0,.45)', color: '#FFD700', fontSize: 12, letterSpacing: '.1em', animation: 'landingScaleIn .4s ease' }}>
            Welcome to Charles Beauty — your code is on its way.
          </div>
        ) : (
          <div style={{ display: 'flex', maxWidth: 420, margin: '0 auto', flexWrap: 'wrap' }}>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} onKeyDown={e => e.key === 'Enter' && email.includes('@') && setJoined(true)} placeholder="Your email address" style={{ flex: '1 1 180px', padding: '13px 16px', background: 'rgba(255,255,255,.06)', border: '1px solid rgba(255,215,0,.3)', borderRight: 'none', color: '#fff', fontSize: 12, outline: 'none', fontFamily: "'Montserrat',sans-serif", minWidth: 0 }} />
            <button onClick={() => email.includes('@') && setJoined(true)} style={{ padding: '13px 22px', background: 'linear-gradient(135deg,#FFD700,#FFE34D)', border: 'none', color: '#1B3A6B', fontSize: 10, letterSpacing: '.15em', textTransform: 'uppercase', fontWeight: 600, cursor: 'pointer', whiteSpace: 'nowrap', fontFamily: "'Montserrat',sans-serif", flexShrink: 0 }}>Join Now</button>
          </div>
        )}
      </div>
    </section>
  )
}

/* ─── Main Component ────────────────────────────────────────── */
export default function Landing() {
  const [mouse, setMouse] = useState({ x: .5, y: .5 })
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const { ref: featRef, vis: featVis } = useVisible()

  useEffect(() => { injectStyles() }, [])

  useEffect(() => {
    const apiUrl = 'https://joy-beauty-shop-dashboard.onrender.com/api/products'
    fetch(apiUrl)
      .then((res) => {
        if (!res.ok) throw new Error(`API error: ${res.status}`)
        return res.json()
      })
      .then((json) => {
        // New API wraps in { success, data: [...], meta }; old API returned a plain array
        const list = Array.isArray(json) ? json : (Array.isArray(json.data) ? json.data : [])
        // Only show active products on the storefront
        setProducts(list.filter(p => p.active !== false))
        setLoading(false)
      })
      .catch((err) => {
        console.error('❌ API error:', err)
        setLoading(false)
      })
  }, [])

  useEffect(() => {
    const onMove = e => setMouse({ x: e.clientX / window.innerWidth, y: e.clientY / window.innerHeight })
    window.addEventListener('mousemove', onMove)
    return () => window.removeEventListener('mousemove', onMove)
  }, [])

  const px = (mouse.x - .5) * 18
  const py = (mouse.y - .5) * 18

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', background: '#1B3A6B', gap: 16 }}>
        <div style={{ width: 48, height: 48, border: '2px solid rgba(255,215,0,.2)', borderTop: '2px solid #FFD700', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
        <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
        <span style={{ color: 'rgba(255,215,0,.7)', fontFamily: "'Cormorant Garamond',serif", fontSize: '1.3rem', letterSpacing: '.12em' }}>Loading...</span>
      </div>
    )
  }

  return (
    <div style={{ background: '#1B3A6B', fontFamily: "'Montserrat',sans-serif" }}>

      {/* ── Hero ── */}
      <section style={{ position: 'relative', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: '-12%', backgroundImage: 'url(https://images.pexels.com/photos/3373739/pexels-photo-3373739.jpeg?auto=compress&cs=tinysrgb&w=1600)', backgroundSize: 'cover', backgroundPosition: 'center', transform: `translate(${px * .35}px,${py * .35}px)`, transition: 'transform .08s linear', filter: 'brightness(.22)' }} />
        <div style={{ position: 'absolute', inset: 0, background: `radial-gradient(ellipse at ${50 + px * .4}% ${50 + py * .4}%,rgba(255,215,0,.13) 0%,transparent 62%)`, transition: 'background .08s linear' }} />
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(255,215,0,.025) 1px,transparent 1px),linear-gradient(90deg,rgba(255,215,0,.025) 1px,transparent 1px)', backgroundSize: '64px 64px' }} />
        <FloatingOrbs />
        <FloatingProduct img={products[0]?.img} size={160} top="8%" right="5%" delay={0} duration={6} rotate={5} />
        <FloatingProduct img={products[1]?.img} size={120} bottom="15%" right="7%" delay={1.5} duration={7} rotate={-8} />
        <FloatingProduct img={products[2]?.img} size={100} top="20%" left="3%" delay={.8} duration={5.5} rotate={12} />
        <FloatingProduct img={products[3]?.img} size={80} bottom="25%" left="4%" delay={2.5} duration={6.5} rotate={-6} />

        <div style={{ position: 'relative', zIndex: 2, textAlign: 'center', padding: '9rem 1.2rem 3rem', maxWidth: 820 }}>
          <div style={{ fontSize: 9, letterSpacing: '.5em', textTransform: 'uppercase', color: '#FFD700', marginBottom: 20, opacity: 0, animation: 'landingFadeIn 1s ease .3s forwards' }}>Luxury Beauty Collection 2026</div>
          <h1 style={{ fontSize: 'clamp(2.4rem,10vw,6.5rem)', fontWeight: 300, fontFamily: "'Cormorant Garamond',serif", lineHeight: 1.05, marginBottom: 20, opacity: 0, animation: 'landingFadeUp 1s ease .5s forwards' }}>
            <span style={{ display: 'block', color: '#fff' }}>Charles</span>
            <span style={{ display: 'block', background: 'linear-gradient(135deg,#FFD700 0%,#FFEC99 50%,#FFD700 100%)', backgroundSize: '200% auto', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', animation: 'landingShimmer 4s linear infinite 1.5s' }}>Beauty Shop</span>
          </h1>
          <p style={{ color: 'rgba(255,255,255,.58)', fontSize: 'clamp(.8rem,2vw,.95rem)', lineHeight: 1.95, maxWidth: 500, margin: '0 auto 2.4rem', fontWeight: 300, opacity: 0, animation: 'landingFadeUp 1s ease .7s forwards' }}>
            Rare botanicals meet cutting-edge science. Discover the most luminous version of you.
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap', opacity: 0, animation: 'landingFadeUp 1s ease .9s forwards' }}>
            <a href="#collections" style={{ padding: '13px 32px', background: 'linear-gradient(135deg,#FFD700,#FFE34D)', color: '#1B3A6B', fontSize: 10, letterSpacing: '.22em', textTransform: 'uppercase', textDecoration: 'none', fontWeight: 600, display: 'inline-block', transition: 'transform .3s' }}
              onMouseEnter={e => (e.currentTarget.style.transform = 'translateY(-2px)')}
              onMouseLeave={e => (e.currentTarget.style.transform = 'none')}>Shop Now</a>
            <a href="#story" style={{ padding: '13px 32px', background: 'transparent', border: '1px solid rgba(255,215,0,.5)', color: '#FFD700', fontSize: 10, letterSpacing: '.22em', textTransform: 'uppercase', textDecoration: 'none', transition: 'all .3s' }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,215,0,.08)'; e.currentTarget.style.borderColor = 'rgba(255,215,0,.8)' }}
              onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = 'rgba(255,215,0,.5)' }}>Our Story</a>
          </div>
        </div>

        <div style={{ position: 'absolute', bottom: 32, left: '50%', transform: 'translateX(-50%)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 7, opacity: 0, animation: 'landingFadeIn 1s ease 1.6s forwards' }}>
          <span style={{ fontSize: 8.5, letterSpacing: '.35em', color: 'rgba(255,215,0,.55)', textTransform: 'uppercase' }}>Scroll</span>
          <div style={{ width: 1, height: 36, background: 'linear-gradient(to bottom,rgba(255,215,0,.6),transparent)', animation: 'landingBlink 2s ease-in-out infinite' }} />
        </div>
      </section>

      {/* ── Marquee ── */}
      <div style={{ background: 'linear-gradient(90deg,#FFD700,#FFE34D,#FFEC99,#FFE34D,#FFD700)', padding: '12px 0', overflow: 'hidden' }}>
        <div style={{ display: 'flex', whiteSpace: 'nowrap', animation: 'landingMarquee 28s linear infinite' }}>
          {Array(10).fill(0).map((_, i) => (
            <span key={i} style={{ fontSize: 9, letterSpacing: '.28em', textTransform: 'uppercase', color: '#1B3A6B', fontWeight: 600, paddingRight: 40 }}>
              Charles Beauty Shop &nbsp;&middot;&nbsp; Free Shipping Over $150 &nbsp;&middot;&nbsp; Cruelty-Free &nbsp;&middot;&nbsp; Clean Beauty &nbsp;&middot;&nbsp;
            </span>
          ))}
        </div>
      </div>

      {/* ── Features ── */}
      <section ref={featRef} style={{ padding: '4.5rem 1rem', maxWidth: 1280, margin: '0 auto', position: 'relative', overflow: 'hidden' }}>
        <Features />
      </section>

      {/* ── Slider ── */}
      <ProductSlider products={products} />

      {/* ── Products Grid/Pinterest ── */}
      <ProductShowcase products={products} />

      {/* ── Testimonials ── */}
      <Testimonials />

      {/* ── CTA ── */}
      <CtaBanner />
    </div>
  )
}