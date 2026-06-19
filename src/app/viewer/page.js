"use client";

import { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Loader2, Download, AlertCircle } from 'lucide-react';

export default function ViewerPage({ searchParams }) {
  const resolvedParams = use(searchParams);
  const path = resolvedParams.path;
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [content, setContent] = useState(null);

  const fileExt = path ? path.split('.').pop().toLowerCase() : '';
  const isImage = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'].includes(fileExt);
  const isText = ['txt', 'md', 'js', 'jsx', 'ts', 'tsx', 'json', 'html', 'css', 'py', 'java', 'c', 'cpp'].includes(fileExt);
  const isOffice = ['docx', 'doc', 'pptx', 'ppt', 'xlsx', 'xls'].includes(fileExt);

  const fileUrl = path ? `/api/pdf-content?path=${encodeURIComponent(path)}` : '';

  useEffect(() => {
    if (!path) return;

    if (isText) {
      // Fetch text content directly to display
      fetch(fileUrl)
        .then(res => {
          if (!res.ok) throw new Error('Failed to load file');
          return res.text();
        })
        .then(text => {
          setContent(text);
          setLoading(false);
        })
        .catch(err => {
          setError(err.message);
          setLoading(false);
        });
    } else {
      // For images and office files, we don't need to fetch text
      setLoading(false);
    }
  }, [path, fileUrl, isText]);

  if (!path) {
    return (
      <div style={{ padding: '4rem', textAlign: 'center', background: '#f3f4f6', minHeight: '100vh', color: '#111827' }}>
        <h2>Invalid File Path</h2>
        <button onClick={() => router.back()} style={{ marginTop: '1rem', color: '#3b82f6', background: 'transparent', border: 'none', cursor: 'pointer' }}>Go Back</button>
      </div>
    );
  }

  const fileName = path.split('/').pop();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', width: '100vw', background: '#f3f4f6', color: '#111827', overflow: 'hidden', fontFamily: 'sans-serif' }}>
      
      {/* Top Header Bar */}
      <header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 1.5rem', height: '70px', background: '#ffffff', borderBottom: '1px solid #e5e7eb', zIndex: 50, flexShrink: 0 }}>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
          <button onClick={() => router.back()} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#374151', fontWeight: 600, fontSize: '0.9rem', background: 'transparent', border: 'none', cursor: 'pointer', padding: 0 }}>
            <ArrowLeft size={18} strokeWidth={2.5} />
            <span>Back to Library</span>
          </button>
          
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: '1rem', fontWeight: 600, color: '#111827', maxWidth: '300px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {fileName}
            </span>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <a href={fileUrl} download={fileName} title="Download" style={{ display: 'flex', alignItems: 'center', color: '#4b5563', textDecoration: 'none' }}>
            <Download size={18} />
          </a>
        </div>
      </header>

      {/* Main Content Area */}
      <main style={{ flex: 1, position: 'relative', overflow: 'auto', padding: '2rem', display: 'flex', justifyContent: 'center' }}>
        
        {loading ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', marginTop: '20vh' }}>
            <Loader2 className="animate-spin" size={48} color="#3b82f6" />
            <p style={{ color: '#6b7280' }}>Loading file...</p>
          </div>
        ) : error ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', marginTop: '20vh', color: '#ef4444' }}>
            <AlertCircle size={48} />
            <p>{error}</p>
          </div>
        ) : isImage ? (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-start', width: '100%', height: '100%' }}>
            <img 
              src={fileUrl} 
              alt={fileName} 
              style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain', background: '#fff', padding: '1rem', borderRadius: '0.5rem', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)' }} 
            />
          </div>
        ) : isText ? (
          <div style={{ width: '100%', maxWidth: '1000px', background: '#fff', borderRadius: '0.5rem', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)', overflow: 'hidden' }}>
            <pre style={{ margin: 0, padding: '1.5rem', overflowX: 'auto', whiteSpace: 'pre-wrap', wordWrap: 'break-word', fontSize: '0.9rem', lineHeight: '1.5', color: '#374151', minHeight: '100%' }}>
              <code>{content}</code>
            </pre>
          </div>
        ) : isOffice ? (
          <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ background: '#fff', padding: '1.5rem', borderRadius: '0.5rem', marginBottom: '1rem', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)', textAlign: 'center', maxWidth: '600px' }}>
              <h3 style={{ margin: '0 0 0.5rem 0' }}>Office File Viewer</h3>
              <p style={{ margin: '0 0 1rem 0', color: '#6b7280', fontSize: '0.9rem' }}>
                Note: The online viewer requires the file to be publicly accessible. If it fails to load, please download the file directly.
              </p>
              <a href={fileUrl} download={fileName} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: '#3b82f6', color: '#fff', padding: '0.5rem 1rem', borderRadius: '0.25rem', textDecoration: 'none', fontWeight: 500 }}>
                <Download size={16} /> Download File
              </a>
            </div>
            
            {/* The officeapps viewer needs an absolute, public URL. We pass window.location.origin + fileUrl */}
            <iframe 
              src={`https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(typeof window !== 'undefined' ? window.location.origin + fileUrl : '')}`}
              width="100%" 
              height="100%" 
              frameBorder="0"
              style={{ background: '#fff', borderRadius: '0.5rem', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
            >
              This is an embedded <a target="_blank" rel="noopener noreferrer" href="https://office.com">Microsoft Office</a> document, powered by <a target="_blank" rel="noopener noreferrer" href="https://office.com/webapps">Office</a>.
            </iframe>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', marginTop: '20vh' }}>
            <AlertCircle size={48} color="#9ca3af" />
            <p style={{ color: '#4b5563', fontSize: '1.1rem' }}>No preview available for this file type.</p>
            <a href={fileUrl} download={fileName} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: '#3b82f6', color: '#fff', padding: '0.5rem 1.5rem', borderRadius: '0.5rem', textDecoration: 'none', fontWeight: 600, marginTop: '1rem' }}>
              <Download size={18} /> Download
            </a>
          </div>
        )}

      </main>
    </div>
  );
}
