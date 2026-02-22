// ============================================================
// TestimonialsMarquee.jsx — VELOUR Premium Single Row
//
// npm install framer-motion   (run once in /frontend)
//
// In HomePage.jsx add before VALUE PROPS section:
//   import TestimonialsMarquee from '../components/TestimonialsMarquee';
//   <TestimonialsMarquee />
// ============================================================

import React, { useState, useEffect, useRef } from 'react';
import { motion, useAnimationFrame, useMotionValue } from 'framer-motion';

const TESTIMONIALS = [
  {
    quote: "VELOUR has completely transformed my wardrobe. The attention to detail in every stitch is remarkable. Worth every rupee and more.",
    name: "Rahul Mehta",
    title: "Entrepreneur, Delhi",
    initials: "RM",
  },
  {
    quote: "Finally an Indian brand that truly understands premium fashion. The silk blouse arrived beautifully packaged — the fabric is simply divine.",
    name: "Ananya Krishnan",
    title: "Creative Director",
    initials: "AK",
  },
  {
    quote: "I ordered three pieces and all arrived in 2 days. The packaging alone felt like receiving a luxury gift. Will never shop anywhere else.",
    name: "Kavita Joshi",
    title: "Marketing Executive",
    initials: "KJ",
  },
  {
    quote: "The quality of VELOUR's fabrics is absolutely unmatched. Every piece feels like it was crafted specifically for me. Luxury done right.",
    name: "Priya Sharma",
    title: "Fashion Blogger, Mumbai",
    initials: "PS",
  },
  {
    quote: "The kurta set for my daughter's birthday was absolutely gorgeous. She felt like a princess. VELOUR never, ever disappoints.",
    name: "Sunita Agarwal",
    title: "Business Owner, Jaipur",
    initials: "SA",
  },
  {
    quote: "The wrap dress I ordered received so many compliments at the wedding. The chiffon drapes beautifully and the fit is just perfect.",
    name: "Shalini Verma",
    title: "Journalist",
    initials: "SV",
  },
  {
    quote: "Returns are so effortless with VELOUR. Exchanged a size and the new piece arrived before I even expected it. Top tier service.",
    name: "Vikram Singh",
    title: "Software Engineer",
    initials: "VS",
  },
  {
    quote: "The chinos are incredibly versatile — board meetings to weekend brunches. Premium quality at a price that genuinely makes sense.",
    name: "Arjun Kapoor",
    title: "Product Manager, Bangalore",
    initials: "AK",
  },
];

// ── 5 Star SVG ────────────────────────────────────────────────
const Stars = () => (
  <div className="flex items-center gap-[3px] mb-4">
    {[...Array(5)].map((_, i) => (
      <svg key={i} width="11" height="11" viewBox="0 0 24 24">
        <path
          d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
          fill="#C4A882"
        />
      </svg>
    ))}
  </div>
);

// ── Single Card ───────────────────────────────────────────────
const Card = ({ item, onHoverChange }) => (
  <motion.div
    onMouseEnter={() => onHoverChange(true)}
    onMouseLeave={() => onHoverChange(false)}
    whileHover={{ y: -6, scale: 1.02 }}
    transition={{ type: 'spring', stiffness: 300, damping: 24 }}
    className="relative flex-shrink-0 mx-3 rounded-2xl p-6 cursor-default select-none"
    style={{
      width: '300px',
      background: '#FFFFFF',
      border: '1px solid rgba(196,168,130,0.18)',
      boxShadow: '0 1px 8px rgba(139,111,92,0.06), 0 4px 24px rgba(139,111,92,0.04)',
    }}
  >
    {/* Gold accent top line */}
    <div
      className="absolute top-0 left-10 right-10 h-[1.5px] rounded-full"
      style={{ background: 'linear-gradient(90deg, transparent, #C4A882, transparent)' }}
    />

    <Stars />

    {/* Quote */}
    <p
      className="leading-relaxed mb-6 text-[13.5px]"
      style={{
        color: '#4A3728',
        fontFamily: 'DM Sans, sans-serif',
        fontWeight: 300,
        lineHeight: '1.7',
      }}
    >
      "{item.quote}"
    </p>

    {/* Author */}
    <div className="flex items-center gap-3">
      <div
        className="w-9 h-9 rounded-full flex-shrink-0 flex items-center justify-center text-[11px] font-semibold"
        style={{
          background: 'linear-gradient(135deg, #8B6F5C 0%, #C4A882 100%)',
          color: '#FAF7F2',
        }}
      >
        {item.initials}
      </div>
      <div>
        <p
          className="text-[13px] font-medium leading-tight"
          style={{ color: '#8B6F5C', fontFamily: 'DM Sans, sans-serif' }}
        >
          {item.name}
        </p>
        <p
          className="text-[11px] mt-0.5"
          style={{ color: '#B8A090', fontFamily: 'DM Sans, sans-serif' }}
        >
          {item.title}
        </p>
      </div>
    </div>
  </motion.div>
);

