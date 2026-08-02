import { useEffect, useState } from 'react'
import { Building2, CalendarDays, CheckCircle2, Image, MapPin, Save, ShieldCheck } from 'lucide-react'
import { schoolApi } from '../../../api/schoolApi'

const blankSettings = { name: '', logo: '', address: '', academicYear: '' }

export default function InstituteProfile() {
  const [settings, setSettings] = useState(blankSettings)
  const [initial, setInitial] = useState(blankSettings)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [notice, setNotice] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    schoolApi.getSettings()
      .then(({ data }) => { const next = { name: data.name ?? '', logo: data.logo ?? '', address: data.address ?? '', academicYear: data.academicYear ?? '' }; setSettings(next); setInitial(next) })
      .catch((requestError) => setError(requestError.response?.data?.message ?? 'Could not load school settings.'))
      .finally(() => setLoading(false))
  }, [])

  const update = (field) => (event) => { setSettings((current) => ({ ...current, [field]: event.target.value })); setNotice('') }
  const changed = JSON.stringify(settings) !== JSON.stringify(initial)

  async function save(event) {
    event.preventDefault(); setSaving(true); setError(''); setNotice('')
    try { const { data } = await schoolApi.updateSettings(settings); const next = { name: data.name ?? '', logo: data.logo ?? '', address: data.address ?? '', academicYear: data.academicYear ?? '' }; setSettings(next); setInitial(next); setNotice('Settings saved successfully.') }
    catch (requestError) { setError(requestError.response?.data?.message ?? 'Could not save your changes. Please review the fields and try again.') }
    finally { setSaving(false) }
  }

  if (loading) return <div className="card p-6 text-sm text-ink-soft">Loading general settings…</div>
  if (error && !settings.name) return <div className="card p-6 text-sm text-coral-600">{error}</div>

  return <form onSubmit={save} className="mx-auto max-w-6xl space-y-6">
    <section className="relative overflow-hidden rounded-xl2 bg-ink px-6 py-7 text-white sm:px-8">
      <div className="absolute -right-14 -top-20 h-56 w-56 rounded-full bg-brand-500/40 blur-3xl" aria-hidden="true" />
      <div className="relative flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
        <div><p className="text-xs font-mono uppercase tracking-[.14em] text-brand-200">Administration</p><h1 className="mt-2 font-display text-2xl font-semibold">General settings</h1><p className="mt-2 max-w-xl text-sm leading-relaxed text-white/70">Control the institution information that appears throughout your school portal, documents, and reports.</p></div>
        <div className="flex items-center gap-2 self-start rounded-full border border-white/15 bg-white/10 px-3 py-2 text-xs text-white/80"><ShieldCheck size={15} className="text-brand-200"/> Admin-only changes</div>
      </div>
    </section>

    {(notice || error) && <div className={`flex items-center gap-2 rounded-lg px-4 py-3 text-sm ${notice ? 'bg-emerald-50 text-emerald-700' : 'bg-coral-500/10 text-coral-600'}`}><CheckCircle2 size={17}/>{notice || error}</div>}

    <div className="grid gap-6 lg:grid-cols-[1.45fr_.8fr]">
      <section className="card p-6 sm:p-7"><div className="flex items-center gap-3"><span className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-50 text-brand-600"><Building2 size={20}/></span><div><h2 className="font-display text-lg font-semibold text-ink">School identity</h2><p className="text-sm text-ink-soft">The essentials used to identify your institution.</p></div></div>
        <div className="mt-7 grid gap-5"><label className="settings-label">School name<input value={settings.name} onChange={update('name')} required minLength="2" placeholder="e.g. Akademix International School"/></label><label className="settings-label">School address<textarea value={settings.address} onChange={update('address')} rows="3" placeholder="Street, city, region, country"/></label><label className="settings-label">Logo image URL <span className="font-normal normal-case tracking-normal text-ink-soft">(optional)</span><input type="url" value={settings.logo} onChange={update('logo')} placeholder="https://example.com/logo.png"/></label></div>
      </section>
      <aside className="space-y-6"><section className="card p-6"><div className="flex items-center gap-3"><span className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-50 text-brand-600"><CalendarDays size={20}/></span><div><h2 className="font-display text-lg font-semibold text-ink">Academic year</h2><p className="text-sm text-ink-soft">Current active session.</p></div></div><label className="settings-label mt-6">Session name<input value={settings.academicYear} onChange={update('academicYear')} required placeholder="2026–2027"/></label></section>
        <section className="overflow-hidden rounded-xl2 border border-line bg-surface-raised"><div className="border-b border-line px-5 py-4"><p className="font-display font-semibold text-ink">Brand preview</p><p className="mt-1 text-xs text-ink-soft">How your school appears in Akademix.</p></div><div className="p-5"><div className="flex items-center gap-3"><div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-brand-50 text-brand-600">{settings.logo ? <img src={settings.logo} alt="School logo preview" className="h-full w-full object-cover" onError={(event) => { event.currentTarget.style.display = 'none' }} /> : <Image size={23}/>}</div><div className="min-w-0"><p className="truncate font-display font-semibold text-ink">{settings.name || 'Your school name'}</p><p className="mt-1 flex items-center gap-1 text-xs text-ink-soft"><MapPin size={12}/>{settings.address || 'School address'}</p></div></div><div className="mt-5 rounded-lg bg-surface-tint p-3 text-xs text-ink-soft">Academic year <strong className="float-right text-ink">{settings.academicYear || 'Not set'}</strong></div></div></section>
      </aside>
    </div>
    <div className="sticky bottom-4 z-10 flex flex-col gap-3 rounded-xl2 border border-line bg-white/95 p-4 shadow-soft backdrop-blur sm:flex-row sm:items-center sm:justify-between"><p className="text-sm text-ink-soft">{changed ? 'You have unsaved changes.' : 'All changes are saved.'}</p><div className="flex gap-3"><button type="button" onClick={() => { setSettings(initial); setError(''); setNotice('') }} disabled={!changed || saving} className="btn-secondary">Discard</button><button type="submit" disabled={!changed || saving} className="btn-primary"> <Save size={16}/>{saving ? 'Saving…' : 'Save changes'}</button></div></div>
  </form>
}
