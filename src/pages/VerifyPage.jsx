import { useParams, useNavigate } from 'react-router-dom'
import { Tag, Divider } from 'antd'
import {
  CheckCircleOutlined, CloseCircleOutlined, WarningOutlined,
  ArrowLeftOutlined, CalendarOutlined, BankOutlined,
  UserOutlined, FileTextOutlined, SafetyOutlined, ClockCircleOutlined
} from '@ant-design/icons'
import { documentStore } from '@/store/documentStore'
import { formatDate, isExpired } from '@/lib/utils'

function StatusBadge({ doc }) {
  if (!doc) return null
  const expired = isExpired(doc.viewableUntil)
  const revoked = doc.status === 'revoked'

  if (revoked) return (
    <div className="flex items-center gap-3 px-5 py-3 rounded-xl"
      style={{ background: 'var(--color-destructive-dim)', border: '1px solid oklch(58% 0.22 27 / 0.3)' }}>
      <CloseCircleOutlined style={{ color: 'var(--color-destructive)', fontSize: 20 }} />
      <div>
        <p className="font-bold text-sm" style={{ color: 'var(--color-destructive)', fontFamily: 'var(--font-display)' }}>REVOKED</p>
        <p className="text-xs" style={{ color: 'oklch(58% 0.22 27 / 0.7)' }}>This document has been revoked</p>
      </div>
    </div>
  )

  if (expired) return (
    <div className="flex items-center gap-3 px-5 py-3 rounded-xl"
      style={{ background: 'var(--color-warning-dim)', border: '1px solid oklch(72% 0.18 75 / 0.3)' }}>
      <WarningOutlined style={{ color: 'var(--color-warning)', fontSize: 20 }} />
      <div>
        <p className="font-bold text-sm" style={{ color: 'var(--color-warning)', fontFamily: 'var(--font-display)' }}>EXPIRED</p>
        <p className="text-xs" style={{ color: 'oklch(72% 0.18 75 / 0.7)' }}>View period has ended</p>
      </div>
    </div>
  )

  return (
    <div className="flex items-center gap-3 px-5 py-3 rounded-xl"
      style={{ background: 'var(--color-success-dim)', border: '1px solid oklch(62% 0.20 155 / 0.3)' }}>
      <CheckCircleOutlined style={{ color: 'var(--color-success)', fontSize: 20 }} />
      <div>
        <p className="font-bold text-sm" style={{ color: 'var(--color-success)', fontFamily: 'var(--font-display)' }}>VERIFIED</p>
        <p className="text-xs" style={{ color: 'oklch(62% 0.20 155 / 0.7)' }}>Authentic & active document</p>
      </div>
    </div>
  )
}

function InfoRow({ icon, label, value, mono }) {
  return (
    <div className="flex flex-col gap-1">
      <p className="text-xs tracking-widest uppercase" style={{ color: 'var(--color-neutral-500)', fontFamily: 'var(--font-display)' }}>
        {label}
      </p>
      <p className="text-sm font-medium" style={{
        color: 'var(--color-neutral-100)',
        fontFamily: mono ? 'monospace' : 'var(--font-body)',
        letterSpacing: mono ? '0.08em' : 'normal'
      }}>
        {value || '—'}
      </p>
    </div>
  )
}

