'use client'

import Image from 'next/image'

interface Participant {
  name: string
  photo: string
  wins: string
  automate: string
  needle: string
}

function Avatar({ photo, name }: { photo: string; name: string }) {
  return (
    <div className="relative flex-shrink-0">
      <div
        className="absolute rounded-full"
        style={{
          inset: '-2px',
          background: 'linear-gradient(135deg, #7C69C7, #F5C3C6)',
          opacity: 0.55,
        }}
      />
      <div
        className="relative w-10 h-10 rounded-full overflow-hidden"
        style={{ border: '1.5px solid rgba(15,15,15,0.9)' }}
      >
        <Image src={photo} alt={name} width={40} height={40} className="w-full h-full object-cover" />
      </div>
    </div>
  )
}

export default function ParticipantCarousel({ participants }: { participants: Participant[] }) {
  return (
    <>
      {/* ─── Desktop table (md+) ─────────────────────────── */}
      <div
        className="hidden md:block rounded-2xl overflow-hidden"
        style={{
          padding: '1px',
          background:
            'linear-gradient(135deg, rgba(124,105,199,0.55) 0%, rgba(157,143,224,0.18) 40%, rgba(245,195,198,0.45) 100%)',
        }}
      >
        <div className="rounded-[15px] overflow-hidden" style={{ background: '#0f0f0f' }}>

          {/* Header */}
          <div
            className="grid grid-cols-[200px_1fr_1fr_1fr]"
            style={{
              background:
                'linear-gradient(90deg, rgba(124,105,199,0.10) 0%, rgba(124,105,199,0.07) 33%, rgba(245,195,198,0.06) 66%, rgba(245,195,198,0.11) 100%)',
            }}
          >
            <div style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }} className="px-5 py-4" />

            <div className="px-5 py-4" style={{ background: 'rgba(124,105,199,0.09)', borderLeft: '1px solid rgba(124,105,199,0.14)', borderBottom: '1px solid rgba(124,105,199,0.18)' }}>
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full flex-shrink-0 bg-[#7C69C7]" />
                <p className="text-[#7C69C7] text-[10px] font-semibold uppercase tracking-widest">Biggest Needle-Mover</p>
              </div>
            </div>

            <div className="px-5 py-4" style={{ background: 'rgba(245,195,198,0.04)', borderLeft: '1px solid rgba(245,195,198,0.09)', borderBottom: '1px solid rgba(245,195,198,0.10)' }}>
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full flex-shrink-0 bg-[#F5C3C6]/65" />
                <p className="text-[#F5C3C6]/75 text-[10px] font-semibold uppercase tracking-widest">Wants to Automate</p>
              </div>
            </div>

            <div className="px-5 py-4" style={{ borderLeft: '1px solid rgba(255,255,255,0.05)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full flex-shrink-0 bg-[#FCF4EB]/40" />
                <p className="text-[#FCF4EB]/55 text-[10px] font-semibold uppercase tracking-widest">Wins</p>
              </div>
            </div>
          </div>

          {/* Rows */}
          {participants.map((p, i) => (
            <div
              key={p.name}
              className="grid grid-cols-[200px_1fr_1fr_1fr] transition-colors duration-200 hover:bg-[#7C69C7]/[0.05] group"
              style={{ borderBottom: i < participants.length - 1 ? '1px solid rgba(255,255,255,0.035)' : 'none' }}
            >
              <div className="px-5 py-5 flex items-center gap-3">
                <Avatar photo={p.photo} name={p.name} />
                <span className="text-[#FCF4EB] font-semibold text-sm leading-snug">{p.name.split(' ')[0]}</span>
              </div>

              <div className="px-5 py-5" style={{ background: 'rgba(124,105,199,0.05)', borderLeft: '1px solid rgba(124,105,199,0.09)' }}>
                <p className="text-[#B8AEDF]/90 text-sm leading-relaxed">{p.needle}</p>
              </div>

              <div className="px-5 py-5" style={{ background: 'rgba(245,195,198,0.025)', borderLeft: '1px solid rgba(245,195,198,0.07)' }}>
                <p className="text-[#FCF4EB]/60 text-sm leading-relaxed">{p.automate}</p>
              </div>

              <div className="px-5 py-5" style={{ borderLeft: '1px solid rgba(255,255,255,0.04)' }}>
                <p className="text-[#FCF4EB]/60 text-sm leading-relaxed">{p.wins}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ─── Mobile cards (< md) ─────────────────────────── */}
      <div className="md:hidden space-y-3">
        {participants.map((p) => (
          <div
            key={p.name}
            className="rounded-2xl overflow-hidden"
            style={{
              padding: '1px',
              background:
                'linear-gradient(135deg, rgba(124,105,199,0.45) 0%, rgba(157,143,224,0.15) 50%, rgba(245,195,198,0.35) 100%)',
            }}
          >
            <div className="rounded-[15px] overflow-hidden" style={{ background: '#0f0f0f' }}>

              {/* Name header */}
              <div
                className="flex items-center gap-3 px-5 py-4"
                style={{
                  background: 'linear-gradient(90deg, rgba(124,105,199,0.10) 0%, transparent 100%)',
                  borderBottom: '1px solid rgba(255,255,255,0.05)',
                }}
              >
                <Avatar photo={p.photo} name={p.name} />
                <span className="text-[#FCF4EB] font-semibold text-sm">{p.name}</span>
              </div>

              {/* Fields */}
              <div className="px-5 py-4 space-y-4">
                <div>
                  <div className="flex items-center gap-1.5 mb-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#FCF4EB]/40" />
                    <p className="text-[#FCF4EB]/45 text-[10px] font-semibold uppercase tracking-widest">Biggest Needle-Mover</p>
                  </div>
                  <p className="text-[#FCF4EB]/65 text-sm leading-relaxed">{p.needle}</p>
                </div>

                <div style={{ borderTop: '1px solid rgba(245,195,198,0.08)' }} className="pt-4">
                  <div className="flex items-center gap-1.5 mb-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#F5C3C6]/65" />
                    <p className="text-[#F5C3C6]/70 text-[10px] font-semibold uppercase tracking-widest">Wants to Automate</p>
                  </div>
                  <p className="text-[#FCF4EB]/65 text-sm leading-relaxed">{p.automate}</p>
                </div>

                <div style={{ borderTop: '1px solid rgba(124,105,199,0.12)' }} className="pt-4">
                  <div className="flex items-center gap-1.5 mb-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#7C69C7]" />
                    <p className="text-[#7C69C7] text-[10px] font-semibold uppercase tracking-widest">Wins</p>
                  </div>
                  <p className="text-[#B8AEDF]/90 text-sm leading-relaxed">{p.wins}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  )
}
