"use client";

import { useEffect, useState, use } from 'react';
import Link from 'next/link';
import { FileText, ArrowLeft, Loader2, AlertCircle, Eye } from 'lucide-react';

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
    <div className="container animate-fade-in" style={{ padding: '4rem 1.5rem', minHeight: '100vh' }}>
      <div style={{ marginBottom: '3rem' }}>
        <Link href="/categories" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: 'var(--muted-foreground)', marginBottom: '1.5rem', transition: 'color 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.color = 'var(--foreground)'} onMouseLeave={(e) => e.currentTarget.style.color = 'var(--muted-foreground)'}>
          <ArrowLeft size={20} />
          <span>Back to Categories</span>
        </Link>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          {categoryName}
        </h1>
        <p style={{ color: 'var(--muted-foreground)' }}>Select a PDF to read or download.</p>
      </div>

      {loading && (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '4rem 0' }}>
          <Loader2 className="animate-spin" size={48} color="var(--primary)" style={{ animation: 'spin 1s linear infinite' }} />
        </div>
      )}

      {error && (
        <div style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', padding: '1.5rem', borderRadius: 'var(--radius)', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <AlertCircle size={24} />
          <p>{error}</p>
        </div>
      )}

      {!loading && !error && pdfs.length === 0 && (
        <div className="glass" style={{ textAlign: 'center', padding: '4rem 2rem', borderRadius: 'var(--radius)' }}>
          <FileText size={48} color="var(--muted-foreground)" style={{ margin: '0 auto 1rem' }} />
          <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>No PDFs Found</h3>
          <p style={{ color: 'var(--muted-foreground)' }}>Upload some PDF files to this folder in your GitHub repository.</p>
        </div>
      )}

      {!loading && !error && pdfs.length > 0 && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
          {pdfs.map((pdf) => (
             <Link key={pdf.path} href={`/reader?path=${encodeURIComponent(pdf.path)}`}>
              <div className="glass" style={{ padding: '1.5rem', borderRadius: 'var(--radius)', transition: 'all 0.2s', cursor: 'pointer', display: 'flex', flexDirection: 'column', height: '100%' }}
                onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.borderColor = 'var(--primary)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.08)'; }}
              >
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem', marginBottom: '1.5rem' }}>
                  <FileText size={32} color="#f87171" style={{ flexShrink: 0 }} />
                  <span style={{ fontSize: '1.125rem', fontWeight: 600, wordBreak: 'break-word', lineHeight: 1.4 }}>
                    {pdf.name.replace('.pdf', '')}
                  </span>
                </div>
                
                <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'var(--muted-foreground)', fontSize: '0.875rem' }}>
                  <span>{(pdf.size / 1024 / 1024).toFixed(2)} MB</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--primary)' }}>
                    <Eye size={16} />
                    <span>Read</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
