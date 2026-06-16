"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Folder, ChevronRight, Loader2, AlertCircle } from 'lucide-react';

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
    <div className="container animate-fade-in" style={{ padding: '4rem 1.5rem', minHeight: '100vh' }}>
      <div style={{ marginBottom: '3rem' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '0.5rem' }}>Library Categories</h1>
        <p style={{ color: 'var(--muted-foreground)' }}>Browse your secure document collections.</p>
      </div>

      {loading && (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '4rem 0' }}>
          <Loader2 className="animate-spin" size={48} color="var(--primary)" style={{ animation: 'spin 1s linear infinite' }} />
          <style>{`@keyframes spin { 100% { transform: rotate(360deg); } }`}</style>
        </div>
      )}

      {error && (
        <div style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', padding: '1.5rem', borderRadius: 'var(--radius)', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <AlertCircle size={24} />
          <p>{error}</p>
        </div>
      )}

      {!loading && !error && categories.length === 0 && (
        <div className="glass" style={{ textAlign: 'center', padding: '4rem 2rem', borderRadius: 'var(--radius)' }}>
          <Folder size={48} color="var(--muted-foreground)" style={{ margin: '0 auto 1rem' }} />
          <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>No Categories Found</h3>
          <p style={{ color: 'var(--muted-foreground)' }}>Create folders in your GitHub repository to see them here.</p>
        </div>
      )}

      {!loading && !error && categories.length > 0 && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
          {categories.map((cat) => (
            <Link key={cat.path} href={`/categories/${encodeURIComponent(cat.name)}`}>
              <div className="glass" style={{ padding: '1.5rem', borderRadius: 'var(--radius)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', transition: 'all 0.2s', cursor: 'pointer' }}
                onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.borderColor = 'var(--primary)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.08)'; }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <Folder size={24} color="var(--primary)" />
                  <span style={{ fontSize: '1.125rem', fontWeight: 600 }}>{cat.name}</span>
                </div>
                <ChevronRight size={20} color="var(--muted-foreground)" />
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
