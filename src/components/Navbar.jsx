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
        <Link to="/" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}>
          <img
            src={logoImg}
            alt="Joi"
            style={{
              height: scrolled ? 42 : 52,
              width: 'auto',
              objectFit: 'contain',
              transition: 'height 0.3s',
            }}
          />
        </Link>

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

        <button onClick={() => setOpen(!open)} style={{
          display: 'none', background: 'none', border: 'none',
          color: scrolled ? '#a06800' : '#FFD700', cursor: 'pointer'
        }} className="mobile-menu-btn">
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

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