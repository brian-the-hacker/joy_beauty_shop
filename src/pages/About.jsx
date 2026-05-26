import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { Award, Users, Globe, Heart, ArrowRight } from 'lucide-react'
import Logo from '../components/Logo'

function useVisible(threshold = 0.12) {
  const ref = useRef(null)
  const [vis, setVis] = useState(false)
  useEffect(() => {
    const o = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setVis(true); o.disconnect() }
    }, { threshold })
    if (ref.current) o.observe(ref.current)
    return () => o.disconnect()
  }, [threshold])
  return { ref, vis }
}

const milestones = [
  { year: '2014', title: 'Founded', desc: 'Born in a Parisian atelier, Charles was created to bring true luxury to modern women.' },
  { year: '2017', title: 'First Award', desc: 'Velvet Noir Serum wins the Cosmopolitan Beauty Award for Best Luxury Serum.' },
  { year: '2020', title: 'Global Expansion', desc: 'Charles launches in 40+ countries, reaching women across 5 continents.' },
  { year: '2023', title: 'Clean Certified', desc: 'Achieved full clean beauty certification — 100% cruelty-free and sustainably sourced.' },
  { year: '2026', title: 'The Future', desc: 'Introducing AI-powered skin ritual consultations and next-gen formulas.' },
]

const stats = [
  { icon: Award, value: '12+', label: 'Global Beauty Awards' },
  { icon: Users, value: '850K+', label: 'Loyal Customers' },
  { icon: Globe, value: '42', label: 'Countries Reached' },
  { icon: Heart, value: '100%', label: 'Cruelty-Free' },
]

const team = [
  { name: 'Isabelle Laurent', role: 'Founder & Creative Director', img: 'https://images.pexels.com/photos/3992656/pexels-photo-3992656.jpeg?auto=compress&cs=tinysrgb&w=400', bio: 'Trained in Paris and Tokyo, Isabelle built Charles on the belief that luxury should feel personal.' },
  { name: 'Dr. Amara Osei', role: 'Chief Formulation Scientist', img: 'https://images.pexels.com/photos/5490276/pexels-photo-5490276.jpeg?auto=compress&cs=tinysrgb&w=400', bio: 'With a PhD in biocosmetics, Amara bridges cutting-edge science with botanical wisdom.' },
  { name: 'Sofia Reyes', role: 'Head of Brand & Experience', img: 'https://images.pexels.com/photos/4046316/pexels-photo-4046316.jpeg?auto=compress&cs=tinysrgb&w=400', bio: 'Sofia shapes every touchpoint — from unboxing to skin ritual — into a sensory story.' },
]

