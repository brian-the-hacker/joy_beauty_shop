import logoSrc from '../assets/logo.png'

export default function Logo({ size = 48, className, style, ...props }) {
  return (
    <img
      src={logoSrc}
      alt="Joi"
      style={{
        height: size,
        width: 'auto',
        maxWidth: size * 4,
        objectFit: 'contain',
        display: 'block',
        ...style,
      }}
      className={className}
      {...props}
    />
  )
}
