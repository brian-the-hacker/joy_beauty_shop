import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import logoImg from '../assets/logo.jpeg';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const loc = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => { setOpen(false); }, [loc]);

  return (
    <nav style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
      background: scrolled? 'rgba(10,22,40,0.98)' : 'transparent',
      borderBottom: scrolled? '1px solid rgba(201,151,58,0.15)' : 'none',
      transition: 'all 0.4s ease',
    }}>
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 2rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: scrolled? 70 : 88, transition: 'height 0.3s' }}>
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 12, textDecoration: 'none' }}>
          <img
            src={logoImg}
            alt="Charles"
            style={{
              height: scrolled? 38 : 46,
              width: 'auto',
              objectFit: 'contain',
              mixBlendMode: 'screen',
              transition: 'height 0.3s'
            }}
          />
          <div>
            <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: scrolled? 22 : 26, fontWeight: 300, letterSpacing: '0.18em', background: 'linear-gradient(135deg, #c9973a, #f5e0a8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Charles</div>
            <div style={{ fontSize: 8, letterSpacing: '0.35em', color: 'rgba(201,151,58,0.7)', textTransform: 'uppercase' }}>Luxury Beauty</div>
          </div>
        </Link>

        <div className="desktop-nav" style={{ display: 'flex', gap: 32, alignItems: 'center' }}>
          {[
            { label: 'Home', to: '/' },
            { label: 'Collections', to: '/#collections' },
            { label: 'About', to: '/about' },
          ].map(l => (
            <Link key={l.label} to={l.to} style={{
              fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase', textDecoration: 'none',
              color: loc.pathname === l.to? '#c9973a' : 'rgba(255,255,255,0.8)', transition: 'color 0.3s',
            }}>{l.label}</Link>
          ))}
          <Link to="/#collections" style={{
            padding: '10px 24px', border: '1px solid #c9973a', color: '#c9973a', fontSize: 11,
            letterSpacing: '0.2em', textTransform: 'uppercase', textDecoration: 'none', transition: 'all 0.3s',
          }}>Shop</Link>
        </div>

        <button onClick={() => setOpen(!open)} style={{ display: 'none', background: 'none', border: 'none', color: '#c9973a', cursor: 'pointer' }} className="mobile-menu-btn">
          {open? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {open && (
        <div style={{ background: 'rgba(10,22,40,0.98)', padding: '1.5rem 2rem', display: 'flex', flexDirection: 'column', gap: 16 }}>
          {['Home', 'Collections', 'About'].map(l => (
            <Link key={l} to={l === 'Home'? '/' : l === 'About'? '/about' : '/#collections'} style={{ fontSize: 13, letterSpacing: '0.15em', textTransform: 'uppercase', textDecoration: 'none', color: '#fff' }}>{l}</Link>
          ))}
        </div>
      )}

      <style>{`@media (max-width:768px){.desktop-nav{display:none!important}.mobile-menu-btn{display:block!important}}`}</style>
    </nav>
  );
}