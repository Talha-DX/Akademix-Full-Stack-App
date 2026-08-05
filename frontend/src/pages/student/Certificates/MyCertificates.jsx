import { useEffect, useState } from 'react'
import { FileBadge, Download } from 'lucide-react'
import { certificateApi } from '../../../api/certificateApi'
import { useAuth } from '../../../hooks/useAuth'
import { useNotificationContext } from '../../../context/NotificationContext'
import { getApiErrorMessage } from '../../../utils/adminPeople'

export default function MyCertificates() {
  const { user } = useAuth()
  const { notify } = useNotificationContext()
  const [certificates, setCertificates] = useState([])
  const studentId = user?.student?.id

  useEffect(() => {
    if (!studentId) return
    certificateApi.list({ studentId })
      .then((res) => setCertificates(Array.isArray(res.data) ? res.data : []))
      .catch((error) => notify(getApiErrorMessage(error, 'Failed to load certificates.'), 'error'))
  }, [studentId])

  const handleDownload = async (cert) => {
    try {
      const res = await certificateApi.downloadPdf(cert.id)
      const url = window.URL.createObjectURL(new Blob([res.data], { type: 'application/pdf' }))
      const link = document.createElement('a')
      link.href = url
      link.download = `${cert.type || 'certificate'}-${cert.id}.pdf`
      link.click()
      window.URL.revokeObjectURL(url)
    } catch (error) {
      notify(getApiErrorMessage(error, 'Failed to download the certificate.'), 'error')
    }
  }

  if (!studentId) {
    return <div className="card p-6 text-sm text-ink-soft">Your student profile could not be found.</div>
  }

  return (
    <div className="space-y-6">
      <div className="card p-6">
        <div className="flex items-center gap-3">
          <div className="rounded-2xl bg-brand-50 p-3 text-brand-700">
            <FileBadge size={18} />
          </div>
          <div>
            <p className="font-display text-xl font-semibold text-ink">My certificates</p>
            <p className="mt-1 text-sm text-ink-soft">Certificates issued to you, downloadable as real PDFs.</p>
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {certificates.map((cert) => (
          <div key={cert.id} className="card flex items-center justify-between p-5">
            <div>
              <p className="font-display text-sm font-semibold text-ink">{cert.type}</p>
              <p className="mt-1 text-xs text-ink-soft">Issued {new Date(cert.issuedDate || cert.createdAt).toLocaleDateString()}</p>
            </div>
            <button onClick={() => handleDownload(cert)} className="flex items-center gap-1.5 rounded-lg bg-brand-600 px-3 py-2 text-xs font-medium text-white hover:bg-brand-700">
              <Download size={14} /> Download
            </button>
          </div>
        ))}
        {!certificates.length && <p className="text-sm text-ink-soft">No certificates have been issued to you yet.</p>}
      </div>
    </div>
  )
}
