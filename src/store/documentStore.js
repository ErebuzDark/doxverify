// In-memory document store (simulates a database)
// In a real app, this would be an API

const STORAGE_KEY = 'doxverify_documents'

const initialDocuments = [
  {
    id: '1',
    authCode: 'DIPLOMA1',
    documentType: 'Diploma',
    documentName: 'Bachelor of Science in Computer Science',
    issuedBy: 'University of the Philippines',
    issuedTo: 'Juan Dela Cruz',
    dateIssued: '2018-03-15',
    viewableUntil: '2030-03-13',
    remarks: 'Magna Cum Laude',
    status: 'active',
    organization: 'University of the Philippines',
    orgType: 'Academic Institution',
    createdAt: '2024-01-10',
  },
  {
    id: '2',
    authCode: 'CERT-2024A',
    documentType: 'Certificate',
    documentName: 'Certificate of Employment',
    issuedBy: 'Acme Corporation',
    issuedTo: 'Maria Santos',
    dateIssued: '2024-01-15',
    viewableUntil: '2026-01-15',
    remarks: 'Regular Employee',
    status: 'active',
    organization: 'Acme Corporation',
    orgType: 'Corporate',
    createdAt: '2024-01-15',
  },
  {
    id: '3',
    authCode: 'TOR-20220B',
    documentType: 'Transcript',
    documentName: 'Official Transcript of Records',
    issuedBy: 'De La Salle University',
    issuedTo: 'Pedro Reyes',
    dateIssued: '2022-10-20',
    viewableUntil: '2025-01-01',
    remarks: 'For Board Exam purposes',
    status: 'expired',
    organization: 'De La Salle University',
    orgType: 'Academic Institution',
    createdAt: '2022-10-20',
  },
]

function getDocuments() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) return JSON.parse(stored)
  } catch (_) {}
  saveDocuments(initialDocuments)
  return initialDocuments
}

function saveDocuments(docs) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(docs))
}

export const documentStore = {
  getAll() {
    return getDocuments()
  },

  getByCode(code) {
    const docs = getDocuments()
    return docs.find(d => d.authCode.toLowerCase() === code.toLowerCase()) || null
  },

  add(doc) {
    const docs = getDocuments()
    const newDoc = { ...doc, id: Date.now().toString(), createdAt: new Date().toISOString().split('T')[0] }
    docs.unshift(newDoc)
    saveDocuments(docs)
    return newDoc
  },

  update(id, updates) {
    const docs = getDocuments()
    const idx = docs.findIndex(d => d.id === id)
    if (idx === -1) return null
    docs[idx] = { ...docs[idx], ...updates }
    saveDocuments(docs)
    return docs[idx]
  },

  delete(id) {
    const docs = getDocuments()
    const filtered = docs.filter(d => d.id !== id)
    saveDocuments(filtered)
  },
}
