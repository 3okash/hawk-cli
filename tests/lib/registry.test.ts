// tests/lib/registry.test.ts
import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { mkdtempSync, rmSync } from 'fs'
import { join } from 'path'
import { tmpdir } from 'os'

let tmpDir: string
beforeEach(() => {
  tmpDir = mkdtempSync(join(tmpdir(), 'hawk-test-'))
  process.env.HAWK_HOME = tmpDir
})
afterEach(() => {
  rmSync(tmpDir, { recursive: true })
  delete process.env.HAWK_HOME
})

async function getRegistry() {
  const mod = await import('../../src/lib/registry.js?' + Date.now())
  return mod
}

describe('registry', () => {
  it('returns empty registry when no file exists', async () => {
    const { readRegistry } = await getRegistry()
    expect(readRegistry()).toEqual({ projects: {} })
  })

  it('setProject persists and getProject retrieves', async () => {
    const { setProject, getProject } = await getRegistry()
    const project = { name: 'test', profile: 'personal', path: '/tmp/test' }
    setProject(project)
    expect(getProject('test')).toMatchObject({ name: 'test', path: '/tmp/test' })
  })

  it('listProjects returns all projects', async () => {
    const { setProject, listProjects } = await getRegistry()
    setProject({ name: 'a', profile: 'personal', path: '/tmp/a' })
    setProject({ name: 'b', profile: 'work', path: '/tmp/b' })
    expect(listProjects()).toHaveLength(2)
  })

  it('removeProject deletes from registry', async () => {
    const { setProject, removeProject, getProject } = await getRegistry()
    setProject({ name: 'a', profile: 'personal', path: '/tmp/a' })
    removeProject('a')
    expect(getProject('a')).toBeUndefined()
  })
})
