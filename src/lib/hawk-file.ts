import { readFileSync, writeFileSync, existsSync } from 'fs'
import { join } from 'path'
import type { HawkFile } from './types.js'

const filePath = (dir: string) => join(dir, '.hawk')

export function readHawkFile(dir: string): HawkFile | null {
  const p = filePath(dir)
  if (!existsSync(p)) return null
  try {
    return JSON.parse(readFileSync(p, 'utf8')) as HawkFile
  } catch {
    return null
  }
}

export function writeHawkFile(dir: string, file: HawkFile): void {
  writeFileSync(filePath(dir), JSON.stringify(file, null, 2))
}

export function hasHawkFile(dir: string): boolean {
  return existsSync(filePath(dir))
}
