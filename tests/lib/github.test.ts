// tests/lib/github.test.ts
import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('@octokit/rest', () => ({
  Octokit: vi.fn().mockImplementation(() => ({
    repos: {
      get: vi.fn().mockResolvedValue({
        data: { default_branch: 'main', pushed_at: '2026-01-01T00:00:00Z' }
      }),
      listCommits: vi.fn().mockResolvedValue({
        data: [{ commit: { message: 'fix: update deps' } }]
      }),
      listForAuthenticatedUser: vi.fn().mockResolvedValue({
        data: [{ full_name: 'user/repo', description: 'Test', default_branch: 'main' }]
      }),
    },
    pulls: {
      list: vi.fn().mockResolvedValue({
        data: [{ number: 1, title: 'PR title', html_url: 'https://github.com/x', state: 'open' }]
      })
    },
    actions: {
      listWorkflowRunsForRepo: vi.fn().mockResolvedValue({
        data: { workflow_runs: [{ conclusion: 'success' }] }
      })
    }
  }))
}))

import { getRepoStatus, listUserRepos, getWorkflowStatus } from '../../src/lib/github.js'

describe('getRepoStatus', () => {
  it('returns repo status with PRs and CI', async () => {
    const status = await getRepoStatus('token', 'user/repo')
    expect(status).not.toBeNull()
    expect(status!.defaultBranch).toBe('main')
    expect(status!.openPRs).toHaveLength(1)
    expect(status!.ciStatus).toBe('passing')
  })

  it('returns null on error', async () => {
    const { Octokit } = await import('@octokit/rest')
    vi.mocked(Octokit).mockImplementationOnce(() => ({
      repos: { get: vi.fn().mockRejectedValue(new Error('404')) },
      pulls: { list: vi.fn() },
      actions: { listWorkflowRunsForRepo: vi.fn() },
    } as any))
    const status = await getRepoStatus('bad-token', 'user/repo')
    expect(status).toBeNull()
  })
})

describe('listUserRepos', () => {
  it('returns list of repos', async () => {
    const repos = await listUserRepos('token')
    expect(repos).toHaveLength(1)
    expect(repos[0].fullName).toBe('user/repo')
  })
})

describe('getWorkflowStatus', () => {
  it('maps success to passing', async () => {
    const status = await getWorkflowStatus('token', 'user/repo', 'main')
    expect(status).toBe('passing')
  })
})
