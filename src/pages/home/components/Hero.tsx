export default function Hero() {
  return (
    <section
      id="hero"
      className="relative min-h-screen flex flex-col justify-center overflow-hidden"
      style={{ paddingLeft: 'clamp(40px, 7vw, 120px)', paddingRight: 'clamp(40px, 7vw, 120px)', paddingTop: '80px' }}
    >
      {/* Pure #121212 background — no photo */}

      {/* ── Top-right metadata ── */}
      <div className="absolute top-24 right-10 md:right-20 flex flex-col items-end gap-1" style={{ zIndex: 1 }}>
        <span className="text-[#4A4A4A] text-[11px] tracking-[0.12em] uppercase" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
          Nha Trang, Vietnam
        </span>
        <span className="text-[#4A4A4A] text-[11px] tracking-[0.12em] uppercase" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
          Available Worldwide
        </span>
      </div>

      {/* ── Main content — left-aligned ── */}
      <div className="relative flex flex-col" style={{ zIndex: 1 }}>
        {/* Label */}
        <div className="flex items-center gap-4 mb-10">
          <div className="w-6 h-px bg-[#3A3A3A]" />
          <span
            className="text-[#6B6B6B] text-[11px] tracking-[0.18em] uppercase"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            Composer &amp; Sound Designer
          </span>
        </div>

        {/* Name */}
        <h1
          className="text-[#F5F5F5] font-bold leading-[0.9] tracking-[-3px] mb-10"
          style={{ fontSize: 'clamp(72px, 11vw, 148px)', fontFamily: "'Space Grotesk', sans-serif" }}
        >
          NIKITA<br />MOKROV
        </h1>

        {/* Role line */}
        <div className="flex flex-col gap-3 mt-2">
          <p
            className="text-[#AAAAAA] uppercase tracking-[0.14em]"
            style={{ fontSize: '14px', fontFamily: "'Space Grotesk', sans-serif" }}
          >
            Film &amp; Game Composer
          </p>
          <p
            className="text-[#5A5A5A] tracking-[0.06em]"
            style={{ fontSize: '13px', fontFamily: "'Space Grotesk', sans-serif" }}
          >
            Sound Design&nbsp;&nbsp;/&nbsp;&nbsp;Composition&nbsp;&nbsp;/&nbsp;&nbsp;Scoring
          </p>
        </div>

        {/* Year badge */}
        <div className="mt-16 flex items-center gap-6">
          <span className="text-[#3A3A3A] text-[11px] tracking-[0.14em] uppercase" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
            Est. 2015
          </span>
          <div className="w-16 h-px bg-[#2A2A2A]" />
          <span className="text-[#3A3A3A] text-[11px] tracking-[0.14em] uppercase" style={{ fontFamily: "'JetBrains Mono', monospace" }}>
            50+ Projects
          </span>
        </div>
      </div>

      {/* ── Scroll indicator ── */}
      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3" style={{ zIndex: 1 }}>
        <span
          className="text-[#3A3A3A] text-[10px] tracking-[0.2em] uppercase"
          style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)', fontFamily: "'JetBrains Mono', monospace" }}
        >
          SCROLL
        </span>
        <div className="w-px h-10 bg-[#2A2A2A]" />
      </div>

      {/* ── Bottom border ── */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-[#1E1E1E]" style={{ zIndex: 1 }} />
    </section>
  );
}
