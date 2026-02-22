  // ================================================================
  // AboutPage.jsx — VELOUR × Manish Kumar | Warm Mid-Tone Luxury
  //
  // npm install framer-motion   (run once in /frontend)
  // ================================================================

  import React, { useRef, useState } from 'react';
  import { motion, useScroll, useTransform, useInView } from 'framer-motion';

  // ── Premium Scroll Reveal ──────────────────────────────────────
  function Reveal({ children, className = '', delay = 0, direction = 'up' }) {
    const ref = useRef(null);
    const inView = useInView(ref, { once: true, margin: '-80px' });
    const variants = {
      hidden: {
        opacity: 0,
        y: direction === 'up' ? 40 : direction === 'down' ? -40 : 0,
        x: direction === 'left' ? -40 : direction === 'right' ? 40 : 0,
        scale: 0.98,
        filter: 'blur(4px)'
      },
      visible: {
        opacity: 1, 
        y: 0, 
        x: 0,
        scale: 1,
        filter: 'blur(0px)',
        transition: { duration: 1.2, delay, ease: [0.16, 1, 0.3, 1] }, 
      },
    };
    return (
      <motion.div ref={ref} variants={variants} initial="hidden" animate={inView ? 'visible' : 'hidden'} className={className}>
        {children}
      </motion.div>
    );
  }

  // ── Skills Data ───────────────────────────────────────────────
  const SKILLS = [
    {
      name: 'React.js', level: 'Advanced', span: 'col-span-2 md:col-span-2',
      desc: 'Building dynamic, component-driven UIs with hooks, context, Redux Toolkit, and smooth Framer Motion animations.',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" className="w-8 h-8">
          <circle cx="12" cy="12" r="2.2"/><ellipse cx="12" cy="12" rx="10" ry="3.8" strokeLinecap="round"/><ellipse cx="12" cy="12" rx="10" ry="3.8" strokeLinecap="round" transform="rotate(60 12 12)"/><ellipse cx="12" cy="12" rx="10" ry="3.8" strokeLinecap="round" transform="rotate(120 12 12)"/>
        </svg>
      ),
    },
    {
      name: 'Node.js', level: 'Advanced', span: 'col-span-1',
      desc: 'REST APIs & robust middleware.',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" className="w-8 h-8"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" strokeLinecap="round" strokeLinejoin="round"/></svg>
      ),
    },
    {
      name: 'MongoDB', level: 'Intermediate', span: 'col-span-1',
      desc: 'Schema design & Atlas clouds.',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" className="w-8 h-8"><path d="M12 2C8 2 6 6 6 10c0 5.25 5.5 10.5 6 12 .5-1.5 6-6.75 6-12 0-4-2-8-6-8z" strokeLinecap="round"/><path d="M12 6v12" strokeLinecap="round"/></svg>
      ),
    },
    {
      name: 'Express.js', level: 'Advanced', span: 'col-span-1',
      desc: 'Scalable routing controllers.',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" className="w-8 h-8"><rect x="3" y="3" width="18" height="18" rx="3"/><path d="M7 12h10M7 8h6M7 16h8" strokeLinecap="round"/></svg>
      ),
    },
    {
      name: 'Tailwind CSS', level: 'Expert', span: 'col-span-1',
      desc: 'Pixel-perfect, responsive UI.',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" className="w-8 h-8"><path d="M6.5 14.5C8 9 11 7 14 8.5c-1.5 5.5-4.5 7.5-7.5 6zM10.5 8.5C12 3 15 1 18 2.5c-1.5 5.5-4.5 7.5-7.5 6z" strokeLinecap="round" strokeLinejoin="round"/></svg>
      ),
    },
    {
      name: 'Redux Toolkit', level: 'Intermediate', span: 'col-span-2 md:col-span-2',
      desc: 'Global state management, async thunks, and persistent cart storage tailored for e-commerce platforms.',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" className="w-8 h-8"><circle cx="12" cy="5" r="2"/><circle cx="5" cy="17" r="2"/><circle cx="19" cy="17" r="2"/><path d="M12 7v4M10.3 15.7L6.7 13M13.7 15.7L17.3 13" strokeLinecap="round"/></svg>
      ),
    },
  ];

  // ── Projects & Links Data ──────────────────────────────────────
  const LINKS = [
    { label: 'Portfolio', sub: 'View my work', href: 'https://manish-portfolio-nu-green.vercel.app/', icon: (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" className="w-6 h-6"><rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4" strokeLinecap="round"/></svg>) },
    { label: 'LinkedIn', sub: 'Let\'s connect', href: 'https://www.linkedin.com/in/manish-kumar-b14b802b0/', icon: (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" className="w-6 h-6"><rect x="2" y="2" width="20" height="20" rx="4"/><path d="M7 10v7M7 7v.01M12 17v-4a2 2 0 014 0v4M12 10v7" strokeLinecap="round"/></svg>) },
    { label: 'GitHub', sub: 'See my code', href: 'https://github.com/manish77633', icon: (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" className="w-6 h-6"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 00-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0020 4.77 5.07 5.07 0 0019.91 1S18.73.65 16 2.48a13.38 13.38 0 00-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 005 4.77a5.44 5.44 0 00-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 009 18.13V22" strokeLinecap="round" strokeLinejoin="round"/></svg>) },
    { label: 'LeetCode', sub: 'Problem solving', href: 'https://leetcode.com/u/manish_7877/', icon: (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" className="w-6 h-6"><path d="M16 17.93l-2.7 2.61c-.46.46-1.11.66-1.82.66s-1.36-.2-1.82-.66L5.22 15.4a1.23 1.23 0 010-1.86l4.47-4.14c.47-.46 1.11-.66 1.82-.66s1.36.2 1.82.66L16 12.07" strokeLinecap="round"/><path d="M13.23 6.56L19 12l-5.77 5.44" strokeLinecap="round"/></svg>) },
  ];

  const PROJECTS = [
    { name: 'VELOUR', tagline: 'Premium Fashion E-Commerce', status: 'Live', desc: 'Full-stack MERN platform with Razorpay payments, Google OAuth, admin panel, real-time inventory and a luxury UI/UX that earned 4.9★ customer ratings.', tags: ['React', 'Node.js', 'MongoDB', 'Razorpay', 'Redux', 'Tailwind'], href: 'https://github.com/manish77633/Velour' },
    { name: 'WANDERLUST', tagline: 'Travel Discovery Platform', status: 'Completed', desc: 'A curated travel platform for exploring destinations, building itineraries, and sharing experiences with a community of passionate travellers.', tags: ['React', 'Express', 'MongoDB', 'Maps API'], href: 'https://wanderlust-k2io.onrender.com/listings' },
    { name: 'ZERODHA CLONE', tagline: 'Trading Platform Dashboard', status: 'Completed', desc: 'A modern replica of the Zerodha trading dashboard, featuring interactive UI components, seamless navigation, and a clean user experience.', tags: ['React', 'Node.js', 'Tailwind CSS', 'MongoDB'], href: 'https://zerodha-375eo5zg1-manishs-projects-e32ba696.vercel.app/' },
    { name: 'ARIHANT MARBLES', tagline: 'Premium Business Catalog', status: 'Live', desc: 'A professional business website showcasing high-quality marble and stone collections with a highly responsive and elegant design.', tags: ['React', 'Tailwind CSS', 'Framer Motion'], href: 'https://arihantmarblehouse.com/' }
  ];

  // ── Main Page Component ────────────────────────────────────────
  export default function AboutPage() {
    const heroRef = useRef(null);
    const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
    const bgY = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);
    const textY = useTransform(scrollYProgress, [0, 1], ['0%', '50%']);
    const heroOp = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

    // State for Email Button Copy Effect
    const [isEmailCopied, setIsEmailCopied] = useState(false);

    // Fail-proof Email Click Handler
    const handleEmailClick = () => {
      // 1. Copy to clipboard
      navigator.clipboard.writeText('manishkumar20047877@gmail.com');
      setIsEmailCopied(true);
      
      // 2. Open Gmail directly in browser (works everywhere)
      const subject = encodeURIComponent("Hello Manish - Let's Connect");
      const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=manishkumar20047877@gmail.com&su=${subject}`;
      window.open(gmailUrl, '_blank');

      // 3. Reset UI feedback after 3 seconds
      setTimeout(() => setIsEmailCopied(false), 3000);
    };

    return (
      <div className="min-h-screen overflow-x-hidden selection:bg-[#9C7A58] selection:text-white" style={{ backgroundColor: '#EBE6DF' }}>
        
        {/* Premium Font Injection */}
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400&family=Plus+Jakarta+Sans:wght@200;300;400;500;600&display=swap');
          body { font-family: 'Plus Jakarta Sans', sans-serif; color: #1E1B18; }
        `}</style>

        {/* ══════════════════════════════════════════════
            HERO — Warm Stone & Espresso
        ══════════════════════════════════════════════ */}
        <motion.section ref={heroRef} style={{ opacity: heroOp }} className="relative min-h-screen flex items-center pt-24 pb-12 overflow-hidden bg-gradient-to-b from-[#EBE6DF] to-[#E3DDD3]">
          
          {/* Parallax Background Elements */}
          <motion.div style={{ y: bgY }} className="absolute inset-0 pointer-events-none">
            {/* Subtle Grid */}
            <svg className="absolute inset-0 w-full h-full opacity-[0.25]" xmlns="http://www.w3.org/2000/svg">
              <defs><pattern id="g-warm" width="60" height="60" patternUnits="userSpaceOnUse"><path d="M 60 0 L 0 0 0 60" fill="none" stroke="#A89F91" strokeWidth="0.5"/></pattern></defs>
              <rect width="100%" height="100%" fill="url(#g-warm)"/>
            </svg>
            {/* Soft Mocha Glow */}
            <div className="absolute top-0 right-0 w-[700px] h-[700px] rounded-full pointer-events-none blur-[120px]" style={{ background: 'radial-gradient(circle, rgba(156,122,88,0.12) 0%, transparent 70%)' }}/>
          </motion.div>

          <div className="relative z-10 max-w-screen-xl mx-auto px-6 w-full">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
              
              {/* Text Content */}
              <motion.div style={{ y: textY }} className="order-2 lg:order-1">
                <Reveal delay={0.1}>
                  <p className="flex items-center gap-3 mb-6 text-xs tracking-[0.25em] uppercase font-bold text-[#8A7561]">
                    <span className="w-10 h-px bg-[#8A7561]"/> Full-Stack Developer
                  </p>
                </Reveal>
                <Reveal delay={0.2}>
                  <h1 className="text-5xl md:text-7xl font-light leading-[1.05] mb-6 tracking-tight text-[#1E1B18]" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
                    The Architect<br/>
                    <em className="italic text-[#9C7A58]">Behind Velour</em>
                  </h1>
                </Reveal>
                <Reveal delay={0.3}>
                  <p className="text-lg mb-10 leading-relaxed max-w-md text-[#5C5248] font-light">
                    Crafting premium digital experiences where robust logic seamlessly meets luxury design.
                  </p>
                </Reveal>
                
                <Reveal delay={0.4}>
                  <div className="flex flex-wrap gap-3 mb-12">
                    {[{ label: 'BCA Student', sub: '4th Semester' }, { label: 'MERN Stack', sub: 'Full Stack' }, { label: '4+ Projects', sub: 'Live & Shipped'}].map(({ label, sub }) => (
                      <div key={label} className="px-5 py-3 rounded-full bg-[#F2EEE9]/70 backdrop-blur-md border border-[#D8CFC4] shadow-[0_4px_12px_rgba(44,36,30,0.03)]">
                        <p className="text-[#2C241E] text-xs font-bold tracking-wide">{label}</p>
                        <p className="text-[#8A7561] text-[10px] tracking-wider uppercase mt-0.5">{sub}</p>
                      </div>
                    ))}
                  </div>
                </Reveal>

                <Reveal delay={0.5}>
                  <motion.a href="https://manish-portfolio-nu-green.vercel.app/" target="_blank" rel="noreferrer"
                    whileHover={{ scale: 1.03, backgroundColor: '#1E1B18', color: '#EBE6DF' }}
                    whileTap={{ scale: 0.98 }}
                    className="inline-flex items-center justify-center gap-3 px-8 py-4 rounded-full text-xs tracking-[0.2em] uppercase font-bold transition-colors duration-300 bg-[#2C241E] text-[#F2EEE9] shadow-[0_12px_30px_rgba(44,36,30,0.15)]">
                    View Portfolio
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4"><path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  </motion.a>
                </Reveal>
              </motion.div>

              {/* Photo & Floating Elements */}
              <Reveal direction="left" delay={0.2} className="order-1 lg:order-2 flex justify-center lg:justify-end relative">
                <motion.div 
                  animate={{ y: [-10, 10, -10] }} 
                  transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
                  className="relative z-10"
                >
                  {/* Decorative Frame Blur */}
                  <div className="absolute -inset-4 rounded-[2rem] opacity-60 blur-2xl" style={{ background: 'linear-gradient(135deg, rgba(156,122,88,0.3), rgba(235,230,223,0))' }}/>
                  
                  {/* Image Container */}
                  <div className="relative w-[280px] h-[360px] md:w-[340px] md:h-[440px] rounded-3xl overflow-hidden bg-[#E3DDD3] border border-[#D8CFC4] shadow-[0_30px_60px_rgba(44,36,30,0.12)] group">
                    <img src="/your-photo.jpg" alt="Manish Kumar" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" onError={(e) => { e.target.style.display = 'none'; }}/>
                    
                    {/* Fallback Inner Area (If no image) */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-[#EAE5DD] to-[#DFD8CC]">
                      <div className="w-24 h-24 rounded-full mb-5 flex items-center justify-center bg-[#F2EEE9] border border-[#D8CFC4] shadow-md">
                        <span className="text-[#9C7A58] text-3xl font-serif">MK</span>
                      </div>
                      <p className="text-[#9C7A58] text-[10px] tracking-[0.25em] font-bold">ADD YOUR PHOTO</p>
                    </div>
                  </div>

                  {/* Floating Glassmorphism Badge */}
                  <motion.div 
                    animate={{ y: [0, -8, 0], rotate: [0, 2, 0] }} 
                    transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
                    className="absolute -bottom-6 -left-8 px-6 py-3 rounded-2xl bg-[#F2EEE9]/80 backdrop-blur-xl border border-[#F2EEE9]/50 shadow-[0_15px_35px_rgba(44,36,30,0.08)]"
                  >
                    <p className="text-[#8A7561] text-[10px] tracking-[0.2em] font-extrabold">MERN STACK</p>
                  </motion.div>
                </motion.div>
              </Reveal>

            </div>
          </div>
        </motion.section>

        {/* ══════════════════════════════════════════════
            STORY — Earthy & Sophisticated
        ══════════════════════════════════════════════ */}
        <section className="py-32 relative bg-[#E4DCD0] border-t border-[#D8CFC4]">
          <div className="max-w-screen-xl mx-auto px-6">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-8">
              
              <Reveal direction="right" className="lg:col-span-5 lg:sticky lg:top-32 h-fit">
                <p className="text-xs tracking-[0.25em] uppercase mb-4 text-[#8A7561] font-bold">01 — The Narrative</p>
                <h2 className="text-4xl md:text-5xl font-light leading-tight mb-8 text-[#1E1B18]" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
                  Driven by craft,<br/><em className="italic text-[#9C7A58]">defined by detail.</em>
                </h2>
                <div className="w-16 h-px bg-[#BDB3A6] mb-10"/>
                <div className="space-y-5">
                  {[{ icon: '🎓', label: 'BCA — 4th Semester' }, { icon: '📍', label: 'India' }, { icon: '⚡', label: 'MERN Stack Developer' }].map(({ icon, label }) => (
                    <div key={label} className="flex items-center gap-4 group">
                      <span className="w-10 h-10 rounded-full bg-[#EBE6DF] border border-[#D8CFC4] flex items-center justify-center text-lg shadow-sm transition-transform duration-300 group-hover:scale-110">{icon}</span>
                      <p className="text-sm text-[#4A3F35] font-semibold tracking-wide">{label}</p>
                    </div>
                  ))}
                </div>
              </Reveal>

              <div className="lg:col-span-7 lg:pl-12 space-y-8">
                {[
                  "I'm Manish Kumar — a BCA student in my 4th semester and a passionate full-stack developer who believes that great software should feel as refined as it performs. I've spent the last two years deeply immersed in the MERN ecosystem.",
                  "VELOUR — this very platform — is the product of that philosophy. What started as a project evolved into a fully-featured luxury e-commerce engine: real Razorpay payment flows, complex MongoDB aggregations, and a UI that stands out in a crowded digital space.",
                  "I believe the gap between a good developer and a great one lies in taste. In knowing when to reach for a complex state management solution and when sheer simplicity wins. My code is clean, my designs are intentional, and my focus is always on the end-user experience."
                ].map((para, i) => (
                  <Reveal key={i} delay={i * 0.15}>
                    <p className="text-[#5C5248] leading-[1.8] text-base md:text-lg font-medium">{para}</p>
                  </Reveal>
                ))}
              </div>

            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════
            SKILLS — Warm Oatmeal Cards
        ══════════════════════════════════════════════ */}
        <section className="py-32 relative bg-[#EBE6DF]">
          <div className="max-w-screen-xl mx-auto px-6">
            <Reveal className="text-center mb-20">
              <p className="text-xs tracking-[0.25em] uppercase mb-4 text-[#8A7561] font-bold">02 — Expertise</p>
              <h2 className="text-4xl md:text-5xl font-light text-[#1E1B18]" style={{ fontFamily: 'Cormorant Garamond, serif' }}>Technical Arsenal</h2>
            </Reveal>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {SKILLS.map((skill, i) => (
                <Reveal key={skill.name} delay={i * 0.1} className={skill.span}>
                  <motion.div 
                    whileHover={{ y: -8, scale: 1.02 }}
                    transition={{ duration: 0.4, ease: "easeOut" }}
                    className="h-full rounded-2xl p-8 relative overflow-hidden group bg-[#F2EEE9] border border-[#E3DDD3] shadow-[0_4px_20px_rgba(44,36,30,0.04)] hover:shadow-[0_20px_40px_rgba(44,36,30,0.08)]"
                  >
                    {/* Subtle hover gradient */}
                    <div className="absolute inset-0 bg-gradient-to-br from-[#FAFAF8] to-transparent opacity-0 group-hover:opacity-10 transition-opacity duration-500"/>
                    
                    <div className="relative z-10">
                      <div className="mb-6 text-[#9C7A58] transition-transform duration-500 group-hover:scale-110 origin-left">{skill.icon}</div>
                      <h3 className="text-2xl font-medium mb-2 text-[#1E1B18]" style={{ fontFamily: 'Cormorant Garamond, serif' }}>{skill.name}</h3>
                      <p className="text-[10px] tracking-[0.2em] uppercase mb-4 text-[#8A7561] font-extrabold">{skill.level}</p>
                      <p className="text-sm leading-relaxed text-[#5C5248] font-medium">{skill.desc}</p>
                    </div>
                  </motion.div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════
            PROJECTS — Mid-Tone Gallery
        ══════════════════════════════════════════════ */}
        <section className="py-32 bg-[#E4DCD0] border-y border-[#D8CFC4]">
          <div className="max-w-screen-xl mx-auto px-6">
            <Reveal className="mb-20">
              <p className="text-xs tracking-[0.25em] uppercase mb-4 text-[#8A7561] font-bold">03 — Work</p>
              <h2 className="text-4xl md:text-5xl font-light text-[#1E1B18]" style={{ fontFamily: 'Cormorant Garamond, serif' }}>Selected Projects</h2>
            </Reveal>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {PROJECTS.map((proj, i) => (
                <Reveal key={proj.name} delay={i * 0.15}>
                  <motion.a href={proj.href} target="_blank" rel="noreferrer" 
                    whileHover={{ y: -5 }}
                    className="block rounded-3xl p-10 group relative overflow-hidden bg-[#F2EEE9] border border-[#E3DDD3] shadow-sm hover:shadow-[0_20px_50px_rgba(44,36,30,0.08)] transition-all duration-500 no-underline"
                  >
                    <div className="flex items-center gap-3 mb-6">
                      <span className="text-[10px] px-3 py-1 rounded-full font-bold tracking-widest uppercase" style={{ backgroundColor: proj.status === 'Live' ? '#E1EDE4' : '#E8E1D7', color: proj.status === 'Live' ? '#3B6A48' : '#8A7561' }}>
                        {proj.status === 'Live' ? '● Live' : '◌ Completed'}
                      </span>
                    </div>
                    <p className="text-[11px] tracking-[0.2em] uppercase mb-2 text-[#8A7561] font-bold">{proj.tagline}</p>
                    <h3 className="text-3xl md:text-4xl font-medium mb-5 text-[#1E1B18]" style={{ fontFamily: 'Cormorant Garamond, serif' }}>{proj.name}</h3>
                    <p className="text-[15px] leading-relaxed mb-8 text-[#5C5248] font-medium">{proj.desc}</p>
                    
                    <div className="flex flex-wrap gap-2">
                      {proj.tags.map((tag) => (
                        <span key={tag} className="text-[10px] px-4 py-1.5 rounded-full bg-[#EBE6DF] border border-[#D8CFC4] text-[#4A3F35] font-bold tracking-wide">
                          {tag}
                        </span>
                      ))}
                    </div>

                    {/* Hover Arrow */}
                    <div className="absolute top-10 right-10 opacity-0 transform translate-x-4 -translate-y-4 group-hover:opacity-100 group-hover:translate-x-0 group-hover:translate-y-0 transition-all duration-500 text-[#9C7A58]">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-8 h-8"><path d="M7 17L17 7M17 7H7M17 7V17" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    </div>
                  </motion.a>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════
            CONNECT & FOOTER — Deep Warm Contrast
        ══════════════════════════════════════════════ */}
        <section className="py-32 relative overflow-hidden bg-gradient-to-b from-[#EBE6DF] to-[#DFD8CC]">
          {/* Soft Decorative Circle */}
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-[800px] h-[800px] bg-[#F2EEE9] rounded-full blur-[120px] pointer-events-none opacity-60"/>
          
          <div className="max-w-screen-xl mx-auto px-6 relative z-10">
            <Reveal className="text-center mb-16">
              <h2 className="text-4xl md:text-6xl font-light mb-6 text-[#1E1B18]" style={{ fontFamily: 'Cormorant Garamond, serif' }}>
                Let's Build Something<br/><em className="italic text-[#9C7A58]">Remarkable Together</em>
              </h2>
            </Reveal>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 lg:gap-6 mb-16 max-w-4xl mx-auto">
              {LINKS.map((link, i) => (
                <Reveal key={link.label} delay={i * 0.1}>
                  <motion.a href={link.href} target="_blank" rel="noreferrer" 
                    whileHover={{ y: -5, backgroundColor: '#F2EEE9' }}
                    className="flex flex-col items-center text-center gap-4 p-8 rounded-2xl group bg-[#EBE6DF]/40 backdrop-blur-sm border border-[#D8CFC4] hover:shadow-[0_15px_30px_rgba(44,36,30,0.06)] transition-all duration-300 no-underline"
                  >
                    <div className="text-[#8A7561] group-hover:text-[#9C7A58] transition-colors duration-300">{link.icon}</div>
                    <div>
                      <p className="text-sm font-bold text-[#1E1B18] mb-1">{link.label}</p>
                      <p className="text-[10px] text-[#8A7561] tracking-widest uppercase font-semibold">{link.sub}</p>
                    </div>
                  </motion.a>
                </Reveal>
              ))}
            </div>

            <Reveal className="text-center flex flex-col items-center justify-center">
              
              {/* ✨ 100% WORKING GMAIL BUTTON ✨ */}
              <motion.button 
                onClick={handleEmailClick}
                whileHover="hover"
                whileTap="tap"
                variants={{
                  hover: { scale: 1.04, backgroundColor: '#9C7A58' },
                  tap: { scale: 0.96 }
                }}
                className="group relative overflow-hidden inline-flex items-center justify-center gap-3 px-12 py-5 rounded-full text-xs tracking-[0.2em] uppercase font-bold text-[#F2EEE9] bg-[#2C241E] shadow-[0_10px_30px_rgba(44,36,30,0.2)] hover:shadow-[0_20px_40px_rgba(156,122,88,0.3)] transition-shadow duration-300 cursor-pointer border-none outline-none"
              >
                {/* Animated Hover Shine Effect */}
                <motion.span 
                  variants={{ hover: { x: ['-100%', '200%'] } }}
                  transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
                  className="absolute inset-0 w-[150%] h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 pointer-events-none"
                />
                
                <span className="relative z-10 flex items-center gap-2.5">
                  {isEmailCopied ? "Opening Gmail..." : "Send Me an Email"}
                  
                  {/* Dynamic Icon */}
                  {!isEmailCopied ? (
                    <motion.svg 
                      variants={{ hover: { x: 4, y: -4 } }}
                      viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4"
                    >
                      <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" strokeLinecap="round" strokeLinejoin="round"/>
                    </motion.svg>
                  ) : (
                    <motion.svg 
                      initial={{ scale: 0 }} animate={{ scale: 1 }}
                      viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="w-4 h-4 text-[#F2EEE9]"
                    >
                      <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round"/>
                    </motion.svg>
                  )}
                </span>
              </motion.button>

              {/* Helper text shown after clicking */}
              {isEmailCopied && (
                <motion.p 
                  initial={{ opacity: 0, y: 10 }} 
                  animate={{ opacity: 1, y: 0 }} 
                  className="text-[#8A7561] text-[10px] tracking-widest uppercase mt-4 font-bold"
                >
                  Email Copied! Opening Webmail...
                </motion.p>
              )}

            </Reveal>
          </div>
        </section>

        {/* Footer strip */}
        <div className="py-8 px-6 text-center bg-[#2C241E]">
          <p className="text-[10px] tracking-[0.3em] uppercase text-[#A89F91] font-bold">
            CRAFTED WITH PRECISION BY <span className="text-[#EBE6DF]">MANISH KUMAR</span> · VELOUR © 2026
          </p>
        </div>
      </div>
    );
  }