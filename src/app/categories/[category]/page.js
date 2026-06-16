"use client";

import { useEffect, useState, use } from 'react';
import Link from 'next/link';
import { FileText, ArrowLeft, Loader2, AlertCircle, Eye, Download } from 'lucide-react';

export default function CategoryDetailsPage({ params }) {
  const resolvedParams = use(params);
  const categoryName = decodeURIComponent(resolvedParams.category);
  
  const [pdfs, setPdfs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchPdfs() {
      try {
        const res = await fetch(`/api/pdfs?category=${encodeURIComponent(categoryName)}`);
        const data = await res.json();
        
        if (!res.ok) throw new Error(data.error || 'Failed to fetch');
        
        setPdfs(data.pdfs || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchPdfs();
  }, [categoryName]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {/* Sleek Header */}
      <header className="glass-panel" style={{ position: 'sticky', top: 0, zIndex: 50, padding: '1rem 0' }}>
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--muted-foreground)', transition: 'color 0.2s', fontWeight: 500 }} onMouseEnter={e => e.currentTarget.style.color = 'var(--foreground)'} onMouseLeave={e => e.currentTarget.style.color = 'var(--muted-foreground)'}>
            <ArrowLeft size={20} />
            Back to Home
          </Link>
        </div>
      </header>

      <main className="container" style={{ padding: '4rem 1.5rem', flex: 1 }}>
        <div className="animate-fade-up" style={{ marginBottom: '4rem' }}>
          <h1 className="text-gradient" style={{ fontSize: '3.5rem', fontWeight: 800, marginBottom: '0.5rem', letterSpacing: '-0.02em' }}>
            {categoryName}
          </h1>
          <p style={{ color: 'var(--muted-foreground)', fontSize: '1.125rem' }}>Access and manage documents in this collection.</p>
        </div>

        {error && (
          <div className="animate-fade-up glass" style={{ background: 'rgba(239, 68, 68, 0.1)', borderColor: 'rgba(239, 68, 68, 0.2)', color: '#ef4444', padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <AlertCircle size={24} />
            <p>{error}</p>
          </div>
        )}

        <div className="animate-fade-up stagger-1" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '2rem' }}>
          {loading ? (
             [1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="glass skeleton" style={{ height: '180px' }}></div>
             ))
          ) : pdfs.length === 0 && !error ? (
            <div className="glass" style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '5rem 2rem' }}>
              <FileText size={64} color="var(--muted-foreground)" style={{ margin: '0 auto 1.5rem', opacity: 0.5 }} />
              <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>Folder is Empty</h3>
              <p style={{ color: 'var(--muted-foreground)' }}>Upload some PDF files to this folder in your GitHub repository.</p>
            </div>
          ) : (
            pdfs.map((pdf, index) => {
              const pdfUrl = `/api/pdf-content?path=${encodeURIComponent(pdf.path)}`;
              return (
                <div key={pdf.path} className="glass hover-card document-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', height: '100%', position: 'relative', animationDelay: `${index * 0.05}s` }}>
                  
                  {/* Document Header Accent */}
                  <div style={{ position: 'absolute', top: 0, left: '1.5rem', right: '1.5rem', height: '3px', background: 'var(--primary)', borderBottomLeftRadius: '4px', borderBottomRightRadius: '4px', opacity: 0.8 }}></div>

                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem', marginBottom: '2rem', marginTop: '0.5rem' }}>
                    <div style={{ background: 'rgba(239, 68, 68, 0.1)', padding: '0.75rem', borderRadius: '0.5rem' }}>
                      <FileText size={28} color="#ef4444" style={{ flexShrink: 0 }} />
                    </div>
                    <span style={{ fontSize: '1.125rem', fontWeight: 600, wordBreak: 'break-word', lineHeight: 1.4 }}>
                      {pdf.name.replace('.pdf', '')}
                    </span>
                  </div>
                  
                  <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ color: 'var(--muted-foreground)', fontSize: '0.875rem', fontWeight: 500, background: 'rgba(255,255,255,0.05)', padding: '0.25rem 0.5rem', borderRadius: '0.25rem' }}>
                      {(pdf.size / 1024 / 1024).toFixed(2)} MB
                    </span>
                    
                    <div className="doc-actions" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <a href={pdfUrl} download={pdf.name} className="doc-action-btn download-btn" title="Download directly" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0.5rem', borderRadius: '50%', background: 'rgba(255,255,255,0.05)', color: 'var(--foreground)', transition: 'all 0.2s' }}>
                        <Download size={18} />
                      </a>
                      <Link href={`/reader?path=${encodeURIComponent(pdf.path)}`} className="doc-action-btn read-btn" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'var(--primary)', color: 'var(--primary-foreground)', padding: '0.5rem 1rem', borderRadius: '999px', fontSize: '0.875rem', fontWeight: 600, transition: 'all 0.2s', boxShadow: '0 4px 14px 0 var(--primary-glow)' }}>
                        <Eye size={16} />
                        <span>Read</span>
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </main>

      {/* Internal Styles for hover actions */}
      <style>{`
        .document-card .doc-actions {
          transform: translateX(0);
        }
        .document-card .download-btn:hover {
          background: rgba(255,255,255,0.1) !important;
          color: var(--primary) !important;
        }
        .document-card .read-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px 0 var(--primary-glow) !important;
        }
      `}</style>
    </div>
  );
}
