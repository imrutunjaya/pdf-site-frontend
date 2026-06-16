"use client";

import { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';
import { ArrowLeft, Loader2, Download, ChevronLeft, ChevronRight, ZoomIn, ZoomOut } from 'lucide-react';

// Setup pdf worker
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

export default function PdfReaderPage({ searchParams }) {
  const resolvedParams = use(searchParams);
  const path = resolvedParams.path;
  const router = useRouter();

  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [scale, setScale] = useState(1.0);
  const [windowWidth, setWindowWidth] = useState(1000);

  useEffect(() => {
    setWindowWidth(window.innerWidth);
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
    setPageNumber(1);
  };

  const changePage = (offset) => {
    setPageNumber(prevPageNumber => Math.min(Math.max(1, prevPageNumber + offset), numPages));
  };

  const previousPage = () => changePage(-1);
  const nextPage = () => changePage(1);

  if (!path) {
    return (
      <div className="container" style={{ padding: '4rem 1.5rem', textAlign: 'center' }}>
        <h2>Invalid PDF Path</h2>
        <button onClick={() => router.back()} style={{ marginTop: '1rem', color: 'var(--primary)' }}>Go Back</button>
      </div>
    );
  }

  const pdfUrl = `/api/pdf-content?path=${encodeURIComponent(path)}`;
  const fileName = path.split('/').pop();

  // Adjust scale based on screen width
  const renderScale = windowWidth < 768 ? Math.min(scale, windowWidth / 600) : scale;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', background: '#000' }}>
      {/* Top Bar */}
      <header className="glass" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem 1.5rem', zIndex: 10 }}>
        <button onClick={() => router.back()} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--foreground)', transition: 'color 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.color = 'var(--primary)'} onMouseLeave={(e) => e.currentTarget.style.color = 'var(--foreground)'}>
          <ArrowLeft size={20} />
          <span style={{ fontWeight: 500, display: windowWidth < 600 ? 'none' : 'inline' }}>Back</span>
        </button>

        <h1 style={{ fontSize: '1rem', fontWeight: 600, margin: '0 1rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '40%' }}>
          {fileName}
        </h1>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', background: 'rgba(255,255,255,0.1)', borderRadius: 'var(--radius)', padding: '0.25rem' }}>
            <button onClick={() => setScale(s => Math.max(0.5, s - 0.1))} style={{ padding: '0.5rem', borderRadius: 'var(--radius)' }} title="Zoom Out">
              <ZoomOut size={18} />
            </button>
            <span style={{ fontSize: '0.875rem', padding: '0 0.5rem' }}>{Math.round(scale * 100)}%</span>
            <button onClick={() => setScale(s => Math.min(2.5, s + 0.1))} style={{ padding: '0.5rem', borderRadius: 'var(--radius)' }} title="Zoom In">
              <ZoomIn size={18} />
            </button>
          </div>

          <a href={pdfUrl} download={fileName} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'var(--primary)', color: 'var(--primary-foreground)', padding: '0.5rem 1rem', borderRadius: 'var(--radius)', fontSize: '0.875rem', fontWeight: 600 }}>
            <Download size={16} />
            <span style={{ display: windowWidth < 600 ? 'none' : 'inline' }}>Download</span>
          </a>
        </div>
      </header>

      {/* PDF Viewer */}
      <main style={{ flex: 1, overflow: 'auto', display: 'flex', justifyContent: 'center', padding: '2rem 1rem' }}>
        <Document
          file={pdfUrl}
          onLoadSuccess={onDocumentLoadSuccess}
          loading={
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', marginTop: '4rem' }}>
              <Loader2 className="animate-spin" size={48} color="var(--primary)" />
              <p style={{ color: 'var(--muted-foreground)' }}>Loading document securely...</p>
            </div>
          }
          error={
            <div style={{ color: '#ef4444', marginTop: '4rem', textAlign: 'center' }}>
              <p>Failed to load PDF.</p>
              <p style={{ fontSize: '0.875rem', marginTop: '0.5rem', color: 'var(--muted-foreground)' }}>Check if the file is valid and your token has access.</p>
            </div>
          }
        >
          <Page 
            pageNumber={pageNumber} 
            scale={renderScale} 
            renderTextLayer={true}
            renderAnnotationLayer={true}
            className="pdf-page-shadow"
          />
        </Document>
      </main>

      {/* Bottom Controls */}
      <footer className="glass" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem', gap: '1.5rem', zIndex: 10 }}>
        <button 
          onClick={previousPage} 
          disabled={pageNumber <= 1}
          style={{ padding: '0.5rem', background: pageNumber <= 1 ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.1)', color: pageNumber <= 1 ? 'var(--muted-foreground)' : 'var(--foreground)', borderRadius: '50%', cursor: pageNumber <= 1 ? 'not-allowed' : 'pointer' }}
        >
          <ChevronLeft size={24} />
        </button>
        
        <span style={{ fontSize: '0.875rem', fontWeight: 500 }}>
          Page {pageNumber || (numPages ? 1 : '--')} of {numPages || '--'}
        </span>
        
        <button 
          onClick={nextPage} 
          disabled={pageNumber >= numPages}
          style={{ padding: '0.5rem', background: pageNumber >= numPages ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.1)', color: pageNumber >= numPages ? 'var(--muted-foreground)' : 'var(--foreground)', borderRadius: '50%', cursor: pageNumber >= numPages ? 'not-allowed' : 'pointer' }}
        >
          <ChevronRight size={24} />
        </button>
      </footer>
      
      <style>{`
        .pdf-page-shadow canvas {
          box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.5), 0 8px 10px -6px rgba(0, 0, 0, 0.5) !important;
          border-radius: 4px;
        }
      `}</style>
    </div>
  );
}
