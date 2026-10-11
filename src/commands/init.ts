import { intro, text, select, log, note, outro, cancel, isCancel } from '@clack/prompts'
import { writeHawkFile } from '../lib/hawk-file.js'
import { setProject } from '../lib/registry.js'
import { listProfileNames } from '../lib/profiles.js'
import type { HawkFile, Project } from '../lib/types.js'

export async function initCommand(): Promise<void> {
  intro('hawk init — register this project')

  const name = await text({
    message: 'What should this project be called?',
    placeholder: 'my-project',
  })
  if (isCancel(name)) { cancel('Cancelled.'); return }

  log.message('Profiles group projects by account so hawk can use the right GitHub/Vercel token.\nExamples: personal · work · client-acme')

  const profileNames = listProfileNames()
  let profile: string
  if (profileNames.length === 0) {
    const p = await text({
      message: 'Which account does this project belong to?',
      placeholder: 'personal',
    })
    if (isCancel(p)) { cancel('Cancelled.'); return }
    profile = p as string
  } else {
    const p = await select({
      message: 'Which account does this project belong to?',
      options: profileNames.map(n => ({ value: n, label: n })),
    })
    if (isCancel(p)) { cancel('Cancelled.'); return }
    profile = p as string
  }

  log.message('Linking a GitHub repo lets you run hawk status to see open PRs and CI results.')
  const github = await text({
    message: 'GitHub repo? (skip with Enter)',
    placeholder: 'owner/repo',
  })
  if (isCancel(github)) { cancel('Cancelled.'); return }

  log.message('Linking Vercel lets you run hawk hosting to see your live deployment URL.\nFind the project name in Vercel → Settings → General.')
  const vercel = await text({
    message: 'Vercel project name? (skip with Enter)',
    placeholder: 'my-project',
  })
  if (isCancel(vercel)) { cancel('Cancelled.'); return }

  log.message('Used by hawk open to launch your local server without remembering the command.')
  const devCommand = await text({
    message: 'Dev server command? (skip with Enter)',
    placeholder: 'npm run dev',
  })
  if (isCancel(devCommand)) { cancel('Cancelled.'); return }

  const hawkFile: HawkFile = {
    name: name as string,
    profile,
    ...(github ? { github: github as string } : {}),
    ...(vercel ? { vercel: vercel as string } : {}),
    ...(devCommand ? { devCommand: devCommand as string } : {}),
  }

  writeHawkFile(process.cwd(), hawkFile)

  const project: Project = { ...hawkFile, path: process.cwd(), syncedAt: new Date().toISOString() }
  setProject(project)

  note(
    `hawk cd ${name as string}          jump here from any terminal\n` +
    (github ? `hawk status ${name as string}      open PRs, CI, last commit\n` : '') +
    (vercel ? `hawk hosting ${name as string}     live Vercel deployment URL\n` : '') +
    `hawk dashboard           overview of all your projects`,
    'What\'s next'
  )

  outro(`✓ Registered "${name as string}" — you're all set.`)
}
