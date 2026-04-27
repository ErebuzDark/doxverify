import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Table, Button, Tag, Modal, Form, Input, Select, DatePicker, message, Popconfirm, Space } from 'antd'
import {
  PlusOutlined, EditOutlined, DeleteOutlined, EyeOutlined,
  ArrowLeftOutlined, SearchOutlined, FileProtectOutlined
} from '@ant-design/icons'
import { documentStore } from '@/store/documentStore'
import { generateCode, formatDate, isExpired } from '@/lib/utils'
import dayjs from 'dayjs'

const DOC_TYPES = ['Diploma', 'Certificate', 'Transcript', 'Employment Record', 'License', 'Clearance', 'Other']
const ORG_TYPES = ['Academic Institution', 'Corporate', 'Government', 'NGO', 'Healthcare', 'Other']

function getStatus(doc) {
  if (doc.status === 'revoked') return 'revoked'
  if (isExpired(doc.viewableUntil)) return 'expired'
  return 'active'
}

function StatusTag({ doc }) {
  const s = getStatus(doc)
  const map = { active: 'green', expired: 'orange', revoked: 'red' }
  return <Tag color={map[s]} style={{ fontFamily: 'var(--font-display)', fontSize: '10px', letterSpacing: '0.05em', textTransform: 'uppercase' }}>{s}</Tag>
}

