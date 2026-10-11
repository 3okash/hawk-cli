import { readFileSync, writeFileSync, existsSync } from 'fs'
import { join } from 'path'
import { hawkDir, ensureHawkDir } from './storage.js'
import type { Registry, Project } from './types.js'

const registryPath = () => join(hawkDir(), 'registry.json')

export function readRegistry(): Registry {
  ensureHawkDir()
  if (!existsSync(registryPath())) return { projects: {} }
  try {
    return JSON.parse(readFileSync(registryPath(), 'utf8')) as Registry
  } catch {
    return { projects: {} }
  }
}

export function writeRegistry(registry: Registry): void {
  ensureHawkDir()
  writeFileSync(registryPath(), JSON.stringify(registry, null, 2))
}

export function getProject(name: string): Project | undefined {
  return readRegistry().projects[name]
}

export function setProject(project: Project): void {
  const registry = readRegistry()
  registry.projects[project.name] = project
  writeRegistry(registry)
}

export function removeProject(name: string): void {
  const registry = readRegistry()
  delete registry.projects[name]
  writeRegistry(registry)
}

export function listProjects(): Project[] {
  return Object.values(readRegistry().projects)
}
