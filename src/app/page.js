"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { FolderOpen, FileText, Info } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Home() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

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
              <img src="/logo.png" alt="" style={{ width: '36px', height: '36px', objectFit: 'contain' }} />
              <h2 style={{ fontSize: 'clamp(1.5rem, 5vw, 2.5rem)', fontWeight: 300, margin: 0, letterSpacing: '-1px' }}>
                <span style={{ fontWeight: 700 }}>Repository</span>.Book
              </h2>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <span style={{ fontSize: 'clamp(0.75rem, 2vw, 0.875rem)', color: '#6b7280', fontStyle: 'italic' }}>By-Mrutunjaya</span>
              <Info size={20} color="#9ca3af" />
            </div>
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
                <motion.div variants={itemVariants} style={{ padding: '0.5rem 1.5rem', border: '2px solid rgba(255,255,255,0.1)', borderRadius: '2rem', color: '#9ca3af', fontFamily: 'monospace', fontSize: '0.875rem' }}>
                  START_PROCESS
                </motion.div>

                {categories.map((cat, index) => (
                  <div key={cat.path} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', maxWidth: '450px' }}>
                    
                    {/* SVG Flowchart Arrow */}
                    <motion.div variants={itemVariants} style={{ height: '50px', display: 'flex', justifyContent: 'center' }}>
                      <svg width="24" height="50" viewBox="0 0 24 50" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 0V48M12 48L6 42M12 48L18 42" stroke="rgba(59,130,246,0.6)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </motion.div>

                    {/* Flowchart Node */}
                    <motion.div variants={itemVariants} style={{ width: '100%' }}>
                      <Link href={`/categories/${encodeURIComponent(cat.name)}`} style={{ textDecoration: 'none' }}>
                        <motion.div 
                          whileHover={{ scale: 1.03, backgroundColor: 'rgba(255,255,255,0.08)' }}
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
      `}</style>
    </div>
  );
}
