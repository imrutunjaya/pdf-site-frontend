"use client";

import { useEffect, useState, use, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import { motion, AnimatePresence } from 'framer-motion';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';
import { ArrowLeft, Loader2, Download, ChevronLeft, ChevronRight, ZoomIn, ZoomOut, Sun, Moon, Search, BookOpen, Music, Maximize, X, FileText, MoreVertical } from 'lucide-react';

const Document = dynamic(() => import('react-pdf').then(mod => mod.Document), { ssr: false });
const Page = dynamic(() => import('react-pdf').then(mod => mod.Page), { ssr: false });

export default function PdfReaderPage({ searchParams }) {
  const resolvedParams = use(searchParams);
  const path = resolvedParams.path;
  const router = useRouter();

  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [scale, setScale] = useState(1.0);
  const [windowWidth, setWindowWidth] = useState(1200);
  const [isLoaded, setIsLoaded] = useState(false);
  const [direction, setDirection] = useState(0);
  const [isDarkMode, setIsDarkMode] = useState(true);
  
  const [pdfData, setPdfData] = useState(null);
  const [isEncrypted, setIsEncrypted] = useState(false);
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState(null);
  const [isFetching, setIsFetching] = useState(false);
  
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showFsClose, setShowFsClose] = useState(true);
  const [showCoverPage, setShowCoverPage] = useState(false);
  
  const containerRef = useRef(null);
  const fsTimeoutRef = useRef(null);

  useEffect(() => {
    setWindowWidth(window.innerWidth);
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    
    import('react-pdf').then(({ pdfjs }) => {
      pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;
    });

    const savedCover = localStorage.getItem('repo-pdf-cover');
    if (savedCover) setShowCoverPage(savedCover === 'true');

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowLeft') changePage(-1);
      else if (e.key === 'ArrowRight') changePage(1);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [numPages]); // changePage uses functional state updates

  // Fullscreen listener
  useEffect(() => {
    const handleFsChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFsChange);
    return () => document.removeEventListener('fullscreenchange', handleFsChange);
  }, []);

  // Mouse move for auto-hiding fullscreen close button
  const handleMouseMove = useCallback(() => {
    if (isFullscreen) {
      setShowFsClose(true);
      if (fsTimeoutRef.current) clearTimeout(fsTimeoutRef.current);
      fsTimeoutRef.current = setTimeout(() => {
        setShowFsClose(false);
      }, 2000);
    }
  }, [isFullscreen]);

  useEffect(() => {
    if (isFullscreen) {
      setShowFsClose(true);
      fsTimeoutRef.current = setTimeout(() => setShowFsClose(false), 2000);
    } else {
      if (fsTimeoutRef.current) clearTimeout(fsTimeoutRef.current);
    }
  }, [isFullscreen]);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen().catch(err => {
        console.error(`Error attempting to enable full-screen mode: ${err.message}`);
      });
    } else {
      document.exitFullscreen();
    }
  };

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
    setPageNumber(1);
    setIsLoaded(true);
  };

  const changePage = (offset) => {
    const isSingle = window.innerWidth < 800;
    if (isSingle) {
      changeSinglePage(offset);
      return;
    }
    setDirection(offset > 0 ? 1 : -1);
    setPageNumber(prev => {
      if (showCoverPage) {
        let currentSpread = prev === 1 ? 0 : Math.floor(prev / 2);
        let nextSpread = currentSpread + offset;
        if (nextSpread <= 0) return 1;
        let nextLeftPage = nextSpread * 2;
        if (nextLeftPage > numPages) return prev;
        return nextLeftPage;
      } else {
        let next = prev + (offset * 2);
        if (next < 1) return 1;
        if (next > numPages) return prev;
        // Force odd number for left page of spread
        if (next % 2 === 0) next -= 1;
        return next;
      }
    });
  };

  // Dedicated single page advance for mobile/fullscreen clicks
  const changeSinglePage = (offset) => {
    setDirection(offset > 0 ? 1 : -1);
    setPageNumber(prev => {
      let next = prev + offset;
      if (next < 1) return 1;
      if (next > numPages) return prev;
      return next;
    });
  };

  const fetchPdf = useCallback(async (pwd = '') => {
    setIsFetching(true);
    setErrorMsg(null);
    try {
      let url = `/api/pdf-content?path=${encodeURIComponent(path)}`;
      if (pwd) url += `&password=${encodeURIComponent(pwd)}`;
      const res = await fetch(url);
      
      if (res.status === 403) {
        setIsEncrypted(true);
        setIsFetching(false);
        return;
      }
      if (res.status === 401) {
        setErrorMsg('Incorrect password');
        setIsEncrypted(true);
        setIsFetching(false);
        return;
      }
      if (!res.ok) {
        throw new Error('Failed to load PDF');
      }
      
      const blob = await res.blob();
      setPdfData(URL.createObjectURL(blob));
      setIsEncrypted(false);
    } catch (err) {
      setErrorMsg(err.message);
    } finally {
      setIsFetching(false);
    }
  }, [path]);

  useEffect(() => {
    if (path) fetchPdf();
  }, [path, fetchPdf]);

  if (!path) {
    return (
      <div style={{ padding: '4rem 1.5rem', textAlign: 'center', background: '#f3f4f6', minHeight: '100vh', color: '#111827' }}>
        <h2>Invalid PDF Path</h2>
        <button onClick={() => router.back()} style={{ marginTop: '1rem', color: '#3b82f6' }}>Go Back</button>
      </div>
    );
  }

  const fileName = path.split('/').pop().replace('.pdf', '');

  if (isEncrypted && !pdfData) {
    return (
      <div style={{ padding: '4rem 1.5rem', textAlign: 'center', background: '#050505', minHeight: '100vh', color: '#fff', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', padding: '3rem', borderRadius: '1rem', backdropFilter: 'blur(10px)', maxWidth: '400px', width: '100%' }}>
          <div style={{ width: '64px', height: '64px', background: 'rgba(239,68,68,0.1)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem', color: '#ef4444' }}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
          </div>
          <h2 style={{ margin: '0 0 1rem 0' }}>Files are encrypted</h2>
          <p style={{ color: '#9ca3af', fontSize: '0.9rem', marginBottom: '2rem' }}>Contact @Mrutunjaya for access or enter password below.</p>
          <form onSubmit={(e) => { e.preventDefault(); fetchPdf(password); }} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <input 
              type="password" 
              placeholder="Enter password..." 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{ padding: '0.75rem 1rem', borderRadius: '0.5rem', border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(0,0,0,0.5)', color: '#fff', outline: 'none' }}
              autoFocus
            />
            {errorMsg && <p style={{ color: '#ef4444', fontSize: '0.8rem', margin: 0 }}>{errorMsg}</p>}
            <button type="submit" disabled={isFetching} style={{ padding: '0.75rem', background: '#3b82f6', color: '#fff', border: 'none', borderRadius: '0.5rem', fontWeight: 600, cursor: isFetching ? 'not-allowed' : 'pointer', opacity: isFetching ? 0.7 : 1 }}>
              {isFetching ? 'Decrypting...' : 'Decrypt & View'}
            </button>
            <button type="button" onClick={() => router.back()} style={{ padding: '0.75rem', background: 'transparent', color: '#9ca3af', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '0.5rem', fontWeight: 600, cursor: 'pointer' }}>
              Go Back
            </button>
          </form>
        </div>
      </div>
    );
  }

  const isSinglePageMode = windowWidth < 800;

  const swipeConfidenceThreshold = 10000;
  const swipePower = (offset, velocity) => Math.abs(offset) * velocity;

  const pageVariants = {
    enter: (direction) => ({
      x: direction > 0 ? '100%' : '-100%',
      opacity: 0,
      rotateY: direction > 0 ? 45 : -45,
      scale: 0.9,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
      rotateY: 0,
      scale: 1,
    },
    exit: (direction) => ({
      zIndex: 0,
      x: direction < 0 ? '100%' : '-100%',
      opacity: 0,
      rotateY: direction < 0 ? 45 : -45,
      scale: 0.9,
    })
  };

  return (
    <div 
      ref={containerRef}
      className={isDarkMode ? "dark-reader-theme" : "light-reader-theme"} 
      onMouseMove={handleMouseMove}
      style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        height: '100vh', 
        width: '100vw', 
        background: isFullscreen ? '#000' : (isDarkMode ? '#111827' : (isSinglePageMode ? '#e5e7eb' : '#f3f4f6')), 
        color: isDarkMode ? '#f3f4f6' : '#111827', 
        overflow: 'hidden', 
        fontFamily: 'sans-serif' 
      }}
    >
      
      {/* Top Header Bar - Hidden in Fullscreen */}
      {!isFullscreen && (
        <header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 1.5rem', height: '70px', background: isDarkMode ? '#1f2937' : '#ffffff', borderBottom: isDarkMode ? '1px solid #374151' : '1px solid #e5e7eb', zIndex: 50, flexShrink: 0 }}>
          
          {/* Left: Back & Title Info */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '2rem', flex: 1 }}>
            <button onClick={() => router.back()} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: isDarkMode ? '#e5e7eb' : '#374151', fontWeight: 600, fontSize: '0.9rem' }}>
              <ArrowLeft size={18} strokeWidth={2.5} />
              <span>Back to Library</span>
            </button>

            {!isSinglePageMode && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ width: '32px', height: '40px', background: '#d6d3d1', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: 'inset 2px 0 0 rgba(0,0,0,0.1)' }}>
                  <FileText size={16} color="#78716c" />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <span style={{ fontSize: '1rem', fontWeight: 600, color: isDarkMode ? '#f3f4f6' : '#111827', maxWidth: '250px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {fileName}
                  </span>
                  <span style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                    Unknown Author
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Center: Pagination Pill */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1 }}>
            <div style={{ background: isDarkMode ? '#374151' : '#e5e7eb', padding: '0.4rem 1rem', borderRadius: '999px', fontSize: '0.85rem', fontWeight: 500, color: isDarkMode ? '#e5e7eb' : '#374151', minWidth: '140px', textAlign: 'center' }}>
              {numPages ? `Pages ${pageNumber}${!isSinglePageMode && pageNumber + 1 <= numPages ? '-' + (pageNumber + 1) : ''} of ${numPages}` : 'Loading...'}
            </div>
          </div>

          {/* Right: Action Icons */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flex: 1, justifyContent: 'flex-end', color: isDarkMode ? '#e5e7eb' : '#4b5563' }}>
            <button title="Toggle Theme" className="icon-btn" onClick={() => setIsDarkMode(!isDarkMode)}>
              {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <div style={{ width: '1px', height: '24px', background: isDarkMode ? '#4b5563' : '#e5e7eb', margin: '0 0.25rem' }}></div>
            <button title="Zoom Out" className="icon-btn" onClick={() => setScale(s => Math.max(0.2, s - 0.1))}><ZoomOut size={18} /></button>
            <button title="Zoom In" className="icon-btn" onClick={() => setScale(s => s + 0.1)}><ZoomIn size={18} /></button>
            
            {!isSinglePageMode && (
              <>
                <button title="Layout" className="icon-btn"><BookOpen size={18} /></button>
                <div style={{ width: '1px', height: '24px', background: isDarkMode ? '#4b5563' : '#e5e7eb', margin: '0 0.25rem' }}></div>
              </>
            )}
            
            <a href={pdfData || `/api/pdf-content?path=${encodeURIComponent(path)}`} download={fileName} title="Download" className="icon-btn" style={{ display: 'flex', alignItems: 'center' }}>
              <Download size={18} />
            </a>
            <button title="Fullscreen" className="icon-btn" onClick={toggleFullscreen}><Maximize size={18} /></button>
          </div>
        </header>
      )}

      {/* Main Content Area */}
      <main style={{ flex: 1, position: 'relative', overflow: 'hidden', padding: '0', background: isFullscreen ? '#000' : 'transparent', display: 'flex', flexDirection: 'column' }}>
        


        {/* Floating Side Nav - Left (Hidden in Mobile/Fullscreen for clean look, replaced by click areas) */}
        {!isSinglePageMode && !isFullscreen && (
          <button 
            onClick={() => changePage(-1)}
            disabled={pageNumber <= 1}
            style={{ position: 'absolute', left: '2rem', top: '50%', transform: 'translateY(-50%)', width: '48px', height: '48px', background: isDarkMode ? '#1f2937' : '#ffffff', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: pageNumber <= 1 ? (isDarkMode ? '#4b5563' : '#d1d5db') : (isDarkMode ? '#e5e7eb' : '#374151'), boxShadow: '0 4px 12px rgba(0,0,0,0.08)', cursor: pageNumber <= 1 ? 'not-allowed' : 'pointer', zIndex: 40, border: isDarkMode ? '1px solid #374151' : '1px solid #f3f4f6' }}
          >
            <ChevronLeft size={24} strokeWidth={1.5} />
          </button>
        )}

        {/* Floating Side Nav - Right (Hidden in Mobile/Fullscreen) */}
        {!isSinglePageMode && !isFullscreen && (
          <button 
            onClick={() => changePage(1)}
            disabled={pageNumber >= numPages && (isSinglePageMode || pageNumber + 1 >= numPages)}
            style={{ position: 'absolute', right: '2rem', top: '50%', transform: 'translateY(-50%)', width: '48px', height: '48px', background: isDarkMode ? '#1f2937' : '#ffffff', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: (pageNumber >= numPages) ? (isDarkMode ? '#4b5563' : '#d1d5db') : (isDarkMode ? '#e5e7eb' : '#374151'), boxShadow: '0 4px 12px rgba(0,0,0,0.08)', cursor: (pageNumber >= numPages) ? 'not-allowed' : 'pointer', zIndex: 40, border: isDarkMode ? '1px solid #374151' : '1px solid #f3f4f6' }}
          >
            <ChevronRight size={24} strokeWidth={1.5} />
          </button>
        )}

        {/* Two-Page Spread Container */}
        <div style={{ height: '100%', width: '100%', overflow: 'auto', display: 'flex', justifyContent: 'center', alignItems: isSinglePageMode ? 'flex-start' : 'center' }}>
          <div style={{ transition: 'opacity 0.4s ease', opacity: isLoaded ? 1 : 0, width: isSinglePageMode ? '100%' : 'auto', display: 'flex', justifyContent: 'center' }}>
            <Document
              file={pdfData}
              onLoadSuccess={onDocumentLoadSuccess}
              loading={
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', marginTop: '20vh' }}>
                  <Loader2 className="animate-spin" size={48} color="#3b82f6" />
                  <p style={{ color: '#6b7280' }}>Loading document...</p>
                </div>
              }
              error={
                <div style={{ color: '#ef4444', marginTop: '20vh', textAlign: 'center' }}>
                  <p>Failed to load PDF</p>
                </div>
              }
            >
              <div style={{ perspective: '1500px', width: '100%', display: 'flex', justifyContent: 'center' }}>
                <AnimatePresence initial={false} custom={direction} mode="popLayout">
                  <motion.div 
                    key={pageNumber}
                    custom={direction}
                    variants={pageVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{ type: 'tween', duration: 0.25, ease: 'easeInOut' }}
                    drag="x"
                    dragConstraints={{ left: 0, right: 0 }}
                    dragElastic={0.2}
                    onDragEnd={(e, { offset, velocity }) => {
                      const swipe = swipePower(offset.x, velocity.x);
                      if (swipe < -swipeConfidenceThreshold) {
                        changePage(1);
                      } else if (swipe > swipeConfidenceThreshold) {
                        changePage(-1);
                      }
                    }}
                    style={{ 
                      display: 'flex', 
                      gap: isSinglePageMode ? '0' : '2px', 
                      alignItems: 'center', 
                      justifyContent: 'center',
                      width: isSinglePageMode ? '100%' : 'auto',
                      transformStyle: 'preserve-3d'
                    }}
                  >
                    {/* Left Page (or Single Page) */}
                    <div className={"book-page " + (isSinglePageMode ? 'mobile-page' : '') + (showCoverPage && pageNumber === 1 && !isSinglePageMode ? ' cover-page' : '')} onClick={() => isSinglePageMode && changeSinglePage(1)}>
                      <Page 
                        pageNumber={pageNumber} 
                        scale={scale} 
                        width={isSinglePageMode ? windowWidth : undefined}
                        height={isFullscreen && !isSinglePageMode ? window.innerHeight : undefined}
                        renderTextLayer={true}
                        renderAnnotationLayer={true}
                        devicePixelRatio={typeof window !== 'undefined' ? Math.max(window.devicePixelRatio || 1, 2) : 2}
                      />
                    </div>
                    
                    {/* Right Page (only if not single page mode and within bounds) */}
                    {!isSinglePageMode && pageNumber + 1 <= numPages && !(showCoverPage && pageNumber === 1) && (
                      <div className="book-page">
                        <Page 
                          pageNumber={pageNumber + 1} 
                          scale={scale} 
                          height={isFullscreen && !isSinglePageMode ? window.innerHeight : undefined}
                          renderTextLayer={true}
                          renderAnnotationLayer={true}
                          devicePixelRatio={typeof window !== 'undefined' ? Math.max(window.devicePixelRatio || 1, 2) : 2}
                        />
                      </div>
                    )}
                  </motion.div>
                </AnimatePresence>
              </div>
            </Document>
          </div>
        </div>
      </main>
      
      <style>{`
        /* Overrides to ensure the reader stays light regardless of global dark mode */
        .light-reader-theme *, .dark-reader-theme * {
          box-sizing: border-box;
        }
        .icon-btn {
          background: transparent;
          border: none;
          cursor: pointer;
          color: inherit;
          transition: color 0.2s;
        }
        .light-reader-theme .icon-btn:hover { color: #111827; }
        .dark-reader-theme .icon-btn:hover { color: #fff; }
        
        .book-page canvas {
          background: white;
          box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.05) !important;
          border-radius: 4px;
        }

        /* Dark Mode PDF Inversion */
        .dark-reader-theme .book-page canvas, .dark-reader-theme .react-pdf__Page__textContent {
          filter: invert(1) hue-rotate(180deg);
        }
        .dark-reader-theme .react-pdf__Page__annotations {
          filter: invert(1) hue-rotate(180deg);
        }

        /* Allow Copying Text */
        .react-pdf__Page__textContent {
          user-select: text !important;
          cursor: text !important;
        }
        /* Style the gap between pages to look like a book spine crease */
        .book-page:first-child:not(.mobile-page):not(.cover-page) canvas {
          border-top-right-radius: 0;
          border-bottom-right-radius: 0;
        }
        .book-page:last-child:not(.mobile-page):not(.cover-page) canvas {
          border-top-left-radius: 0;
          border-bottom-left-radius: 0;
        }
        /* Mobile single page full cover without borders */
        .book-page.mobile-page canvas {
          border-radius: 0 !important;
          box-shadow: none !important;
          max-width: 100vw;
        }
        .book-page.cover-page canvas {
          border-radius: 4px !important;
        }
      `}</style>
    </div>
  );
}
