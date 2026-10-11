// src/commands/cd.ts
import { getProject } from '../lib/registry.js'

// Called internally by the shell wrapper as `hawk _resolve-path <name>`.
// Prints the absolute path to stdout; the shell function then cd's to it.
export function resolvePathCommand(name: string): void {
  const project = getProject(name)
  if (!project) {
    process.stderr.write(`hawk: project '${name}' not found\n`)
    process.exit(1)
  }
  process.stdout.write(project.path)
}
