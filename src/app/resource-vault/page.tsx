import TabNav from '@/components/TabNav'

export const metadata = {
  title: 'Resource Vault',
  description: 'Bonus workshops and resources. Coming soon.',
}

export default function ResourceVaultPage() {
  return (
    <main>
      {/* Hero */}
      <section className="relative overflow-hidden py-28 px-6">
        <div className="relative max-w-3xl mx-auto text-center">
          <p className="text-xs uppercase tracking-[0.2em] text-[#7C69C7] font-semibold mb-4">
            Masterminds Workshop
          </p>
          <h1 className="gradient-text text-5xl md:text-6xl font-extrabold mb-5 leading-tight pb-1">
            Resource Vault
          </h1>
          <p className="text-lg text-[#FCF4EB]/60 max-w-xl mx-auto leading-relaxed">
            Bonus workshops and resources, all in one place.
          </p>
        </div>
      </section>

      {/* Tab nav */}
      <TabNav />

      {/* Coming soon panel */}
      <section className="max-w-5xl mx-auto px-6 pt-6 pb-24">
        <div className="border border-white/[0.08] rounded-b-2xl rounded-tr-2xl overflow-hidden">
          <div className="flex flex-col items-center justify-center py-24 px-6 text-center">
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center mb-6 text-2xl"
              style={{
                background: 'rgba(124, 105, 199, 0.12)',
                border: '1px solid rgba(124, 105, 199, 0.20)',
              }}
            >
              ◆
            </div>
            <h2 className="text-2xl font-bold text-[#FCF4EB] mb-3">Coming Soon</h2>
            <p className="text-[#FCF4EB]/40 text-sm leading-relaxed max-w-sm">
              Bonus workshops and extra resources will live here. Check back after the next session.
            </p>
          </div>
        </div>
      </section>
    </main>
  )
}
