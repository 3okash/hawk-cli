import ora from 'ora'
import chalk from 'chalk'
import { listProjects, getProject } from '../lib/registry.js'
import { getProfile } from '../lib/profiles.js'
import { getRepoStatus } from '../lib/github.js'

export async function statusCommand(name?: string): Promise<void> {
  const projects = name
    ? (() => { const p = getProject(name); return p ? [p] : [] })()
    : listProjects().filter(p => p.github)

  if (projects.length === 0) {
    console.log(name
      ? chalk.red(`Project '${name}' not found.`)
      : chalk.yellow('No projects with GitHub repos. Run: hawk sync'))
    return
  }

  for (const project of projects) {
    if (!project.github) {
      console.log(chalk.gray(`${project.name}: no GitHub repo configured`))
      continue
    }

    const profile = getProfile(project.profile)
    if (!profile?.githubToken) {
      console.log(chalk.yellow(`${project.name}: no GitHub token for profile "${project.profile}". Run: hawk profile add`))
      continue
    }

    const spinner = ora(`Fetching status for ${project.name}...`).start()
    const status = await getRepoStatus(profile.githubToken, project.github)

    if (!status) {
      spinner.fail(`${project.name}: failed to fetch status`)
      continue
    }

    spinner.stop()
    const ciColor = status.ciStatus === 'passing' ? chalk.green : status.ciStatus === 'failing' ? chalk.red : chalk.yellow
    console.log()
    console.log(chalk.bold(project.name) + chalk.gray(` (${project.github})`))
    console.log(`  Branch:      ${status.defaultBranch}`)
    console.log(`  Last commit: ${chalk.gray(new Date(status.lastCommit).toLocaleString())} — ${status.lastCommitMsg}`)
    console.log(`  CI:          ${ciColor(status.ciStatus)}`)
    if (status.openPRs.length > 0) {
      console.log(`  Open PRs:    ${status.openPRs.length}`)
      for (const pr of status.openPRs) {
        console.log(`    #${pr.number} ${pr.title}`)
        console.log(`    ${chalk.cyan(pr.url)}`)
      }
    } else {
      console.log(`  Open PRs:    ${chalk.gray('none')}`)
    }
  }
  console.log()
}
