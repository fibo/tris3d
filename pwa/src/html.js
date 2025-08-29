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
</html>
`

  return content.replace(/\n\s+/g, '').trim()
}
