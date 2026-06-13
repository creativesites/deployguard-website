'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { getAllTenants, getAllLicenses, Tenant, License } from '@/lib/db'
import Badge from '@/components/ui/Badge'
import Button from '@/components/ui/Button'
import { Plus, ExternalLink } from 'lucide-react'

export default function TenantsPage() {
  const [tenants,    setTenants]    = useState<Tenant[]>([])
  const [licenseMap, setLicenseMap] = useState<Map<string, License>>(new Map())
  const [loading,    setLoading]    = useState(true)

  useEffect(() => {
    async function load() {
      const [ts, ls] = await Promise.all([getAllTenants(), getAllLicenses()])
      setTenants(ts)
      const map = new Map<string, License>()
      ls.forEach((l) => map.set(l.tenant_id, l))
      setLicenseMap(map)
      setLoading(false)
    }
    load()
  }, [])

  function badgeColor(status: License['status'] | undefined) {
    const m: Record<string, 'green' | 'yellow' | 'red' | 'gray'> = {
      active: 'green', preview: 'yellow', expired: 'red', suspended: 'red',
    }
    return m[status ?? ''] ?? 'gray'
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900">Tenants</h1>
          <p className="text-sm text-gray-400 mt-0.5">{tenants.length} licensed company{tenants.length !== 1 ? 's' : ''}</p>
        </div>
        <Link href="/admin/licenses/new">
          <Button size="sm" className="gap-1.5"><Plus className="w-4 h-4" /> Issue License</Button>
        </Link>
      </div>

      <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-50 bg-gray-50/50">
              {['Company', 'Subdomain', 'License', 'Status', 'Guards', ''].map((h) => (
                <th key={h} className="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-widest">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {tenants.length === 0 && (
              <tr><td colSpan={6} className="px-5 py-10 text-center text-sm text-gray-400">No tenants yet.</td></tr>
            )}
            {tenants.map((t) => {
              const lic = licenseMap.get(t.id)
              return (
                <tr key={t.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                  <td className="px-5 py-4 font-semibold text-gray-800">{t.name}</td>
                  <td className="px-5 py-4">
                    <code className="text-xs bg-gray-100 px-2 py-0.5 rounded text-gray-600">{t.subdomain}</code>
                  </td>
                  <td className="px-5 py-4 text-gray-700 capitalize">
                    {lic ? (lic.type === 'dogforce_special' ? 'DogForce Special' : (lic.tier ?? 'Normal')) : '—'}
                  </td>
                  <td className="px-5 py-4">
                    {lic ? <Badge color={badgeColor(lic.status)}>{lic.status}</Badge> : '—'}
                  </td>
                  <td className="px-5 py-4 text-gray-700">
                    {lic ? (lic.guard_limit === 0 ? '∞' : lic.guard_limit) : '—'}
                  </td>
                  <td className="px-5 py-4">
                    <a
                      href={`https://${t.subdomain}.deployguard.io`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-amber-600 hover:text-amber-700 transition-colors"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
