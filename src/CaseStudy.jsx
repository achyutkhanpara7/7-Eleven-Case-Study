import React, { useState, useEffect, useRef } from 'react'
import { motion, useScroll, useTransform, useInView, AnimatePresence } from 'framer-motion'

// ─── Animation helpers ────────────────────────────────────────────────────────

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] } },
}
const stagger = (d = 0.1) => ({ visible: { transition: { staggerChildren: d } } })
const slideRight = { hidden: { opacity: 0, x: 20 }, visible: { opacity: 1, x: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } } }

function Reveal({ children, className = '', delay = 0 }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })
  return (
    <motion.div ref={ref} initial="hidden" animate={inView ? 'visible' : 'hidden'}
      variants={fadeUp} transition={{ delay }} className={className}>
      {children}
    </motion.div>
  )
}

function RevealGroup({ children, className = '' }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })
  return (
    <motion.div ref={ref} initial="hidden" animate={inView ? 'visible' : 'hidden'}
      variants={stagger(0.09)} className={className}>
      {children}
    </motion.div>
  )
}

function Eyebrow({ children, light = false }) {
  return (
    <motion.div variants={fadeUp} className="flex items-center gap-2.5 mb-4">
      <div className={`w-5 h-px ${light ? 'bg-white/40' : 'bg-primary'}`} />
      <span className={`section-label ${light ? '!text-white/50' : ''}`}>{children}</span>
    </motion.div>
  )
}

function Counter({ value, suffix = '' }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-40px' })
  const [count, setCount] = useState(0)
  useEffect(() => {
    if (!inView) return
    const start = performance.now()
    const target = parseFloat(value)
    const tick = (now) => {
      const p = Math.min((now - start) / 1600, 1)
      setCount(Math.round(target * (1 - Math.pow(1 - p, 3))))
      if (p < 1) requestAnimationFrame(tick)
    }
    requestAnimationFrame(tick)
  }, [inView, value])
  return <span ref={ref}>{count}{suffix}</span>
}

// ─── Sticky nav ───────────────────────────────────────────────────────────────

const NAV = [
  { id: 'hero', label: 'Overview' },
  { id: 'problem', label: 'Problem' },
  { id: 'portals', label: 'Portals' },
  { id: 'screens', label: 'Screens' },
  { id: 'design-system', label: 'Design System' },
  { id: 'process', label: 'Process' },
  { id: 'outcomes', label: 'Impact' },
  { id: 'reflection', label: 'Learnings' },
]

function StickyNav() {
  const [active, setActive] = useState('hero')
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const fn = () => {
      setVisible(window.scrollY > 300)
      const all = NAV.map(n => document.getElementById(n.id)).filter(Boolean)
      for (let i = all.length - 1; i >= 0; i--) {
        if (window.scrollY >= all[i].offsetTop - 100) { setActive(all[i].id); break }
      }
    }
    window.addEventListener('scroll', fn, { passive: true })
    return () => window.removeEventListener('scroll', fn)
  }, [])
  return (
    <AnimatePresence>
      {visible && (
        <motion.nav initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.25 }}
          className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-white/90 backdrop-blur-md
            border border-black/[0.07] rounded-full px-2 py-1.5 flex items-center gap-0.5
            shadow-[0_4px_20px_rgba(0,0,0,0.1)]">
          {NAV.map(item => (
            <a key={item.id} href={`#${item.id}`}
              className={`px-3 py-1 rounded-full text-xs font-body font-medium transition-all duration-200
                ${active === item.id ? 'bg-ink text-white' : 'text-ink-3 hover:text-ink hover:bg-black/05'}`}>
              {item.label}
            </a>
          ))}
        </motion.nav>
      )}
    </AnimatePresence>
  )
}

// ═══════════════════════════════════════════════════════════════════
// HERO
// ═══════════════════════════════════════════════════════════════════

