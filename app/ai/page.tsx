import Link from 'next/link'
import type { Metadata } from 'next'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import Button from '@/components/ui/Button'
import {
  Sparkles, Shield, Bot, AlertTriangle, UserCheck, Receipt,
  Zap, Calendar, HelpCircle, FileText, ClipboardCopy, BadgeAlert,
  ArrowRight, CheckCircle2, MessageSquare, Layers, ShieldCheck, Cpu
} from 'lucide-react'

export const metadata: Metadata = {
  title: 'DeployGuard AI — Ten Built-In AI Tools for Security Operations',
  description:
    'Attendance anomaly detection, guard risk profiling, billing auditing, smart shift fill, incident advisors, and a global AI assistant — all woven into your daily security management workflows.',
  alternates: { canonical: 'https://deployguard.io/ai' },
  openGraph: {
    title: 'DeployGuard AI — Intelligent Security Operations',
    description: '10 purpose-built AI features embedded directly into your security platform. Powered by Claude, GPT-4o, or Gemini.',
    url: 'https://deployguard.io/ai',
    images: [{ url: '/screenshots/executive-dashboard.png', width: 1280, height: 720 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'DeployGuard AI — Built-in Intelligence for Security Companies',
    description: '10 AI tools for guard management, payroll, and billing — no extra app, no separate console.',
    images: ['/screenshots/executive-dashboard.png'],
  },
}


const aiFeatures = [
  {
    icon: <BadgeAlert className="w-6 h-6 text-primary" />,
    title: '1. Attendance Anomaly Detection',
    subtitle: 'Integrated directly on every Payslip',
    description: 'Scans a guard’s attendance records for the period and flags unusual AWOL patterns, consecutive late arrivals, or excessive unpaid hours before you process payroll.',
    quote: '"3 AWOL occurrences this period — 2 more than the previous month. Reliability score has dropped 8 points. Recommend disciplinary review before pay confirmation."'
  },
  {
    icon: <UserCheck className="w-6 h-6 text-primary" />,
    title: '2. Guard Risk Profiling',
    subtitle: 'Available on every Guard Profile',
    description: 'Synthesizes 90 days of attendance, incidents, leave, document compliance, and reliability scores into an objective risk level (LOW/MED/HIGH/CRITICAL) and explanation.',
    quote: '"MEDIUM risk. Attendance rate of 84% is below site average. Two AWOL incidents in 90 days, with a pattern of Mondays and Fridays. Recommend a supervisor attendance conversation."'
  },
  {
    icon: <Receipt className="w-6 h-6 text-primary" />,
    title: '3. Billing Auditor',
    subtitle: 'Runs on every Invoice draft',
    description: 'Cross-checks every billed post and hour against actual GPS and attendance records. Catches overbilling and underbilling errors before they reach the client.',
    quote: '"WARNING: Gate 1 post billed for 440 hours. Attendance records show 423 worked hours. Potential overbilling of 17 hours × N$45/hr = N$765. Verify against overtime approvals."'
  },
  {
    icon: <Calendar className="w-6 h-6 text-primary" />,
    title: '4. Roster Optimizer',
    subtitle: 'Fills open posts in seconds',
    description: 'Scans available guards and assigns them based on site familiarity, certifications, reliability scores, and workload fairness, while enforcing rest periods.',
    quote: '"Roster optimized: 14 open slots filled. 100% compliance with rest-period rules. Grade A guards matched to premium client posts."'
  },
  {
    icon: <Zap className="w-6 h-6 text-primary" />,
    title: '5. Smart Shift Fill',
    subtitle: 'Instant sick-leave replacements',
    description: 'When a guard calls in sick, the AI automatically scans available off-duty guards, matches qualifications, filters out site exclusions, and ranks top 3 replacements.',
    quote: '"#1: Guard T. Shikongo — Grade A, reliability 91/100, only 18 shifts this month. Site-familiar. No expiring documents."'
  },
  {
    icon: <ShieldCheck className="w-6 h-6 text-primary" />,
    title: '6. Incident Consequence Advisor',
    subtitle: 'Disciplinaries compliant with labour law',
    description: 'Analyzes a guard’s behavioral incident and 12-month history to recommend the correct disciplinary step. Generates legally compliant letter templates.',
    quote: '"Incident: Unauthorised absence. Hist: 1 verbal warning (Jan). Recommended action: Written Warning. Standard letter drafted for HR sign-off."'
  },
  {
    icon: <Layers className="w-6 h-6 text-primary" />,
    title: '7. Leave Coverage Check',
    subtitle: 'Predicts understaffing before approval',
    description: 'Calculates the exact operational impact of a leave request, indicating remaining coverage at assigned sites and flagging critical staffing gaps.',
    quote: '"Site Alpha will have 2 guards on leave simultaneously on 14–16 June, leaving only 1 guard for a 3-post site. Recommend staggered approval."'
  },
  {
    icon: <FileText className="w-6 h-6 text-primary" />,
    title: '8. Document Renewal Letter Generator',
    subtitle: 'One-click compliance compliance notifications',
    description: 'Drafts formal, professional renewal letters to guards whose IDs, firearm certificates, or police clearances are expiring, listing required actions.',
    quote: '"Renewal Letter drafted for Guard M. Ndolo (Firearm Certificate expires in 30 days). Details the renewal steps and deadline of 20 June."'
  },
  {
    icon: <ClipboardCopy className="w-6 h-6 text-primary" />,
    title: '9. Guard Performance Reviewer',
    subtitle: 'Automated quarterly assessments',
    description: 'Compiles objective statistics from the last 90 days into formal performance reviews, generating narratives and development advice in seconds.',
    quote: '"Overall rating: SATISFACTORY. Reliability trend: Improving (+5%). Attendance: 92%. Development: Recommend firearm refresher course due next month."'
  },
  {
    icon: <HelpCircle className="w-6 h-6 text-primary" />,
    title: '10. Payslip Plain-English Explainer',
    subtitle: 'Fewer payroll disputes, higher trust',
    description: 'Translates complex payslip lines (earnings, tax brackets, SSC caps, deductions) into a clean, simple message for guards to understand.',
    quote: '"You worked 22 days. Basic pay is 22 × N$230/day = N$5,060. PAYE tax is N$380 as required by law. SSC deduction is N$180... Net Pay is N$4,500."'
  }
]

export default function AiFeaturesPage() {
  return (
    <>
      <Navbar />
      <main className="bg-background min-h-screen text-foreground">
        
        {/* Hero Section */}
        <section className="relative bg-secondary pt-32 pb-24 px-4 sm:px-6 lg:px-8 text-center overflow-hidden">
          <div
            aria-hidden
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage: 'linear-gradient(white 1px,transparent 1px),linear-gradient(90deg,white 1px,transparent 1px)',
              backgroundSize: '48px 48px',
            }}
          />
          <div className="relative max-w-4xl mx-auto">
            <span className="inline-flex items-center gap-1.5 bg-primary/10 border border-primary/20 text-primary text-xs font-semibold px-3.5 py-1.5 rounded-full mb-6 uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" /> Next-Gen Security Management
            </span>
            <h1 className="text-4xl sm:text-6xl font-extrabold text-white leading-tight mb-6">
              DeployGuard <span className="text-primary">AI</span>
            </h1>
            <p className="text-lg sm:text-xl text-white/70 max-w-2xl mx-auto mb-10 leading-relaxed">
              Intelligent operations built directly into the platform. Ten purpose-built AI tools 
              and a global assistant designed from the ground up for security services.
            </p>
            <div className="flex justify-center gap-4">
              <Link href="/start">
                <Button size="lg" className="shadow-lg">Book a Demo</Button>
              </Link>
              <Link href="#assistant">
                <Button size="lg" variant="outline" className="text-white border-white/20 hover:bg-white/10 hover:text-white">
                  Meet the Assistant
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* 10 Features Grid */}
        <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-sm font-semibold text-primary uppercase tracking-widest mb-2">Built-in Intelligence</p>
            <h2 className="text-3xl sm:text-4xl font-extrabold mb-4">Ten Features Working Where You Work</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Every AI capability is woven into the exact screen where decisions are made. No separate AI console,
              no copy-pasting required.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {aiFeatures.map((f, i) => (
              <div key={i} className="bg-card border border-border rounded-2xl p-6 sm:p-8 flex flex-col justify-between hover:shadow-card-hover transition-all duration-300">
                <div>
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                      {f.icon}
                    </div>
                    <div>
                      <h3 className="font-extrabold text-lg text-foreground leading-tight">{f.title}</h3>
                      <p className="text-xs text-primary font-medium mt-0.5">{f.subtitle}</p>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-6">
                    {f.description}
                  </p>
                </div>
                
                {/* Simulated AI Output Box */}
                <div className="bg-muted/40 rounded-xl p-4 border border-border/60">
                  <div className="flex items-center gap-2 mb-2">
                    <Cpu className="w-3.5 h-3.5 text-primary" />
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Example AI Insight</span>
                  </div>
                  <p className="text-xs italic text-foreground/80 leading-relaxed font-mono">
                    {f.quote}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Floating Global AI Assistant Section */}
        <section id="assistant" className="py-24 px-4 sm:px-6 lg:px-8 bg-secondary text-white overflow-hidden">
          <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
            
            {/* Left description */}
            <div>
              <span className="inline-flex items-center gap-1 bg-white/5 border border-white/10 text-primary text-xs font-semibold px-3 py-1 rounded-full mb-6 uppercase tracking-wider">
                <Bot className="w-3.5 h-3.5" /> Floating Chat Widget
              </span>
              <h2 className="text-3.5xl sm:text-4.5xl font-extrabold mb-6 leading-tight">
                The Global AI Assistant
              </h2>
              <p className="text-white/60 text-base leading-relaxed mb-8">
                Available on every screen via a floating panel. The Assistant has secure, read-write access
                to your Odoo operational models, allowing you to ask questions, pull summaries, and take
                actions in plain English.
              </p>

              <div className="space-y-4">
                {[
                  'Real-time data access — search guard lists, roster status, and overdue invoices.',
                  'One-click navigation chips to open records directly without search fields.',
                  'Interactive formatting — automatically constructs tables, charts, and summaries.',
                  'Strict Confirmation Gate — the AI cannot modify database records without your manual approval.'
                ].map((item, idx) => (
                  <div key={idx} className="flex gap-3 items-start">
                    <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                    <p className="text-sm text-white/80">{item}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Simulated Assistant Chat UI */}
            <div className="bg-[#0b1329] border border-white/10 rounded-2xl shadow-2xl overflow-hidden font-sans">
              
              {/* Header */}
              <div className="px-5 py-4 bg-white/5 border-b border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                    <Bot className="w-4 h-4 text-primary-foreground" />
                  </div>
                  <div>
                    <p className="text-sm font-bold leading-none">DeployGuard Assistant</p>
                    <p className="text-[10px] text-primary font-medium mt-1">Operational Support Agent</p>
                  </div>
                </div>
                <div className="flex gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-green-500" />
                  <span className="text-[10px] text-white/50">Online</span>
                </div>
              </div>

              {/* Chat messages */}
              <div className="p-5 space-y-4 max-h-[350px] overflow-y-auto">
                <div className="flex justify-end">
                  <div className="bg-primary/10 border border-primary/20 text-white rounded-2xl rounded-tr-none px-4 py-2.5 max-w-[80%] text-xs">
                    Who are the top 3 guards by reliability score in Windhoek, and can we assign them to Gate 1 tomorrow?
                  </div>
                </div>

                <div className="flex gap-3">
                  <div className="w-7 h-7 rounded-full bg-primary/25 flex items-center justify-center shrink-0">
                    <Bot className="w-3.5 h-3.5 text-primary" />
                  </div>
                  <div className="bg-white/5 border border-white/10 text-white/90 rounded-2xl rounded-tl-none px-4 py-2.5 max-w-[85%] text-xs space-y-3">
                    <p>Here are the top 3 guards based in Windhoek with a high reliability rating:</p>
                    
                    <table className="w-full text-[10px] border-collapse">
                      <thead>
                        <tr className="border-b border-white/10 text-white/50">
                          <th className="text-left pb-1 font-medium">Guard Name</th>
                          <th className="text-center pb-1 font-medium">Reliability</th>
                          <th className="text-right pb-1 font-medium">Site Familiarity</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b border-white/5">
                          <td className="py-1">J. Nangolo</td>
                          <td className="py-1 text-center text-green-400">96/100</td>
                          <td className="py-1 text-right">Gate 1, Depot</td>
                        </tr>
                        <tr className="border-b border-white/5">
                          <td className="py-1">S. Hamukoto</td>
                          <td className="py-1 text-center text-green-400">94/100</td>
                          <td className="py-1 text-right">Main Office</td>
                        </tr>
                        <tr>
                          <td className="py-1">T. Shikongo</td>
                          <td className="py-1 text-center text-green-400">91/100</td>
                          <td className="py-1 text-right">Gate 1</td>
                        </tr>
                      </tbody>
                    </table>

                    <p>I can schedule **J. Nangolo** to Gate 1 tomorrow (4 June, Day Shift) as he is off-duty and has had a 24-hour rest period. Would you like me to create this assignment?</p>

                    {/* Proposed Action Confirmation Box */}
                    <div className="bg-primary/5 border border-primary/20 rounded-xl p-3 mt-2 space-y-2.5">
                      <div className="flex gap-2 items-center text-[10px] font-semibold text-primary">
                        <Shield className="w-3.5 h-3.5" /> CONFIRMATION REQUIRED
                      </div>
                      <p className="text-[10px] text-white/70 leading-normal">
                        Create shift assignment for **J. Nangolo** at site **Gate 1** on **4 June 2026 (06:00 - 18:00)**.
                      </p>
                      <div className="flex gap-2">
                        <button className="bg-primary text-primary-foreground font-semibold px-3 py-1 rounded text-[10px] hover:bg-primary/90 transition-colors">
                          Confirm Action
                        </button>
                        <button className="bg-white/10 hover:bg-white/15 text-white px-3 py-1 rounded text-[10px] transition-colors">
                          Cancel
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* Enterprise AI Infrastructure Table */}
        <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-sm font-semibold text-primary uppercase tracking-widest mb-2">Under the Hood</p>
            <h2 className="text-3xl font-extrabold mb-4">Enterprise AI Infrastructure</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              We built the AI engine for production use, focusing on cost management, auditing, and reliability.
            </p>
          </div>

          <div className="border border-border rounded-2xl overflow-hidden bg-card">
            <table className="w-full text-left text-sm border-collapse">
              <thead>
                <tr className="border-b border-border bg-muted/30">
                  <th className="py-4 px-6 font-semibold text-foreground w-1/3">Feature</th>
                  <th className="py-4 px-6 font-semibold text-foreground">Operational Benefit</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { title: 'Multi-Provider Engine', desc: 'Choose between Anthropic (Claude 3.5), OpenAI (GPT-4o), or Google (Gemini 1.5) without changing any code.' },
                  { title: 'Automatic Fallback', desc: 'If your primary AI provider experiences an outage, the engine seamlessly retries using your configured backup.' },
                  { title: 'Smart Caching (40–70% Savings)', desc: 'Identical insights are cached for 24 hours, reducing API call volume and costs significantly.' },
                  { title: 'Complete Cost Audit Trails', desc: 'Log files record prompt version, input/output tokens, cost in NAD, user, and action taken for every single AI call.' },
                  { title: 'User Feedback Loop', desc: 'Users can Accept, Reject, or Flag AI recommendations, generating quality reports to evaluate prompt accuracy.' }
                ].map((row, index) => (
                  <tr key={index} className="border-b border-border/60 hover:bg-muted/10 transition-colors">
                    <td className="py-4 px-6 font-bold text-foreground">{row.title}</td>
                    <td className="py-4 px-6 text-muted-foreground leading-relaxed">{row.desc}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Pricing Pass-Through & Callout */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-[#f1f5f9] border-t border-border">
          <div className="max-w-4xl mx-auto text-center space-y-6">
            <h2 className="text-3xl font-extrabold">True Pass-Through Pricing</h2>
            <p className="text-muted-foreground leading-relaxed max-w-2xl mx-auto">
              DeployGuard AI is included in the platform. You pay only for the exact API calls you make —
              passed directly through from your chosen AI provider at cost with zero markup. No seat licences,
              no per-feature fees. Response caching means repeat queries are served instantly at no additional cost.
            </p>
            <div className="grid sm:grid-cols-3 gap-5 mt-10">
              {[
                { label: 'Zero Markup', desc: 'API costs are passed directly from the AI provider to you — exactly what they charge.' },
                { label: '40–70% Cache Savings', desc: 'Identical queries within 24 hours are served from cache. Zero API cost, instant response.' },
                { label: 'Full Cost Visibility', desc: 'Real-time month-to-date spend per feature, per user, visible in your admin dashboard.' },
              ].map(({ label, desc }) => (
                <div key={label} className="bg-card border border-border rounded-2xl p-6 text-left">
                  <CheckCircle2 className="w-5 h-5 text-primary mb-3" />
                  <p className="font-bold text-foreground mb-1">{label}</p>
                  <p className="text-sm text-muted-foreground leading-relaxed">{desc}</p>
                </div>
              ))}
            </div>
            <div className="pt-4">
              <Link href="/start">
                <Button size="lg" className="mt-2">Get a Pricing Estimate</Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-24 px-4 sm:px-6 lg:px-8 bg-primary text-primary-foreground text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-4xl font-extrabold mb-4">Experience DeployGuard AI today</h2>
            <p className="text-primary-foreground/85 text-lg mb-10 max-w-xl mx-auto leading-relaxed">
              Ready to see how the Roster Optimizer and Billing Auditor can transform your operations? Let&apos;s run a demo with your own data.
            </p>
            <div className="flex justify-center gap-4">
              <Link href="/start">
                <Button variant="secondary" size="lg">Book a Demo</Button>
              </Link>
              <a href="mailto:hello@deployguard.io">
                <Button size="lg" className="bg-primary-foreground/10 text-primary-foreground border border-primary-foreground/20 hover:bg-primary-foreground/20">
                  Email Us
                </Button>
              </a>
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </>
  )
}
