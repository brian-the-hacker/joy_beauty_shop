import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Star, Sparkles, Shield, Leaf, ChevronLeft, ChevronRight, Phone, Mail, Search, X } from 'lucide-react'
import logoImg from '../assets/logo.png'

/* ─── Data ─────────────────────────────────────────────────── */
const features = [
  { icon: Sparkles, title: 'Crafted for African Hair',  desc: 'Our formulations are developed specifically for the needs, textures, and styles of African hair — effective by design, not by chance.' },
  { icon: Leaf,     title: 'Quality in Every Batch',    desc: 'Consistent formulation standards and controlled production ensure every product performs exactly as expected.' },
  { icon: Shield,   title: 'Reliable Manufacturing',    desc: 'From careful raw material selection through to finished product, quality is built into every step of what we do.' },
]

const reviews = [
  { name: 'Mercy W.',  role: 'Salon Owner, Nairobi',  text: '"The Joi Moulding Gel Wax gives my clients the cleanest, longest-lasting styles. It has become a staple product in our salon."', stars: 5 },
  { name: 'Fatuma A.', role: 'Loyal Customer',          text: '"The Leave-In Treatment has completely transformed my hair routine. Lightweight, actually effective, and smells amazing."', stars: 5 },
  { name: 'Brian O.',  role: 'Distributor, Mombasa',   text: '"Consistent quality and great packaging every time. Joi products practically sell themselves once customers try them."', stars: 5 },
]

/* ─── Keyframes ─────────────────────────────────────────────── */
const STYLES = `
  @keyframes landingFloatA  { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-18px)} }
  @keyframes landingFloatC  { 0%,100%{transform:translateY(0) scale(1)} 50%{transform:translateY(-6px) scale(1.005)} }
  @keyframes landingOrbFloat{ 0%,100%{transform:translate(0,0) scale(1)} 33%{transform:translate(12px,-18px) scale(1.06)} 66%{transform:translate(-8px,10px) scale(0.95)} }
  @keyframes landingFadeIn  { from{opacity:0} to{opacity:1} }
  @keyframes landingFadeUp  { from{opacity:0;transform:translateY(24px)} to{opacity:1;transform:translateY(0)} }
  @keyframes landingShimmer { to{background-position:200% center} }
  @keyframes landingMarquee { from{transform:translateX(0)} to{transform:translateX(-50%)} }
  @keyframes landingBlink   { 0%,100%{opacity:.4} 50%{opacity:1} }
  @keyframes landingPulse   { 0%,100%{box-shadow:0 0 0 0 rgba(160,104,0,0)} 50%{box-shadow:0 0 20px 4px rgba(160,104,0,.1)} }
  @keyframes spin           { to{transform:rotate(360deg)} }
  @keyframes lineGrow       { from{width:0} to{width:40px} }
`
let stylesInjected = false
function injectStyles() {
  if (stylesInjected || typeof document === 'undefined') return
  const el = document.createElement('style'); el.textContent = STYLES
  document.head.appendChild(el); stylesInjected = true
}

/* ─── Hooks ─────────────────────────────────────────────────── Logo*/
function useVisible(threshold = 0.1) {
  const ref = useRef(null); const [vis, setVis] = useState(false)
  useEffect(() => {
    const el = ref.current; if (!el) return
    const o = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVis(true); o.disconnect() } }, { threshold })
    o.observe(el); return () => o.disconnect()
  }, [threshold])
  return { ref, vis }
}
function useIsMobile() {
  const [mobile, setMobile] = useState(() => typeof window !== 'undefined' ? window.innerWidth < 640 : false)
  useEffect(() => { const c = () => setMobile(window.innerWidth < 640); c(); window.addEventListener('resize', c); return () => window.removeEventListener('resize', c) }, [])
  return mobile
}

/* ─── Floating product bubble ──────────────────────────────── */
function FloatingProduct({ img, size, top, left, right, bottom, delay, duration, rotate }) {
  if (!img) return null
  return (
    <div style={{ position:'absolute', width:size, height:size, top, left, right, bottom, borderRadius:'50%', overflow:'hidden', opacity:0.18, pointerEvents:'none', animation:`landingFloatA ${duration}s ease-in-out ${delay}s infinite`, zIndex:1, boxShadow:'0 20px 60px rgba(0,0,0,.12),inset 0 0 20px rgba(160,104,0,.08)', border:'2px solid rgba(140,90,0,.2)', transform:`rotate(${rotate??0}deg)` }}>
      <img src={img} alt="" style={{ width:'100%', height:'100%', objectFit:'cover', filter:'brightness(.95) saturate(1.1)' }} />
    </div>
  )
}

function FloatingOrbs() {
  return (
    <div style={{ position:'absolute', inset:0, pointerEvents:'none', overflow:'hidden' }}>
      {[{ size:320, top:'10%', left:'-8%', dur:14 }, { size:200, top:'60%', right:'-5%', dur:18 }, { size:140, top:'30%', right:'15%', dur:11 }].map((o,i) => (
        <div key={i} style={{ position:'absolute', width:o.size, height:o.size, borderRadius:'50%', background:'radial-gradient(circle,rgba(160,104,0,.05) 0%,transparent 70%)', top:o.top, left:o.left, right:o.right, animation:`landingOrbFloat ${o.dur}s ease-in-out infinite`, animationDelay:`${i*-3}s` }} />
      ))}
    </div>
  )
}

