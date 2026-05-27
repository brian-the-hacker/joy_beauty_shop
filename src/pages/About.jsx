import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { Award, Users, Globe, Heart, ArrowRight, Sparkles, Leaf, Shield } from 'lucide-react'
import Logo from '../components/Logo'

/* ── Keyframes (same injection pattern as Landing) ── */
const STYLES = `
  @keyframes fadeIn  { from { opacity:0 } to { opacity:1 } }
  @keyframes fadeUp  { from { opacity:0; transform:translateY(28px) } to { opacity:1; transform:translateY(0) } }
  @keyframes shimmer { to { background-position: 200% center } }
  @keyframes floatA  { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-14px)} }
  @keyframes orbDrift { 0%,100%{transform:translate(0,0) scale(1)} 40%{transform:translate(14px,-20px) scale(1.07)} 70%{transform:translate(-10px,8px) scale(0.94)} }
  @keyframes marquee { from{transform:translateX(0)} to{transform:translateX(-50%)} }
  @keyframes pulse   { 0%,100%{box-shadow:0 0 0 0 rgba(255,215,0,0)} 50%{box-shadow:0 0 24px 6px rgba(255,215,0,.14)} }
  @keyframes blink   { 0%,100%{opacity:.35} 50%{opacity:1} }
  @keyframes scaleIn { from{opacity:0;transform:scale(.92)} to{opacity:1;transform:scale(1)} }
  @keyframes spin    { to{transform:rotate(360deg)} }
  @keyframes lineGrow { from{width:0} to{width:40px} }
  @keyframes countUp { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
`
let injected = false
function injectStyles() {
  if (injected || typeof document === 'undefined') return
  const el = document.createElement('style')
  el.textContent = STYLES
  document.head.appendChild(el)
  injected = true
}

/* ── Visibility hook (same as Landing) ── */
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

/* ── Floating orbs (same as Landing) ── */
function FloatingOrbs() {
  return (
    <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden', zIndex: 0 }}>
      {[
        { size: 380, top: '5%', left: '-10%', dur: 16 },
        { size: 240, top: '55%', right: '-6%', dur: 20 },
        { size: 160, top: '25%', right: '12%', dur: 13 },
        { size: 120, bottom: '10%', left: '20%', dur: 17 },
      ].map((orb, i) => (
        <div key={i} style={{
          position: 'absolute', width: orb.size, height: orb.size, borderRadius: '50%',
          background: 'radial-gradient(circle,rgba(255,215,0,.08) 0%,transparent 70%)',
          top: orb.top, left: orb.left, right: orb.right, bottom: orb.bottom,
          animation: `orbDrift ${orb.dur}s ease-in-out infinite`,
          animationDelay: `${i * -4}s`,
        }} />
      ))}
    </div>
  )
}

/* ── Data ── */
const milestones = [
  { year: '2014', title: 'Founded', desc: 'Born in a Parisian atelier, Charles Beauty was created to bring true luxury to modern women.' },
  { year: '2017', title: 'First Award', desc: 'Velvet Noir Serum wins the Cosmopolitan Beauty Award for Best Luxury Serum.' },
  { year: '2020', title: 'Global Expansion', desc: 'Charles Beauty launches in 40+ countries, reaching women across 5 continents.' },
  { year: '2023', title: 'Clean Certified', desc: 'Achieved full clean beauty certification — 100% cruelty-free and sustainably sourced.' },
  { year: '2026', title: 'The Future', desc: 'Introducing AI-powered skin ritual consultations and next-gen formulas.' },
]

const stats = [
  { icon: Award,  value: '12+',  label: 'Global Beauty Awards' },
  { icon: Users,  value: '850K+', label: 'Loyal Customers' },
  { icon: Globe,  value: '42',   label: 'Countries Reached' },
  { icon: Heart,  value: '100%', label: 'Cruelty-Free' },
]

