import { strict as assert } from 'node:assert'
import { test } from 'node:test'
import { appName, appDescription, fontFamily, themeColor } from '@tris3d/design'
import { indexHtml } from '#src/html.js'

test('index.html', () => {
  // TCP slow start is an algorithm used by servers to find out how many packets it can send at a time.
  // Most web servers TCP slow start algorithm starts by sending 10 TCP packets.
  // The maximum size of a TCP packet is 1500 bytes.
  // Each TCP packet uses 40 bytes in its header — 16 bytes for IP and an additional 24 bytes for TCP
  // That leaves 1460 bytes per TCP packet. 10 x 1460 = 14600 bytes or roughly 14kB!
  const content = indexHtml({
    appName,
    appDescription,
    fontFamily,
    themeColor,
    manifestJson: 'manifest.json',
  })
  const { size } = new Blob([content])

  const indentation = ' '.repeat('AssertionError [ERR_ASSERTION]: '.length)
  const message = [
    `PWA index.html is too big, it's ${size} bytes.`,
    'It should be less than 14kB.'
  ].join('\n' + indentation)

  assert(new Blob([content]).size < 14600, message)
})