function HeroSection() {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const imgY = useTransform(scrollYProgress, [0, 1], ['0%', '10%'])

  return (
    <section id="hero" ref={ref} className="bg-white overflow-hidden relative">
      <div className="absolute top-0 inset-x-0 h-[600px] pointer-events-none"
        style={{ background: 'radial-gradient(ellipse 100% 70% at 50% -5%, rgba(0,168,127,0.10) 0%, transparent 70%)' }} />

      <div className="relative max-w-5xl mx-auto px-6 pt-28 pb-0 text-center">
        {/* Brand pill */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="inline-flex items-center gap-3 bg-white border border-black/10 rounded-full px-5 py-2.5 mb-10 shadow-card">
          <div className="w-6 h-6 rounded-md bg-primary flex items-center justify-center">
            <span className="font-display font-black text-white text-xs leading-none">7</span>
          </div>
          <span className="font-display font-bold text-sm tracking-wide text-ink-2">7-Eleven</span>
          <span className="w-px h-4 bg-black/10" />
          <span className="text-ink-3 text-xs font-body">AI Operations Platform</span>
          <span className="w-px h-4 bg-black/10" />
          <span className="text-muted text-xs font-body">UX Case Study · 2024</span>
        </motion.div>

        {/* Headline */}
        <motion.h1 initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="font-display font-black leading-[0.9] tracking-tight mb-6"
          style={{ fontSize: 'clamp(3rem, 9vw, 7rem)' }}>
          <span className="text-ink">Designing</span><br />
          <span className="text-ink">Connected</span><br />
          <span className="text-gradient-green">Enterprise</span><br />
          <span className="text-gradient-green">Experiences</span>
        </motion.h1>

        <motion.p initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.4 }}
          className="text-ink-3 font-body text-base max-w-lg mx-auto leading-relaxed mb-3">
          How I unified six fragmented operational tools into a single AI-powered platform —
          serving 40,000+ 7-Eleven staff across store operations, distribution, IT, and corporate.
        </motion.p>

        <motion.div initial={{ scaleX: 0 }} animate={{ scaleX: 1 }}
          transition={{ duration: 0.6, delay: 0.55 }}
          className="w-16 h-0.5 bg-primary mx-auto mb-10" />

        {/* CTA row */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.62 }}
          className="flex items-center justify-center gap-3 mb-14 flex-wrap">
          <a href="#portals" className="btn-primary">
            Explore the Platform
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </a>
          <a href="#screens" className="btn-outline">View All Screens</a>
        </motion.div>

        {/* Hero image — Regional Dashboard */}
        <motion.div style={{ y: imgY }} initial={{ opacity: 0, y: 32 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.48 }} className="relative mx-auto max-w-4xl">
          <div className="bg-[#1E1E1E] rounded-t-2xl px-4 py-3 flex items-center gap-2">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-[#FF5F57]" />
              <div className="w-3 h-3 rounded-full bg-[#FEBC2E]" />
              <div className="w-3 h-3 rounded-full bg-[#28C840]" />
            </div>
            <div className="flex-1 bg-[#2D2D2D] rounded-md h-6 mx-4 flex items-center px-3">
              <span className="text-white/30 text-xs font-mono">7eleven-ops.worldlink.io/overview</span>
            </div>
          </div>
          <div className="rounded-b-2xl overflow-hidden shadow-[0_24px_64px_rgba(0,0,0,0.18)]">
            <img src="/screens/regional-dashboard.png" alt="7-Eleven Regional Dashboard — Store Manager overview with KPI cards, appliance health, sales volume"
              className="w-full block" />
          </div>
        </motion.div>
      </div>

      {/* Stats strip */}
      <div className="border-t border-black/[0.06] bg-white mt-0">
        <div className="max-w-4xl mx-auto px-6 py-8">
          <RevealGroup className="grid grid-cols-2 md:grid-cols-4 divide-x divide-black/[0.06]">
            {[
              { value: '6', label: 'Portals Unified', color: 'text-primary' },
              { value: '40K+', label: '7-Eleven Staff', color: 'text-ink' },
              { value: '14wk', label: 'Design Timeline', color: 'text-ink' },
              { value: '94%', label: 'Task Completion', color: 'text-primary' },
            ].map((s, i) => (
              <motion.div key={i} variants={fadeUp} className="text-center px-6 py-2">
                <div className={`font-display font-black text-3xl mb-0.5 ${s.color}`}>{s.value}</div>
                <div className="text-muted text-xs font-body">{s.label}</div>
              </motion.div>
            ))}
          </RevealGroup>
        </div>
      </div>
    </section>
  )
}

// ═══════════════════════════════════════════════════════════════════
// PROBLEM STATEMENT  (white + embedded dark strip)
// ═══════════════════════════════════════════════════════════════════

