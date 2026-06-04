import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import logoImg from '../assets/logo.png';

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
      background: scrolled ? 'rgba(255,255,255,0.97)' : 'transparent',
      borderBottom: scrolled ? '1px solid rgba(160,104,0,0.18)' : 'none',
      transition: 'all 0.4s ease',
      backdropFilter: scrolled ? 'blur(12px)' : 'none',
    }}>
      <div style={{
        maxWidth: 1280, margin: '0 auto', padding: '0 2rem',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        height: scrolled ? 70 : 88, transition: 'height 0.3s'
      }}>

        {/* ── Logo with glowing circle ── */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}>
          <div style={{
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: scrolled ? 58 : 74,
            height: scrolled ? 58 : 74,
            transition: 'width 0.3s, height 0.3s',
          }}>
            {/* Outer soft glow ring */}
            <div style={{
              position: 'absolute',
              inset: -6,
              borderRadius: '50%',
              background: scrolled
                ? 'radial-gradient(circle, rgba(255,215,0,0.18) 0%, transparent 72%)'
                : 'radial-gradient(circle, rgba(255,255,255,0.22) 0%, transparent 72%)',
              transition: 'background 0.4s',
              pointerEvents: 'none',
            }} />
            {/* The circle backdrop */}
            <div style={{
              position: 'absolute',
              inset: 0,
              borderRadius: '50%',
              background: scrolled
                ? 'rgba(255,215,0,0.12)'
                : 'rgba(255,255,255,0.15)',
              border: scrolled
                ? '1px solid rgba(201,151,58,0.3)'
                : '1px solid rgba(255,255,255,0.3)',
              backdropFilter: 'blur(4px)',
              transition: 'all 0.4s',
              boxShadow: scrolled
                ? '0 4px 20px rgba(201,151,58,0.2)'
                : '0 4px 24px rgba(255,255,255,0.18)',
            }} />
            {/* Logo image */}
            <img
              src={logoImg}
              alt="Joi"
              style={{
                position: 'relative',
                zIndex: 1,
                height: scrolled ? 36 : 48,
                width: 'auto',
                objectFit: 'contain',
                transition: 'height 0.3s',
                filter: scrolled
                  ? 'drop-shadow(0 2px 8px rgba(201,151,58,0.3))'
                  : 'drop-shadow(0 2px 12px rgba(255,255,255,0.4)) brightness(1.05)',
              }}
            />
          </div>
        </Link>

        {/* ── Desktop nav ── */}
        <div className="desktop-nav" style={{ display: 'flex', gap: 32, alignItems: 'center' }}>
          {[
            { label: 'Home', to: '/' },
            { label: 'Collections', to: '/#collections' },
            { label: 'About', to: '/about' },
          ].map(l => (
            <Link key={l.label} to={l.to} style={{
              fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase', textDecoration: 'none',
              color: loc.pathname === l.to ? '#a06800' : (scrolled ? '#333' : 'rgba(255,255,255,0.9)'),
              transition: 'color 0.3s',
            }}>{l.label}</Link>
          ))}
        </div>

        {/* ── Mobile toggle ── */}
        <button onClick={() => setOpen(!open)} style={{
          display: 'none', background: 'none', border: 'none',
          color: scrolled ? '#a06800' : '#FFD700', cursor: 'pointer'
        }} className="mobile-menu-btn">
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* ── Mobile menu ── */}
      {open && (
        <div style={{ background: 'rgba(255,255,255,0.98)', padding: '1.5rem 2rem', display: 'flex', flexDirection: 'column', gap: 16, borderTop: '1px solid rgba(160,104,0,0.15)' }}>
          {['Home', 'Collections', 'About'].map(l => (
            <Link key={l} to={l === 'Home' ? '/' : l === 'About' ? '/about' : '/#collections'} style={{ fontSize: 13, letterSpacing: '0.15em', textTransform: 'uppercase', textDecoration: 'none', color: '#333' }}>{l}</Link>
          ))}
        </div>
      )}

      <style>{`@media (max-width:768px){.desktop-nav{display:none!important}.mobile-menu-btn{display:block!important}}`}</style>
    </nav>
  );
}