/**
 * @vitest-environment jsdom
 */
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import RegistrationRequiredDocuments from '../../src/components/RegistrationRequiredDocuments.jsx';
import { REGISTRATION_DOCUMENTS_TITLE } from '../../src/data/registrationRequiredDocuments.js';

describe('RegistrationRequiredDocuments', () => {
  it('affiche la liste des pièces et le bouton PDF', () => {
    render(
      <RegistrationRequiredDocuments
        contact={{ address: '3 allée Test', city: 'Bourg-la-Reine', email: 'contact@asad.fr' }}
        onDownloadPdf={vi.fn()}
      />
    );
    expect(screen.getByText(REGISTRATION_DOCUMENTS_TITLE)).toBeInTheDocument();
    expect(screen.getByText(/justificatif de domicile/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Télécharger la liste des documents/i })).toBeInTheDocument();
  });

  it('appelle onDownloadPdf au clic', async () => {
    const onDownloadPdf = vi.fn();
    const user = userEvent.setup();
    render(
      <RegistrationRequiredDocuments contact={{ email: 'a@b.fr' }} onDownloadPdf={onDownloadPdf} />
    );
    await user.click(screen.getByRole('button', { name: /Télécharger la liste des documents/i }));
    expect(onDownloadPdf).toHaveBeenCalledOnce();
  });
});
