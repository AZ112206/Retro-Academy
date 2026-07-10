# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

To run the project, npm run dev

## Git Pull Safety (Windows Synced Folders)

When this repo is inside a synced folder (OneDrive, Google Drive, etc.), system-generated `desktop.ini` files can appear inside `.git` and break commands like `git pull` with errors such as `bad object refs/desktop.ini`.

Use this command instead of raw `git pull`:

```bash
git safe-pull
```

`git safe-pull` runs `scripts/safe-pull.ps1`, which removes injected `.git/**/desktop.ini` files first, then performs `git pull --tags origin main`.

Most reliable long-term prevention: keep active Git repositories outside cloud-synced desktop folders.
