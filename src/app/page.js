"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { FolderOpen, FileText, Info, X, Mail } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Home() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isAboutModalOpen, setIsAboutModalOpen] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useEffect(() => {
    async function fetchCategories() {
      try {
        const res = await fetch('/api/categories');
        const data = await res.json();
        if (res.ok) setCategories(data.categories || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchCategories();
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.95 },
    show: { opacity: 1, y: 0, scale: 1, transition: { type: 'spring', stiffness: 200, damping: 20 } }
  };

  return (
    <div style={{ background: '#050505', minHeight: '100vh', width: '100vw', overflow: 'hidden', position: 'relative', color: '#fff', fontFamily: 'sans-serif' }}>
      
      {/* Google Fonts for Handwritten Signature */}
      <style>
        @import url('https://fonts.googleapis.com/css2?family=WindSong:wght@500&display=swap');
      </style>

      {/* Holographic Grid Background */}
      <div style={{
        position: 'absolute', inset: 0, zIndex: 0,
        backgroundImage: `
          linear-gradient(to right, rgba(59, 130, 246, 0.05) 1px, transparent 1px),
          linear-gradient(to bottom, rgba(59, 130, 246, 0.05) 1px, transparent 1px)
        `,
        backgroundSize: '4rem 4rem',
        maskImage: 'radial-gradient(ellipse at center, black 30%, transparent 80%)',
        WebkitMaskImage: 'radial-gradient(ellipse at center, black 30%, transparent 80%)',
      }}></div>
      
      {/* Interactive Mouse Tracker */}
      <div style={{
        position: 'absolute',
        top: 0, left: 0,
        transform: `translate(${mousePos.x - 300}px, ${mousePos.y - 300}px)`,
        width: '600px', height: '600px',
        background: 'radial-gradient(circle, rgba(59,130,246,0.12) 0%, transparent 60%)',
        borderRadius: '50%',
        pointerEvents: 'none',
        zIndex: 1,
        transition: 'transform 0.1s ease-out'
      }}></div>

      {/* Main Dashboard Layout */}
      <div style={{ position: 'relative', zIndex: 10, display: 'flex', flexDirection: 'column', height: '100vh', padding: 'clamp(1rem, 3vw, 2rem)' }}>
        
        {/* Full-width Central Content Area */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', maxWidth: '1800px', width: '100%', margin: '0 auto', overflow: 'hidden' }}>
          
          {/* Header */}
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2, duration: 1 }}
            style={{ 
              display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '1rem',
              borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '1rem', marginBottom: '2rem' 
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
              
              {/* Complex Animated SVG Graphic */}
              <div style={{ position: 'relative', width: '50px', height: '50px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <motion.svg width="50" height="50" viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                  style={{ position: 'absolute' }}
                >
                  <circle cx="25" cy="25" r="23" stroke="url(#paint0_linear)" strokeWidth="2" strokeDasharray="10 10" />
                  <defs>
                    <linearGradient id="paint0_linear" x1="0" y1="0" x2="50" y2="50" gradientUnits="userSpaceOnUse">
                      <stop stopColor="#3b82f6" />
                      <stop offset="1" stopColor="transparent" />
                    </linearGradient>
                  </defs>
                </motion.svg>
                
                <motion.svg width="34" height="34" viewBox="0 0 34 34" fill="none" xmlns="http://www.w3.org/2000/svg"
                  animate={{ rotate: -360 }}
                  transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
                  style={{ position: 'absolute' }}
                >
                  <rect x="2" y="2" width="30" height="30" stroke="#60a5fa" strokeWidth="2" rx="4" />
                </motion.svg>
                
                <motion.div 
                  animate={{ scale: [1, 1.2, 1], opacity: [0.7, 1, 0.7] }}
                  transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                  style={{ width: '12px', height: '12px', background: '#3b82f6', borderRadius: '50%', boxShadow: '0 0 15px #3b82f6' }}
                />
              </div>

              <h2 style={{ fontSize: 'clamp(1.5rem, 5vw, 2.5rem)', fontWeight: 300, margin: 0, letterSpacing: '-1px' }}>
                <span style={{ fontWeight: 700 }}>Repository</span>.Book
              </h2>
            </div>
            
            {/* Clickable Info Section */}
            <button 
              onClick={() => setIsAboutModalOpen(true)}
              style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', background: 'none', border: 'none', cursor: 'pointer', outline: 'none' }}
              className="hover-bright"
            >
              <span style={{ fontSize: 'clamp(1.5rem, 4vw, 2.25rem)', color: '#9ca3af', fontFamily: '"WindSong", cursive', transition: 'color 0.2s', paddingRight: '0.5rem' }}>
                By-Mrutunjaya
              </span>
              <Info size={24} color="#3b82f6" style={{ transition: 'all 0.2s', opacity: 0.8 }} />
            </button>
          </motion.div>

          {/* Flowchart Layout (Full Width Branching) */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '1rem 1rem 4rem 1rem' }} className="custom-scrollbar">
            {loading ? (
              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <div className="skeleton" style={{ height: '80px', width: '300px', background: 'rgba(255,255,255,0.03)', borderRadius: '0.75rem' }}></div>
              </div>
            ) : categories.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
                
                {/* Repobase Head Node */}
                <motion.div 
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', zIndex: 10 }}
                >
                  <div style={{ 
                    padding: '1rem 3rem', background: 'rgba(59,130,246,0.1)', border: '2px solid rgba(59,130,246,0.5)', 
                    borderRadius: '3rem', color: '#fff', fontFamily: 'monospace', fontSize: '1.5rem', fontWeight: 700,
                    boxShadow: '0 0 40px rgba(59,130,246,0.2)', backdropFilter: 'blur(10px)'
                  }}>
                    Repobase
                  </div>
                  {/* Stem going down */}
                  <div style={{ width: '3px', height: '40px', background: 'linear-gradient(to bottom, rgba(59,130,246,0.6), rgba(59,130,246,0.2))' }}></div>
                </motion.div>

                {/* Branches & Grid of Categories */}
                <motion.div 
                  variants={containerVariants}
                  initial="hidden"
                  animate="show"
                  style={{ 
                    display: 'grid', 
                    gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', 
                    gap: '2.5rem', 
                    width: '100%', 
                    paddingTop: '1rem',
                    position: 'relative'
                  }}
                >
                  {/* Decorative horizontal top bracket (pseudo-element style) */}
                  <div style={{ position: 'absolute', top: 0, left: '10%', right: '10%', height: '3px', background: 'linear-gradient(to right, transparent, rgba(59,130,246,0.3) 20%, rgba(59,130,246,0.3) 80%, transparent)', zIndex: 0 }}></div>

                  {categories.map((cat, index) => (
                    <motion.div variants={itemVariants} key={cat.path} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative', zIndex: 5 }}>
                      
                      {/* Connection Line from Bracket */}
                      <div style={{ width: '2px', height: '20px', background: 'rgba(59,130,246,0.3)', marginBottom: '0.5rem' }}></div>
                      
                      <Link href={`/categories/${encodeURIComponent(cat.name)}`} style={{ textDecoration: 'none', width: '100%' }}>
                        <motion.div 
                          whileHover={{ scale: 1.03, backgroundColor: 'rgba(255,255,255,0.06)' }}
                          whileTap={{ scale: 0.98 }}
                          style={{ 
                            display: 'flex', alignItems: 'center', gap: '1.25rem',
                            padding: '1.5rem', background: 'rgba(255,255,255,0.02)', 
                            borderRadius: '1rem', border: '1px solid rgba(255,255,255,0.08)',
                            borderTop: '3px solid #3b82f6',
                            boxShadow: '0 10px 40px rgba(0,0,0,0.4)',
                            cursor: 'pointer', position: 'relative', overflow: 'hidden'
                          }}
                        >
                          {/* Inner glowing numbered badge */}
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '36px', height: '36px', borderRadius: '50%', background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.4)', color: '#60a5fa', fontSize: '1rem', fontWeight: 700, flexShrink: 0 }}>
                            {index + 1}
                          </div>

                          <div style={{ flex: 1 }}>
                            <h3 style={{ fontSize: '1.25rem', fontWeight: 600, margin: '0 0 0.35rem 0', color: '#fff' }}>{cat.name}</h3>
                            <span style={{ fontSize: '0.8rem', color: '#6b7280', fontFamily: 'monospace' }}>ACCESS_NODE //</span>
                          </div>

                          <div style={{ opacity: 0.5 }}>
                            <FolderOpen size={28} color="#60a5fa" />
                          </div>
                        </motion.div>
                      </Link>
                    </motion.div>
                  ))}
                </motion.div>
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '4rem', color: '#6b7280', border: '1px dashed rgba(255,255,255,0.1)', borderRadius: '1rem', marginTop: '2rem' }}>
                <FileText size={48} style={{ opacity: 0.2, margin: '0 auto 1rem auto' }} />
                <p style={{ fontFamily: 'monospace' }}>No nodes available.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* About Me Modal */}
      <AnimatePresence>
        {isAboutModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{ position: 'fixed', inset: 0, zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem', background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(10px)' }}
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              style={{ background: 'rgba(10,10,10,0.95)', border: '1px solid rgba(59,130,246,0.3)', borderRadius: '1.5rem', padding: '3rem', width: '100%', maxWidth: '450px', position: 'relative', boxShadow: '0 20px 60px rgba(59,130,246,0.15)' }}
            >
              <button 
                onClick={() => setIsAboutModalOpen(false)}
                style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', background: 'rgba(255,255,255,0.05)', border: 'none', color: '#9ca3af', cursor: 'pointer', padding: '0.5rem', borderRadius: '50%' }}
                className="hover-white hover-bg"
              >
                <X size={20} />
              </button>
              
              <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
                <div style={{ width: '90px', height: '90px', borderRadius: '50%', background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)', margin: '0 auto 1.5rem auto', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.5rem', fontWeight: 800, color: '#fff', boxShadow: '0 0 30px rgba(59,130,246,0.4)', border: '3px solid rgba(255,255,255,0.1)' }}>
                  M
                </div>
                <h3 style={{ fontSize: '2.5rem', margin: '0 0 0.5rem 0', color: '#fff', fontFamily: '"WindSong", cursive', letterSpacing: '2px', fontWeight: 500 }}>Mrutunjaya Pradhan</h3>
                <p style={{ color: '#9ca3af', margin: 0, fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '2px' }}>Curator</p>
              </div>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <a href="mailto:pradhanmrutunjaya73@gmail.com" style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1.25rem', background: 'rgba(59,130,246,0.05)', border: '1px solid rgba(59,130,246,0.2)', borderRadius: '1rem', textDecoration: 'none', color: '#e5e7eb', transition: 'all 0.2s' }} className="hover-primary-border">
                  <Mail size={22} color="#60a5fa" />
                  <span style={{ fontSize: '0.9rem', fontWeight: 500 }}>pradhanmrutunjaya73@gmail.com</span>
                </a>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        body { margin: 0; background: #050505; }
        .skeleton { animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite; }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: .3; }
        }
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(255,255,255,0.2); }
        .hover-bright:hover span { color: #fff !important; }
        .hover-bright:hover svg { color: #60a5fa !important; transform: scale(1.1); }
        .hover-white:hover { color: #fff !important; }
        .hover-bg:hover { background: rgba(255,255,255,0.1) !important; }
        .hover-primary-border:hover { border-color: rgba(59,130,246,0.5) !important; background: rgba(59,130,246,0.1) !important; }
      `}</style>
    </div>
  );
}
