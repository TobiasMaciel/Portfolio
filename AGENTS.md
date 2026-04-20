<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Agent Guidelines

## Commands
- Dev server: `npm run dev`
- Build: `npm run build` (outputs to `out/` directory)
- Start production server: `npm run start` (serves the `out/` directory)
- Lint: `npm run lint`
- No test suite configured

## Key Configuration
- Next.js 16 with App Router and static export (`output: "export"`)
- basePath automatically set to `/Portfolio` in GitHub Actions (for GitHub Pages)
- Development server allowed origins: localhost, 192.168.1.5, 192.168.1.15 (see `allowedDevOrigins` in next.config.ts)
- Images unoptimized (`images: { unoptimized: true }`)

## Project Structure
- `src/app`: Next.js App Router (pages and layouts)
- `src/components`: Shared UI components
- `src/context`: React context (e.g., LanguageContext)
- `src/data`: Content data and translations
- `src/types`: TypeScript type definitions
- `public`: Static assets
- Path alias: `@/*` maps to `src/*`

## Deployment
- GitHub Actions workflow (`.github/workflows/deploy.yml`) builds and deploys to GitHub Pages
- Uses `npm ci` for clean install, then `npm run build`
- Artifact uploaded from `out/` directory