import { Link } from 'react-router-dom'
import { Mail, Phone, MapPin, ArrowRight } from 'lucide-react'
import logoImg from '../assets/logo.png'

const GOLD = '#a06800'

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer style={{ background:'#f5f3ef', borderTop:'1px solid rgba(160,104,0,0.15)', padding:'5rem 2rem 2rem', fontFamily:"'Montserrat',sans-serif" }}>
      <div style={{ maxWidth:1280, margin:'0 auto', display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(200px,1fr))', gap:'3rem' }}>

        {/* ── Brand ── */}
        <div>
          <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:14 }}>
            <img src={logoImg} alt="Joi" style={{ width:42, height:42, objectFit:'contain' }} />
            <div>
              <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:22, fontWeight:300, letterSpacing:'.18em', background:'linear-gradient(135deg,#a06800,#c28a00)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', lineHeight:1 }}>Joi</div>
              <div style={{ fontSize:8, letterSpacing:'.3em', color:'rgba(160,104,0,0.6)', marginTop:2 }}>Hair &amp; Beauty</div>
            </div>
          </div>
          {/* Wellstrend — prominent */}
          <div style={{ fontSize:11, letterSpacing:'.2em', textTransform:'uppercase', color:GOLD, fontWeight:700, marginBottom:10 }}>Wellstrend Creations Ltd</div>
          <p style={{ color:'#666', fontSize:12, lineHeight:1.8, maxWidth:230, marginBottom:16 }}>
            High-quality, affordable hair care products — manufactured in Kenya, made for Africa.
          </p>
          <div style={{ display:'inline-flex', alignItems:'center', gap:6, border:'1px solid rgba(160,104,0,0.25)', padding:'5px 12px' }}>
            <span style={{ fontSize:9, letterSpacing:'.14em', color:'rgba(160,104,0,0.55)' }}>Est.</span>
            <span style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:15, color:GOLD, fontWeight:300 }}>2015, </span>
          </div>
        </div>

        {/* ── Navigate ── */}
        <div>
          <h4 style={{ fontSize:10, letterSpacing:'.3em', textTransform:'uppercase', color:GOLD, marginBottom:16 }}>Navigate</h4>
          {[
            { label:'Home',        to:'/'            },
            { label:'About Us',    to:'/about'       },
            { label:'Our Products',to:'/#collections'},
          ].map(({ label, to }) => (
            <div key={label} style={{ marginBottom:9 }}>
              <Link
                to={to}
                style={{ color:'#555', textDecoration:'none', fontSize:12, display:'inline-flex', alignItems:'center', gap:6, transition:'color .2s' }}
                onMouseEnter={e => e.currentTarget.style.color=GOLD}
                onMouseLeave={e => e.currentTarget.style.color='#555'}>
                <ArrowRight size={10} color="rgba(160,104,0,0.4)" />
                {label}
              </Link>
            </div>
          ))}
        </div>

        {/* ── Contact ── */}
        <div>
          <h4 style={{ fontSize:10, letterSpacing:'.3em', textTransform:'uppercase', color:GOLD, marginBottom:16 }}>Contact</h4>
          {[
            { Icon:Phone,  href:'tel:+254748635395',                  text:'+254 748 635 395'            },
            { Icon:Mail,   href:'mailto:Wellssolutions2015@gmail.com', text:'Wellssolutions2015@gmail.com'},
            { Icon:MapPin, href:null,                                  text:'Kenya'              },
          ].map(({ Icon, href, text }) => {
            const row = (
              <div style={{ display:'flex', alignItems:'flex-start', gap:9, marginBottom:12 }}>
                <Icon size={13} color="rgba(160,104,0,0.7)" style={{ marginTop:2, flexShrink:0 }} />
                <span style={{ color:'#555', fontSize:12, lineHeight:1.5 }}>{text}</span>
              </div>
            )
            return href
              ? <a key={text} href={href} style={{ textDecoration:'none', display:'block' }} onMouseEnter={e=>e.currentTarget.style.opacity='.7'} onMouseLeave={e=>e.currentTarget.style.opacity='1'}>{row}</a>
              : <div key={text}>{row}</div>
          })}
          <a
            href="mailto:Wellssolutions2015@gmail.com"
            style={{ display:'inline-flex', alignItems:'center', gap:7, marginTop:6, padding:'9px 20px', background:'linear-gradient(135deg,#a06800,#c28a00)', color:'#fff', fontSize:9, letterSpacing:'.2em', textTransform:'uppercase', textDecoration:'none', fontWeight:600, transition:'opacity .2s' }}
            onMouseEnter={e => e.currentTarget.style.opacity='.85'}
            onMouseLeave={e => e.currentTarget.style.opacity='1'}>
            Enquire Now <ArrowRight size={11} />
          </a>
        </div>

      </div>

      {/* ── Bottom bar ── */}
      <div style={{ borderTop:'1px solid rgba(160,104,0,0.12)', marginTop:40, paddingTop:20, display:'flex', justifyContent:'space-between', alignItems:'center', flexWrap:'wrap', gap:12 }}>
        <p style={{ color:'#999', fontSize:11 }}>© {year} Wellstrend Creations Ltd · All rights reserved.</p>
        <p style={{ color:'rgba(160,104,0,0.45)', fontSize:10, letterSpacing:'.08em' }}>Proudly Made in Kenya</p>
      </div>
    </footer>
  )
}