import React, { useState, useEffect, useRef } from 'react'
import { motion, useScroll, useTransform, useInView, AnimatePresence } from 'framer-motion'

// ─── Shared animation variants ────────────────────────────────────────────────

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] } },
}
const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.45, ease: 'easeOut' } },
}
const stagger = (d = 0.1) => ({ visible: { transition: { staggerChildren: d } } })
const slideLeft = {
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
}
const slideRight = {
  hidden: { opacity: 0, x: 20 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
}

// ─── Scroll-triggered section wrapper ────────────────────────────────────────

function Reveal({ children, className = '', delay = 0, direction = 'up' }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })
  const variants = direction === 'left' ? slideLeft : direction === 'right' ? slideRight : fadeUp
  return (
    <motion.div ref={ref} initial="hidden" animate={inView ? 'visible' : 'hidden'}
      variants={variants} transition={{ delay }} className={className}>
      {children}
    </motion.div>
  )
}

function RevealGroup({ children, className = '' }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })
  return (
    <motion.div ref={ref} initial="hidden" animate={inView ? 'visible' : 'hidden'}
      variants={stagger(0.1)} className={className}>
      {children}
    </motion.div>
  )
}

// ─── Eyebrow label ────────────────────────────────────────────────────────────

function Eyebrow({ children, light = false }) {
  return (
    <motion.div variants={fadeUp} className="flex items-center gap-2.5 mb-4">
      <div className={`w-5 h-px ${light ? 'bg-white/40' : 'bg-primary'}`} />
      <span className={`section-label ${light ? '!text-white/50' : ''}`}>{children}</span>
    </motion.div>
  )
}

// ─── Animated counter ─────────────────────────────────────────────────────────

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
      const e = 1 - Math.pow(1 - p, 3)
      setCount(Math.round(target * e))
      if (p < 1) requestAnimationFrame(tick)
    }
    requestAnimationFrame(tick)
  }, [inView, value])
  return <span ref={ref}>{count}{suffix}</span>
}

// ─── Screen placeholder ───────────────────────────────────────────────────────

function ScreenBox({ label, aspect = '16/9', bg = '#1a2a22', light = false }) {
  return (
    <div className="rounded-2xl overflow-hidden shadow-hero-img" style={{ aspectRatio: aspect, background: bg, position: 'relative' }}>
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, rgba(0,128,98,0.25) 0%, transparent 50%)' }} />
      <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
        <div style={{ width: 40, height: 40, borderRadius: 10, background: 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="1.5">
            <rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="m21 15-5-5L5 21"/>
          </svg>
        </div>
        <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: 11, textAlign: 'center', padding: '0 20px', lineHeight: 1.5 }}>{label}</p>
      </div>
    </div>
  )
}

