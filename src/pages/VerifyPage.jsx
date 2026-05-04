import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useTheme } from '@/context/ThemeContext'
import {
  CheckCircleOutlined, CloseCircleOutlined, WarningOutlined,
  ArrowLeftOutlined, CalendarOutlined, BankOutlined,
  FileTextOutlined, SafetyOutlined, ClockCircleOutlined,
  PictureOutlined, ZoomInOutlined, FilePdfOutlined,
  LockOutlined, HistoryOutlined, CrownOutlined, CreditCardOutlined,
} from '@ant-design/icons'
import { Tag, Image, Modal, message } from 'antd'
import { useDocument } from '@/hooks/useDocuments'
import { formatDate, isExpired } from '@/lib/utils'
import { Layout } from '@/components/Layout'
import { Spin } from 'antd'

function FilePreview({ file, index, onPDFClick }) {
  const url = file.image_link_url
  const isPDF = url?.toLowerCase().split('?')[0].endsWith('.pdf') || url?.toLowerCase().includes('.pdf')

  // Prevent right-click and drag on images
  const secureProps = {
    onContextMenu: (e) => e.preventDefault(),
    onDragStart: (e) => e.preventDefault(),
    style: { userSelect: 'none', WebkitUserSelect: 'none' }
  }

  if (isPDF) {
    return (
      <div
        className="group relative rounded-xl border border-(--color-border-subtle) bg-black/20 aspect-3/4 flex flex-col items-center justify-center gap-3 hover:bg-black/30 transition-all cursor-pointer overflow-hidden p-4"
        onClick={() => onPDFClick(url)}
        {...secureProps}
      >
        <div className="w-12 h-12 rounded-xl bg-(--color-destructive-dim) flex items-center justify-center text-(--color-destructive) group-hover:scale-110 transition-transform">
          <FilePdfOutlined style={{ fontSize: 24 }} />
        </div>
        <div className="text-center">
          <p className="text-[10px] font-bold text-neutral-200 uppercase tracking-wider mb-0.5">Page {index + 1}</p>
          <p className="text-[8px] text-neutral-500 uppercase tracking-widest font-bold">Secure PDF View</p>
        </div>
        <FilePdfOutlined className="absolute -bottom-4 -right-4 text-6xl text-white/5 -rotate-12 group-hover:rotate-0 transition-all duration-500" />
      </div>
    )
  }

  return (
    <div
      className="relative group rounded-xl overflow-hidden border border-(--color-border-subtle) bg-black/20 aspect-3/4 flex items-center justify-center"
      {...secureProps}
    >
      <Image
        src={url}
        alt={`Document page ${index + 1}`}
        className="w-full h-full object-contain pointer-events-none"
        preview={{
          cover: (
            <div className="flex flex-col items-center gap-1">
              <ZoomInOutlined className="text-xl" />
              <span className="text-[8px] font-bold uppercase tracking-widest">Secure View</span>
            </div>
          ),
          onContextMenu: (e) => e.preventDefault()
        }}
      />
      <div className="absolute bottom-2 left-2 bg-black/60 backdrop-blur-md px-1.5 py-0.5 rounded text-[8px] text-white font-bold uppercase tracking-wider border border-white/10 pointer-events-none">
        P{index + 1}
      </div>
    </div>
  )
}

