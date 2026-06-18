import { describe, it, expect } from 'vitest';
import {
  verifyAdminCredentials,
  verifyAdminPin,
  shouldAllowAdminRoute,
} from '../../src/utils/adminAuth.js';

describe('adminAuth', () => {
  const env = {
    VITE_ADMIN_EMAIL: 'admin@test.fr',
    VITE_ADMIN_PASSWORD: 'secret',
    VITE_ADMIN_PIN: '999999',
  };

  it('vérifie email et mot de passe admin', () => {
    expect(verifyAdminCredentials('admin@test.fr', 'secret', env)).toBe(true);
    expect(verifyAdminCredentials('admin@test.fr', 'wrong', env)).toBe(false);
  });

  it('vérifie le code PIN admin', () => {
    expect(verifyAdminPin('999999', env)).toBe(true);
    expect(verifyAdminPin('000000', env)).toBe(false);
  });

  it('autorise la route admin si connecté ou en dev', () => {
    expect(shouldAllowAdminRoute(true, false)).toBe(true);
    expect(shouldAllowAdminRoute(false, true)).toBe(true);
    expect(shouldAllowAdminRoute(false, false)).toBe(false);
  });
});
