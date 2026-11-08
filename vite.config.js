import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const repository = process.env.GITHUB_REPOSITORY?.split('/').pop();
const isUserSite = repository?.endsWith('.github.io');
const base =
  process.env.GITHUB_ACTIONS === 'true' && repository
    ? isUserSite
      ? '/'
      : `/${repository}/`
    : '/DevVault/';

export default defineConfig({
  base,
  plugins: [react()]
});
