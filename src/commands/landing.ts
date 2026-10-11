import { writeFileSync, mkdirSync } from 'fs'
import { join } from 'path'
import chalk from 'chalk'

const HAWK_PATH = `M32 5 C35 9,38 14,38 19 C50 14,60 10,62 13 C60 18,56 23,53 25 C46 28,40 29,38 30 L38 44 C38 50,41 54,43 60 C39 56,35 53,32 51 C29 53,25 56,21 60 C23 54,26 50,26 44 L26 30 C24 29,18 28,11 25 C8 23,4 18,2 13 C4 10,14 14,26 19 C26 14,29 9,32 5 Z`

const GH_ICON = `<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/></svg>`

// Inline SVG favicon (data URI) · hawk silhouette on black bg
const FAVICON = `data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'><rect width='64' height='64' rx='14' fill='%230f0f0f'/><path fill='white' d='M32 5 C35 9,38 14,38 19 C50 14,60 10,62 13 C60 18,56 23,53 25 C46 28,40 29,38 30 L38 44 C38 50,41 54,43 60 C39 56,35 53,32 51 C29 53,25 56,21 60 C23 54,26 50,26 44 L26 30 C24 29,18 28,11 25 C8 23,4 18,2 13 C4 10,14 14,26 19 C26 14,29 9,32 5 Z'/></svg>`

const SEO_INDEX = `
  <meta name="description" content="hawk is a Node.js CLI that tracks every project on your machine · local directories, GitHub repos, and Vercel deployments · across multiple accounts. Jump to any project by name with hawk cd.">
  <meta name="keywords" content="hawk, hawk-cli, developer tool, CLI, project manager, terminal, GitHub, Vercel, npm, Node.js, developer productivity">
  <meta name="author" content="moksha.agency">
  <meta property="og:title" content="hawk · project command center">
  <meta property="og:description" content="All your projects, one name. Jump to any project from any terminal. Check GitHub and Vercel status without opening a browser.">
  <meta property="og:type" content="website">
  <meta property="og:url" content="https://github.com/3okash/hawk">
  <meta name="twitter:card" content="summary">
  <meta name="twitter:title" content="hawk · project command center">
  <meta name="twitter:description" content="A CLI that tracks every project on your machine. hawk cd project-name from anywhere.">
  <link rel="canonical" href="https://github.com/3okash/hawk">
  <link rel="icon" href="${FAVICON}">`

const SEO_BLOG = `
  <meta name="description" content="How hawk, a Node.js CLI, solves the daily friction of managing many projects across multiple directories and GitHub/Vercel accounts.">
  <meta name="keywords" content="hawk-cli, developer tool, CLI, project manager, terminal productivity, GitHub, Vercel, Node.js">
  <meta name="author" content="moksha.agency">
  <meta property="og:title" content="Introducing hawk · a project command center for your terminal">
  <meta property="og:description" content="How hawk solves the daily friction of managing many projects across multiple directories and GitHub/Vercel accounts.">
  <meta property="og:type" content="article">
  <meta property="article:published_time" content="2026-10-11">
  <meta property="article:author" content="moksha.agency">
  <meta name="twitter:card" content="summary">
  <meta name="twitter:title" content="Introducing hawk · a project command center for your terminal">
  <meta name="twitter:description" content="How hawk solves the daily friction of managing many projects across multiple directories and GitHub/Vercel accounts.">
  <link rel="icon" href="${FAVICON}">`

const LLMS_TXT = `# hawk-cli

> hawk is a Node.js CLI tool (npm package: hawk-cli) for developers who manage many projects across multiple local directories, GitHub accounts, and Vercel deployments.

## What it does

- Registers projects by name in a central registry (~/.hawk/registry.json)
- Lets you jump to any project from any terminal with: hawk cd <name>
- Shows GitHub status (open PRs, CI results, last commit) without a browser
- Shows Vercel deployment URLs and status without a browser
- Manages multiple GitHub and Vercel accounts through named profiles
- Provides a terminal dashboard (hawk dashboard) showing all projects at once
- Supports tab completion for project names in zsh and bash

## Install

\`\`\`sh
npm install -g hawk-cli
hawk shell-init --install  # adds cd + tab complete to ~/.zshrc
source ~/.zshrc
hawk scan ~/projects       # register all existing projects
\`\`\`

## Key commands

- hawk scan [dir]         · walk directory tree, register all projects
- hawk cd <name>          · jump to a project directory by name
- hawk list               · list all registered projects
- hawk status [name]      · open PRs, CI status, last commit (via GitHub API)
- hawk hosting [name]     · Vercel deployment URL and last deploy info
- hawk dashboard          · full terminal table of all projects with drill-down
- hawk open <name>        · open in editor, GitHub, Vercel, or run dev server
- hawk init               · create a .hawk file in the current directory
- hawk add                · register an existing project by path
- hawk sync               · pull GitHub repos + Vercel projects for a profile
- hawk profile add        · add a named profile (GitHub token + Vercel token)
- hawk shell-init         · print shell snippet, or --install to add to .zshrc

## How projects are stored

Each project has a .hawk JSON file in its root directory containing:
- name: the short name used in all hawk commands
- profile: which account this project belongs to (e.g. personal, work, client-acme)
- github: optional "owner/repo" for GitHub integration
- vercel: optional Vercel project name for deployment info
- devCommand: optional command to run the local dev server (used by hawk open)

The central registry is at ~/.hawk/registry.json.
Named profiles (GitHub + Vercel tokens) are at ~/.hawk/profiles.json (chmod 600).

## Links

- npm: https://www.npmjs.com/package/hawk-cli
- GitHub: https://github.com/3okash/hawk
- Made by: https://moksha.agency
`

