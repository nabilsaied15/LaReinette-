/**
 * @vitest-environment jsdom
 */
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import ErrorBoundary from '../../src/components/ErrorBoundary.jsx';

function BrokenChild() {
  throw new Error('Erreur de test');
}

describe('ErrorBoundary', () => {
  it('affiche les enfants sans erreur', () => {
    render(
      <ErrorBoundary>
        <p>Contenu OK</p>
      </ErrorBoundary>
    );
    expect(screen.getByText('Contenu OK')).toBeInTheDocument();
  });

  it('affiche un message d’erreur si un enfant plante', () => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
    render(
      <ErrorBoundary>
        <BrokenChild />
      </ErrorBoundary>
    );
    expect(screen.getByRole('heading', { name: /Une erreur empêche/i })).toBeInTheDocument();
    expect(screen.getByText(/Erreur de test/)).toBeInTheDocument();
    vi.restoreAllMocks();
  });
});
