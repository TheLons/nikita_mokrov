const SOCIALS = [
  { label: 'Telegram', href: 'https://t.me/mokrovnv' },
  { label: 'Instagram', href: 'https://www.instagram.com/mokrov_nv' },
];

const STREAMING = [
  { label: 'Spotify', href: 'https://open.spotify.com/artist/2K9GlcaZ7KZNuWqAJuzSd3?si=drGbfmVARkK0pV1_OlbojQ' },
  { label: 'Apple Music', href: 'https://music.apple.com/ru/artist/nikita-mokrov/1673595365' },
  { label: 'Yandex Music', href: 'https://music.yandex.ru/artist/18854286?utm_medium=copy_link&ref_id=0e115e80-ae22-49fa-8e20-8f6268771c5e' },
];

interface LinkColumnProps {
  heading: string;
  links: { label: string; href: string }[];
}

function LinkColumn({ heading, links }: LinkColumnProps) {
  return (
    <div className="flex flex-col gap-5">
      {/* Column heading */}
      <span
        className="text-[#3A3A3A] text-[10px] tracking-[0.2em] uppercase"
        style={{ fontFamily: "'JetBrains Mono', monospace" }}
      >
        {heading}
      </span>

      {/* Links */}
      <ul className="flex flex-col gap-3">
        {links.map(({ label, href }) => (
          <li key={label}>
            <a
              href={href}
              target="_blank"
              rel="nofollow noopener noreferrer"
              className="hs group flex items-center gap-2"
              style={{ textDecoration: 'none' }}
            >
              <span
                className="text-[#AAAAAA] md:group-hover:text-[#F5F5F5] transition-colors duration-200 tracking-[0.02em]"
                style={{
                  fontFamily: "'Space Grotesk', sans-serif",
                  fontSize: 'clamp(13px, 1.3vw, 15px)',
                  fontWeight: 300,
                }}
              >
                {label}
              </span>
              <span
                className="text-[#4A4A4A] md:group-hover:text-[#AAAAAA] transition-colors duration-200 text-[13px]"
              >
                ↗
              </span>
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function ContactSection() {
  return (
    <>
      {/* ── Contact Section ── */}
      <section id="contact" className="border-t border-[#1E1E1E]"
        style={{
          paddingLeft: 'clamp(24px, 6vw, 80px)',
          paddingRight: 'clamp(24px, 6vw, 80px)',
          paddingTop: 'clamp(64px, 8vw, 128px)',
          paddingBottom: 'clamp(64px, 8vw, 128px)',
        }}
      >
        <div className="flex flex-col lg:flex-row gap-20 lg:gap-0 justify-between">

          {/* ── Left: CTA + email ── */}
          <div className="flex flex-col justify-between lg:w-1/2">
            <div>
              {/* Section label */}
              <div className="flex items-center gap-4 mb-10">
                <div className="w-6 h-px bg-[#3A3A3A]" />
                <span
                  className="text-[#6B6B6B] text-[11px] tracking-[0.18em] uppercase"
                  style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                >
                  Get in Touch
                </span>
              </div>

              {/* Massive heading */}
              <h2
                className="hs-block text-[#F5F5F5] font-bold leading-[0.9] tracking-[-0.04em]"
                style={{
                  fontSize: 'clamp(56px, 9vw, 120px)',
                  fontFamily: "'Space Grotesk', sans-serif",
                }}
              >
                LET&apos;S<br />WORK
              </h2>
            </div>

            {/* Email + location */}
            <div className="mt-14 flex flex-col gap-2">
              <a
                href="mailto:nikita@mokrov.com"
                className="hs group flex items-center gap-2 w-fit"
                style={{ textDecoration: 'none' }}
              >
                <span
                  className="text-[#AAAAAA] md:group-hover:text-[#F5F5F5] transition-colors duration-200 tracking-[0.04em]"
                  style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: '14px' }}
                >
                  nikita@mokrov.com
                </span>
                <span className="text-[#4A4A4A] md:group-hover:text-[#AAAAAA] transition-colors duration-200 text-[13px]">
                  ↗
                </span>
              </a>
            </div>
          </div>

          {/* ── Right: two link columns ── */}
          <div className="lg:w-5/12 flex flex-row gap-16 sm:gap-24 items-start pt-2">
            <LinkColumn heading="Socials" links={SOCIALS} />
            <LinkColumn heading="Streaming" links={STREAMING} />
          </div>

        </div>
      </section>

      {/* ── Footer bar ── */}
      <footer
        className="border-t border-[#1E1E1E] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
        style={{
          paddingLeft: 'clamp(24px, 6vw, 80px)',
          paddingRight: 'clamp(24px, 6vw, 80px)',
          paddingTop: '28px',
          paddingBottom: '28px',
          background: '#0E0E0E',
        }}
      >
        <span
          className="text-[#2E2E2E] text-[11px] tracking-[0.1em] uppercase"
          style={{ fontFamily: "'JetBrains Mono', monospace" }}
        >
          &copy; {new Date().getFullYear()} Nikita Mokrov
        </span>

        <span
          className="text-[#2E2E2E] text-[11px] tracking-[0.1em] uppercase"
          style={{ fontFamily: "'JetBrains Mono', monospace" }}
        >
          Film &amp; Video Game Composer
        </span>
      </footer>
    </>
  );
}
