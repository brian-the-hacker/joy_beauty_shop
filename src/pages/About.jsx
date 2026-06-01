import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { Award, Users, Globe, Heart, ArrowRight, Sparkles, Leaf, Shield, Phone, Mail, CheckCircle } from 'lucide-react'
import Logo from '../components/Logo'

/* ── Keyframes ── */
const STYLES = `
  @keyframes fadeIn  { from { opacity:0 } to { opacity:1 } }
  @keyframes fadeUp  { from { opacity:0; transform:translateY(28px) } to { opacity:1; transform:translateY(0) } }
  @keyframes shimmer { to { background-position: 200% center } }
  @keyframes floatA  { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-14px)} }
  @keyframes orbDrift { 0%,100%{transform:translate(0,0) scale(1)} 40%{transform:translate(14px,-20px) scale(1.07)} 70%{transform:translate(-10px,8px) scale(0.94)} }
  @keyframes marquee { from{transform:translateX(0)} to{transform:translateX(-50%)} }
  @keyframes pulse   { 0%,100%{box-shadow:0 0 0 0 rgba(160,104,0,0)} 50%{box-shadow:0 0 24px 6px rgba(160,104,0,.1)} }
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

/* ── Visibility hook ── */
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

/* ── Floating orbs ── */
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
          background: 'radial-gradient(circle, rgba(160,104,0,.05) 0%, transparent 70%)',
          top: orb.top, left: orb.left, right: orb.right, bottom: orb.bottom,
          animation: `orbDrift ${orb.dur}s ease-in-out infinite`,
          animationDelay: `${i * -4}s`,
        }} />
      ))}
    </div>
  )
}

/* ── Data ── */
const stats = [
  { icon: Award,  value: '10+',  label: 'Product Lines' },
  { icon: Users,  value: '5+',   label: 'Hair Care Categories' },
  { icon: Globe,  value: '100%', label: 'Quality Controlled' },
  { icon: Heart,  value: '2015', label: 'Est. in Kenya' },
]

const values = [
  {
    icon: Shield,
    title: 'Quality',
    desc: 'We are committed to producing products that consistently meet high standards and customer expectations — in every batch, without compromise.',
  },
  {
    icon: Users,
    title: 'Accountability',
    desc: 'We believe in ownership, responsibility, and delivering on our commitments to customers, partners, and staff at every level.',
  },
  {
    icon: Sparkles,
    title: 'Innovation',
    desc: 'We continuously improve our products, processes, and customer experience to remain relevant and competitive in African hair care.',
  },
  {
    icon: Heart,
    title: 'Joy & Care',
    desc: 'We create a joyful, positive experience for both customers and employees by fostering a people-centered and respectful culture.',
  },
  {
    icon: Leaf,
    title: 'Integrity',
    desc: 'We value honesty, transparency, and ethical business practices in everything we do — with our customers, partners, and communities.',
  },
]

const processSteps = [
  {
    step: '01',
    title: 'Raw Material Selection',
    desc: 'We carefully select raw materials that meet our quality standards, ensuring the best possible inputs for every formulation.',
  },
  {
    step: '02',
    title: 'Consistent Formulation',
    desc: 'Standardised formulation processes ensure every batch delivers the same performance and results customers expect.',
  },
  {
    step: '03',
    title: 'Controlled Production',
    desc: 'Our manufacturing environment is carefully managed to ensure clean, consistent, and reliable output at every stage.',
  },
  {
    step: '04',
    title: 'Batch Monitoring',
    desc: 'Every production run is monitored throughout to identify and correct any inconsistencies before products are packaged.',
  },
  {
    step: '05',
    title: 'Clean Manufacturing',
    desc: 'We maintain clean, organised manufacturing practices to ensure product safety, integrity, and presentation at all times.',
  },
]

const categories = [
  {
    title: 'Hair Food & Treatments',
    desc: 'Nourishing treatments formulated to moisturize, strengthen, and support healthy hair growth and scalp maintenance.',
    products: ['Hair Food', 'Anti-Dandruff Hair Food', 'Menthol Leave-In Treatment', 'Activated Charcoal Leave-In Treatment'],
  },
  {
    title: 'Styling Products',
    desc: 'Hold, texture, definition, and finish for every hair type and style — from everyday braiding to natural curl definition.',
    products: ['Moulding Gel Wax (4 variants)', 'Braiding Gel', 'Styling Gel (Olive & Clear)', 'Curl Activator'],
  },
  {
    title: 'Scalp & Loc Care',
    desc: 'Targeted sprays formulated to refresh braids, moisturise locs, and support ongoing scalp health and care.',
    products: ['Black Castor Loc Spray', '4-in-1 Braid Spray', 'Anti-Dandruff Braid Spray'],
  },
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
  const hasSuffix = target.match(/[+%K]/)
  return (
    <span ref={ref}>
      {val}{hasSuffix ? target.match(/[+%K]/)?.[0] : ''}{suffix}
    </span>
  )
}

/* ════════════════════════════════════════════════════════════ */
export default function About() {
  const { ref: missionRef, vis: missionVis } = useVisible(0.08)
  const { ref: statsRef,   vis: statsVis   } = useVisible(0.08)
  const { ref: valRef,     vis: valVis     } = useVisible(0.08)
  const { ref: processRef, vis: processVis } = useVisible(0.08)
  const { ref: catRef,     vis: catVis     } = useVisible(0.08)
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
    <div style={{ background: '#ffffff', fontFamily: "'Montserrat', sans-serif", minHeight: '100vh' }}>

      {/* ══ HERO ══════════════════════════════════════════════ */}
      <section style={{ position: 'relative', height: '90vh', minHeight: 560, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: '-12%', backgroundImage: 'url(https://images.pexels.com/photos/3373745/pexels-photo-3373745.jpeg?auto=compress&cs=tinysrgb&w=1600)', backgroundSize: 'cover', backgroundPosition: 'center 30%', transform: `translate(${px * .35}px,${py * .35}px)`, transition: 'transform .08s linear', filter: 'brightness(.58)' }} />
        <div style={{ position: 'absolute', inset: 0, background: `radial-gradient(ellipse at ${50 + px * .4}% ${50 + py * .4}%, rgba(160,104,0,.1) 0%, transparent 62%)`, transition: 'background .08s linear' }} />
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(0,0,0,.04) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,.04) 1px, transparent 1px)', backgroundSize: '64px 64px' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, transparent 50%, #ffffff 100%)' }} />

        <FloatingOrbs />

        <div style={{ position: 'relative', zIndex: 2, textAlign: 'center', padding: '9rem 1.5rem 3rem', maxWidth: 860 }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 28, opacity: 0, animation: 'fadeIn 1s ease .2s forwards' }}>
            <Logo size={64} />
          </div>
          <div style={{ fontSize: 9, letterSpacing: '.5em', textTransform: 'uppercase', color: '#e8c870', marginBottom: 20, opacity: 0, animation: 'fadeIn 1s ease .4s forwards' }}>
            Wellstrend Creations Ltd. · Made in Kenya
          </div>
          <h1 style={{ fontSize: 'clamp(2.8rem, 9vw, 6.5rem)', fontWeight: 300, fontFamily: "'Cormorant Garamond', serif", lineHeight: 1.05, marginBottom: 20, opacity: 0, animation: 'fadeUp 1s ease .5s forwards' }}>
            <span style={{ display: 'block', color: '#fff' }}>The Story Behind</span>
            <span style={{ display: 'block', background: 'linear-gradient(135deg,#FFD700 0%,#FFEC99 50%,#FFD700 100%)', backgroundSize: '200% auto', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', animation: 'shimmer 4s linear infinite 1.5s' }}>
              Joi
            </span>
          </h1>
          <p style={{ color: 'rgba(255,255,255,.72)', fontSize: 'clamp(.85rem,2vw,1rem)', fontStyle: 'italic', letterSpacing: '.06em', maxWidth: 520, margin: '0 auto 2.8rem', opacity: 0, animation: 'fadeUp 1s ease .7s forwards' }}>
            "Unlocking Beauty, Spreading the Joi"
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap', opacity: 0, animation: 'fadeUp 1s ease .9s forwards' }}>
            <Link to="/" style={{ padding: '13px 32px', background: 'linear-gradient(135deg,#FFD700,#FFE34D)', color: '#1a1a1a', fontSize: 10, letterSpacing: '.22em', textTransform: 'uppercase', textDecoration: 'none', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: 10 }}>
              Our Products <ArrowRight size={12} />
            </Link>
            <a href="#mission" style={{ padding: '13px 32px', border: '1px solid rgba(255,215,0,.6)', color: '#FFD700', fontSize: 10, letterSpacing: '.22em', textTransform: 'uppercase', textDecoration: 'none' }}>
              Our Story
            </a>
          </div>
        </div>

        <div style={{ position: 'absolute', bottom: 32, left: '50%', transform: 'translateX(-50%)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 7, opacity: 0, animation: 'fadeIn 1s ease 1.6s forwards' }}>
          <span style={{ fontSize: 8.5, letterSpacing: '.35em', color: 'rgba(255,215,0,.7)', textTransform: 'uppercase' }}>Scroll</span>
          <div style={{ width: 1, height: 36, background: 'linear-gradient(to bottom, rgba(255,215,0,.7), transparent)', animation: 'blink 2s ease-in-out infinite' }} />
        </div>
      </section>

      {/* ══ MARQUEE ══════════════════════════════════════════ */}
      <div style={{ background: 'linear-gradient(90deg,#FFD700,#FFE34D,#FFEC99,#FFE34D,#FFD700)', padding: '12px 0', overflow: 'hidden' }}>
        <div style={{ display: 'flex', whiteSpace: 'nowrap', animation: 'marquee 30s linear infinite' }}>
          {Array(10).fill(0).map((_, i) => (
            <span key={i} style={{ fontSize: 9, letterSpacing: '.28em', textTransform: 'uppercase', color: '#1a1a1a', fontWeight: 600, paddingRight: 40 }}>
              Joi by Wellstrend &nbsp;&middot;&nbsp; Quality in Every Batch &nbsp;&middot;&nbsp; Made for African Hair &nbsp;&middot;&nbsp; Unlocking Beauty, Spreading the Joi &nbsp;&middot;&nbsp;
            </span>
          ))}
        </div>
      </div>

      {/* ══ STATS ════════════════════════════════════════════ */}
      <section ref={statsRef} style={{ background: '#f7f6f2', borderBottom: '1px solid #e8e2d8', padding: '5rem 2rem' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(180px,1fr))', gap: 32 }}>
          {stats.map(({ icon: Icon, value, label }, i) => (
            <div key={label} style={{ textAlign: 'center', padding: '2rem 1rem', opacity: statsVis ? 1 : 0, transform: statsVis ? 'translateY(0)' : 'translateY(24px)', transition: `all .65s ease ${i * .12}s` }}>
              <div style={{ width: 50, height: 50, border: '1px solid rgba(140,90,0,.35)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 18px', background: 'rgba(160,104,0,.06)', animation: `pulse 3.5s ease-in-out ${i * .8}s infinite` }}>
                <Icon size={19} color="#a06800" />
              </div>
              <div style={{ fontSize: '3rem', fontWeight: 300, fontFamily: "'Cormorant Garamond', serif", background: 'linear-gradient(135deg,#a06800,#c28a00)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', lineHeight: 1, marginBottom: 8 }}>
                {statsVis ? <Counter target={value} /> : '—'}
              </div>
              <div style={{ fontSize: 10, letterSpacing: '.18em', textTransform: 'uppercase', color: '#888' }}>{label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ══ WHO WE ARE + MISSION + VISION ════════════════════════ */}
      <section id="mission" ref={missionRef} style={{ padding: '8rem 2rem', maxWidth: 1280, margin: '0 auto', position: 'relative', overflow: 'hidden' }}>
        <FloatingOrbs />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(300px,1fr))', gap: '5rem', alignItems: 'center', position: 'relative', zIndex: 1, opacity: missionVis ? 1 : 0, transform: missionVis ? 'translateY(0)' : 'translateY(40px)', transition: 'all .9s ease' }}>

          {/* Image block */}
          <div style={{ position: 'relative' }}>
            <div style={{ position: 'absolute', top: -20, left: -20, right: 20, bottom: 20, border: '1px solid rgba(140,90,0,.2)', pointerEvents: 'none', zIndex: 0 }} />
            <img src="https://images.pexels.com/photos/3785147/pexels-photo-3785147.jpeg?auto=compress&cs=tinysrgb&w=800" alt="Manufacturing" style={{ width: '100%', height: 520, objectFit: 'cover', display: 'block', filter: 'brightness(.92) saturate(1.05)', position: 'relative', zIndex: 1 }} />
            {/* Est. badge */}
            <div style={{ position: 'absolute', bottom: -24, right: -24, width: 110, height: 110, background: 'linear-gradient(135deg,#FFD700,#FFE34D)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', zIndex: 2, boxShadow: '0 20px 60px rgba(0,0,0,.15)' }}>
              <span style={{ fontSize: '1.3rem', fontWeight: 600, fontFamily: "'Cormorant Garamond',serif", color: '#1a1a1a', lineHeight: 1 }}>Est.</span>
              <span style={{ fontSize: '1.5rem', fontWeight: 300, fontFamily: "'Cormorant Garamond',serif", color: '#1a1a1a', lineHeight: 1 }}>2015</span>
              <span style={{ fontSize: 7.5, letterSpacing: '.14em', textTransform: 'uppercase', color: '#1a1a1a', fontWeight: 700, textAlign: 'center', lineHeight: 1.4, marginTop: 2 }}>Made in<br />Kenya</span>
            </div>
          </div>

          {/* Text block */}
          <div>
            <div style={{ fontSize: 9, letterSpacing: '.45em', textTransform: 'uppercase', color: '#a06800', marginBottom: 20 }}>Who We Are</div>
            <h2 style={{ fontSize: 'clamp(1.8rem,3.5vw,3rem)', fontWeight: 300, fontFamily: "'Cormorant Garamond', serif", color: '#1a1a1a', lineHeight: 1.25, marginBottom: 20 }}>
              Manufacturing Beauty{' '}
              <span style={{ background: 'linear-gradient(135deg,#a06800,#c28a00)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>for Everyday Africa</span>
            </h2>
            <div style={{ width: 0, height: 1, background: '#a06800', marginBottom: 24, animation: missionVis ? 'lineGrow .8s ease .4s forwards' : 'none' }} />
            <p style={{ color: '#555', fontSize: 14, lineHeight: 1.9, marginBottom: 16 }}>
              Joi was created with the desire to make quality beauty and hair care products more accessible — delivering a joyful and positive experience around everyday self-care for African consumers.
            </p>
            <p style={{ color: '#777', fontSize: 13, lineHeight: 1.9, marginBottom: 32 }}>
              Our brand focuses on products designed for the African market, combining effective formulations, appealing presentation, and reliable quality. Beyond products, our goal is to build a trusted household brand that enriches everyday life through beauty, care, and meaningful customer experiences.
            </p>

            {/* Mission & Vision cards */}
            <div style={{ display: 'grid', gap: 16 }}>
              <div style={{ padding: '1.4rem 1.6rem', border: '1px solid rgba(140,90,0,.2)', background: '#faf9f6' }}>
                <div style={{ fontSize: 8, letterSpacing: '.3em', textTransform: 'uppercase', color: '#a06800', marginBottom: 8 }}>Our Mission</div>
                <p style={{ color: '#555', fontSize: 12.5, lineHeight: 1.8, fontStyle: 'italic' }}>
                  "To manufacture high-quality and affordable beauty and personal care products that bring joy, confidence, and satisfaction to everyday consumers."
                </p>
              </div>
              <div style={{ padding: '1.4rem 1.6rem', border: '1px solid rgba(140,90,0,.2)', background: '#faf9f6' }}>
                <div style={{ fontSize: 8, letterSpacing: '.3em', textTransform: 'uppercase', color: '#a06800', marginBottom: 8 }}>Our Vision</div>
                <p style={{ color: '#555', fontSize: 12.5, lineHeight: 1.8, fontStyle: 'italic' }}>
                  "To enrich everyday life through exceptional beauty products and become a leading African household beauty brand known for quality, innovation, trust, and positive impact."
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══ VALUES ════════════════════════════════════════════ */}
      <section ref={valRef} style={{ padding: '4rem 2rem 6rem', background: '#f7f6f2', borderTop: '1px solid #e8e2d8' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 52, opacity: valVis ? 1 : 0, transform: valVis ? 'none' : 'translateY(20px)', transition: 'all .7s' }}>
            <div style={{ fontSize: 9, letterSpacing: '.45em', textTransform: 'uppercase', color: '#a06800', marginBottom: 14 }}>What Guides Us</div>
            <h2 style={{ fontSize: 'clamp(2rem,4vw,3.5rem)', fontWeight: 300, fontFamily: "'Cormorant Garamond',serif", color: '#1a1a1a' }}>Our Values</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(min(100%,200px),1fr))', gap: 20 }}>
            {values.map(({ icon: Icon, title, desc }, i) => (
              <div key={title} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', padding: '2.2rem 1.5rem', border: '1px solid #e8e2d8', background: '#ffffff', opacity: valVis ? 1 : 0, transform: valVis ? 'translateY(0)' : 'translateY(32px)', transition: `all .75s ease ${i * .14}s` }}>
                <div style={{ width: 50, height: 50, border: '1px solid rgba(140,90,0,.35)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 18, background: 'rgba(160,104,0,.06)', animation: `pulse 3.5s ease-in-out ${i * .8}s infinite` }}>
                  <Icon size={19} color="#a06800" />
                </div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 400, fontFamily: "'Cormorant Garamond',serif", color: '#1a1a1a', marginBottom: 10 }}>{title}</h3>
                <p style={{ color: '#777', fontSize: 11.5, lineHeight: 1.85 }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ QUALITY & PROCESS ════════════════════════════════ */}
      <section ref={processRef} style={{ padding: '6rem 2rem 8rem', background: '#f0eeea', borderTop: '1px solid #e8e2d8', position: 'relative', overflow: 'hidden' }}>
        <FloatingOrbs />
        <div style={{ maxWidth: 1100, margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <div style={{ textAlign: 'center', marginBottom: 64 }}>
            <div style={{ fontSize: 9, letterSpacing: '.45em', textTransform: 'uppercase', color: '#a06800', marginBottom: 14 }}>Our Standards</div>
            <h2 style={{ fontSize: 'clamp(2rem,4vw,3.5rem)', fontWeight: 300, fontFamily: "'Cormorant Garamond',serif", color: '#1a1a1a', marginBottom: 14 }}>Quality at Every Step</h2>
            <p style={{ color: '#888', fontSize: 12, letterSpacing: '.06em', maxWidth: 480, margin: '0 auto' }}>
              Quality is a core part of the Joi brand. Every product we make goes through a rigorous process from start to finish.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 200px), 1fr))', gap: 24 }}>
            {processSteps.map(({ step, title, desc }, i) => (
              <div key={step} style={{
                padding: '2rem 1.8rem',
                border: '1px solid #e0dbd0',
                background: '#ffffff',
                position: 'relative',
                opacity: processVis ? 1 : 0,
                transform: processVis ? 'translateY(0)' : 'translateY(24px)',
                transition: `all .65s ease ${i * .12}s`,
              }}>
                <div style={{ fontSize: '3rem', fontWeight: 300, fontFamily: "'Cormorant Garamond',serif", background: 'linear-gradient(135deg,#a06800,#c28a00)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', lineHeight: 1, marginBottom: 14 }}>
                  {step}
                </div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 400, fontFamily: "'Cormorant Garamond',serif", color: '#1a1a1a', marginBottom: 10 }}>{title}</h3>
                <p style={{ color: '#777', fontSize: 12, lineHeight: 1.8 }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ PRODUCT CATEGORIES ════════════════════════════════ */}
      <section ref={catRef} style={{ padding: '6rem 2rem 8rem', position: 'relative', overflow: 'hidden', background: '#ffffff' }}>
        <FloatingOrbs />
        <div style={{ maxWidth: 1280, margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <div style={{ textAlign: 'center', marginBottom: 60 }}>
            <div style={{ fontSize: 9, letterSpacing: '.45em', textTransform: 'uppercase', color: '#a06800', marginBottom: 14 }}>What We Manufacture</div>
            <h2 style={{ fontSize: 'clamp(2rem,4vw,3.5rem)', fontWeight: 300, fontFamily: "'Cormorant Garamond',serif", color: '#1a1a1a', marginBottom: 14 }}>Our Product Range</h2>
            <p style={{ color: '#888', fontSize: 12, letterSpacing: '.06em', maxWidth: 420, margin: '0 auto' }}>
              Joi continues to innovate and expand its portfolio to meet evolving African hair care needs.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))', gap: 28 }}>
            {categories.map(({ title, desc, products }, i) => (
              <div key={title} style={{
                border: '1px solid #e0dbd0',
                background: '#faf9f6',
                overflow: 'hidden',
                opacity: catVis ? 1 : 0,
                transform: catVis ? 'translateY(0)' : 'translateY(40px)',
                transition: `all .65s ease ${i * .15}s`,
              }}>
                <div style={{ padding: '2rem 2rem 0' }}>
                  <div style={{ width: 40, height: 40, border: '1px solid rgba(140,90,0,.35)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16, background: 'rgba(160,104,0,.06)' }}>
                    <Sparkles size={16} color="#a06800" />
                  </div>
                  <h3 style={{ fontSize: '1.3rem', fontWeight: 400, fontFamily: "'Cormorant Garamond',serif", color: '#1a1a1a', marginBottom: 10 }}>{title}</h3>
                  <p style={{ color: '#666', fontSize: 12, lineHeight: 1.75, marginBottom: 20 }}>{desc}</p>
                </div>
                <div style={{ padding: '0 2rem 2rem', borderTop: '1px solid #e8e2d8', paddingTop: '1.2rem', marginTop: 0 }}>
                  <div style={{ fontSize: 8, letterSpacing: '.2em', textTransform: 'uppercase', color: 'rgba(140,90,0,.6)', marginBottom: 12 }}>Products Include</div>
                  {products.map(p => (
                    <div key={p} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: 8 }}>
                      <CheckCircle size={12} color="#a06800" style={{ flexShrink: 0, marginTop: 1 }} />
                      <span style={{ color: '#666', fontSize: 11.5, lineHeight: 1.5 }}>{p}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div style={{ textAlign: 'center', marginTop: 44 }}>
            <Link to="/" style={{ padding: '13px 36px', border: '1px solid rgba(140,90,0,.35)', color: '#a06800', fontSize: 10, letterSpacing: '.22em', textTransform: 'uppercase', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 10, transition: 'all .3s', fontFamily: "'Montserrat',sans-serif" }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(160,104,0,.07)'; e.currentTarget.style.borderColor = 'rgba(140,90,0,.6)' }}
              onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = 'rgba(140,90,0,.35)' }}>
              View All Products <ArrowRight size={12} />
            </Link>
          </div>
        </div>
      </section>

      {/* ══ CTA BANNER ════════════════════════════════════════ */}
      <section ref={ctaRef} style={{ padding: '6rem 2rem', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'url(https://images.pexels.com/photos/4041392/pexels-photo-4041392.jpeg?auto=compress&cs=tinysrgb&w=1600)', backgroundSize: 'cover', backgroundPosition: 'center', filter: 'brightness(.55)' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, rgba(255,250,240,.1), rgba(160,104,0,.08))' }} />
        <div style={{ position: 'relative', zIndex: 1, textAlign: 'center', maxWidth: 580, margin: '0 auto', opacity: ctaVis ? 1 : 0, transform: ctaVis ? 'translateY(0)' : 'translateY(32px)', transition: 'all .85s ease' }}>
          <div style={{ fontSize: 9, letterSpacing: '.45em', textTransform: 'uppercase', color: '#e8c870', marginBottom: 18 }}>Stock Joi Products</div>
          <h2 style={{ fontSize: 'clamp(1.8rem,5vw,3.4rem)', fontWeight: 300, fontFamily: "'Cormorant Garamond',serif", color: '#fff', lineHeight: 1.2, marginBottom: 18 }}>
            Ready to Bring Joi to{' '}
            <span style={{ background: 'linear-gradient(135deg,#FFD700,#FFEC99)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Your Customers?</span>
          </h2>
          <p style={{ color: 'rgba(255,255,255,.72)', fontSize: 13, lineHeight: 1.9, marginBottom: 36 }}>
            Whether you're a retailer, salon owner, or distributor, we'd love to work with you. Get in touch to learn more about our product range and how we can partner.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20 }}>
            <div style={{ display: 'flex', gap: 28, flexWrap: 'wrap', justifyContent: 'center' }}>
              <a href="tel:0748635395" style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'rgba(255,255,255,.75)', fontSize: 13, textDecoration: 'none', transition: 'color .25s' }}
                onMouseEnter={e => e.currentTarget.style.color = '#FFD700'}
                onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,.75)'}>
                <Phone size={14} color="#FFD700" />
                0748 635 395
              </a>
              <a href="mailto:Wellssolutions2015@gmail.com" style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'rgba(255,255,255,.75)', fontSize: 13, textDecoration: 'none', transition: 'color .25s' }}
                onMouseEnter={e => e.currentTarget.style.color = '#FFD700'}
                onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,.75)'}>
                <Mail size={14} color="#FFD700" />
                Wellssolutions2015@gmail.com
              </a>
            </div>
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: 'center' }}>
              <a href="mailto:Wellssolutions2015@gmail.com" style={{ padding: '14px 36px', background: 'linear-gradient(135deg,#FFD700,#FFE34D)', color: '#1a1a1a', fontSize: 10, letterSpacing: '.22em', textTransform: 'uppercase', textDecoration: 'none', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: 10, transition: 'transform .3s' }}
                onMouseEnter={e => (e.currentTarget.style.transform = 'translateY(-2px)')}
                onMouseLeave={e => (e.currentTarget.style.transform = 'none')}>
                Get In Touch <ArrowRight size={12} />
              </a>
              <Link to="/" style={{ padding: '14px 28px', border: '1px solid rgba(255,215,0,.5)', color: '#FFD700', fontSize: 10, letterSpacing: '.22em', textTransform: 'uppercase', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 10, transition: 'all .3s' }}
                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,215,0,.1)'; e.currentTarget.style.borderColor = 'rgba(255,215,0,.8)' }}
                onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = 'rgba(255,215,0,.5)' }}>
                Our Products
              </Link>
            </div>
          </div>
        </div>
      </section>

    </div>
  )
}