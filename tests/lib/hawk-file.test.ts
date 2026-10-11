// tests/lib/hawk-file.test.ts
import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { mkdtempSync, rmSync } from 'fs'
import { join } from 'path'
import { tmpdir } from 'os'
import { readHawkFile, writeHawkFile, hasHawkFile } from '../../src/lib/hawk-file.js'

let tmpDir: string
beforeEach(() => { tmpDir = mkdtempSync(join(tmpdir(), 'hawk-test-')) })
afterEach(() => rmSync(tmpDir, { recursive: true }))

describe('hawk-file', () => {
  it('readHawkFile returns null when no .hawk file exists', () => {
    expect(readHawkFile(tmpDir)).toBeNull()
  })

  it('writeHawkFile and readHawkFile round-trip', () => {
    const file = { name: 'my-app', profile: 'personal', github: 'user/my-app' }
    writeHawkFile(tmpDir, file)
    expect(readHawkFile(tmpDir)).toEqual(file)
  })

  it('hasHawkFile returns false before write, true after', () => {
    expect(hasHawkFile(tmpDir)).toBe(false)
    writeHawkFile(tmpDir, { name: 'x', profile: 'p' })
    expect(hasHawkFile(tmpDir)).toBe(true)
  })
})
