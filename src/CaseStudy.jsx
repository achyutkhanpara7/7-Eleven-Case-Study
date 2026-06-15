import React, { useState, useEffect, useRef } from 'react'
import { motion, useScroll, useTransform, useInView, AnimatePresence } from 'framer-motion'

const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
}
const stagger = (delay = 0.1) => ({ visible: { transition: { staggerChildren: delay } } })
const slideLeft = {
  hidden: { opacity: 0, x: -24 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
}

function Section({ children, className = '', id = '' }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })
  return (
    <motion.section id={id} ref={ref} initial="hidden" animate={inView ? 'visible' : 'hidden'} variants={stagger()} className={`relative ${className}`}>
      {children}
    </motion.section>
  )
}

function GlassCard({ children, className = '', glow = null, onClick }) {
  const glowMap = { green: 'hover:shadow-glow-green', red: 'hover:shadow-glow-red', orange: 'hover:shadow-glow-orange' }
  return (
    <div onClick={onClick}
      className={`glass-card rounded-2xl transition-all duration-300 ease-out hover:-translate-y-0.5 hover:border-primary/40
        ${glow ? glowMap[glow] : ''} ${onClick ? 'cursor-pointer' : ''} ${className}`}>
      {children}
    </div>
  )
}

function Counter({ value, suffix = '', decimals = 0 }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-40px' })
  const [count, setCount] = useState(0)
  useEffect(() => {
    if (!inView) return
    const duration = 1800
    const start = performance.now()
    const target = parseFloat(value)
    const tick = (now) => {
      const progress = Math.min((now - start) / duration, 1)
      const ease = 1 - Math.pow(1 - progress, 3)
      setCount(parseFloat((target * ease).toFixed(decimals)))
      if (progress < 1) requestAnimationFrame(tick)
    }
    requestAnimationFrame(tick)
  }, [inView, value, decimals])
  return <span ref={ref}>{decimals > 0 ? count.toFixed(decimals) : Math.round(count)}{suffix}</span>
}

function Eyebrow({ children }) {
  return (
    <motion.div variants={fadeUp} className="flex items-center gap-3 mb-4">
      <div className="w-6 h-px bg-primary" />
      <span className="section-label">{children}</span>
    </motion.div>
  )
}

