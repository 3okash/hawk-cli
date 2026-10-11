// tests/lib/config.test.ts
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

async function getConfig() {
  return import('../../src/lib/config.js?' + Date.now())
}

describe('config', () => {
  it('returns empty config when no file exists', async () => {
    const { readConfig } = await getConfig()
    expect(readConfig()).toEqual({})
  })

  it('writeConfig and readConfig round-trip', async () => {
    const { writeConfig, readConfig } = await getConfig()
    writeConfig({ editor: 'cursor', scanDirs: ['~/projects'] })
    expect(readConfig()).toEqual({ editor: 'cursor', scanDirs: ['~/projects'] })
  })

  it('getEditor falls back to vim when not configured', async () => {
    const { getEditor } = await getConfig()
    delete process.env.EDITOR
    expect(getEditor()).toBe('vim')
  })
})
