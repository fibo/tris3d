import { exec } from 'node:child_process'
import os from 'node:os'

export function openBrowser({ port }) {
  const baseUrl = `http://localhost:${port}/`
  switch (os.platform()) {
    case 'darwin': exec(`open ${baseUrl}`)
    case 'linux': exec(`xdg-open ${baseUrl}`)
    case 'win32': exec(`start ${baseUrl}`)
    default: console.info(`Server started on ${baseUrl}`)
  }
}