export default function AdminPage() {
  const navigate = useNavigate()
  const [docs, setDocs] = useState(() => documentStore.getAll())
  const [search, setSearch] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [editingDoc, setEditingDoc] = useState(null)
  const [form] = Form.useForm()

  const filtered = docs.filter(d =>
    d.authCode.toLowerCase().includes(search.toLowerCase()) ||
    d.issuedTo.toLowerCase().includes(search.toLowerCase()) ||
    d.issuedBy.toLowerCase().includes(search.toLowerCase()) ||
    d.documentType.toLowerCase().includes(search.toLowerCase())
  )

  const refresh = () => setDocs(documentStore.getAll())

  const openAdd = () => {
    setEditingDoc(null)
    form.resetFields()
    form.setFieldsValue({ authCode: generateCode('DOC') })
    setModalOpen(true)
  }

  const openEdit = (doc) => {
    setEditingDoc(doc)
    form.setFieldsValue({
      ...doc,
      dateIssued: doc.dateIssued ? dayjs(doc.dateIssued) : null,
      viewableUntil: doc.viewableUntil ? dayjs(doc.viewableUntil) : null,
    })
    setModalOpen(true)
  }

  const handleDelete = (id) => {
    documentStore.delete(id)
    refresh()
    message.success('Document deleted.')
  }

  const handleSave = async () => {
    try {
      const values = await form.validateFields()
      const payload = {
        ...values,
        dateIssued: values.dateIssued?.format('YYYY-MM-DD'),
        viewableUntil: values.viewableUntil?.format('YYYY-MM-DD'),
      }
      if (editingDoc) {
        documentStore.update(editingDoc.id, payload)
        message.success('Document updated.')
      } else {
        documentStore.add(payload)
        message.success('Document added.')
      }
      refresh()
      setModalOpen(false)
    } catch (_) { }
  }

  const columns = [
    {
      title: 'Auth Code',
      dataIndex: 'authCode',
      key: 'authCode',
      render: v => <code style={{ color: 'var(--color-accent)', fontSize: '12px', letterSpacing: '0.05em' }}>{v}</code>
    },
    { title: 'Type', dataIndex: 'documentType', key: 'documentType' },
    { title: 'Issued To', dataIndex: 'issuedTo', key: 'issuedTo' },
    { title: 'Issued By', dataIndex: 'issuedBy', key: 'issuedBy' },
    {
      title: 'Date Issued', dataIndex: 'dateIssued', key: 'dateIssued',
      render: v => <span style={{ color: 'var(--color-neutral-400)', fontSize: '12px' }}>{formatDate(v)}</span>
    },
    {
      title: 'Viewable Until', dataIndex: 'viewableUntil', key: 'viewableUntil',
      render: v => <span style={{ color: isExpired(v) ? 'var(--color-destructive)' : 'var(--color-neutral-400)', fontSize: '12px' }}>{formatDate(v)}</span>
    },
    {
      title: 'Status', key: 'status',
      render: (_, rec) => <StatusTag doc={rec} />
    },
    {
      title: 'Actions', key: 'actions',
      render: (_, rec) => (
        <Space>
          <Button size="small" type="text" icon={<EyeOutlined />}
            style={{ color: 'var(--color-accent)' }}
            onClick={() => navigate(`/verify/${rec.authCode}`)} />
          <Button size="small" type="text" icon={<EditOutlined />}
            style={{ color: 'var(--color-neutral-300)' }}
            onClick={() => openEdit(rec)} />
          <Popconfirm title="Delete this document?" onConfirm={() => handleDelete(rec.id)} okText="Yes" cancelText="No">
            <Button size="small" type="text" icon={<DeleteOutlined />}
              style={{ color: 'var(--color-destructive)' }} />
          </Popconfirm>
        </Space>
      )
    }
  ]

  return (
    <div className="min-h-screen" style={{ background: 'var(--color-surface)', fontFamily: 'var(--font-body)' }}>
      {/* Nav */}
      <nav className="flex items-center justify-between px-8 py-5 border-b border-(--color-border-subtle)">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate('/')}
            className="flex items-center gap-2 text-sm text-neutral-400 hover:text-neutral-100 transition-colors">
            <ArrowLeftOutlined />
          </button>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'var(--color-primary)' }}>
              <span className="text-white font-bold text-xs" style={{ fontFamily: 'var(--font-display)' }}>DV</span>
            </div>
            <div>
              <span className="font-bold text-neutral-100 tracking-tight" style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem' }}>
                DoxCheck
              </span>
              <span className="ml-3 text-xs px-2 py-0.5 rounded"
                style={{ background: 'var(--color-surface-overlay)', color: 'var(--color-neutral-400)', fontFamily: 'var(--font-display)', letterSpacing: '0.08em' }}>
                ADMIN
              </span>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-10">
        {/* Header */}
        <div className="flex items-start justify-between mb-8 fade-up">
          <div>
            <h1 className="text-3xl font-extrabold text-neutral-100" style={{ fontFamily: 'var(--font-display)' }}>
              Document Registry
            </h1>
            <p className="text-sm text-neutral-500 mt-1">
              {docs.length} total documents registered
            </p>
          </div>
          <button onClick={openAdd} className="btn-primary flex items-center gap-2">
            <PlusOutlined /> New Document
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 fade-up-2">
          {[
            { label: 'Total', value: docs.length, color: 'var(--color-accent)' },
            { label: 'Active', value: docs.filter(d => getStatus(d) === 'active').length, color: 'var(--color-success)' },
            { label: 'Expired', value: docs.filter(d => getStatus(d) === 'expired').length, color: 'var(--color-warning)' },
            { label: 'Revoked', value: docs.filter(d => getStatus(d) === 'revoked').length, color: 'var(--color-destructive)' },
          ].map(s => (
            <div key={s.label} className="card border-(--color-border-subtle)">
              <p className="text-2xl font-extrabold" style={{ fontFamily: 'var(--font-display)', color: s.color }}>{s.value}</p>
              <p className="text-xs text-neutral-500 mt-1 uppercase tracking-widest" style={{ fontFamily: 'var(--font-display)' }}>{s.label}</p>
            </div>
          ))}
        </div>

        {/* Table */}
        <div className="fade-up-3 card p-0 overflow-hidden">
          <div className="flex items-center justify-between p-5 border-b border-(--color-border-subtle)">
            <div className="flex items-center gap-2">
              <FileProtectOutlined style={{ color: 'var(--color-accent)' }} />
              <span className="font-bold text-sm text-neutral-200 uppercase tracking-wide"
                style={{ fontFamily: 'var(--font-display)' }}>All Documents</span>
            </div>
            <Input
              placeholder="Search by code, name, issuer..."
              prefix={<SearchOutlined style={{ color: 'var(--color-neutral-500)' }} />}
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{ width: 280, borderRadius: 8 }}
            />
          </div>
          <div style={{ padding: '0 0 8px' }}>
            <Table
              dataSource={filtered}
              columns={columns}
              rowKey="id"
              pagination={{ pageSize: 10, size: 'small' }}
              size="middle"
              scroll={{ x: true }}
            />
          </div>
        </div>
      </div>

      {/* Modal */}
      <Modal
        title={editingDoc ? 'Edit Document' : 'Add New Document'}
        open={modalOpen}
        onCancel={() => setModalOpen(false)}
        onOk={handleSave}
        okText={editingDoc ? 'Update' : 'Add Document'}
        okButtonProps={{ style: { background: 'var(--color-primary)', borderColor: 'var(--color-primary)', fontFamily: 'var(--font-display)' } }}
        cancelButtonProps={{ style: { color: 'var(--color-neutral-400)', borderColor: 'var(--color-border)', background: 'var(--color-surface-overlay)' } }}
        width={680}
      >
        <Form form={form} layout="vertical" style={{ marginTop: 16 }}>
          <div className="grid grid-cols-2 gap-x-4">
            <Form.Item label="Authentication Code" name="authCode" rules={[{ required: true }]} style={{ gridColumn: '1 / -1' }}>
              <Input style={{ fontFamily: 'monospace', letterSpacing: '0.08em' }}
                suffix={
                  <button type="button" onClick={() => form.setFieldsValue({ authCode: generateCode('DOC') })}
                    className="text-xs" style={{ color: 'var(--color-accent)' }}>Generate</button>
                } />
            </Form.Item>
            <Form.Item label="Document Type" name="documentType" rules={[{ required: true }]}>
              <Select options={DOC_TYPES.map(v => ({ value: v, label: v }))} />
            </Form.Item>
            <Form.Item label="Document Name" name="documentName" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
            <Form.Item label="Issued By" name="issuedBy" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
            <Form.Item label="Organization Type" name="orgType">
              <Select options={ORG_TYPES.map(v => ({ value: v, label: v }))} />
            </Form.Item>
            <Form.Item label="Issued To" name="issuedTo" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
            <Form.Item label="Status" name="status" initialValue="active">
              <Select options={[
                { value: 'active', label: 'Active' },
                { value: 'revoked', label: 'Revoked' },
              ]} />
            </Form.Item>
            <Form.Item label="Date Issued" name="dateIssued" rules={[{ required: true }]}>
              <DatePicker format="YYYY-MM-DD" />
            </Form.Item>
            <Form.Item label="Viewable Until" name="viewableUntil" rules={[{ required: true }]}>
              <DatePicker format="YYYY-MM-DD" />
            </Form.Item>
            <Form.Item label="Remarks" name="remarks" style={{ gridColumn: '1 / -1' }}>
              <Input.TextArea rows={2} />
            </Form.Item>
          </div>
        </Form>
      </Modal>
    </div>
  )
}
