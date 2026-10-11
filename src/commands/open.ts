import { select, isCancel, cancel } from '@clack/prompts'
import { getProject } from '../lib/registry.js'
import { getEditor } from '../lib/config.js'
import open from 'open'
import { execSync } from 'child_process'
import chalk from 'chalk'

export async function openCommand(name: string): Promise<void> {
  const project = getProject(name)
  if (!project) {
    console.error(chalk.red(`Project '${name}' not found. Run: hawk list`))
    process.exit(1)
  }

  const editor = getEditor()
  const options: { value: string; label: string }[] = [
    { value: 'editor', label: `Open in ${editor}` },
  ]
  if (project.github) options.push({ value: 'github', label: `GitHub — ${project.github}` })
  if (project.vercel) options.push({ value: 'vercel', label: `Vercel dashboard` })
  if (project.devCommand) options.push({ value: 'dev', label: `Run dev server (${project.devCommand})` })

  const choice = await select({ message: `Open ${chalk.bold(project.name)}`, options })
  if (isCancel(choice)) { cancel('Cancelled.'); return }

  switch (choice as string) {
    case 'editor':
      execSync(`${editor} "${project.path}"`, { stdio: 'inherit' })
      break
    case 'github':
      await open(`https://github.com/${project.github}`)
      break
    case 'vercel':
      await open(`https://vercel.com/dashboard`)
      break
    case 'dev':
      execSync(project.devCommand!, { cwd: project.path, stdio: 'inherit' })
      break
  }
}
