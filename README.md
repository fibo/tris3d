# Tris3D

> Tic Tac Toe in 3D

## Launch locally

Install dependencies and run demo.

```shell
npm install
npm run demo
```

To try out multiplayer mode, launch server with

```shell
npm run server
```

## Progressive Web App

### Build

Build the PWA with

```shell
npm run build
```

Generated files are in _pwa/out_ folder.

You can preview the PWA with any static file server, for example launch `npx http-server pwa/out`.

### Deploy

To deploy the PWA you need AWS CLI.

Deploy the PWA with

```shell
npm run deploy
```

This will deploy only index.html and JS files.
To deploy whole PWA launch `npm run deploy -- all`.

## Credits

Many thanks to Mathias Lasser for code inspiration!

