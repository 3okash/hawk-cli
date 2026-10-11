// src/commands/scan.ts
import { readdirSync, statSync } from 'fs'
import { join } from 'path'
import { homedir } from 'os'
import { readHawkFile } from '../lib/hawk-file.js'
import { setProject } from '../lib/registry.js'
import type { Project } from '../lib/types.js'
import chalk from 'chalk'

const SKIP = new Set(['node_modules', '.git', '.next', 'dist', 'build', '.cache', 'vendor'])

export function scanDir(dir: string, found: Project[] = []): Project[] {
  const hawkFile = readHawkFile(dir)
  if (hawkFile) {
    const project: Project = { ...hawkFile, path: dir, syncedAt: new Date().toISOString() }
    found.push(project)
    setProject(project)
    return found
  }

  let entries: string[]
  try { entries = readdirSync(dir) } catch { return found }

  for (const entry of entries) {
    if (SKIP.has(entry)) continue
    const fullPath = join(dir, entry)
    try {
      if (statSync(fullPath).isDirectory()) scanDir(fullPath, found)
    } catch { /* skip permission errors */ }
  }

  return found
}

export function scanCommand(dir?: string): void {
  const root = dir ?? homedir()
  console.log(chalk.gray(`Scanning ${root}...`))
  const found = scanDir(root)
  if (found.length === 0) {
    console.log(chalk.yellow('No .hawk files found.'))
  } else {
    console.log(chalk.green(`Found ${found.length} project(s):`))
    for (const p of found) {
      console.log(`  ${chalk.bold(p.name).padEnd(22)} ${chalk.gray(p.path)}`)
    }
  }
}
