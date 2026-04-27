import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Input, message } from 'antd'
import { SearchOutlined, SafetyCertificateOutlined, ThunderboltOutlined, EyeOutlined } from '@ant-design/icons'

const FEATURES = [
  {
    icon: <SafetyCertificateOutlined />,
    title: 'Tamper-Proof',
    desc: 'Every document is encrypted with a unique authentication code that cannot be duplicated or forged.',
  },
  {
    icon: <ThunderboltOutlined />,
    title: 'Instant Verification',
    desc: 'Real-time lookup with sub-second response. Know the validity status immediately.',
  },
  {
    icon: <EyeOutlined />,
    title: 'Full Transparency',
    desc: 'See complete document details, issuer info, and expiration status at a glance.',
  },
]

export default function HomePage() {
  const [code, setCode] = useState('')
  const navigate = useNavigate()

  const handleVerify = () => {
    const trimmed = code.trim().toUpperCase()
    if (!trimmed) {
      message.warning('Please enter an authentication code.')
      return
    }
    navigate(`/verify/${trimmed}`)
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleVerify()
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'var(--color-surface)', fontFamily: 'var(--font-body)' }}>
      {/* Nav */}
      <nav className="flex items-center justify-between px-8 py-5 border-b border-(--color-border-subtle)">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'var(--color-primary)' }}>
            <span className="text-white font-bold text-xs" style={{ fontFamily: 'var(--font-display)' }}>DV</span>
          </div>
          <span className="font-bold text-neutral-100 tracking-tight" style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem' }}>
            DoxCheck
          </span>
        </div>
        <button
          onClick={() => navigate('/admin')}
          className="text-sm text-neutral-400 hover:text-neutral-100 transition-colors"
          style={{ fontFamily: 'var(--font-body)' }}
        >
          Admin Portal →
        </button>
      </nav>

      {/* Hero */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 py-24 relative overflow-hidden">
        {/* Background grid */}
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: 'linear-gradient(var(--color-neutral-100) 1px, transparent 1px), linear-gradient(90deg, var(--color-neutral-100) 1px, transparent 1px)',
          backgroundSize: '60px 60px'
        }} />

        {/* Glow */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] rounded-full opacity-10 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse, var(--color-primary-light) 0%, transparent 70%)', filter: 'blur(60px)' }} />

        <div className="relative z-10 max-w-3xl mx-auto text-center">
          {/* Badge */}
          {/* <div className="fade-up inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-(--color-border) mb-8"
            style={{ background: 'rgba(255,255,255,0.04)' }}>
            <span className="w-1.5 h-1.5 rounded-full bg-(--color-success)" style={{ animation: 'pulse-ring 2s ease-out infinite' }} />
            <span className="text-xs text-neutral-300 tracking-widest uppercase">System Online</span>
          </div> */}

          <h1 className="fade-up-2 text-6xl md:text-7xl font-extrabold leading-tight mb-6"
            style={{ fontFamily: 'var(--font-display)' }}>
            <span className="shimmer-text">DOXCHECK.</span>
            <br />
            <span className="text-neutral-100">Trust. Confirm.</span>
          </h1>

          <p className="fade-up-3 text-lg text-neutral-400 mb-14 max-w-xl mx-auto leading-relaxed">
            DoxCheck is a modern document authentication platform. Enter an authentication code below to instantly verify the legitimacy of any registered document.
          </p>

          {/* Verify Input */}
          <div className="fade-up-4 max-w-xl mx-auto">
            <div className="relative group">
              <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{ background: 'linear-gradient(135deg, oklch(42% 0.18 250 / 0.3), oklch(72% 0.20 195 / 0.3))', filter: 'blur(20px)', zIndex: -1 }} />
              <Input
                size="large"
                placeholder="Enter authentication code (e.g. DIPLOMA1)"
                value={code}
                onChange={e => setCode(e.target.value.toUpperCase())}
                onKeyDown={handleKeyDown}
                prefix={<SearchOutlined style={{ color: 'var(--color-neutral-500)' }} />}
                suffix={
                  <button onClick={handleVerify}
                    className="px-4 py-1.5 rounded-lg text-sm font-semibold transition-all duration-200"
                    style={{
                      background: 'var(--color-primary)',
                      color: 'var(--color-primary-foreground)',
                      fontFamily: 'var(--font-display)',
                      letterSpacing: '0.04em'
                    }}>
                    Verify
                  </button>
                }
                style={{
                  borderRadius: '12px',
                  padding: '14px 16px',
                  fontSize: '15px',
                  letterSpacing: '0.05em',
                  fontFamily: 'var(--font-display)',
                }}
              />
            </div>
            <p className="mt-3 text-xs text-neutral-500">
              Try: <button onClick={() => { setCode('DIPLOMA1'); setTimeout(handleVerify, 100) }}
                className="text-(--color-accent) underline underline-offset-2 cursor-pointer">DIPLOMA1</button>
              {' · '}
              <button onClick={() => { setCode('CERT-2024A'); setTimeout(() => navigate('/verify/CERT-2024A'), 100) }}
                className="text-(--color-accent) underline underline-offset-2 cursor-pointer">CERT-2024A</button>
            </p>
          </div>
        </div>

        {/* Feature Cards */}
        <div className="relative z-10 max-w-4xl mx-auto mt-24 w-full grid grid-cols-1 md:grid-cols-3 gap-4">
          {FEATURES.map((f, i) => (
            <div key={i} className="card border-(--color-border-subtle) group hover:border-(--color-border) transition-all duration-300"
              style={{ animationDelay: `${0.6 + i * 0.1}s`, animation: 'fade-up 0.5s ease both', animationDelay: `${0.7 + i * 0.1}s` }}>
              <div className="w-10 h-10 rounded-lg flex items-center justify-center mb-4 text-lg"
                style={{ background: 'var(--color-surface-overlay)', color: 'var(--color-accent)' }}>
                {f.icon}
              </div>
              <h3 className="font-bold text-neutral-100 mb-2 text-sm" style={{ fontFamily: 'var(--font-display)', letterSpacing: '0.02em' }}>
                {f.title}
              </h3>
              <p className="text-xs text-neutral-500 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-(--color-border-subtle) px-8 py-5 flex items-center justify-between">
        <span className="text-xs text-neutral-600">© 2025 DoxVerify. All rights reserved.</span>
        <span className="text-xs text-neutral-600">Secure Document Authentication Platform</span>
      </footer>
    </div>
  )
}
