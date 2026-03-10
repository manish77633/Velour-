// ================================================================
// AboutPage.jsx — VELOUR × Manish Kumar | High-Contrast Luxury
// Fully Responsive, Light-Themed Middle & Repeatable Animations
//
// npm install framer-motion   (run once in /frontend)
// ================================================================

import React, { useRef, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

// ── Shared Animation Variants (Repeatable Bottom-to-Up) ───────────
const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 } // Delays each child card by 0.15s
  }
};

const fadeUpItem = {
  hidden: { opacity: 0, y: 50 }, // Slides up from 50px below
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] }
  }
};

// ── Skills Data ───────────────────────────────────────────────
const SKILLS = [
  {
    name: 'React.js', level: 'Advanced', span: 'col-span-1 md:col-span-2',
    desc: 'Building dynamic, component-driven UIs with hooks, context, Redux Toolkit, and smooth Framer Motion animations.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" className="w-8 h-8">
        <circle cx="12" cy="12" r="2.2" /><ellipse cx="12" cy="12" rx="10" ry="3.8" strokeLinecap="round" /><ellipse cx="12" cy="12" rx="10" ry="3.8" strokeLinecap="round" transform="rotate(60 12 12)" /><ellipse cx="12" cy="12" rx="10" ry="3.8" strokeLinecap="round" transform="rotate(120 12 12)" />
      </svg>
    ),
  },
  {
    name: 'Node.js', level: 'Advanced', span: 'col-span-1',
    desc: 'REST APIs & robust middleware.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" className="w-8 h-8"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" strokeLinecap="round" strokeLinejoin="round" /></svg>
    ),
  },
  {
    name: 'MongoDB', level: 'Intermediate', span: 'col-span-1',
    desc: 'Schema design & Atlas clouds.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" className="w-8 h-8"><path d="M12 2C8 2 6 6 6 10c0 5.25 5.5 10.5 6 12 .5-1.5 6-6.75 6-12 0-4-2-8-6-8z" strokeLinecap="round" /><path d="M12 6v12" strokeLinecap="round" /></svg>
    ),
  },
  {
    name: 'Express.js', level: 'Advanced', span: 'col-span-1',
    desc: 'Scalable routing controllers.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" className="w-8 h-8"><rect x="3" y="3" width="18" height="18" rx="3" /><path d="M7 12h10M7 8h6M7 16h8" strokeLinecap="round" /></svg>
    ),
  },
  {
    name: 'Tailwind CSS', level: 'Expert', span: 'col-span-1',
    desc: 'Pixel-perfect, responsive UI.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" className="w-8 h-8"><path d="M6.5 14.5C8 9 11 7 14 8.5c-1.5 5.5-4.5 7.5-7.5 6zM10.5 8.5C12 3 15 1 18 2.5c-1.5 5.5-4.5 7.5-7.5 6z" strokeLinecap="round" strokeLinejoin="round" /></svg>
    ),
  },
  {
    name: 'Redux Toolkit', level: 'Intermediate', span: 'col-span-1 md:col-span-2',
    desc: 'Global state management, async thunks, and persistent cart storage tailored for e-commerce platforms.',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" className="w-8 h-8"><circle cx="12" cy="5" r="2" /><circle cx="5" cy="17" r="2" /><circle cx="19" cy="17" r="2" /><path d="M12 7v4M10.3 15.7L6.7 13M13.7 15.7L17.3 13" strokeLinecap="round" /></svg>
    ),
  },
];

