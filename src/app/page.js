import Link from 'next/link';
import { BookOpen, Shield, FolderOpen } from 'lucide-react';

export default function Home() {
  return (
    <main className="container animate-fade-in" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', padding: '4rem 1.5rem' }}>
      {/* Hero Section */}
      <section style={{ textAlign: 'center', marginBottom: '4rem', marginTop: '2rem' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(59, 130, 246, 0.1)', color: 'var(--primary)', padding: '0.5rem 1rem', borderRadius: '9999px', fontSize: '0.875rem', fontWeight: 600, marginBottom: '1.5rem' }}>
          <Shield size={16} />
          <span>Secure PDF Platform</span>
        </div>
        <h1 style={{ fontSize: '3.5rem', fontWeight: 800, letterSpacing: '-0.025em', marginBottom: '1.5rem', background: 'linear-gradient(to right, #fff, #a1a1aa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          Your Private Knowledge Base
        </h1>
        <p style={{ color: 'var(--muted-foreground)', fontSize: '1.125rem', maxWidth: '600px', margin: '0 auto', lineHeight: 1.6 }}>
          Access your categorized PDF documents securely directly from your GitHub repository. Fast, beautiful, and completely private.
        </p>
      </section>

      {/* Feature Grid */}
      <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', marginBottom: '4rem' }}>
        <div className="glass" style={{ padding: '2rem', borderRadius: 'var(--radius)', transition: 'transform 0.2s', cursor: 'default' }}>
          <FolderOpen size={32} color="var(--primary)" style={{ marginBottom: '1rem' }} />
          <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '0.5rem' }}>Categorized Storage</h3>
          <p style={{ color: 'var(--muted-foreground)', lineHeight: 1.5 }}>Files are perfectly organized using your repository's folder structure.</p>
        </div>
        <div className="glass" style={{ padding: '2rem', borderRadius: 'var(--radius)', transition: 'transform 0.2s', cursor: 'default' }}>
          <Shield size={32} color="var(--primary)" style={{ marginBottom: '1rem' }} />
          <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '0.5rem' }}>Highly Secure</h3>
          <p style={{ color: 'var(--muted-foreground)', lineHeight: 1.5 }}>Your GitHub Personal Access Token is hidden securely on the server-side.</p>
        </div>
        <div className="glass" style={{ padding: '2rem', borderRadius: 'var(--radius)', transition: 'transform 0.2s', cursor: 'default' }}>
          <BookOpen size={32} color="var(--primary)" style={{ marginBottom: '1rem' }} />
          <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '0.5rem' }}>Integrated Reader</h3>
          <p style={{ color: 'var(--muted-foreground)', lineHeight: 1.5 }}>Read your PDFs beautifully directly in your browser without downloading.</p>
        </div>
      </section>

      {/* Call to Action */}
      <section style={{ textAlign: 'center', marginTop: 'auto', paddingBottom: '2rem' }}>
        <Link href="/categories" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.75rem', background: 'var(--primary)', color: 'var(--primary-foreground)', padding: '1rem 2rem', borderRadius: 'var(--radius)', fontWeight: 600, fontSize: '1.125rem', transition: 'background 0.2s' }}>
          Browse Library
          <FolderOpen size={20} />
        </Link>
      </section>
    </main>
  );
}