const NAV = `<nav>
  <a class="nav-logo" href="index.html">
    <svg width="28" height="28" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg"><path fill="#2a2a2e" d="${HAWK_PATH}"/></svg>
    hawk
  </a>
  <div class="nav-links">
    <a href="index.html#features">Features</a>
    <a href="index.html#commands">Commands</a>
    <a href="https://github.com/3okash/hawk" target="_blank">Docs</a>
    <a class="nav-gh" href="https://github.com/3okash/hawk" target="_blank">${GH_ICON} GitHub</a>
  </div>
</nav>`

const FOOTER = `<footer>
  <div class="footer-left">Powered by <a href="https://moksha.agency" target="_blank">moksha.agency</a></div>
  <div class="footer-right">
    <svg width="16" height="16" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg"><path fill="#2a2a2e" d="${HAWK_PATH}"/></svg>
    <span>hawk-cli</span>
  </div>
</footer>`

const BASE_CSS = `
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
:root {
  --ink: #2a2a2e;
  --ink-soft: #2a2a2a;
  --muted: #666;
  --faint: #aaa;
  --border: #e0e0e0;
  --border-soft: #f0f0f0;
  --surface: #f6f6f6;
  --white: #fff;
  --green: #16a34a;
  --mono: 'JetBrains Mono', ui-monospace, monospace;
  --sans: 'Space Mono', ui-monospace, monospace;
}
html { scroll-behavior: smooth; }
body { font-family: var(--sans); background: var(--white); color: var(--ink); -webkit-font-smoothing: antialiased; line-height: 1.6; }

nav {
  position: sticky; top: 0; z-index: 50;
  display: flex; align-items: center; justify-content: space-between;
  padding: 0 48px; height: 68px;
  background: rgba(255,255,255,0.9);
  backdrop-filter: blur(24px); -webkit-backdrop-filter: blur(24px);
  border-bottom: 1px solid var(--border-soft);
}
.nav-logo {
  display: flex; align-items: center; gap: 10px;
  text-decoration: none; color: var(--ink);
  font-weight: 800; font-size: 18px; letter-spacing: -0.5px;
}
.nav-links { display: flex; align-items: center; gap: 2px; }
.nav-links a {
  font-size: 15px; font-weight: 500; color: var(--muted);
  text-decoration: none; padding: 7px 14px; border-radius: 8px;
  transition: color .15s, background .15s;
}
.nav-links a:hover { color: var(--ink); background: var(--surface); }
.nav-gh {
  display: inline-flex; align-items: center; gap: 7px;
  margin-left: 8px; padding: 9px 18px; border-radius: 10px;
  background: var(--ink); color: var(--white) !important;
  font-size: 14px; font-weight: 700; text-decoration: none;
  transition: opacity .15s;
}
.nav-gh:hover { opacity: 0.78; }
.nav-gh svg { flex-shrink: 0; }

footer { border-top: 1px solid var(--border-soft); padding: 30px 48px; display: flex; align-items: center; justify-content: space-between; }
.footer-left { font-size: 15px; color: var(--faint); }
.footer-left a { color: var(--muted); text-decoration: none; font-weight: 700; transition: color .15s; }
.footer-left a:hover { color: var(--ink); }
.footer-right { display: flex; align-items: center; gap: 8px; opacity: 0.2; }
.footer-right span { font-size: 12px; font-weight: 800; letter-spacing: 0.05em; }
`

const INDEX_HTML = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>hawk · project command center</title>
${SEO_INDEX}
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Space+Mono:ital,wght@0,400;0,700;1,400;1,700&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
<style>
${BASE_CSS}

