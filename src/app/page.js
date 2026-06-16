"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { FolderOpen, FileText, Info, X, Mail, Github, Globe } from 'lucide-react';
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
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 200, damping: 20 } }
  };

  return (
    <div style={{ background: '#050505', minHeight: '100vh', width: '100vw', overflow: 'hidden', position: 'relative', color: '#fff', fontFamily: 'sans-serif' }}>
      
      {/* Holographic Grid Background */}
      <div style={{
        position: 'absolute', inset: 0, zIndex: 0,
        backgroundImage: `
          linear-gradient(to right, rgba(59, 130, 246, 0.05) 1px, transparent 1px),
          linear-gradient(to bottom, rgba(59, 130, 246, 0.05) 1px, transparent 1px)
        `,
        backgroundSize: '4rem 4rem',
        maskImage: 'radial-gradient(ellipse at center, black 40%, transparent 80%)',
        WebkitMaskImage: 'radial-gradient(ellipse at center, black 40%, transparent 80%)',
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
        
        {/* Central Content Area */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', maxWidth: '1000px', width: '100%', margin: '0 auto', overflow: 'hidden' }}>
          
          {/* Header */}
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2, duration: 1 }}
            style={{ 
              display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '1rem',
              borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '1rem', marginBottom: '2rem' 
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              {/* Unique Animated Header Graphic */}
              <motion.div 
                animate={{ rotate: 360 }}
                transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
                style={{ width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid rgba(59,130,246,0.5)', borderRadius: '10px', background: 'rgba(59,130,246,0.1)', position: 'relative', flexShrink: 0 }}
              >
                <div style={{ position: 'absolute', width: '18px', height: '18px', background: '#3b82f6', borderRadius: '4px', transform: 'rotate(45deg)' }}></div>
                <div style={{ position: 'absolute', width: '6px', height: '6px', background: '#fff', borderRadius: '50%' }}></div>
              </motion.div>
              <h2 style={{ fontSize: 'clamp(1.5rem, 5vw, 2.5rem)', fontWeight: 300, margin: 0, letterSpacing: '-1px' }}>
                <span style={{ fontWeight: 700 }}>Repository</span>.Book
              </h2>
            </div>
            
            {/* Clickable Info Section */}
            <button 
              onClick={() => setIsAboutModalOpen(true)}
              style={{ display: 'flex', alignItems: 'center', gap: '1rem', background: 'none', border: 'none', cursor: 'pointer', outline: 'none' }}
              className="hover-bright"
            >
              <span style={{ fontSize: 'clamp(0.75rem, 2vw, 0.875rem)', color: '#6b7280', fontStyle: 'italic', transition: 'color 0.2s' }}>By-Mrutunjaya</span>
              <Info size={20} color="#9ca3af" style={{ transition: 'color 0.2s' }} />
            </button>
          </motion.div>

          {/* Flowchart Layout */}
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="show"
            style={{ 
              display: 'flex', flexDirection: 'column', alignItems: 'center', 
              flex: 1, overflowY: 'auto', padding: '1rem 0 4rem 0', width: '100%' 
            }}
            className="custom-scrollbar"
          >
            {loading ? (
              <div className="skeleton" style={{ height: '80px', width: '100%', maxWidth: '400px', background: 'rgba(255,255,255,0.03)', borderRadius: '0.75rem' }}></div>
            ) : categories.length > 0 ? (
              <>
                <motion.div variants={itemVariants} style={{ padding: '0.5rem 1.5rem', border: '2px solid rgba(255,255,255,0.1)', borderRadius: '2rem', color: '#9ca3af', fontFamily: 'monospace', fontSize: '1rem', fontWeight: 600 }}>
                  Repobase
                </motion.div>

                {categories.map((cat, index) => (
                  <div key={cat.path} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', maxWidth: '800px' }}>
                    
                    {/* Integrated Number and Arrow */}
                    <motion.div variants={itemVariants} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                      <div style={{ width: '2px', height: '20px', background: 'rgba(59,130,246,0.6)' }}></div>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '32px', height: '32px', borderRadius: '50%', background: 'rgba(59,130,246,0.1)', border: '2px solid rgba(59,130,246,0.6)', color: '#fff', fontSize: '1rem', fontWeight: 700 }}>
                        {index + 1}
                      </div>
                      <div style={{ width: '2px', height: '20px', background: 'rgba(59,130,246,0.6)', position: 'relative' }}>
                        <div style={{ position: 'absolute', bottom: 0, left: '-4px', width: 0, height: 0, borderLeft: '5px solid transparent', borderRight: '5px solid transparent', borderTop: '6px solid rgba(59,130,246,0.6)' }}></div>
                      </div>
                    </motion.div>

                    {/* Flowchart Node */}
                    <motion.div variants={itemVariants} style={{ width: '100%' }}>
                      <Link href={`/categories/${encodeURIComponent(cat.name)}`} style={{ textDecoration: 'none' }}>
                        <motion.div 
                          whileHover={{ scale: 1.02, backgroundColor: 'rgba(255,255,255,0.08)' }}
                          whileTap={{ scale: 0.98 }}
                          transition={{ duration: 0.2 }}
                          style={{ 
                            display: 'flex', alignItems: 'center', gap: '1.5rem',
                            padding: '1.25rem 1.5rem', background: 'rgba(255,255,255,0.03)', 
                            borderRadius: '1rem', border: '1px solid rgba(255,255,255,0.1)',
                            borderLeft: '4px solid #3b82f6',
                            boxShadow: '0 8px 30px rgba(0,0,0,0.3)',
                            cursor: 'pointer'
                          }}
                        >
                          <div style={{ background: 'rgba(59,130,246,0.1)', padding: '0.75rem', borderRadius: '0.75rem' }}>
                            <FolderOpen size={24} color="#60a5fa" />
                          </div>
                          <div style={{ flex: 1 }}>
                            <h3 style={{ fontSize: '1.125rem', fontWeight: 600, margin: '0 0 0.25rem 0', color: '#fff' }}>{cat.name}</h3>
                            <span style={{ fontSize: '0.75rem', color: '#6b7280', fontFamily: 'monospace' }}>SELECT_PATH //</span>
                          </div>
                        </motion.div>
                      </Link>
                    </motion.div>
                  </div>
                ))}
              </>
            ) : (
              <motion.div variants={itemVariants} style={{ textAlign: 'center', padding: '4rem', color: '#6b7280', border: '1px dashed rgba(255,255,255,0.1)', borderRadius: '1rem', marginTop: '2rem' }}>
                <FileText size={48} style={{ opacity: 0.2, margin: '0 auto 1rem auto' }} />
                <p style={{ fontFamily: 'monospace' }}>No nodes available.</p>
              </motion.div>
            )}
          </motion.div>
        </div>
      </div>

      {/* About Me Modal */}
      <AnimatePresence>
        {isAboutModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{ position: 'fixed', inset: 0, zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem', background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)' }}
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              style={{ background: 'rgba(15,15,15,0.95)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '1.5rem', padding: '2.5rem', width: '100%', maxWidth: '400px', position: 'relative', boxShadow: '0 20px 40px rgba(0,0,0,0.5)' }}
            >
              <button 
                onClick={() => setIsAboutModalOpen(false)}
                style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', background: 'none', border: 'none', color: '#6b7280', cursor: 'pointer' }}
                className="hover-white"
              >
                <X size={24} />
              </button>
              
              <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)', margin: '0 auto 1.5rem auto', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', fontWeight: 800, color: '#fff', boxShadow: '0 0 20px rgba(59,130,246,0.3)' }}>
                  M
                </div>
                <h3 style={{ fontSize: '1.5rem', margin: '0 0 0.5rem 0', color: '#fff' }}>Mrutunjaya Pradhan</h3>
                <p style={{ color: '#9ca3af', margin: 0, fontSize: '0.875rem' }}>Curator of Repository.Book</p>
              </div>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <a href="mailto:pradhanmrutunjaya73@gmail.com" style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem', background: 'rgba(255,255,255,0.03)', borderRadius: '0.75rem', textDecoration: 'none', color: '#e5e7eb', transition: 'background 0.2s' }} className="hover-bg">
                  <Mail size={20} color="#3b82f6" />
                  <span style={{ fontSize: '0.875rem' }}>pradhanmrutunjaya73@gmail.com</span>
                </a>
                <a href="#" style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem', background: 'rgba(255,255,255,0.03)', borderRadius: '0.75rem', textDecoration: 'none', color: '#e5e7eb', transition: 'background 0.2s' }} className="hover-bg">
                  <Github size={20} color="#fff" />
                  <span style={{ fontSize: '0.875rem' }}>github.com/imrutunjaya</span>
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
        .hover-bright:hover svg { color: #fff !important; }
        .hover-white:hover { color: #fff !important; }
        .hover-bg:hover { background: rgba(255,255,255,0.08) !important; }
      `}</style>
    </div>
  );
}