function ProblemSection() {
  return (
    <section id="problem" className="bg-white border-t border-black/[0.06]">
      <div className="max-w-5xl mx-auto px-6 py-24">
        <RevealGroup className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          <div>
            <Eyebrow>The Problem</Eyebrow>
            <motion.h2 variants={fadeUp}
              className="font-display font-black text-[clamp(2.2rem,5vw,3.8rem)] leading-[0.93] text-ink mb-6">
              One company.<br /><span className="text-gradient-green">Six broken tools.</span>
            </motion.h2>
            <motion.p variants={fadeUp} className="text-ink-3 font-body leading-relaxed mb-4 text-[0.95rem]">
              7-Eleven's field operations ran on a patchwork of disconnected legacy systems. Store managers
              toggled between four tools just to check morning stock. Area managers waited days for reports.
              IT reacted to equipment failures after staff discovered them.
            </motion.p>
            <motion.p variants={fadeUp} className="text-ink-3 font-body leading-relaxed text-[0.95rem]">
              My brief: design a unified AI-powered platform that serves every operational role —
              from the store floor to the C-suite — without overwhelming anyone.
            </motion.p>
            <motion.div variants={fadeUp} className="flex flex-wrap gap-2 mt-8">
              {['Lead UX Designer', 'Figma · FigJam · Maze', '14 Weeks', 'WorldLink × 7-Eleven'].map(t => (
                <span key={t} className="tag">{t}</span>
              ))}
            </motion.div>
          </div>

          <motion.div variants={slideRight} className="flex flex-col gap-3">
            {[
              { label: 'My Role', body: 'Lead UX Designer — end-to-end across all six portals: research, information architecture, design system, prototyping, and dev handoff.', accent: '#008062' },
              { label: 'Business Goals', body: 'Reduce manual reporting time by 30%+, improve stock freshness compliance, reduce IoT incident response time, and build a platform extensible to new AI features.', accent: '#F4811F' },
              { label: 'Key Constraints', body: 'High staff turnover = near-zero training time. Device range from modern tablets to aging touchscreens. WCAG 2.2 AA required at launch — not after.', accent: '#ED2525' },
            ].map(item => (
              <div key={item.label} className="card p-5 flex gap-4">
                <div className="w-1 rounded-full flex-shrink-0 mt-0.5" style={{ background: item.accent }} />
                <div>
                  <div className="section-label mb-1.5">{item.label}</div>
                  <p className="text-ink-3 text-sm font-body leading-relaxed">{item.body}</p>
                </div>
              </div>
            ))}
          </motion.div>
        </RevealGroup>
      </div>

      {/* Dark "before state" strip */}
      <div className="bg-[#0D1F18] py-16 px-6">
        <div className="max-w-5xl mx-auto">
          <RevealGroup className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="tag-dark mb-4 inline-flex">Before State</span>
              <motion.h3 variants={fadeUp} className="font-display font-black text-3xl text-white leading-tight mb-4">
                The cost of fragmentation was invisible — until we measured it.
              </motion.h3>
              <motion.p variants={fadeUp} className="text-white/50 text-sm font-body leading-relaxed">
                Research across 24 stores revealed store managers lost 47 minutes daily to tool-switching.
                Area managers relied on 3–5 day lagged reports. IoT device failures went undetected
                an average of 6 hours before staff noticed.
              </motion.p>
            </div>
            <motion.div variants={slideRight}>
              <div className="bg-white/[0.05] rounded-2xl p-6 border border-white/[0.08]">
                <p className="text-white/50 text-xs font-body mb-4">Daily operational pain points — field research synthesis</p>
                <div className="flex flex-col gap-3">
                  {[
                    { issue: 'Tool context-switching per shift', value: '47min', pct: 85, color: '#ED2525' },
                    { issue: 'Report lag for area managers', value: '3–5d', pct: 70, color: '#F4811F' },
                    { issue: 'Avg IoT failure detection lag', value: '6hrs', pct: 55, color: '#F4811F' },
                    { issue: 'IT tickets that were self-resolvable', value: '62%', pct: 62, color: '#008062' },
                  ].map(row => (
                    <div key={row.issue}>
                      <div className="flex justify-between mb-1">
                        <span className="text-white/60 text-xs font-body">{row.issue}</span>
                        <span className="text-white font-display font-bold text-sm">{row.value}</span>
                      </div>
                      <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                        <div className="h-full rounded-full" style={{ width: `${row.pct}%`, background: row.color }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </RevealGroup>
        </div>
      </div>
    </section>
  )
}

// ═══════════════════════════════════════════════════════════════════
// PORTALS  (pink section — 6 persona cards)
// ═══════════════════════════════════════════════════════════════════

const PORTALS = [
  {
    id: 'regional',
    title: 'Regional Dashboard',
    user: 'Sarah Johnson · Store Manager',
    icon: '🏪',
    accent: '#008062',
    screen: '/screens/regional-dashboard.png',
    tagline: 'Full operational overview at a glance',
    problem: 'Store managers toggled between 4 tools to get a full picture of their day. Critical alerts were buried in separate systems.',
    solution: 'Unified dashboard surfacing: Appliance health status, total units to order (7,434 in pilot), urgent items count, perishable % tracking, weekly sales by category, and AI-generated demand forecasts.',
    features: ['Appliance health with "Needs Attention" alerting', 'AI restock recommendations by SKU', 'Weekly sales trend vs previous week', 'Top categories by predicted demand', 'Perishable product % of total SKUs'],
  },
  {
    id: 'store-mgmt',
    title: 'Store Management',
    user: 'Robert Lee · Area Manager',
    icon: '📊',
    accent: '#008062',
    screen: '/screens/store-management.png',
    tagline: 'Multi-store oversight from one pane',
    problem: 'Area managers had no consolidated view — store performance data arrived via email reports 3–5 days late.',
    solution: 'Live store grid showing each location\'s revenue, store health score, staff count, and restock needs. S004–S007 store IDs with manager attribution and weekly trend indicators.',
    features: ['Per-store revenue ($103.2K, $104.3K live data)', 'Store health score per location', 'Staff headcount and assignment status', 'Weekly trend indicators (▼2.1%, ▼8.4%)', 'Filter by region, status, or manager'],
  },
  {
    id: 'distributor',
    title: 'Distributor Dashboard',
    user: 'David Wilson · Distribution Manager',
    icon: '🚚',
    accent: '#F4811F',
    screen: '/screens/distributor-dashboard.png',
    tagline: 'Order-to-delivery in one workflow',
    problem: 'Distributors coordinated via phone calls and static spreadsheets — leading to over-ordering, missed deliveries, and poor perishable management.',
    solution: 'Centralized distribution portal: 1 pending order ready for review, routes awaiting approval, active delivery tracking across Fort Worth, New York Suburban, Houston Urban stores.',
    features: ['Pending store orders with one-click review', 'Route approval workflow (1 awaiting)', 'Multi-store delivery status (Pending/Active/Delivered)', '"Review Route Request" action for flagged stores', 'On-time delivery rate tracking'],
  },
  {
    id: 'password',
    title: 'Password Management',
    user: 'John Smith · Store Manager',
    icon: '🔐',
    accent: '#6366F1',
    screen: '/screens/password-management.png',
    tagline: 'Self-service security for 40K+ staff',
    problem: 'IT was flooded with basic password reset tickets from a 40,000+ workforce with high turnover — creating both bottlenecks and security gaps.',
    solution: 'Security Hub with self-service credential management: 7-Eleven Retailer SSO (High priority, Active), Store 4421 Back-Office Login (Low, Active), with one-click Reset Password and MFA status.',
    features: ['Credential list with priority + active status', 'One-click "Reset Password" per credential', 'MFA protected credential count (0 exposed)', 'Case history and team access management', 'Chat Assistant for guided self-service'],
  },
  {
    id: 'it-admin',
    title: 'IT Administration',
    user: 'Robert Martinez · IT Administrator',
    icon: '⚙️',
    accent: '#ED2525',
    screen: '/screens/it-admin.png',
    tagline: 'Policy engine + audit + ServiceNow in one',
    problem: 'IT admins managed password policies, compliance, and ticketing across 3 separate tools with no unified audit trail.',
    solution: 'Policy Engine console: 13 active rules, 6 policies, 4 regulations, 3 security controls. Includes logic editor (POL-MIN-AGE block rule), condition previews, and ServiceNow ticket integration.',
    features: ['Policy rule management (13 active rules)', 'Block/Allow condition logic editor', 'Regulation compliance tracking (4 regulations)', 'Demo scenario testing for policies', 'Integrated ServiceNow ticket queue'],
  },
  {
    id: 'corporate',
    title: 'Corporate Operations',
    user: 'Emma Wilson · Corporate Executive',
    icon: '🏢',
    accent: '#008062',
    screen: '/screens/corporate-dashboard.png',
    tagline: 'Chain-wide intelligence for leadership',
    problem: 'Corporate leadership had no real-time view — $10M in weekly sales were tracked through delayed spreadsheets with no actionable alerts.',
    solution: 'Executive dashboard: $10M total sales (+1.6%), 6 stores at risk, 2 IoT critical, 920 on-time rate, 12 open tickets. Priority action feed flags critical stores (San Francisco Urban: trending critical at 0.3% below derived target).',
    features: ['$10M total sales with week-over-week trend', 'Stores at risk with drill-down actions', 'IoT Critical count + Maintenance rate', 'Weekly sales chart (This Week vs Previous)', 'Top Priority Actions feed with escalation'],
  },
]

function PortalCard({ p, i }) {
  const [open, setOpen] = useState(false)
  return (
    <motion.div variants={fadeUp} transition={{ delay: i * 0.07 }} layout
      className="card-tinted rounded-2xl overflow-hidden">
      {/* Header — always visible */}
      <div className="p-5 cursor-pointer" onClick={() => setOpen(v => !v)}
        role="button" tabIndex={0} onKeyDown={e => e.key === 'Enter' && setOpen(v => !v)}>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center text-lg flex-shrink-0"
              style={{ background: `${p.accent}15`, border: `1px solid ${p.accent}25` }}>{p.icon}</div>
            <div>
              <h3 className="font-display font-bold text-ink text-base leading-tight">{p.title}</h3>
              <p className="text-muted text-[10px] font-body mt-0.5">{p.user}</p>
            </div>
          </div>
          <motion.span animate={{ rotate: open ? 45 : 0 }} transition={{ duration: 0.2 }}
            className="text-muted text-lg select-none flex-shrink-0 mt-1">+</motion.span>
        </div>
        <p className="text-ink-3 text-sm font-body leading-relaxed">{p.tagline}</p>
      </div>

      {/* Expanded content */}
      <AnimatePresence>
        {open && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden">
            {/* Real screen preview */}
            <div className="mx-5 mb-4 rounded-xl overflow-hidden border border-black/08 shadow-card">
              <img src={p.screen} alt={`${p.title} screenshot`} className="w-full block" />
            </div>
            <div className="px-5 pb-5">
              <div className="rounded-xl p-3 mb-3" style={{ background: `${p.accent}08`, borderLeft: `3px solid ${p.accent}` }}>
                <p className="text-[10px] text-muted uppercase tracking-wider mb-1 font-body">The Problem</p>
                <p className="text-sm text-ink-3 font-body leading-relaxed">{p.problem}</p>
              </div>
              <div className="rounded-xl p-3 mb-3 bg-white border border-black/06">
                <p className="text-[10px] text-muted uppercase tracking-wider mb-1 font-body">The Solution</p>
                <p className="text-sm text-ink-3 font-body leading-relaxed">{p.solution}</p>
              </div>
              <p className="text-[10px] text-muted uppercase tracking-wider mb-2 font-body">Key Features</p>
              <ul className="flex flex-col gap-1.5">
                {p.features.map((f, j) => (
                  <li key={j} className="flex items-start gap-2 text-xs font-body text-ink-3">
                    <span className="w-1.5 h-1.5 rounded-full flex-shrink-0 mt-1" style={{ background: p.accent }} />{f}
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

function PortalsSection() {
  return (
    <section id="portals" style={{ background: '#FDF0F0' }} className="py-24 px-6">
      <div className="max-w-5xl mx-auto">
        <RevealGroup>
          <Eyebrow>The 6 Portals</Eyebrow>
          <motion.h2 variants={fadeUp} className="font-display font-black text-[clamp(2rem,5vw,3.5rem)] leading-tight text-ink mb-3">
            Six roles. <span className="text-gradient-green">One platform.</span>
          </motion.h2>
          <motion.p variants={fadeUp} className="text-ink-3 font-body mb-12 max-w-xl text-[0.95rem] leading-relaxed">
            Each portal is tailored to a specific operational role — with its own information architecture,
            data density, and interaction model. Click any card to see the real screen + design rationale.
          </motion.p>
        </RevealGroup>
        <RevealGroup className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {PORTALS.map((p, i) => <PortalCard key={p.id} p={p} i={i} />)}
        </RevealGroup>
      </div>
    </section>
  )
}

// ═══════════════════════════════════════════════════════════════════
// SCREENS GALLERY  (green section — all 6 real screenshots)
// ═══════════════════════════════════════════════════════════════════

const SCREEN_ITEMS = [
  { src: '/screens/regional-dashboard.png', title: 'Regional Dashboard', role: 'Store Manager', wide: true, accent: '#008062' },
  { src: '/screens/store-management.png', title: 'Store Management', role: 'Area Manager', wide: false, accent: '#008062' },
  { src: '/screens/distributor-dashboard.png', title: 'Distributor Dashboard', role: 'Distribution Manager', wide: false, accent: '#F4811F' },
  { src: '/screens/password-management.png', title: 'Password Management', role: 'Store Manager / Security Hub', wide: false, accent: '#6366F1' },
  { src: '/screens/it-admin.png', title: 'IT Administration', role: 'IT Administrator', wide: false, accent: '#ED2525' },
  { src: '/screens/corporate-dashboard.png', title: 'Corporate Operations', role: 'Corporate Executive', wide: false, accent: '#008062' },
]

function ScreensSection() {
  const [lightbox, setLightbox] = useState(null)

  return (
    <section id="screens" style={{ background: '#EBF5EF' }} className="py-24 px-6">
      <div className="max-w-5xl mx-auto">
        <RevealGroup>
          <Eyebrow>Key Screens</Eyebrow>
          <motion.h2 variants={fadeUp} className="font-display font-black text-[clamp(2rem,5vw,3.5rem)] leading-tight text-ink mb-3">
            The platform,<br />screen by screen.
          </motion.h2>
          <motion.p variants={fadeUp} className="text-ink-3 font-body mb-12 max-w-md text-[0.95rem] leading-relaxed">
            All six portals from the 7-Eleven AI Operations Platform — click any to enlarge.
          </motion.p>
        </RevealGroup>

        <RevealGroup className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {SCREEN_ITEMS.map((s, i) => (
            <motion.div key={i} variants={fadeUp} transition={{ delay: i * 0.07 }}
              className={s.wide ? 'sm:col-span-2' : ''}>
              <div className="card overflow-hidden cursor-zoom-in group" onClick={() => setLightbox(s)}>
                <div className="overflow-hidden">
                  <img src={s.src} alt={s.title} className="w-full block transition-transform duration-500 group-hover:scale-[1.02]" />
                </div>
                <div className="px-4 py-3 flex items-center justify-between">
                  <div>
                    <p className="font-display font-bold text-ink text-sm">{s.title}</p>
                    <p className="text-muted text-xs font-body">{s.role}</p>
                  </div>
                  <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: s.accent }} />
                </div>
              </div>
            </motion.div>
          ))}
        </RevealGroup>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightbox && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center p-6"
            onClick={() => setLightbox(null)}>
            <motion.div initial={{ scale: 0.92, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.92, opacity: 0 }} transition={{ duration: 0.25 }}
              className="bg-white rounded-2xl overflow-hidden max-w-5xl w-full shadow-[0_32px_80px_rgba(0,0,0,0.4)]"
              onClick={e => e.stopPropagation()}>
              <div className="flex items-center justify-between px-5 py-3 border-b border-black/08">
                <div>
                  <p className="font-display font-bold text-ink text-base">{lightbox.title}</p>
                  <p className="text-muted text-xs font-body">{lightbox.role}</p>
                </div>
                <button onClick={() => setLightbox(null)}
                  className="w-8 h-8 rounded-full bg-black/05 flex items-center justify-center text-ink-3 hover:bg-black/10 transition-colors text-lg leading-none">×</button>
              </div>
              <img src={lightbox.src} alt={lightbox.title} className="w-full block" />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}

// ═══════════════════════════════════════════════════════════════════
// DESIGN SYSTEM  (yellow section)
// ═══════════════════════════════════════════════════════════════════

const TOKENS = [
  { name: 'Primary Green', hex: '#008062', role: 'CTAs, nav, success states' },
  { name: 'Primary Light', hex: '#00B882', role: 'Hover, highlights' },
  { name: 'Alert Red', hex: '#ED2525', role: 'Critical, urgent items' },
  { name: 'Accent Orange', hex: '#F4811F', role: 'Warnings, secondary' },
  { name: 'Base Dark', hex: '#0D1F18', role: 'Dark bg (admin views)' },
  { name: 'Surface White', hex: '#F8FAFB', role: 'Card backgrounds' },
]

function DesignSystemSection() {
  return (
    <section id="design-system" style={{ background: '#FDF8EC' }} className="py-24 px-6">
      <div className="max-w-5xl mx-auto">
        <RevealGroup>
          <Eyebrow>Design System</Eyebrow>
          <motion.h2 variants={fadeUp} className="font-display font-black text-[clamp(2rem,5vw,3.5rem)] leading-tight text-ink mb-3">
            7-Eleven DS <span className="text-gradient-green">v2.0</span>
          </motion.h2>
          <motion.p variants={fadeUp} className="text-ink-3 font-body mb-14 max-w-lg text-[0.95rem] leading-relaxed">
            Built from scratch in Figma — 60+ components, a full token system, and glassmorphic
            card patterns designed for high-density operational data without visual fatigue.
          </motion.p>
        </RevealGroup>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Color tokens */}
          <Reveal className="lg:col-span-3">
            <div className="section-label mb-4">Color Tokens</div>
            <div className="card p-5">
              <div className="grid grid-cols-3 gap-3">
                {TOKENS.map(t => (
                  <div key={t.name} className="group">
                    <div className="h-14 rounded-xl mb-2 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:shadow-md"
                      style={{ background: t.hex }} />
                    <div className="text-ink text-xs font-body font-semibold leading-tight">{t.name}</div>
                    <div className="text-muted text-[10px] font-mono">{t.hex}</div>
                    <div className="text-muted text-[10px] leading-tight mt-0.5">{t.role}</div>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>

          {/* Typography + spacing */}
          <Reveal className="lg:col-span-2 flex flex-col gap-4" delay={0.1}>
            <div>
              <div className="section-label mb-3">Typography</div>
              <div className="card p-5 flex flex-col gap-4">
                <div>
                  <p className="text-muted text-[10px] mb-1.5">Display — Barlow Condensed</p>
                  <p className="font-display font-black text-4xl text-ink leading-none">Aa Bb Cc</p>
                  <p className="font-display font-semibold text-base text-ink-3 mt-1">Headlines · KPIs · Data</p>
                </div>
                <div className="h-px bg-black/06" />
                <div>
                  <p className="text-muted text-[10px] mb-1.5">Body — Outfit</p>
                  <p className="font-body text-sm text-ink">Aa Bb — clear, readable, accessible.</p>
                  <p className="text-muted text-xs mt-1">Labels · Paragraphs · UI copy</p>
                </div>
              </div>
            </div>
            <div>
              <div className="section-label mb-3">Spacing (8px base)</div>
              <div className="card p-5">
                {[{n:'1×',w:8},{n:'2×',w:16},{n:'3×',w:24},{n:'4×',w:32},{n:'6×',w:48}].map(s => (
                  <div key={s.n} className="flex items-center gap-3 mb-2 last:mb-0">
                    <div className="rounded-sm bg-primary/30 flex-shrink-0" style={{ width: s.w, height: 8, minWidth: 8 }} />
                    <span className="text-ink-3 text-[10px] font-mono w-6">{s.n}</span>
                    <span className="text-muted text-[10px] font-mono">{s.w}px</span>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        </div>

        {/* Principles */}
        <Reveal className="mt-6" delay={0.15}>
          <div className="section-label mb-4">Design Principles</div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { title: 'Role-scoped clarity', body: 'Every portal surfaces only what that role needs to act on — no irrelevant data, no cognitive overload.', icon: '🎯' },
              { title: 'AI with rationale', body: 'Every AI recommendation shows its reasoning — "Reorder 48 units: 3-day lead time + upcoming event." Trust is earned by transparency.', icon: '🤖' },
              { title: 'Accessible by default', body: 'WCAG 2.2 AA contrast, 44px minimum touch targets, and keyboard-navigable flows — built in, not bolted on.', icon: '♿' },
            ].map(p => (
              <div key={p.title} className="card p-5">
                <div className="text-xl mb-3">{p.icon}</div>
                <h4 className="font-display font-bold text-ink text-base mb-2">{p.title}</h4>
                <p className="text-ink-3 text-xs font-body leading-relaxed">{p.body}</p>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  )
}

// ═══════════════════════════════════════════════════════════════════
// PROCESS  (white — Double Diamond timeline)
// ═══════════════════════════════════════════════════════════════════

const STEPS = [
  { phase: 'Discover', icon: '🔍', color: '#008062', weeks: 'Wk 1–3', tasks: ['Stakeholder interviews (6 roles)', 'Store visit shadowing', 'Competitive audit', 'Affinity mapping'], out: 'Research synthesis + opportunity framework' },
  { phase: 'Define', icon: '🎯', color: '#F4811F', weeks: 'Wk 4–5', tasks: ['Problem statements per role', 'Jobs-to-be-done mapping', 'Information architecture', 'Design principles'], out: 'IA blueprint + validated problem space' },
  { phase: 'Develop', icon: '✏️', color: '#F4811F', weeks: 'Wk 6–10', tasks: ['Low-fi wireframes (all 6)', 'Design system foundation', 'Figma component library', 'Mid-fi usability testing'], out: 'Hi-fi prototypes + component library' },
  { phase: 'Deliver', icon: '🚀', color: '#008062', weeks: 'Wk 11–14', tasks: ['Dev handoff specs', 'WCAG 2.2 AA audit', 'Usability testing R2', 'Final QA + launch'], out: 'Production-ready design system' },
]

function ProcessSection() {
  return (
    <section id="process" className="bg-white border-t border-black/[0.06] py-24 px-6">
      <div className="max-w-5xl mx-auto">
        <RevealGroup>
          <Eyebrow>Design Process</Eyebrow>
          <motion.h2 variants={fadeUp} className="font-display font-black text-[clamp(2rem,5vw,3.5rem)] leading-tight text-ink mb-3">
            Double Diamond,<br /><span className="text-gradient-orange">grounded in field research.</span>
          </motion.h2>
          <motion.p variants={fadeUp} className="text-ink-3 font-body mb-16 max-w-lg text-[0.95rem] leading-relaxed">
            14 weeks from first stakeholder interview to production handoff.
            Diverge to understand the full problem space. Converge to solutions that only work for this brief.
          </motion.p>
        </RevealGroup>
        <div className="relative">
          <div className="absolute top-[34px] left-[34px] right-[34px] h-px hidden lg:block"
            style={{ background: 'linear-gradient(90deg, #008062, #F4811F, #F4811F, #008062)' }} />
          <RevealGroup className="grid grid-cols-1 lg:grid-cols-4 gap-5">
            {STEPS.map((s, i) => (
              <motion.div key={s.phase} variants={fadeUp} transition={{ delay: i * 0.1 }}>
                <div className="relative z-10 mb-5">
                  <div className="w-[68px] h-[68px] rounded-2xl flex items-center justify-center text-2xl"
                    style={{ background: `${s.color}12`, border: `1.5px solid ${s.color}30` }}>{s.icon}</div>
                </div>
                <div className="card p-5">
                  <div className="flex items-baseline justify-between mb-3">
                    <h3 className="font-display font-bold text-ink text-lg">{s.phase}</h3>
                    <span className="text-muted text-xs">{s.weeks}</span>
                  </div>
                  <ul className="flex flex-col gap-1.5 mb-4">
                    {s.tasks.map((t, j) => (
                      <li key={j} className="flex items-start gap-2 text-xs text-ink-3">
                        <span className="mt-1.5 w-1 h-1 rounded-full bg-black/20 flex-shrink-0" />{t}
                      </li>
                    ))}
                  </ul>
                  <div className="pt-3 border-t border-black/[0.06]">
                    <p className="text-[10px] uppercase tracking-wider text-muted mb-1">Output</p>
                    <p className="text-xs font-medium" style={{ color: s.color }}>{s.out}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </RevealGroup>
        </div>
      </div>
    </section>
  )
}

// ═══════════════════════════════════════════════════════════════════
// OUTCOMES  (white — metric cards + quote)
// ═══════════════════════════════════════════════════════════════════

const METRICS = [
  { value: 40, suffix: '%', label: 'Reduction in daily tool-switching time', color: '#008062' },
  { value: 6, suffix: 'x', label: 'Portals replaced by one platform', color: '#F4811F' },
  { value: 28, suffix: '%', label: 'Faster IoT incident detection', color: '#008062' },
  { value: 94, suffix: '%', label: 'Task completion in usability tests', color: '#008062' },
  { value: 62, suffix: '%', label: 'IT tickets deflected via self-service', color: '#F4811F' },
  { value: 100, suffix: '%', label: 'WCAG 2.2 AA compliance at launch', color: '#008062' },
]

function OutcomesSection() {
  return (
    <section id="outcomes" className="bg-white border-t border-black/[0.06] py-24 px-6">
      <div className="max-w-5xl mx-auto">
        <RevealGroup>
          <Eyebrow>Outcomes & Impact</Eyebrow>
          <motion.h2 variants={fadeUp} className="font-display font-black text-[clamp(2rem,5vw,3.5rem)] leading-tight text-ink mb-3">
            Numbers that<br /><span className="text-gradient-green">moved the needle.</span>
          </motion.h2>
          <motion.p variants={fadeUp} className="text-ink-3 font-body mb-16 max-w-lg text-[0.95rem] leading-relaxed">
            Pilot rollout across 24 Northeast Region stores — 3 months post-launch data.
          </motion.p>
        </RevealGroup>

        <RevealGroup className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {METRICS.map((m, i) => (
            <motion.div key={i} variants={fadeUp} transition={{ delay: i * 0.08 }}
              className="stat-card" style={{ borderTop: `3px solid ${m.color}` }}>
              <div className="font-display font-black text-4xl mb-1.5" style={{ color: m.color }}>
                <Counter value={m.value} suffix={m.suffix} />
              </div>
              <p className="text-ink-3 text-sm font-body leading-snug">{m.label}</p>
            </motion.div>
          ))}
        </RevealGroup>

        <Reveal className="mt-8" delay={0.2}>
          <div className="rounded-3xl p-8 border border-primary/15"
            style={{ background: 'linear-gradient(135deg, rgba(0,128,98,0.05) 0%, rgba(0,184,130,0.03) 100%)' }}>
            <div className="flex flex-col md:flex-row md:items-center gap-6">
              <div className="flex-1">
                <div className="text-4xl mb-4 text-primary font-display font-black leading-none">"</div>
                <h3 className="font-display font-bold text-2xl text-ink mb-2 leading-tight">
                  The dashboard replaced three morning meetings.
                </h3>
                <p className="text-ink-3 text-sm">— Northeast Region Area Manager, pilot feedback session</p>
              </div>
              <div className="w-px h-16 bg-black/08 hidden md:block" />
              <div className="text-center flex-shrink-0">
                <div className="font-display font-black text-5xl text-gradient-green">4.7</div>
                <div className="text-muted text-xs mt-1">Pilot NPS (out of 5)</div>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

// ═══════════════════════════════════════════════════════════════════
// REFLECTION  (pink section — learnings)
// ═══════════════════════════════════════════════════════════════════

const LEARNINGS = [
  { icon: '💡', title: 'Enterprise ≠ complex UI', body: 'The most requested feature in research was "make it simpler." The real skill was deciding what NOT to show — every role gets only what they need to act in the next 10 seconds.', color: '#008062' },
  { icon: '🏗️', title: 'Build the system before the screens', body: 'Starting the component library at week 3 (not week 8) meant developers could begin building portal #1 before I finished portal #3. Foundations pay dividends.', color: '#F4811F' },
  { icon: '🤖', title: 'AI trust is earned, not assumed', body: 'Early testing showed users ignored AI recommendations without rationale. Adding "why" copy — "Reorder 48 units: 3-day lead + local event" — doubled follow-through rate.', color: '#008062' },
  { icon: '♿', title: 'Accessibility is a design input, not an audit', body: 'Running contrast checks during design (not after) caught 23 issues before they were coded. Making it a gate, not a checklist, changed how the team worked.', color: '#ED2525' },
]

function ReflectionSection() {
  return (
    <section id="reflection" style={{ background: '#FDF0F0' }} className="py-24 px-6 pb-40">
      <div className="max-w-5xl mx-auto">
        <RevealGroup>
          <Eyebrow>Reflection & Learnings</Eyebrow>
          <motion.h2 variants={fadeUp} className="font-display font-black text-[clamp(2rem,5vw,3.5rem)] leading-tight text-ink mb-3">
            What this project<br /><span className="text-gradient-orange">taught me.</span>
          </motion.h2>
          <motion.p variants={fadeUp} className="text-ink-3 font-body mb-14 max-w-lg text-[0.95rem] leading-relaxed">
            14 weeks, 6 portals, 1 design system, and a 40,000-person user base.
            Here's what I'd tell myself at the start.
          </motion.p>
        </RevealGroup>

        <RevealGroup className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {LEARNINGS.map((item, i) => (
            <motion.div key={i} variants={fadeUp} transition={{ delay: i * 0.1 }}>
              <div className="card p-6 h-full">
                <div className="text-2xl mb-4">{item.icon}</div>
                <div className="w-8 h-1 rounded-full mb-4" style={{ background: item.color }} />
                <h3 className="font-display font-bold text-xl text-ink mb-3">{item.title}</h3>
                <p className="text-ink-3 text-sm font-body leading-relaxed">{item.body}</p>
              </div>
            </motion.div>
          ))}
        </RevealGroup>

        <Reveal className="mt-16 text-center" delay={0.2}>
          <div className="h-px bg-black/08 mb-14" />
          <div className="inline-flex items-center gap-3 bg-white border border-black/10 rounded-full px-5 py-2.5 mb-6 shadow-card">
            <div className="w-5 h-5 rounded bg-primary flex items-center justify-center">
              <span className="font-display font-black text-white text-[10px]">7</span>
            </div>
            <span className="font-display font-bold text-sm text-ink-2">7-Eleven AI Ops Platform</span>
            <span className="text-muted text-xs">·</span>
            <span className="text-muted text-xs">UX Case Study 2024</span>
          </div>
          <h3 className="font-display font-bold text-3xl text-ink mb-3">Want to go deeper?</h3>
          <p className="text-ink-3 text-sm font-body mb-8 max-w-sm mx-auto leading-relaxed">
            I'm happy to walk through the research, any portal in detail, or the design system end-to-end.
          </p>
          <div className="flex items-center justify-center gap-3 flex-wrap">
            <a href="mailto:achyutkhanpara7@gmail.com" className="btn-primary">
              Get in touch
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </a>
            <a href="#hero" className="btn-outline">Back to top ↑</a>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

// ─── Root ─────────────────────────────────────────────────────────

export default function CaseStudy() {
  return (
    <div className="min-h-screen bg-white text-ink overflow-x-hidden">
      <style>{`
        .btn-primary{background:#111810;color:#fff;font-family:'Outfit',sans-serif;font-weight:600;font-size:.85rem;padding:12px 22px;border-radius:999px;display:inline-flex;align-items:center;gap:8px;transition:all .2s ease;text-decoration:none;}
        .btn-primary:hover{background:#008062;transform:translateY(-1px);}
        .btn-outline{background:transparent;color:#111810;border:1.5px solid rgba(0,0,0,.15);font-family:'Outfit',sans-serif;font-weight:600;font-size:.85rem;padding:12px 22px;border-radius:999px;display:inline-flex;align-items:center;gap:8px;transition:all .2s ease;text-decoration:none;}
        .btn-outline:hover{border-color:#008062;color:#008062;transform:translateY(-1px);}
      `}</style>
      <StickyNav />
      <HeroSection />
      <ProblemSection />
      <PortalsSection />
      <ScreensSection />
      <DesignSystemSection />
      <ProcessSection />
      <OutcomesSection />
      <ReflectionSection />
      <footer className="bg-white border-t border-black/[0.06] text-center py-6 text-muted text-xs">
        7-Eleven AI Operations Platform · Portfolio Case Study · WorldLink × 7-Eleven · 2024
      </footer>
    </div>
  )
}
