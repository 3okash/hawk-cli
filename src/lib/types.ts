export interface HawkFile {
  name: string
  profile: string
  github?: string      // "owner/repo"
  vercel?: string      // Vercel project name
  devCommand?: string  // e.g. "npm run dev"
  tags?: string[]
  notes?: string
}

export interface Project extends HawkFile {
  path: string
  syncedAt?: string
}

export interface Profile {
  githubToken?: string
  vercelToken?: string
}

export type ProfilesStore = Record<string, Profile>

export interface Config {
  editor?: string
  scanDirs?: string[]
  defaultProfile?: string
}

export interface Registry {
  projects: Record<string, Project>
}
