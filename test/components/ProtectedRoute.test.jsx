/**
 * @vitest-environment jsdom
 */
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import ProtectedRoute from '../../src/components/ProtectedRoute.jsx';

vi.mock('../../src/context/SettingsContext', () => ({
  useSettings: vi.fn(),
}));

vi.mock('../../src/utils/adminAuth', () => ({
  shouldAllowAdminRoute: vi.fn(),
}));

import { useSettings } from '../../src/context/SettingsContext';
import { shouldAllowAdminRoute } from '../../src/utils/adminAuth';

describe('ProtectedRoute', () => {
  it('affiche le contenu si autorisé', () => {
    vi.mocked(useSettings).mockReturnValue({ isAdmin: true });
    vi.mocked(shouldAllowAdminRoute).mockReturnValue(true);

    render(
      <MemoryRouter>
        <ProtectedRoute>
          <p>Zone admin</p>
        </ProtectedRoute>
      </MemoryRouter>
    );
    expect(screen.getByText('Zone admin')).toBeInTheDocument();
  });

  it('redirige vers login si non autorisé', () => {
    vi.mocked(useSettings).mockReturnValue({ isAdmin: false });
    vi.mocked(shouldAllowAdminRoute).mockReturnValue(false);

    render(
      <MemoryRouter initialEntries={['/admin/secret']}>
        <Routes>
          <Route
            path="/admin/secret"
            element={
              <ProtectedRoute>
                <p>Zone admin</p>
              </ProtectedRoute>
            }
          />
          <Route path="/direction/admin" element={<p>Page login</p>} />
        </Routes>
      </MemoryRouter>
    );
    expect(screen.getByText('Page login')).toBeInTheDocument();
  });
});