function StatusBadge({ doc }) {
  if (!doc) return null
  const expired = isExpired(doc.viewable_until || doc.viewableUntil)
  const status = (doc.status || '').toLowerCase()
  const revoked = status === 'revoked' || status === 'inactive'

  if (revoked) return (
    <div className="flex items-center gap-3 px-5 py-2 rounded-xl"
      style={{ background: 'var(--color-destructive-dim)', border: '1px solid oklch(58% 0.22 27 / 0.3)' }}>
      <CloseCircleOutlined style={{ color: 'var(--color-destructive)', fontSize: 20 }} />
      <div className='flex flex-col gap-0'>
        <p className="font-bold text-sm leading-3" style={{ color: 'var(--color-destructive)', fontFamily: 'var(--font-display)' }}>{status === 'inactive' ? 'INACTIVE' : 'REVOKED'}</p>
        <p className="text-xs" style={{ color: 'oklch(58% 0.22 27 / 0.7)' }}>This document is not currently valid</p>
      </div>
    </div>
  )

  if (expired) return (
    <div className="flex items-center gap-3 px-5 py-2 rounded-xl"
      style={{ background: 'var(--color-warning-dim)', border: '1px solid oklch(72% 0.18 75 / 0.3)' }}>
      <WarningOutlined style={{ color: 'var(--color-warning)', fontSize: 20 }} />
      <div className='flex flex-col gap-0'>
        <p className="font-bold text-sm leading-3" style={{ color: 'var(--color-warning)', fontFamily: 'var(--font-display)' }}>EXPIRED</p>
        <p className="text-xs" style={{ color: 'oklch(72% 0.18 75 / 0.7)' }}>View period has ended</p>
      </div>
    </div>
  )

  return (
    <div className="flex items-center gap-3 px-5 py-2 rounded-xl"
      style={{ background: 'var(--color-success-dim)', border: '1px solid oklch(62% 0.20 155 / 0.3)' }}>
      <CheckCircleOutlined style={{ color: 'var(--color-success)', fontSize: 20 }} />
      <div className='flex flex-col gap-0'>
        <p className="font-bold text-sm leading-3" style={{ color: 'var(--color-success)', fontFamily: 'var(--font-display)' }}>VERIFIED</p>
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
  const [activePDF, setActivePDF] = useState(null)
  const [pdfLoading, setPdfLoading] = useState(false)
  const { theme } = useTheme()
  const isDark = theme === 'dark'

  const notFound = !doc && !isLoading

  // Extract data from the new nested structure
  const master = doc?.document_master?.[0] || doc || {}
  const type = doc?.document_type?.[0] || {}
  const images = doc?.images || []
  const expired = isExpired(master.viewable_until || master.viewableUntil)

  // Global protection: Disable right-click and common shortcuts
  useEffect(() => {
    const handleContextMenu = (e) => e.preventDefault()
    const handleKeyDown = (e) => {
      // Disable Ctrl+P / Cmd+P (Print) and Ctrl+S / Cmd+S (Save)
      if ((e.ctrlKey || e.metaKey) && (e.key === 'p' || e.key === 's')) {
        e.preventDefault()
        message.info('Downloading or printing is disabled for document security.')
      }
    }

    document.addEventListener('contextmenu', handleContextMenu)
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('contextmenu', handleContextMenu)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [])

  useEffect(() => {
    if (activePDF) setPdfLoading(true)
  }, [activePDF])

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
      {/* Expiration Gate Modal */}
      <Modal
        open={expired && !isLoading && !!doc}
        footer={null}
        closable={false}
        mask={{ closable: false }}
        centered
        width={700}
        styles={{
          content: { padding: 0, background: 'transparent', boxShadow: 'none' },
          body: {
            padding: 0,
            overflow: 'hidden',
            background: isDark ? '#0a0a0a' : '#ffffff',
            borderRadius: '32px',
            border: isDark ? '1px solid rgba(255,255,255,0.05)' : '1px solid rgba(0,0,0,0.05)'
          },
          mask: {
            backdropFilter: 'blur(40px)',
            background: isDark ? 'rgba(0,0,0,0.75)' : 'rgba(255,255,255,0.75)'
          }
        }}
      >
        <div className="p-8 md:p-12 text-center relative overflow-hidden">
          {/* Background decoration */}
          <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-transparent via-(--color-warning) to-transparent" />

          <div className="w-20 h-20 rounded-3xl bg-(--color-warning-dim) text-(--color-warning) flex items-center justify-center mx-auto mb-8 shadow-2xl animate-pulse">
            <LockOutlined style={{ fontSize: 40 }} />
          </div>

          <h2 className="text-3xl font-black mb-4 tracking-tight"
            style={{ fontFamily: 'var(--font-display)', color: isDark ? '#fff' : '#111' }}>
            Document View Period Expired
          </h2>
          <p className="text-sm leading-relaxed mb-10 max-w-md mx-auto font-medium"
            style={{ color: isDark ? 'rgba(255,255,255,0.6)' : 'rgba(0,0,0,0.6)' }}>
            Your document view period has ended. If you want to regain access and extend the viewable date, please select a plan below.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { title: 'Standard', duration: '1 Year', price: '$2.00', icon: <HistoryOutlined />, recommended: false },
              { title: 'Preferred', duration: '5 Years', price: '$5.00  ', icon: <CrownOutlined />, recommended: true },
              { title: 'Ultimate', duration: 'Lifetime', price: '$', icon: <CreditCardOutlined />, recommended: false },
            ].map((plan, i) => (
              <div key={i}
                className={`relative p-6 rounded-2xl border transition-all cursor-pointer group shadow-sm hover:shadow-md ${plan.recommended
                  ? 'scale-105 z-10 shadow-xl'
                  : ''
                  }`}
                style={{
                  background: plan.recommended
                    ? (isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)')
                    : (isDark ? 'rgba(255,255,255,0.02)' : '#f9f9f9'),
                  borderColor: plan.recommended
                    ? 'var(--color-warning)'
                    : (isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)')
                }}
              >
                {plan.recommended && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-(--color-warning) text-black text-[9px] text-nowrap font-black px-3 py-1 rounded-full uppercase tracking-widest shadow-lg">
                    Best Value
                  </div>
                )}
                <div className="w-10 h-10 rounded-xl flex items-center justify-center mx-auto mb-4"
                  style={{
                    background: plan.recommended ? 'var(--color-warning)' : (isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'),
                    color: plan.recommended ? '#000' : (isDark ? '#aaa' : '#666')
                  }}>
                  {plan.icon}
                </div>
                <h4 className="text-[10px] font-bold mb-1 uppercase tracking-widest"
                  style={{ color: isDark ? '#fff' : '#111' }}>
                  {plan.duration}
                </h4>
                <div className="text-xl font-black mb-4"
                  style={{ color: isDark ? '#fff' : '#111' }}>
                  {plan.price}
                </div>
                <button className="w-full py-2.5 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all border-none"
                  style={{
                    background: plan.recommended
                      ? (isDark ? '#fff' : '#000')
                      : (isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)'),
                    color: plan.recommended
                      ? (isDark ? '#000' : '#fff')
                      : (isDark ? '#fff' : '#111')
                  }}>
                  Select Plan
                </button>
              </div>
            ))}
          </div>

          <button onClick={() => navigate('/')}
            className="mt-12 text-[10px] font-bold uppercase tracking-widest transition-colors bg-transparent border-none cursor-pointer"
            style={{ color: isDark ? '#555' : '#888' }}>
            Return to Homepage
          </button>
        </div>
      </Modal>

      <div className={`max-w-4xl mx-auto px-6 py-12 select-none transition-all duration-1000 ${expired && !isLoading && !!doc ? 'blur-[30px] grayscale pointer-events-none' : ''}`}>
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

        {/* Secure PDF Modal */}
        <Modal
          open={!!activePDF}
          onCancel={() => setActivePDF(null)}
          footer={null}
          width={1200}
          centered
          styles={{
            body: { padding: 0, overflow: 'hidden', background: '#111', height: '85vh', borderRadius: '12px' },
            mask: { backdropFilter: 'blur(12px)', background: 'rgba(0,0,0,0.85)' }
          }}
          closeIcon={null}
        >
          <div className="relative w-full h-full flex flex-col">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-white/5 flex items-center justify-between bg-black/40 backdrop-blur-xl">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-(--color-destructive-dim) flex items-center justify-center text-(--color-destructive)">
                  <FilePdfOutlined style={{ fontSize: 20 }} />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white mb-0.5 tracking-wide" style={{ fontFamily: 'var(--font-display)' }}>
                    {type.document_name || 'Official Document'}
                  </h3>
                  <div className="flex items-center gap-2">
                    <LockOutlined className="text-[10px] text-green-500" />
                    <span className="text-[10px] text-neutral-500 uppercase tracking-widest font-bold">Encrypted Secure Viewer</span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setActivePDF(null)}
                className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-white transition-all border border-white/10"
              >
                <CloseCircleOutlined style={{ fontSize: 18 }} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="relative flex-1 bg-[#1a1a1a] overflow-hidden">
              {pdfLoading && (
                <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-[#1a1a1a]">
                  <Spin size="large" />
                  <p className="mt-4 text-xs text-neutral-500 uppercase tracking-[0.2em] font-bold">Decrypting Document...</p>
                </div>
              )}
              <iframe
                src={`${activePDF}#toolbar=0&navpanes=0&scrollbar=1`}
                className="w-full h-full border-none"
                title="Secure Document Preview"
                onLoad={() => setPdfLoading(false)}
              />

              {/* Interaction Blocker */}
              <div className="absolute inset-0 pointer-events-none" onContextMenu={(e) => e.preventDefault()} />
            </div>

            {/* Modal Footer / Protection Badge */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 pointer-events-none">
              <div className="bg-black/60 backdrop-blur-xl px-5 py-2.5 rounded-2xl border border-white/10 flex items-center gap-3 shadow-2xl">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                <span className="text-[10px] text-white/90 uppercase tracking-[0.2em] font-bold">
                  Protected Verification Seal • No Download/Print
                </span>
              </div>
            </div>
          </div>
        </Modal>

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

              {/* Document Files Preview */}
              <div className="card overflow-hidden p-0">
                <div className="flex flex-col p-5 border-b border-(--color-border-subtle) items-start justify-between">
                  <div className="flex items-center gap-2">
                    <PictureOutlined style={{ color: 'var(--color-accent)' }} />
                    <h2 className="font-bold text-sm text-neutral-200 tracking-wide uppercase"
                      style={{ fontFamily: 'var(--font-display)' }}>Official Documents</h2>
                  </div>
                  <Tag color="blue" className="m-0 text-[10px] uppercase font-bold">
                    {images?.length > 1 ? `${images.length} Files` : 'Verified Copy'}
                  </Tag>
                </div>

                <div className="p-4 bg-black/10">
                  {images && images.length > 0 ? (
                    <Image.PreviewGroup>
                      <div className="grid grid-cols-2 gap-4">
                        {images.map((file, idx) => (
                          <FilePreview key={idx} file={file} index={idx} onPDFClick={setActivePDF} />
                        ))}
                      </div>
                    </Image.PreviewGroup>
                  ) : (master.image_link_url || doc.image_link_url) ? (
                    <div className="max-w-xs mx-auto">
                      <FilePreview file={{ image_link_url: master.image_link_url || doc.image_link_url }} index={0} onPDFClick={setActivePDF} />
                    </div>
                  ) : (
                    <div className="text-center py-16">
                      <PictureOutlined className="text-4xl text-neutral-700 mb-2" />
                      <p className="text-xs text-neutral-500">No document preview available</p>
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
