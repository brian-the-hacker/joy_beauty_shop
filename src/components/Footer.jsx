import { Drama as Instagram, Battery as Twitter, Notebook as Facebook, Mail, Phone, MapPin } from 'lucide-react';
import logoImg from '../assets/logo.jpeg';

export default function Footer() {
  return (
    <footer style={{ background: '#060e1a', borderTop: '1px solid rgba(201,151,58,0.15)', padding: '5rem 2rem 2rem' }}>
      <div style={{ maxWidth: 1280, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '3rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
            <img src={logoImg} alt="Joi" style={{ width: 40, height: 40 }} />
            <div>
              <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 22, fontWeight: 300, letterSpacing: '0.18em', background: 'linear-gradient(135deg, #c9973a, #f5e0a8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Joi</div>
              <div style={{ fontSize: 8, letterSpacing: '0.3em', color: 'rgba(201,151,58,0.6)' }}>Luxury Beauty</div>
            </div>
          </div>
          <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: 12, lineHeight: 1.8, maxWidth: 240 }}>Luxury beauty crafted for the woman who commands every room she enters.</p>
          <div style={{ display: 'flex', gap: 12, marginTop: 16 }}>
            {[Instagram, Twitter, Facebook].map((I, i) => (
              <a key={i} href="#" style={{ width: 36, height: 36, border: '1px solid rgba(201,151,58,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#c9973a' }}><I size={15} /></a>
            ))}
          </div>
        </div>

        <div>
          <h4 style={{ fontSize: 10, letterSpacing: '0.3em', textTransform: 'uppercase', color: '#c9973a', marginBottom: 16 }}>Explore</h4>
          {['Collections', 'Bestsellers', 'New Arrivals', 'Gift Sets'].map(x => (
            <div key={x} style={{ marginBottom: 8 }}><a href="#" style={{ color: 'rgba(255,255,255,0.5)', textDecoration: 'none', fontSize: 12 }}>{x}</a></div>
          ))}
        </div>

        <div>
          <h4 style={{ fontSize: 10, letterSpacing: '0.3em', textTransform: 'uppercase', color: '#c9973a', marginBottom: 16 }}>Contact</h4>
          {[{ I: Mail, t: 'hello@lumiere.beauty' }, { I: Phone, t: '+1 (800) 586-4437' }, { I: MapPin, t: '5th Ave, New York' }].map(({ I, t }) => (
            <div key={t} style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 12 }}>
              <I size={14} color="rgba(201,151,58,0.7)" />
              <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: 12 }}>{t}</span>
            </div>
          ))}
        </div>
      </div>
      <div style={{ borderTop: '1px solid rgba(201,151,58,0.1)', marginTop: 40, paddingTop: 20, display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
        <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: 11 }}>© 2026 Joi. All rights reserved.</p>
      </div>
    </footer>
  );
}
