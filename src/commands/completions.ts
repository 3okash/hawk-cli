import { listProjects } from '../lib/registry.js'

export function completionsCommand(): void {
  const projects = listProjects()
  for (const p of projects) {
    process.stdout.write(p.name + '\n')
  }
}
