/**
 * @vitest-environment jsdom
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Contact from '../../src/pages/Contact.jsx';
import { renderWithRouter, mockSettings } from '../helpers.jsx';

vi.mock('../../src/context/SettingsContext', () => ({
  useSettings: vi.fn(),
}));

vi.mock('../../src/config/supabase', () => ({
  supabase: {
    from: vi.fn(() => ({
      insert: vi.fn().mockResolvedValue({ error: null }),
    })),
  },
}));

vi.mock('../../src/components/SEO', () => ({
  default: () => null,
}));

vi.mock('framer-motion', () => ({
  motion: {
    span: ({ children, ...props }) => <span {...props}>{children}</span>,
    h1: ({ children, ...props }) => <h1 {...props}>{children}</h1>,
    p: ({ children, ...props }) => <p {...props}>{children}</p>,
    div: ({ children, ...props }) => <div {...props}>{children}</div>,
    button: ({ children, ...props }) => <button {...props}>{children}</button>,
  },
  AnimatePresence: ({ children }) => children,
}));

vi.mock('@emailjs/browser', () => ({
  default: { send: vi.fn().mockResolvedValue({ status: 200 }) },
}));

import { useSettings } from '../../src/context/SettingsContext';

describe('Contact', () => {
  beforeEach(() => {
    vi.mocked(useSettings).mockReturnValue({
      settings: mockSettings,
      isSettingsLoading: false,
    });
  });

  it('affiche le formulaire de contact', () => {
    renderWithRouter(<Contact />);
    expect(screen.getByRole('heading', { name: /Envoyez un message/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/Motif de votre demande/i)).toBeInTheDocument();
  });

  it('préremplit le message depuis l’URL motif=tarifs', async () => {
    renderWithRouter(<Contact />, { route: '/contact?motif=transport-tarifs&zone=Paris' });

    await waitFor(() => {
      const textarea = screen.getByLabelText(/Votre message/i);
      expect(textarea.value).toContain('Destination concernée : Paris');
    });
  });

  it('affiche des erreurs de validation pour un envoi invalide', async () => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    renderWithRouter(<Contact />);

    vi.advanceTimersByTime(4000);
    await user.click(screen.getByRole('button', { name: /Envoyer le message/i }));

    expect(await screen.findByText(/Veuillez renseigner votre nom/i)).toBeInTheDocument();
    expect(screen.getByText(/Format d'email invalide/i)).toBeInTheDocument();
    expect(screen.getByText(/Veuillez choisir un motif/i)).toBeInTheDocument();
    vi.useRealTimers();
  });

  it('accepte un formulaire valide et tente l’envoi EmailJS', async () => {
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
    vi.useFakeTimers({ shouldAdvanceTime: true });

    renderWithRouter(<Contact />);

    await user.type(screen.getByPlaceholderText('Jean Dupont'), 'Marie Martin');
    await user.type(screen.getByPlaceholderText('jean@exemple.fr'), 'marie@example.fr');
    await user.type(screen.getByPlaceholderText('06 12 34 56 78'), '06 12 34 56 78');
    await user.selectOptions(screen.getByLabelText(/Motif de votre demande/i), 'information');
    await user.type(screen.getByLabelText(/Votre message/i), 'Question sur les horaires du service.');

    vi.advanceTimersByTime(4000);
    await user.click(screen.getByRole('button', { name: /Envoyer le message/i }));

    await waitFor(() => {
      expect(screen.getByText(/Message envoyé/i)).toBeInTheDocument();
    });

    vi.useRealTimers();
  });
});
