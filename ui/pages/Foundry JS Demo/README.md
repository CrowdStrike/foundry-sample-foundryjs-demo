# Foundry JS SDK Demo

Comprehensive demo application showcasing all foundry-js library functionality.

## Getting started

- `npm install`
- `npm run build` - Production build
- `npm run watch` - Watch mode for development
- `npm run showcase` - Component showcase mode (local development)

The project uses [Vite](https://vitejs.dev/) for building and development. Production output is in `/src/dist` and this is what will be rendered by Foundry.

## Development Modes

### Production Mode
Build for deployment to Foundry:
```bash
npm run build
```
Output will be in `src/dist/` and ready to be deployed.

### Watch Mode
Continuous rebuild during development:
```bash
npm run watch
```
Files are automatically rebuilt when you make changes.

### Showcase Mode
Component showcase for local development and testing presentational components without Foundry context:
```bash
npm run showcase
```
- Runs on http://localhost:8081
- Provides a full navigation experience with hash routing
- Uses mock data to simulate Foundry API responses
- All presentational components are rendered with dummy handlers
- Great for UI/UX development and visual testing

## UI development

Included in this blueprint are some common css and React components you can use in your app. They're already styled to be consistent with the rest of Falcon Console and handle light and dark mode for you.

- [Shoelace](https://shoelace.style/frameworks/react) is already installed and we've also included [shoelace specific Falcon css](https://github.com/CrowdStrike/falcon-shoelace) to make the components provided by Shoelace look consistent with the rest of Falcon.

- [Tailwind Toucan Base](https://github.com/CrowdStrike/tailwind-toucan-base) is a [tailwindcss](https://tailwindcss.com/) theme that gives you utility classes you can use in html or React components. You have the full power of tailwind in this boilerplate.  The Falcon specific [colors](https://tailwind-toucan-base.pages.dev/#Colors) are a great place to start in Tailwind Toucan Base.

## Routing

This demo uses [React Router](https://reactrouter.com/) for client-side routing with hash-based navigation for compatibility with Foundry's iframe environment.

### Navigation within the app
The app uses React Router's hash routing (`HashRouter`) to handle navigation. All routes are prefixed with `#` in the URL (e.g., `#/events`, `#/navigation`).

### Falcon Console integration
For production deployment, the app integrates with Falcon Console's navigation system using `falcon.navigation.navigateTo()` to sync URLs with the parent frame.

Example navigation implementation can be seen in the Navigation demo section of the app.

## Building your app

Before deploying your Foundry app, run a production build:

```bash
npm run build
```

This creates optimized files in `/src/dist` that Foundry will serve.

## App manifest updates

The `manifest.yml` is already configured for this demo app. Key configurations:

### Ignored files
The manifest ignores development files and only includes the production build:
```yaml
ignored:
    - .+/node_modules$
    - .+/node_modules/.+
    - .+/venv$
    - .+/venv/.+
    - ui/pages/.*/config/.*
```

### Path and entrypoint
```yaml
path: ui/pages/Foundry JS Demo/src/dist
entrypoint: ui/pages/Foundry JS Demo/src/dist/index.html
```

The app serves from the `dist` directory which contains the production-optimized build.