/* ─── ProductCard — catalogue only, no shop ────────────────── */
function ProductCard({ p, i, isActive, mobilePin }) {
  const [hover, setHover] = useState(false)
  const active = hover || isActive
  const pinHeights = [170, 210, 185, 230, 155, 200, 220, 175, 195, 215]
  const imgH = mobilePin ? pinHeights[i % pinHeights.length] : 240

  const cardInner = (
    <div
      onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      onTouchStart={() => setHover(true)} onTouchEnd={() => setTimeout(() => setHover(false), 700)}
      style={{ background:'#ffffff', border:`1px solid ${active ? 'rgba(140,90,0,.4)' : '#e0dbd0'}`, borderRadius:mobilePin ? 14 : 4, overflow:'hidden', cursor:'default', transition:'all .45s cubic-bezier(.25,.46,.45,.94)', transform:mobilePin ? (active ? 'translateY(-4px)' : 'none') : (active ? 'translateY(-8px) scale(1.015)' : 'translateY(0) scale(1)'), boxShadow:active ? '0 20px 50px rgba(0,0,0,.1)' : '0 4px 20px rgba(0,0,0,.07)', animation:mobilePin ? 'none' : `landingFloatC ${3.2+(i%3)*.6}s ease-in-out ${i*.15}s infinite`, position:'relative', display:'flex', flexDirection:'column', opacity:1, width:'100%' }}>

      {/* Image */}
      <div style={{ position:'relative', height:imgH, overflow:'hidden', flexShrink:0 }}>
        <img src={p.img} alt={p.name} loading="lazy" style={{ width:'100%', height:'100%', objectFit:'cover', transition:'transform .7s ease', transform:active ? 'scale(1.1)' : 'scale(1)', filter:'brightness(.96) saturate(1.05)', display:'block' }} />
        <div style={{ position:'absolute', inset:0, background:'linear-gradient(to top,rgba(0,0,0,.3) 0%,transparent 55%)' }} />
        <div style={{ position:'absolute', top:12, left:12, padding:'5px 12px', background:'rgba(255,255,255,.92)', border:'1px solid rgba(140,90,0,.3)', color:'#a06800', fontSize:8, letterSpacing:'.16em', textTransform:'uppercase', borderRadius:mobilePin ? 16 : 2 }}>{p.tag}</div>
        {!mobilePin && <div style={{ position:'absolute', bottom:12, left:12, color:'rgba(255,255,255,.85)', fontSize:9, letterSpacing:'.26em', textTransform:'uppercase' }}>{p.cat}</div>}
      </div>

      {/* Info — name + desc only, no price or button */}
      <div style={{ padding:mobilePin ? '10px 10px 14px' : '1.2rem 1.3rem 1.4rem', flex:1, display:'flex', flexDirection:'column' }}>
        {mobilePin && <div style={{ fontSize:7, letterSpacing:'.14em', textTransform:'uppercase', color:'rgba(140,90,0,.65)', marginBottom:3 }}>{p.cat}</div>}
        <h3 style={{ fontSize:mobilePin ? '0.85rem' : '1.1rem', fontWeight:400, fontFamily:"'Cormorant Garamond',serif", color:'#1a1a1a', marginBottom:mobilePin ? 0 : 7, lineHeight:1.3 }}>{p.name}</h3>
        {!mobilePin && p.desc && <p style={{ color:'#777', fontSize:11.5, lineHeight:1.75, flex:1, marginTop:4 }}>{p.desc}</p>}
      </div>
    </div>
  )

  if (mobilePin) return <div style={{ breakInside:'avoid', pageBreakInside:'avoid', display:'inline-block', width:'100%', marginBottom:12, verticalAlign:'top' }}>{cardInner}</div>
  return cardInner
}

/* ─── Search & Filter ───────────────────────────────────────── */
function SearchFilterBar({ query, setQuery, activeFilter, setActiveFilter, allCats }) {
  const [focused, setFocused] = useState(false)
  return (
    <div style={{ maxWidth:860, margin:'0 auto 44px', padding:'0 1rem' }}>
      <div style={{ position:'relative', marginBottom:18, border:`1px solid ${focused ? 'rgba(140,90,0,.5)' : '#e0dbd0'}`, background:'#ffffff', transition:'border .3s', display:'flex', alignItems:'center', boxShadow:focused ? '0 0 0 3px rgba(160,104,0,.08)' : 'none' }}>
        <Search size={15} color="rgba(140,90,0,.6)" style={{ marginLeft:16, flexShrink:0 }} />
        <input type="text" value={query} onChange={e => setQuery(e.target.value)} onFocus={() => setFocused(true)} onBlur={() => setFocused(false)} placeholder="Search products…" style={{ flex:1, padding:'13px 14px', background:'transparent', border:'none', outline:'none', color:'#1a1a1a', fontSize:12, letterSpacing:'.04em', fontFamily:"'Montserrat',sans-serif" }} />
        {query && <button onClick={() => setQuery('')} style={{ background:'none', border:'none', cursor:'pointer', padding:'0 14px', color:'rgba(140,90,0,.6)', display:'flex', alignItems:'center' }}><X size={14} /></button>}
      </div>
      <div style={{ display:'flex', gap:8, flexWrap:'wrap', justifyContent:'center' }}>
        {allCats.map(cat => (
          <button key={cat} onClick={() => setActiveFilter(cat)} style={{ padding:'7px 16px', background:activeFilter===cat ? 'rgba(160,104,0,.1)' : 'transparent', border:`1px solid ${activeFilter===cat ? 'rgba(140,90,0,.5)' : '#e0dbd0'}`, color:activeFilter===cat ? '#a06800' : '#888', fontSize:9, letterSpacing:'.18em', textTransform:'uppercase', cursor:'pointer', transition:'all .25s', fontFamily:"'Montserrat',sans-serif", whiteSpace:'nowrap' }}>{cat}</button>
        ))}
      </div>
    </div>
  )
}

