#!/usr/bin/env node
import { Command } from 'commander'
import { initCommand } from './commands/init.js'
import { scanCommand } from './commands/scan.js'
import { addCommand } from './commands/add.js'
import { listCommand } from './commands/list.js'
import { resolvePathCommand } from './commands/cd.js'
import { openCommand } from './commands/open.js'
import { editCommand } from './commands/edit.js'
import { shellInitCommand } from './commands/shell-init.js'
import { completionsCommand } from './commands/completions.js'
import { profileAddCommand } from './commands/profile/add.js'
import { profileListCommand } from './commands/profile/list.js'
import { syncCommand } from './commands/sync.js'
import { statusCommand } from './commands/status.js'
import { hostingCommand } from './commands/hosting.js'
import { dashboardCommand } from './commands/dashboard.js'
import { landingCommand } from './commands/landing.js'
import chalk from 'chalk'

const program = new Command()
program.name('hawk').description('Project command center').version('0.1.0')

// Setup
program.command('init').description('Create a .hawk file in the current directory').action(initCommand)
program.command('scan [dir]').description('Scan a directory tree for .hawk files and register them').action(scanCommand)
program.command('add').description('Manually register a project by path').action(addCommand)
program.command('sync').description('Pull repos from GitHub + deployments from Vercel for all profiles').action(syncCommand)

// Navigation
program.command('list').description('List all registered projects with path, profile, and links').action(listCommand)
program.command('cd <name>').description('Jump into a project directory by name (requires shell-init)').action((name: string) => {
  console.log(chalk.yellow(`Shell integration not active. Run:\n  eval "$(hawk shell-init)"\n\nThen: hawk cd ${name}`))
})
program.command('open <name>').description('Interactive menu: editor / GitHub / Vercel / dev server').action(openCommand)

// Status & Hosting
program.command('status [name]').description('Show open PRs, CI status, last commit').action(statusCommand)
program.command('hosting [name]').description('Show Vercel deployments — live URL, last deploy, branch').action(hostingCommand)

// Dashboard & Extras
program.command('dashboard').description('Terminal dashboard: table of all projects with drill-down').action(dashboardCommand)
program.command('edit <name>').description('Open a project .hawk file in your editor').action(editCommand)
program.command('landing').description('Generate the hawk marketing landing page (index.html)').action(() => landingCommand())

// Shell & Profiles
program.command('shell-init')
  .description('Print shell integration snippet for cd + tab autocomplete')
  .option('--install', 'Append the snippet to ~/.zshrc or ~/.bashrc automatically')
  .action((opts) => shellInitCommand({ install: opts.install }))

const profileCmd = program.command('profile').description('Manage named profiles (GitHub + Vercel credentials)')
profileCmd.command('add').description('Add a profile with GitHub and Vercel tokens').action(profileAddCommand)
profileCmd.command('list').description('List all configured profiles').action(profileListCommand)

// Internal (hidden from help)
program.command('_resolve-path <name>', { hidden: true }).description('Internal: resolve project path for shell cd wrapper').action(resolvePathCommand)
program.command('_completions', { hidden: true }).description('Internal: list project names for tab completion').action(completionsCommand)

program.parseAsync()
