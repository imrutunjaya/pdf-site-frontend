"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { FolderOpen, ArrowRight, ArrowLeft, Loader2, AlertCircle } from 'lucide-react';

export default function CategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchCategories() {
      try {
        const res = await fetch('/api/categories');
        const data = await res.json();
        
        if (!res.ok) throw new Error(data.error || 'Failed to fetch');
        
        setCategories(data.categories || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchCategories();
  }, []);

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
            All Collections
          </h1>
          <p style={{ color: 'var(--muted-foreground)', fontSize: '1.125rem' }}>Browse your entire secure document library.</p>
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
              <div key={i} className="glass skeleton" style={{ height: '100px' }}></div>
             ))
          ) : categories.length === 0 && !error ? (
            <div className="glass" style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '5rem 2rem' }}>
              <FolderOpen size={64} color="var(--muted-foreground)" style={{ margin: '0 auto 1.5rem', opacity: 0.5 }} />
              <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>No Folders Found</h3>
              <p style={{ color: 'var(--muted-foreground)' }}>Create folders in your GitHub repository to see them here.</p>
            </div>
          ) : (
            categories.map((cat, index) => (
              <Link key={cat.path} href={`/categories/${encodeURIComponent(cat.name)}`}>
                <div className="glass hover-card" style={{ padding: '2rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', animationDelay: `${index * 0.05}s` }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ background: 'rgba(59, 130, 246, 0.1)', padding: '0.75rem', borderRadius: '0.5rem' }}>
                      <FolderOpen size={28} color="var(--primary)" />
                    </div>
                    <span style={{ fontSize: '1.25rem', fontWeight: 600 }}>{cat.name}</span>
                  </div>
                  <ArrowRight size={20} color="var(--muted-foreground)" style={{ opacity: 0.5 }} />
                </div>
              </Link>
            ))
          )}
        </div>
      </main>
    </div>
  );
}
