import { describe, it, expect, vi, beforeEach } from 'vitest'

const mockDeployment = {
  uid: 'dpl_123',
  url: 'my-project-abc.vercel.app',
  state: 'READY',
  createdAt: 1700000000000,
  target: 'production',
  meta: { githubCommitRef: 'main' }
}

vi.stubGlobal('fetch', vi.fn())

import { getProjectDeployments, listVercelProjects } from '../../src/lib/vercel.js'

describe('getProjectDeployments', () => {
  beforeEach(() => {
    vi.mocked(fetch).mockReset()
  })

  it('returns deployments on success', async () => {
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ deployments: [mockDeployment] })
    } as any)

    const result = await getProjectDeployments('token', 'my-project')
    expect(result).not.toBeNull()
    expect(result![0].uid).toBe('dpl_123')
    expect(result![0].gitBranch).toBe('main')
  })

  it('returns null on fetch error', async () => {
    vi.mocked(fetch).mockRejectedValueOnce(new Error('network error'))
    const result = await getProjectDeployments('token', 'my-project')
    expect(result).toBeNull()
  })

  it('returns null on non-ok response', async () => {
    vi.mocked(fetch).mockResolvedValueOnce({ ok: false, json: async () => ({}) } as any)
    const result = await getProjectDeployments('token', 'my-project')
    expect(result).toBeNull()
  })
})

describe('listVercelProjects', () => {
  beforeEach(() => {
    vi.mocked(fetch).mockReset()
  })

  it('returns projects on success', async () => {
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ projects: [{ id: 'p1', name: 'my-project', latestDeployments: [] }] })
    } as any)

    const result = await listVercelProjects('token')
    expect(result).toHaveLength(1)
    expect(result[0].name).toBe('my-project')
  })

  it('returns empty array on error', async () => {
    vi.mocked(fetch).mockRejectedValueOnce(new Error('fail'))
    const result = await listVercelProjects('token')
    expect(result).toEqual([])
  })
})
