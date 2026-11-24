import { defineConfig } from 'astro/config';
import business from './src/data/business.json' with { type: 'json' };

export default defineConfig({
  site: business.url,
  trailingSlash: 'always',
  build: { inlineStylesheets: 'always' }, // CSS inline : pas de requête bloquante au rendu
});
