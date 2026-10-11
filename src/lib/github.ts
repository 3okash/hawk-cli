import { Octokit } from '@octokit/rest'

export interface RepoPR {
  number: number
  title: string
  url: string
  state: string
}

export interface RepoStatus {
  repo: string          // "owner/repo"
  defaultBranch: string
  lastCommit: string    // ISO date string
  lastCommitMsg: string
  openPRs: RepoPR[]
  ciStatus: 'passing' | 'failing' | 'pending' | 'unknown'
}

// Returns null if the token is missing or API call fails
export async function getRepoStatus(githubToken: string, ownerRepo: string): Promise<RepoStatus | null> {
  try {
    const [owner, repo] = ownerRepo.split('/')
    const octokit = new Octokit({ auth: githubToken })

    const { data: repoData } = await octokit.repos.get({ owner, repo })
    const defaultBranch = repoData.default_branch
    const lastCommit = repoData.pushed_at ?? ''

    const { data: commits } = await octokit.repos.listCommits({ owner, repo, per_page: 1 })
    const lastCommitMsg = commits[0]?.commit?.message ?? ''

    const { data: prs } = await octokit.pulls.list({ owner, repo, state: 'open' })
    const openPRs: RepoPR[] = prs.map((pr) => ({
      number: pr.number,
      title: pr.title,
      url: pr.html_url,
      state: pr.state,
    }))

    const ciStatus = await getWorkflowStatus(githubToken, ownerRepo, defaultBranch)

    return {
      repo: ownerRepo,
      defaultBranch,
      lastCommit,
      lastCommitMsg,
      openPRs,
      ciStatus,
    }
  } catch {
    return null
  }
}

// Returns list of repos for the authenticated user
export async function listUserRepos(githubToken: string): Promise<{ fullName: string; description: string; defaultBranch: string }[]> {
  try {
    const octokit = new Octokit({ auth: githubToken })
    const { data } = await octokit.repos.listForAuthenticatedUser({ per_page: 100, sort: 'updated' })
    return data.map((r) => ({
      fullName: r.full_name,
      description: r.description ?? '',
      defaultBranch: r.default_branch,
    }))
  } catch {
    return []
  }
}

// Returns latest deployment status for a repo
export async function getWorkflowStatus(githubToken: string, ownerRepo: string, branch: string): Promise<'passing' | 'failing' | 'pending' | 'unknown'> {
  try {
    const [owner, repo] = ownerRepo.split('/')
    const octokit = new Octokit({ auth: githubToken })
    const { data } = await octokit.actions.listWorkflowRunsForRepo({ owner, repo, branch, per_page: 1 })
    const runs = data.workflow_runs
    if (!runs || runs.length === 0) return 'unknown'
    const conclusion = runs[0].conclusion
    if (conclusion === 'success') return 'passing'
    if (conclusion === 'failure' || conclusion === 'timed_out') return 'failing'
    if (conclusion === null) return 'pending'
    return 'unknown'
  } catch {
    return 'unknown'
  }
}
