import { getProject } from '../lib/registry.js'
import { getEditor } from '../lib/config.js'
import { join } from 'path'
import { existsSync } from 'fs'
import { execSync } from 'child_process'
import chalk from 'chalk'

export function editCommand(name: string): void {
  const project = getProject(name)
  if (!project) {
    console.error(chalk.red(`Project '${name}' not found. Run: hawk list`))
    process.exit(1)
  }
  const hawkPath = join(project.path, '.hawk')
  if (!existsSync(hawkPath)) {
    console.error(chalk.red(`No .hawk file at ${hawkPath}`))
    process.exit(1)
  }
  execSync(`${getEditor()} "${hawkPath}"`, { stdio: 'inherit' })
}
