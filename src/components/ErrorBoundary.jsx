import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    // Keep console error for debugging
    // eslint-disable-next-line no-console
    console.error('ErrorBoundary caught:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ minHeight: '100vh', paddingTop: '180px', paddingBottom: '80px', background: 'var(--bg-creme)' }}>
          <div className="container" style={{ maxWidth: '900px' }}>
            <div style={{ background: '#fff', border: '1px solid var(--border-subtle)', borderRadius: '16px', padding: '1.5rem' }}>
              <h2 className="font-serif" style={{ marginTop: 0, color: 'var(--emerald-900)' }}>
                Une erreur empêche l’affichage de cette page
              </h2>
              <p style={{ color: 'var(--text-muted)', marginBottom: '1rem' }}>
                Copie le message ci-dessous et envoie-le moi, je corrige immédiatement.
              </p>
              <pre style={{ margin: 0, padding: '1rem', borderRadius: '12px', background: '#0b1220', color: '#e5e7eb', overflowX: 'auto' }}>
                {String(this.state.error?.message || this.state.error || 'Erreur inconnue')}
              </pre>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;

