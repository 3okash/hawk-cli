// tests/lib/profiles.test.ts
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

async function getProfiles() {
  return import('../../src/lib/profiles.js?' + Date.now())
}

describe('profiles', () => {
  it('returns empty object when no profiles file exists', async () => {
    const { readProfiles } = await getProfiles()
    expect(readProfiles()).toEqual({})
  })

  it('setProfile persists and getProfile retrieves', async () => {
    const { setProfile, getProfile } = await getProfiles()
    setProfile('personal', { githubToken: 'ghp_test', vercelToken: 'vtok' })
    expect(getProfile('personal')).toEqual({ githubToken: 'ghp_test', vercelToken: 'vtok' })
  })

  it('listProfileNames returns all profile names', async () => {
    const { setProfile, listProfileNames } = await getProfiles()
    setProfile('personal', {})
    setProfile('work', {})
    expect(listProfileNames()).toEqual(expect.arrayContaining(['personal', 'work']))
  })
})
