import ora from 'ora'
import chalk from 'chalk'
import { listProfileNames, getProfile } from '../lib/profiles.js'
import { listUserRepos } from '../lib/github.js'
import { listVercelProjects } from '../lib/vercel.js'
import { setProject, getProject } from '../lib/registry.js'
import type { Project } from '../lib/types.js'

export async function syncCommand(): Promise<void> {
  const profileNames = listProfileNames()
  if (profileNames.length === 0) {
    console.log(chalk.yellow('No profiles configured. Run: hawk profile add'))
    return
  }

  let added = 0
  let updated = 0

  for (const profileName of profileNames) {
    const profile = getProfile(profileName)
    if (!profile) continue

    if (profile.githubToken) {
      const spinner = ora(`Syncing GitHub repos for profile "${profileName}"...`).start()
      try {
        const repos = await listUserRepos(profile.githubToken)
        for (const repo of repos) {
          const name = repo.fullName.split('/')[1]
          const existing = getProject(name)
          const project: Project = {
            name,
            profile: profileName,
            github: repo.fullName,
            path: existing?.path ?? '',
            syncedAt: new Date().toISOString(),
            ...(existing ?? {}),
          }
          if (existing) { updated++ } else { added++ }
          setProject(project)
        }
        spinner.succeed(`GitHub: ${repos.length} repos for "${profileName}"`)
      } catch {
        spinner.fail(`GitHub sync failed for "${profileName}"`)
      }
    }

    if (profile.vercelToken) {
      const spinner = ora(`Syncing Vercel projects for profile "${profileName}"...`).start()
      try {
        const projects = await listVercelProjects(profile.vercelToken)
        for (const vp of projects) {
          const existing = getProject(vp.name)
          const project: Project = {
            name: vp.name,
            profile: profileName,
            vercel: vp.name,
            path: existing?.path ?? '',
            syncedAt: new Date().toISOString(),
            ...(existing ?? {}),
          }
          if (existing) { updated++ } else { added++ }
          setProject(project)
        }
        spinner.succeed(`Vercel: ${projects.length} projects for "${profileName}"`)
      } catch {
        spinner.fail(`Vercel sync failed for "${profileName}"`)
      }
    }
  }

  console.log(chalk.green(`\nSync complete. Added: ${added}, updated: ${updated}`))
}
