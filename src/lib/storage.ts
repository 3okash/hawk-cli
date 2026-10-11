import { existsSync, mkdirSync } from 'fs'
import { join } from 'path'
import { homedir } from 'os'

export const hawkDir = () => process.env.HAWK_HOME ?? join(homedir(), '.hawk')

export function ensureHawkDir(): void {
  if (!existsSync(hawkDir())) mkdirSync(hawkDir(), { recursive: true })
}
