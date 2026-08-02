import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { Facebook, GraduationCap, Instagram, Linkedin, Mail, Menu, Phone, Twitter, X, Youtube } from 'lucide-react'

const navItems = [
  { label: 'Home', to: '/' },
  { label: 'About', to: '/about' },
  { label: 'Contact', to: '/contact' },
]

const footerColumns = [
  {
    title: 'Product',
    links: [
      { label: 'Features', to: '/#features' },
      { label: 'Why Akademix', to: '/#why-us' },
      { label: 'Pricing', to: '/register' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'About us', to: '/about' },
      { label: 'Contact', to: '/contact' },
      { label: 'Sign up', to: '/register' },
    ],
  },
]

const socialLinks = [
  { icon: Facebook, label: 'Facebook', href: 'https://facebook.com' },
  { icon: Instagram, label: 'Instagram', href: 'https://instagram.com' },
  { icon: Twitter, label: 'Twitter', href: 'https://twitter.com' },
  { icon: Linkedin, label: 'LinkedIn', href: 'https://linkedin.com' },
  { icon: Youtube, label: 'YouTube', href: 'https://youtube.com' },
]

function Logo({ className = '' }) {
  return (
    <Link to="/" className={`inline-flex items-center gap-2 font-display text-xl font-bold text-ink ${className}`}>
      <span className="grid h-9 w-9 place-items-center rounded-lg bg-brand-500 text-white">
        <GraduationCap size={20} />
      </span>
      Akademix
    </Link>
  )
}

function SiteHeader() {
  const [open, setOpen] = useState(false)

  return (
    <header className="sticky top-0 z-40 border-b border-line/70 bg-white/85 backdrop-blur-md">
      <div className="container-page flex h-16 items-center justify-between">
        <Logo />

        <nav className="hidden items-center gap-8 md:flex">
          {navItems.map((item) => (
            <NavLink
              key={item.label}
              to={item.to}
              className={({ isActive }) =>
                `text-sm font-medium transition hover:text-brand-600 ${isActive ? 'text-brand-600' : 'text-ink-soft'}`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <Link to="/login" className="text-sm font-semibold text-ink-soft transition hover:text-brand-600">
            Log in
          </Link>
          <Link to="/register" className="btn-primary">
            Get Started
          </Link>
        </div>

        <button
          type="button"
          className="grid h-10 w-10 place-items-center rounded-lg border border-line text-ink md:hidden"
          onClick={() => setOpen((prev) => !prev)}
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {open && (
        <div className="border-t border-line bg-white px-6 py-5 md:hidden">
          <div className="flex flex-col gap-4">
            {navItems.map((item) => (
              <Link key={item.label} to={item.to} onClick={() => setOpen(false)} className="text-sm font-medium text-ink">
                {item.label}
              </Link>
            ))}
            <div className="mt-2 flex flex-col gap-3 border-t border-line pt-4">
              <Link to="/login" onClick={() => setOpen(false)} className="text-sm font-semibold text-ink-soft">
                Log in
              </Link>
              <Link to="/register" onClick={() => setOpen(false)} className="btn-primary justify-center">
                Get Started
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}

function SiteFooter() {
  return (
    <footer className="border-t border-line bg-surface-tint">
      <div className="container-page grid gap-10 py-14 md:grid-cols-[1.4fr_1fr_1fr_1.2fr]">
        <div>
          <Logo />
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-ink-soft">
            Akademix is an all-in-one school management platform, helping institutions manage admissions,
            attendance, fees and results digitally, with ease.
          </p>
          <div className="mt-5 flex items-center gap-3">
            {socialLinks.map(({ icon: Icon, label, href }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noreferrer"
                aria-label={label}
                className="grid h-9 w-9 place-items-center rounded-full border border-line text-ink-soft transition hover:border-brand-300 hover:text-brand-600"
              >
                <Icon size={16} />
              </a>
            ))}
          </div>
        </div>

        {footerColumns.map((column) => (
          <div key={column.title}>
            <h3 className="font-display text-sm font-semibold text-ink">{column.title}</h3>
            <ul className="mt-4 space-y-3">
              {column.links.map((link) => (
                <li key={link.label}>
                  <Link to={link.to} className="text-sm text-ink-soft transition hover:text-brand-600">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}

        <div>
          <h3 className="font-display text-sm font-semibold text-ink">Get in touch</h3>
          <ul className="mt-4 space-y-3 text-sm text-ink-soft">
            <li className="flex items-center gap-2">
              <Mail size={15} className="text-brand-500" />
              <a href="mailto:support@akademix.app" className="hover:text-brand-600">support@akademix.app</a>
            </li>
            <li className="flex items-center gap-2">
              <Phone size={15} className="text-brand-500" />
              <a href="tel:+447404074252" className="hover:text-brand-600">+44 (740) 407 4252</a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-line">
        <div className="container-page flex flex-col items-center justify-between gap-3 py-5 text-xs text-ink-soft sm:flex-row">
          <p>© {new Date().getFullYear()} Akademix. All rights reserved.</p>
          <div className="flex items-center gap-5">
            <Link to="/contact" className="hover:text-brand-600">Privacy Policy</Link>
            <Link to="/contact" className="hover:text-brand-600">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default function PublicLayout({ children }) {
  return (
    <div className="flex min-h-screen flex-col bg-surface text-ink">
      <SiteHeader />
      <main className="flex-1">{children}</main>
      <SiteFooter />
    </div>
  )
}
