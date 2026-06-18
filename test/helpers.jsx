import React from 'react';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

export const mockSettings = {
  contact: {
    email: 'contact@asad-bourg-la-reine.fr',
    formRecipientEmail: 'admin@asad-bourg-la-reine.fr',
    standardPhone: '01 79 71 75 42',
    address: '3-5 allée Françoise Dolto, 92340 Bourg-la-Reine',
    successTitle: 'Message envoyé !',
    successMessage: 'Votre message a bien été transmis.',
  },
  emailjs: {
    contact: {
      serviceId: 'svc_test',
      templateId: 'tpl_test',
      publicKey: 'pk_test',
    },
  },
  emailTemplates: { labels: {} },
  general: { siteName: 'La Reinette' },
};

export function renderWithRouter(ui, { route = '/' } = {}) {
  return render(
    <MemoryRouter initialEntries={[route]}>{ui}</MemoryRouter>
  );
}
