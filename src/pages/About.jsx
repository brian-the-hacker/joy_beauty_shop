import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { Award, Users, Globe, Heart, ArrowRight, Sparkles, Leaf, Shield, Phone, Mail, CheckCircle } from 'lucide-react'
import logoImg from '../assets/logo.png'

/* ── Brand colours ── */
const NAVY   = '#1B3A6B'
const GOLD_D = '#C9973A'
const GOLD_L = '#FFD700'

/* ── Keyframes ── */
const STYLES = `
  @keyframes fadeIn  { from{opacity:0} to{opacity:1} }
  @keyframes fadeUp  { from{opacity:0;transform:translateY(28px)} to{opacity:1;transform:translateY(0)} }
  @keyframes shimmer { to{background-position:200% center} }
  @keyframes floatA  { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-14px)} }
  @keyframes orbDrift { 0%,100%{transform:translate(0,0) scale(1)} 40%{transform:translate(14px,-20px) scale(1.07)} 70%{transform:translate(-10px,8px) scale(0.94)} }
  @keyframes marquee { from{transform:translateX(0)} to{transform:translateX(-50%)} }
  @keyframes pulse   { 0%,100%{box-shadow:0 0 0 0 rgba(201,151,58,0)} 50%{box-shadow:0 0 24px 6px rgba(201,151,58,.2)} }
  @keyframes blink   { 0%,100%{opacity:.35} 50%{opacity:1} }
  @keyframes lineGrow { from{width:0} to{width:40px} }
  @keyframes countUp { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
  @keyframes spin    { to{transform:rotate(360deg)} }
`
let injected = false
function injectStyles() {
  if (injected || typeof document === 'undefined') return
  const el = document.createElement('style'); el.textContent = STYLES
  document.head.appendChild(el); injected = true
}

/* ── Visibility hook ── */
function useVisible(threshold = 0.1) {
  const ref = useRef(null); const [vis, setVis] = useState(false)
  useEffect(() => {
    const el = ref.current; if (!el) return
    const o = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVis(true); o.disconnect() } }, { threshold })
    o.observe(el); return () => o.disconnect()
  }, [threshold])
  return { ref, vis }
}

/* ── Orbs for light sections ── */
function LightOrbs() {
  return (
    <div style={{ position:'absolute', inset:0, pointerEvents:'none', overflow:'hidden', zIndex:0 }}>
      {[{ size:320, top:'5%', left:'-8%', dur:16 }, { size:200, top:'55%', right:'-5%', dur:20 }, { size:140, top:'25%', right:'10%', dur:13 }].map((o, i) => (
        <div key={i} style={{ position:'absolute', width:o.size, height:o.size, borderRadius:'50%', background:'radial-gradient(circle,rgba(27,58,107,.05) 0%,transparent 70%)', top:o.top, left:o.left, right:o.right, bottom:o.bottom, animation:`orbDrift ${o.dur}s ease-in-out infinite`, animationDelay:`${i*-4}s` }} />
      ))}
    </div>
  )
}