export default function VerifyPage() {
  const { code } = useParams()
  const navigate = useNavigate()
  const doc = documentStore.getByCode(code)

  const notFound = !doc

  return (
    <div className="min-h-screen" style={{ background: 'var(--color-surface)', fontFamily: 'var(--font-body)' }}>
      {/* Nav */}
      <nav className="flex items-center justify-between px-8 py-5 border-b border-[var(--color-border-subtle)]">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'var(--color-primary)' }}>
            <span className="text-white font-bold text-xs" style={{ fontFamily: 'var(--font-display)' }}>DV</span>
          </div>
          <span className="font-bold text-[var(--color-neutral-100)] tracking-tight" style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem' }}>
            DoxVerify
          </span>
        </div>
        <button onClick={() => navigate('/')}
          className="flex items-center gap-2 text-sm text-[var(--color-neutral-400)] hover:text-[var(--color-neutral-100)] transition-colors">
          <ArrowLeftOutlined /> Back to Search
        </button>
      </nav>

      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Code display */}
        <div className="mb-8 fade-up">
          <p className="text-xs tracking-widest uppercase text-[var(--color-neutral-500)] mb-1" style={{ fontFamily: 'var(--font-display)' }}>
            Authentication Code
          </p>
          <div className="flex items-center gap-4 flex-wrap">
            <h1 className="text-3xl font-extrabold text-[var(--color-neutral-100)]"
              style={{ fontFamily: 'var(--font-display)', letterSpacing: '0.04em' }}>
              {code}
            </h1>
            {doc && <StatusBadge doc={doc} />}
          </div>
        </div>

        {notFound ? (
          /* Not Found */
          <div className="fade-up-2 flex flex-col items-center justify-center py-24 text-center">
            <div className="w-20 h-20 rounded-2xl flex items-center justify-center mb-6"
              style={{ background: 'var(--color-surface-overlay)', border: '1px solid var(--color-border)' }}>
              <CloseCircleOutlined style={{ fontSize: 36, color: 'var(--color-destructive)' }} />
            </div>
            <h2 className="text-2xl font-bold text-[var(--color-neutral-100)] mb-3" style={{ fontFamily: 'var(--font-display)' }}>
              Document Not Found
            </h2>
            <p className="text-[var(--color-neutral-500)] max-w-md text-sm leading-relaxed">
              The authentication code <code className="text-[var(--color-accent)] bg-[var(--color-surface-overlay)] px-2 py-0.5 rounded">{code}</code> does not match any registered document in our system.
            </p>
            <p className="text-[var(--color-neutral-600)] text-xs mt-4">
              Verify the code is correct or contact the document issuer.
            </p>
            <button onClick={() => navigate('/')}
              className="mt-8 btn-primary">
              Try Another Code
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left: Details */}
            <div className="lg:col-span-2 space-y-5 fade-up-2">
              {/* Document Info Card */}
              <div className="card">
                <div className="flex items-center gap-2 mb-5">
                  <FileTextOutlined style={{ color: 'var(--color-accent)' }} />
                  <h2 className="font-bold text-sm text-[var(--color-neutral-200)] tracking-wide uppercase"
                    style={{ fontFamily: 'var(--font-display)' }}>Document Information</h2>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <InfoRow label="Document Type" value={doc.documentType} />
                  <InfoRow label="Document Name" value={doc.documentName} />
                  <InfoRow label="Authentication Code" value={doc.authCode} mono />
                  <InfoRow label="Status" value={
                    <Tag color={doc.status === 'active' ? 'green' : doc.status === 'expired' ? 'orange' : 'red'}
                      style={{ fontFamily: 'var(--font-display)', letterSpacing: '0.05em', textTransform: 'uppercase', fontSize: '10px' }}>
                      {doc.status}
                    </Tag>
                  } />
                </div>
              </div>

              {/* Issuer Info */}
              <div className="card">
                <div className="flex items-center gap-2 mb-5">
                  <BankOutlined style={{ color: 'var(--color-accent)' }} />
                  <h2 className="font-bold text-sm text-[var(--color-neutral-200)] tracking-wide uppercase"
                    style={{ fontFamily: 'var(--font-display)' }}>Issuer & Recipient</h2>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <InfoRow label="Issued By" value={doc.issuedBy} />
                  <InfoRow label="Organization Type" value={doc.orgType} />
                  <InfoRow label="Issued To" value={doc.issuedTo} />
                  <InfoRow label="Remarks" value={doc.remarks} />
                </div>
              </div>

              {/* Dates */}
              <div className="card">
                <div className="flex items-center gap-2 mb-5">
                  <CalendarOutlined style={{ color: 'var(--color-accent)' }} />
                  <h2 className="font-bold text-sm text-[var(--color-neutral-200)] tracking-wide uppercase"
                    style={{ fontFamily: 'var(--font-display)' }}>Validity Period</h2>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <InfoRow label="Date Issued" value={formatDate(doc.dateIssued)} />
                  <InfoRow label="Viewable Until" value={formatDate(doc.viewableUntil)} />
                </div>
                {/* Progress bar */}
                <div className="mt-5">
                  <div className="flex justify-between text-xs text-[var(--color-neutral-500)] mb-1.5">
                    <span>{formatDate(doc.dateIssued)}</span>
                    <span>{formatDate(doc.viewableUntil)}</span>
                  </div>
                  <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'var(--color-surface-overlay)' }}>
                    {(() => {
                      const start = new Date(doc.dateIssued).getTime()
                      const end = new Date(doc.viewableUntil).getTime()
                      const now = Date.now()
                      const pct = Math.min(100, Math.max(0, ((now - start) / (end - start)) * 100))
                      const expired = isExpired(doc.viewableUntil)
                      return (
                        <div className="h-full rounded-full transition-all"
                          style={{
                            width: `${pct}%`,
                            background: expired ? 'var(--color-destructive)' : 'var(--color-success)'
                          }} />
                      )
                    })()}
                  </div>
                </div>
              </div>
            </div>

            {/* Right: QR / Summary */}
            <div className="space-y-5 fade-up-3">
              <div className="card text-center">
                <div className="flex items-center gap-2 justify-center mb-5">
                  <SafetyOutlined style={{ color: 'var(--color-accent)' }} />
                  <h2 className="font-bold text-sm text-[var(--color-neutral-200)] tracking-wide uppercase"
                    style={{ fontFamily: 'var(--font-display)' }}>Verification Seal</h2>
                </div>
                {/* QR placeholder */}
                <div className="mx-auto w-32 h-32 rounded-xl flex items-center justify-center mb-4 relative overflow-hidden"
                  style={{ background: 'var(--color-surface-overlay)', border: '1px solid var(--color-border)' }}>
                  <div className="grid grid-cols-5 gap-0.5 p-3 w-full h-full">
                    {Array.from({ length: 25 }).map((_, i) => (
                      <div key={i} className="rounded-sm"
                        style={{
                          background: Math.random() > 0.5 || i < 3 || i > 22
                            ? 'var(--color-neutral-200)'
                            : 'transparent',
                          aspectRatio: '1'
                        }} />
                    ))}
                  </div>
                </div>
                <p className="text-xs text-[var(--color-neutral-500)] mb-1">Scan to verify</p>
                <code className="text-xs text-[var(--color-accent)]" style={{ letterSpacing: '0.1em' }}>{doc.authCode}</code>
              </div>

              <div className="card">
                <div className="flex items-center gap-2 mb-4">
                  <ClockCircleOutlined style={{ color: 'var(--color-accent)' }} />
                  <h2 className="font-bold text-sm text-[var(--color-neutral-200)] tracking-wide uppercase"
                    style={{ fontFamily: 'var(--font-display)' }}>Quick Summary</h2>
                </div>
                <div className="space-y-3">
                  {[
                    ['Holder', doc.issuedTo],
                    ['Issuer', doc.issuedBy],
                    ['Type', doc.documentType],
                    ['Issued', formatDate(doc.dateIssued)],
                  ].map(([k, v]) => (
                    <div key={k} className="flex justify-between items-start gap-2">
                      <span className="text-xs text-[var(--color-neutral-500)]">{k}</span>
                      <span className="text-xs text-right text-[var(--color-neutral-200)] font-medium">{v}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="text-center p-4 rounded-xl" style={{ background: 'var(--color-surface-overlay)', border: '1px solid var(--color-border-subtle)' }}>
                <p className="text-xs text-[var(--color-neutral-600)] leading-relaxed">
                  DoxVerify is a document security tool. It is not liable for errors committed by the issuing institution.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
