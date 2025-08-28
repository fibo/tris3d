import { basename, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

/**
 * Detect if module is called as script.
 *
 * @example
 * if (isMainModule(import.meta.url)) {
 *  // do something
 * }
 */
export function isMainModule(metaUrl) {
  const scriptPath = resolve(process.argv[1])
  const modulePath = fileURLToPath(metaUrl)
  return basename(modulePath) === basename(scriptPath)
}
