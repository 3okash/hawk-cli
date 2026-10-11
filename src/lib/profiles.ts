import { readFileSync, writeFileSync, existsSync, chmodSync } from 'fs'
import { join } from 'path'
import { hawkDir, ensureHawkDir } from './storage.js'
import type { Profile, ProfilesStore } from './types.js'

const profilesPath = () => join(hawkDir(), 'profiles.json')

export function readProfiles(): ProfilesStore {
  ensureHawkDir()
  if (!existsSync(profilesPath())) return {}
  try {
    return JSON.parse(readFileSync(profilesPath(), 'utf8')) as ProfilesStore
  } catch {
    return {}
  }
}

export function writeProfiles(profiles: ProfilesStore): void {
  ensureHawkDir()
  writeFileSync(profilesPath(), JSON.stringify(profiles, null, 2))
  chmodSync(profilesPath(), 0o600)
}

export function getProfile(name: string): Profile | undefined {
  return readProfiles()[name]
}

export function setProfile(name: string, profile: Profile): void {
  const profiles = readProfiles()
  profiles[name] = profile
  writeProfiles(profiles)
}

export function listProfileNames(): string[] {
  return Object.keys(readProfiles())
}