/* ── Orbs for dark sections ── */
function DarkOrbs() {
  return (
    <div style={{ position:'absolute', inset:0, pointerEvents:'none', overflow:'hidden', zIndex:0 }}>
      {[{ size:380, top:'5%', left:'-10%', dur:16 }, { size:240, top:'55%', right:'-6%', dur:20 }, { size:160, top:'25%', right:'12%', dur:13 }].map((o, i) => (
        <div key={i} style={{ position:'absolute', width:o.size, height:o.size, borderRadius:'50%', background:'radial-gradient(circle,rgba(255,215,0,.08) 0%,transparent 70%)', top:o.top, left:o.left, right:o.right, bottom:o.bottom, animation:`orbDrift ${o.dur}s ease-in-out infinite`, animationDelay:`${i*-4}s` }} />
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
  { icon: Shield,   title: 'Quality',       desc: 'We are committed to producing products that consistently meet high standards and customer expectations.' },
  { icon: Users,    title: 'Accountability', desc: 'We believe in ownership, responsibility, and delivering on our commitments to customers, partners, and staff.' },
  { icon: Sparkles, title: 'Innovation',     desc: 'We continuously improve our products, processes, and customer experience to remain relevant and competitive.' },
  { icon: Heart,    title: 'Joy & Care',     desc: 'We aim to create a joyful experience for both customers and employees by fostering a positive, respectful, and people-centered culture.' },
  { icon: Leaf,     title: 'Integrity',      desc: 'We value honesty, transparency, and ethical business practices in everything we do.' },
]

const processSteps = [
  { step:'01', title:'Raw Material Selection',   desc:'We carefully select raw materials that meet our quality standards, ensuring the best possible inputs for every formulation.' },
  { step:'02', title:'Consistent Formulation',   desc:'Standardised processes ensure every batch delivers the same performance and results that customers expect.' },
  { step:'03', title:'Controlled Production',    desc:'Our manufacturing environment is carefully managed to ensure clean, consistent, and reliable output at every stage.' },
  { step:'04', title:'Batch Monitoring',         desc:'Every production run is monitored throughout to identify and correct any inconsistencies before products are packaged.' },
  { step:'05', title:'Clean Manufacturing',      desc:'We maintain clean, organised manufacturing practices to ensure product safety, integrity, and presentation at all times.' },
]

const categories = [
  { title:'Hair Food & Treatments', desc:'Nourishing treatments formulated to moisturize, strengthen, and support healthy hair growth and scalp maintenance.', products:['Hair Food', 'Anti-Dandruff Hair Food', 'Menthol Leave-In Treatment', 'Activated Charcoal Leave-In Treatment'] },
  { title:'Styling Products',       desc:'Hold, texture, definition, and finish for every hair type — from everyday braiding to natural curl definition.', products:['Moulding Gel Wax (4 variants)', 'Braiding Gel', 'Styling Gel (Olive & Clear)', 'Curl Activator'] },
  { title:'Scalp & Loc Care',       desc:'Targeted sprays to refresh braids, moisturise locs, and support ongoing scalp health and care.', products:['Black Castor Loc Spray', '4-in-1 Braid Spray', 'Anti-Dandruff Braid Spray'] },
]

/* ── Animated counter ── */
function Counter({ target }) {
  const [val, setVal] = useState(0); const { ref, vis } = useVisible(0.3)
  useEffect(() => {
    if (!vis) return
    const num = parseFloat(target.replace(/[^0-9.]/g, '')); let start = null; const dur = 1400
    const step = ts => { if (!start) start = ts; const p = Math.min((ts-start)/dur,1); const e = 1-Math.pow(1-p,3); setVal(Math.round(num*e)); if (p<1) requestAnimationFrame(step) }
    requestAnimationFrame(step)
  }, [vis, target])
  const hasSuffix = target.match(/[+%K]/)
  return <span ref={ref}>{val}{hasSuffix ? target.match(/[+%K]/)?.[0] : ''}</span>
}

/* ════════════════════════════════════════════════════════════ */
export default function About() {
  const { ref: missionRef, vis: missionVis } = useVisible(0.08)
  const { ref: statsRef,   vis: statsVis   } = useVisible(0.08)
  const { ref: valRef,     vis: valVis     } = useVisible(0.08)
  const { ref: processRef, vis: processVis } = useVisible(0.08)
  const { ref: catRef,     vis: catVis     } = useVisible(0.08)
  const { ref: ctaRef,     vis: ctaVis     } = useVisible(0.08)
  const [mouse, setMouse] = useState({ x:.5, y:.5 })

  useEffect(() => { injectStyles(); window.scrollTo(0,0) }, [])
  useEffect(() => {
    const mv = e => setMouse({ x: e.clientX/window.innerWidth, y: e.clientY/window.innerHeight })
    window.addEventListener('mousemove', mv); return () => window.removeEventListener('mousemove', mv)
  }, [])
  const px = (mouse.x-.5)*16, py = (mouse.y-.5)*16

  return (
    <div style={{ background:'#ffffff', fontFamily:"'Montserrat', sans-serif", minHeight:'100vh' }}>

      {/* ══ HERO (dark) ══════════════════════════════════════ */}
      <section style={{ position:'relative', height:'90vh', minHeight:560, display:'flex', alignItems:'center', justifyContent:'center', overflow:'hidden' }}>
        <div style={{ position:'absolute', inset:'-12%', backgroundImage:'url(https://images.pexels.com/photos/3373745/pexels-photo-3373745.jpeg?auto=compress&cs=tinysrgb&w=1600)', backgroundSize:'cover', backgroundPosition:'center 30%', transform:`translate(${px*.35}px,${py*.35}px)`, transition:'transform .08s linear', filter:'brightness(.2)' }} />
        <div style={{ position:'absolute', inset:0, background:`radial-gradient(ellipse at ${50+px*.4}% ${50+py*.4}%,rgba(255,215,0,.13) 0%,transparent 62%)`, transition:'background .08s linear' }} />
        <div style={{ position:'absolute', inset:0, backgroundImage:'linear-gradient(rgba(255,215,0,.025) 1px,transparent 1px),linear-gradient(90deg,rgba(255,215,0,.025) 1px,transparent 1px)', backgroundSize:'64px 64px' }} />
        <div style={{ position:'absolute', inset:0, background:'linear-gradient(to bottom,transparent 50%,#fff 100%)' }} />
        <DarkOrbs />
        <div style={{ position:'relative', zIndex:2, textAlign:'center', padding:'9rem 1.2rem 3rem', maxWidth:820 }}>
          {/* Hero centre logo */}
          <div style={{ display:'flex', justifyContent:'center', marginBottom:20, marginTop:'-15rem', opacity:0, animation:'fadeIn 1s ease .1s forwards' }}>
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
          <div style={{ fontSize:9, letterSpacing:'.5em', textTransform:'uppercase', color:GOLD_L, marginBottom:20, opacity:0, animation:'fadeIn 1s ease .4s forwards' }}>Wellstrend Creations Ltd. · Made in Kenya</div>
          <h1 style={{ fontSize:'clamp(2.8rem,9vw,6.5rem)', fontWeight:300, fontFamily:"'Cormorant Garamond',serif", lineHeight:1.05, marginBottom:20, opacity:0, animation:'fadeUp 1s ease .5s forwards' }}>
            <span style={{ display:'block', color:'#fff' }}>The Story Behind</span>
            <span style={{ display:'block', background:'linear-gradient(135deg,#FFD700 0%,#FFEC99 50%,#FFD700 100%)', backgroundSize:'200% auto', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', animation:'shimmer 4s linear infinite 1.5s' }}>Joi</span>
          </h1>
          <p style={{ color:'rgba(255,255,255,.55)', fontSize:'clamp(.85rem,2vw,1rem)', fontStyle:'italic', letterSpacing:'.06em', maxWidth:520, margin:'0 auto 2.8rem', opacity:0, animation:'fadeUp 1s ease .7s forwards' }}>"Unlocking Beauty, Spreading the Joi"</p>
          <div style={{ display:'flex', gap:12, justifyContent:'center', flexWrap:'wrap', opacity:0, animation:'fadeUp 1s ease .9s forwards' }}>
            <Link to="/" style={{ padding:'13px 32px', background:`linear-gradient(135deg,${GOLD_L},#FFE34D)`, color:NAVY, fontSize:10, letterSpacing:'.22em', textTransform:'uppercase', textDecoration:'none', fontWeight:600, display:'inline-flex', alignItems:'center', gap:10 }}>Our Products <ArrowRight size={12} /></Link>
            <a href="#mission" style={{ padding:'13px 32px', border:'1px solid rgba(255,215,0,.5)', color:GOLD_L, fontSize:10, letterSpacing:'.22em', textTransform:'uppercase', textDecoration:'none' }}>Our Story</a>
          </div>
        </div>
        <div style={{ position:'absolute', bottom:32, left:'50%', transform:'translateX(-50%)', display:'flex', flexDirection:'column', alignItems:'center', gap:7, opacity:0, animation:'fadeIn 1s ease 1.6s forwards' }}>
          <span style={{ fontSize:8.5, letterSpacing:'.35em', color:'rgba(255,215,0,.55)', textTransform:'uppercase' }}>Scroll</span>
          <div style={{ width:1, height:36, background:'linear-gradient(to bottom,rgba(255,215,0,.6),transparent)', animation:'blink 2s ease-in-out infinite' }} />
        </div>
      </section>

      {/* ══ MARQUEE ══════════════════════════════════════════ */}
      <div style={{ background:`linear-gradient(90deg,${GOLD_L},#FFE34D,#FFEC99,#FFE34D,${GOLD_L})`, padding:'12px 0', overflow:'hidden' }}>
        <div style={{ display:'flex', whiteSpace:'nowrap', animation:'marquee 30s linear infinite' }}>
          {Array(10).fill(0).map((_,i) => (
            <span key={i} style={{ fontSize:9, letterSpacing:'.28em', textTransform:'uppercase', color:NAVY, fontWeight:600, paddingRight:40 }}>
              Joi by Wellstrend &nbsp;&middot;&nbsp; Quality in Every Batch &nbsp;&middot;&nbsp; Made for African Hair &nbsp;&middot;&nbsp; Unlocking Beauty, Spreading the Joi &nbsp;&middot;&nbsp;
            </span>
          ))}
        </div>
      </div>

      {/* ══ STATS (white) ════════════════════════════════════ */}
      <section ref={statsRef} style={{ background:'#F8F6F1', borderBottom:'1px solid rgba(27,58,107,.07)', padding:'5rem 2rem' }}>
        <div style={{ maxWidth:1280, margin:'0 auto', display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(180px,1fr))', gap:32 }}>
          {stats.map(({ icon:Icon, value, label }, i) => (
            <div key={label} style={{ textAlign:'center', padding:'2rem 1rem', opacity:statsVis?1:0, transform:statsVis?'translateY(0)':'translateY(24px)', transition:`all .65s ease ${i*.12}s` }}>
              <div style={{ width:52, height:52, border:`1px solid rgba(201,151,58,.5)`, display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 18px', background:'rgba(201,151,58,.06)', borderRadius:4, animation:`pulse 3.5s ease-in-out ${i*.8}s infinite` }}>
                <Icon size={20} color={GOLD_D} />
              </div>
              <div style={{ fontSize:'3rem', fontWeight:300, fontFamily:"'Cormorant Garamond',serif", color:NAVY, lineHeight:1, marginBottom:8 }}>
                {statsVis ? <Counter target={value} /> : '—'}
              </div>
              <div style={{ fontSize:10, letterSpacing:'.18em', textTransform:'uppercase', color:'rgba(27,58,107,.5)' }}>{label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ══ WHO WE ARE + MISSION + VISION (white) ════════════ */}
      <section id="mission" ref={missionRef} style={{ padding:'8rem 2rem', maxWidth:1280, margin:'0 auto', position:'relative', overflow:'hidden' }}>
        <LightOrbs />
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(300px,1fr))', gap:'5rem', alignItems:'center', position:'relative', zIndex:1, opacity:missionVis?1:0, transform:missionVis?'translateY(0)':'translateY(40px)', transition:'all .9s ease' }}>
          {/* Image */}
          <div style={{ position:'relative' }}>
            <div style={{ position:'absolute', top:-20, left:-20, right:20, bottom:20, border:`1px solid rgba(201,151,58,.25)`, pointerEvents:'none', zIndex:0 }} />
            <img src="https://images.pexels.com/photos/3785147/pexels-photo-3785147.jpeg?auto=compress&cs=tinysrgb&w=800" alt="Manufacturing" style={{ width:'100%', height:520, objectFit:'cover', display:'block', filter:'brightness(.88) saturate(1.1)', position:'relative', zIndex:1 }} />
            <div style={{ position:'absolute', bottom:-24, right:-24, width:110, height:110, background:`linear-gradient(135deg,${GOLD_D},${GOLD_L})`, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', zIndex:2, boxShadow:'0 20px 60px rgba(0,0,0,.2)' }}>
              <span style={{ fontSize:'1.3rem', fontWeight:600, fontFamily:"'Cormorant Garamond',serif", color:NAVY, lineHeight:1 }}>Est.</span>
              <span style={{ fontSize:'1.5rem', fontWeight:300, fontFamily:"'Cormorant Garamond',serif", color:NAVY, lineHeight:1 }}>2015</span>
              <span style={{ fontSize:7.5, letterSpacing:'.14em', textTransform:'uppercase', color:NAVY, fontWeight:700, textAlign:'center', lineHeight:1.4, marginTop:2 }}>Made in<br />Kenya</span>
            </div>
          </div>
          {/* Text */}
          <div>
            <div style={{ fontSize:9, letterSpacing:'.45em', textTransform:'uppercase', color:GOLD_D, marginBottom:20 }}>Who We Are</div>
            <h2 style={{ fontSize:'clamp(1.8rem,3.5vw,3rem)', fontWeight:300, fontFamily:"'Cormorant Garamond',serif", color:NAVY, lineHeight:1.25, marginBottom:20 }}>
              Manufacturing Beauty for{' '}
              <span style={{ background:`linear-gradient(135deg,${GOLD_D},${GOLD_L})`, WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>Everyday Africa</span>
            </h2>
            <div style={{ width:0, height:2, background:GOLD_D, marginBottom:24, animation:missionVis?'lineGrow .8s ease .4s forwards':'none' }} />
            <p style={{ color:'rgba(27,58,107,.65)', fontSize:14, lineHeight:1.9, marginBottom:16 }}>
              Joi began with a simple but powerful observation: African consumers deserved quality beauty and hair care products that truly understood their needs — without the premium price tag that so often comes with it.
            </p>
            <p style={{ color:'rgba(27,58,107,.5)', fontSize:13, lineHeight:1.9, marginBottom:16 }}>
              Founded in Kenya under Wellstrend Creations Ltd., every Joi product is built from the ground up with African hair at the centre of every formulation decision. From raw material selection to texture, fragrance, and finish — the African consumer experience was never an afterthought. It was the starting point.
            </p>
            <p style={{ color:'rgba(27,58,107,.5)', fontSize:13, lineHeight:1.9, marginBottom:16 }}>
              The name says it all. Not just a brand — a feeling. The joy of a good hair day, the confidence of a well-maintained look, the satisfaction of a product that does exactly what it promises. That feeling is what we set out to manufacture.
            </p>
            <p style={{ color:'rgba(27,58,107,.5)', fontSize:13, lineHeight:1.9, marginBottom:32 }}>
              Today, Joi manufactures a growing range of hair food, styling, and scalp care products — each held to consistent quality standards across every batch. We believe quality should be repeatable, not occasional. That's why our manufacturing process is built around systems, not shortcuts. We're building something bigger than a product line — we're building the kind of brand that sits on the shelf in every home across Africa, trusted, familiar, and loved.
            </p>
            <div style={{ display:'grid', gap:16 }}>
              {/* Mission */}
              <div style={{ padding:'1.4rem 1.6rem', border:`1px solid rgba(201,151,58,.3)`, background:'rgba(201,151,58,.04)', borderRadius:4 }}>
                <div style={{ fontSize:8, letterSpacing:'.3em', textTransform:'uppercase', color:GOLD_D, marginBottom:8 }}>Our Mission</div>
                <p style={{ color:'rgba(27,58,107,.7)', fontSize:12.5, lineHeight:1.8, fontStyle:'italic', marginBottom:8 }}>
                  "To manufacture high-quality and affordable beauty and personal care products that bring joy, confidence, and satisfaction to everyday consumers."
                </p>
                <p style={{ color:'rgba(27,58,107,.55)', fontSize:12, lineHeight:1.8, margin:0 }}>
                  We are committed to creating products that combine quality, consistency, accessibility, and a positive customer experience.
                </p>
              </div>
              {/* Vision */}
              <div style={{ padding:'1.4rem 1.6rem', border:`1px solid rgba(201,151,58,.3)`, background:'rgba(201,151,58,.04)', borderRadius:4 }}>
                <div style={{ fontSize:8, letterSpacing:'.3em', textTransform:'uppercase', color:GOLD_D, marginBottom:8 }}>Our Vision</div>
                <p style={{ color:'rgba(27,58,107,.7)', fontSize:12.5, lineHeight:1.8, fontStyle:'italic', marginBottom:8 }}>
                  "To enrich everyday life through exceptional beauty products, inspiring workplaces, and joyful customer experiences."
                </p>
                <p style={{ color:'rgba(27,58,107,.55)', fontSize:12, lineHeight:1.8, margin:0 }}>
                  We envision Joi becoming a leading African household beauty brand known for quality, innovation, trust, and positive impact on customers, employees, and communities.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══ VALUES (light warm) ════════════════════════════════ */}
      <section ref={valRef} style={{ padding:'5rem 2rem 6rem', background:'#F8F6F1', borderTop:'1px solid rgba(27,58,107,.06)' }}>
        <div style={{ maxWidth:1280, margin:'0 auto' }}>
          <div style={{ textAlign:'center', marginBottom:52, opacity:valVis?1:0, transform:valVis?'none':'translateY(20px)', transition:'all .7s' }}>
            <div style={{ fontSize:9, letterSpacing:'.45em', textTransform:'uppercase', color:GOLD_D, marginBottom:14 }}>What Guides Us</div>
            <h2 style={{ fontSize:'clamp(2rem,4vw,3.5rem)', fontWeight:300, fontFamily:"'Cormorant Garamond',serif", color:NAVY }}>Our Values</h2>
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(min(100%,200px),1fr))', gap:20 }}>
            {values.map(({ icon:Icon, title, desc }, i) => (
              <div key={title} style={{ display:'flex', flexDirection:'column', alignItems:'center', textAlign:'center', padding:'2.4rem 1.6rem', border:'1px solid rgba(27,58,107,.1)', background:'#ffffff', borderRadius:6, boxShadow:'0 4px 20px rgba(27,58,107,.07)', opacity:valVis?1:0, transform:valVis?'translateY(0)':'translateY(32px)', transition:`all .75s ease ${i*.14}s` }}>
                <div style={{ width:52, height:52, border:`1px solid rgba(201,151,58,.5)`, display:'flex', alignItems:'center', justifyContent:'center', marginBottom:18, background:'rgba(201,151,58,.06)', borderRadius:4, animation:`pulse 3.5s ease-in-out ${i*.8}s infinite` }}>
                  <Icon size={20} color={GOLD_D} />
                </div>
                <h3 style={{ fontSize:'1.1rem', fontWeight:400, fontFamily:"'Cormorant Garamond',serif", color:NAVY, marginBottom:10 }}>{title}</h3>
                <p style={{ color:'rgba(27,58,107,.55)', fontSize:12, lineHeight:1.85 }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ QUALITY & PROCESS (white) ═════════════════════════ */}
      <section ref={processRef} style={{ padding:'6rem 2rem 8rem', background:'#ffffff', borderTop:'1px solid rgba(27,58,107,.06)', position:'relative', overflow:'hidden' }}>
        <LightOrbs />
        <div style={{ maxWidth:1100, margin:'0 auto', position:'relative', zIndex:1 }}>
          <div style={{ textAlign:'center', marginBottom:64 }}>
            <div style={{ fontSize:9, letterSpacing:'.45em', textTransform:'uppercase', color:GOLD_D, marginBottom:14 }}>Our Standards</div>
            <h2 style={{ fontSize:'clamp(2rem,4vw,3.5rem)', fontWeight:300, fontFamily:"'Cormorant Garamond',serif", color:NAVY, marginBottom:14 }}>Quality at Every Step</h2>
            <p style={{ color:'rgba(27,58,107,.45)', fontSize:12, letterSpacing:'.06em', maxWidth:480, margin:'0 auto' }}>Quality is a core part of the Joi brand. Every product we make goes through a rigorous process from start to finish.</p>
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(min(100%,200px),1fr))', gap:24 }}>
            {processSteps.map(({ step, title, desc }, i) => (
              <div key={step} style={{ padding:'2rem 1.8rem', border:'1px solid rgba(27,58,107,.1)', background:'#ffffff', borderRadius:6, boxShadow:'0 4px 20px rgba(27,58,107,.07)', opacity:processVis?1:0, transform:processVis?'translateY(0)':'translateY(24px)', transition:`all .65s ease ${i*.12}s` }}>
                <div style={{ fontSize:'3rem', fontWeight:300, fontFamily:"'Cormorant Garamond',serif", color:GOLD_D, lineHeight:1, marginBottom:14 }}>{step}</div>
                <h3 style={{ fontSize:'1.1rem', fontWeight:400, fontFamily:"'Cormorant Garamond',serif", color:NAVY, marginBottom:10 }}>{title}</h3>
                <p style={{ color:'rgba(27,58,107,.5)', fontSize:12, lineHeight:1.8 }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ PRODUCT CATEGORIES (warm white) ══════════════════ */}
      <section ref={catRef} style={{ padding:'6rem 2rem 8rem', background:'#F0F4FB', borderTop:'1px solid rgba(27,58,107,.06)', position:'relative', overflow:'hidden' }}>
        <LightOrbs />
        <div style={{ maxWidth:1280, margin:'0 auto', position:'relative', zIndex:1 }}>
          <div style={{ textAlign:'center', marginBottom:60 }}>
            <div style={{ fontSize:9, letterSpacing:'.45em', textTransform:'uppercase', color:GOLD_D, marginBottom:14 }}>What We Manufacture</div>
            <h2 style={{ fontSize:'clamp(2rem,4vw,3.5rem)', fontWeight:300, fontFamily:"'Cormorant Garamond',serif", color:NAVY, marginBottom:14 }}>Our Product Range</h2>
            <p style={{ color:'rgba(27,58,107,.45)', fontSize:12, letterSpacing:'.06em', maxWidth:420, margin:'0 auto' }}>Joi continues to innovate and expand its portfolio to meet evolving African hair care needs.</p>
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(280px,1fr))', gap:28 }}>
            {categories.map(({ title, desc, products }, i) => (
              <div key={title} style={{ border:'1px solid rgba(27,58,107,.1)', background:'#ffffff', overflow:'hidden', borderRadius:6, boxShadow:'0 4px 24px rgba(27,58,107,.08)', opacity:catVis?1:0, transform:catVis?'translateY(0)':'translateY(40px)', transition:`all .65s ease ${i*.15}s` }}>
                <div style={{ padding:'2rem 2rem 1.2rem' }}>
                  <div style={{ width:42, height:42, border:`1px solid rgba(201,151,58,.5)`, display:'flex', alignItems:'center', justifyContent:'center', marginBottom:16, background:'rgba(201,151,58,.06)', borderRadius:4 }}>
                    <Sparkles size={17} color={GOLD_D} />
                  </div>
                  <h3 style={{ fontSize:'1.3rem', fontWeight:400, fontFamily:"'Cormorant Garamond',serif", color:NAVY, marginBottom:10 }}>{title}</h3>
                  <p style={{ color:'rgba(27,58,107,.55)', fontSize:12, lineHeight:1.75, marginBottom:16 }}>{desc}</p>
                </div>
                <div style={{ padding:'1rem 2rem 2rem', borderTop:'1px solid rgba(27,58,107,.07)' }}>
                  <div style={{ fontSize:8, letterSpacing:'.2em', textTransform:'uppercase', color:GOLD_D, marginBottom:12 }}>Products Include</div>
                  {products.map(p => (
                    <div key={p} style={{ display:'flex', alignItems:'flex-start', gap:10, marginBottom:8 }}>
                      <CheckCircle size={12} color={GOLD_D} style={{ flexShrink:0, marginTop:1 }} />
                      <span style={{ color:'rgba(27,58,107,.6)', fontSize:11.5, lineHeight:1.5 }}>{p}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <div style={{ textAlign:'center', marginTop:44 }}>
            <Link to="/" style={{ padding:'13px 36px', border:`1px solid ${NAVY}`, color:NAVY, fontSize:10, letterSpacing:'.22em', textTransform:'uppercase', textDecoration:'none', display:'inline-flex', alignItems:'center', gap:10, transition:'all .3s', fontFamily:"'Montserrat',sans-serif", borderRadius:4 }}
              onMouseEnter={e => { e.currentTarget.style.background=NAVY; e.currentTarget.style.color='#fff' }}
              onMouseLeave={e => { e.currentTarget.style.background='transparent'; e.currentTarget.style.color=NAVY }}>
              View All Products <ArrowRight size={12} />
            </Link>
          </div>
        </div>
      </section>

      {/* ══ CTA (dark) ════════════════════════════════════════ */}
      <section ref={ctaRef} style={{ padding:'6rem 2rem', position:'relative', overflow:'hidden' }}>
        <div style={{ position:'absolute', inset:0, backgroundImage:'url(https://images.pexels.com/photos/4041392/pexels-photo-4041392.jpeg?auto=compress&cs=tinysrgb&w=1600)', backgroundSize:'cover', backgroundPosition:'center', filter:'brightness(.18)' }} />
        <div style={{ position:'absolute', inset:0, background:'linear-gradient(135deg,rgba(27,58,107,.92),rgba(255,215,0,.07))' }} />
        <div style={{ position:'relative', zIndex:1, textAlign:'center', maxWidth:580, margin:'0 auto', opacity:ctaVis?1:0, transform:ctaVis?'translateY(0)':'translateY(32px)', transition:'all .85s ease' }}>
          <div style={{ fontSize:9, letterSpacing:'.45em', textTransform:'uppercase', color:GOLD_L, marginBottom:18 }}>Stock Joi Products</div>
          <h2 style={{ fontSize:'clamp(1.8rem,5vw,3.4rem)', fontWeight:300, fontFamily:"'Cormorant Garamond',serif", color:'#fff', lineHeight:1.2, marginBottom:18 }}>
            Ready to Bring Joi to{' '}
            <span style={{ background:'linear-gradient(135deg,#FFD700,#FFEC99)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>Your Customers?</span>
          </h2>
          <p style={{ color:'rgba(255,255,255,.5)', fontSize:13, lineHeight:1.9, marginBottom:36 }}>Whether you're a retailer, salon owner, or distributor, we'd love to work with you. Get in touch to learn more about our product range and how we can partner.</p>
          <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:20 }}>
            <div style={{ display:'flex', gap:28, flexWrap:'wrap', justifyContent:'center' }}>
              <a href="tel:0748635395" style={{ display:'flex', alignItems:'center', gap:8, color:'rgba(255,255,255,.65)', fontSize:13, textDecoration:'none', transition:'color .25s' }} onMouseEnter={e=>e.currentTarget.style.color=GOLD_L} onMouseLeave={e=>e.currentTarget.style.color='rgba(255,255,255,.65)'}><Phone size={14} color={GOLD_L} />0748 635 395</a>
              <a href="mailto:Wellssolutions2015@gmail.com" style={{ display:'flex', alignItems:'center', gap:8, color:'rgba(255,255,255,.65)', fontSize:13, textDecoration:'none', transition:'color .25s' }} onMouseEnter={e=>e.currentTarget.style.color=GOLD_L} onMouseLeave={e=>e.currentTarget.style.color='rgba(255,255,255,.65)'}><Mail size={14} color={GOLD_L} />Wellssolutions2015@gmail.com</a>
            </div>
            <div style={{ display:'flex', gap:12, flexWrap:'wrap', justifyContent:'center' }}>
              <a href="mailto:Wellssolutions2015@gmail.com" style={{ padding:'14px 36px', background:`linear-gradient(135deg,${GOLD_L},#FFE34D)`, color:NAVY, fontSize:10, letterSpacing:'.22em', textTransform:'uppercase', textDecoration:'none', fontWeight:600, display:'inline-flex', alignItems:'center', gap:10, transition:'transform .3s' }} onMouseEnter={e=>(e.currentTarget.style.transform='translateY(-2px)')} onMouseLeave={e=>(e.currentTarget.style.transform='none')}>Get In Touch <ArrowRight size={12} /></a>
              <Link to="/" style={{ padding:'14px 28px', border:'1px solid rgba(255,215,0,.4)', color:GOLD_L, fontSize:10, letterSpacing:'.22em', textTransform:'uppercase', textDecoration:'none', display:'inline-flex', alignItems:'center', gap:10, transition:'all .3s' }} onMouseEnter={e=>{ e.currentTarget.style.background='rgba(255,215,0,.08)'; e.currentTarget.style.borderColor='rgba(255,215,0,.7)' }} onMouseLeave={e=>{ e.currentTarget.style.background='transparent'; e.currentTarget.style.borderColor='rgba(255,215,0,.4)' }}>Our Products</Link>
            </div>
          </div>
        </div>
      </section>

    </div>
  )
}