const values = [
  { icon: Sparkles, title: 'Gold-Infused Formulas',   desc: 'Enriched with precious metals and rare botanical extracts for visible radiance.' },
  { icon: Leaf,     title: 'Clean & Conscious',        desc: 'No parabens, no sulfates. Pure luxury with a clean conscience.' },
  { icon: Shield,   title: 'Dermatologist Tested',     desc: 'Clinically proven efficacy on all skin tones and types, worldwide.' },
]

const team = [
  { name: 'Isabelle Laurent',  role: 'Founder & Creative Director',   img: 'https://images.pexels.com/photos/3992656/pexels-photo-3992656.jpeg?auto=compress&cs=tinysrgb&w=400', bio: 'Trained in Paris and Tokyo, Isabelle built Charles Beauty on the belief that luxury should feel personal.' },
  { name: 'Dr. Amara Osei',    role: 'Chief Formulation Scientist',    img: 'https://images.pexels.com/photos/5490276/pexels-photo-5490276.jpeg?auto=compress&cs=tinysrgb&w=400', bio: 'With a PhD in biocosmetics, Amara bridges cutting-edge science with botanical wisdom.' },
  { name: 'Sofia Reyes',       role: 'Head of Brand & Experience',     img: 'https://images.pexels.com/photos/4046316/pexels-photo-4046316.jpeg?auto=compress&cs=tinysrgb&w=400', bio: 'Sofia shapes every touchpoint — from unboxing to skin ritual — into a sensory story.' },
]

/* ── Animated counter ── */
function Counter({ target, suffix = '' }) {
  const [val, setVal] = useState(0)
  const { ref, vis } = useVisible(0.3)
  useEffect(() => {
    if (!vis) return
    const num = parseFloat(target.replace(/[^0-9.]/g, ''))
    const isFloat = target.includes('.')
    let start = null
    const duration = 1400
    const step = (ts) => {
      if (!start) start = ts
      const progress = Math.min((ts - start) / duration, 1)
      const ease = 1 - Math.pow(1 - progress, 3)
      setVal(isFloat ? (num * ease).toFixed(1) : Math.round(num * ease))
      if (progress < 1) requestAnimationFrame(step)
    }
    requestAnimationFrame(step)
  }, [vis, target])
  const prefix = target.replace(/[0-9.+%K]/g, '')
  const hasSuffix = target.match(/[+%K]/)
  return (
    <span ref={ref}>
      {prefix}{val}{hasSuffix ? target.match(/[+%K]/)?.[0] : ''}{suffix}
    </span>
  )
}