export default function About() {
  const { ref: missionRef, vis: missionVis } = useVisible()
  const { ref: statsRef, vis: statsVis } = useVisible()
  const { ref: timeRef, vis: timeVis } = useVisible()
  const { ref: teamRef, vis: teamVis } = useVisible()

  useEffect(() => { window.scrollTo(0, 0) }, [])

  return (
    <div style={{ background: '#0a1628', minHeight: '100vh' }}>

      {/* HERO */}
      <section style={{ position: 'relative', height: '80vh', minHeight: 520, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'url(https://images.pexels.com/photos/3373745/pexels-photo-3373745.jpeg?auto=compress&cs=tinysrgb&w=1600)', backgroundSize: 'cover', backgroundPosition: 'center 30%', filter: 'brightness(0.2)' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(10,22,40,0.3), rgba(10,22,40,0.85))' }} />
        <div style={{ position: 'relative', textAlign: 'center', padding: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 24, opacity: 0, animation: 'fadeIn 1s ease 0.2s forwards' }}>
            <Logo size={64} />
          </div>
          <div style={{ fontSize: 10, letterSpacing: '0.45em', textTransform: 'uppercase', color: '#c9973a', marginBottom: 20, opacity: 0, animation: 'fadeIn 1s ease 0.4s forwards' }}>Est. 2014 · Paris</div>
          <h1 style={{ fontSize: 'clamp(2.5rem, 7vw, 6rem)', fontWeight: 300, color: '#fff', lineHeight: 1.1, marginBottom: 24, opacity: 0, animation: 'fadeUp 1s ease 0.5s forwards' }}>
            The House of{' '}
            <span style={{ background: 'linear-gradient(135deg, #c9973a, #f5e0a8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Charles</span>
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: '1rem', fontStyle: 'italic', letterSpacing: '0.06em', opacity: 0, animation: 'fadeUp 1s ease 0.7s forwards' }}>
            "Where science meets luxury, beauty becomes power."
          </p>
        </div>
      </section>

      {/* MISSION */}
      <section ref={missionRef} style={{ padding: '8rem 2rem', maxWidth: 1280, margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '5rem', alignItems: 'center', opacity: missionVis ? 1 : 0, transform: missionVis ? 'translateY(0)' : 'translateY(40px)', transition: 'all 0.9s ease' }}>
          <div style={{ position: 'relative' }}>
            <div style={{ position: 'absolute', top: -20, left: -20, right: 20, bottom: 20, border: '1px solid rgba(201,151,58,0.2)', pointerEvents: 'none' }} />
            <img src="https://images.pexels.com/photos/3785147/pexels-photo-3785147.jpeg?auto=compress&cs=tinysrgb&w=800" alt="Atelier" style={{ width: '100%', height: 520, objectFit: 'cover', display: 'block', filter: 'brightness(0.9)' }} />
            <div style={{ position: 'absolute', bottom: -24, right: -24, width: 110, height: 110, background: 'linear-gradient(135deg, #c9973a, #e5b95a)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ fontSize: '2rem', fontWeight: 300, color: '#0a1628', lineHeight: 1 }}>12</span>
              <span style={{ fontSize: 8, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#0a1628', fontWeight: 600 }}>Years of<br />Excellence</span>
            </div>
          </div>
          <div>
            <div style={{ fontSize: 10, letterSpacing: '0.4em', textTransform: 'uppercase', color: '#c9973a', marginBottom: 20 }}>Our Mission</div>
            <h2 style={{ fontSize: 'clamp(1.8rem, 3.5vw, 3rem)', fontWeight: 300, color: '#fff', lineHeight: 1.25, marginBottom: 24 }}>
              Beauty That Honors{' '}
              <span style={{ background: 'linear-gradient(135deg, #c9973a, #f5e0a8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Every Woman</span>
            </h2>
            <div style={{ width: 40, height: 1, background: '#c9973a', marginBottom: 24 }} />
            <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: 14, lineHeight: 1.9, marginBottom: 16 }}>Charles was born from a simple conviction: that luxury skincare should not be a privilege, but a right. We set out to create formulas so potent, so refined, that every woman who touches them feels the difference immediately.</p>
            <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: 13, lineHeight: 1.9, marginBottom: 40 }}>From our Parisian atelier, we blend time-honored botanical rituals with modern biotechnology — because your skin deserves nothing less than perfection.</p>
            <Link to="/" style={{ padding: '14px 32px', border: '1px solid rgba(201,151,58,0.4)', color: '#c9973a', fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 10 }}>
              Explore Collection <ArrowRight size={12} />
            </Link>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section ref={statsRef} style={{ background: 'rgba(6,14,26,0.8)', borderTop: '1px solid rgba(201,151,58,0.08)', borderBottom: '1px solid rgba(201,151,58,0.08)', padding: '5rem 2rem' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 32 }}>
          {stats.map(({ icon: Icon, value, label }, i) => (
            <div key={label} style={{ textAlign: 'center', padding: '2rem 1rem', opacity: statsVis ? 1 : 0, transform: statsVis ? 'translateY(0)' : 'translateY(20px)', transition: `all 0.6s ease ${i * 0.1}s` }}>
              <Icon size={24} color="rgba(201,151,58,0.7)" style={{ marginBottom: 16 }} />
              <div style={{ fontSize: '3rem', fontWeight: 300, background: 'linear-gradient(135deg, #c9973a, #f5e0a8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', lineHeight: 1, marginBottom: 8 }}>{value}</div>
              <div style={{ fontSize: 11, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.45)' }}>{label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* TIMELINE */}
      <section ref={timeRef} style={{ padding: '8rem 2rem', maxWidth: 900, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 80 }}>
          <div style={{ fontSize: 10, letterSpacing: '0.4em', textTransform: 'uppercase', color: '#c9973a', marginBottom: 16 }}>Our Journey</div>
          <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3.5rem)', fontWeight: 300, color: '#fff' }}>A Decade of Radiance</h2>
        </div>
        <div style={{ position: 'relative' }}>
          <div style={{ position: 'absolute', left: '50%', top: 0, bottom: 0, width: 1, background: 'linear-gradient(to bottom, transparent, rgba(201,151,58,0.3), transparent)', transform: 'translateX(-50%)' }} />
          {milestones.map(({ year, title, desc }, i) => (
            <div key={year} style={{ display: 'flex', gap: 32, marginBottom: 56, alignItems: 'flex-start', opacity: timeVis ? 1 : 0, transform: timeVis ? 'translateX(0)' : `translateX(${i % 2 === 0 ? '-30px' : '30px'})`, transition: `all 0.7s ease ${i * 0.15}s` }}>
              {i % 2 === 0 ? (
                <>
                  <div style={{ flex: 1, textAlign: 'right', paddingRight: 32, paddingTop: 4 }}>
                    <h3 style={{ fontSize: '1.3rem', fontWeight: 400, color: '#fff', marginBottom: 6 }}>{title}</h3>
                    <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: 12, lineHeight: 1.7 }}>{desc}</p>
                  </div>
                  <div style={{ flexShrink: 0, width: 56, height: 56, border: '1px solid #c9973a', background: 'rgba(10,22,40,0.9)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1 }}>
                    <span style={{ fontSize: 10, fontWeight: 600, color: '#c9973a' }}>{year}</span>
                  </div>
                  <div style={{ flex: 1 }} />
                </>
              ) : (
                <>
                  <div style={{ flex: 1 }} />
                  <div style={{ flexShrink: 0, width: 56, height: 56, border: '1px solid #c9973a', background: 'rgba(10,22,40,0.9)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1 }}>
                    <span style={{ fontSize: 10, fontWeight: 600, color: '#c9973a' }}>{year}</span>
                  </div>
                  <div style={{ flex: 1, paddingLeft: 32, paddingTop: 4 }}>
                    <h3 style={{ fontSize: '1.3rem', fontWeight: 400, color: '#fff', marginBottom: 6 }}>{title}</h3>
                    <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: 12, lineHeight: 1.7 }}>{desc}</p>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* TEAM */}
      <section ref={teamRef} style={{ padding: '6rem 2rem 8rem', background: 'rgba(6,14,26,0.6)', borderTop: '1px solid rgba(201,151,58,0.08)' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 64 }}>
            <div style={{ fontSize: 10, letterSpacing: '0.4em', textTransform: 'uppercase', color: '#c9973a', marginBottom: 16 }}>Behind Charles</div>
            <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3.5rem)', fontWeight: 300, color: '#fff' }}>The Visionaries</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 32 }}>
            {team.map(({ name, role, img, bio }, i) => (
              <div key={name} style={{ border: '1px solid rgba(201,151,58,0.1)', background: 'rgba(17,34,64,0.5)', overflow: 'hidden', opacity: teamVis ? 1 : 0, transform: teamVis ? 'translateY(0)' : 'translateY(40px)', transition: `all 0.7s ease ${i * 0.15}s` }}>
                <div style={{ height: 320, overflow: 'hidden' }}>
                  <img src={img} alt={name} style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top', filter: 'brightness(0.85)' }} />
                </div>
                <div style={{ padding: '1.5rem' }}>
                  <h3 style={{ fontSize: '1.3rem', fontWeight: 400, color: '#fff', marginBottom: 4 }}>{name}</h3>
                  <div style={{ color: '#c9973a', fontSize: 11, letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 12 }}>{role}</div>
                  <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: 12, lineHeight: 1.7 }}>{bio}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}