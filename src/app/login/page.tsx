'use client';

import React, { useEffect } from 'react';
import { signIn, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'authenticated') {
      router.push('/admin');
    }
  }, [status, router]);

  const handleLogin = () => {
    signIn('google', { callbackUrl: '/admin' });
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'var(--bg-primary)',
      position: 'relative',
      overflow: 'hidden',
      padding: '2rem'
    }}>
      {/* BACKGROUND GLOWS */}
      <div className="bg-glow-1" style={{ top: '20%', left: '10%' }}></div>
      <div className="bg-glow-2" style={{ bottom: '20%', right: '10%' }}></div>

      <div className="glass-card" style={{
        maxWidth: '450px',
        width: '100%',
        padding: '3rem 2.5rem',
        textAlign: 'center',
        margin: 'auto'
      }}>
        <div className="logo" style={{ justifyContent: 'center', marginBottom: '2rem', fontSize: '2rem' }}>
          <span>&lt;</span>Abhishek<span>/&gt;</span>
        </div>
        
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '0.75rem' }}>Admin Gate</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginBottom: '2.5rem' }}>
          Log in with Google to manage your portfolio settings, statistics, projects database, and messages.
        </p>

        {status === 'loading' ? (
          <div style={{ color: 'var(--accent-cyan)', fontSize: '1.1rem' }}>
            <i className="fas fa-spinner fa-spin" style={{ marginRight: '0.5rem' }}></i> Loading authentication state...
          </div>
        ) : (
          <button 
            onClick={handleLogin}
            className="btn btn-primary"
            style={{ width: '100%', justifyContent: 'center', gap: '0.75rem', padding: '1rem' }}
          >
            <i className="fab fa-google"></i> Sign In with Google
          </button>
        )}

        <div style={{ marginTop: '2.5rem' }}>
          <a href="/" style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }} className="project-link-btn">
            <i className="fas fa-arrow-left"></i> Back to Portfolio
          </a>
        </div>
      </div>
    </div>
  );
}
