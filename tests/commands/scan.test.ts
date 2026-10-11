// tests/commands/scan.test.ts
import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { mkdtempSync, rmSync, mkdirSync, writeFileSync } from 'fs'
import { join } from 'path'
import { tmpdir } from 'os'

let tmpDir: string
let hawkHome: string

beforeEach(() => {
  tmpDir = mkdtempSync(join(tmpdir(), 'hawk-scan-'))
  hawkHome = mkdtempSync(join(tmpdir(), 'hawk-home-'))
  process.env.HAWK_HOME = hawkHome
})
afterEach(() => {
  rmSync(tmpDir, { recursive: true })
  rmSync(hawkHome, { recursive: true })
  delete process.env.HAWK_HOME
})

import { scanDir } from '../../src/commands/scan.js'

describe('scanDir', () => {
  it('finds .hawk files in nested directories', () => {
    const proj = join(tmpDir, 'proj')
    mkdirSync(proj)
    writeFileSync(join(proj, '.hawk'), JSON.stringify({ name: 'proj', profile: 'personal' }))

    const found = scanDir(tmpDir)
    expect(found).toHaveLength(1)
    expect(found[0].name).toBe('proj')
  })

  it('skips node_modules', () => {
    const nm = join(tmpDir, 'node_modules', 'proj')
    mkdirSync(nm, { recursive: true })
    writeFileSync(join(nm, '.hawk'), JSON.stringify({ name: 'inside-nm', profile: 'p' }))

    expect(scanDir(tmpDir)).toHaveLength(0)
  })

  it('does not recurse into registered projects', () => {
    const outer = join(tmpDir, 'outer')
    mkdirSync(join(outer, 'inner'), { recursive: true })
    writeFileSync(join(outer, '.hawk'), JSON.stringify({ name: 'outer', profile: 'p' }))
    writeFileSync(join(outer, 'inner', '.hawk'), JSON.stringify({ name: 'inner', profile: 'p' }))

    const found = scanDir(tmpDir)
    expect(found).toHaveLength(1)
    expect(found[0].name).toBe('outer')
  })
})
