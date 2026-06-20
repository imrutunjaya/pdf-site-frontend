"use client";

import { useEffect, useState, use, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Loader2, Download, AlertCircle, Sun, Moon, Menu, X, List } from 'lucide-react';

export default function ViewerPage({ searchParams }) {
  const resolvedParams = use(searchParams);
  const path = resolvedParams.path;
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [content, setContent] = useState(null);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [showToc, setShowToc] = useState(false);
  const [processedText, setProcessedText] = useState({ html: '', toc: [] });
  const contentRef = useRef(null);

  const fileExt = path ? path.split('.').pop().toLowerCase() : '';
  const isImage = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'].includes(fileExt);
  const isCode = ['js', 'jsx', 'ts', 'tsx', 'json', 'html', 'css', 'py', 'java', 'c', 'cpp'].includes(fileExt);
  const isPlainText = ['txt', 'md'].includes(fileExt);
  const isText = isCode || isPlainText;
  const isOffice = ['docx', 'doc', 'pptx', 'ppt', 'xlsx', 'xls'].includes(fileExt);

  const fileUrl = path ? `/api/pdf-content?path=${encodeURIComponent(path)}` : '';

  useEffect(() => {
    if (!path) return;

    fetch(fileUrl)
      .then(async res => {
        if (res.status === 403) {
          throw new Error("Files are encrypted Contact @Mrutunjaya");
        }
        if (!res.ok) throw new Error('Failed to load file');

        if (isText) {
          return res.text().then(text => setContent(text));
        } else if (isImage) {
          return res.blob().then(blob => setContent(URL.createObjectURL(blob)));
        } else {
          setContent(fileUrl);
        }
      })
      .then(() => setLoading(false))
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, [path, fileUrl, isText, isImage]);

  useEffect(() => {
    if (isText && content) {
      let tocList = [];
      let html = content.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
      
      const headerBoxStyle = `background: ${isDarkMode ? '#1e293b' : '#eff6ff'}; border-left: 4px solid #3b82f6; padding: 1rem 1.5rem; margin: 2.5rem 0 1.5rem 0; font-weight: 700; color: ${isDarkMode ? '#60a5fa' : '#1d4ed8'}; border-radius: 0 0.5rem 0.5rem 0; font-family: system-ui, -apple-system, sans-serif; display: block; box-shadow: 0 1px 3px rgba(0,0,0,0.1);`;

      html = html.replace(/^(#{1,6})\s+(.+)$/gm, (match, hashes, title, offset) => {
        const id = `heading-${offset}`;
        tocList.push({ level: hashes.length, title, id });
        const fontSize = 1.7 - (hashes.length - 1) * 0.15;
        return `<div id="${id}" style="${headerBoxStyle} font-size: ${fontSize}rem; letter-spacing: -0.02em;">${title}</div>`;
      });
      
      if (tocList.length === 0) {
        html = html.replace(/^((?:CHAPTER|PART|SECTION|MODULE|UNIT)\s+[A-Z0-9]+(?:[:\-\s]+[A-Z0-9\s]+)?)$/gmi, (match, title, offset) => {
          const id = `heading-${offset}`;
          tocList.push({ level: 1, title: title.trim(), id });
          return `<div id="${id}" style="${headerBoxStyle} font-size: 1.5rem; letter-spacing: -0.02em;">${title}</div>`;
        });
      }
      
      setProcessedText({ html, toc: tocList });
    }
  }, [content, isText, isDarkMode]);

  const scrollToHeading = (id) => {
    const el = document.getElementById(id);
    if (el && contentRef.current) {
      contentRef.current.scrollTo({
        top: el.offsetTop - 20,
        behavior: 'smooth'
      });
    }
    if (window.innerWidth < 768) setShowToc(false);
  };

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
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', width: '100vw', background: isDarkMode ? '#111827' : '#f3f4f6', color: isDarkMode ? '#f3f4f6' : '#111827', overflow: 'hidden', fontFamily: 'sans-serif' }}>
      
      {/* Top Header Bar */}
      <header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 1.5rem', height: '70px', background: isDarkMode ? '#1f2937' : '#ffffff', borderBottom: isDarkMode ? '1px solid #374151' : '1px solid #e5e7eb', zIndex: 50, flexShrink: 0 }}>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          {isText && processedText.toc.length > 0 && (
            <button onClick={() => setShowToc(!showToc)} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'transparent', border: 'none', color: isDarkMode ? '#e5e7eb' : '#374151', cursor: 'pointer', padding: '0.5rem' }}>
              <Menu size={20} />
            </button>
          )}
          <button onClick={() => router.back()} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: isDarkMode ? '#e5e7eb' : '#374151', fontWeight: 600, fontSize: '0.9rem', background: 'transparent', border: 'none', cursor: 'pointer', padding: 0 }}>
            <ArrowLeft size={18} strokeWidth={2.5} />
            <span>Back to Library</span>
          </button>
          
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: '1rem', fontWeight: 600, color: isDarkMode ? '#f3f4f6' : '#111827', maxWidth: '300px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {fileName}
            </span>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <button onClick={() => setIsDarkMode(!isDarkMode)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: isDarkMode ? '#e5e7eb' : '#4b5563', display: 'flex', alignItems: 'center' }}>
            {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          <a href={fileUrl} download={fileName} title="Download" style={{ display: 'flex', alignItems: 'center', color: isDarkMode ? '#e5e7eb' : '#4b5563', textDecoration: 'none' }}>
            <Download size={18} />
          </a>
        </div>
      </header>

      {/* Main Content Area */}
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden', position: 'relative' }}>
        
        {/* TOC Sidebar */}
        {isText && showToc && processedText.toc.length > 0 && (
          <aside style={{ 
            width: '280px', 
            background: isDarkMode ? '#1f2937' : '#ffffff', 
            borderRight: isDarkMode ? '1px solid #374151' : '1px solid #e5e7eb',
            display: 'flex', flexDirection: 'column',
            position: window.innerWidth < 768 ? 'absolute' : 'relative',
            height: '100%', zIndex: 40,
            boxShadow: window.innerWidth < 768 ? '4px 0 15px rgba(0,0,0,0.1)' : 'none'
          }}>
            <div style={{ padding: '1rem 1.5rem', borderBottom: isDarkMode ? '1px solid #374151' : '1px solid #e5e7eb', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600 }}>
                <List size={18} /> Table of Contents
              </div>
              {window.innerWidth < 768 && (
                <button onClick={() => setShowToc(false)} style={{ background: 'none', border: 'none', color: isDarkMode ? '#9ca3af' : '#6b7280' }}><X size={18}/></button>
              )}
            </div>
            <div style={{ flex: 1, overflowY: 'auto', padding: '1rem' }} className="custom-scrollbar">
              {processedText.toc.map((item, i) => (
                <div 
                  key={i} 
                  onClick={() => scrollToHeading(item.id)}
                  style={{ 
                    padding: '0.5rem', 
                    paddingLeft: `${(item.level - 1) * 1 + 0.5}rem`,
                    fontSize: '0.85rem', 
                    color: isDarkMode ? '#d1d5db' : '#4b5563',
                    cursor: 'pointer',
                    borderRadius: '0.25rem',
                    marginBottom: '0.25rem'
                  }}
                  onMouseOver={(e) => e.currentTarget.style.background = isDarkMode ? '#374151' : '#f3f4f6'}
                  onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}
                >
                  {item.title}
                </div>
              ))}
            </div>
          </aside>
        )}

        <main style={{ flex: 1, position: 'relative', overflow: 'auto', padding: isText ? '0' : '2rem', display: 'flex', justifyContent: 'center' }}>
        
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
        ) : isImage && content ? (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-start', width: '100%', height: '100%' }}>
            <img 
              src={content} 
              alt={fileName} 
              style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain', background: '#fff', padding: '1rem', borderRadius: '0.5rem', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)' }} 
            />
          </div>
        ) : isText ? (
          <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', background: isDarkMode ? '#111827' : '#f9fafb', overflow: 'hidden' }}>
            <div ref={contentRef} style={{ flex: 1, overflowY: 'auto', padding: '2rem 5vw', userSelect: 'text', position: 'relative' }}>
              <pre 
                style={{ 
                  margin: 0, 
                  whiteSpace: 'pre-wrap', 
                  wordWrap: 'break-word', 
                  fontSize: isPlainText ? '1.05rem' : '0.9rem', 
                  lineHeight: isPlainText ? '1.8' : '1.5', 
                  color: isDarkMode ? '#d1d5db' : '#374151', 
                  fontFamily: isPlainText ? 'system-ui, -apple-system, sans-serif' : 'monospace',
                  maxWidth: '100%', // Removed previous 1000px limits to use full width
                }}
                dangerouslySetInnerHTML={{ __html: processedText.html }}
              />
            </div>
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
    </div>
  );
}