// ── Projects & Links Data ──────────────────────────────────────
const LINKS = [
  { label: 'Portfolio', sub: 'View my work', href: 'https://manish-portfolio-nu-green.vercel.app/', icon: (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" className="w-6 h-6"><rect x="2" y="3" width="20" height="14" rx="2" /><path d="M8 21h8M12 17v4" strokeLinecap="round" /></svg>) },
  { label: 'LinkedIn', sub: 'Let\'s connect', href: 'https://www.linkedin.com/in/manish-kumar-b14b802b0/', icon: (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" className="w-6 h-6"><rect x="2" y="2" width="20" height="20" rx="4" /><path d="M7 10v7M7 7v.01M12 17v-4a2 2 0 014 0v4M12 10v7" strokeLinecap="round" /></svg>) },
  { label: 'GitHub', sub: 'See my code', href: 'https://github.com/manish77633', icon: (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" className="w-6 h-6"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 00-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0020 4.77 5.07 5.07 0 0019.91 1S18.73.65 16 2.48a13.38 13.38 0 00-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 005 4.77a5.44 5.44 0 00-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 009 18.13V22" strokeLinecap="round" strokeLinejoin="round" /></svg>) },
  { label: 'LeetCode', sub: 'Problem solving', href: 'https://leetcode.com/u/manish_7877/', icon: (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" className="w-6 h-6"><path d="M16 17.93l-2.7 2.61c-.46.46-1.11.66-1.82.66s-1.36-.2-1.82-.66L5.22 15.4a1.23 1.23 0 010-1.86l4.47-4.14c.47-.46 1.11-.66 1.82-.66s1.36.2 1.82.66L16 12.07" strokeLinecap="round" /><path d="M13.23 6.56L19 12l-5.77 5.44" strokeLinecap="round" /></svg>) },
];

const PROJECTS = [
  { name: 'VELOUR', tagline: 'Premium Fashion E-Commerce', status: 'Live', desc: 'Full-stack MERN platform with Razorpay payments, Google OAuth, admin panel, real-time inventory and a luxury UI/UX that earned 4.9★ customer ratings.', tags: ['React', 'Node.js', 'MongoDB', 'Razorpay', 'Redux', 'Tailwind'], href: 'https://github.com/manish77633/Velour' },
  { name: 'WANDERLUST', tagline: 'Travel Discovery Platform', status: 'Completed', desc: 'A curated travel platform for exploring destinations, building itineraries, and sharing experiences with a community of passionate travellers.', tags: ['React', 'Express', 'MongoDB', 'Maps API'], href: 'https://wanderlust-k2io.onrender.com/listings' },
  { name: 'ZERODHA CLONE', tagline: 'Trading Platform Dashboard', status: 'Completed', desc: 'A modern replica of the Zerodha trading dashboard, featuring interactive UI components, seamless navigation, and a clean user experience.', tags: ['React', 'Node.js', 'Tailwind CSS', 'MongoDB'], href: 'https://zerodha-375eo5zg1-manishs-projects-e32ba696.vercel.app/' },
  { name: 'ARIHANT MARBLES', tagline: 'Premium Business Catalog', status: 'Live', desc: 'A professional business website showcasing high-quality marble and stone collections with a highly responsive and elegant design.', tags: ['React', 'Tailwind CSS', 'Framer Motion'], href: 'https://arihantmarblehouse.com/' }
];

export default function AboutPage() {
  // Parallax reference for Hero Background only (No fade out)
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const bgY = useTransform(scrollYProgress, [0, 1], ['0%', '25%']);

  const [isEmailCopied, setIsEmailCopied] = useState(false);

  const handleEmailClick = () => {
    navigator.clipboard.writeText('manishkumar20047877@gmail.com');
    setIsEmailCopied(true);
    const subject = encodeURIComponent("Hello Manish - Let's Connect");
    const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=manishkumar20047877@gmail.com&su=${subject}`;
    window.open(gmailUrl, '_blank');
    setTimeout(() => setIsEmailCopied(false), 3000);
  };

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#FAF7F2]">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=DM+Sans:wght@200;300;400;500&display=swap');
        ::selection { background: rgba(139,111,92,0.15); color: #1C1917; }
        body { font-family: 'DM Sans', sans-serif; }
      `}</style>

      {/* ══════════════════════════════════════════════
          HERO — Deep Dark (Steady, No Fade)
      ══════════════════════════════════════════════ */}
      <section ref={heroRef} className="relative min-h-screen flex items-center pt-24 pb-16 overflow-hidden"
        style={{ background: 'radial-gradient(circle at 70% 30%, #F5F0EA 0%, #FAF7F2 100%)' }}>

        {/* Parallax Background */}
        <motion.div style={{ y: bgY }} className="absolute inset-0 pointer-events-none">
          <svg className="absolute inset-0 w-full h-full opacity-[0.03]" xmlns="http://www.w3.org/2000/svg">
            <defs><pattern id="g-light" width="56" height="56" patternUnits="userSpaceOnUse"><path d="M 56 0 L 0 0 0 56" fill="none" stroke="#1C1917" strokeWidth="0.6" /></pattern></defs>
            <rect width="100%" height="100%" fill="url(#g-light)" />
          </svg>
          <div className="absolute top-1/4 right-1/4 w-[300px] h-[300px] md:w-[500px] md:h-[500px] rounded-full pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(139,111,92,0.06) 0%, transparent 65%)' }} />
        </motion.div>

        <div className="relative z-10 max-w-screen-xl mx-auto px-4 md:px-6 w-full">
          <motion.div
            initial="hidden" animate="visible" variants={staggerContainer}
            className="flex flex-col lg:flex-row gap-12 lg:gap-16 items-center justify-between"
          >
            {/* Text Content */}
            <div className="order-2 lg:order-1 text-center lg:text-left flex-1 w-full flex flex-col items-center lg:items-start">
              <motion.div variants={fadeUpItem}>
                <p className="flex items-center justify-center lg:justify-start gap-3 mb-5 text-[10px] md:text-xs tracking-[0.4em] uppercase font-bold" style={{ color: '#8B6F5C' }}>
                  <span className="w-6 md:w-8 h-px" style={{ background: '#8B6F5C' }} /> Full-Stack Developer
                </p>
              </motion.div>

              <motion.h1 variants={fadeUpItem} className="text-5xl sm:text-6xl md:text-8xl font-light leading-[1] mb-6 w-full" style={{ color: '#1C1917', fontFamily: 'Cormorant Garamond, serif' }}>
                The Architect<br /><em className="italic" style={{ color: '#8B6F5C' }}>Behind Velour</em>
              </motion.h1>

              <motion.p variants={fadeUpItem} className="text-sm md:text-lg mb-10 leading-relaxed max-w-lg mx-auto lg:mx-0" style={{ color: '#6A5848', fontWeight: 300 }}>
                Crafting digital experiences where logic meets luxury. Responsive, elegant, and performance-driven.
              </motion.p>

              <motion.div variants={fadeUpItem} className="flex flex-wrap justify-center lg:justify-start gap-4 mb-10">
                {[{ label: 'BCA Student', sub: 'Active Pursuit' }, { label: 'MERN Stack', sub: 'Modern Web' }, { label: '4+ Projects', sub: 'Live Experiences' }].map(({ label, sub }) => (
                  <div key={label} className="px-6 py-4 rounded-xl shadow-sm transition-transform hover:-translate-y-1" style={{ background: '#FFFFFF', border: '1px solid rgba(139,111,92,0.1)' }}>
                    <p style={{ color: '#1C1917', fontSize: '13px', fontWeight: 500 }}>{label}</p>
                    <p style={{ color: '#8B6F5C', fontSize: '10px', letterSpacing: '0.1em', uppercase: true }}>{sub}</p>
                  </div>
                ))}
              </motion.div>

              <motion.div variants={fadeUpItem}>
                <a href="https://manish-portfolio-nu-green.vercel.app/" target="_blank" rel="noreferrer"
                  className="inline-flex items-center gap-2 px-10 py-5 rounded-sm text-xs tracking-[0.3em] uppercase font-bold transition-all duration-300 hover:scale-105"
                  style={{ background: '#1C1917', color: '#FAF7F2', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}>
                  View Portfolio →
                </a>
              </motion.div>
            </div>

            {/* Photo */}
            <motion.div variants={fadeUpItem} className="order-1 lg:order-2 flex justify-center lg:justify-end w-full lg:w-auto">
              <div className="relative group">
                <div className="absolute -inset-6 rounded-full blur-[80px] opacity-10 group-hover:opacity-20 transition-opacity duration-500" style={{ background: 'radial-gradient(circle, #8B6F5C 0%, transparent 70%)' }} />

                <div className="relative w-64 h-80 sm:w-80 sm:h-96 md:w-[400px] md:h-[500px] rounded-sm overflow-hidden" style={{ border: '1px solid rgba(139,111,92,0.15)', boxShadow: '0 30px 60px rgba(139,111,92,0.08)' }}>
                  <img src="/your-photo.jpg" alt="Manish Kumar" className="w-full h-full object-cover transition-transform duration-[2s] group-hover:scale-110" onError={(e) => { e.target.style.display = 'none'; }} />
                  <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center" style={{ background: 'linear-gradient(135deg, #FAF7F2, #FAF7F2)' }}>
                    <div className="w-24 h-24 md:w-32 md:h-32 rounded-full mb-8 flex items-center justify-center border-[0.5px] border-[#8B6F5C]/30 shadow-inner">
                      <span style={{ color: '#8B6F5C', fontFamily: 'Cormorant Garamond, serif', fontSize: '32px', fontWeight: 300 }}>MK</span>
                    </div>
                    <p style={{ color: '#8B6F5C', fontSize: '10px', letterSpacing: '0.4em' }} className="uppercase font-bold">Showcasing Excellence</p>
                  </div>
                </div>

                <motion.div animate={{ y: [0, -10, 0] }} transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                  className="absolute -bottom-6 -right-4 px-6 py-4 rounded-xl shadow-2xl skew-x-[-10deg]"
                  style={{ background: '#1C1917', border: '1px solid rgba(255,255,255,0.1)' }}>
                  <p style={{ color: '#C4A882', fontSize: '11px', letterSpacing: '0.2em', fontWeight: 700 }} className="uppercase">MERN Master</p>
                </motion.div>
              </div>
            </motion.div>

          </motion.div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════
          STORY — Soft Cream (Repeatable Reveal)
      ══════════════════════════════════════════════ */}
      <motion.section
        initial="hidden" whileInView="visible" viewport={{ once: false, amount: 0.2 }} variants={staggerContainer}
        className="py-24 md:py-32 relative" style={{ background: '#FAF7F2' }}
      >
        <div className="max-w-screen-xl mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">

            <motion.div variants={fadeUpItem} className="lg:sticky lg:top-28">
              <p className="text-[10px] md:text-xs tracking-[0.28em] uppercase mb-4" style={{ color: '#8B6F5C' }}>01 — My Story</p>
              <h2 className="text-4xl md:text-5xl font-light leading-tight mb-6" style={{ color: '#1C1917', fontFamily: 'Cormorant Garamond, serif' }}>
                Driven by craft,<br /><em className="italic" style={{ color: '#8B6F5C' }}>defined by detail.</em>
              </h2>
              <div className="w-10 h-px" style={{ background: '#8B6F5C' }} />
              <div className="mt-8 space-y-4">
                {[{ icon: '🎓', label: 'BCA — 4th Semester' }, { icon: '📍', label: 'India' }, { icon: '⚡', label: 'MERN Stack Developer' }].map(({ icon, label }) => (
                  <div key={label} className="flex items-center gap-3">
                    <span className="text-base">{icon}</span>
                    <p className="text-sm" style={{ color: '#6A5848', fontWeight: 400 }}>{label}</p>
                  </div>
                ))}
              </div>
            </motion.div>

            <div className="space-y-6">
              {[
                "I'm Manish Kumar — a BCA student in my 4th semester and a passionate full-stack developer who believes that great software should feel as refined as it performs. I've spent the last two years immersed in the MERN ecosystem.",
                "VELOUR — this very platform — is the product of that philosophy. What started as a project evolved into a fully-featured luxury e-commerce engine: real Razorpay payment flows, complete admin panel, and a UI that stands out.",
                "I believe the gap between a good developer and a great one lies in taste. In knowing when to reach for a complex solution and when simplicity wins."
              ].map((para, i) => (
                <motion.p key={i} variants={fadeUpItem} style={{ color: '#4A3B32', lineHeight: '1.9', fontSize: '15px', fontWeight: 300 }}>
                  {para}
                </motion.p>
              ))}
            </div>

          </div>
        </div>
      </motion.section>

      {/* ══════════════════════════════════════════════
          SKILLS BENTO GRID — ✨ NEW: Pure White Theme ✨
      ══════════════════════════════════════════════ */}
      <motion.section
        initial="hidden" whileInView="visible" viewport={{ once: false, amount: 0.2 }} variants={staggerContainer}
        className="py-24 md:py-32 relative" style={{ background: '#FFFFFF' }}
      >
        <div className="max-w-screen-xl mx-auto px-4 md:px-6">
          <motion.div variants={fadeUpItem} className="text-center md:text-left">
            <p className="text-[10px] md:text-xs tracking-[0.28em] uppercase mb-3" style={{ color: '#8B6F5C' }}>02 — Expertise</p>
            <h2 className="text-4xl md:text-5xl font-light mb-12 md:mb-16" style={{ color: '#1C1917', fontFamily: 'Cormorant Garamond, serif' }}>Skills & Stack</h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {SKILLS.map((skill, i) => (
              <motion.div key={skill.name} variants={fadeUpItem} className={skill.span}>
                <motion.div whileHover={{ y: -5, boxShadow: '0 12px 30px rgba(0,0,0,0.06)' }}
                  className="h-full rounded-2xl p-6 md:p-8 relative overflow-hidden group flex flex-col justify-between transition-all duration-300"
                  style={{ background: '#F9F8F6', border: '1px solid rgba(139,111,92,0.15)', minHeight: '148px' }}>

                  <div className="absolute top-0 right-0 w-24 h-24 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" style={{ background: 'radial-gradient(circle at top right, rgba(139,111,92,0.08), transparent)' }} />
                  <div className="absolute top-0 left-6 right-6 h-px opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{ background: 'linear-gradient(to right, transparent, #8B6F5C, transparent)' }} />

                  <div>
                    <div className="mb-4" style={{ color: '#8B6F5C' }}>{skill.icon}</div>
                    <p className="text-xl md:text-2xl font-medium mb-1" style={{ color: '#1C1917', fontFamily: 'Cormorant Garamond, serif' }}>{skill.name}</p>
                    <p className="text-[9px] md:text-[10px] tracking-[0.15em] uppercase mb-3 font-bold" style={{ color: '#8B6F5C' }}>{skill.level}</p>
                  </div>

                  {skill.span.includes('md:col-span-2') && (
                    <p className="text-xs leading-relaxed mt-2" style={{ color: '#6A5848', fontWeight: 400 }}>{skill.desc}</p>
                  )}
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* ══════════════════════════════════════════════
          PROJECTS — Warm Off-White (Repeatable Reveal)
      ══════════════════════════════════════════════ */}
      <motion.section
        initial="hidden" whileInView="visible" viewport={{ once: false, amount: 0.2 }} variants={staggerContainer}
        className="py-24 md:py-32" style={{ background: '#EDE8DF' }}
      >
        <div className="max-w-screen-xl mx-auto px-4 md:px-6">
          <motion.div variants={fadeUpItem} className="text-center md:text-left">
            <p className="text-[10px] md:text-xs tracking-[0.28em] uppercase mb-3" style={{ color: '#8B6F5C' }}>03 — Work</p>
            <h2 className="text-4xl md:text-5xl font-light mb-12 md:mb-16" style={{ color: '#1C1917', fontFamily: 'Cormorant Garamond, serif' }}>Key Projects</h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
            {PROJECTS.map((proj, i) => (
              <motion.div key={proj.name} variants={fadeUpItem}>
                <motion.a href={proj.href} target="_blank" rel="noreferrer" whileHover={{ y: -6 }}
                  className="block rounded-2xl p-6 md:p-8 group relative overflow-hidden transition-all duration-300"
                  style={{ background: '#FFFFFF', border: '1px solid rgba(139,111,92,0.15)', boxShadow: '0 4px 20px rgba(0,0,0,0.04)', textDecoration: 'none' }}>

                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-[9px] md:text-[10px] px-3 py-1 rounded-full font-bold tracking-wider" style={{ background: proj.status === 'Live' ? '#E8F3EC' : '#F5F0EA', color: proj.status === 'Live' ? '#4A7C59' : '#8B6F5C' }}>
                      {proj.status === 'Live' ? '● Live' : '◌ In Progress'}
                    </span>
                  </div>
                  <p className="text-[10px] tracking-[0.18em] uppercase mb-1.5 font-bold" style={{ color: '#A3968A' }}>{proj.tagline}</p>
                  <h3 className="text-2xl md:text-3xl font-medium mb-4" style={{ color: '#1C1917', fontFamily: 'Cormorant Garamond, serif' }}>{proj.name}</h3>
                  <p className="text-sm leading-relaxed mb-6" style={{ color: '#6A5848', fontWeight: 400 }}>{proj.desc}</p>

                  <div className="flex flex-wrap gap-2">
                    {proj.tags.map((tag) => <span key={tag} className="text-[9px] md:text-[10px] px-3 py-1 rounded-full font-medium" style={{ background: '#F9F7F4', border: '1px solid #E4DDD3', color: '#8A7060' }}>{tag}</span>)}
                  </div>
                </motion.a>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* ══════════════════════════════════════════════
          CONNECT & FOOTER — Deep Dark Luxury
      ══════════════════════════════════════════════ */}
      <motion.section
        initial="hidden" whileInView="visible" viewport={{ once: false, amount: 0.2 }} variants={staggerContainer}
        className="py-24 md:py-32 relative overflow-hidden" style={{ background: '#FAF7F2' }}
      >
        <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(circle at 50% 100%, #EDE8DF 0%, transparent 70%)' }} />

        <div className="max-w-screen-xl mx-auto px-4 md:px-6 relative z-10">
          <motion.div variants={fadeUpItem} className="text-center mb-12 md:mb-16">
            <p className="text-[10px] md:text-xs tracking-[0.4em] uppercase mb-4 font-bold" style={{ color: '#8B6F5C' }}>Get in Touch</p>
            <h2 className="text-5xl md:text-7xl font-light mb-4" style={{ color: '#1C1917', fontFamily: 'Cormorant Garamond, serif' }}>
              Let's Build Something<br /><em className="italic" style={{ color: '#8B6F5C' }}>Remarkable Together</em>
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-16">
            {LINKS.map((link, i) => (
              <motion.div key={link.label} variants={fadeUpItem}>
                <motion.a href={link.href} target="_blank" rel="noreferrer" whileHover={{ y: -5, borderColor: '#8B6F5C', backgroundColor: '#FFFFFF' }}
                  className="flex flex-col items-center text-center gap-3 p-8 rounded-2xl group transition-all duration-300 shadow-sm"
                  style={{ background: '#FDFCFB', border: '1px solid rgba(139,111,92,0.1)', textDecoration: 'none' }}>
                  <div className="transition-transform group-hover:rotate-12 duration-300" style={{ color: '#8B6F5C' }}>{link.icon}</div>
                  <div>
                    <p className="text-sm font-bold tracking-wide" style={{ color: '#1C1917' }}>{link.label}</p>
                    <p className="text-[10px] mt-1.5 uppercase tracking-[0.2em] font-medium" style={{ color: '#8B6F5C' }}>{link.sub}</p>
                  </div>
                </motion.a>
              </motion.div>
            ))}
          </div>

          <motion.div variants={fadeUpItem} className="text-center flex flex-col items-center justify-center">

            {/* Animated Email Button */}
            <motion.button
              onClick={handleEmailClick}
              whileHover={{ scale: 1.05, backgroundColor: '#1C1917', color: '#FAF7F2' }}
              whileTap={{ scale: 0.95 }}
              className="group relative overflow-hidden inline-flex items-center justify-center gap-3 px-10 py-5 md:px-14 md:py-6 rounded-full text-[10px] tracking-[0.4em] uppercase font-bold transition-all duration-500 cursor-pointer border-none shadow-xl"
              style={{ background: '#8B6F5C', color: '#FAF7F2' }}
            >
              <motion.span
                animate={{ x: ['-100%', '200%'] }}
                transition={{ repeat: Infinity, duration: 3, ease: "linear" }}
                className="absolute inset-0 w-[150%] h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 pointer-events-none"
              />

              <span className="relative z-10 flex items-center gap-3">
                {isEmailCopied ? "Opening Mailbox" : "Start a Conversation"}
                {!isEmailCopied ? (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1">
                    <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                ) : (
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="w-5 h-5">
                    <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </span>
            </motion.button>

            {isEmailCopied && (
              <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-[10px] tracking-[0.3em] uppercase mt-6 font-bold" style={{ color: '#8B6F5C' }}>
                Copied! Directing to Webmail...
              </motion.p>
            )}

          </motion.div>
        </div>
      </motion.section>

      {/* Footer strip */}
      <div className="py-10 px-4 md:px-6 text-center" style={{ background: '#FFFFFF', borderTop: '1px solid rgba(139,111,92,0.1)' }}>
        <p style={{ color: '#8B6F5C', fontSize: '10px', letterSpacing: '0.4em', fontWeight: 'bold' }}>CURATED WITH PRECISION BY <span style={{ color: '#1C1917' }}>MANISH KUMAR</span> · VELOUR © 2026</p>
      </div>
    </div>
  );
}