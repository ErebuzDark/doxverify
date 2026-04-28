import { useParams, useNavigate } from 'react-router-dom'
import {
  CheckCircleOutlined, CloseCircleOutlined, WarningOutlined,
  ArrowLeftOutlined, CalendarOutlined, BankOutlined,
  FileTextOutlined, SafetyOutlined, ClockCircleOutlined,
  PictureOutlined, ZoomInOutlined
} from '@ant-design/icons'
import { Tag, Image } from 'antd'
import { useDocument } from '@/hooks/useDocuments'
import { formatDate, isExpired } from '@/lib/utils'
import { Layout } from '@/components/Layout'
import { Spin } from 'antd'

function StatusBadge({ doc }) {
  if (!doc) return null
  const expired = isExpired(doc.viewable_until || doc.viewableUntil)
  const status = (doc.status || '').toLowerCase()
  const revoked = status === 'revoked' || status === 'inactive'

  if (revoked) return (
    <div className="flex items-center gap-3 px-5 py-3 rounded-xl"
      style={{ background: 'var(--color-destructive-dim)', border: '1px solid oklch(58% 0.22 27 / 0.3)' }}>
      <CloseCircleOutlined style={{ color: 'var(--color-destructive)', fontSize: 20 }} />
      <div>
        <p className="font-bold text-sm" style={{ color: 'var(--color-destructive)', fontFamily: 'var(--font-display)' }}>{status === 'inactive' ? 'INACTIVE' : 'REVOKED'}</p>
        <p className="text-xs" style={{ color: 'oklch(58% 0.22 27 / 0.7)' }}>This document is not currently valid</p>
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

function InfoRow({ label, value, mono }) {
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
  const { data: doc, isLoading, isError } = useDocument(code)

  const notFound = !doc && !isLoading

  // Extract data from the new nested structure
  const master = doc?.document_master?.[0] || doc || {}
  const type = doc?.document_type?.[0] || {}
  const images = doc?.images || []

  // Dynamic fields 1-11 from master record
  const dynamicFields = []
  for (let i = 1; i <= 11; i++) {
    const val = master[`field_${i}`]
    if (val && val !== "" && val !== null) {
      if (typeof val === 'string' && val.includes('&~~')) {
        const parts = val.split('&~~')
        parts.forEach((p, idx) => {
          if (p.trim()) {
            // Try to be descriptive if it's the first field (usually Holder/Organization)
            const label = i === 1 ? (idx === 0 ? 'Organization' : 'Representative') : `Detail ${i}.${idx + 1}`
            dynamicFields.push({ label, value: p.trim() })
          }
        })
      } else {
        dynamicFields.push({ label: `Detail ${i}`, value: val })
      }
    }
  }

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Header Action */}
        <div className="mb-6 fade-up">
          <button onClick={() => navigate('/')}
            className="flex items-center gap-2 text-sm text-neutral-400 hover:text-neutral-100 transition-colors">
            <ArrowLeftOutlined /> Back to Search
          </button>
        </div>

        {/* Code display */}
        <div className="mb-8 fade-up">
          <p className="text-xs tracking-widest uppercase text-neutral-500 mb-1" style={{ fontFamily: 'var(--font-display)' }}>
            Authentication Code
          </p>
          <div className="flex items-center gap-4 flex-wrap">
            <h1 className="text-3xl font-extrabold text-neutral-100"
              style={{ fontFamily: 'var(--font-display)', letterSpacing: '0.04em' }}>
              {master.authentication_code || code}
            </h1>
            {doc && <StatusBadge doc={master} />}
          </div>
        </div>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-32">
            <Spin size="large" />
            <p className="mt-4 text-neutral-500 font-medium">Verifying code...</p>
          </div>
        ) : isError ? (
          <div className="fade-up-2 flex flex-col items-center justify-center py-24 text-center">
            <div className="w-20 h-20 rounded-2xl flex items-center justify-center mb-6"
              style={{ background: 'var(--color-surface-overlay)', border: '1px solid var(--color-border)' }}>
              <WarningOutlined style={{ fontSize: 36, color: 'var(--color-warning)' }} />
            </div>
            <h2 className="text-2xl font-bold text-neutral-100 mb-3" style={{ fontFamily: 'var(--font-display)' }}>
              Verification Error
            </h2>
            <p className="text-neutral-500 max-w-md text-sm leading-relaxed">
              We encountered an issue while trying to verify this code. Please check your connection or try again later.
            </p>
            <button onClick={() => window.location.reload()}
              className="mt-8 btn-primary">
              Retry Verification
            </button>
          </div>
        ) : notFound ? (
          /* Not Found */
          <div className="fade-up-2 flex flex-col items-center justify-center py-24 text-center">
            <div className="w-20 h-20 rounded-2xl flex items-center justify-center mb-6"
              style={{ background: 'var(--color-surface-overlay)', border: '1px solid var(--color-border)' }}>
              <CloseCircleOutlined style={{ fontSize: 36, color: 'var(--color-destructive)' }} />
            </div>
            <h2 className="text-2xl font-bold text-neutral-100 mb-3" style={{ fontFamily: 'var(--font-display)' }}>
              Document Not Found
            </h2>
            <p className="text-neutral-500 max-w-md text-sm leading-relaxed">
              The authentication code <code className="text-(--color-accent) bg-(--color-surface-overlay) px-2 py-0.5 rounded">{code}</code> does not match any registered document in our system.
            </p>
            <p className="text-neutral-600 text-xs mt-4">
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
                  <h2 className="font-bold text-sm text-neutral-200 tracking-wide uppercase"
                    style={{ fontFamily: 'var(--font-display)' }}>Document Information</h2>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <InfoRow label="Document Type" value={type.document_type || master.documentType} />
                  <InfoRow label="Document Name" value={type.document_name || master.documentName} />
                  <InfoRow label="Authentication Code" value={master.authentication_code || master.authCode || code} mono />
                  <InfoRow label="Status" value={
                    <Tag color={master.status?.toLowerCase() === 'active' ? 'green' : master.status?.toLowerCase() === 'expired' ? 'orange' : 'red'}
                      style={{ fontFamily: 'var(--font-display)', letterSpacing: '0.05em', textTransform: 'uppercase', fontSize: '10px' }}>
                      {master.status || 'Unknown'}
                    </Tag>
                  } />
                </div>
              </div>

              {/* Issuer & Dynamic Fields */}
              <div className="card">
                <div className="flex items-center gap-2 mb-5">
                  <BankOutlined style={{ color: 'var(--color-accent)' }} />
                  <h2 className="font-bold text-sm text-neutral-200 tracking-wide uppercase"
                    style={{ fontFamily: 'var(--font-display)' }}>Issuer & Recipient Details</h2>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <InfoRow label="Issued By" value={master.issued_by || master.issuedBy} />
                  {dynamicFields.map((f, idx) => (
                    <InfoRow key={`${f.label}-${idx}`} label={f.label} value={f.value} />
                  ))}
                  {master.remarks && <InfoRow label="Remarks" value={master.remarks} />}
                </div>
              </div>

              {/* Dates */}
              <div className="card">
                <div className="flex items-center gap-2 mb-5">
                  <CalendarOutlined style={{ color: 'var(--color-accent)' }} />
                  <h2 className="font-bold text-sm text-neutral-200 tracking-wide uppercase"
                    style={{ fontFamily: 'var(--font-display)' }}>Validity Period</h2>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <InfoRow label="Date Issued" value={formatDate(master.issued_date || master.dateIssued)} />
                  <InfoRow label="Viewable Until" value={formatDate(master.viewable_until || master.viewableUntil)} />
                </div>
                {/* Progress bar */}
                <div className="mt-5">
                  <div className="flex justify-between text-xs text-neutral-500 mb-1.5">
                    <span>{formatDate(master.issued_date || master.dateIssued)}</span>
                    <span>{formatDate(master.viewable_until || master.viewableUntil)}</span>
                  </div>
                  <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'var(--color-surface-overlay)' }}>
                    {(() => {
                      const start = new Date(master.issued_date || master.dateIssued).getTime()
                      const end = new Date(master.viewable_until || master.viewableUntil).getTime()
                      if (isNaN(start) || isNaN(end) || end === start) {
                        return <div className="h-full rounded-full transition-all" style={{ width: '0%', background: 'var(--color-success)' }} />
                      }
                      const now = Date.now()
                      const pct = Math.min(100, Math.max(0, ((now - start) / (end - start)) * 100))
                      const expired = isExpired(master.viewable_until || master.viewableUntil)
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

              <div className='flex flex-row gap-4 '>
                <div className="card text-center flex-1">
                  <div className="flex items-center gap-2 justify-center mb-5">
                    <SafetyOutlined style={{ color: 'var(--color-accent)' }} />
                    <h2 className="font-bold text-sm text-neutral-200 tracking-wide uppercase"
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
                  <p className="text-xs text-neutral-500 mb-1">Scan to verify</p>
                  <code className="text-xs text-(--color-accent)" style={{ letterSpacing: '0.1em' }}>{master.authentication_code || master.authCode || code}</code>
                </div>

                <div className="card flex-1">
                  <div className="flex items-center gap-2 mb-4">
                    <ClockCircleOutlined style={{ color: 'var(--color-accent)' }} />
                    <h2 className="font-bold text-sm text-neutral-200 tracking-wide uppercase"
                      style={{ fontFamily: 'var(--font-display)' }}>Quick Summary</h2>
                  </div>
                  <div className="space-y-3">
                    {[
                      ['Issuer', master.issued_by || master.issuedBy],
                      ['Type', type.document_type || master.documentType],
                      ['Name', type.document_name || master.documentName],
                      ['Issued', formatDate(master.issued_date || master.dateIssued)],
                      ['Code', master.authentication_code || master.authCode || code],
                    ].map(([k, v]) => (
                      <div key={k} className="flex justify-between items-start gap-2">
                        <span className="text-xs text-neutral-500">{k}</span>
                        <span className="text-xs text-right text-neutral-200 font-medium">{v}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

            </div>

            {/* Right: QR / Summary */}
            <div className="space-y-5 fade-up-3">

              {/* Document Image Preview */}
              <div className="card overflow-hidden p-0">
                <div className="p-5 border-b border-(--color-border-subtle) flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <PictureOutlined style={{ color: 'var(--color-accent)' }} />
                    <h2 className="font-bold text-sm text-neutral-200 tracking-wide uppercase"
                      style={{ fontFamily: 'var(--font-display)' }}>Document Images</h2>
                  </div>
                  <Tag color="blue" className="m-0 text-[10px] uppercase font-bold">
                    {images?.length > 1 ? `${images.length} Pages` : 'Official Scan'}
                  </Tag>
                </div>

                <div className="p-4 bg-black/10">
                  {images && images.length > 0 ? (
                    <Image.PreviewGroup>
                      <div className="flex flex-col gap-4">
                        {/* Main Preview (First Image) */}
                        <div className="relative group rounded-xl overflow-hidden border border-(--color-border-subtle) bg-black/20 aspect-3/4 flex items-center justify-center">
                          <Image
                            src={images[0].image_link_url}
                            alt="Document page 1"
                            className="w-full h-full object-contain"
                            preview={{
                              mask: (
                                <div className="flex flex-col items-center gap-2">
                                  <ZoomInOutlined className="text-2xl" />
                                  <span className="text-xs font-bold uppercase tracking-widest">View Full Page 1</span>
                                </div>
                              )
                            }}
                          />
                          <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-md px-2 py-1 rounded text-[10px] text-white font-bold uppercase tracking-wider border border-white/10">
                            Page 1
                          </div>
                        </div>

                        {/* Thumbnails if multiple images */}
                        {images.length > 1 && (
                          <div className="grid grid-cols-4 gap-2 overflow-x-auto pb-2 custom-scrollbar">
                            {images.slice(1).map((img, idx) => (
                              <div key={idx} className="relative group rounded-lg overflow-hidden border border-(--color-border-subtle) bg-black/20 aspect-3/4 flex items-center justify-center">
                                <Image
                                  src={img.image_link_url}
                                  alt={`Document page ${idx + 2}`}
                                  className="w-full h-full object-contain"
                                  preview={{
                                    mask: <ZoomInOutlined className="text-lg" />
                                  }}
                                />
                                <div className="absolute bottom-1 left-1 bg-black/60 backdrop-blur-sm px-1.5 py-0.5 rounded text-[8px] text-white font-bold border border-white/5">
                                  P{idx + 2}
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </Image.PreviewGroup>
                  ) : (master.image_link_url || doc.image_link_url) ? (
                    <div className="relative group rounded-xl overflow-hidden border border-(--color-border-subtle) bg-black/20">
                      <Image
                        src={master.image_link_url || doc.image_link_url}
                        alt="Document scan"
                        className="w-full h-auto"
                        preview={{
                          mask: (
                            <div className="flex flex-col items-center gap-2">
                              <ZoomInOutlined className="text-2xl" />
                              <span className="text-xs font-bold uppercase tracking-widest">View Full Document</span>
                            </div>
                          )
                        }}
                      />
                    </div>
                  ) : (
                    <div className="text-center py-16">
                      <PictureOutlined className="text-4xl text-neutral-700 mb-2" />
                      <p className="text-xs text-neutral-500">No image scan available</p>
                    </div>
                  )}
                </div>

                <div className="p-3 bg-(--color-surface-overlay) text-center border-t border-(--color-border-subtle)">
                  <p className="text-[10px] text-neutral-500 uppercase tracking-widest font-bold">Secure Verification Preview</p>
                </div>
              </div>

              <div className="text-center p-4 rounded-xl" style={{ background: 'var(--color-surface-overlay)', border: '1px solid var(--color-border-subtle)' }}>
                <p className="text-xs text-neutral-600 leading-relaxed">
                  DoxCheck is a document security tool. It is not liable for errors committed by the issuing institution.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  )
}
