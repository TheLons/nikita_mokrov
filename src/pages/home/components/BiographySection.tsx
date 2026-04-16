import { useEffect, useRef, useState } from 'react';

const PORTRAIT_URL =
  'https://storage.readdy-site.link/project_files/ea44c586-0de2-4dbc-a80a-9e9aa3be1b28/f65fbdb2-5b3b-4fe7-bde3-7548bf22c2f0_tSDbSMeaakmRpmAz-_7YFyEFFUSQ89Y8WYTiE63i9AvE-rbQBiSWo-7wnecoquUqce0airjc.jpg?v=61ef4ff68d3a4598be95e6355402051e';

export default function BiographySection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.1 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="about"
      className="relative overflow-hidden border-t border-[#1E1E1E]"
      style={{
        backgroundColor: '#121212',
        paddingTop: 'clamp(80px, 10vw, 140px)',
        paddingBottom: 'clamp(80px, 10vw, 140px)',
      }}
    >
      {/* ── Portrait ghost background — DESKTOP only ── */}
      <div
        className="absolute inset-0 pointer-events-none select-none hidden lg:block"
        style={{
          zIndex: 0,
          backgroundImage: `url(${PORTRAIT_URL})`,
          backgroundSize: 'contain',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center center',
          backgroundColor: '#121212',
          opacity: 0.18,
          filter: 'grayscale(100%)',
        }}
      />

      {/* ── Portrait ghost background — MOBILE ── */}
      <div
        className="absolute inset-0 pointer-events-none select-none lg:hidden"
        style={{ zIndex: 0 }}
      >
        <img
          src={PORTRAIT_URL}
          alt=""
          aria-hidden="true"
          className="w-full h-full object-cover object-top"
          style={{ opacity: 0.17, filter: 'grayscale(100%)' }}
        />
        <div
          className="absolute inset-0"
          style={{ background: 'radial-gradient(ellipse at center, rgba(18,18,18,0.3) 0%, rgba(18,18,18,0.65) 100%)' }}
        />
      </div>

      {/* ── Content — centered ── */}
      <div
        className="relative flex flex-col items-center text-center w-full"
        style={{
          zIndex: 1,
          paddingLeft: 'clamp(40px, 7vw, 120px)',
          paddingRight: 'clamp(40px, 7vw, 120px)',
        }}
      >
        {/* Section label */}
        <div
          className="flex items-center gap-4 mb-10"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? 'translateY(0)' : 'translateY(14px)',
            transition: 'opacity 0.7s ease, transform 0.7s ease',
          }}
        >
          <div className="w-6 h-px bg-[#3A3A3A]" />
          <span
            className="text-[#5A5A5A] text-[10px] tracking-[0.22em] uppercase"
            style={{ fontFamily: "'JetBrains Mono', monospace" }}
          >
            Biography
          </span>
          <div className="w-6 h-px bg-[#3A3A3A]" />
        </div>

        {/* Heading */}
        <div
          className="mb-10"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? 'translateY(0)' : 'translateY(18px)',
            transition: 'opacity 0.7s ease 0.1s, transform 0.7s ease 0.1s',
          }}
        >
          <h2
            className="hs-block text-[#F5F5F5] font-bold leading-[0.92] tracking-[-0.03em]"
            style={{
              fontSize: 'clamp(32px, 4.5vw, 56px)',
              fontFamily: "'Space Grotesk', sans-serif",
            }}
          >
            ОБ АВТОРЕ
          </h2>
        </div>

        {/* Thin divider */}
        <div
          className="mb-12"
          style={{
            width: '32px',
            height: '1px',
            background: '#2A2A2A',
            opacity: visible ? 1 : 0,
            transition: 'opacity 0.6s ease 0.18s',
          }}
        />

        {/* Bio paragraphs */}
        <div
          className="flex flex-col gap-7"
          style={{
            maxWidth: '680px',
            opacity: visible ? 1 : 0,
            transform: visible ? 'translateY(0)' : 'translateY(22px)',
            transition: 'opacity 0.8s ease 0.22s, transform 0.8s ease 0.22s',
          }}
        >
          <p
            className="leading-[1.85]"
            style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: 'clamp(14px, 1.4vw, 16px)',
              color: '#AAAAAA',
              fontWeight: 300,
              letterSpacing: '0.015em',
            }}
          >
            Никита Мокров — композитор и саунд-продюсер. Учился в Moscow Film School (МШК). С 2020 года пишет музыку и создает аудио-нарратив для проектов Gaijin Entertainment.
          </p>
          <p
            className="leading-[1.85]"
            style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: 'clamp(14px, 1.4vw, 16px)',
              color: '#999999',
              fontWeight: 300,
              letterSpacing: '0.015em',
            }}
          >
            Дискография охватывает ключевые тайтлы студии: от крупных альбомов (War Thunder: Ground & Air Forces Vol. 2, War Thunder Mobile Vol. 1) до саундтрека к демоверсии хардкорного шутера Active Matter.
          </p>
          <p
            className="leading-[1.85]"
            style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: 'clamp(14px, 1.4vw, 16px)',
              color: '#999999',
              fontWeight: 300,
              letterSpacing: '0.015em',
            }}
          >
            Отдельный блок работы — музыка для десятков внутриигровых ивентов War Thunder (Tail Spin, Treasure Hunt и др.) и Enlisted (Battle for the Moon, Battle of Tunisia и др.), а также синематиков и трейлеров. Самый заметный кейс в промо — соавторство масштабного кавера Wish Me Luck («Группа крови») для трейлера War Thunder.
          </p>
          <p
            className="leading-[1.85]"
            style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: 'clamp(14px, 1.4vw, 16px)',
              color: '#999999',
              fontWeight: 300,
              letterSpacing: '0.015em',
            }}
          >
            Главная задача звука — передавать смыслы, которые визуал и текст оставляют за кадром. Отсюда упор на плотный гибридный скоринг и нарративную полифонию. В таком подходе каждый инструмент или элемент саунд-дизайна ведет свою независимую партию, а затем эти голоса сплетаются в один сюжет. Никакого стерильного академизма, только многослойная фактура и густая, осязаемая атмосфера для максимального погружения в проект.
          </p>
        </div>
      </div>
    </section>
  );
}
