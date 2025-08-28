import { name, description } from '@tris3d/repo'

export function indexHtml() {
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <link rel="icon" href="data:image/x-icon;base64,AA" />
  <meta name="viewport" content="width=device-width">
  <title>${name}</title>
  <meta name="description" content="${description}" />
</head>
<body>
  <header>
    <h1>tris3d</h1>
    <p>${description}</p>
  </header>
</body>
</html>`
}
