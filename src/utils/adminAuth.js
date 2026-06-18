export function verifyAdminCredentials(email, password, env = {}) {
  const adminEmail = env.VITE_ADMIN_EMAIL || 'admin@gmail.com';
  const adminPassword = env.VITE_ADMIN_PASSWORD || 'admin';
  return email === adminEmail && password === adminPassword;
}

export function verifyAdminPin(pin, env = {}) {
  const adminPin = env.VITE_ADMIN_PIN || '123456';
  return pin === adminPin;
}

export function shouldAllowAdminRoute(isAdmin, isDevelopment = false) {
  return isAdmin || isDevelopment;
}
