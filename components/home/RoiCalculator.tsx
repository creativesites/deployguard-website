'use client'

import { useState } from 'react'
import { DollarSign, Shield, Clock, TrendingUp, ArrowRight, CheckCircle2 } from 'lucide-react'
import Button from '@/components/ui/Button'
import Link from 'next/link'

export function RoiCalculator() {
  const [guardCount, setGuardCount] = useState<number>(250)
  const [currency, setCurrency] = useState<'USD' | 'NAD' | 'ZMW'>('USD')
  const [leakageRate, setLeakageRate] = useState<number>(4) // 4% leakage average

  // Currency symbols & multipliers
  const symbol = currency === 'USD' ? '$' : currency === 'NAD' ? 'N$' : 'ZMW '
  const rateMultiplier = currency === 'USD' ? 1 : currency === 'NAD' ? 18 : 27

  // Calculations
  const monthlyGuardHours = guardCount * 12 * 26
  const monthlyPayroll = monthlyGuardHours * (2.5 * rateMultiplier)
  const annualPayroll = monthlyPayroll * 12

  const annualLeakageSaved = Math.round(annualPayroll * (leakageRate / 100) * 0.85)
  const monthlyHoursSaved = Math.round((guardCount / 10) * 12)

  return (
    <section className="py-20 bg-gradient-to-b from-secondary to-slate-950 text-white relative overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <span className="inline-flex items-center gap-1.5 bg-primary/20 border border-primary/30 text-primary-light text-xs font-semibold px-3 py-1.5 rounded-full mb-4">
            <TrendingUp className="w-3.5 h-3.5" /> Interactive Business Case
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-4">
            Calculate Your Revenue Leakage & DeployGuard ROI
          </h2>
          <p className="text-white/70 text-lg">
            See how much money ghost shifts, unbilled overtime, and manual roster errors are costing your security firm every year.
          </p>
        </div>

        <div className="grid lg:grid-cols-12 gap-8 items-center bg-white/5 border border-white/10 rounded-3xl p-6 sm:p-10 backdrop-blur-xl shadow-2xl">
          {/* Controls Column */}
          <div className="lg:col-span-6 space-y-8">
            {/* Currency Selector */}
            <div>
              <label className="block text-xs font-semibold text-white/60 uppercase tracking-wider mb-2">
                Operating Currency
              </label>
              <div className="grid grid-cols-3 gap-2 bg-black/30 p-1.5 rounded-xl border border-white/10">
                {(['USD', 'NAD', 'ZMW'] as const).map((curr) => (
                  <button
                    key={curr}
                    type="button"
                    onClick={() => setCurrency(curr)}
                    className={`py-2 px-3 rounded-lg text-sm font-bold transition-all ${
                      currency === curr
                        ? 'bg-primary text-secondary shadow-md'
                        : 'text-white/60 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    {curr === 'USD' ? 'USD ($)' : curr === 'NAD' ? 'Namibia (N$)' : 'Zambia (ZMW)'}
                  </button>
                ))}
              </div>
            </div>

            {/* Guard Count Slider */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-sm font-semibold text-white/90">
                  Active Guard Headcount
                </label>
                <span className="text-2xl font-extrabold text-primary">
                  {guardCount.toLocaleString()} Guards
                </span>
              </div>
              <input
                type="range"
                min={50}
                max={2500}
                step={25}
                value={guardCount}
                onChange={(e) => setGuardCount(Number(e.target.value))}
                className="w-full h-3 bg-white/10 rounded-lg appearance-none cursor-pointer accent-primary"
              />
              <div className="flex justify-between text-xs text-white/40 mt-1">
                <span>50 Guards</span>
                <span>1,000 Guards</span>
                <span>2,500+ Guards</span>
              </div>
            </div>

            {/* Leakage Estimate Slider */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-sm font-semibold text-white/90">
                  Estimated Ghost Shifts & Roster Leakage Rate
                </label>
                <span className="text-lg font-bold text-amber-400">
                  {leakageRate}% Leakage
                </span>
              </div>
              <input
                type="range"
                min={1}
                max={8}
                step={0.5}
                value={leakageRate}
                onChange={(e) => setLeakageRate(Number(e.target.value))}
                className="w-full h-2.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-amber-400"
              />
              <p className="text-xs text-white/50 mt-1">
                *Industry average for paper/Excel-managed security operations is 3.5% – 6.0%.
              </p>
            </div>

            {/* Included Protections */}
            <div className="space-y-2 pt-2 border-t border-white/10">
              <div className="flex items-center gap-2 text-xs text-white/80">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>100% Elimination of Ghost Guard Sign-Ins</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-white/80">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Automated Statutory Split (Normal, Night, Sunday, Public Holiday)</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-white/80">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Zero Dispute Invoices Attached to Verifiable Site Service Logs</span>
              </div>
            </div>
          </div>

          {/* Results Column */}
          <div className="lg:col-span-6 bg-gradient-to-br from-slate-900 to-black p-8 rounded-2xl border border-primary/30 flex flex-col justify-between space-y-6 shadow-glow">
            <div>
              <span className="text-xs uppercase tracking-widest text-primary font-bold">
                Projected Annual Impact
              </span>

              <div className="mt-4 mb-6">
                <div className="text-xs text-white/60 mb-1">Estimated Annual Money Recovered</div>
                <div className="text-4xl sm:text-5xl font-black text-white tracking-tight">
                  {symbol}{annualLeakageSaved.toLocaleString()}
                  <span className="text-base font-normal text-white/50"> / year</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 py-4 border-y border-white/10">
                <div>
                  <div className="flex items-center gap-1.5 text-xs text-white/60 mb-1">
                    <Clock className="w-3.5 h-3.5 text-primary" /> Admin Hours Saved
                  </div>
                  <div className="text-2xl font-bold text-white">
                    {monthlyHoursSaved.toLocaleString()} <span className="text-xs text-white/50">hrs/mo</span>
                  </div>
                </div>
                <div>
                  <div className="flex items-center gap-1.5 text-xs text-white/60 mb-1">
                    <Shield className="w-3.5 h-3.5 text-emerald-400" /> Compliance Risk
                  </div>
                  <div className="text-lg font-bold text-emerald-400">
                    Reduced to Zero
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <Link href="/start" className="block">
                <Button size="lg" className="w-full justify-center gap-2 shadow-glow text-base">
                  Recover Your Revenue — Book Demo <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
              <p className="text-[11px] text-center text-white/40">
                Calculated based on {guardCount} guards working 12-hour shifts @ average regional billing rates.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