// ── Marquee ───────────────────────────────────────────────────
const SPEED = 35;

function Marquee({ items, paused }) {
  const x         = useMotionValue(0);
  const CARD_W    = 324; // card width + margin
  const totalW    = items.length * CARD_W;

  useAnimationFrame((_, delta) => {
    if (paused) return;
    let next = x.get() - (SPEED * delta) / 1000;
    if (next <= -totalW) next += totalW;
    x.set(next);
  });

  return (
    <div className="overflow-hidden">
      <motion.div className="flex" style={{ x }}>
        {[...items, ...items].map((item, i) => (
          <Card key={i} item={item} onHoverChange={() => {}} />
        ))}
      </motion.div>
    </div>
  );
}

// ── Main Component ────────────────────────────────────────────
export default function TestimonialsMarquee() {
  const [paused, setPaused] = useState(false);

  return (
    <section
      className="relative py-20 overflow-hidden"
      style={{ background: '#FAF7F2' }}
    >
      {/* Very subtle grain texture overlay */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.018]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          backgroundRepeat: 'repeat',
          backgroundSize: '180px',
        }}
      />

      {/* Section Label */}
      <div className="relative z-10 text-center mb-12 px-4">
        {/* Eyebrow */}
        <div className="flex items-center justify-center gap-3 mb-3">
          <div className="w-8 h-px" style={{ background: '#C4A882' }} />
          <p
            className="text-[10px] tracking-[0.35em] uppercase font-medium"
            style={{ color: '#C4A882', fontFamily: 'DM Sans, sans-serif' }}
          >
            Customer Stories
          </p>
          <div className="w-8 h-px" style={{ background: '#C4A882' }} />
        </div>

        {/* Heading */}
        <h2
          className="text-4xl md:text-5xl font-light"
          style={{
            color: '#1C1917',
            fontFamily: 'Cormorant Garamond, serif',
            letterSpacing: '-0.01em',
          }}
        >
          Voices of{' '}
          <em className="italic" style={{ color: '#8B6F5C' }}>
            VELOUR
          </em>
        </h2>

        {/* Thin gold rule */}
        <div
          className="w-10 h-px mx-auto mt-5"
          style={{ background: 'linear-gradient(90deg, transparent, #C4A882, transparent)' }}
        />
      </div>

      {/* Scrolling Row */}
      <div
        className="relative"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        <Marquee items={TESTIMONIALS} paused={paused} />

        {/* Left fade */}
        <div
          className="absolute inset-y-0 left-0 w-24 md:w-48 pointer-events-none z-10"
          style={{ background: 'linear-gradient(to right, #FAF7F2 0%, transparent 100%)' }}
        />
        {/* Right fade */}
        <div
          className="absolute inset-y-0 right-0 w-24 md:w-48 pointer-events-none z-10"
          style={{ background: 'linear-gradient(to left, #FAF7F2 0%, transparent 100%)' }}
        />
      </div>

      {/* Bottom stats row */}
     
    </section>
  );
}