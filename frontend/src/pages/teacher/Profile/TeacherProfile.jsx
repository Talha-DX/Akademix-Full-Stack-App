import { useEffect, useState } from 'react'
import { profileApi } from '../../../api/profileApi'
import { useNotificationContext } from '../../../context/NotificationContext'
import { getApiErrorMessage } from '../../../utils/adminPeople'

export default function TeacherProfile() {
  const { notify } = useNotificationContext()
  const [profile, setProfile] = useState(null)
  const [form, setForm] = useState({ name: '', phone: '', avatar: '' })
  const load = async () => {
    try { const { data } = await profileApi.get(); setProfile(data); setForm({ name: data.name || '', phone: data.phone || '', avatar: data.avatar || '' }) }
    catch (error) { notify(getApiErrorMessage(error, 'Failed to load your profile.'), 'error') }
  }
  useEffect(() => { load() }, [])
  const save = async (event) => {
    event.preventDefault()
    try { await profileApi.update(form); notify('Profile updated.', 'success'); await load() }
    catch (error) { notify(getApiErrorMessage(error, 'Failed to update your profile.'), 'error') }
  }
  return <div className="card max-w-2xl p-6">
    <h1 className="font-display text-xl font-semibold text-ink">My Profile</h1>
    <p className="mt-1 text-sm text-ink-soft">Subjects: {profile?.staff?.subjects?.map((subject) => subject.name).join(', ') || 'None assigned'}</p>
    <form className="mt-6 grid gap-4 sm:grid-cols-2" onSubmit={save}>
      <label className="text-sm text-ink">Name<input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="mt-1 w-full rounded-lg border border-line p-2" /></label>
      <label className="text-sm text-ink">Email<input disabled value={profile?.email || ''} className="mt-1 w-full rounded-lg border border-line bg-surface-tint p-2" /></label>
      <label className="text-sm text-ink">Phone<input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="mt-1 w-full rounded-lg border border-line p-2" /></label>
      <label className="text-sm text-ink">Avatar URL<input value={form.avatar} onChange={(e) => setForm({ ...form, avatar: e.target.value })} className="mt-1 w-full rounded-lg border border-line p-2" /></label>
      <button className="w-fit rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white">Save changes</button>
    </form>
  </div>
}
