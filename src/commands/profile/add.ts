import { text, password, isCancel, cancel, intro, outro } from '@clack/prompts'
import { setProfile } from '../../lib/profiles.js'

export async function profileAddCommand(): Promise<void> {
  intro('hawk profile add')

  const name = await text({ message: 'Profile name', placeholder: 'personal' })
  if (isCancel(name)) { cancel('Cancelled.'); return }

  const githubToken = await password({ message: 'GitHub personal access token (leave blank to skip)' })
  if (isCancel(githubToken)) { cancel('Cancelled.'); return }

  const vercelToken = await password({ message: 'Vercel token (leave blank to skip)' })
  if (isCancel(vercelToken)) { cancel('Cancelled.'); return }

  setProfile(name as string, {
    ...(githubToken ? { githubToken: githubToken as string } : {}),
    ...(vercelToken ? { vercelToken: vercelToken as string } : {}),
  })

  outro(`Profile "${name as string}" saved (stored in ~/.hawk/profiles.json with chmod 600).`)
}
