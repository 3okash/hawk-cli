export interface VercelDeployment {
  uid: string
  url: string            // e.g. "my-project-abc123.vercel.app"
  state: 'READY' | 'ERROR' | 'BUILDING' | 'CANCELED' | string
  createdAt: number      // unix ms timestamp
  target: 'production' | 'preview' | null
  gitBranch: string | null
}

export interface VercelProject {
  id: string
  name: string
  latestDeployments: VercelDeployment[]
}

// Returns null if token missing or request fails
// Returns null if token missing or request fails
export async function getProjectDeployments(vercelToken: string, projectName: string): Promise<VercelDeployment[] | null> {
  try {
    const url = `https://api.vercel.com/v6/deployments?projectId=${encodeURIComponent(projectName)}&limit=5`
    const response = await fetch(url, {
      headers: { Authorization: `Bearer ${vercelToken}` },
    })
    if (!response.ok) return null
    const data = await response.json() as { deployments: Array<{
      uid: string
      url: string
      state: string
      createdAt: number
      target: 'production' | 'preview' | null
      meta?: { githubCommitRef?: string }
    }> }
    return data.deployments.map((d) => ({
      uid: d.uid,
      url: d.url,
      state: d.state,
      createdAt: d.createdAt,
      target: d.target,
      gitBranch: d.meta?.githubCommitRef ?? null,
    }))
  } catch {
    return null
  }
}

// Returns list of all Vercel projects for the token
// Returns list of all Vercel projects for the token
export async function listVercelProjects(vercelToken: string): Promise<VercelProject[]> {
  try {
    const response = await fetch('https://api.vercel.com/v9/projects?limit=100', {
      headers: { Authorization: `Bearer ${vercelToken}` },
    })
    if (!response.ok) return []
    const data = await response.json() as { projects: Array<{
      id: string
      name: string
      latestDeployments?: Array<{
        uid: string
        url: string
        state: string
        createdAt: number
        target: 'production' | 'preview' | null
        meta?: { githubCommitRef?: string }
      }>
    }> }
    return data.projects.map((p) => ({
      id: p.id,
      name: p.name,
      latestDeployments: (p.latestDeployments ?? []).map((d) => ({
        uid: d.uid,
        url: d.url,
        state: d.state,
        createdAt: d.createdAt,
        target: d.target,
        gitBranch: d.meta?.githubCommitRef ?? null,
      })),
    }))
  } catch {
    return []
  }
}
