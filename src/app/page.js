"use client";

import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { FolderOpen, FileText, Info, X, Mail, Settings, LayoutList, AlignLeft, AlignCenter, Grid, ChevronsDown, ChevronsUp, Search, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const IosSettingsIcon = ({ size = 20, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={color} xmlns="http://www.w3.org/2000/svg">
    <path fillRule="evenodd" clipRule="evenodd" d="M12 2C10.8954 2 10 2.89543 10 4V4.5C10 5.32843 9.32843 6 8.5 6C8.01639 6 7.56847 5.76103 7.29177 5.36737C6.91885 4.8364 6.19694 4.67389 5.63263 5.04677L5.36737 5.29177C4.8364 5.66469 4.67389 6.38661 5.04677 6.95092C5.41966 7.48189 5.25714 8.20381 4.72618 8.5767C4.19521 8.94958 3.47329 8.78707 3.1004 8.25611C2.72751 7.72514 2 7.88766 2 8.41863V9.5C2 10.3284 2.67157 11 3.5 11C4.32843 11 5 11.6716 5 12.5C5 13.3284 4.32843 14 3.5 14C2.67157 14 2 14.6716 2 15.5V16.5C2 17.031 2.72751 17.1935 3.1004 16.6625C3.47329 16.1315 4.19521 15.969 4.72618 16.3419C5.25714 16.7148 5.41966 17.4367 5.04677 17.9677C4.67389 18.532 4.8364 19.2539 5.36737 19.6268L5.63263 19.8718C6.19694 20.2447 6.91885 20.0822 7.29177 19.5512C7.56847 19.1576 8.01639 18.9186 8.5 18.9186C9.32843 18.9186 10 19.5902 10 20.4186V21C10 22.1046 10.8954 23 12 23H13C14.1046 23 15 22.1046 15 21V20.4186C15 19.5902 15.6716 18.9186 16.5 18.9186C16.9836 18.9186 17.4315 19.1576 17.7082 19.5512C18.0811 20.0822 18.8031 20.2447 19.3674 19.8718L19.6326 19.6268C20.1636 19.2539 20.3261 18.532 19.9532 17.9677C19.5803 17.4367 19.7429 16.7148 20.2738 16.3419C20.8048 15.969 21.5267 16.1315 21.8996 16.6625C22.2725 17.1935 23 17.031 23 16.5V15.5C23 14.6716 22.3284 14 21.5 14C20.6716 14 20 13.3284 20 12.5C20 11.6716 20.6716 11 21.5 11C22.3284 11 23 10.3284 23 9.5V8.41863C23 7.88766 22.2725 7.72514 21.8996 8.25611C21.5267 8.78707 20.8048 8.94958 20.2738 8.5767C19.7429 8.20381 19.5803 7.48189 19.9532 6.95092C20.3261 6.38661 20.1636 5.66469 19.6326 5.29177L19.3674 5.04677C18.8031 4.67389 18.0811 4.8364 17.7082 5.36737C17.4315 5.76103 16.9836 6 16.5 6C15.6716 6 15 5.32843 15 4.5V4C15 2.89543 14.1046 2 13 2H12ZM12.5 15.5C14.1569 15.5 15.5 14.1569 15.5 12.5C15.5 10.8431 14.1569 9.5 12.5 9.5C10.8431 9.5 9.5 10.8431 9.5 12.5C9.5 14.1569 10.8431 15.5 12.5 15.5Z" />
  </svg>
);

const IosSpinner = ({ size = 48, color = '#fff', isSpinning = true }) => {
  return (
    <div style={{ position: 'relative', width: size, height: size, display: 'inline-block' }}>
      {[...Array(12)].map((_, i) => (
        <div 
          key={i} 
          style={{ 
            position: 'absolute', 
            top: 0, 
            left: `${size/2 - (size > 30 ? 2 : 1)}px`, 
            width: size > 30 ? '4px' : '2px', 
            height: `${size/4}px`, 
            background: color, 
            borderRadius: '2px',
            transformOrigin: `${size > 30 ? 2 : 1}px ${size/2}px`,
            transform: `rotate(${i * 30}deg)`,
            opacity: isSpinning ? 1 : 0.5,
            animation: isSpinning ? `ios-spin 1.2s linear infinite` : 'none',
            animationDelay: `${(i - 12) * 0.1}s`
          }} 
        />
      ))}
    </div>
  );
};



const SolarSystem = ({ innerRef, style, className }) => (
  <div ref={innerRef} className={`solar-system ${className || ''}`} style={{ position: 'relative', width: '80px', height: '80px', display: 'flex', alignItems: 'center', justifyContent: 'center', ...style }}>
    {/* Sun */}
    <div style={{
      width: '26px', height: '26px', borderRadius: '50%',
      background: 'radial-gradient(circle at 30% 30%, #fef08a, #f59e0b)',
      boxShadow: '0 0 20px rgba(245, 158, 11, 0.4), inset -4px -4px 8px rgba(217, 119, 6, 0.8)',
      position: 'relative', zIndex: 10
    }}></div>
    {/* Orbit 1 */}
    <div style={{ position: 'absolute', width: '45px', height: '45px', borderRadius: '50%', border: '1px solid rgba(255,255,255,0.1)', animation: 'spin-orbit 4s linear infinite' }}>
      <div style={{ position: 'absolute', top: '-3px', left: '50%', marginLeft: '-3px', width: '6px', height: '6px', borderRadius: '50%', background: '#9ca3af', boxShadow: '0 0 4px rgba(156,163,175,0.8)' }}></div>
    </div>
    {/* Orbit 2 */}
    <div style={{ position: 'absolute', width: '65px', height: '65px', borderRadius: '50%', border: '1px solid rgba(255,255,255,0.1)', animation: 'spin-orbit 8s linear infinite' }}>
      <div style={{ position: 'absolute', top: '-4px', left: '50%', marginLeft: '-4px', width: '8px', height: '8px', borderRadius: '50%', background: 'radial-gradient(circle at 30% 30%, #60a5fa, #1d4ed8)', boxShadow: '0 0 6px rgba(59,130,246,0.6)' }}></div>
    </div>
    {/* Orbit 3 */}
    <div style={{ position: 'absolute', width: '85px', height: '85px', borderRadius: '50%', border: '1px dashed rgba(255,255,255,0.05)', animation: 'spin-orbit 14s linear infinite' }}>
      <div style={{ position: 'absolute', top: '-3px', left: '50%', marginLeft: '-3px', width: '6px', height: '6px', borderRadius: '50%', background: 'radial-gradient(circle at 30% 30%, #fca5a5, #b91c1c)', boxShadow: '0 0 6px rgba(239,68,68,0.6)' }}></div>
    </div>
  </div>
);

const TypingTitle = ({ onComplete }) => {
  const text = "Repository.Book";
  const [displayedText, setDisplayedText] = useState("");

  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      index++;
      setDisplayedText(text.slice(0, index));
      if (index === text.length) {
        clearInterval(interval);
        setTimeout(() => {
          if (onComplete) onComplete();
        }, 300);
      }
    }, 70); 
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <span style={{ fontWeight: 600 }}>{displayedText.length > 10 ? displayedText.slice(0, 10) : displayedText}</span>
      {displayedText.length > 10 && <span style={{ opacity: 0.8 }}>{displayedText.slice(10)}</span>}
      {displayedText.length < text.length && <span style={{ animation: 'blink 1s step-end infinite', marginLeft: '2px', opacity: 0.5 }}>|</span>}
    </>
  );
};