/* ════════════════════════════════════════════════════════════ */
export default function About() {
  const { ref: missionRef, vis: missionVis } = useVisible(0.08)
  const { ref: statsRef,   vis: statsVis   } = useVisible(0.08)
  const { ref: valRef,     vis: valVis     } = useVisible(0.08)
  const { ref: timeRef,    vis: timeVis    } = useVisible(0.08)
  const { ref: teamRef,    vis: teamVis    } = useVisible(0.08)
  const { ref: ctaRef,     vis: ctaVis     } = useVisible(0.08)

  const [mouse, setMouse] = useState({ x: .5, y: .5 })

  useEffect(() => { injectStyles(); window.scrollTo(0, 0) }, [])
  useEffect(() => {
    const mv = e => setMouse({ x: e.clientX / window.innerWidth, y: e.clientY / window.innerHeight })
    window.addEventListener('mousemove', mv)
    return () => window.removeEventListener('mousemove', mv)
  }, [])

  const px = (mouse.x - .5) * 16
  const py = (mouse.y - .5) * 16

  return (
    <div style={{ background: '#1B3A6B', fontFamily: "'Montserrat', sans-serif", minHeight: '100vh' }}>

      {/* ══ HERO ══════════════════════════════════════════════ */}
      <section style={{ position: 'relative', height: '90vh', minHeight: 560, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
        {/* Parallax BG */}
        <div style={{ position: 'absolute', inset: '-12%', backgroundImage: 'url(https://images.pexels.com/photos/3373745/pexels-photo-3373745.jpeg?auto=compress&cs=tinysrgb&w=1600)', backgroundSize: 'cover', backgroundPosition: 'center 30%', transform: `translate(${px * .35}px,${py * .35}px)`, transition: 'transform .08s linear', filter: 'brightness(.2)' }} />
        {/* Radial gold glow */}
        <div style={{ position: 'absolute', inset: 0, background: `radial-gradient(ellipse at ${50 + px * .4}% ${50 + py * .4}%,rgba(255,215,0,.13) 0%,transparent 62%)`, transition: 'background .08s linear' }} />
        {/* Grid texture */}
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(255,215,0,.025) 1px,transparent 1px),linear-gradient(90deg,rgba(255,215,0,.025) 1px,transparent 1px)', backgroundSize: '64px 64px' }} />
        {/* Bottom fade */}
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, transparent 50%, #1B3A6B 100%)' }} />

        <FloatingOrbs />

        <div style={{ position: 'relative', zIndex: 2, textAlign: 'center', padding: '9rem 1.5rem 3rem', maxWidth: 860 }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 28, opacity: 0, animation: 'fadeIn 1s ease .2s forwards' }}>
            <Logo size={64} />
          </div>
          <div style={{ fontSize: 9, letterSpacing: '.5em', textTransform: 'uppercase', color: '#FFD700', marginBottom: 20, opacity: 0, animation: 'fadeIn 1s ease .4s forwards' }}>
            Est. 2014 · Paris
          </div>
          <h1 style={{ fontSize: 'clamp(2.8rem, 9vw, 6.5rem)', fontWeight: 300, fontFamily: "'Cormorant Garamond', serif", lineHeight: 1.05, marginBottom: 20, opacity: 0, animation: 'fadeUp 1s ease .5s forwards' }}>
            <span style={{ display: 'block', color: '#fff' }}>The House of</span>
            <span style={{ display: 'block', background: 'linear-gradient(135deg,#FFD700 0%,#FFEC99 50%,#FFD700 100%)', backgroundSize: '200% auto', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', animation: 'shimmer 4s linear infinite 1.5s' }}>
              Charles Beauty
            </span>
          </h1>
          <p style={{ color: 'rgba(255,255,255,.55)', fontSize: 'clamp(.85rem,2vw,1rem)', fontStyle: 'italic', letterSpacing: '.06em', maxWidth: 500, margin: '0 auto 2.8rem', opacity: 0, animation: 'fadeUp 1s ease .7s forwards' }}>
            "Where science meets luxury, beauty becomes power."
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap', opacity: 0, animation: 'fadeUp 1s ease .9s forwards' }}>
            <Link to="/" style={{ padding: '13px 32px', background: 'linear-gradient(135deg,#FFD700,#FFE34D)', color: '#1B3A6B', fontSize: 10, letterSpacing: '.22em', textTransform: 'uppercase', textDecoration: 'none', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: 10 }}>
              Shop Now <ArrowRight size={12} />
            </Link>
            <a href="#mission" style={{ padding: '13px 32px', border: '1px solid rgba(255,215,0,.5)', color: '#FFD700', fontSize: 10, letterSpacing: '.22em', textTransform: 'uppercase', textDecoration: 'none' }}>
              Our Story
            </a>
          </div>
        </div>

        {/* Scroll indicator */}
        <div style={{ position: 'absolute', bottom: 32, left: '50%', transform: 'translateX(-50%)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 7, opacity: 0, animation: 'fadeIn 1s ease 1.6s forwards' }}>
          <span style={{ fontSize: 8.5, letterSpacing: '.35em', color: 'rgba(255,215,0,.55)', textTransform: 'uppercase' }}>Scroll</span>
          <div style={{ width: 1, height: 36, background: 'linear-gradient(to bottom,rgba(255,215,0,.6),transparent)', animation: 'blink 2s ease-in-out infinite' }} />
        </div>
      </section>

      {/* ══ MARQUEE (same as Landing) ══════════════════════════ */}
      <div style={{ background: 'linear-gradient(90deg,#FFD700,#FFE34D,#FFEC99,#FFE34D,#FFD700)', padding: '12px 0', overflow: 'hidden' }}>
        <div style={{ display: 'flex', whiteSpace: 'nowrap', animation: 'marquee 30s linear infinite' }}>
          {Array(10).fill(0).map((_, i) => (
            <span key={i} style={{ fontSize: 9, letterSpacing: '.28em', textTransform: 'uppercase', color: '#1B3A6B', fontWeight: 600, paddingRight: 40 }}>
              Charles Beauty Shop &nbsp;&middot;&nbsp; 12 Global Awards &nbsp;&middot;&nbsp; 850K+ Customers &nbsp;&middot;&nbsp; Cruelty-Free &nbsp;&middot;&nbsp;
            </span>
          ))}
        </div>
      </div>

      {/* ══ STATS ══════════════════════════════════════════════ */}
      <section ref={statsRef} style={{ background: 'rgba(15,36,71,.85)', borderBottom: '1px solid rgba(255,215,0,.08)', padding: '5rem 2rem' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(180px,1fr))', gap: 32 }}>
          {stats.map(({ icon: Icon, value, label }, i) => (
            <div key={label} style={{ textAlign: 'center', padding: '2rem 1rem', opacity: statsVis ? 1 : 0, transform: statsVis ? 'translateY(0)' : 'translateY(24px)', transition: `all .65s ease ${i * .12}s` }}>
              <div style={{ width: 50, height: 50, border: '1px solid rgba(255,215,0,.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 18px', background: 'rgba(255,215,0,.06)', animation: `pulse 3.5s ease-in-out ${i * .8}s infinite` }}>
                <Icon size={19} color="#FFD700" />
              </div>
              <div style={{ fontSize: '3rem', fontWeight: 300, fontFamily: "'Cormorant Garamond', serif", background: 'linear-gradient(135deg,#FFD700,#FFEC99)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', lineHeight: 1, marginBottom: 8 }}>
                {statsVis ? <Counter target={value} /> : '—'}
              </div>
              <div style={{ fontSize: 10, letterSpacing: '.18em', textTransform: 'uppercase', color: 'rgba(255,255,255,.45)' }}>{label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ══ MISSION ════════════════════════════════════════════ */}
      <section id="mission" ref={missionRef} style={{ padding: '8rem 2rem', maxWidth: 1280, margin: '0 auto', position: 'relative', overflow: 'hidden' }}>
        <FloatingOrbs />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(300px,1fr))', gap: '5rem', alignItems: 'center', position: 'relative', zIndex: 1, opacity: missionVis ? 1 : 0, transform: missionVis ? 'translateY(0)' : 'translateY(40px)', transition: 'all .9s ease' }}>

          {/* Image block */}
          <div style={{ position: 'relative' }}>
            <div style={{ position: 'absolute', top: -20, left: -20, right: 20, bottom: 20, border: '1px solid rgba(255,215,0,.18)', pointerEvents: 'none', zIndex: 0 }} />
            <img src="https://images.pexels.com/photos/3785147/pexels-photo-3785147.jpeg?auto=compress&cs=tinysrgb&w=800" alt="Atelier" style={{ width: '100%', height: 520, objectFit: 'cover', display: 'block', filter: 'brightness(.88) saturate(1.1)', position: 'relative', zIndex: 1 }} />
            {/* Gold accent badge */}
            <div style={{ position: 'absolute', bottom: -24, right: -24, width: 110, height: 110, background: 'linear-gradient(135deg,#FFD700,#FFE34D)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', zIndex: 2, boxShadow: '0 20px 60px rgba(0,0,0,.4)' }}>
              <span style={{ fontSize: '2rem', fontWeight: 300, fontFamily: "'Cormorant Garamond',serif", color: '#1B3A6B', lineHeight: 1 }}>12</span>
              <span style={{ fontSize: 8, letterSpacing: '.2em', textTransform: 'uppercase', color: '#1B3A6B', fontWeight: 700, textAlign: 'center', lineHeight: 1.4 }}>Years of<br />Excellence</span>
            </div>
            {/* Floating product bubble */}
            <div style={{ position: 'absolute', top: 24, left: -32, width: 72, height: 72, borderRadius: '50%', overflow: 'hidden', border: '2px solid rgba(255,215,0,.3)', boxShadow: '0 12px 40px rgba(0,0,0,.4)', animation: 'floatA 5s ease-in-out infinite', zIndex: 2 }}>
              <img src="https://images.pexels.com/photos/5632386/pexels-photo-5632386.jpeg?auto=compress&cs=tinysrgb&w=200" alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
          </div>

          {/* Text block */}
          <div>
            <div style={{ fontSize: 9, letterSpacing: '.45em', textTransform: 'uppercase', color: '#FFD700', marginBottom: 20 }}>Our Mission</div>
            <h2 style={{ fontSize: 'clamp(1.8rem,3.5vw,3rem)', fontWeight: 300, fontFamily: "'Cormorant Garamond', serif", color: '#fff', lineHeight: 1.25, marginBottom: 20 }}>
              Beauty That Honors{' '}
              <span style={{ background: 'linear-gradient(135deg,#FFD700,#FFEC99)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Every Woman</span>
            </h2>
            <div style={{ width: 0, height: 1, background: '#FFD700', marginBottom: 24, animation: missionVis ? 'lineGrow .8s ease .4s forwards' : 'none' }} />
            <p style={{ color: 'rgba(255,255,255,.55)', fontSize: 14, lineHeight: 1.9, marginBottom: 16 }}>
              Charles Beauty was born from a simple conviction: that luxury skincare should not be a privilege, but a right. We set out to create formulas so potent, so refined, that every woman who touches them feels the difference immediately.
            </p>
            <p style={{ color: 'rgba(255,255,255,.4)', fontSize: 13, lineHeight: 1.9, marginBottom: 40 }}>
              From our Parisian atelier, we blend time-honored botanical rituals with modern biotechnology — because your skin deserves nothing less than perfection.
            </p>
            <Link to="/" style={{ padding: '13px 32px', border: '1px solid rgba(255,215,0,.4)', color: '#FFD700', fontSize: 10, letterSpacing: '.2em', textTransform: 'uppercase', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 10, transition: 'all .3s' }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,215,0,.08)'; e.currentTarget.style.borderColor = 'rgba(255,215,0,.7)' }}
              onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = 'rgba(255,215,0,.4)' }}>
              Explore Collection <ArrowRight size={12} />
            </Link>
          </div>
        </div>
      </section>

      {/* ══ VALUES (new section) ═══════════════════════════════ */}
      <section ref={valRef} style={{ padding: '4rem 2rem 6rem', maxWidth: 1280, margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(min(100%,220px),1fr))', gap: 20 }}>
          {values.map(({ icon: Icon, title, desc }, i) => (
            <div key={title} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', padding: '2.2rem 1.5rem', border: '1px solid rgba(255,215,0,.12)', background: 'rgba(27,58,107,.55)', opacity: valVis ? 1 : 0, transform: valVis ? 'translateY(0)' : 'translateY(32px)', transition: `all .75s ease ${i * .18}s` }}>
              <div style={{ width: 50, height: 50, border: '1px solid rgba(255,215,0,.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 18, background: 'rgba(255,215,0,.06)', animation: `pulse 3.5s ease-in-out ${i * .8}s infinite` }}>
                <Icon size={19} color="#FFD700" />
              </div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 400, fontFamily: "'Cormorant Garamond',serif", color: '#fff', marginBottom: 10 }}>{title}</h3>
              <p style={{ color: 'rgba(255,255,255,.44)', fontSize: 11.5, lineHeight: 1.85 }}>{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ══ TIMELINE ═══════════════════════════════════════════ */}
      <section ref={timeRef} style={{ padding: '6rem 2rem 8rem', background: 'rgba(15,36,71,.85)', borderTop: '1px solid rgba(255,215,0,.08)', position: 'relative', overflow: 'hidden' }}>
        <FloatingOrbs />
        <div style={{ maxWidth: 900, margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <div style={{ textAlign: 'center', marginBottom: 72 }}>
            <div style={{ fontSize: 9, letterSpacing: '.45em', textTransform: 'uppercase', color: '#FFD700', marginBottom: 14 }}>Our Journey</div>
            <h2 style={{ fontSize: 'clamp(2rem,4vw,3.5rem)', fontWeight: 300, fontFamily: "'Cormorant Garamond',serif", color: '#fff' }}>A Decade of Radiance</h2>
          </div>

          {/* Vertical spine */}
          <div style={{ position: 'relative' }}>
            <div style={{ position: 'absolute', left: '50%', top: 0, bottom: 0, width: 1, background: 'linear-gradient(to bottom,transparent,rgba(255,215,0,.35),transparent)', transform: 'translateX(-50%)' }} />

            {milestones.map(({ year, title, desc }, i) => {
              const isLeft = i % 2 === 0
              return (
                <div key={year} style={{ display: 'flex', gap: 0, marginBottom: 52, alignItems: 'flex-start', opacity: timeVis ? 1 : 0, transform: timeVis ? 'translateX(0)' : `translateX(${isLeft ? '-32px' : '32px'})`, transition: `all .75s ease ${i * .15}s` }}>
                  {isLeft ? (
                    <>
                      <div style={{ flex: 1, textAlign: 'right', paddingRight: 36, paddingTop: 8 }}>
                        <h3 style={{ fontSize: '1.25rem', fontWeight: 400, fontFamily: "'Cormorant Garamond',serif", color: '#fff', marginBottom: 6 }}>{title}</h3>
                        <p style={{ color: 'rgba(255,255,255,.45)', fontSize: 12, lineHeight: 1.75 }}>{desc}</p>
                      </div>
                      <div style={{ flexShrink: 0, width: 60, height: 60, border: '1px solid #FFD700', background: 'rgba(27,58,107,.95)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1, boxShadow: '0 0 24px rgba(255,215,0,.15)' }}>
                        <span style={{ fontSize: 10, fontWeight: 600, color: '#FFD700', letterSpacing: '.08em' }}>{year}</span>
                      </div>
                      <div style={{ flex: 1 }} />
                    </>
                  ) : (
                    <>
                      <div style={{ flex: 1 }} />
                      <div style={{ flexShrink: 0, width: 60, height: 60, border: '1px solid #FFD700', background: 'rgba(27,58,107,.95)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1, boxShadow: '0 0 24px rgba(255,215,0,.15)' }}>
                        <span style={{ fontSize: 10, fontWeight: 600, color: '#FFD700', letterSpacing: '.08em' }}>{year}</span>
                      </div>
                      <div style={{ flex: 1, paddingLeft: 36, paddingTop: 8 }}>
                        <h3 style={{ fontSize: '1.25rem', fontWeight: 400, fontFamily: "'Cormorant Garamond',serif", color: '#fff', marginBottom: 6 }}>{title}</h3>
                        <p style={{ color: 'rgba(255,255,255,.45)', fontSize: 12, lineHeight: 1.75 }}>{desc}</p>
                      </div>
                    </>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ══ TEAM ═══════════════════════════════════════════════ */}
      <section ref={teamRef} style={{ padding: '6rem 2rem 8rem', position: 'relative', overflow: 'hidden' }}>
        <FloatingOrbs />
        <div style={{ maxWidth: 1280, margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <div style={{ textAlign: 'center', marginBottom: 60 }}>
            <div style={{ fontSize: 9, letterSpacing: '.45em', textTransform: 'uppercase', color: '#FFD700', marginBottom: 14 }}>Behind Charles Beauty</div>
            <h2 style={{ fontSize: 'clamp(2rem,4vw,3.5rem)', fontWeight: 300, fontFamily: "'Cormorant Garamond',serif", color: '#fff' }}>The Visionaries</h2>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))', gap: 28 }}>
            {team.map(({ name, role, img, bio }, i) => {
              const [hover, setHover] = useState(false)
              return (
                <div key={name}
                  onMouseEnter={() => setHover(true)}
                  onMouseLeave={() => setHover(false)}
                  style={{ border: `1px solid ${hover ? 'rgba(255,215,0,.5)' : 'rgba(255,215,0,.12)'}`, background: hover ? 'rgba(27,58,107,.8)' : 'rgba(27,58,107,.5)', overflow: 'hidden', opacity: teamVis ? 1 : 0, transform: teamVis ? (hover ? 'translateY(-8px)' : 'translateY(0)') : 'translateY(40px)', transition: `all .6s ease ${i * .15}s`, boxShadow: hover ? '0 32px 80px rgba(0,0,0,.5),0 0 40px rgba(255,215,0,.12)' : '0 8px 30px rgba(0,0,0,.3)', cursor: 'default' }}>
                  <div style={{ height: 320, overflow: 'hidden', position: 'relative' }}>
                    <img src={img} alt={name} style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top', filter: 'brightness(.85) saturate(1.05)', transform: hover ? 'scale(1.06)' : 'scale(1)', transition: 'transform .7s ease' }} />
                    <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top,rgba(27,58,107,.9) 0%,transparent 50%)' }} />
                  </div>
                  <div style={{ padding: '1.6rem' }}>
                    <h3 style={{ fontSize: '1.35rem', fontWeight: 400, fontFamily: "'Cormorant Garamond',serif", color: '#fff', marginBottom: 4 }}>{name}</h3>
                    <div style={{ color: '#FFD700', fontSize: 10, letterSpacing: '.18em', textTransform: 'uppercase', marginBottom: 14 }}>{role}</div>
                    <p style={{ color: 'rgba(255,255,255,.45)', fontSize: 12, lineHeight: 1.75 }}>{bio}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ══ CTA BANNER ════════════════════════════════════════ */}
      <section ref={ctaRef} style={{ padding: '6rem 2rem', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'url(https://images.pexels.com/photos/4041392/pexels-photo-4041392.jpeg?auto=compress&cs=tinysrgb&w=1600)', backgroundSize: 'cover', backgroundPosition: 'center', filter: 'brightness(.18)' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg,rgba(27,58,107,.92),rgba(255,215,0,.07))' }} />
        <div style={{ position: 'relative', zIndex: 1, textAlign: 'center', maxWidth: 560, margin: '0 auto', opacity: ctaVis ? 1 : 0, transform: ctaVis ? 'translateY(0)' : 'translateY(32px)', transition: 'all .85s ease' }}>
          <div style={{ fontSize: 9, letterSpacing: '.45em', textTransform: 'uppercase', color: '#FFD700', marginBottom: 18 }}>Join the Family</div>
          <h2 style={{ fontSize: 'clamp(1.8rem,5vw,3.4rem)', fontWeight: 300, fontFamily: "'Cormorant Garamond',serif", color: '#fff', lineHeight: 1.2, marginBottom: 18 }}>
            Ready to Discover{' '}
            <span style={{ background: 'linear-gradient(135deg,#FFD700,#FFEC99)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Your Glow?</span>
          </h2>
          <p style={{ color: 'rgba(255,255,255,.5)', fontSize: 13, lineHeight: 1.9, marginBottom: 36 }}>
            Explore our full collection and find the ritual that was made for your skin.
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/" style={{ padding: '14px 36px', background: 'linear-gradient(135deg,#FFD700,#FFE34D)', color: '#1B3A6B', fontSize: 10, letterSpacing: '.22em', textTransform: 'uppercase', textDecoration: 'none', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: 10 }}>
              Shop The Collection <ArrowRight size={12} />
            </Link>
          </div>
        </div>
      </section>

    </div>
  )
}