function LightScreenBox({ label, aspect = '4/3' }) {
  return (
    <div className="rounded-2xl overflow-hidden border border-black/08 shadow-card" style={{ aspectRatio: aspect, background: '#F0F4F2', position: 'relative' }}>
      <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
        <div style={{ width: 36, height: 36, borderRadius: 8, background: 'rgba(0,128,98,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#008062" strokeWidth="1.5">
            <rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="m21 15-5-5L5 21"/>
          </svg>
        </div>
        <p style={{ color: '#8EA89E', fontSize: 10, textAlign: 'center', padding: '0 16px', lineHeight: 1.5 }}>{label}</p>
      </div>
    </div>
  )
}

// ─── Sticky nav ───────────────────────────────────────────────────────────────

const NAV = [
  { id: 'hero', label: 'Overview' },
  { id: 'context', label: 'Context' },
  { id: 'ecosystem', label: 'Personas' },
  { id: 'process', label: 'Process' },
  { id: 'design-system', label: 'Design System' },
  { id: 'screens', label: 'Screens' },
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
          transition={{ duration: 0.25 }} aria-label="Page sections"
          className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-white/90 backdrop-blur-md
            border border-black/[0.07] rounded-full px-2 py-1.5 flex items-center gap-0.5
            shadow-[0_4px_20px_rgba(0,0,0,0.1)]">
          {NAV.map(item => (
            <a key={item.id} href={`#${item.id}`}
              className={`px-3 py-1 rounded-full text-xs font-body font-medium transition-all duration-200 ${
                active === item.id ? 'bg-ink text-white' : 'text-ink-3 hover:text-ink hover:bg-black/05'}`}>
              {item.label}
            </a>
          ))}
        </motion.nav>
      )}
    </AnimatePresence>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// SECTION 1 — HERO  (white bg, centered, big editorial headline)
// ═══════════════════════════════════════════════════════════════════════════════

function HeroSection() {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const imgY = useTransform(scrollYProgress, [0, 1], ['0%', '12%'])

  return (
    <section id="hero" ref={ref} className="bg-white overflow-hidden">
      {/* Subtle top gradient glow */}
      <div className="absolute top-0 left-0 right-0 h-[500px] pointer-events-none"
        style={{ background: 'radial-gradient(ellipse 100% 60% at 50% -10%, rgba(0,168,127,0.1) 0%, transparent 70%)' }} />

      <div className="relative max-w-5xl mx-auto px-6 pt-28 pb-0 text-center">
        {/* Brand pill */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.1 }}
          className="inline-flex items-center gap-3 bg-white border border-black/10 rounded-full px-5 py-2.5 mb-10 shadow-card">
          <span className="font-display font-bold text-sm tracking-wide text-ink-2">WorldLink</span>
          <span className="text-ink-3 text-xs">×</span>
          <span className="font-display font-black text-sm tracking-wide" style={{ color: '#008062' }}>7-ELEVEN</span>
        </motion.div>

        {/* Headline */}
        <motion.h1 initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="font-display font-black leading-[0.9] tracking-tight mb-6"
          style={{ fontSize: 'clamp(3.2rem, 9vw, 7.5rem)' }}>
          <span className="text-ink">Designing</span><br />
          <span className="text-ink">Connected</span><br />
          <span className="text-gradient-green">Enterprise</span><br />
          <span className="text-gradient-green">Experiences</span>
        </motion.h1>

        {/* Subline */}
        <motion.p initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.42 }}
          className="text-ink-3 font-body text-base max-w-lg mx-auto leading-relaxed mb-3">
          Explore the design thinking, workflows, and user experiences shaping the future of the 7-Eleven AI Operations Platform.
        </motion.p>

        {/* Thin divider line like Shivani's */}
        <motion.div initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: 0.6, delay: 0.6 }}
          className="w-16 h-0.5 bg-primary mx-auto mb-10" />

        {/* CTA row */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.65 }}
          className="flex items-center justify-center gap-3 mb-14">
          <a href="#ecosystem" className="btn-primary">
            Explore Use Cases
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </a>
          <a href="#outcomes" className="btn-outline">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="9"/><path d="M12 8v4l3 3"/></svg>
            View Impact
          </a>
        </motion.div>

        {/* Hero mockup image */}
        <motion.div style={{ y: imgY }}
          initial={{ opacity: 0, y: 32 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="relative mx-auto max-w-4xl">
          {/* Browser chrome */}
          <div className="bg-[#1E1E1E] rounded-t-2xl px-4 py-3 flex items-center gap-2">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-[#FF5F57]" />
              <div className="w-3 h-3 rounded-full bg-[#FEBC2E]" />
              <div className="w-3 h-3 rounded-full bg-[#28C840]" />
            </div>
            <div className="flex-1 bg-[#2D2D2D] rounded-md h-6 mx-4 flex items-center px-3">
              <span className="text-white/30 text-xs font-mono">7eleven-ops.worldlink.io/dashboard</span>
            </div>
          </div>
          <ScreenBox label="[Screenshot: Store Manager Dashboard — KPI overview, freshness alerts, reorder panel]" aspect="16/9" bg="#0D1F18" />
        </motion.div>
      </div>

      {/* Stats strip */}
      <div className="border-t border-black/[0.06] mt-0 bg-white">
        <div className="max-w-4xl mx-auto px-6 py-8">
          <RevealGroup className="grid grid-cols-2 md:grid-cols-4 gap-0 divide-x divide-black/[0.06]">
            {[
              { value: '6', label: 'Portals Unified', color: 'text-primary' },
              { value: '40K+', label: 'Store Staff', color: 'text-ink' },
              { value: '14', label: 'Week Timeline', color: 'text-ink' },
              { value: '94%', label: 'Task Completion', color: 'text-primary' },
            ].map((s, i) => (
              <motion.div key={i} variants={fadeUp} className="text-center px-6 py-2">
                <div className={`font-display font-black text-3xl mb-0.5 ${s.color}`}>{s.value}</div>
                <div className="text-ink-3 text-xs font-body">{s.label}</div>
              </motion.div>
            ))}
          </RevealGroup>
        </div>
      </div>
    </section>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// SECTION 2 — CONTEXT  (white bg, 2-col editorial)
// ═══════════════════════════════════════════════════════════════════════════════

function ContextSection() {
  return (
    <section id="context" className="bg-white border-t border-black/[0.06]">
      <div className="max-w-5xl mx-auto px-6 py-24">
        <RevealGroup className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          <div>
            <Eyebrow>The Problem</Eyebrow>
            <motion.h2 variants={fadeUp} className="font-display font-black text-[clamp(2.2rem,5vw,3.8rem)] leading-[0.93] text-ink mb-6">
              One company.<br /><span className="text-gradient-green">Six broken tools.</span>
            </motion.h2>
            <motion.p variants={fadeUp} className="text-ink-3 font-body leading-relaxed mb-4 text-[0.95rem]">
              7-Eleven's operations team managed daily store operations through a fragmented collection of legacy tools — each role required a different login, interface, and mental model.
            </motion.p>
            <motion.p variants={fadeUp} className="text-ink-3 font-body leading-relaxed text-[0.95rem]">
              Store managers context-switched constantly. Area managers had no real-time visibility. IT was reactive, not proactive. The brief: unify everything without overwhelming anyone.
            </motion.p>

            {/* Meta chips */}
            <motion.div variants={fadeUp} className="flex flex-wrap gap-2 mt-8">
              {['Lead UX Designer', 'Figma · FigJam · Maze', '14 Weeks', 'WorldLink × 7-Eleven'].map(t => (
                <span key={t} className="tag">{t}</span>
              ))}
            </motion.div>
          </div>

          <motion.div variants={slideRight} className="flex flex-col gap-3">
            {[
              { label: 'My Role', body: 'Lead UX Designer — end-to-end across all six portals: research, IA, design system, prototyping, and developer handoff.', accent: '#008062' },
              { label: 'Business Goals', body: 'Cut manual reporting time by 30%+, improve stock freshness compliance, build a platform extensible to future AI features.', accent: '#F4811F' },
              { label: 'Constraints', body: 'High staff turnover = minimal training time. Devices ranged from tablets to aging touchscreens. WCAG 2.2 AA non-negotiable.', accent: '#ED2525' },
            ].map(item => (
              <div key={item.label} className="card p-5 flex gap-4">
                <div className="w-1 rounded-full flex-shrink-0" style={{ background: item.accent }} />
                <div>
                  <div className="section-label mb-1.5">{item.label}</div>
                  <p className="text-ink-3 text-sm font-body leading-relaxed">{item.body}</p>
                </div>
              </div>
            ))}
          </motion.div>
        </RevealGroup>
      </div>

      {/* Dark analytics strip — like Shivani's dark graph section */}
      <div className="bg-[#0D1F18] py-16 px-6">
        <div className="max-w-5xl mx-auto">
          <RevealGroup className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="tag-dark mb-4 inline-flex">Before State</span>
              <motion.h3 variants={fadeUp} className="font-display font-black text-3xl text-white leading-tight mb-4">
                The fragmentation cost was invisible — until we mapped it.
              </motion.h3>
              <motion.p variants={fadeUp} className="text-white/50 text-sm font-body leading-relaxed">
                Across 24 stores, managers averaged 47 minutes per day switching between tools. Area managers had 3–5 day reporting lags. IoT failures went undetected for an average of 6 hours.
              </motion.p>
            </div>
            <motion.div variants={slideRight}>
              {/* Fake analytics chart */}
              <div className="bg-white/[0.05] rounded-2xl p-6 border border-white/[0.08]">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-white/60 text-xs font-body">Daily Tool Switches per Manager</span>
                  <span className="text-white/30 text-xs">Avg. across 24 stores</span>
                </div>
                <div className="flex items-end gap-1.5 h-20">
                  {[35, 52, 48, 67, 71, 58, 63, 75, 69, 82, 78, 88].map((h, i) => (
                    <div key={i} className="flex-1 rounded-sm" style={{ height: `${h}%`, background: i > 8 ? '#ED2525' : 'rgba(0,128,98,0.5)' }} />
                  ))}
                </div>
                <div className="flex justify-between mt-2">
                  <span className="text-white/25 text-[10px]">Mon</span>
                  <span className="text-white/25 text-[10px]">Sun</span>
                </div>
                <div className="mt-4 flex gap-6">
                  {[{ v: '47min', l: 'Avg daily waste' }, { v: '6hrs', l: 'IoT lag' }, { v: '3–5d', l: 'Report delay' }].map(s => (
                    <div key={s.l}>
                      <div className="text-white font-display font-bold text-lg">{s.v}</div>
                      <div className="text-white/35 text-[10px] font-body">{s.l}</div>
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

// ═══════════════════════════════════════════════════════════════════════════════
// SECTION 3 — ECOSYSTEM / PERSONAS  (pink-tinted bg, like Shivani's pink section)
// ═══════════════════════════════════════════════════════════════════════════════

const PERSONAS = [
  { id: 'store-manager', title: 'Store Manager', icon: '🏪', accent: '#008062', tagline: 'Daily operations, at a glance', summary: 'Full-day operational view: inventory alerts, freshness timers, IoT status, and reorder workflows.', challenge: 'Juggling 4+ tools causing missed restocks and slow incident response.', details: ['AI reorder suggestions by SKU', 'Freshness countdown timers', 'Maintenance ticket creation', 'Daily performance score'] },
  { id: 'area-manager', title: 'Area Manager', icon: '📊', accent: '#008062', tagline: 'Cross-store oversight', summary: 'Bird\'s-eye view across 20–30 stores: anomaly detection, comparative analytics, escalation.', challenge: 'Manual delayed reports missed systemic patterns across store clusters.', details: ['Store performance ranking', 'AI-flagged cross-store anomalies', 'Demand forecasting by cluster', 'One-click escalation'] },
  { id: 'distributor', title: 'Distributor', icon: '🚚', accent: '#F4811F', tagline: 'Smarter delivery coordination', summary: 'AI-powered order recommendations, delivery scheduling, and real-time inventory sync.', challenge: 'Phone calls + spreadsheets led to over-ordering and poor perishable management.', details: ['AI-generated order quantities', 'Urgency-based route priority', 'Live store inventory sync', 'In-platform order tracking'] },
  { id: 'corporate', title: 'Corporate Portal', icon: '🏢', accent: '#008062', tagline: 'Chain-wide intelligence', summary: 'Executive analytics: regional breakdowns, KPI trends, category performance, brand compliance.', challenge: 'Insights lagged by days — proactive decisions were nearly impossible.', details: ['National revenue dashboards', 'Category demand trend analysis', 'Planogram compliance tracking', 'Export-ready stakeholder reports'] },
  { id: 'password', title: 'Password Management', icon: '🔐', accent: '#ED2525', tagline: 'Secure, self-service access', summary: 'Streamlined identity flows for high-turnover retail staff: PIN resets, unlocks, provisioning.', challenge: 'IT overwhelmed with access requests from 40K+ workforce with high turnover.', details: ['Self-service PIN reset', 'Temporary seasonal access', 'Role-based permission assignment', 'Full audit trail'] },
  { id: 'it-admin', title: 'IT Admin', icon: '⚙️', accent: '#ED2525', tagline: 'Fleet health, always visible', summary: 'IoT device monitoring, maintenance ticketing, and system health alerts across the network.', challenge: 'Equipment failures discovered by staff, not systems — avoidable downtime.', details: ['Real-time IoT status heatmap', 'Automated ticket routing', 'Predictive maintenance alerts', 'SLA tracking'] },
]

function PersonaCard({ p, i }) {
  const [open, setOpen] = useState(false)
  return (
    <motion.div variants={fadeUp} transition={{ delay: i * 0.07 }} layout
      onClick={() => setOpen(v => !v)}
      className="card-tinted p-5 cursor-pointer rounded-2xl" role="button" tabIndex={0}
      onKeyDown={e => e.key === 'Enter' && setOpen(v => !v)}>
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center text-lg"
            style={{ background: `${p.accent}15`, border: `1px solid ${p.accent}25` }}>{p.icon}</div>
          <div>
            <h3 className="font-display font-bold text-ink text-base leading-tight">{p.title}</h3>
            <p className="text-muted text-xs font-body">{p.tagline}</p>
          </div>
        </div>
        <motion.span animate={{ rotate: open ? 45 : 0 }} transition={{ duration: 0.2 }}
          className="text-muted text-lg mt-0.5 select-none">+</motion.span>
      </div>
      <p className="text-ink-3 text-sm font-body leading-relaxed">{p.summary}</p>
      <AnimatePresence>
        {open && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.28 }} className="overflow-hidden">
            <div className="mt-4 pt-4 border-t border-black/[0.06]">
              <div className="rounded-xl p-3 mb-3 text-sm font-body leading-relaxed"
                style={{ background: `${p.accent}08`, borderLeft: `3px solid ${p.accent}` }}>
                <span className="font-semibold text-ink-2">Challenge: </span>
                <span className="text-ink-3">{p.challenge}</span>
              </div>
              <ul className="flex flex-col gap-1.5">
                {p.details.map((d, j) => (
                  <li key={j} className="flex items-center gap-2 text-sm font-body text-ink-3">
                    <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: p.accent }} />{d}
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

function EcosystemSection() {
  return (
    <section id="ecosystem" style={{ background: '#FDF0F0' }} className="py-24 px-6">
      <div className="max-w-5xl mx-auto">
        <RevealGroup>
          <Eyebrow>The Ecosystem</Eyebrow>
          <motion.h2 variants={fadeUp} className="font-display font-black text-[clamp(2rem,5vw,3.5rem)] leading-tight text-ink mb-3">
            Six portals, <span className="text-gradient-green">one platform.</span>
          </motion.h2>
          <motion.p variants={fadeUp} className="text-ink-3 font-body mb-12 max-w-lg text-[0.95rem] leading-relaxed">
            Each persona has distinct goals. Click any card to see the problem it solves and what was designed for it.
          </motion.p>
        </RevealGroup>
        <RevealGroup className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {PERSONAS.map((p, i) => <PersonaCard key={p.id} p={p} i={i} />)}
        </RevealGroup>
      </div>
    </section>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// SECTION 4 — PROCESS  (white bg, horizontal timeline)
// ═══════════════════════════════════════════════════════════════════════════════

const STEPS = [
  { phase: 'Discover', icon: '🔍', color: '#008062', weeks: 'Wk 1–3', tasks: ['Stakeholder interviews', 'Store visit shadowing', 'Competitive audit', 'Affinity mapping'], out: 'Research synthesis + opportunity map' },
  { phase: 'Define', icon: '🎯', color: '#F4811F', weeks: 'Wk 4–5', tasks: ['Problem statement', 'JTBD mapping', 'Information architecture', 'Design principles'], out: 'IA blueprint + validated problem space' },
  { phase: 'Develop', icon: '✏️', color: '#F4811F', weeks: 'Wk 6–10', tasks: ['Low-fi wireframes (6x)', 'Design system build', 'Component library', 'Mid-fi user testing'], out: 'Hi-fi prototypes + component library' },
  { phase: 'Deliver', icon: '🚀', color: '#008062', weeks: 'Wk 11–14', tasks: ['Developer handoff', 'WCAG 2.2 AA audit', 'Usability testing R2', 'Final design QA'], out: 'Production design system + handoff' },
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
            14 weeks from first stakeholder interview to production handoff — diverge, converge, repeat.
          </motion.p>
        </RevealGroup>

        <div className="relative">
          {/* Timeline connector */}
          <div className="absolute top-[34px] left-[34px] right-[34px] h-px hidden lg:block"
            style={{ background: 'linear-gradient(90deg, #008062, #F4811F, #F4811F, #008062)' }} />

          <RevealGroup className="grid grid-cols-1 lg:grid-cols-4 gap-5">
            {STEPS.map((s, i) => (
              <motion.div key={s.phase} variants={fadeUp} transition={{ delay: i * 0.1 }}>
                <div className="relative z-10 mb-5 flex lg:block">
                  <div className="w-[68px] h-[68px] rounded-2xl flex items-center justify-center text-2xl flex-shrink-0"
                    style={{ background: `${s.color}12`, border: `1.5px solid ${s.color}30` }}>{s.icon}</div>
                </div>
                <div className="card p-5">
                  <div className="flex items-baseline justify-between mb-3">
                    <h3 className="font-display font-bold text-ink text-lg">{s.phase}</h3>
                    <span className="text-muted text-xs font-body">{s.weeks}</span>
                  </div>
                  <ul className="flex flex-col gap-1.5 mb-4">
                    {s.tasks.map((t, j) => (
                      <li key={j} className="flex items-start gap-2 text-xs font-body text-ink-3">
                        <span className="mt-1.5 w-1 h-1 rounded-full bg-black/20 flex-shrink-0" />{t}
                      </li>
                    ))}
                  </ul>
                  <div className="pt-3 border-t border-black/[0.06]">
                    <p className="text-[10px] font-body uppercase tracking-wider text-muted mb-1">Output</p>
                    <p className="text-xs font-body font-medium" style={{ color: s.color }}>{s.out}</p>
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

// ═══════════════════════════════════════════════════════════════════════════════
// SECTION 5 — DESIGN SYSTEM  (yellow-tinted bg like Shivani's yellow section)
// ═══════════════════════════════════════════════════════════════════════════════

const TOKENS = [
  { name: 'Primary', hex: '#008062', role: 'CTAs, success, actions' },
  { name: 'Primary Light', hex: '#00B882', role: 'Hover states' },
  { name: 'Alert', hex: '#ED2525', role: 'Urgent, critical' },
  { name: 'Accent', hex: '#F4811F', role: 'Warnings, secondary' },
  { name: 'Base Dark', hex: '#0D1F18', role: 'Page background (dark)' },
  { name: 'Surface', hex: '#122018', role: 'Cards (dark mode)' },
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
          <motion.p variants={fadeUp} className="text-ink-3 font-body mb-16 max-w-lg text-[0.95rem] leading-relaxed">
            A complete glassmorphic design language — color tokens, type scale, spacing system, and 60+ components built from scratch.
          </motion.p>
        </RevealGroup>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Color tokens — 3 cols */}
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
                    <div className="text-muted text-[10px] font-body leading-tight mt-0.5">{t.role}</div>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>

          {/* Typography + Spacing — 2 cols */}
          <Reveal className="lg:col-span-2 flex flex-col gap-4" delay={0.1}>
            <div>
              <div className="section-label mb-3">Typography</div>
              <div className="card p-5 flex flex-col gap-4">
                <div>
                  <p className="text-muted text-[10px] mb-1.5">Display — Barlow Condensed</p>
                  <p className="font-display font-black text-4xl text-ink leading-none">Aa Bb</p>
                  <p className="font-display font-semibold text-base text-ink-3 mt-1">Headlines · KPIs · Stats</p>
                </div>
                <div className="h-px bg-black/06" />
                <div>
                  <p className="text-muted text-[10px] mb-1.5">Body — Outfit</p>
                  <p className="font-body text-sm text-ink leading-relaxed">Aa Bb — clear, readable, friendly.</p>
                  <p className="font-body text-xs text-muted mt-1">UI copy · Labels · Paragraphs</p>
                </div>
              </div>
            </div>
            <div>
              <div className="section-label mb-3">8px Spacing Scale</div>
              <div className="card p-5">
                {[{ n: '1×', w: 8 }, { n: '2×', w: 16 }, { n: '3×', w: 24 }, { n: '4×', w: 32 }, { n: '6×', w: 48 }].map(s => (
                  <div key={s.n} className="flex items-center gap-3 mb-2 last:mb-0">
                    <div className="rounded-sm flex-shrink-0 bg-primary/30" style={{ width: s.w, height: 8, minWidth: 8 }} />
                    <span className="text-ink-3 text-[10px] font-mono w-6">{s.n}</span>
                    <span className="text-muted text-[10px] font-mono">{s.w}px</span>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        </div>

        {/* Glass state comparison */}
        <Reveal className="mt-6" delay={0.15}>
          <div className="section-label mb-3">Glassmorphism — Card States</div>
          <div className="card p-5">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                { label: 'Default', bg: '#0D1F18', border: 'rgba(255,255,255,0.08)', cardBg: 'rgba(255,255,255,0.04)' },
                { label: 'Hover', bg: '#0D1F18', border: 'rgba(0,128,98,0.4)', cardBg: 'rgba(255,255,255,0.07)' },
                { label: 'Active', bg: '#0D1F18', border: 'rgba(0,128,98,0.6)', cardBg: 'rgba(0,128,98,0.12)' },
              ].map(state => (
                <div key={state.label} className="rounded-xl overflow-hidden" style={{ background: state.bg, padding: 16 }}>
                  <div className="rounded-lg p-4" style={{ background: state.cardBg, border: `1px solid ${state.border}`, backdropFilter: 'blur(12px)' }}>
                    <div className="w-5 h-5 rounded bg-primary/30 mb-3" />
                    <div className="h-1.5 rounded-full bg-white/10 mb-2 w-3/4" />
                    <div className="h-1.5 rounded-full bg-white/06 w-1/2" />
                  </div>
                  <p className="text-white/30 text-[10px] font-body text-center mt-2">{state.label}</p>
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// SECTION 6 — KEY SCREENS  (light green bg like Shivani's green section)
// ═══════════════════════════════════════════════════════════════════════════════

const SCREENS = [
  { label: '[Store Manager Dashboard — KPI cards, freshness alerts, reorder panel]', wide: true, bg: '#0D1F18' },
  { label: '[Area Manager — Multi-store performance map]', wide: false, bg: '#122018' },
  { label: '[IoT Health — Device status heatmap]', wide: false, bg: '#1A0A0A' },
  { label: '[Inventory Forecast — AI reorder workflow]', wide: false, bg: '#1A1400' },
  { label: '[Distributor Order — Confirmation & scheduling]', wide: false, bg: '#0A1A14' },
  { label: '[IT Admin — Maintenance ticket queue]', wide: false, bg: '#1A0A0A' },
  { label: '[Design System — Figma component library]', wide: false, bg: '#0D1F18' },
  { label: '[Mobile — Store Manager responsive]', wide: false, bg: '#122018' },
]

function ScreensSection() {
  return (
    <section id="screens" style={{ background: '#EBF5EF' }} className="py-24 px-6">
      <div className="max-w-5xl mx-auto">
        <RevealGroup>
          <Eyebrow>Key Screens</Eyebrow>
          <motion.h2 variants={fadeUp} className="font-display font-black text-[clamp(2rem,5vw,3.5rem)] leading-tight text-ink mb-3">
            The platform,<br />screen by screen.
          </motion.h2>
          <motion.p variants={fadeUp} className="text-ink-3 font-body mb-12 max-w-md text-[0.95rem] leading-relaxed">
            Swap placeholders with real screenshots — slots preserve exact aspect ratios and intent.
          </motion.p>
        </RevealGroup>

        <RevealGroup className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {SCREENS.map((s, i) => (
            <motion.div key={i} variants={fadeUp} transition={{ delay: i * 0.06 }} className={s.wide ? 'sm:col-span-2' : ''}>
              <div className="card overflow-hidden">
                <ScreenBox label={s.label} aspect={s.wide ? '16/9' : '4/3'} bg={s.bg} />
              </div>
            </motion.div>
          ))}
        </RevealGroup>
      </div>
    </section>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// SECTION 7 — OUTCOMES  (white bg, animated counters)
// ═══════════════════════════════════════════════════════════════════════════════

const METRICS = [
  { value: 40, suffix: '%', label: 'Reduction in manual reorder time', color: '#008062' },
  { value: 6, suffix: 'x', label: 'Portals unified into one platform', color: '#F4811F' },
  { value: 28, suffix: '%', label: 'Faster IoT incident response', color: '#008062' },
  { value: 94, suffix: '%', label: 'Task completion in usability tests', color: '#008062' },
  { value: 3, suffix: 'K+', label: 'Store managers onboarded at launch', color: '#F4811F' },
  { value: 100, suffix: '%', label: 'WCAG 2.2 AA contrast compliance', color: '#008062' },
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
            Post-launch pilot data from 24 Northeast Region stores over 3 months.
          </motion.p>
        </RevealGroup>

        <RevealGroup className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {METRICS.map((m, i) => (
            <motion.div key={i} variants={fadeUp} transition={{ delay: i * 0.08 }}
              className="stat-card" style={{ borderTop: `3px solid ${m.color}` }}>
              <div className="font-display font-black text-4xl mb-1.5" style={{ color: m.color }}>
                <Counter value={m.value} suffix={m.suffix} />
              </div>
              <p className="text-ink-3 font-body text-sm leading-snug">{m.label}</p>
            </motion.div>
          ))}
        </RevealGroup>

        {/* Quote callout */}
        <Reveal className="mt-8" delay={0.2}>
          <div className="rounded-3xl p-8 border border-primary/15 relative overflow-hidden"
            style={{ background: 'linear-gradient(135deg, rgba(0,128,98,0.05) 0%, rgba(0,184,130,0.03) 100%)' }}>
            <div className="flex flex-col md:flex-row md:items-center gap-6">
              <div className="flex-1">
                <div className="text-4xl mb-4 text-primary font-display font-black leading-none">"</div>
                <h3 className="font-display font-bold text-2xl text-ink mb-2 leading-tight">
                  The dashboard replaced three morning meetings.
                </h3>
                <p className="text-ink-3 font-body text-sm">— Northeast Region Area Manager, pilot feedback</p>
              </div>
              <div className="w-px h-16 bg-black/08 hidden md:block" />
              <div className="text-center flex-shrink-0">
                <div className="font-display font-black text-5xl text-gradient-green">4.7</div>
                <div className="text-muted font-body text-xs mt-1">Pilot NPS (out of 5)</div>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
// SECTION 8 — REFLECTION  (pink-tinted bg, 2×2 cards like Shivani's cards)
// ═══════════════════════════════════════════════════════════════════════════════

const LEARNINGS = [
  { icon: '💡', title: 'Enterprise ≠ complex UI', body: 'The real skill was aggressive prioritization — what each role needs in the first 10 seconds, and what can be one more click away. Simplicity is a design decision, not a default.', color: '#008062' },
  { icon: '🏗️', title: 'Design systems are team infrastructure', body: 'Building the component library in parallel with portal #1 let devs start before designs were complete. Invest in foundations first, not wireframes.', color: '#F4811F' },
  { icon: '♿', title: 'Accessibility unlocks everyone', body: 'WCAG 2.2 AA contrast and touch targets made the UI better for all users — not just edge cases. It needs to be a launch gate, not a post-launch checklist.', color: '#008062' },
  { icon: '🤖', title: 'AI needs conservative UI', body: 'Users didn\'t trust AI suggestions without a rationale. "Recommended: 48 units — 3-day lead time, event nearby" doubled confidence scores vs. bare numbers.', color: '#ED2525' },
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
            14 weeks, 6 portals, 1 design system — hard-earned lessons on designing for complexity without creating it.
          </motion.p>
        </RevealGroup>

        <RevealGroup className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {LEARNINGS.map((item, i) => (
            <motion.div key={i} variants={fadeUp} transition={{ delay: i * 0.1 }}>
              <div className="card p-6 h-full hover:border-primary/20 transition-colors">
                <div className="text-2xl mb-4">{item.icon}</div>
                <div className="w-8 h-1 rounded-full mb-4" style={{ background: item.color }} />
                <h3 className="font-display font-bold text-xl text-ink mb-3">{item.title}</h3>
                <p className="text-ink-3 font-body text-sm leading-relaxed">{item.body}</p>
              </div>
            </motion.div>
          ))}
        </RevealGroup>

        {/* CTA close */}
        <Reveal className="mt-16 text-center" delay={0.2}>
          <div className="h-px bg-black/08 mb-14" />
          <div className="inline-flex items-center gap-2 bg-white border border-black/10 rounded-full px-5 py-2.5 mb-6 shadow-card">
            <span className="font-display font-bold text-sm tracking-wide text-ink-2">WorldLink</span>
            <span className="text-ink-3 text-xs">×</span>
            <span className="font-display font-black text-sm tracking-wide text-primary">7-ELEVEN</span>
          </div>
          <h3 className="font-display font-bold text-3xl text-ink mb-3">Want to go deeper?</h3>
          <p className="text-ink-3 font-body mb-8 max-w-sm mx-auto text-[0.95rem] leading-relaxed">
            Happy to walk through the research, design decisions, or the system in detail.
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

// ─── Root ─────────────────────────────────────────────────────────────────────

export default function CaseStudy() {
  return (
    <div className="min-h-screen bg-white text-ink overflow-x-hidden">
      {/* Global styles needed for btn-primary / btn-outline */}
      <style>{`
        .btn-primary { background:#111810;color:#fff;font-family:'Outfit',sans-serif;font-weight:600;font-size:.85rem;padding:12px 22px;border-radius:999px;display:inline-flex;align-items:center;gap:8px;transition:all .2s ease;text-decoration:none; }
        .btn-primary:hover { background:#008062;transform:translateY(-1px); }
        .btn-outline { background:transparent;color:#111810;border:1.5px solid rgba(0,0,0,.15);font-family:'Outfit',sans-serif;font-weight:600;font-size:.85rem;padding:12px 22px;border-radius:999px;display:inline-flex;align-items:center;gap:8px;transition:all .2s ease;text-decoration:none; }
        .btn-outline:hover { border-color:#008062;color:#008062;transform:translateY(-1px); }
      `}</style>
      <StickyNav />
      <HeroSection />
      <ContextSection />
      <EcosystemSection />
      <ProcessSection />
      <DesignSystemSection />
      <ScreensSection />
      <OutcomesSection />
      <ReflectionSection />
      <footer className="bg-white border-t border-black/[0.06] text-center py-6 text-muted font-body text-xs">
        7-Eleven AI Operations Platform · Portfolio Case Study · WorldLink × 7-Eleven
      </footer>
    </div>
  )
}
