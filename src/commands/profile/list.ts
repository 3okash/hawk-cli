import { readProfiles, listProfileNames } from '../../lib/profiles.js'
import chalk from 'chalk'

export function profileListCommand(): void {
  const names = listProfileNames()
  if (names.length === 0) {
    console.log(chalk.yellow('No profiles. Run: hawk profile add'))
    return
  }
  const profiles = readProfiles()
  for (const name of names) {
    const p = profiles[name]
    console.log(
      chalk.bold(name.padEnd(16)) +
      chalk.gray(`GitHub: ${p.githubToken ? '✓' : '✗'}  Vercel: ${p.vercelToken ? '✓' : '✗'}`)
    )
  }
}