export default function Home() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isAboutModalOpen, setIsAboutModalOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [pdfCoverEnabled, setPdfCoverEnabled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  // 0: idle, 1: typing in center, 2: flying to header
  const [syncStage, setSyncStage] = useState(0); 
  const [flyTarget, setFlyTarget] = useState({ x: 0, y: 0, scale: 1 });
  const headerTitleRef = useRef(null);
  const centerTitleRef = useRef(null);
  
  const [isTypingComplete, setIsTypingComplete] = useState(false);
  const [isFetchComplete, setIsFetchComplete] = useState(false);

  // viewMode options: 'flowchart-center', 'flowchart-left', 'list', 'grid'
  const [viewMode, setViewMode] = useState('flowchart-center');
  const settingsRef = useRef(null);

  useEffect(() => {
    if (syncStage === 1 && isTypingComplete && isFetchComplete) {
      if (headerTitleRef.current && centerTitleRef.current) {
        const headerRect = headerTitleRef.current.getBoundingClientRect();
        const centerRect = centerTitleRef.current.getBoundingClientRect();
        
        const scale = headerRect.height / centerRect.height;
        const x = headerRect.left - centerRect.left;
        const y = headerRect.top - centerRect.top;
        
        setFlyTarget({ x, y, scale });
      }
      
      setSyncStage(2);
      
      setTimeout(() => {
        setSyncStage(0);
      }, 800); // Wait for flight to finish
    }
  }, [syncStage, isTypingComplete, isFetchComplete]);

  // Handle clicking outside the settings dropdown
  useEffect(() => {
    function handleClickOutside(event) {
      if (settingsRef.current && !settingsRef.current.contains(event.target)) {
        setIsSettingsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Load from local storage
  useEffect(() => {
    const savedMode = localStorage.getItem('repo-view-mode');
    if (savedMode) setViewMode(savedMode);
    
    const savedCover = localStorage.getItem('repo-pdf-cover');
    if (savedCover) setPdfCoverEnabled(savedCover === 'true');
  }, []);

  const handlePdfCoverToggle = () => {
    const newValue = !pdfCoverEnabled;
    setPdfCoverEnabled(newValue);
    localStorage.setItem('repo-pdf-cover', newValue);
  };

  // Save to local storage when changed
  const handleViewChange = (mode) => {
    setViewMode(mode);
    localStorage.setItem('repo-view-mode', mode);
    setIsSettingsOpen(false);
  };

  const handleSync = async () => {
    setIsTypingComplete(false);
    setIsFetchComplete(false);
    setSyncStage(1);
    
    try {
      const res = await fetch('/api/categories');
      const data = await res.json();
      if (res.ok) setCategories(data.categories || []);
    } catch (err) {
      console.error(err);
    } finally {
      setIsFetchComplete(true);
    }
  };

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
    show: { opacity: 1, transition: { staggerChildren: 0.15 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 200, damping: 20 } }
  };

  const filteredCategories = categories.map(section => {
    const query = searchQuery.toLowerCase();
    if (section.sectionName.toLowerCase().includes(query)) {
      return section;
    }
    const filteredSubs = section.subCategories.filter(cat => cat.name.toLowerCase().includes(query));
    if (filteredSubs.length > 0) {
      return { ...section, subCategories: filteredSubs };
    }
    return null;
  }).filter(Boolean);

  return (
    <div style={{ background: '#050505', minHeight: '100vh', width: '100vw', overflow: 'hidden', position: 'relative', color: '#fff', fontFamily: 'sans-serif' }}>
      
      {/* Google Fonts for Handwritten Signature */}
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Caveat:wght@400&display=swap');
      </style>

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
      <div style={{ position: 'relative', zIndex: 10, display: 'flex', flexDirection: 'column', height: '100vh', padding: '1rem 0' }}>
        
        {/* Central Content Area */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', width: '100%', margin: '0 auto', overflow: 'hidden', padding: '0 1rem' }}>
          
          {/* Header */}
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2, duration: 1 }}
            className="main-header"
            style={{ 
              display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '1rem',
              borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '1rem', marginBottom: '2rem' 
            }}
          >
            <div className="header-left" style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                {/* CSS Solar System */}
                <SolarSystem style={{ margin: '0 0.5rem' }} />

                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <h2 ref={headerTitleRef} style={{ fontSize: 'clamp(1.5rem, 5vw, 2.5rem)', fontWeight: 100, margin: 0, letterSpacing: '-1px', lineHeight: 1, whiteSpace: 'nowrap', opacity: syncStage > 0 ? 0 : 1, transition: 'opacity 0.2s' }}>
                    <span style={{ fontWeight: 600 }}>Repository</span><span style={{ opacity: 0.8 }}>.Book</span>
                  </h2>
                  <div style={{ display: 'flex', justifyContent: 'flex-end', width: '100%', marginTop: '0.2rem' }}>
                    <button 
                      onClick={() => setIsAboutModalOpen(true)}
                      style={{ background: 'none', border: 'none', cursor: 'pointer', outline: 'none', padding: 0, transform: 'translateX(calc(100% - 1ch))' }}
                      className="hover-bright"
                    >
                      <span style={{ fontSize: 'clamp(0.9rem, 2vw, 1.2rem)', color: '#60a5fa', fontFamily: '"Caveat", cursive', fontWeight: 300, transition: 'color 0.2s', opacity: 0.9 }}>
                        By-Mrutunjaya
                      </span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Mobile Actions Toggle (Only visible on mobile via CSS) */}
              <button 
                className="mobile-actions-toggle" 
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#9ca3af', padding: '0.5rem', borderRadius: '50%', cursor: 'pointer', display: 'none' }}
              >
                {isMobileMenuOpen ? <ChevronsUp size={20} /> : <ChevronsDown size={20} />}
              </button>
            </div>
            
            {/* Header Right Actions */}
            <div className={`header-right ${isMobileMenuOpen ? 'mobile-open' : 'mobile-closed'}`} style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              
              {/* Sync Button */}
              <button 
                onClick={handleSync}
                style={{ display: 'flex', flexShrink: 0, alignItems: 'center', justifyContent: 'center', background: 'none', border: 'none', color: '#9ca3af', cursor: 'pointer', padding: '0.5rem', transition: 'all 0.2s' }}
              >
                <IosSpinner size={22} color="#9ca3af" isSpinning={syncStage > 0} />
              </button>

              {/* Search Bar */}
              <div className="search-wrapper" style={{ position: 'relative', display: 'flex', alignItems: 'center', flex: 1 }}>
                <input 
                  type="text" 
                  placeholder="Search..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '2rem', padding: '0.5rem 1rem 0.5rem 2.5rem', color: '#fff', fontSize: '0.9rem', width: '100%', maxWidth: '250px', outline: 'none', transition: 'all 0.2s' }}
                  className="search-input hover-primary-border"
                />
                <Search size={16} color="#9ca3af" style={{ position: 'absolute', left: '0.8rem' }} />
              </div>

              {/* Settings Dropdown */}
              <div style={{ position: 'relative', flexShrink: 0 }} ref={settingsRef}>
                <button 
                  onClick={() => setIsSettingsOpen(!isSettingsOpen)}
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#9ca3af', cursor: 'pointer', padding: '0.6rem', borderRadius: '50%', transition: 'all 0.2s' }}
                  className="hover-white hover-bg"
                >
                  <IosSettingsIcon size={20} />
                </button>
                
                <AnimatePresence>
                  {isSettingsOpen && (
                    <motion.div 
                      className="settings-dropdown"
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      transition={{ duration: 0.15 }}
                      style={{ position: 'absolute', right: 0, top: '120%', width: '220px', background: 'rgba(15,15,15,0.95)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '1rem', padding: '0.5rem', boxShadow: '0 10px 40px rgba(0,0,0,0.5)', zIndex: 100 }}
                    >
                      <h4 style={{ margin: '0.5rem 0.75rem', fontSize: '0.75rem', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '1px' }}>View Options</h4>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                        
                        <button onClick={() => handleViewChange('flowchart-center')} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem', width: '100%', background: viewMode === 'flowchart-center' ? 'rgba(59,130,246,0.1)' : 'transparent', border: 'none', color: viewMode === 'flowchart-center' ? '#fff' : '#9ca3af', borderRadius: '0.5rem', cursor: 'pointer', textAlign: 'left', transition: 'background 0.2s' }} className="hover-bg">
                          <AlignCenter size={18} color={viewMode === 'flowchart-center' ? '#60a5fa' : 'currentColor'} />
                          <span style={{ fontSize: '0.9rem', fontWeight: 500 }}>Flowchart (Center)</span>
                        </button>
                        
                        <button onClick={() => handleViewChange('flowchart-left')} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem', width: '100%', background: viewMode === 'flowchart-left' ? 'rgba(59,130,246,0.1)' : 'transparent', border: 'none', color: viewMode === 'flowchart-left' ? '#fff' : '#9ca3af', borderRadius: '0.5rem', cursor: 'pointer', textAlign: 'left', transition: 'background 0.2s' }} className="hover-bg">
                          <AlignLeft size={18} color={viewMode === 'flowchart-left' ? '#60a5fa' : 'currentColor'} />
                          <span style={{ fontSize: '0.9rem', fontWeight: 500 }}>Flowchart (Left)</span>
                        </button>
                        
                        <button onClick={() => handleViewChange('list')} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem', width: '100%', background: viewMode === 'list' ? 'rgba(59,130,246,0.1)' : 'transparent', border: 'none', color: viewMode === 'list' ? '#fff' : '#9ca3af', borderRadius: '0.5rem', cursor: 'pointer', textAlign: 'left', transition: 'background 0.2s' }} className="hover-bg">
                          <LayoutList size={18} color={viewMode === 'list' ? '#60a5fa' : 'currentColor'} />
                          <span style={{ fontSize: '0.9rem', fontWeight: 500 }}>List View</span>
                        </button>
                        
                        <button onClick={() => handleViewChange('grid')} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem', width: '100%', background: viewMode === 'grid' ? 'rgba(59,130,246,0.1)' : 'transparent', border: 'none', color: viewMode === 'grid' ? '#fff' : '#9ca3af', borderRadius: '0.5rem', cursor: 'pointer', textAlign: 'left', transition: 'background 0.2s' }} className="hover-bg">
                          <Grid size={18} color={viewMode === 'grid' ? '#60a5fa' : 'currentColor'} />
                          <span style={{ fontSize: '0.9rem', fontWeight: 500 }}>Grid View</span>
                        </button>

                        <div style={{ height: '1px', background: 'rgba(255,255,255,0.1)', margin: '0.5rem 0' }}></div>
                        <h4 style={{ margin: '0.25rem 0.75rem 0.5rem', fontSize: '0.75rem', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '1px' }}>Reader Options</h4>
                        
                        <div onClick={handlePdfCoverToggle} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.75rem', width: '100%', background: 'transparent', cursor: 'pointer', borderRadius: '0.5rem', transition: 'background 0.2s' }} className="hover-bg">
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: pdfCoverEnabled ? '#fff' : '#9ca3af' }}>
                            <FileText size={18} color={pdfCoverEnabled ? '#60a5fa' : 'currentColor'} />
                            <span style={{ fontSize: '0.9rem', fontWeight: 500 }}>PDF Cover Page</span>
                          </div>
                          <div style={{ position: 'relative', width: '36px', height: '20px', background: pdfCoverEnabled ? '#3b82f6' : 'rgba(255,255,255,0.1)', borderRadius: '10px', transition: 'background 0.3s' }}>
                            <div style={{ position: 'absolute', top: '2px', left: pdfCoverEnabled ? '18px' : '2px', width: '16px', height: '16px', background: '#fff', borderRadius: '50%', transition: 'left 0.3s', boxShadow: '0 2px 4px rgba(0,0,0,0.2)' }}></div>
                          </div>
                        </div>


                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>


            </div>
          </motion.div>

          {/* Dynamic Content Layout */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '1rem 0 4rem 0', width: '100%' }} className="custom-scrollbar">
            {loading ? (
              <div className="skeleton" style={{ height: '80px', width: '100%', background: 'rgba(255,255,255,0.03)', borderRadius: '0.75rem' }}></div>
            ) : filteredCategories.length > 0 ? (
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem', width: '100%' }}>
                {filteredCategories.map((section) => (
                  <motion.div 
                    key={section.sectionPath}
                    variants={containerVariants}
                    initial="hidden"
                    animate="show"
                    style={{ width: '100%' }}
                  >
                    {/* Section Header */}
                    <div className="section-header" style={{ marginBottom: '1.5rem', paddingBottom: '0.5rem', borderBottom: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '1rem' }}>
                      <div>
                        <h2 style={{ fontSize: '1.5rem', fontWeight: 600, margin: '0 0 0.25rem 0', color: '#fff', textTransform: 'capitalize' }}>
                          {section.sectionName}
                        </h2>
                        <p style={{ margin: 0, fontSize: '0.9rem', color: '#9ca3af' }}>Explore all directories and files under {section.sectionName.toLowerCase()}.</p>
                      </div>

                      {/* Section Syllabus Button */}
                      <Link 
                        href={`/reader?path=${encodeURIComponent(section.sectionName + '/Syllabus.pdf')}`} 
                        style={{ 
                          textDecoration: 'none', 
                          padding: '0.5rem 1rem', 
                          background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.15), rgba(220, 38, 38, 0.05))', 
                          border: '1px solid rgba(239, 68, 68, 0.3)', 
                          color: '#fca5a5', 
                          borderRadius: '0.5rem', 
                          fontSize: '0.85rem', 
                          fontWeight: 600,
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.5rem',
                          transition: 'all 0.2s',
                          boxShadow: '0 4px 15px rgba(239, 68, 68, 0.1)'
                        }}
                        className="hover-syllabus section-syllabus-btn"
                      >
                        <FileText size={16} />
                        Syllabus
                      </Link>
                    </div>

                    <div style={{
                      display: viewMode === 'grid' ? 'grid' : 'flex',
                      flexDirection: viewMode === 'grid' ? 'row' : 'column',
                      gridTemplateColumns: viewMode === 'grid' ? 'repeat(auto-fill, minmax(300px, 1fr))' : 'none',
                      alignItems: viewMode === 'flowchart-center' ? 'center' : 'flex-start', 
                      gap: viewMode === 'grid' ? '1.5rem' : '0',
                      width: '100%',
                      position: 'relative'
                    }}>
                      
                      {/* Vertical Tree Branch Line (Only for flowchart-left) */}
                      {viewMode === 'flowchart-left' && section.subCategories.length > 0 && (
                         <div className="vertical-branch" style={{ position: 'absolute', top: '-1.5rem', bottom: '2rem', left: '2.5rem', width: '2px', background: 'rgba(59,130,246,0.3)', zIndex: 1 }}></div>
                      )}

                      {section.subCategories.map((cat, index) => (
                        <div className="flowchart-node-wrapper" key={cat.path} style={{ 
                          display: 'flex', flexDirection: 'column', 
                          alignItems: viewMode === 'flowchart-center' ? 'center' : 'flex-start', 
                          width: '100%',
                          position: 'relative',
                          paddingLeft: viewMode === 'flowchart-left' ? '5rem' : '0',
                          marginBottom: viewMode === 'flowchart-left' ? '1rem' : '0'
                        }}>
                          
                          {/* Horizontal Tree Branch Line (Only for flowchart-left) */}
                          {viewMode === 'flowchart-left' && (
                            <div className="horizontal-branch" style={{ position: 'absolute', top: '50%', left: '2.5rem', width: '2.5rem', height: '2px', background: 'rgba(59,130,246,0.3)', zIndex: 1, transform: 'translateY(-50%)' }}></div>
                          )}

                          {/* Center Flowchart Connectors */}
                          {viewMode === 'flowchart-center' && (
                            <motion.div variants={itemVariants} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                              <div style={{ width: '2px', height: '20px', background: 'rgba(255,255,255,0.2)' }}></div>
                              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '32px', height: '32px', borderRadius: '50%', background: 'rgba(255,255,255,0.05)', border: '2px solid rgba(255,255,255,0.2)', color: '#9ca3af', fontSize: '1rem', fontWeight: 700 }}>
                                {index + 1}
                              </div>
                              <div style={{ width: '2px', height: '20px', background: 'rgba(255,255,255,0.2)', position: 'relative' }}>
                                <div style={{ position: 'absolute', bottom: 0, left: '-4px', width: 0, height: 0, borderLeft: '5px solid transparent', borderRight: '5px solid transparent', borderTop: '6px solid rgba(255,255,255,0.2)' }}></div>
                              </div>
                            </motion.div>
                          )}

                          {/* Node Card */}
                          <motion.div variants={itemVariants} style={{ width: '100%', marginBottom: (viewMode === 'list' || viewMode === 'grid') ? '1rem' : '0' }}>
                            <motion.div 
                              className="category-card"
                              whileHover={{ scale: 1.02, backgroundColor: 'rgba(255,255,255,0.05)' }}
                              transition={{ duration: 0.2 }}
                              style={{ 
                                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                                padding: '1.25rem 1.5rem', background: 'rgba(255,255,255,0.03)', 
                                borderRadius: '1rem', border: '1px solid rgba(255,255,255,0.1)',
                                borderLeft: '4px solid #3b82f6',
                                boxShadow: '0 8px 30px rgba(0,0,0,0.3)',
                                position: 'relative'
                              }}
                            >
                              <Link className="category-link" href={`/categories/${encodeURIComponent(cat.name)}?path=${encodeURIComponent(cat.path)}`} style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '1.5rem', flex: 1 }}>
                                {(viewMode === 'list' || viewMode === 'grid') && (
                                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '28px', height: '28px', borderRadius: '50%', background: 'rgba(59,130,246,0.1)', color: '#60a5fa', fontSize: '0.8rem', fontWeight: 700 }}>
                                    {index + 1}
                                  </div>
                                )}
                                <div style={{ background: 'rgba(59,130,246,0.1)', padding: '0.75rem', borderRadius: '0.75rem' }}>
                                  <FolderOpen size={24} color="#60a5fa" />
                                </div>
                                <div>
                                  <h3 style={{ fontSize: '1.125rem', fontWeight: 500, margin: '0 0 0.25rem 0', color: '#fff' }}>{cat.name}</h3>
                                  <p style={{ fontSize: '0.85rem', color: '#9ca3af', margin: '0 0 0.5rem 0', lineHeight: 1.4 }}>
                                    Access PDF materials, notes, and resources for {cat.name}.
                                  </p>
                                  <span style={{ fontSize: '0.75rem', color: '#6b7280', fontFamily: 'monospace' }}>{section.sectionName}/{cat.name} //</span>
                                </div>
                              </Link>
                            </motion.div>
                          </motion.div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                ))}
              </div>

            ) : (
              <motion.div variants={itemVariants} style={{ textAlign: 'center', padding: '4rem', color: '#6b7280', border: '1px dashed rgba(255,255,255,0.1)', borderRadius: '1rem', marginTop: '2rem' }}>
                <FileText size={48} style={{ opacity: 0.2, margin: '0 auto 1rem auto' }} />
                <p style={{ fontFamily: 'monospace' }}>No nodes available.</p>
              </motion.div>
            )}
          </div>
        </div>
      </div>

      {/* Syncing Overlay and Flying Text Animation */}
      <AnimatePresence>
        {syncStage > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{ 
              position: 'fixed', inset: 0, zIndex: 9998, 
              background: 'rgba(5,5,5,0.85)', backdropFilter: 'blur(8px)',
              display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}
          >
            <motion.div
              ref={centerTitleRef}
              initial={{ scale: 1, x: 0, y: 0 }}
              animate={
                syncStage === 2 
                  ? { x: flyTarget.x, y: flyTarget.y, scale: flyTarget.scale } 
                  : { x: 0, y: 0, scale: 1 }
              }
              transition={{ duration: 0.8, ease: "easeInOut" }}
              style={{ transformOrigin: 'top left' }}
            >
              <h2 style={{ fontSize: 'clamp(2.5rem, 8vw, 4rem)', fontWeight: 100, margin: 0, letterSpacing: '-1px', lineHeight: 1, whiteSpace: 'nowrap', color: '#fff' }}>
                {syncStage === 1 ? (
                  <TypingTitle onComplete={() => setIsTypingComplete(true)} />
                ) : (
                  <><span style={{ fontWeight: 600 }}>Repository</span><span style={{ opacity: 0.8 }}>.Book</span></>
                )}
              </h2>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

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
                <h3 style={{ fontSize: '1.8rem', margin: '0 0 0.5rem 0', color: '#fff', fontFamily: '"Caveat", cursive', fontWeight: 300, letterSpacing: '1px', opacity: 0.9 }}>Mrutunjaya Pradhan</h3>
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
        .hover-syllabus:hover { background: rgba(239, 68, 68, 0.25) !important; border-color: rgba(239, 68, 68, 0.6) !important; transform: translateY(-2px); box-shadow: 0 6px 20px rgba(239, 68, 68, 0.2) !important; }
        .skeleton { animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite; }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: .3; }
        }
        @keyframes spin-orbit {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes spin { 100% { transform: rotate(360deg); } }
        .spin-animation { animation: spin 2s linear infinite; }
        @keyframes ios-spin {
          0% { opacity: 1; }
          100% { opacity: 0.15; }
        }
        @keyframes wave {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
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

        @keyframes fadeIn { from { opacity: 0; transform: translateY(-10px); } to { opacity: 1; transform: translateY(0); } }

        @media (max-width: 768px) {
          .main-header { flex-direction: column !important; align-items: flex-start !important; gap: 1rem !important; }
          .header-left { width: 100% !important; justify-content: space-between !important; }
          .header-right { width: 100% !important; justify-content: space-between !important; gap: 0.5rem !important; border-top: 1px solid rgba(255,255,255,0.05); padding-top: 1rem; flex-wrap: nowrap !important; }
          .search-wrapper { flex: 1 !important; }
          .search-input { width: 100% !important; max-width: none !important; }
          .header-right.mobile-closed { display: none !important; }
          .header-right.mobile-open { display: flex !important; animation: fadeIn 0.2s ease-out; }
          .mobile-actions-toggle { display: flex !important; align-items: center; justify-content: center; }
          .settings-dropdown { left: 0 !important; right: auto !important; width: 260px !important; }
          
          .solar-system { transform: scale(0.6) !important; margin: 0 !important; width: 60px !important; height: 60px !important; }
          
          .section-header { flex-direction: column !important; align-items: flex-start !important; gap: 1rem !important; }
          .section-header > div { width: 100% !important; }
          .section-syllabus-btn { align-self: flex-start !important; width: 100% !important; justify-content: center !important; }
          
          .category-card { flex-direction: column !important; align-items: flex-start !important; padding: 1rem !important; gap: 1rem !important; }
          .category-link { width: 100% !important; gap: 1rem !important; }
          
          .flowchart-node-wrapper { padding-left: 2rem !important; }
          .vertical-branch { left: 1rem !important; }
          .horizontal-branch { left: 1rem !important; width: 1rem !important; }
        }
      `}</style>
    </div>
  );
}