/* ── Hero ── */
.hero-wrap {
  background: radial-gradient(ellipse 100% 80% at 50% -10%, #f2f2f2 0%, #fff 55%);
  border-bottom: 1px solid var(--border-soft);
}
.hero {
  display: grid; grid-template-columns: 1fr 1fr;
  gap: 64px; align-items: center;
  max-width: 1200px; margin: 0 auto;
  padding: 108px 48px 120px;
}
@media (max-width: 860px) { .hero { grid-template-columns: 1fr; } .hero-term { display: none; } }

h1 {
  font-size: clamp(48px, 7vw, 84px);
  font-weight: 700; letter-spacing: -2px; line-height: 1.0;
  color: var(--ink); margin-bottom: 28px;
}
h1 em { font-style: italic; font-weight: 300; color: #aaa; }
.hero-desc {
  font-size: 19px; line-height: 1.75; color: var(--muted);
  max-width: 440px; margin-bottom: 44px; font-weight: 400;
}
.hero-desc code { font-family: var(--mono); font-size: 15px; background: var(--surface); padding: 2px 9px; border-radius: 6px; color: var(--ink-soft); border: 1px solid var(--border); }

.install-box {
  display: inline-flex; align-items: stretch;
  border: 1.5px solid var(--border); border-radius: 14px; overflow: hidden;
  margin-bottom: 20px;
  box-shadow: 0 4px 16px rgba(0,0,0,0.07);
}
.install-cmd {
  font-family: var(--mono); font-size: 15px; font-weight: 500;
  padding: 15px 24px; background: var(--surface); color: var(--ink);
  border-right: 1.5px solid var(--border);
}
.install-cmd .dollar { color: #ccc; margin-right: 10px; user-select: none; }
.copy-btn {
  padding: 15px 20px; background: var(--white); border: none; cursor: pointer;
  font-family: var(--sans); font-size: 14px; font-weight: 700;
  color: var(--muted); transition: background .15s, color .15s;
}
.copy-btn:hover { background: var(--surface); color: var(--ink); }

.hero-sub { font-size: 14px; color: #bbb; line-height: 1.9; }
.hero-sub a { color: var(--muted); text-decoration: none; border-bottom: 1px solid var(--border); transition: color .15s, border-color .15s; }
.hero-sub a:hover { color: var(--ink); border-color: var(--ink); }
.hero-sub code { font-family: var(--mono); font-size: 13px; background: var(--surface); padding: 2px 7px; border-radius: 5px; color: var(--ink-soft); }

/* ── Terminal ── */
.terminal {
  background: #1c1c20;
  border: 1px solid #2e2e32;
  border-radius: 16px; overflow: hidden;
  box-shadow: 0 40px 100px rgba(0,0,0,0.32), 0 8px 30px rgba(0,0,0,0.16);
}
.term-bar {
  display: flex; align-items: center; gap: 8px;
  padding: 15px 20px; background: #2a2a2e;
  border-bottom: 1px solid #2e2e32;
}
.tbar-dot { width: 13px; height: 13px; border-radius: 50%; flex-shrink: 0; }
.tbar-red { background: #ff5f57; } .tbar-yellow { background: #febc2e; } .tbar-green { background: #28c840; }
.term-title { font-family: var(--mono); font-size: 12px; color: #2c2c2c; margin: 0 auto; padding-right: 42px; }
.term-body { padding: 26px 30px 32px; font-family: var(--mono); font-size: 13.5px; line-height: 2.0; }
.t-line { display: block; white-space: pre; }
.t-prompt { color: #252525; }
.t-prompt-2 { color: #1a6636; }
.t-cmd { color: #d8d8d8; }
.t-success { color: #16a34a; }
.t-warn { color: #b45309; }
.t-live { color: #6d28d9; }
.t-dim { color: #36363a; }
.t-name { color: #888; }
.t-name-hi { color: #c4c4c4; font-weight: 500; }
.t-path { color: #2e2e2e; }
.t-head { color: #282828; letter-spacing: 0.06em; font-size: 11px; text-transform: uppercase; }
.t-rule { color: #2e2e32; }
.t-gap { display: block; height: 10px; }
.t-gap-sm { display: block; height: 5px; }
.t-sep { display: block; height: 16px; }
.t-cursor { display: inline-block; width: 8px; height: 15px; background: #252525; vertical-align: middle; margin-left: 1px; animation: blink 1.1s step-end infinite; }
@keyframes blink { 50% { opacity: 0; } }

/* ── Section label ── */
.section-label { font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.12em; color: var(--faint); margin-bottom: 16px; }

/* ── Features (dark) ── */
.features { background: #1c1c20; padding: 120px 48px; }
.features-inner { max-width: 1200px; margin: 0 auto; }
.features-inner .section-label { color: #444; }
.features-inner h2 {
  font-size: clamp(34px, 4.5vw, 60px);
  font-weight: 700; letter-spacing: -1.5px; line-height: 1.05;
  color: #fff; margin-bottom: 20px;
}
.features-inner h2 em { font-style: italic; font-weight: 300; color: #444; }
.features-inner > p { font-size: 19px; color: #555; max-width: 520px; margin-bottom: 72px; line-height: 1.7; }

.feature-grid {
  display: grid; grid-template-columns: repeat(3, 1fr);
  gap: 1px; background: #2e2e32;
  border: 1px solid #2e2e32; border-radius: 18px; overflow: hidden;
}
@media (max-width: 760px) { .feature-grid { grid-template-columns: 1fr; } }
.feature { background: #212125; padding: 44px; transition: background .2s; }
.feature:hover { background: #202024; }
.f-icon {
  width: 48px; height: 48px; border-radius: 12px;
  background: #323236; border: 1px solid #2a2a2a;
  display: flex; align-items: center; justify-content: center;
  margin-bottom: 24px;
}
.feature h3 { font-size: 16px; font-weight: 700; letter-spacing: -0.3px; margin-bottom: 12px; color: #e0e0e0; }
.feature p { font-size: 15px; color: #555; line-height: 1.75; }
.feature p code { font-family: var(--mono); font-size: 13px; background: #2e2e32; padding: 2px 8px; border-radius: 5px; color: #999; }

/* ── Before / After ── */
.before-after { max-width: 1200px; margin: 0 auto; padding: 120px 48px; }
.before-after h2 { font-size: clamp(34px, 4.5vw, 60px); font-weight: 700; letter-spacing: -1.5px; line-height: 1.05; margin-bottom: 16px; }
.before-after > p { font-size: 19px; color: var(--muted); margin-bottom: 60px; }
.ba-cols { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
@media (max-width: 720px) { .ba-cols { grid-template-columns: 1fr; } }
.ba-card { border-radius: 16px; overflow: hidden; border: 1.5px solid var(--border); }
.ba-card-head { padding: 18px 26px; display: flex; align-items: center; gap: 10px; border-bottom: 1.5px solid var(--border); }
.ba-card-head span { font-size: 12px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.1em; }
.ba-before .ba-card-head { background: #f8f8f8; }
.ba-before .ba-card-head span { color: #bbb; }
.ba-after .ba-card-head { background: #1c1c20; border-bottom-color: #36363a; }
.ba-after .ba-card-head span { color: #3a3a3a; }
.ba-dot { width: 8px; height: 8px; border-radius: 50%; }
.ba-before .ba-dot { background: #d0d0d0; }
.ba-after .ba-dot { background: var(--green); }
.ba-body { padding: 32px 26px; }
.ba-before .ba-body { background: #f8f8f8; }
.ba-after .ba-body { background: #1c1c20; }
.ba-item { display: flex; gap: 14px; margin-bottom: 20px; }
.ba-item:last-child { margin-bottom: 0; }
.ba-icon { font-size: 17px; flex-shrink: 0; margin-top: 2px; }
.ba-text { font-size: 15px; line-height: 1.6; }
.ba-before .ba-text { color: #888; }
.ba-before .ba-text em { color: #bbb; font-style: italic; }
.ba-after .ba-text { color: #444; }
.ba-after .ba-text code { font-family: var(--mono); font-size: 13px; color: #ccc; background: #28282c; padding: 2px 9px; border-radius: 5px; }

/* ── Commands ── */
.commands-section { background: var(--surface); border-top: 1.5px solid var(--border); border-bottom: 1.5px solid var(--border); padding: 120px 48px; }
.commands-inner { max-width: 1200px; margin: 0 auto; }
.commands-inner h2 { font-size: clamp(34px, 4.5vw, 60px); font-weight: 700; letter-spacing: -1.5px; line-height: 1.05; margin-bottom: 16px; }
.commands-inner > p { font-size: 19px; color: var(--muted); margin-bottom: 64px; }
.commands-inner > p code { font-family: var(--mono); font-size: 15px; background: #e8e8e8; padding: 3px 10px; border-radius: 6px; color: var(--ink-soft); }
.cmd-cols { display: grid; grid-template-columns: 1fr 1fr; gap: 52px 80px; }
@media (max-width: 720px) { .cmd-cols { grid-template-columns: 1fr; } }
.cmd-group-title { font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.14em; color: var(--faint); margin-bottom: 18px; }
.cmd-item { padding: 15px 0; border-bottom: 1px solid #e4e4e4; }
.cmd-item:last-child { border-bottom: none; }
.cmd-mono { font-family: var(--mono); font-size: 14px; color: var(--ink); font-weight: 500; margin-bottom: 4px; }
.cmd-mono .cmd-arg { color: var(--muted); font-weight: 400; }
.cmd-detail { font-size: 14px; color: var(--muted); }

/* ── CTA ── */
.cta { max-width: 1200px; margin: 0 auto; padding: 120px 48px; text-align: center; }
.cta h2 { font-size: clamp(36px, 5vw, 68px); font-weight: 700; letter-spacing: -2px; margin-bottom: 20px; line-height: 1.02; }
.cta h2 em { font-style: italic; font-weight: 300; color: #aaa; }
.cta p { font-size: 19px; color: var(--muted); margin-bottom: 48px; }
.cta .blog-link { display: inline-block; margin-top: 28px; font-size: 15px; color: var(--muted); text-decoration: none; border-bottom: 1px solid var(--border); transition: color .15s, border-color .15s; }
.cta .blog-link:hover { color: var(--ink); border-color: var(--ink); }
</style>
</head>
<body>

${NAV}

<!-- Hero -->
<div class="hero-wrap">
<div class="hero">
  <div class="hero-left">
    <h1>All your<br>projects,<br><em>one name.</em></h1>
    <p class="hero-desc">
      You have projects scattered across <code>~/work</code>, <code>~/personal</code>, <code>~/clients</code> · hawk registers them all by name. One command to jump anywhere. One command to check GitHub and Vercel.
    </p>
    <div class="install-box">
      <div class="install-cmd"><span class="dollar">$</span>npm install -g hawk-cli</div>
      <button class="copy-btn" onclick="navigator.clipboard.writeText('npm install -g hawk-cli');this.textContent='Copied!';setTimeout(()=>this.textContent='Copy',2000)">Copy</button>
    </div>
    <p class="hero-sub">
      Node 18+ &nbsp;·&nbsp; Then run <code>eval "$(hawk shell-init)"</code> once to enable <code>hawk cd</code> and tab complete &nbsp;·&nbsp;
      <a href="https://www.npmjs.com/package/hawk-cli" target="_blank">npmjs.com/package/hawk-cli →</a>
    </p>
  </div>

  <div class="hero-term">
    <div class="terminal">
      <div class="term-bar">
        <div class="tbar-dot tbar-red"></div>
        <div class="tbar-dot tbar-yellow"></div>
        <div class="tbar-dot tbar-green"></div>
        <span class="term-title">zsh · hawk</span>
      </div>
      <div class="term-body">
<span class="t-line"><span class="t-prompt">~ $</span> <span class="t-cmd">hawk scan ~/projects</span></span>
<span class="t-gap-sm"></span>
<span class="t-line"><span class="t-success">  ✓</span>  <span class="t-name">acme-frontend</span>    <span class="t-path">~/projects/acme-frontend</span></span>
<span class="t-line"><span class="t-success">  ✓</span>  <span class="t-name">api-service</span>      <span class="t-path">~/work/api-service</span></span>
<span class="t-line"><span class="t-success">  ✓</span>  <span class="t-name">design-system</span>    <span class="t-path">~/work/design-system</span></span>
<span class="t-line"><span class="t-success">  ✓</span>  <span class="t-name">my-portfolio</span>     <span class="t-path">~/personal/my-portfolio</span></span>
<span class="t-line"><span class="t-dim">  ─────────────────────────────────────────────</span></span>
<span class="t-line"><span class="t-dim">  4 projects registered</span></span>
<span class="t-sep"></span>
<span class="t-line"><span class="t-prompt">~ $</span> <span class="t-cmd">hawk dashboard</span></span>
<span class="t-gap-sm"></span>
<span class="t-line"><span class="t-head">  NAME              CI              DEPLOY</span></span>
<span class="t-line"><span class="t-rule">  ─────────────────────────────────────────────</span></span>
<span class="t-line">  <span class="t-name-hi">acme-frontend</span>    <span class="t-success">● passing</span>      <span class="t-live">▲ live</span></span>
<span class="t-line">  <span class="t-name-hi">api-service</span>      <span class="t-warn">⚠ 2 open PRs</span>  <span class="t-live">▲ live</span></span>
<span class="t-line">  <span class="t-name-hi">design-system</span>    <span class="t-success">● passing</span>      <span class="t-dim">-</span></span>
<span class="t-line">  <span class="t-name-hi">my-portfolio</span>     <span class="t-dim">-</span>              <span class="t-live">▲ live</span></span>
<span class="t-sep"></span>
<span class="t-line"><span class="t-prompt">~ $</span> <span class="t-cmd">hawk cd acme-frontend</span></span>
<span class="t-gap-sm"></span>
<span class="t-line"><span class="t-prompt-2">acme-frontend $</span> <span class="t-cursor"></span></span>
      </div>
    </div>
  </div>
</div>
</div>

<!-- Features (dark) -->
<section class="features" id="features">
  <div class="features-inner">
    <div class="section-label">Features</div>
    <h2>Fixes the friction<br><em>you've accepted.</em></h2>
    <p>Every feature is a direct answer to something annoying that happens every day.</p>

    <div class="feature-grid">
      <div class="feature">
        <div class="f-icon"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#555" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg></div>
        <h3>No more path hunting</h3>
        <p>You know the project exists · somewhere in <code>~/work</code> or <code>~/clients</code>. Type <code>hawk cd acme</code> from anywhere and you're there.</p>
      </div>
      <div class="feature">
        <div class="f-icon"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#555" stroke-width="2" stroke-linecap="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg></div>
        <h3>Personal, work, client · separated</h3>
        <p>Stop juggling GitHub tokens. Profiles store each set of credentials. <code>hawk sync --profile work</code> pulls only your work repos.</p>
      </div>
      <div class="feature">
        <div class="f-icon"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#555" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg></div>
        <h3>Status without a browser</h3>
        <p>Open PRs, CI pass/fail, last commit, and your live Vercel URL · all from one command. No tabs, no clicking around.</p>
      </div>
      <div class="feature">
        <div class="f-icon"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#555" stroke-width="2" stroke-linecap="round"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg></div>
        <h3>All projects in one table</h3>
        <p><code>hawk dashboard</code> shows every project · path, GitHub status, Vercel deploy · in a single table. Select any row to drill in.</p>
      </div>
      <div class="feature">
        <div class="f-icon"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#555" stroke-width="2" stroke-linecap="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg></div>
        <h3>Register everything in one scan</h3>
        <p>Run <code>hawk scan ~/projects</code> once. hawk walks the tree, finds every project, and adds them. You never touch it again.</p>
      </div>
      <div class="feature">
        <div class="f-icon"><svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#555" stroke-width="2" stroke-linecap="round"><polyline points="4 17 10 11 4 5"/><line x1="12" y1="19" x2="20" y2="19"/></svg></div>
        <h3>Tab completes project names</h3>
        <p>Press Tab after <code>hawk cd</code> and your shell lists every project. Works in zsh and bash · no memorising names.</p>
      </div>
    </div>
  </div>
</section>

<!-- Before / After -->
<section class="before-after">
  <div class="section-label">Before &amp; after</div>
  <h2>What changes.</h2>
  <p>Same projects. Completely different experience.</p>
  <div class="ba-cols">
    <div class="ba-card ba-before">
      <div class="ba-card-head"><div class="ba-dot"></div><span>Without hawk</span></div>
      <div class="ba-body">
        <div class="ba-item"><div class="ba-icon">😵</div><div class="ba-text">Remember which folder a project is buried in · <em>was it ~/work/clients/acme or ~/projects/acme-frontend?</em></div></div>
        <div class="ba-item"><div class="ba-icon">🔁</div><div class="ba-text">Switch GitHub accounts manually, update tokens in .env files, or log in and out of the CLI.</div></div>
        <div class="ba-item"><div class="ba-icon">🌐</div><div class="ba-text">Open a browser, navigate to GitHub to check PRs and CI, then another tab for Vercel to find the deploy URL.</div></div>
        <div class="ba-item"><div class="ba-icon">📋</div><div class="ba-text">Maintain a Notion doc or spreadsheet to track all active projects.</div></div>
        <div class="ba-item"><div class="ba-icon">⌨️</div><div class="ba-text">Type long, error-prone paths every time you cd into a project.</div></div>
      </div>
    </div>
    <div class="ba-card ba-after">
      <div class="ba-card-head"><div class="ba-dot"></div><span>With hawk</span></div>
      <div class="ba-body">
        <div class="ba-item"><div class="ba-icon">⚡</div><div class="ba-text"><code>hawk cd acme</code> · jump to any project by name, from anywhere.</div></div>
        <div class="ba-item"><div class="ba-icon">🔑</div><div class="ba-text"><code>hawk sync --profile work</code> · named profiles keep credentials separate. Personal, work, client.</div></div>
        <div class="ba-item"><div class="ba-icon">📊</div><div class="ba-text"><code>hawk status acme</code> · PRs, CI, last commit, and Vercel URL in the terminal. One command.</div></div>
        <div class="ba-item"><div class="ba-icon">🗂️</div><div class="ba-text"><code>hawk dashboard</code> · a live table of every project. Select any to drill in. No spreadsheet.</div></div>
        <div class="ba-item"><div class="ba-icon">🔍</div><div class="ba-text"><code>hawk scan ~/projects</code> once · hawk finds everything. Tab-complete fills names from then on.</div></div>
      </div>
    </div>
  </div>
</section>

<!-- Commands -->
<section class="commands-section" id="commands">
  <div class="commands-inner">
    <div class="section-label">Reference</div>
    <h2>All commands.</h2>
    <p>Run <code>hawk --help</code> or <code>hawk &lt;command&gt; --help</code> for details on any command.</p>
    <div class="cmd-cols">
      <div>
        <div class="cmd-group-title">Setup</div>
        <div class="cmd-item"><div class="cmd-mono">hawk init</div><div class="cmd-detail">Create a .hawk file in the current directory</div></div>
        <div class="cmd-item"><div class="cmd-mono">hawk scan <span class="cmd-arg">[dir]</span></div><div class="cmd-detail">Walk a directory tree and register all projects</div></div>
        <div class="cmd-item"><div class="cmd-mono">hawk add</div><div class="cmd-detail">Manually register a project by path</div></div>
        <div class="cmd-item"><div class="cmd-mono">hawk sync</div><div class="cmd-detail">Pull repos from GitHub + deployments from Vercel</div></div>
        <div class="cmd-item"><div class="cmd-mono">hawk edit <span class="cmd-arg">&lt;name&gt;</span></div><div class="cmd-detail">Open a project's .hawk file in your editor</div></div>
      </div>
      <div>
        <div class="cmd-group-title">Navigation</div>
        <div class="cmd-item"><div class="cmd-mono">hawk list</div><div class="cmd-detail">List all registered projects</div></div>
        <div class="cmd-item"><div class="cmd-mono">hawk cd <span class="cmd-arg">&lt;name&gt;</span></div><div class="cmd-detail">Jump to a project directory by name</div></div>
        <div class="cmd-item"><div class="cmd-mono">hawk open <span class="cmd-arg">&lt;name&gt;</span></div><div class="cmd-detail">Open in editor, GitHub, Vercel, or run dev server</div></div>
        <div class="cmd-item"><div class="cmd-mono">hawk dashboard</div><div class="cmd-detail">Terminal table of all projects with drill-down</div></div>
      </div>
      <div>
        <div class="cmd-group-title">Status</div>
        <div class="cmd-item"><div class="cmd-mono">hawk status <span class="cmd-arg">[name]</span></div><div class="cmd-detail">Open PRs, CI status, and last commit</div></div>
        <div class="cmd-item"><div class="cmd-mono">hawk hosting <span class="cmd-arg">[name]</span></div><div class="cmd-detail">Vercel deployments · URL, last deploy, branch</div></div>
      </div>
      <div>
        <div class="cmd-group-title">Profiles &amp; shell</div>
        <div class="cmd-item"><div class="cmd-mono">hawk profile add</div><div class="cmd-detail">Add a named profile with GitHub + Vercel tokens</div></div>
        <div class="cmd-item"><div class="cmd-mono">hawk profile list</div><div class="cmd-detail">List all configured profiles</div></div>
        <div class="cmd-item"><div class="cmd-mono">hawk shell-init</div><div class="cmd-detail">Print shell snippet · or --install to auto-add to .zshrc</div></div>
      </div>
    </div>
  </div>
</section>

<!-- CTA -->
<section class="cta">
  <h2>Install.<br><em>Then never hunt<br>for a path again.</em></h2>
  <p>Under a minute to set up. Works with every project you already have.</p>
  <div class="install-box" style="display:inline-flex">
    <div class="install-cmd"><span class="dollar">$</span>npm install -g hawk-cli</div>
    <button class="copy-btn" onclick="navigator.clipboard.writeText('npm install -g hawk-cli');this.textContent='Copied!';setTimeout(()=>this.textContent='Copy',2000)">Copy</button>
  </div>
  <br>
  <a class="blog-link" href="blog.html">Read the intro post →</a>
</section>

${FOOTER}

</body>
</html>`

const BLOG_HTML = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Introducing hawk · a project command center for your terminal</title>
${SEO_BLOG}
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Space+Mono:ital,wght@0,400;0,700;1,400;1,700&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
<style>
${BASE_CSS}

/* ── Blog layout ── */
.blog-hero {
  background: #1c1c20;
  padding: 96px 48px 80px;
}
.blog-hero-inner { max-width: 780px; margin: 0 auto; }
.blog-tag {
  display: inline-flex; align-items: center; gap: 8px;
  font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.12em;
  color: #3a3a3a; margin-bottom: 32px;
  border: 1px solid #36363a; border-radius: 99px; padding: 6px 14px;
}
.blog-tag-dot { width: 6px; height: 6px; border-radius: 50%; background: #16a34a; }
.blog-hero h1 {
  font-size: clamp(30px, 4vw, 52px);
  font-weight: 700; letter-spacing: -1.5px; line-height: 1.1;
  color: #fff; margin-bottom: 24px;
}
.blog-hero h1 em { font-style: italic; font-weight: 300; color: #444; }
.blog-meta { display: flex; align-items: center; gap: 20px; margin-top: 36px; }
.blog-meta-author { display: flex; align-items: center; gap: 10px; }
.blog-meta-avatar {
  width: 36px; height: 36px; border-radius: 50%; background: #323236;
  border: 1px solid #2a2a2a; display: flex; align-items: center; justify-content: center;
}
.blog-meta-avatar svg path { fill: #3a3a3a; }
.blog-meta-name { font-size: 14px; font-weight: 600; color: #555; }
.blog-meta-sep { color: #2a2a2a; font-size: 14px; }
.blog-meta-date { font-size: 14px; color: #333; }
.blog-meta-read { font-size: 14px; color: #333; }

.blog-body { max-width: 780px; margin: 0 auto; padding: 72px 48px 96px; }

.blog-body p { font-size: 18px; line-height: 1.85; color: #444; margin-bottom: 28px; }
.blog-body p:last-child { margin-bottom: 0; }
.blog-body h2 {
  font-size: 22px; font-weight: 700; letter-spacing: -0.5px;
  color: #2a2a2e; margin: 60px 0 20px; line-height: 1.25;
}
.blog-body h3 { font-size: 20px; font-weight: 700; color: #2a2a2e; margin: 40px 0 14px; }
.blog-body strong { color: #2e2e32; font-weight: 700; }
.blog-body em { font-style: italic; }
.blog-body a { color: #2a2a2e; text-decoration: none; border-bottom: 1.5px solid #e0e0e0; transition: border-color .15s; }
.blog-body a:hover { border-color: #2a2a2e; }

.blog-body pre {
  background: #1c1c20; border: 1px solid #2e2e32; border-radius: 12px;
  padding: 24px 28px; margin: 32px 0; overflow-x: auto;
}
.blog-body pre code {
  font-family: var(--mono); font-size: 14px; line-height: 1.9;
  color: #888; background: none; padding: 0; border: none; border-radius: 0;
}
.blog-body pre code .cmd { color: #d0d0d0; }
.blog-body pre code .comment { color: #2e2e2e; }
.blog-body pre code .success { color: #16a34a; }
.blog-body pre code .warn { color: #b45309; }
.blog-body pre code .live { color: #6d28d9; }
.blog-body pre code .prompt { color: #252525; }

.blog-body code {
  font-family: var(--mono); font-size: 15px;
  background: #f4f4f4; color: #2e2e32; padding: 2px 8px;
  border-radius: 5px; border: 1px solid #e8e8e8;
}

.blog-body ul { margin: 0 0 28px 0; padding-left: 24px; }
.blog-body ul li { font-size: 18px; line-height: 1.85; color: #444; margin-bottom: 10px; }
.blog-body ul li::marker { color: #ddd; }
.blog-body ul li strong { color: #2e2e32; }

.blog-callout {
  background: #f8f8f8; border: 1.5px solid #ebebeb;
  border-left: 4px solid #2a2a2e; border-radius: 12px;
  padding: 24px 28px; margin: 36px 0;
}
.blog-callout p { font-size: 17px; color: #555; margin-bottom: 0; }
.blog-callout strong { color: #2a2a2e; }

.blog-divider { border: none; border-top: 1px solid #f0f0f0; margin: 64px 0; }

.blog-footer-cta {
  background: #1c1c20; border-radius: 16px;
  padding: 48px; margin-top: 72px; text-align: center;
}
.blog-footer-cta h3 { font-size: 28px; font-weight: 800; color: #fff; letter-spacing: -1px; margin-bottom: 12px; }
.blog-footer-cta p { font-size: 17px; color: #444; margin-bottom: 28px; }
.blog-install {
  display: inline-flex; align-items: stretch;
  border: 1px solid #222; border-radius: 12px; overflow: hidden;
}
.blog-install-cmd { font-family: var(--mono); font-size: 14px; padding: 14px 22px; background: #202024; color: #aaa; border-right: 1px solid #222; }
.blog-install-cmd .dollar { color: #333; margin-right: 10px; user-select: none; }
.blog-copy-btn {
  padding: 14px 18px; background: #202024; border: none; cursor: pointer;
  font-family: var(--sans); font-size: 13px; font-weight: 700;
  color: #444; transition: background .15s, color .15s;
}
.blog-copy-btn:hover { background: #2e2e32; color: #aaa; }
</style>
</head>
<body>

${NAV}

<!-- Blog hero -->
<div class="blog-hero">
  <div class="blog-hero-inner">
    <div class="blog-tag"><div class="blog-tag-dot"></div>Announcement</div>
    <h1>Introducing hawk ·<br><em>your project command center</em></h1>
    <div class="blog-meta">
      <div class="blog-meta-author">
        <div class="blog-meta-avatar">
          <svg width="18" height="18" viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg"><path d="${HAWK_PATH}"/></svg>
        </div>
        <span class="blog-meta-name">moksha.agency</span>
      </div>
      <span class="blog-meta-sep">·</span>
      <span class="blog-meta-date">October 2026</span>
      <span class="blog-meta-sep">·</span>
      <span class="blog-meta-read">7 min read</span>
    </div>
  </div>
</div>

<!-- Blog body -->
<div class="blog-body">

<p>If you're a developer who juggles more than a handful of projects, you've probably made peace with a set of small, daily annoyances. You <code>cd</code> into the wrong folder, you try to remember which GitHub account a repo belongs to, you open three browser tabs to check whether a deployment is live. Each friction is minor on its own. Together they add up to a lot of interrupted flow.</p>

<p>hawk is a Node.js CLI that fixes all of this. It keeps a registry of every project on your machine · local directories, GitHub repos, Vercel deployments · across as many accounts as you use. One command to jump to any project by name. One command to check its status. No browser required.</p>

<h2>The problem with many projects</h2>

<p>Most developers have their work spread across several folders. A typical setup might look something like this:</p>

<pre><code>~/work/
  api-service/
  internal-dashboard/
  design-system/
~/clients/
  acme-corp/
    frontend/
    cms/
~/personal/
  portfolio/
  side-project/</code></pre>

<p>None of this is wrong · it makes sense to organise by context. But the moment you need to jump between these contexts, things get tedious. You either keep a mental map of where everything lives, or you <code>find</code> around, or you open Finder. And when you get to a project, you still need to open a browser to see whether its CI is passing or its Vercel deployment is live.</p>

<div class="blog-callout">
  <p><strong>The core problem isn't your folder structure.</strong> It's that your terminal has no shared memory of what your projects are. Every new session starts from zero.</p>
</div>

<h2>Multiple accounts make it worse</h2>

<p>If you work across a personal GitHub account, a work organisation, and one or two client accounts, the credential problem is compounded. GitHub CLI ties itself to a single account. The Vercel CLI does the same. Switching between them involves logging out and back in, or maintaining separate config files, or writing shell aliases that nobody can remember six months later.</p>

<p>hawk solves this with named profiles. You set up each account once · <code>personal</code>, <code>work</code>, <code>client-acme</code> · and hawk stores the tokens separately. Every project knows which profile it belongs to. <code>hawk sync --profile work</code> pulls only your work repos. No credential juggling.</p>

<h2>Enter hawk</h2>

<p>At its core, hawk does three things:</p>

<ul>
  <li><strong>Registers projects by name.</strong> A <code>.hawk</code> JSON file in a project's root directory tells hawk the project's name, which account it belongs to, and optionally its GitHub repo, Vercel project, and dev server command.</li>
  <li><strong>Lets you navigate by name.</strong> Once the shell integration is active, <code>hawk cd project-name</code> takes you there from anywhere on your filesystem · with tab completion.</li>
  <li><strong>Surfaces status without leaving the terminal.</strong> <code>hawk status</code> shows open PRs, CI results, and last commit. <code>hawk hosting</code> shows your live Vercel deployment URL and last deploy time.</li>
</ul>

<h2>How it works under the hood</h2>

<p>hawk stores a registry at <code>~/.hawk/registry.json</code> · a flat index of every registered project, its path, profile, and linked services. When you run <code>hawk scan ~/projects</code>, hawk walks the directory tree looking for <code>.hawk</code> files and adds each one it finds.</p>

<p>The <code>hawk cd</code> command is a shell function rather than a binary command. This is because a subprocess can't change the working directory of its parent shell · it's a fundamental limitation of how Unix processes work. The shell integration snippet (loaded via <code>eval "$(hawk shell-init)"</code>, or installed permanently with <code>hawk shell-init --install</code>) wraps the <code>hawk</code> binary in a function that intercepts the <code>cd</code> subcommand, calls <code>hawk _resolve-path &lt;name&gt;</code> internally to get the path, and then does the <code>cd</code> itself within the shell context.</p>

<h2>Getting started in under a minute</h2>

<p>Install hawk globally from npm:</p>

<pre><code><span class="prompt">$ </span><span class="cmd">npm install -g hawk-cli</span></code></pre>

<p>Install the shell integration permanently so <code>hawk cd</code> and tab completion work in every new terminal:</p>

<pre><code><span class="prompt">$ </span><span class="cmd">hawk shell-init --install</span>
<span class="success">✓ Installed hawk shell integration into ~/.zshrc</span>
<span class="prompt">$ </span><span class="cmd">source ~/.zshrc</span></code></pre>

<p>Scan your projects directory to register everything at once:</p>

<pre><code><span class="prompt">$ </span><span class="cmd">hawk scan ~/projects</span>

<span class="success">  ✓</span>  acme-frontend    ~/projects/acme-frontend
<span class="success">  ✓</span>  api-service      ~/work/api-service
<span class="success">  ✓</span>  design-system    ~/work/design-system
<span class="success">  ✓</span>  my-portfolio     ~/personal/my-portfolio
  ───────────────────────────────────
  4 projects registered</code></pre>

<p>Now jump to any of them by name:</p>

<pre><code><span class="prompt">~ $ </span><span class="cmd">hawk cd acme-frontend</span>
<span class="success">acme-frontend $</span></code></pre>

<h2>The commands you'll actually use</h2>

<h3>hawk dashboard</h3>
<p>A live table of every registered project, showing name, GitHub CI status, and Vercel deployment at a glance. You can select any project to drill into it.</p>

<pre><code><span class="prompt">~ $ </span><span class="cmd">hawk dashboard</span>

  NAME              CI              DEPLOY
  ─────────────────────────────────────────────
  acme-frontend    <span class="success">● passing</span>      <span class="live">▲ live</span>
  api-service      <span class="warn">⚠ 2 open PRs</span>  <span class="live">▲ live</span>
  design-system    <span class="success">● passing</span>      ·
  my-portfolio     ·               <span class="live">▲ live</span></code></pre>

<h3>hawk status</h3>
<p>Fetches the full GitHub status for a project · open PRs, CI result, and last commit message · without leaving the terminal.</p>

<pre><code><span class="prompt">~ $ </span><span class="cmd">hawk status acme-frontend</span>

  acme-frontend  ·  github: acme/frontend
  CI:           <span class="success">passing</span>
  Open PRs:     0
  Last commit:  feat: add dark mode toggle</code></pre>

<h3>hawk sync</h3>
<p>Pulls all repos from GitHub and all deployments from Vercel for a given profile, and updates the registry. Useful when you've created new repos or projects that hawk doesn't know about yet.</p>

<h3>hawk open</h3>
<p>Opens a project in your editor, its GitHub page, its Vercel dashboard, or starts the dev server · all without remembering which command does what for which project.</p>

<hr class="blog-divider">

<h2>What's next</h2>

<p>hawk is at v0.1 · it covers the core workflow well but there's more planned. Upcoming ideas include richer <code>hawk dashboard</code> filtering (by profile, by status), better <code>hawk open</code> browser integration, and a <code>hawk log</code> command that shows recent commits across all projects at once.</p>

<p>If you run into anything odd or have a feature you'd find useful, the repo is at <a href="https://github.com/3okash/hawk" target="_blank">github.com/3okash/hawk</a>. Issues and PRs are very welcome.</p>

<div class="blog-footer-cta">
  <h3>Try it now</h3>
  <p>One command to install. Under a minute to set up.</p>
  <div class="blog-install">
    <div class="blog-install-cmd"><span class="dollar">$</span>npm install -g hawk-cli</div>
    <button class="blog-copy-btn" onclick="navigator.clipboard.writeText('npm install -g hawk-cli');this.textContent='Copied!';setTimeout(()=>this.textContent='Copy',2000)">Copy</button>
  </div>
</div>

</div>

${FOOTER}

</body>
</html>`

export function landingCommand(outDir = process.cwd()): void {
  mkdirSync(join(outDir, 'landing'), { recursive: true })

  const indexPath = join(outDir, 'landing', 'index.html')
  writeFileSync(indexPath, INDEX_HTML, 'utf-8')

  const blogPath = join(outDir, 'landing', 'blog.html')
  writeFileSync(blogPath, BLOG_HTML, 'utf-8')

  const llmsPath = join(outDir, 'landing', 'llms.txt')
  writeFileSync(llmsPath, LLMS_TXT, 'utf-8')

  console.log(chalk.green(`Generated: ${indexPath}`))
  console.log(chalk.green(`Generated: ${blogPath}`))
  console.log(chalk.green(`Generated: ${llmsPath}`))
  console.log(chalk.gray('Deploy the landing/ folder to GitHub Pages, Vercel, or Netlify.'))
}
