import { text, log, isCancel, cancel, intro, note, outro } from '@clack/prompts'
import { readHawkFile } from '../lib/hawk-file.js'
import { setProject } from '../lib/registry.js'
import { resolve } from 'path'
import type { Project } from '../lib/types.js'
import chalk from 'chalk'

export async function addCommand(): Promise<void> {
  intro('hawk add — register an existing project')

  const pathInput = await text({
    message: 'Where is the project?',
    placeholder: './my-project',
  })
  if (isCancel(pathInput)) { cancel('Cancelled.'); return }

  const dir = resolve(pathInput as string)
  const hawkFile = readHawkFile(dir)

  let project: Project
  if (hawkFile) {
    project = { ...hawkFile, path: dir, syncedAt: new Date().toISOString() }
    console.log(chalk.gray(`  Found .hawk — using name "${hawkFile.name}"`))
  } else {
    const name = await text({
      message: 'What should this project be called?',
    })
    if (isCancel(name)) { cancel('Cancelled.'); return }

    log.message('Profiles group projects by account so hawk knows which GitHub/Vercel token to use.\nExamples: personal · work · client-acme')
    const profile = await text({
      message: 'Which account does this belong to?',
      placeholder: 'personal',
    })
    if (isCancel(profile)) { cancel('Cancelled.'); return }

    project = {
      name: name as string,
      profile: profile as string,
      path: dir,
      syncedAt: new Date().toISOString(),
    }
  }

  setProject(project)

  note(`hawk cd ${project.name}   jump here from any terminal`, 'What\'s next')
  outro(`✓ Registered "${project.name}"`)
}
