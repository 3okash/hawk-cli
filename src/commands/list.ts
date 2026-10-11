import { listProjects } from '../lib/registry.js'
import chalk from 'chalk'

export function listCommand(): void {
  const projects = listProjects()
  if (projects.length === 0) {
    console.log(chalk.yellow('No projects. Run: hawk scan  or  hawk init'))
    return
  }
  console.log()
  for (const p of projects) {
    console.log(
      chalk.bold(p.name.padEnd(22)) +
      chalk.gray(p.profile.padEnd(14)) +
      chalk.cyan(p.path)
    )
    if (p.github) console.log('  ' + chalk.gray(`github:  ${p.github}`))
    if (p.vercel) console.log('  ' + chalk.gray(`vercel:  ${p.vercel}`))
  }
  console.log()
}