/* ─── ProductSlider ─────────────────────────────────────────── */
function ProductSlider({ products }) {
  const [idx, setIdx] = useState(0); const trackRef = useRef(null)
  const { ref, vis } = useVisible(0.05); const CARD_W = 280, GAP = 16
  const prev = () => setIdx(i => Math.max(0, i-1)); const next = () => setIdx(i => Math.min(products.length-1, i+1))
  useEffect(() => { if (!trackRef.current) return; trackRef.current.scrollTo({ left:idx*(CARD_W+GAP), behavior:'smooth' }) }, [idx])
  if (!products.length) return null
  return (
    <section ref={ref} style={{ padding:'4rem 0 6rem', position:'relative', background:'#f7f6f2' }}>
      <FloatingProduct img={products[0]?.img} size={90} top="-30px" right="5%" delay={0} duration={5} rotate={8} />
      <FloatingProduct img={products[Math.min(3,products.length-1)]?.img} size={70} bottom="40px" left="2%" delay={1.5} duration={6} rotate={-5} />
      <div style={{ maxWidth:1280, margin:'0 auto', padding:'0 1rem', position:'relative', zIndex:2 }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-end', marginBottom:36, flexWrap:'wrap', gap:14, opacity:vis?1:0, transform:vis?'none':'translateY(20px)', transition:'all .7s ease' }}>
          <div>
            <div style={{ fontSize:9, letterSpacing:'.45em', textTransform:'uppercase', color:'#a06800', marginBottom:10 }}>Product Range</div>
            <h2 style={{ fontSize:'clamp(1.8rem,5vw,3.2rem)', fontWeight:300, fontFamily:"'Cormorant Garamond',serif", color:'#1a1a1a', lineHeight:1.1 }}>Our Range</h2>
          </div>
          <div style={{ display:'flex', gap:10 }}>
            {[{ fn:prev, dis:idx===0, Icon:ChevronLeft }, { fn:next, dis:idx>=products.length-1, Icon:ChevronRight }].map(({ fn, dis, Icon }, ki) => (
              <button key={ki} onClick={fn} disabled={dis} style={{ width:44, height:44, border:`1px solid ${dis ? '#e0dbd0' : 'rgba(140,90,0,.4)'}`, background:'transparent', cursor:dis?'default':'pointer', display:'flex', alignItems:'center', justifyContent:'center', color:dis?'#ccc':'#a06800', transition:'all .3s' }}><Icon size={18} /></button>
            ))}
          </div>
        </div>
        <div ref={trackRef} style={{ display:'flex', gap:GAP, overflowX:'auto', scrollSnapType:'x mandatory', WebkitOverflowScrolling:'touch', paddingBottom:16, scrollbarWidth:'none' }}>
          {products.map((p,i) => (
            <div key={p.id} style={{ scrollSnapAlign:'start', width:CARD_W, minWidth:CARD_W }}>
              <ProductCard p={p} i={i} isActive={i===idx} mobilePin={false} />
            </div>
          ))}
        </div>
        <div style={{ display:'flex', justifyContent:'center', gap:8, marginTop:24 }}>
          {products.map((_,i) => <button key={i} onClick={() => setIdx(i)} style={{ width:i===idx?28:8, height:8, borderRadius:4, background:i===idx?'#a06800':'rgba(140,90,0,.2)', border:'none', cursor:'pointer', transition:'all .35s cubic-bezier(.25,.46,.45,.94)' }} />)}
        </div>
        <div style={{ textAlign:'center', marginTop:36 }}>
          <a href="#collections" style={{ padding:'13px 36px', border:'1px solid rgba(140,90,0,.35)', color:'#a06800', fontSize:10, letterSpacing:'.22em', textTransform:'uppercase', textDecoration:'none', display:'inline-flex', alignItems:'center', gap:10, transition:'all .3s', fontFamily:"'Montserrat',sans-serif" }}
            onMouseEnter={e => { e.currentTarget.style.background='rgba(160,104,0,.07)'; e.currentTarget.style.borderColor='rgba(140,90,0,.6)' }}
            onMouseLeave={e => { e.currentTarget.style.background='transparent'; e.currentTarget.style.borderColor='rgba(140,90,0,.35)' }}>
            View Full Range <ArrowRight size={13} />
          </a>
        </div>
      </div>
    </section>
  )
}

/* ─── ProductShowcase ───────────────────────────────────────── */
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
    return matchesCat && (!q || [p.name, p.cat, p.desc, p.tag].some(s => s && s.toLowerCase().includes(q)))
  })
  useEffect(() => { setVisibleCount(12) }, [activeFilter, query])
  const visible = filtered.slice(0, visibleCount)
  const hasMore = visibleCount < filtered.length
  return (
    <section id="collections" ref={ref} style={{ padding:'5rem 1rem', position:'relative', overflow:'hidden', background:'#ffffff' }}>
      <FloatingProduct img={products[2]?.img} size={130} top="8%" right="-25px" delay={0} duration={7} />
      <FloatingProduct img={products[Math.min(4,products.length-1)]?.img} size={90} bottom="4%" left="-15px" delay={2} duration={8} />
      <div style={{ maxWidth:1280, margin:'0 auto', position:'relative', zIndex:2 }}>
        <div style={{ textAlign:'center', marginBottom:44, opacity:vis?1:0, transform:vis?'none':'translateY(24px)', transition:'all .8s' }}>
          <div style={{ fontSize:9, letterSpacing:'.45em', textTransform:'uppercase', color:'#a06800', marginBottom:12 }}>Browse Our Range</div>
          <h2 style={{ fontSize:'clamp(1.8rem,5vw,3.2rem)', fontWeight:300, fontFamily:"'Cormorant Garamond',serif", color:'#1a1a1a', marginBottom:8 }}>Our Products</h2>
          <p style={{ color:'#999', fontSize:11, letterSpacing:'.1em' }}>Search or filter to explore the full Joi range</p>
        </div>
        <SearchFilterBar query={query} setQuery={setQuery} activeFilter={activeFilter} setActiveFilter={setActiveFilter} allCats={ALL_CATS} />
        {filtered.length === 0 ? (
          <div style={{ textAlign:'center', padding:'4rem 1rem', color:'#aaa', fontFamily:"'Cormorant Garamond',serif", fontSize:'1.5rem' }}>No products match <span style={{ color:'#a06800' }}>"{query}"</span></div>
        ) : (
          <>
            <div style={isMobile ? { columnCount:2, columnGap:'12px', padding:'0 8px' } : { display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(min(100%,270px),1fr))', gap:'20px' }}>
              {visible.map((p,i) => <ProductCard key={p.id} p={p} i={i} mobilePin={isMobile} />)}
            </div>
            {hasMore && (
              <div style={{ textAlign:'center', marginTop:28 }}>
                <button onClick={() => setVisibleCount(c => c+12)} style={{ padding:'13px 36px', border:'1px solid rgba(140,90,0,.35)', color:'#a06800', background:'transparent', fontSize:10, letterSpacing:'.22em', textTransform:'uppercase', cursor:'pointer', transition:'all .3s', fontFamily:"'Montserrat',sans-serif", borderRadius:isMobile ? 8 : 0 }}
                  onMouseEnter={e => { e.currentTarget.style.background='rgba(160,104,0,.07)'; e.currentTarget.style.borderColor='rgba(140,90,0,.6)' }}
                  onMouseLeave={e => { e.currentTarget.style.background='transparent'; e.currentTarget.style.borderColor='rgba(140,90,0,.35)' }}>
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

/* ─── Our Story section ─────────────────────────────────────── */
function OurStory() {
  const { ref, vis } = useVisible(0.08)
  return (
    <section id="story" ref={ref} style={{ padding:'6rem 2rem', background:'#faf9f6', borderBottom:'1px solid #e8e2d8', position:'relative', overflow:'hidden' }}>
      <FloatingOrbs />
      <div style={{ maxWidth:1100, margin:'0 auto', display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(min(100%,280px),1fr))', gap:'5rem', alignItems:'center', position:'relative', zIndex:1 }}>

        {/* Image side */}
        <div style={{ position:'relative', opacity:vis?1:0, transform:vis?'translateX(0)':'translateX(-32px)', transition:'all .9s ease' }}>
          <div style={{ position:'absolute', top:-16, left:-16, right:16, bottom:16, border:'1px solid rgba(140,90,0,.18)', zIndex:0, pointerEvents:'none' }} />
          <img src="https://images.pexels.com/photos/5632386/pexels-photo-5632386.jpeg?auto=compress&cs=tinysrgb&w=800" alt="Joi Story" style={{ width:'100%', height:440, objectFit:'cover', position:'relative', zIndex:1, filter:'brightness(.92) saturate(1.05)' }} />
          <div style={{ position:'absolute', bottom:-20, right:-20, background:'linear-gradient(135deg,#FFD700,#FFE34D)', padding:'1rem 1.4rem', zIndex:2, boxShadow:'0 12px 40px rgba(0,0,0,.12)' }}>
            <div style={{ fontSize:8, letterSpacing:'.2em', textTransform:'uppercase', color:'#1a1a1a', fontWeight:600 }}>Proudly</div>
            <div style={{ fontSize:'1.4rem', fontWeight:300, fontFamily:"'Cormorant Garamond',serif", color:'#1a1a1a', lineHeight:1.1 }}>Made in Kenya</div>
          </div>
        </div>

        {/* Text side */}
        <div style={{ opacity:vis?1:0, transform:vis?'translateX(0)':'translateX(32px)', transition:'all .9s ease .15s' }}>
          <div style={{ fontSize:9, letterSpacing:'.45em', textTransform:'uppercase', color:'#a06800', marginBottom:16 }}>Our Story</div>
          <h2 style={{ fontSize:'clamp(1.8rem,4vw,3rem)', fontWeight:300, fontFamily:"'Cormorant Garamond',serif", color:'#1a1a1a', lineHeight:1.2, marginBottom:20 }}>
            Built for Africa.{' '}
            <span style={{ background:'linear-gradient(135deg,#a06800,#c28a00)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>Made with Joy.</span>
          </h2>
          <div style={{ width:0, height:1, background:'#a06800', marginBottom:24, animation:vis?'lineGrow .8s ease .4s forwards':'none' }} />
          <p style={{ color:'#555', fontSize:14, lineHeight:1.9, marginBottom:16 }}>
            Joi began with a simple but powerful observation: African consumers deserved quality beauty and hair care products that truly understood their needs — without the premium price tag.
          </p>
          <p style={{ color:'#777', fontSize:13, lineHeight:1.9, marginBottom:16 }}>
            Founded in Kenya under Wellstrend Creations Ltd., every Joi product is built from the ground up with African hair at the centre of every formulation decision. From raw material selection to texture, fragrance, and finish — the African consumer experience was never an afterthought. It was the starting point.
          </p>
          <p style={{ color:'#777', fontSize:13, lineHeight:1.9, marginBottom:32 }}>
            The name says it all. Not just a brand — a feeling. The joy of a good hair day, the confidence of a well-maintained look, the satisfaction of a product that does exactly what it promises. That's what we set out to bottle.
          </p>
          <Link to="/about" style={{ display:'inline-flex', alignItems:'center', gap:8, color:'#a06800', fontSize:10, letterSpacing:'.22em', textTransform:'uppercase', textDecoration:'none', borderBottom:'1px solid rgba(140,90,0,.35)', paddingBottom:4, fontFamily:"'Montserrat',sans-serif", transition:'all .25s' }}
            onMouseEnter={e => e.currentTarget.style.borderColor='rgba(140,90,0,.8)'}
            onMouseLeave={e => e.currentTarget.style.borderColor='rgba(140,90,0,.35)'}>
            Read Our Full Story <ArrowRight size={12} />
          </Link>
        </div>
      </div>
    </section>
  )
}

/* ─── Features ──────────────────────────────────────────────── */
function Features() {
  const { ref, vis } = useVisible()
  return (
    <section ref={ref} style={{ padding:'4.5rem 1rem', maxWidth:1280, margin:'0 auto', position:'relative', overflow:'hidden' }}>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(min(100%,220px),1fr))', gap:20, position:'relative', zIndex:2 }}>
        {features.map(({ icon:Icon, title, desc }, i) => (
          <div key={title} style={{ display:'flex', flexDirection:'column', alignItems:'center', textAlign:'center', padding:'2.2rem 1.5rem', border:'1px solid #e8e2d8', background:'#faf9f6', opacity:vis?1:0, transform:vis?'translateY(0)':'translateY(32px)', transition:`all .75s ease ${i*.18}s` }}>
            <div style={{ width:50, height:50, border:'1px solid rgba(140,90,0,.35)', display:'flex', alignItems:'center', justifyContent:'center', marginBottom:18, background:'rgba(160,104,0,.06)', animation:`landingPulse 3.5s ease-in-out ${i*.8}s infinite` }}>
              <Icon size={19} color="#a06800" />
            </div>
            <h3 style={{ fontSize:'1.1rem', fontWeight:400, fontFamily:"'Cormorant Garamond',serif", color:'#1a1a1a', marginBottom:10 }}>{title}</h3>
            <p style={{ color:'#777', fontSize:11.5, lineHeight:1.85 }}>{desc}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

/* ─── Testimonials ──────────────────────────────────────────── */
function Testimonials() {
  const { ref, vis } = useVisible(); const [active, setActive] = useState(0)
  useEffect(() => { const t = setInterval(() => setActive(a => (a+1)%reviews.length), 4500); return () => clearInterval(t) }, [])
  return (
    <section ref={ref} style={{ padding:'5rem 1rem', background:'#f7f6f2', borderTop:'1px solid #e8e2d8', borderBottom:'1px solid #e8e2d8', overflow:'hidden', position:'relative' }}>
      <div style={{ maxWidth:1200, margin:'0 auto', position:'relative', zIndex:2 }}>
        <div style={{ textAlign:'center', marginBottom:44, opacity:vis?1:0, transform:vis?'none':'translateY(20px)', transition:'all .7s' }}>
          <div style={{ fontSize:9, letterSpacing:'.45em', textTransform:'uppercase', color:'#a06800', marginBottom:12 }}>What People Say</div>
          <h2 style={{ fontSize:'clamp(1.8rem,4vw,3rem)', fontWeight:300, fontFamily:"'Cormorant Garamond',serif", color:'#1a1a1a' }}>Voices of Joy</h2>
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(min(100%,260px),1fr))', gap:18 }}>
          {reviews.map((r,i) => (
            <div key={r.name} onClick={() => setActive(i)} style={{ padding:'2.2rem', border:`1px solid ${i===active ? 'rgba(140,90,0,.4)' : '#e8e2d8'}`, background:i===active ? '#ffffff' : '#faf9f6', opacity:vis?1:0, transform:vis?'translateY(0)':'translateY(30px)', transition:`all .7s ease ${i*.15}s,border .4s,background .4s`, boxShadow:i===active?'0 8px 40px rgba(0,0,0,.07)':'none', cursor:'pointer' }}>
              <div style={{ display:'flex', gap:3, marginBottom:14 }}>{Array(r.stars).fill(0).map((_,si) => <Star key={si} size={12} fill="#a06800" color="#a06800" />)}</div>
              <p style={{ fontSize:'1rem', fontStyle:'italic', fontFamily:"'Cormorant Garamond',serif", color:'#444', lineHeight:1.85, marginBottom:18 }}>{r.text}</p>
              <div style={{ color:'#1a1a1a', fontSize:12, fontWeight:500 }}>{r.name}</div>
              <div style={{ color:'rgba(140,90,0,.7)', fontSize:10.5, marginTop:3 }}>{r.role}</div>
            </div>
          ))}
        </div>
        <div style={{ display:'flex', justifyContent:'center', gap:8, marginTop:24 }}>
          {reviews.map((_,i) => <button key={i} onClick={() => setActive(i)} style={{ width:i===active?24:8, height:8, borderRadius:4, background:i===active?'#a06800':'rgba(140,90,0,.2)', border:'none', cursor:'pointer', transition:'all .3s' }} />)}
        </div>
      </div>
    </section>
  )
}

/* ─── CTA Banner ────────────────────────────────────────────── */
function CtaBanner() {
  const { ref, vis } = useVisible()
  return (
    <section ref={ref} style={{ padding:'6rem 1rem', position:'relative', overflow:'hidden' }}>
      <div style={{ position:'absolute', inset:0, backgroundImage:'url(https://images.pexels.com/photos/4041392/pexels-photo-4041392.jpeg?auto=compress&cs=tinysrgb&w=1600)', backgroundSize:'cover', backgroundPosition:'center', filter:'brightness(.55)' }} />
      <div style={{ position:'absolute', inset:0, background:'linear-gradient(135deg,rgba(255,250,240,.12),rgba(160,104,0,.08))' }} />
      <div style={{ position:'relative', textAlign:'center', maxWidth:580, margin:'0 auto', zIndex:2, opacity:vis?1:0, transform:vis?'translateY(0)':'translateY(30px)', transition:'all .85s ease' }}>
        <div style={{ fontSize:9, letterSpacing:'.45em', textTransform:'uppercase', color:'#e8c870', marginBottom:18 }}>Work With Joi</div>
        <h2 style={{ fontSize:'clamp(1.8rem,5vw,3.4rem)', fontWeight:300, fontFamily:"'Cormorant Garamond',serif", color:'#fff', lineHeight:1.2, marginBottom:18 }}>
          Quality Hair Care Products,{' '}
          <span style={{ background:'linear-gradient(135deg,#FFD700,#FFEC99)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>Proudly Made in Kenya.</span>
        </h2>
        <p style={{ color:'rgba(255,255,255,.7)', fontSize:13, lineHeight:1.9, marginBottom:36 }}>Interested in stocking our range, becoming a distributor, or simply want to learn more about what we manufacture? We'd love to hear from you.</p>
        <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:20 }}>
          <div style={{ display:'flex', gap:28, flexWrap:'wrap', justifyContent:'center' }}>
            <a href="tel:0748635395" style={{ display:'flex', alignItems:'center', gap:8, color:'rgba(255,255,255,.75)', fontSize:13, textDecoration:'none', transition:'color .25s' }} onMouseEnter={e => e.currentTarget.style.color='#FFD700'} onMouseLeave={e => e.currentTarget.style.color='rgba(255,255,255,.75)'}><Phone size={14} color="#FFD700" />0748 635 395</a>
            <a href="mailto:Wellssolutions2015@gmail.com" style={{ display:'flex', alignItems:'center', gap:8, color:'rgba(255,255,255,.75)', fontSize:13, textDecoration:'none', transition:'color .25s' }} onMouseEnter={e => e.currentTarget.style.color='#FFD700'} onMouseLeave={e => e.currentTarget.style.color='rgba(255,255,255,.75)'}><Mail size={14} color="#FFD700" />Wellssolutions2015@gmail.com</a>
          </div>
          <a href="mailto:Wellssolutions2015@gmail.com" style={{ padding:'13px 36px', background:'linear-gradient(135deg,#FFD700,#FFE34D)', color:'#1a1a1a', fontSize:10, letterSpacing:'.22em', textTransform:'uppercase', textDecoration:'none', fontWeight:600, display:'inline-flex', alignItems:'center', gap:10, transition:'transform .3s' }} onMouseEnter={e => e.currentTarget.style.transform='translateY(-2px)'} onMouseLeave={e => e.currentTarget.style.transform='none'}>Enquire Now <ArrowRight size={13} /></a>
        </div>
      </div>
    </section>
  )
}

/* ─── Main ──────────────────────────────────────────────────── */
export default function Landing() {
  const [mouse, setMouse] = useState({ x:.5, y:.5 })
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const { ref: featRef } = useVisible()

  useEffect(() => { injectStyles() }, [])
  useEffect(() => {
    fetch('https://joy-beauty-shop-dashboard.onrender.com/api/products')
      .then(r => { if (!r.ok) throw new Error(); return r.json() })
      .then(j => { const list = Array.isArray(j) ? j : (Array.isArray(j.data) ? j.data : []); setProducts(list.filter(p => p.active !== false)); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])
  useEffect(() => {
    const onMove = e => setMouse({ x:e.clientX/window.innerWidth, y:e.clientY/window.innerHeight })
    window.addEventListener('mousemove', onMove); return () => window.removeEventListener('mousemove', onMove)
  }, [])

  const px = (mouse.x-.5)*18, py = (mouse.y-.5)*18

  if (loading) return (
    <div style={{ minHeight:'100vh', display:'flex', flexDirection:'column', justifyContent:'center', alignItems:'center', background:'#ffffff', gap:16 }}>
      <div style={{ width:48, height:48, border:'2px solid rgba(160,104,0,.2)', borderTop:'2px solid #a06800', borderRadius:'50%', animation:'spin 1s linear infinite' }} />
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      <span style={{ color:'#a06800', fontFamily:"'Cormorant Garamond',serif", fontSize:'1.3rem', letterSpacing:'.12em' }}>Loading...</span>
    </div>
  )

  return (
    <div style={{ background:'#ffffff', fontFamily:"'Montserrat',sans-serif" }}>

      {/* ── Hero ── */}
      <section style={{ position:'relative', minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', overflow:'hidden' }}>
        <div style={{ position:'absolute', inset:'-12%', backgroundImage:'url(https://images.pexels.com/photos/3373739/pexels-photo-3373739.jpeg?auto=compress&cs=tinysrgb&w=1600)', backgroundSize:'cover', backgroundPosition:'center', transform:`translate(${px*.35}px,${py*.35}px)`, transition:'transform .08s linear', filter:'brightness(.58)' }} />
        <div style={{ position:'absolute', inset:0, background:`radial-gradient(ellipse at ${50+px*.4}% ${50+py*.4}%,rgba(160,104,0,.1) 0%,transparent 62%)`, transition:'background .08s linear' }} />
        <div style={{ position:'absolute', inset:0, backgroundImage:'linear-gradient(rgba(0,0,0,.04) 1px,transparent 1px),linear-gradient(90deg,rgba(0,0,0,.04) 1px,transparent 1px)', backgroundSize:'64px 64px' }} />
        <FloatingOrbs />
        <FloatingProduct img={products[0]?.img} size={160} top="8%"  right="5%"  delay={0}   duration={6}   rotate={5} />
        <FloatingProduct img={products[1]?.img} size={120} bottom="15%" right="7%"  delay={1.5} duration={7}   rotate={-8} />
        <FloatingProduct img={products[2]?.img} size={100} top="20%" left="3%"   delay={.8}  duration={5.5} rotate={12} />
        <FloatingProduct img={products[3]?.img} size={80}  bottom="25%" left="4%"   delay={2.5} duration={6.5} rotate={-6} />

        <div style={{ position:'relative', zIndex:2, textAlign:'center', padding:'9rem 1.2rem 3rem', maxWidth:820 }}>
          {/* Logo — top center, white surface */}
          {/* Hero centre logo */}
         <div style={{ display:'flex', justifyContent:'center', marginBottom:20, marginTop:'-15rem', opacity:0, animation:'landingFadeIn 1s ease .1s forwards' }}>
            <div style={{
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 160,
              height: 160,
            }}>
              {/* Outer glow ring */}
              <div style={{
                position: 'absolute',
                inset: -14,
                borderRadius: '50%',
                background: 'radial-gradient(circle, rgba(255,215,0,0.18) 0%, transparent 70%)',
                pointerEvents: 'none',
              }} />
              {/* Circle backdrop */}
              <div style={{
                position: 'absolute',
                inset: 0,
                borderRadius: '50%',
                background: 'rgba(255,255,255,0.12)',
                border: '1px solid rgba(255,255,255,0.25)',
                backdropFilter: 'blur(6px)',
                boxShadow: '0 8px 40px rgba(255,215,0,0.15), inset 0 1px 0 rgba(255,255,255,0.2)',
              }} />
              {/* Logo */}
              <img
                src={logoImg}
                alt="Joi"
                style={{
                  position: 'relative',
                  zIndex: 1,
                  height: 100,
                  width: 'auto',
                  objectFit: 'contain',
                  filter: 'drop-shadow(0 8px 32px rgba(0,0,0,.5)) brightness(1.08)',
                }}
              />
            </div>
          </div>
          <div style={{ fontSize:9, letterSpacing:'.5em', textTransform:'uppercase', color:'#e8c870', marginBottom:20, opacity:0, animation:'landingFadeIn 1s ease .4s forwards' }}>Premium Hair &amp; Beauty Manufacturing · Proudly Made in Kenya</div>
          <h1 style={{ fontSize:'clamp(2.4rem,10vw,6.5rem)', fontWeight:300, fontFamily:"'Cormorant Garamond',serif", lineHeight:1.05, marginBottom:20, opacity:0, animation:'landingFadeUp 1s ease .5s forwards' }}>
            <span style={{ display:'block', color:'#fff' }}>Unlocking Beauty,</span>
            <span style={{ display:'block', background:'linear-gradient(135deg,#FFD700 0%,#FFEC99 50%,#FFD700 100%)', backgroundSize:'200% auto', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', animation:'landingShimmer 4s linear infinite 1.5s' }}>Spreading the Joi</span>
          </h1>
          <p style={{ color:'rgba(255,255,255,.75)', fontSize:'clamp(.8rem,2vw,.95rem)', lineHeight:1.95, maxWidth:520, margin:'0 auto 2.4rem', fontWeight:300, opacity:0, animation:'landingFadeUp 1s ease .7s forwards' }}>
            High-quality, affordable beauty and hair care products designed for everyday African consumers — manufactured with care, consistency, and joy at every step.
          </p>
          <div style={{ display:'flex', gap:12, justifyContent:'center', flexWrap:'wrap', opacity:0, animation:'landingFadeUp 1s ease .9s forwards' }}>
            <a href="#collections" style={{ padding:'13px 32px', background:'linear-gradient(135deg,#FFD700,#FFE34D)', color:'#1a1a1a', fontSize:10, letterSpacing:'.22em', textTransform:'uppercase', textDecoration:'none', fontWeight:600, display:'inline-block', transition:'transform .3s' }} onMouseEnter={e => e.currentTarget.style.transform='translateY(-2px)'} onMouseLeave={e => e.currentTarget.style.transform='none'}>Explore Products</a>
            <a href="#story" style={{ padding:'13px 32px', background:'transparent', border:'1px solid rgba(255,215,0,.6)', color:'#FFD700', fontSize:10, letterSpacing:'.22em', textTransform:'uppercase', textDecoration:'none', transition:'all .3s' }} onMouseEnter={e => { e.currentTarget.style.background='rgba(255,215,0,.1)'; e.currentTarget.style.borderColor='rgba(255,215,0,.9)' }} onMouseLeave={e => { e.currentTarget.style.background='transparent'; e.currentTarget.style.borderColor='rgba(255,215,0,.6)' }}>Our Story</a>
          </div>
        </div>

        <div style={{ position:'absolute', bottom:32, left:'50%', transform:'translateX(-50%)', display:'flex', flexDirection:'column', alignItems:'center', gap:7, opacity:0, animation:'landingFadeIn 1s ease 1.6s forwards' }}>
          <span style={{ fontSize:8.5, letterSpacing:'.35em', color:'rgba(255,215,0,.7)', textTransform:'uppercase' }}>Scroll</span>
          <div style={{ width:1, height:36, background:'linear-gradient(to bottom,rgba(255,215,0,.7),transparent)', animation:'landingBlink 2s ease-in-out infinite' }} />
        </div>
      </section>

      {/* ── Marquee ── */}
      <div style={{ background:'linear-gradient(90deg,#FFD700,#FFE34D,#FFEC99,#FFE34D,#FFD700)', padding:'12px 0', overflow:'hidden' }}>
        <div style={{ display:'flex', whiteSpace:'nowrap', animation:'landingMarquee 28s linear infinite' }}>
          {Array(10).fill(0).map((_,i) => (
            <span key={i} style={{ fontSize:9, letterSpacing:'.28em', textTransform:'uppercase', color:'#1a1a1a', fontWeight:600, paddingRight:40 }}>
              Joi by Wellstrend &nbsp;&middot;&nbsp; Quality in Every Batch &nbsp;&middot;&nbsp; Made for African Hair &nbsp;&middot;&nbsp; Unlocking Beauty, Spreading the Joi &nbsp;&middot;&nbsp;
            </span>
          ))}
        </div>
      </div>

      {/* ── Our Story ── */}
      <OurStory />

      {/* ── Why Choose Joi ── */}
      <section ref={featRef} style={{ padding:'4.5rem 1rem', maxWidth:1280, margin:'0 auto', position:'relative', overflow:'hidden' }}>
        <Features />
      </section>

      {/* ── Slider ── */}
      <ProductSlider products={products} />

      {/* ── Products Grid ── */}
      <ProductShowcase products={products} />

      {/* ── Testimonials ── */}
      <Testimonials />

      {/* ── CTA ── */}
      <CtaBanner />
    </div>
  )
}