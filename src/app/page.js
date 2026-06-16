"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { FolderOpen, ArrowRight, Database, Lock, Info, FileText } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Home() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

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
        staggerChildren: 0.15
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } }
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
      
      {/* Ambient Orbs */}
      <div style={{ position: 'absolute', top: '20%', left: '10%', width: '30vw', height: '30vw', background: 'radial-gradient(circle, rgba(59,130,246,0.1) 0%, transparent 70%)', filter: 'blur(60px)', zIndex: 0 }}></div>
      <div style={{ position: 'absolute', bottom: '10%', right: '10%', width: '40vw', height: '40vw', background: 'radial-gradient(circle, rgba(147,51,234,0.08) 0%, transparent 70%)', filter: 'blur(60px)', zIndex: 0 }}></div>

      {/* Main Dashboard Layout */}
      <div style={{ position: 'relative', zIndex: 10, display: 'flex', flexDirection: 'column', height: '100vh', padding: '2rem' }}>
        
        {/* Top Branding / Navbar */}
        <motion.header 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4rem', padding: '1rem 2rem', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '1rem', backdropFilter: 'blur(10px)' }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ background: 'rgba(59,130,246,0.1)', padding: '0.5rem', borderRadius: '0.5rem', border: '1px solid rgba(59,130,246,0.2)' }}>
              <Lock size={24} color="#3b82f6" />
            </div>
            <div>
              <h1 style={{ fontSize: '1.25rem', fontWeight: 800, letterSpacing: '2px', textTransform: 'uppercase', background: 'linear-gradient(to right, #60a5fa, #a855f7)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', margin: 0 }}>CITEnd</h1>
              <span style={{ fontSize: '0.75rem', color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '1px' }}>Secure Terminal</span>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', color: '#10b981' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981', boxShadow: '0 0 10px #10b981' }}></span>
              System Online
            </span>
          </div>
        </motion.header>

        {/* Central Content Area */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', maxWidth: '1200px', width: '100%', margin: '0 auto', overflow: 'hidden' }}>
          
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3, duration: 1 }}
            style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '1rem', marginBottom: '2rem' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <Database size={32} color="#fff" />
              <h2 style={{ fontSize: '2.5rem', fontWeight: 300, margin: 0, letterSpacing: '-1px' }}>
                <span style={{ fontWeight: 700 }}>Repository</span>.Book
              </h2>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <span style={{ fontSize: '0.875rem', color: '#6b7280', fontStyle: 'italic' }}>By-Mrutunjaya</span>
              <Info size={20} color="#9ca3af" />
            </div>
          </motion.div>

          {/* Data Chips Grid */}
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="show"
            style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem', flex: 1, alignContent: 'start', overflowY: 'auto', paddingRight: '1rem', paddingBottom: '2rem' }}
            className="custom-scrollbar"
          >
            {loading ? (
              [1, 2, 3, 4].map(i => (
                <div key={i} style={{ height: '100px', background: 'rgba(255,255,255,0.03)', borderRadius: '0.75rem', border: '1px solid rgba(255,255,255,0.05)' }} className="skeleton"></div>
              ))
            ) : categories.length > 0 ? (
              categories.map((cat) => (
                <motion.div variants={itemVariants} key={cat.path}>
                  <Link href={`/categories/${encodeURIComponent(cat.name)}`} style={{ textDecoration: 'none' }}>
                    <motion.div 
                      whileHover={{ scale: 1.02, backgroundColor: 'rgba(255,255,255,0.05)' }}
                      whileTap={{ scale: 0.98 }}
                      transition={{ duration: 0.2 }}
                      style={{ 
                        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                        padding: '1.5rem', background: 'rgba(255,255,255,0.02)', 
                        borderRadius: '0.75rem', border: '1px solid rgba(255,255,255,0.05)',
                        borderLeft: '4px solid #3b82f6',
                        boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
                        cursor: 'pointer'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                        <div style={{ background: 'rgba(59,130,246,0.1)', padding: '0.75rem', borderRadius: '0.5rem' }}>
                          <FolderOpen size={24} color="#60a5fa" />
                        </div>
                        <div>
                          <h3 style={{ fontSize: '1.125rem', fontWeight: 600, margin: '0 0 0.25rem 0', color: '#fff' }}>{cat.name}</h3>
                          <span style={{ fontSize: '0.75rem', color: '#6b7280', fontFamily: 'monospace' }}>MODULE_READY //</span>
                        </div>
                      </div>
                      <ArrowRight size={20} color="#4b5563" />
                    </motion.div>
                  </Link>
                </motion.div>
              ))
            ) : (
              <motion.div variants={itemVariants} style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '4rem', color: '#6b7280', border: '1px dashed rgba(255,255,255,0.1)', borderRadius: '1rem' }}>
                <FileText size={48} style={{ opacity: 0.2, margin: '0 auto 1rem auto' }} />
                <p style={{ fontFamily: 'monospace' }}>No modules found in registry.</p>
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
        .custom-scrollbar::-webkit-scrollbar { width: 8px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: rgba(255,255,255,0.02); border-radius: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(255,255,255,0.2); }
      `}</style>
    </div>
  );
}
