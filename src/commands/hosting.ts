import ora from 'ora'
import chalk from 'chalk'
import { listProjects, getProject } from '../lib/registry.js'
import { getProfile } from '../lib/profiles.js'
import { getProjectDeployments } from '../lib/vercel.js'

export async function hostingCommand(name?: string): Promise<void> {
  const projects = name
    ? (() => { const p = getProject(name); return p ? [p] : [] })()
    : listProjects().filter(p => p.vercel)

  if (projects.length === 0) {
    console.log(name
      ? chalk.red(`Project '${name}' not found.`)
      : chalk.yellow('No projects with Vercel configured. Run: hawk sync'))
    return
  }

  for (const project of projects) {
    if (!project.vercel) {
      console.log(chalk.gray(`${project.name}: no Vercel project configured`))
      continue
    }

    const profile = getProfile(project.profile)
    if (!profile?.vercelToken) {
      console.log(chalk.yellow(`${project.name}: no Vercel token for profile "${project.profile}". Run: hawk profile add`))
      continue
    }

    const spinner = ora(`Fetching deployments for ${project.name}...`).start()
    const deployments = await getProjectDeployments(profile.vercelToken, project.vercel)

    if (!deployments) {
      spinner.fail(`${project.name}: failed to fetch deployments`)
      continue
    }

    spinner.stop()
    console.log()
    console.log(chalk.bold(project.name) + chalk.gray(` (vercel: ${project.vercel})`))

    if (deployments.length === 0) {
      console.log(chalk.gray('  No deployments found.'))
      continue
    }

    for (const d of deployments) {
      const stateColor = d.state === 'READY' ? chalk.green : d.state === 'ERROR' ? chalk.red : chalk.yellow
      const date = new Date(d.createdAt).toLocaleString()
      const target = d.target === 'production' ? chalk.bold('production') : chalk.gray('preview')
      console.log(`  ${stateColor(d.state.padEnd(10))} ${target.padEnd(12)} ${chalk.cyan('https://' + d.url)}`)
      console.log(`  ${chalk.gray(date + (d.gitBranch ? ` · branch: ${d.gitBranch}` : ''))}`)
    }
  }
  console.log()
}
