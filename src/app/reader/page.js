"use client";

import { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';
import { ArrowLeft, Loader2, Download, ChevronLeft, ChevronRight, ZoomIn, Sun, Search, BookOpen, Music, Maximize, X, FileText, MoreVertical } from 'lucide-react';

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

  useEffect(() => {
    setWindowWidth(window.innerWidth);
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    
    import('react-pdf').then(({ pdfjs }) => {
      pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;
    });

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
    setPageNumber(1);
    setIsLoaded(true);
  };

  const changePage = (offset) => {
    setPageNumber(prev => {
      let next = prev + (offset * 2);
      if (next < 1) return 1;
      if (next > numPages) return prev;
      // Force odd number for left page of spread
      if (next % 2 === 0) next -= 1;
      return next;
    });
  };

  if (!path) {
    return (
      <div style={{ padding: '4rem 1.5rem', textAlign: 'center', background: '#f3f4f6', minHeight: '100vh', color: '#111827' }}>
        <h2>Invalid PDF Path</h2>
        <button onClick={() => router.back()} style={{ marginTop: '1rem', color: '#3b82f6' }}>Go Back</button>
      </div>
    );
  }

  const pdfUrl = `/api/pdf-content?path=${encodeURIComponent(path)}`;
  const fileName = path.split('/').pop().replace('.pdf', '');

  // Auto scale based on width to fit two pages side by side
  // Typical PDF page aspect ratio is ~1:1.4
  // We want two pages to fit inside windowWidth - 200px
  const renderScale = windowWidth < 1000 ? Math.min(scale, windowWidth / 1200) : scale;
  const isSinglePageMode = windowWidth < 800;

  return (
    <div className="light-reader-theme" style={{ display: 'flex', flexDirection: 'column', height: '100vh', width: '100vw', background: '#f3f4f6', color: '#111827', overflow: 'hidden', fontFamily: 'sans-serif' }}>
      
      {/* Top Header Bar */}
      <header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 1.5rem', height: '70px', background: '#ffffff', borderBottom: '1px solid #e5e7eb', zIndex: 50, flexShrink: 0 }}>
        
        {/* Left: Back & Title Info */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '2rem', flex: 1 }}>
          <button onClick={() => router.back()} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#374151', fontWeight: 600, fontSize: '0.9rem' }}>
            <ArrowLeft size={18} strokeWidth={2.5} />
            <span>Back to Library</span>
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ width: '32px', height: '40px', background: '#d6d3d1', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: 'inset 2px 0 0 rgba(0,0,0,0.1)' }}>
              <FileText size={16} color="#78716c" />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontSize: '1rem', fontWeight: 600, color: '#111827', maxWidth: '300px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {fileName}
              </span>
              <span style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                Unknown Author
              </span>
            </div>
          </div>
        </div>

        {/* Center: Pagination Pill */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1, position: 'relative' }}>
          <div style={{ background: '#e5e7eb', padding: '0.4rem 1rem', borderRadius: '999px', fontSize: '0.85rem', fontWeight: 500, color: '#374151', minWidth: '140px', textAlign: 'center' }}>
            {numPages ? \`Pages \${pageNumber}\${!isSinglePageMode && pageNumber + 1 <= numPages ? \`-\${pageNumber + 1}\` : ''} of \${numPages}\` : 'Loading...'}
          </div>
          {/* Close 'X' overlapping the document area */}
          <button onClick={() => router.back()} style={{ position: 'absolute', top: '100%', left: '50%', transform: 'translate(-50%, -50%)', width: '40px', height: '40px', background: '#374151', borderRadius: '50%', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '4px solid #f3f4f6', cursor: 'pointer', zIndex: 60, transition: 'background 0.2s' }} onMouseEnter={e => e.currentTarget.style.background = '#1f2937'} onMouseLeave={e => e.currentTarget.style.background = '#374151'}>
            <X size={20} />
          </button>
        </div>

        {/* Right: Action Icons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', flex: 1, justifyContent: 'flex-end', color: '#4b5563' }}>
          <button title="Theme" className="icon-btn"><Sun size={18} /></button>
          <button title="Search" className="icon-btn"><Search size={18} /></button>
          <button title="Zoom In" className="icon-btn" onClick={() => setScale(s => s + 0.1)}><ZoomIn size={18} /></button>
          <button title="Layout" className="icon-btn"><BookOpen size={18} /></button>
          
          <div style={{ width: '1px', height: '24px', background: '#e5e7eb', margin: '0 0.25rem' }}></div>
          
          <button className="icon-btn" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: '#f3f4f6', padding: '0.4rem 0.75rem', borderRadius: '999px', color: '#374151', fontSize: '0.85rem', fontWeight: 500 }}>
            <Music size={16} />
            <span>No Music</span>
          </button>
          
          <a href={pdfUrl} download={fileName} title="Download" className="icon-btn" style={{ display: 'flex', alignItems: 'center' }}>
            <Download size={18} />
          </a>
          <button title="Fullscreen" className="icon-btn"><Maximize size={18} /></button>
        </div>
      </header>

      {/* Main Content Area */}
      <main style={{ flex: 1, position: 'relative', overflow: 'hidden', padding: '3rem 0' }}>
        
        {/* Floating Side Nav - Left */}
        <button 
          onClick={() => changePage(-1)}
          disabled={pageNumber <= 1}
          style={{ position: 'absolute', left: '2rem', top: '50%', transform: 'translateY(-50%)', width: '48px', height: '48px', background: '#ffffff', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: pageNumber <= 1 ? '#d1d5db' : '#374151', boxShadow: '0 4px 12px rgba(0,0,0,0.08)', cursor: pageNumber <= 1 ? 'not-allowed' : 'pointer', zIndex: 40, border: '1px solid #f3f4f6' }}
        >
          <ChevronLeft size={24} strokeWidth={1.5} />
        </button>

        {/* Floating Settings - Top Left (like the image) */}
        <button style={{ position: 'absolute', left: '2rem', top: '2rem', width: '40px', height: '40px', background: '#ffffff', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#374151', boxShadow: '0 4px 12px rgba(0,0,0,0.08)', zIndex: 40, border: '1px solid #f3f4f6' }}>
          <MoreVertical size={20} strokeWidth={1.5} />
        </button>

        {/* Floating Side Nav - Right */}
        <button 
          onClick={() => changePage(1)}
          disabled={pageNumber >= numPages && (isSinglePageMode || pageNumber + 1 >= numPages)}
          style={{ position: 'absolute', right: '2rem', top: '50%', transform: 'translateY(-50%)', width: '48px', height: '48px', background: '#ffffff', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: (pageNumber >= numPages) ? '#d1d5db' : '#374151', boxShadow: '0 4px 12px rgba(0,0,0,0.08)', cursor: (pageNumber >= numPages) ? 'not-allowed' : 'pointer', zIndex: 40, border: '1px solid #f3f4f6' }}
        >
          <ChevronRight size={24} strokeWidth={1.5} />
        </button>

        {/* Two-Page Spread Container */}
        <div style={{ height: '100%', width: '100%', overflow: 'auto', display: 'flex', justifyContent: 'center', alignItems: 'flex-start' }}>
          <div style={{ transition: 'opacity 0.4s ease', opacity: isLoaded ? 1 : 0 }}>
            <Document
              file={pdfUrl}
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
              <div style={{ display: 'flex', gap: '2px', alignItems: 'center', justifyContent: 'center' }}>
                {/* Left Page */}
                <div className="book-page">
                  <Page 
                    pageNumber={pageNumber} 
                    scale={renderScale} 
                    renderTextLayer={true}
                    renderAnnotationLayer={true}
                  />
                </div>
                
                {/* Right Page (only if not single page mode and within bounds) */}
                {!isSinglePageMode && pageNumber + 1 <= numPages && (
                  <div className="book-page">
                    <Page 
                      pageNumber={pageNumber + 1} 
                      scale={renderScale} 
                      renderTextLayer={true}
                      renderAnnotationLayer={true}
                    />
                  </div>
                )}
              </div>
            </Document>
          </div>
        </div>
      </main>
      
      <style>{`
        /* Overrides to ensure the reader stays light regardless of global dark mode */
        .light-reader-theme * {
          box-sizing: border-box;
        }
        .icon-btn {
          background: transparent;
          border: none;
          cursor: pointer;
          color: inherit;
          transition: color 0.2s;
        }
        .icon-btn:hover {
          color: #111827;
        }
        .book-page canvas {
          background: white;
          box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.05) !important;
          border-radius: 4px;
        }
        /* Style the gap between pages to look like a book spine crease */
        .book-page:first-child canvas {
          border-top-right-radius: 0;
          border-bottom-right-radius: 0;
        }
        .book-page:last-child canvas {
          border-top-left-radius: 0;
          border-bottom-left-radius: 0;
        }
      `}</style>
    </div>
  );
}