function ScreenPlaceholder({ label, aspectRatio = '16/10', accent = 'green' }) {
  const cls = { green: 'border-primary/30 bg-primary/5', red: 'border-alert/30 bg-alert/5', orange: 'border-accent/30 bg-accent/5' }
  const iconCls = { green: 'bg-primary/20 text-primary', red: 'bg-alert/20 text-alert', orange: 'bg-accent/20 text-accent' }
  return (
    <div className={`relative rounded-xl border-2 border-dashed overflow-hidden flex flex-col items-center justify-center gap-3 ${cls[accent]}`} style={{ aspectRatio }}>
      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${iconCls[accent]}`}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" /><path d="m21 15-5-5L5 21" />
        </svg>
      </div>
      <p className="text-xs font-body text-white/40 text-center px-4 leading-relaxed">{label}</p>
    </div>
  )
}

const PERSONAS = [
  { id: 'store-manager', title: 'Store Manager', icon: '🏪', color: 'green', tagline: 'Daily operations, at a glance', summary: 'Full-day operational view: inventory alerts, freshness timers, IoT device status, and reorder workflows — all from one dashboard.', details: ['Real-time SKU stock levels with AI reorder suggestions', 'Freshness countdown timers for perishable items', 'Maintenance ticket creation for equipment issues', 'Daily performance score vs. regional benchmarks'], challenge: 'Store managers were juggling 4+ separate tools to manage daily operations, causing missed restocks and slow incident response.' },
  { id: 'area-manager', title: 'Area Manager', icon: '📊', color: 'green', tagline: 'Cross-store oversight', summary: 'Bird\'s-eye view across 20–30 stores: anomaly detection, comparative analytics, and escalation management in one pane.', details: ['Comparative store performance ranking', 'AI-flagged anomalies across inventory and IoT health', 'Demand forecasting across cluster of stores', 'One-click escalation to maintenance teams'], challenge: 'Area managers lacked consolidated visibility — reports were manual, delayed, and missed systemic patterns across their store cluster.' },
  { id: 'distributor', title: 'Distributor', icon: '🚚', color: 'orange', tagline: 'Smarter delivery coordination', summary: 'AI-powered order recommendations, delivery scheduling, and real-time inventory sync to reduce waste and prevent stockouts.', details: ['AI-generated recommended order quantities', 'Delivery route prioritization by urgency', 'Direct integration with store inventory levels', 'Order confirmation and tracking in-platform'], challenge: 'Distributors relied on phone calls and static spreadsheets — leading to over-ordering, stockouts, and poor perishable management.' },
  { id: 'corporate', title: 'Corporate Portal', icon: '🏢', color: 'green', tagline: 'Chain-wide intelligence', summary: 'Executive-level analytics: regional breakdowns, KPI trends, category performance, and brand compliance monitoring.', details: ['National and regional revenue dashboards', 'Category-level demand trend analysis', 'Planogram compliance tracking', 'Export-ready reports for stakeholders'], challenge: 'Corporate had no real-time view — insights were lagging by days, making proactive decisions nearly impossible.' },
  { id: 'password-mgmt', title: 'Password Management', icon: '🔐', color: 'red', tagline: 'Secure, self-service access', summary: 'Streamlined identity flows for high-turnover retail staff: PIN resets, account unlocks, and role-based access provisioning.', details: ['Self-service PIN and password reset', 'Temporary access for seasonal staff', 'Role-based permission assignment', 'Audit trail for all access changes'], challenge: 'IT was overwhelmed with basic access requests from a 40,000+ workforce with high turnover, creating security gaps.' },
  { id: 'it-admin', title: 'IT Admin', icon: '⚙️', color: 'red', tagline: 'Fleet health, always visible', summary: 'IoT device monitoring, maintenance ticketing, and system health alerts across the entire store network.', details: ['Real-time IoT device status heatmap', 'Automated ticket routing by issue type', 'Predictive maintenance alerts from sensor data', 'SLA tracking for open maintenance tickets'], challenge: 'IT admins had no proactive monitoring — equipment failures were discovered by staff, not systems, causing avoidable downtime.' },
]

const PROCESS_STEPS = [
  { phase: 'Discover', icon: '🔍', color: '#008062', duration: 'Weeks 1–3', activities: ['Stakeholder interviews across 6 roles', 'Store visit shadowing sessions', 'Competitive landscape audit', 'Pain point affinity mapping'], output: 'User research synthesis + opportunity framework' },
  { phase: 'Define', icon: '🎯', color: '#F4811F', duration: 'Weeks 4–5', activities: ['Problem statement refinement', 'Jobs-to-be-done mapping', 'Information architecture', 'Design principles declaration'], output: 'Validated problem space + IA blueprint' },
  { phase: 'Develop', icon: '✏️', color: '#F4811F', duration: 'Weeks 6–10', activities: ['Low-fi wireframes (6 portals)', 'Design system foundation build', 'Component library in Figma', 'Mid-fi prototype testing'], output: 'Hi-fi prototypes + tested component library' },
  { phase: 'Deliver', icon: '🚀', color: '#008062', duration: 'Weeks 11–14', activities: ['Developer handoff specs', 'Accessibility audit (WCAG 2.2 AA)', 'Usability testing round 2', 'Final design QA'], output: 'Production-ready design system + handoff' },
]

const METRICS = [
  { value: 40, suffix: '%', label: 'Reduction in manual reorder time', color: 'green' },
  { value: 6, suffix: 'x', label: 'Portals unified into one platform', color: 'orange' },
  { value: 28, suffix: '%', label: 'Faster incident response (IoT)', color: 'green' },
  { value: 94, suffix: '%', label: 'Task completion in usability testing', color: 'green' },
  { value: 3, suffix: 'K+', label: 'Store managers onboarded at launch', color: 'orange' },
  { value: 100, suffix: '%', label: 'WCAG 2.2 AA contrast compliance', color: 'green' },
]

const SCREEN_GALLERY = [
  { label: '[Screenshot: Store Manager Dashboard — KPI cards and freshness alerts]', accent: 'green', wide: true },
  { label: '[Screenshot: Area Manager — Multi-store performance ranking]', accent: 'green', wide: false },
  { label: '[Screenshot: IoT Health Monitor — Device status heatmap]', accent: 'red', wide: false },
  { label: '[Screenshot: Inventory Forecast — AI reorder recommendation panel]', accent: 'orange', wide: false },
  { label: '[Screenshot: Distributor Order Workflow — Confirmation & scheduling]', accent: 'orange', wide: false },
  { label: '[Screenshot: IT Admin — Maintenance ticket queue + SLA tracker]', accent: 'red', wide: false },
  { label: '[Screenshot: Design System — Component library overview in Figma]', accent: 'green', wide: false },
  { label: '[Screenshot: Mobile — Store Manager responsive view]', accent: 'green', wide: false },
]

const COLOR_TOKENS = [
  { name: 'Primary', hex: '#008062', role: 'Actions, success states, CTAs' },
  { name: 'Primary Light', hex: '#00A87F', role: 'Hover states, highlights' },
  { name: 'Alert', hex: '#ED2525', role: 'Urgent items, critical alerts' },
  { name: 'Accent', hex: '#F4811F', role: 'Secondary actions, warnings' },
  { name: 'Base', hex: '#07100D', role: 'Page background' },
  { name: 'Surface', hex: '#122018', role: 'Card backgrounds' },
]

const NAV_ITEMS = [
  { id: 'hero', label: 'Overview' },
  { id: 'context', label: 'Context' },
  { id: 'ecosystem', label: 'Ecosystem' },
  { id: 'process', label: 'Process' },
  { id: 'design-system', label: 'Design System' },
  { id: 'screens', label: 'Screens' },
  { id: 'outcomes', label: 'Impact' },
  { id: 'reflection', label: 'Reflection' },
]

function StickyNav() {
  const [active, setActive] = useState('hero')
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const onScroll = () => {
      setVisible(window.scrollY > 200)
      const sections = NAV_ITEMS.map((n) => document.getElementById(n.id)).filter(Boolean)
      for (let i = sections.length - 1; i >= 0; i--) {
        if (window.scrollY >= sections[i].offsetTop - 120) { setActive(sections[i].id); break }
      }
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])
  return (
    <AnimatePresence>
      {visible && (
        <motion.nav initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }} transition={{ duration: 0.3 }}
          className="fixed top-4 left-1/2 -translate-x-1/2 z-50 glass-card rounded-full px-2 py-1.5 flex items-center gap-0.5 shadow-glass" aria-label="Page navigation">
          {NAV_ITEMS.map((item) => (
            <a key={item.id} href={`#${item.id}`}
              className={`px-3 py-1 rounded-full text-xs font-body font-medium transition-all duration-200 ${
                active === item.id ? 'bg-primary text-white' : 'text-white/50 hover:text-white/80 hover:bg-white/5'}`}>
              {item.label}
            </a>
          ))}
        </motion.nav>
      )}
    </AnimatePresence>
  )
}

