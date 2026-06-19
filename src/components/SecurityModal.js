import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X, Lock, Unlock, FileText, ChevronRight, Loader2, FolderOpen } from 'lucide-react';

export default function SecurityModal({ isOpen, onClose, categories }) {
  const [selectedCategory, setSelectedCategory] = useState('');
  const [files, setFiles] = useState([]);
  const [loadingFiles, setLoadingFiles] = useState(false);
  const [password, setPassword] = useState('');
  const [actioning, setActioning] = useState(null); // path of file being actioned
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Fetch files when category changes
  useEffect(() => {
    if (!selectedCategory) {
      setFiles([]);
      return;
    }
    async function fetchFiles() {
      setLoadingFiles(true);
      try {
        const res = await fetch(`/api/pdfs?category=${encodeURIComponent(selectedCategory)}`);
        const data = await res.json();
        if (data.pdfs) setFiles(data.pdfs);
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingFiles(false);
      }
    }
    fetchFiles();
  }, [selectedCategory]);

  if (!isOpen) return null;

  const flatCategories = categories.flatMap(c => c.subCategories.map(s => s.path));

  const handleAction = async (path, action) => {
    if (!password) {
      setErrorMsg('Password is required');
      return;
    }
    setErrorMsg('');
    setSuccessMsg('');
    setActioning(path);
    try {
      const res = await fetch('/api/crypto', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ path, password, action })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to process file');
      setSuccessMsg(data.message);
    } catch (err) {
      setErrorMsg(err.message);
    } finally {
      setActioning(null);
    }
  };

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(5px)', padding: '1rem' }}>
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        style={{ background: '#0f0f0f', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '1rem', width: '100%', maxWidth: '600px', maxHeight: '90vh', display: 'flex', flexDirection: 'column', overflow: 'hidden', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)' }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1.5rem', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
          <h2 style={{ margin: 0, fontSize: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#fff' }}>
            <Lock size={20} color="#3b82f6" />
            File Security Manager
          </h2>
          <button onClick={onClose} style={{ background: 'transparent', border: 'none', color: '#9ca3af', cursor: 'pointer' }}><X size={20} /></button>
        </div>

        <div style={{ padding: '1.5rem', overflowY: 'auto', flex: 1, display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', color: '#9ca3af', fontSize: '0.9rem' }}>Master Password</label>
            <input 
              type="password" 
              placeholder="Enter password for encryption/decryption..." 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{ width: '100%', padding: '0.75rem 1rem', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '0.5rem', color: '#fff', outline: 'none' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', color: '#9ca3af', fontSize: '0.9rem' }}>Select Category</label>
            <select 
              value={selectedCategory} 
              onChange={(e) => setSelectedCategory(e.target.value)}
              style={{ width: '100%', padding: '0.75rem 1rem', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '0.5rem', color: '#fff', outline: 'none', appearance: 'none' }}
            >
              <option value="" disabled style={{ color: '#000' }}>-- Select a category --</option>
              {flatCategories.map(cat => (
                <option key={cat} value={cat} style={{ color: '#000' }}>{cat}</option>
              ))}
            </select>
          </div>

          {errorMsg && <div style={{ background: 'rgba(239,68,68,0.1)', color: '#ef4444', padding: '0.75rem', borderRadius: '0.5rem', fontSize: '0.9rem' }}>{errorMsg}</div>}
          {successMsg && <div style={{ background: 'rgba(16,185,129,0.1)', color: '#10b981', padding: '0.75rem', borderRadius: '0.5rem', fontSize: '0.9rem' }}>{successMsg}</div>}

          {selectedCategory && (
            <div>
              <h3 style={{ fontSize: '1rem', color: '#fff', margin: '0 0 1rem 0' }}>Files in /{selectedCategory}</h3>
              {loadingFiles ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#9ca3af' }}><Loader2 className="animate-spin" size={16} /> Loading files...</div>
              ) : files.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {files.map(file => {
                    const isDir = file.type === 'dir';
                    return (
                      <div key={file.path} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '0.5rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', overflow: 'hidden' }}>
                          {isDir ? <FolderOpen size={18} color="#3b82f6" style={{ flexShrink: 0 }} /> : <FileText size={18} color="#9ca3af" style={{ flexShrink: 0 }} />}
                          <span style={{ color: '#d1d5db', fontSize: '0.9rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }} title={file.name}>{file.name}</span>
                        </div>
                      <div style={{ display: 'flex', gap: '0.5rem', flexShrink: 0 }}>
                        <button 
                          onClick={() => handleAction(file.path, 'encrypt')}
                          disabled={actioning === file.path || !password}
                          style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', padding: '0.4rem 0.75rem', background: 'rgba(239,68,68,0.1)', color: '#ef4444', border: '1px solid rgba(239,68,68,0.2)', borderRadius: '0.25rem', fontSize: '0.8rem', cursor: (actioning || !password) ? 'not-allowed' : 'pointer', opacity: (actioning || !password) ? 0.5 : 1 }}
                        >
                          {actioning === file.path ? <Loader2 size={12} className="animate-spin" /> : <Lock size={12} />} Encrypt
                        </button>
                        <button 
                          onClick={() => handleAction(file.path, 'decrypt')}
                          disabled={actioning === file.path || !password}
                          style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', padding: '0.4rem 0.75rem', background: 'rgba(16,185,129,0.1)', color: '#10b981', border: '1px solid rgba(16,185,129,0.2)', borderRadius: '0.25rem', fontSize: '0.8rem', cursor: (actioning || !password) ? 'not-allowed' : 'pointer', opacity: (actioning || !password) ? 0.5 : 1 }}
                        >
                          {actioning === file.path ? <Loader2 size={12} className="animate-spin" /> : <Unlock size={12} />} Decrypt
                        </button>
                      </div>
                    </div>
                  );
                })}
                </div>
              ) : (
                <p style={{ color: '#6b7280', fontSize: '0.9rem' }}>No files found in this category.</p>
              )}
            </div>
          )}

        </div>
      </motion.div>
    </div>
  );
}
