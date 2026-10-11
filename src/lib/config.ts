import { readFileSync, writeFileSync, existsSync } from 'fs'
import { join } from 'path'
import { hawkDir, ensureHawkDir } from './storage.js'
import type { Config } from './types.js'

const configPath = () => join(hawkDir(), 'config.json')

export function readConfig(): Config {
  ensureHawkDir()
  if (!existsSync(configPath())) return {}
  try {
    return JSON.parse(readFileSync(configPath(), 'utf8')) as Config
  } catch {
    return {}
  }
}

export function writeConfig(config: Config): void {
  ensureHawkDir()
  writeFileSync(configPath(), JSON.stringify(config, null, 2))
}

export function getEditor(): string {
  return readConfig().editor ?? process.env.EDITOR ?? 'vim'
}