function HeroSection() {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '30%'])
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0])
  return (
    <section id="hero" ref={ref} className="relative min-h-screen flex flex-col justify-center overflow-hidden">
      <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(ellipse 80% 60% at 50% 0%, rgba(0,128,98,0.12) 0%, transparent 70%)' }} />
      <motion.div style={{ y }} className="absolute right-[-4%] top-[10%] select-none pointer-events-none" aria-hidden="true">
        <span className="font-display font-black text-[28vw] leading-none" style={{ color: 'transparent', WebkitTextStroke: '1px rgba(0,128,98,0.12)', letterSpacing: '-0.04em' }}>7</span>
      </motion.div>
      <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: 'linear-gradient(rgba(0,128,98,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(0,128,98,0.06) 1px, transparent 1px)', backgroundSize: '80px 80px' }} />
      <motion.div style={{ opacity }} className="relative z-10 max-w-6xl mx-auto px-8 pt-32 pb-24">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }} className="flex items-center gap-4 mb-8">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
            <span className="font-display font-black text-white text-sm">7</span>
          </div>
          <span className="section-label">Case Study</span>
          <span className="w-1 h-1 rounded-full bg-white/20" />
          <span className="text-white/40 text-xs font-body">2024 — UX Design</span>
        </motion.div>
        <motion.h1 initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="font-display font-black text-[clamp(3rem,8vw,7rem)] leading-[0.92] tracking-tight mb-6">
          <span className="text-white">7-Eleven</span><br />
          <span className="text-gradient-green">AI Operations</span><br />
          <span className="text-white">Platform</span>
        </motion.h1>
        <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.4 }}
          className="text-white/60 text-lg font-body max-w-xl leading-relaxed mb-12">
          Unifying six fragmented operational tools into one intelligent platform — designed for 40,000+ store staff, area managers, and corporate stakeholders.
        </motion.p>
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.55 }} className="flex flex-wrap gap-3">
          {[{ label: 'Role', value: 'Lead UX Designer' }, { label: 'Tools', value: 'Figma · FigJam · Maze' }, { label: 'Timeline', value: '14 Weeks' }, { label: 'Team', value: 'Solo + Dev Squad' }].map((chip) => (
            <div key={chip.label} className="glass-card rounded-full px-4 py-2 flex items-center gap-2">
              <span className="text-white/30 text-xs font-body uppercase tracking-wider">{chip.label}</span>
              <span className="w-px h-3 bg-white/10" />
              <span className="text-white/80 text-sm font-body font-medium">{chip.value}</span>
            </div>
          ))}
        </motion.div>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2 }} className="absolute bottom-12 left-8 flex items-center gap-3">
          <motion.div animate={{ y: [0, 6, 0] }} transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}>
            <div className="w-0.5 h-6 bg-gradient-to-b from-primary to-transparent mx-auto" />
          </motion.div>
          <span className="text-white/25 text-xs font-body tracking-wider uppercase">Scroll to explore</span>
        </motion.div>
      </motion.div>
    </section>
  )
}

