// src/commands/dashboard.ts
import Table from 'cli-table3'
import { select, isCancel } from '@clack/prompts'
import { listProjects } from '../lib/registry.js'
import chalk from 'chalk'

export async function dashboardCommand(): Promise<void> {
  const projects = listProjects()

  if (projects.length === 0) {
    console.log(chalk.yellow('No projects registered. Run: hawk scan  or  hawk init'))
    return
  }

  // Phase 1: table
  const table = new Table({
    head: [
      chalk.bold('Name'),
      chalk.bold('Profile'),
      chalk.bold('GitHub'),
      chalk.bold('Vercel'),
      chalk.bold('Dev'),
      chalk.bold('Path'),
    ],
    style: { head: [], border: [] },
    colWidths: [22, 12, 8, 8, 6, 40],
  })

  for (const p of projects) {
    table.push([
      chalk.bold(p.name),
      chalk.gray(p.profile),
      p.github ? chalk.green('●') : chalk.gray('○'),
      p.vercel ? chalk.green('●') : chalk.gray('○'),
      p.devCommand ? chalk.green('●') : chalk.gray('○'),
      chalk.gray(p.path.replace(process.env.HOME ?? '', '~')),
    ])
  }

  console.log()
  console.log(table.toString())
  console.log(chalk.gray(`  ${projects.length} project${projects.length === 1 ? '' : 's'} · ● = configured  ○ = not set\n`))

  // Phase 2: drill-down
  const choice = await select({
    message: 'Select a project to inspect (or press Esc to exit)',
    options: projects.map(p => ({
      value: p.name,
      label: p.name,
      hint: p.profile,
    })),
  })

  if (isCancel(choice)) return

  const project = projects.find(p => p.name === choice as string)
  if (!project) return

  console.log()
  console.log(chalk.bold(`  ${project.name}`))
  console.log(`  ${chalk.gray('Profile:')}     ${project.profile}`)
  console.log(`  ${chalk.gray('Path:')}        ${project.path}`)
  if (project.github)     console.log(`  ${chalk.gray('GitHub:')}      https://github.com/${project.github}`)
  if (project.vercel)     console.log(`  ${chalk.gray('Vercel:')}      ${project.vercel}`)
  if (project.devCommand) console.log(`  ${chalk.gray('Dev cmd:')}     ${project.devCommand}`)
  if (project.tags?.length) console.log(`  ${chalk.gray('Tags:')}        ${project.tags.join(', ')}`)
  if (project.notes)      console.log(`  ${chalk.gray('Notes:')}       ${project.notes}`)

  console.log()
  console.log(chalk.gray('  Commands:'))
  console.log(`    hawk cd ${project.name}`)
  console.log(`    hawk open ${project.name}`)
  if (project.github) console.log(`    hawk status ${project.name}`)
  if (project.vercel) console.log(`    hawk hosting ${project.name}`)
  console.log()
}
