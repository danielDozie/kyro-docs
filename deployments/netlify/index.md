# Deploying to Netlify

You can easily deploy your Kyro CMS Astro project to Netlify.

## Deployment Steps

1. Install the Netlify adapter:
   ```bash
   pnpm add @astrojs/netlify
   ```
2. Update your `astro.config.mjs`:
   ```javascript
   import { defineConfig } from 'astro/config';
   import netlify from '@astrojs/netlify';
   import kyro from '@kyro-cms/astro';
   import { kyroAdmin } from '@kyro-cms/admin/integration';

   export default defineConfig({
     output: 'server',
     adapter: netlify(),
     integrations: [kyro(), kyroAdmin()],
   });
   ```
3. Push your code to GitHub and connect it to Netlify, or deploy via the Netlify CLI:
   ```bash
   netlify deploy --build --prod
   ```
4. Configure your `KYRO_DATABASE_URL` in the Netlify Environment Variables settings.
