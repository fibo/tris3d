/** Pretty good HTML minification */
function minified(content) {
  return content.replace(/\n\s+/g, '').trim()
}

export function indexHtml({
  appName,
  appDescription,
  fontFamily,
  themeColor,
  manifestPathname
}) {
  const content = `
<!doctype html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width">
  <meta name="theme-color" content="${themeColor}" />

  <title>${appName}</title>
  <meta name="description" content="${appDescription}" />

  <link rel="manifest" href="${manifestPathname}" />

  <style>
    html {
      font-family: ${fontFamily};
    }
    body {
      background-color: ${themeColor};
    }

    noscript {
      color: magenta;
      text-align: center;
    }
  </style>
</head>
<body>
  <header>
    <h1>${appName}</h1>
    <p>${appDescription}</p>
  </header>

  <noscript>
    <p>Opsss... your JavaScript looks disabled 😒</p>
  </noscript>
</body>
</html>`
  return minified(content)
}

export function pageNotFoundHtml({ appName }) {
  const content = `
<!doctype html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <link rel="icon" href="data:image/x-icon;base64,AA" />
  <meta name="viewport" content="width=device-width">
  <title>${appName} - Page not found</title>
</head>
<body>
  <h1>${appName}</h1>
  <p>Page not found</p>
</body>
</html>`
  return minified(content)
}
