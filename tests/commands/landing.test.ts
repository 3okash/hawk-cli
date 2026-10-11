import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import { mkdtempSync, rmSync, readFileSync, existsSync } from 'fs'
import { join } from 'path'
import { tmpdir } from 'os'

let tmpDir: string

beforeEach(() => {
  tmpDir = mkdtempSync(join(tmpdir(), 'hawk-landing-'))
})
afterEach(() => {
  rmSync(tmpDir, { recursive: true })
})

import { landingCommand } from '../../src/commands/landing.js'

describe('landingCommand', () => {
  it('generates landing/index.html', () => {
    landingCommand(tmpDir)
    expect(existsSync(join(tmpDir, 'landing', 'index.html'))).toBe(true)
  })

  it('includes hawk branding and install command', () => {
    landingCommand(tmpDir)
    const html = readFileSync(join(tmpDir, 'landing', 'index.html'), 'utf-8')
    expect(html).toContain('npm install -g hawk-cli')
    expect(html).toContain('moksha.agency')
  })

  it('includes all major command sections', () => {
    landingCommand(tmpDir)
    const html = readFileSync(join(tmpDir, 'landing', 'index.html'), 'utf-8')
    expect(html).toContain('hawk scan')
    expect(html).toContain('hawk cd')
    expect(html).toContain('hawk dashboard')
    expect(html).toContain('hawk profile')
  })
})
