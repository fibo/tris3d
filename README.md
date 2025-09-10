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

### Environment

To build and deploy the following environment variables are needed

- `BUCKET`
- `WEB_SOCKET_URL`

For instance, these are the default values for [tris3d.inversive.net](https://tris3d.inversive.net):

```shell
export BUCKET=tris3d.inversive.net
export WEB_SOCKET_URL=ws://tris3d.inversive.net:3456
```

### Build

Build the PWA with

```shell
npm run build -- --all
```

Generated files are in _pwa/out_ folder.

You can preview the PWA with any static file server, for example launch `npx http-server pwa/out`.

### Deploy

To deploy the PWA you need AWS CLI and the environment variable properly set.

Deploy the PWA with

```shell
npm run deploy
```

This will deploy only index.html and JS files.
To deploy whole PWA launch `npm run deploy -- all`.

## Credits

Many thanks to Mathias Lasser for code inspiration!