function ContextSection() {
  return (
    <Section id="context" className="max-w-6xl mx-auto px-8 py-24">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
        <div>
          <Eyebrow>Overview & Context</Eyebrow>
          <motion.h2 variants={fadeUp} className="font-display font-bold text-5xl text-white leading-tight mb-6">
            One company.<br /><span className="text-gradient-green">Six broken tools.</span>
          </motion.h2>
          <motion.p variants={fadeUp} className="text-white/60 font-body leading-relaxed mb-4">
            7-Eleven’s operations team managed daily store operations through a fragmented collection of legacy tools — each role required a different login, a different interface, and a different mental model. Store managers were context-switching constantly. Area managers had no real-time visibility. IT was reactive, not proactive.
          </motion.p>
          <motion.p variants={fadeUp} className="text-white/60 font-body leading-relaxed">
            The brief: design a unified AI-powered operations platform that serves every operational role — from the store floor to the corporate boardroom — without overwhelming any single user.
          </motion.p>
        </div>
        <div className="flex flex-col gap-4">
          {[
            { label: 'My Role', content: 'Lead UX Designer — responsible for end-to-end design across all six portals: research, information architecture, design system, prototyping, and developer handoff.', color: 'border-primary/30' },
            { label: 'Business Goals', content: 'Reduce operational friction, cut manual reporting time by 30%+, improve stock freshness compliance, and create a platform extensible to new AI features.', color: 'border-accent/30' },
            { label: 'Constraints', content: 'High staff turnover meant minimal training time. Devices ranged from modern tablets to aging touchscreens. WCAG 2.2 AA accessibility was non-negotiable.', color: 'border-alert/30' },
          ].map((item) => (
            <motion.div key={item.label} variants={slideLeft} className={`glass-card rounded-xl p-5 border-l-2 ${item.color}`}>
              <div className="section-label mb-2">{item.label}</div>
              <p className="text-white/70 font-body text-sm leading-relaxed">{item.content}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </Section>
  )
}

function PersonaCard({ persona, index }) {
  const [expanded, setExpanded] = useState(false)
  const accentColor = { green: '#008062', red: '#ED2525', orange: '#F4811F' }[persona.color]
  return (
    <motion.div variants={fadeUp} transition={{ delay: index * 0.08 }} layout
      onClick={() => setExpanded((v) => !v)} tabIndex={0} onKeyDown={(e) => e.key === 'Enter' && setExpanded((v) => !v)}
      className="glass-card rounded-2xl p-6 cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:border-white/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
      role="button" aria-expanded={expanded}>
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl" style={{ background: `${accentColor}20`, border: `1px solid ${accentColor}30` }}>{persona.icon}</div>
          <div>
            <h3 className="font-display font-bold text-white text-lg leading-tight">{persona.title}</h3>
            <p className="text-white/40 text-xs font-body">{persona.tagline}</p>
          </div>
        </div>
        <motion.span animate={{ rotate: expanded ? 45 : 0 }} transition={{ duration: 0.2 }} className="text-white/30 text-xl mt-0.5" aria-hidden="true">+</motion.span>
      </div>
      <p className="text-white/60 font-body text-sm leading-relaxed">{persona.summary}</p>
      <AnimatePresence>
        {expanded && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.3 }} className="overflow-hidden">
            <div className="mt-5 pt-5 border-t border-white/[0.06]">
              <div className="mb-4 p-3 rounded-lg" style={{ background: `${accentColor}10`, border: `1px solid ${accentColor}20` }}>
                <p className="text-xs font-body text-white/50 mb-1 uppercase tracking-wider">The Problem</p>
                <p className="text-sm font-body text-white/70 leading-relaxed">{persona.challenge}</p>
              </div>
              <p className="text-xs font-body text-white/40 uppercase tracking-wider mb-3">Key Features</p>
              <ul className="flex flex-col gap-2">
                {persona.details.map((d, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-sm font-body text-white/65">
                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: accentColor }} />{d}
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
    <Section id="ecosystem" className="max-w-6xl mx-auto px-8 py-24">
      <Eyebrow>The Ecosystem</Eyebrow>
      <motion.h2 variants={fadeUp} className="font-display font-bold text-5xl text-white leading-tight mb-3">Six portals,<br /><span className="text-gradient-green">one platform.</span></motion.h2>
      <motion.p variants={fadeUp} className="text-white/50 font-body mb-12 max-w-xl leading-relaxed">Each persona has distinct goals and workflows. Click any card to see the problem it solves and the features designed for it.</motion.p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {PERSONAS.map((p, i) => <PersonaCard key={p.id} persona={p} index={i} />)}
      </div>
    </Section>
  )
}

function ProcessSection() {
  return (
    <Section id="process" className="max-w-6xl mx-auto px-8 py-24">
      <Eyebrow>Design Process</Eyebrow>
      <motion.h2 variants={fadeUp} className="font-display font-bold text-5xl text-white leading-tight mb-3">Double Diamond,<br /><span className="text-gradient-warm">grounded in field research.</span></motion.h2>
      <motion.p variants={fadeUp} className="text-white/50 font-body mb-16 max-w-lg leading-relaxed">Fourteen weeks from first stakeholder interview to final developer handoff — using a structured diverge-converge methodology adapted for enterprise retail complexity.</motion.p>
      <div className="relative">
        <div className="absolute top-9 left-9 right-9 h-px hidden lg:block" style={{ background: 'linear-gradient(90deg, #008062, #F4811F, #F4811F, #008062)' }} />
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {PROCESS_STEPS.map((step, i) => (
            <motion.div key={step.phase} variants={fadeUp} transition={{ delay: i * 0.1 }}>
              <div className="relative z-10 mb-6">
                <div className="w-[72px] h-[72px] rounded-2xl flex items-center justify-center text-2xl mb-4 mx-auto lg:mx-0" style={{ background: `${step.color}18`, border: `1px solid ${step.color}40` }}>{step.icon}</div>
              </div>
              <div className="glass-card rounded-xl p-5">
                <div className="flex items-baseline justify-between mb-3">
                  <h3 className="font-display font-bold text-white text-xl">{step.phase}</h3>
                  <span className="text-white/30 text-xs font-body">{step.duration}</span>
                </div>
                <ul className="flex flex-col gap-1.5 mb-4">
                  {step.activities.map((a, j) => (
                    <li key={j} className="text-xs font-body text-white/55 flex items-start gap-2">
                      <span className="mt-1.5 w-1 h-1 rounded-full bg-white/25 flex-shrink-0" />{a}
                    </li>
                  ))}
                </ul>
                <div className="pt-3 border-t border-white/[0.06]">
                  <p className="text-xs font-body text-white/35 uppercase tracking-wider mb-1">Output</p>
                  <p className="text-xs font-body" style={{ color: step.color }}>{step.output}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </Section>
  )
}

function DesignSystemSection() {
  return (
    <Section id="design-system" className="max-w-6xl mx-auto px-8 py-24">
      <Eyebrow>Design System</Eyebrow>
      <motion.h2 variants={fadeUp} className="font-display font-bold text-5xl text-white leading-tight mb-3">7-Eleven Design System<br /><span className="text-gradient-green">v2.0</span></motion.h2>
      <motion.p variants={fadeUp} className="text-white/50 font-body mb-16 max-w-xl leading-relaxed">A complete glassmorphic design language built from scratch — color tokens, typography scale, spacing system, and 60+ components.</motion.p>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <motion.div variants={fadeUp} className="lg:col-span-2">
          <div className="section-label mb-4">Color Tokens</div>
          <div className="glass-card rounded-2xl p-6">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {COLOR_TOKENS.map((token) => (
                <div key={token.name} className="group">
                  <div className="h-16 rounded-xl mb-2 transition-transform duration-200 group-hover:-translate-y-0.5" style={{ backgroundColor: token.hex }} />
                  <div className="text-white/80 text-xs font-body font-medium">{token.name}</div>
                  <div className="text-white/35 text-xs font-mono">{token.hex}</div>
                  <div className="text-white/30 text-xs font-body leading-tight mt-0.5">{token.role}</div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
        <motion.div variants={fadeUp} className="flex flex-col gap-4">
          <div>
            <div className="section-label mb-4">Typography</div>
            <div className="glass-card rounded-2xl p-6 flex flex-col gap-5">
              <div>
                <p className="text-white/30 text-xs mb-2">Display — Barlow Condensed</p>
                <p className="font-display font-black text-4xl text-white leading-tight">Aa Bb Cc</p>
                <p className="font-display font-bold text-xl text-white/60 mt-1">Headlines / KPIs</p>
              </div>
              <div className="divider-green" />
              <div>
                <p className="text-white/30 text-xs mb-2">Body — Outfit</p>
                <p className="font-body text-base text-white leading-relaxed">Aa Bb Cc — the quick brown fox.</p>
                <p className="font-body text-sm text-white/50 mt-1">Paragraphs / Labels / UI copy</p>
              </div>
            </div>
          </div>
          <div>
            <div className="section-label mb-4">Spacing Scale (8px base)</div>
            <div className="glass-card rounded-2xl p-6">
              {[{ step: '1×', px: '8px', use: 'Inline gaps' }, { step: '2×', px: '16px', use: 'Component padding' }, { step: '3×', px: '24px', use: 'Card padding' }, { step: '4×', px: '32px', use: 'Section gaps' }, { step: '6×', px: '48px', use: 'Layout sections' }].map((s) => (
                <div key={s.step} className="flex items-center gap-3 mb-2.5 last:mb-0">
                  <div className="bg-primary/40 rounded flex-shrink-0" style={{ width: parseInt(s.px), height: '8px', minWidth: '8px' }} />
                  <span className="text-white/60 text-xs font-mono w-8">{s.step}</span>
                  <span className="text-white/40 text-xs font-mono w-10">{s.px}</span>
                  <span className="text-white/30 text-xs">{s.use}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
      <motion.div variants={fadeUp} className="mt-8">
        <div className="section-label mb-4">Glassmorphism — Card States</div>
        <div className="glass-card rounded-2xl p-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[{ label: 'Default', bg: 'rgba(255,255,255,0.04)', border: 'rgba(255,255,255,0.08)' }, { label: 'Hover', bg: 'rgba(255,255,255,0.07)', border: 'rgba(0,128,98,0.4)' }, { label: 'Active', bg: 'rgba(0,128,98,0.1)', border: 'rgba(0,128,98,0.5)' }].map((state) => (
              <div key={state.label} className="rounded-xl p-5 transition-all duration-300 hover:-translate-y-0.5" style={{ background: state.bg, border: `1px solid ${state.border}`, backdropFilter: 'blur(16px)' }}>
                <div className="w-6 h-6 rounded-md bg-primary/30 mb-3" />
                <div className="h-2 rounded-full bg-white/10 mb-2 w-3/4" />
                <div className="h-2 rounded-full bg-white/[0.06] w-1/2" />
                <div className="mt-3 text-xs text-white/40">{state.label} state</div>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </Section>
  )
}

function ScreensSection() {
  return (
    <Section id="screens" className="max-w-6xl mx-auto px-8 py-24">
      <Eyebrow>Key Screens</Eyebrow>
      <motion.h2 variants={fadeUp} className="font-display font-bold text-5xl text-white leading-tight mb-3">The platform, screen by screen.</motion.h2>
      <motion.p variants={fadeUp} className="text-white/50 font-body mb-12 max-w-lg leading-relaxed">Screenshots will be swapped in — placeholders preserve exact dimensions and intent.</motion.p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {SCREEN_GALLERY.map((screen, i) => (
          <motion.div key={i} variants={fadeUp} transition={{ delay: i * 0.06 }} className={screen.wide ? 'sm:col-span-2' : ''}>
            <div className="glass-card rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-1">
              <ScreenPlaceholder label={screen.label} aspectRatio={screen.wide ? '16/9' : '4/3'} accent={screen.accent} />
            </div>
          </motion.div>
        ))}
      </div>
    </Section>
  )
}

function OutcomesSection() {
  return (
    <Section id="outcomes" className="max-w-6xl mx-auto px-8 py-24">
      <Eyebrow>Outcomes & Impact</Eyebrow>
      <motion.h2 variants={fadeUp} className="font-display font-bold text-5xl text-white leading-tight mb-3">Numbers that<br /><span className="text-gradient-green">moved the needle.</span></motion.h2>
      <motion.p variants={fadeUp} className="text-white/50 font-body mb-16 max-w-xl leading-relaxed">Post-launch metrics from pilot rollout across the Northeast Region — 24 stores, 3 months of data.</motion.p>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {METRICS.map((m, i) => {
          const colors = { green: { border: 'rgba(0,128,98,0.2)', text: '#00C896' }, orange: { border: 'rgba(244,129,31,0.2)', text: '#F4811F' } }
          const c = colors[m.color]
          return (
            <motion.div key={i} variants={fadeUp} transition={{ delay: i * 0.08 }}
              className="glass-card rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1" style={{ borderColor: c.border }}>
              <div className="font-display font-black text-5xl mb-2 leading-none" style={{ color: c.text }}>
                <Counter value={m.value} suffix={m.suffix} />
              </div>
              <p className="text-white/55 font-body text-sm leading-snug">{m.label}</p>
            </motion.div>
          )
        })}
      </div>
      <motion.div variants={fadeUp} className="mt-8 glass-card rounded-2xl p-8 border-primary/30 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-transparent pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center gap-6">
          <div className="flex-1">
            <div className="section-label mb-3">Launch Signal</div>
            <h3 className="font-display font-bold text-2xl text-white mb-2">“The dashboard replaced three morning meetings.”</h3>
            <p className="text-white/50 font-body text-sm">— Northeast Region Area Manager, pilot feedback session</p>
          </div>
          <div className="w-px h-16 bg-white/10 hidden md:block" />
          <div className="text-center">
            <div className="font-display font-black text-5xl text-gradient-green">4.7</div>
            <div className="text-white/40 font-body text-xs mt-1">Pilot NPS (out of 5)</div>
          </div>
        </div>
      </motion.div>
    </Section>
  )
}

function ReflectionSection() {
  const learnings = [
    { title: 'Enterprise ≠ complex UI', body: 'The temptation in B2B design is to surface everything. The real skill was aggressive prioritization — understanding what each role needed to see in the first 10 seconds, and what could be one more click away.', icon: '💡' },
    { title: 'Design systems are team infrastructure', body: 'Building the component library in parallel with the first portal screens let the dev team start building before the final designs were complete. Speed came from investing in foundations first, not shipping wireframes fast.', icon: '🏗️' },
    { title: 'Accessibility unlocks usability for everyone', body: 'Designing for WCAG 2.2 AA — especially contrast ratios and touch targets — made the interface better for every user. Making it a launch requirement, not a post-launch audit, was the right call.', icon: '♿' },
    { title: 'AI features need conservative interfaces', body: 'Users didn\'t trust AI recommendations until they could see why a suggestion was made. Pairing every AI output with its rationale doubled confidence scores in usability testing.', icon: '🤖' },
  ]
  return (
    <Section id="reflection" className="max-w-6xl mx-auto px-8 py-24 pb-40">
      <Eyebrow>Reflection & Learnings</Eyebrow>
      <motion.h2 variants={fadeUp} className="font-display font-bold text-5xl text-white leading-tight mb-3">What this project<br /><span className="text-gradient-warm">taught me.</span></motion.h2>
      <motion.p variants={fadeUp} className="text-white/50 font-body mb-16 max-w-xl leading-relaxed">Fourteen weeks, six portals, one design system — and a handful of hard-earned lessons about designing for complexity without creating it.</motion.p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {learnings.map((item, i) => (
          <motion.div key={i} variants={fadeUp} transition={{ delay: i * 0.1 }}>
            <GlassCard className="p-6 h-full" glow="green">
              <div className="text-2xl mb-4">{item.icon}</div>
              <h3 className="font-display font-bold text-xl text-white mb-3">{item.title}</h3>
              <p className="text-white/60 font-body text-sm leading-relaxed">{item.body}</p>
            </GlassCard>
          </motion.div>
        ))}
      </div>
      <motion.div variants={fadeUp} className="mt-16 text-center">
        <div className="divider-green mb-12" />
        <h3 className="font-display font-bold text-3xl text-white mb-4">Want to talk about this project?</h3>
        <p className="text-white/45 font-body mb-8 max-w-md mx-auto leading-relaxed">I’m happy to walk through the research, the design decisions, or the design system in detail — just reach out.</p>
        <div className="flex items-center justify-center gap-4 flex-wrap">
          <a href="mailto:achyutkhanpara7@gmail.com"
            className="inline-flex items-center gap-2 bg-primary hover:bg-primary-light text-white font-body font-medium px-6 py-3 rounded-full transition-all duration-200 hover:-translate-y-0.5">
            Get in touch
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
          </a>
          <a href="#hero" className="inline-flex items-center gap-2 glass-card text-white/70 hover:text-white font-body font-medium px-6 py-3 rounded-full transition-all duration-200">Back to top</a>
        </div>
      </motion.div>
    </Section>
  )
}

export default function CaseStudy() {
  return (
    <div className="min-h-screen bg-base text-white overflow-x-hidden">
      <StickyNav />
      <HeroSection />
      <div className="divider-green" />
      <ContextSection />
      <div className="divider-green" />
      <EcosystemSection />
      <div className="divider-green" />
      <ProcessSection />
      <div className="divider-green" />
      <DesignSystemSection />
      <div className="divider-green" />
      <ScreensSection />
      <div className="divider-green" />
      <OutcomesSection />
      <div className="divider-green" />
      <ReflectionSection />
      <footer className="text-center py-8 text-white/20 font-body text-xs border-t border-white/[0.05]">
        7-Eleven AI Operations Platform — Portfolio Case Study
      </footer>
    </div>
  )
}
