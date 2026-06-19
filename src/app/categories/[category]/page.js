"use client";

import { useEffect, useState, use, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { FileText, ArrowLeft, Loader2, AlertCircle, Eye, Download, FolderOpen, AlertTriangle, Upload, Image as ImageIcon, FileCode } from 'lucide-react';
import { motion } from 'framer-motion';

function CategoryContent({ params }) {
  const resolvedParams = use(params);
  const searchParams = useSearchParams();
  const categoryName = decodeURIComponent(resolvedParams.category);
  const categoryPath = searchParams.get('path') || categoryName;
  
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => setMousePos({ x: e.clientX, y: e.clientY });
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const fetchFiles = async () => {
    try {
      const res = await fetch(`/api/pdfs?category=${encodeURIComponent(categoryPath)}`);
      const data = await res.json();
      
      if (!res.ok) throw new Error(data.error || 'Failed to fetch');
      
      setFiles(data.pdfs || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFiles();
  }, [categoryPath]);

  const handleUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError(null);

    try {
      const reader = new FileReader();
      reader.onload = async (event) => {
        const base64Content = event.target.result.split(',')[1];
        
        const res = await fetch('/api/upload', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            path: `${categoryPath}/${file.name}`,
            content: base64Content,
          }),
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Upload failed');
        
        // Refresh files list
        fetchFiles();
      };
      reader.readAsDataURL(file);
    } catch (err) {
      setError(err.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', background: '#050505', color: '#fff', fontFamily: 'sans-serif', position: 'relative', overflowX: 'hidden' }}>
      
      {/* Holographic Grid Background */}
      <div style={{
        position: 'fixed', inset: 0, zIndex: 0,
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
        position: 'fixed',
        top: 0, left: 0,
        transform: `translate(${mousePos.x - 300}px, ${mousePos.y - 300}px)`,
        width: '600px', height: '600px',
        background: 'radial-gradient(circle, rgba(59,130,246,0.12) 0%, transparent 60%)',
        borderRadius: '50%',
        pointerEvents: 'none',
        zIndex: 1,
        transition: 'transform 0.1s ease-out'
      }}></div>

      {/* Header */}
      <header style={{ position: 'sticky', top: 0, zIndex: 50, padding: '1rem', background: 'rgba(5,5,5,0.8)', backdropFilter: 'blur(10px)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#9ca3af', textDecoration: 'none', fontSize: '0.875rem', fontWeight: 400, transition: 'color 0.2s' }} className="hover-white">
            <ArrowLeft size={18} />
            Back to Dashboard
          </Link>
        </div>
      </header>

      <main style={{ padding: '1rem clamp(1rem, 3vw, 2rem) 4rem', flex: 1, position: 'relative', zIndex: 10, width: '100%' }}>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} style={{ marginBottom: '2rem' }}>
          <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: 200, margin: '0 0 0.5rem 0', letterSpacing: '-0.02em', color: '#fff' }}>
            Repo / <span style={{ opacity: 0.8 }}>{categoryName}</span>
          </h1>
          <p style={{ color: '#6b7280', fontSize: '1rem', margin: 0, fontWeight: 300 }}>Access and manage modules in this directory.</p>
        </motion.div>

        {error && (
          <div style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)', color: '#ef4444', padding: '1.5rem', borderRadius: '0.75rem', display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
            <AlertCircle size={24} />
            <p style={{ margin: 0 }}>{error}</p>
          </div>
        )}

        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem' }}>
            <Loader2 className="animate-spin" size={48} color="#3b82f6" />
          </div>
        ) : files.length === 0 && !error ? (
          <div style={{ textAlign: 'center', padding: '5rem 2rem', background: 'rgba(255,255,255,0.02)', borderRadius: '1rem', border: '1px dashed rgba(255,255,255,0.1)' }}>
            <FolderOpen size={64} color="#4b5563" style={{ margin: '0 auto 1.5rem', opacity: 0.5 }} />
            <h3 style={{ fontSize: '1.5rem', margin: '0 0 0.5rem 0' }}>Directory is Empty</h3>
            <p style={{ color: '#6b7280', margin: 0 }}>Upload files to this folder in your repository.</p>
          </div>
        ) : (
          <div style={{ position: 'relative', paddingLeft: 'clamp(1.5rem, 4vw, 3rem)' }}>
            {/* Vertical Tree Branch Line */}
            <div style={{ position: 'absolute', top: '1.5rem', bottom: '2rem', left: '0', width: '2px', background: 'linear-gradient(to bottom, rgba(59,130,246,0.5), transparent)' }}></div>
            
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem', marginLeft: 'clamp(-1.5rem, -4vw, -3rem)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ background: 'rgba(59,130,246,0.1)', padding: '0.5rem', borderRadius: '0.5rem', border: '1px solid rgba(59,130,246,0.3)', zIndex: 2 }}>
                  <FolderOpen size={24} color="#3b82f6" />
                </div>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 300, margin: 0, color: '#fff', fontFamily: 'monospace' }}>/{categoryName}</h2>
              </div>
              
              <div style={{ zIndex: 2 }}>
                <input type="file" id="file-upload" style={{ display: 'none' }} onChange={handleUpload} disabled={uploading} />
                <label htmlFor="file-upload" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: '#3b82f6', color: '#fff', padding: '0.5rem 1rem', borderRadius: '0.5rem', cursor: uploading ? 'not-allowed' : 'pointer', opacity: uploading ? 0.7 : 1, transition: 'background 0.2s', fontWeight: 500, fontSize: '0.9rem' }} className="hover-primary-bg">
                  {uploading ? <Loader2 size={16} className="animate-spin" /> : <Upload size={16} />}
                  {uploading ? 'Uploading...' : 'Upload File'}
                </label>
              </div>
            </div>

            {files.map((file, index) => {
              const fileUrl = `/api/pdf-content?path=${encodeURIComponent(file.path)}`;
              const isPdf = file.name.toLowerCase().endsWith('.pdf');
              const isImage = /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(file.name);
              const isCode = /\.(js|jsx|ts|tsx|json|html|css|py|java|c|cpp)$/i.test(file.name);
              
              let FileIcon = FileText;
              let iconColor = "#9ca3af";
              
              if (isPdf) { FileIcon = FileText; iconColor = "#ef4444"; }
              else if (isImage) { FileIcon = ImageIcon; iconColor = "#10b981"; }
              else if (isCode) { FileIcon = FileCode; iconColor = "#f59e0b"; }

              return (
                <motion.div 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1, type: 'spring', stiffness: 200, damping: 20 }}
                  key={file.path} 
                  style={{ position: 'relative', paddingLeft: 'clamp(1rem, 4vw, 2.5rem)', marginBottom: '1.5rem' }}
                >
                  {/* Horizontal Tree Branch Line & Number */}
                  <div style={{ position: 'absolute', top: '50%', transform: 'translateY(-50%)', left: 'clamp(-1.5rem, -4vw, -3rem)', width: 'clamp(2.5rem, 8vw, 5.5rem)', height: '2px', background: 'rgba(59,130,246,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '24px', height: '24px', borderRadius: '50%', background: '#050505', border: '2px solid rgba(59,130,246,0.6)', color: '#fff', fontSize: '0.75rem', fontWeight: 700, zIndex: 3 }}>
                      {index + 1}
                    </div>
                  </div>
                  
                  <div className="hover-bg" style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', padding: '1.25rem 1.5rem', background: 'rgba(255,255,255,0.02)', borderRadius: '0.75rem', border: '1px solid rgba(255,255,255,0.05)', transition: 'background 0.2s', position: 'relative', zIndex: 2 }}>
                    
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flex: '1 1 200px' }}>
                      <FileIcon size={24} color={iconColor} style={{ flexShrink: 0 }} />
                      <span style={{ fontSize: '1.125rem', fontWeight: 500, color: '#e5e7eb', wordBreak: 'break-word', lineHeight: 1.4 }}>{file.name}</span>
                    </div>
                    
                    <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '1rem', justifyContent: 'flex-end', width: '100%', '@media (min-width: 600px)': { width: 'auto' } }}>
                      <span style={{ color: '#6b7280', fontSize: '0.85rem', fontFamily: 'monospace', background: 'rgba(255,255,255,0.05)', padding: '0.25rem 0.5rem', borderRadius: '0.25rem' }}>
                        {(file.size / 1024 / 1024).toFixed(2)} MB
                      </span>
                      
                      <div style={{ display: 'flex', gap: '0.5rem', width: '100%', justifyContent: 'flex-end' }}>
                        {/* Report Button */}
                        <a href={`mailto:pradhanmrutunjaya73@gmail.com?subject=Broken File Report: ${encodeURIComponent(file.name)}`} title="Report Broken File" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(239,68,68,0.1)', color: '#ef4444', padding: '0.5rem', borderRadius: '0.5rem', transition: 'background 0.2s' }} className="hover-red-bg">
                          <AlertTriangle size={18} />
                        </a>
                        <a href={fileUrl} download={file.name} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(255,255,255,0.05)', color: '#fff', padding: '0.5rem', borderRadius: '0.5rem', transition: 'background 0.2s' }} className="hover-white-bg">
                          <Download size={18} />
                        </a>
                        {isPdf ? (
                          <Link href={`/reader?path=${encodeURIComponent(file.path)}`} style={{ background: '#3b82f6', color: '#fff', padding: '0.5rem 1.25rem', borderRadius: '0.5rem', fontSize: '0.875rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none', transition: 'background 0.2s' }} className="hover-primary-bg">
                            <Eye size={18} /> Read
                          </Link>
                        ) : (
                          <a href={fileUrl} target="_blank" rel="noopener noreferrer" style={{ background: '#3b82f6', color: '#fff', padding: '0.5rem 1.25rem', borderRadius: '0.5rem', fontSize: '0.875rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none', transition: 'background 0.2s' }} className="hover-primary-bg">
                            <Eye size={18} /> View
                          </a>
                        )}
                      </div>
                    </div>

                  </div>
                </motion.div>
              )
            })}
          </div>
        )}
      </main>

      <style>{`
        .hover-white:hover { color: #fff !important; }
        .hover-bg:hover { background: rgba(255,255,255,0.05) !important; }
        .hover-white-bg:hover { background: rgba(255,255,255,0.1) !important; }
        .hover-primary-bg:hover { background: #2563eb !important; }
        .hover-red-bg:hover { background: rgba(239,68,68,0.2) !important; }
        .hover-syllabus:hover { background: rgba(239, 68, 68, 0.25) !important; border-color: rgba(239, 68, 68, 0.6) !important; transform: translateY(-2px); box-shadow: 0 6px 20px rgba(239, 68, 68, 0.2) !important; }
        
        /* Mobile specific adjustments inside style block for layout safety */
        @media (max-width: 600px) {
          .hover-bg > div:last-child {
            width: 100%;
            justify-content: space-between;
            margin-top: 0.5rem;
          }
          .hover-bg > div:last-child > div:last-child {
            width: auto;
          }
        }
      `}</style>
    </div>
  );
}

export default function CategoryDetailsPage({ params }) {
  return (
    <Suspense fallback={
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: '#050505' }}>
        <Loader2 className="animate-spin" size={48} color="#3b82f6" />
      </div>
    }>
      <CategoryContent params={params} />
    </Suspense>
  );
}
