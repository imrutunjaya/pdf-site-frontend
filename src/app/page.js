"use client";

import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { FolderOpen, ArrowRight, Sparkles, Database, FileText, Lock } from 'lucide-react';
import { motion, useScroll, useTransform } from 'framer-motion';

export default function Home() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  
  const containerRef = useRef(null);
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"] 
  });

  // Hero animations
  const heroOpacity = useTransform(scrollYProgress, [0, 0.4], [1, 0]);
  const heroY = useTransform(scrollYProgress, [0, 0.4], [0, -100]);
  const heroPointerEvents = useTransform(scrollYProgress, v => v > 0.3 ? "none" : "auto");

  // Portal animations
  const portalScale = useTransform(scrollYProgress, [0.2, 0.9], [0.1, 150]);
  const portalOpacity = useTransform(scrollYProgress, [0.1, 0.3, 0.8, 1], [0, 1, 1, 0]);

  // Tree View smooth entrance
  const treeOpacity = useTransform(scrollYProgress, [0.6, 1], [0, 1]);
  const treeY = useTransform(scrollYProgress, [0.6, 1], [100, 0]);

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

    const handleMouseMove = (e) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth - 0.5) * 20,
        y: (e.clientY / window.innerHeight - 0.5) * 20,
      });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div style={{ background: 'var(--background)', minHeight: '100vh' }}>
      
      {/* Fixed Header */}
      <header className="glass-panel" style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100, padding: '1rem 0', background: 'rgba(0,0,0,0.5)' }}>
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontWeight: 700, fontSize: '1.25rem' }}>
            <span className="text-gradient">CITEnd</span>
          </div>
          <Link href="/categories" style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--muted-foreground)', transition: 'color 0.2s' }}>
            Browse All
          </Link>
        </div>
      </header>

      {/* --- CINEMATIC ZOOM SECTION --- */}
      <div ref={containerRef} style={{ height: '200vh', position: 'relative' }}>
        
        {/* Sticky wrapper */}
        <div style={{ position: 'sticky', top: 0, height: '100vh', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          
          {/* Animated Interactive Background Glow Orbs */}
          <div className="glow-orb" style={{
            position: 'absolute', top: '50%', left: '50%', transform: `translate(-50%, -50%) translate(${-mousePosition.x}px, ${-mousePosition.y}px)`,
            width: '40vw', height: '40vw', background: 'radial-gradient(circle, rgba(59,130,246,0.15) 0%, rgba(0,0,0,0) 70%)', filter: 'blur(40px)', zIndex: 0, transition: 'transform 0.1s ease-out'
          }}></div>
          
          <div className="glow-orb-2" style={{
            position: 'absolute', top: '40%', left: '40%', transform: `translate(-50%, -50%) translate(${mousePosition.x * 2}px, ${mousePosition.y * 2}px)`,
            width: '30vw', height: '30vw', background: 'radial-gradient(circle, rgba(147,51,234,0.1) 0%, rgba(0,0,0,0) 70%)', filter: 'blur(40px)', zIndex: 0, transition: 'transform 0.1s ease-out'
          }}></div>

          {/* The Hero Content with Floating Animations */}
          <motion.div style={{ opacity: heroOpacity, y: heroY, pointerEvents: heroPointerEvents, position: 'absolute', zIndex: 10, width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            
            {/* Floating Animated Icons */}
            <div className="floating-icon" style={{ position: 'absolute', top: '25%', left: '20%', animationDelay: '0s' }}>
              <div className="glass" style={{ padding: '1.25rem', borderRadius: '1rem', background: 'rgba(255,255,255,0.03)' }}>
                <FileText size={32} color="rgba(255,255,255,0.4)" />
              </div>
            </div>
            <div className="floating-icon-reverse" style={{ position: 'absolute', bottom: '25%', right: '20%', animationDelay: '1s' }}>
              <div className="glass" style={{ padding: '1.25rem', borderRadius: '1rem', background: 'rgba(59,130,246,0.05)', borderColor: 'rgba(59,130,246,0.2)' }}>
                <Lock size={32} color="var(--primary)" />
              </div>
            </div>
            <div className="floating-icon" style={{ position: 'absolute', top: '35%', right: '30%', animationDelay: '0.5s', transform: 'scale(0.8)' }}>
               <div className="glass" style={{ padding: '1rem', borderRadius: '1rem', background: 'rgba(255,255,255,0.02)' }}>
                <FolderOpen size={24} color="rgba(255,255,255,0.3)" />
              </div>
            </div>

            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.1)', color: 'var(--foreground)', padding: '0.5rem 1.25rem', borderRadius: '9999px', fontSize: '0.875rem', fontWeight: 600, marginBottom: '2rem', backdropFilter: 'blur(10px)' }}>
              <Sparkles size={16} color="var(--primary)" />
              <span>Scroll down to unlock</span>
            </div>
            
            <h1 className="text-gradient" style={{ fontSize: 'clamp(3.5rem, 10vw, 7rem)', fontWeight: 800, letterSpacing: '-0.03em', lineHeight: 1, marginBottom: '1.5rem' }}>
              CITEnd
            </h1>
            <p style={{ color: 'var(--muted-foreground)', fontSize: '1.25rem', maxWidth: '500px', textAlign: 'center' }}>
              The ultimate secure viewing experience.
            </p>
            
            {/* Mouse Scroll Indicator */}
            <div style={{ marginTop: '3rem', width: '30px', height: '50px', border: '2px solid rgba(255,255,255,0.2)', borderRadius: '15px', position: 'relative' }}>
              <div style={{ width: '4px', height: '8px', background: 'var(--primary)', borderRadius: '2px', position: 'absolute', top: '8px', left: '50%', transform: 'translateX(-50%)', animation: 'scrollBounce 2s infinite' }}></div>
            </div>
          </motion.div>

          {/* The Portal Ring */}
          <motion.div style={{ 
            opacity: portalOpacity, 
            scale: portalScale,
            position: 'absolute',
            zIndex: 20,
            width: '100px',
            height: '100px',
            borderRadius: '50%',
            border: '2px solid var(--primary)',
            boxShadow: 'inset 0 0 20px rgba(59,130,246,0.5), 0 0 40px rgba(59,130,246,0.5)',
            pointerEvents: 'none'
          }}>
          </motion.div>

        </div>
      </div>

      {/* --- NEW PAGE: TREE VIEW --- */}
      {/* We use framer-motion here to pull the tree view up slightly so it transitions perfectly from the portal */}
      <motion.section style={{ opacity: treeOpacity, y: treeY, minHeight: '100vh', position: 'relative', zIndex: 30, background: 'var(--background)', padding: '4rem 2rem 8rem 2rem', marginTop: '-20vh' }}>
        <div className="container" style={{ maxWidth: '900px', margin: '0 auto' }}>
          
          <div className="glass-panel" style={{ padding: '3rem', borderRadius: '1.5rem', background: 'rgba(10,10,10,0.8)', border: '1px solid rgba(255,255,255,0.05)', boxShadow: '0 -20px 40px rgba(0,0,0,0.5)' }}>
            <h2 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '2rem', letterSpacing: '-0.02em', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '1rem' }}>
              Repository File System
            </h2>

            <div className="tree-container" style={{ paddingLeft: '1rem', paddingTop: '1rem' }}>
              {/* Root Node */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
                 <div style={{ background: 'rgba(255,255,255,0.1)', padding: '0.75rem', borderRadius: '0.5rem' }}>
                   <Database size={24} color="var(--primary)" />
                 </div>
                 <span style={{ fontSize: '1.5rem', fontWeight: 700, fontFamily: 'monospace' }}>/root</span>
              </div>
              
              {/* Tree Branches */}
              <div style={{ marginLeft: '1.5rem', borderLeft: '2px solid rgba(255,255,255,0.1)', paddingLeft: '2.5rem', position: 'relative' }}>
                
                {loading ? (
                  [1, 2, 3].map(i => (
                    <div key={i} style={{ position: 'relative', marginBottom: '1.5rem' }}>
                      <div style={{ position: 'absolute', top: '18px', left: '-2.5rem', width: '2.5rem', height: '2px', background: 'rgba(255,255,255,0.1)' }}></div>
                      <div className="glass skeleton" style={{ height: '60px', width: '250px', borderRadius: '0.75rem' }}></div>
                    </div>
                  ))
                ) : categories.length > 0 ? (
                  categories.map((cat, index) => (
                    <div key={cat.path} style={{ position: 'relative', marginBottom: index === categories.length - 1 ? '0' : '1.5rem' }}>
                      {/* Horizontal branch line */}
                      <div style={{ position: 'absolute', top: '24px', left: '-2.5rem', width: '2.5rem', height: '2px', background: 'rgba(255,255,255,0.1)' }}></div>
                      
                      <Link href={`/categories/${encodeURIComponent(cat.name)}`}>
                        <div className="glass hover-card" style={{ display: 'inline-flex', alignItems: 'center', gap: '1rem', padding: '1rem 1.5rem', borderRadius: '0.75rem', background: 'rgba(255,255,255,0.03)' }}>
                           <FolderOpen size={24} color="var(--primary)" />
                           <span style={{ fontSize: '1.125rem', fontWeight: 500, fontFamily: 'monospace' }}>{cat.name}</span>
                           <ArrowRight size={16} color="var(--muted-foreground)" style={{ marginLeft: '1rem' }} />
                        </div>
                      </Link>
                    </div>
                  ))
                ) : (
                  <div style={{ position: 'relative', padding: '1rem 0' }}>
                    <div style={{ position: 'absolute', top: '30px', left: '-2.5rem', width: '2.5rem', height: '2px', background: 'rgba(255,255,255,0.1)' }}></div>
                    <span style={{ color: 'var(--muted-foreground)', fontFamily: 'monospace', fontSize: '1.125rem' }}>No directories found...</span>
                  </div>
                )}
                
              </div>
            </div>

          </div>
        </div>
      </motion.section>
      
      <style>{`
        @keyframes scrollBounce {
          0%, 100% { transform: translate(-50%, 0); opacity: 1; }
          50% { transform: translate(-50%, 15px); opacity: 0; }
        }
        @keyframes float {
          0% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(2deg); }
          100% { transform: translateY(0px) rotate(0deg); }
        }
        @keyframes floatReverse {
          0% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(20px) rotate(-2deg); }
          100% { transform: translateY(0px) rotate(0deg); }
        }
        
        .floating-icon {
          animation: float 6s ease-in-out infinite;
        }
        .floating-icon-reverse {
          animation: floatReverse 7s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
