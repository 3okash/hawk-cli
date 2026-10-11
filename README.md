<p align="center">
  <img src="hawk.svg" width="72" height="72" alt="hawk logo">
</p>

<h1 align="center">hawk</h1>

<p align="center">All your projects, one name.</p>

<p align="center">
  <a href="https://www.npmjs.com/package/hawk-cli"><img src="https://img.shields.io/npm/v/hawk-cli?color=0f0f0f&labelColor=f5f5f5&label=npm" alt="npm"></a>
  <a href="https://github.com/3okash/hawk"><img src="https://img.shields.io/github/stars/3okash/hawk?color=0f0f0f&labelColor=f5f5f5" alt="GitHub"></a>
</p>

---

hawk tracks every project on your machine — local dirs, GitHub repos, Vercel deploys — across multiple accounts. Jump to any of them by name, from any terminal.

## Install

```sh
npm install -g hawk-cli
```

Requires Node 18+. After installing, activate shell integration once:

```sh
# Add to ~/.zshrc or ~/.bashrc
eval "$(hawk shell-init)"

# Reload
source ~/.zshrc
```

## Quick start

```sh
hawk scan ~/projects        # register all projects under a directory
hawk list                   # see everything
hawk cd my-app              # jump to a project by name (needs shell-init)
hawk status my-app          # PRs, CI, last commit
hawk dashboard              # full table + drill-down
```

## Commands

| Command | Description |
|---|---|
| `hawk init` | Create a `.hawk` file in the current directory |
| `hawk scan [dir]` | Walk a directory tree and register all projects |
| `hawk add` | Manually register a project by path |
| `hawk list` | List all registered projects |
| `hawk cd <name>` | Jump to a project directory by name |
| `hawk open <name>` | Open in editor, GitHub, Vercel, or run dev server |
| `hawk edit <name>` | Edit a project's `.hawk` config |
| `hawk status [name]` | Open PRs, CI status, last commit |
| `hawk hosting [name]` | Vercel deployments — URL, branch, last deploy |
| `hawk sync` | Pull repos from GitHub + deployments from Vercel |
| `hawk dashboard` | Terminal table with drill-down |
| `hawk profile add` | Add a named profile (GitHub + Vercel tokens) |
| `hawk profile list` | List configured profiles |
| `hawk shell-init` | Print shell integration snippet |

## Multiple accounts

hawk uses named profiles so you can keep personal, work, and client credentials separate:

```sh
hawk profile add           # interactive — set name, tokens, editor
hawk sync --profile work   # pull from a specific profile
```

Tokens are stored in `~/.hawk/profiles.json` (chmod 600).

## Tab autocomplete

With shell-init active, pressing Tab after `hawk cd`, `hawk open`, or `hawk edit` completes project names automatically.

## How it works

- Each registered project has a `.hawk` JSON file in its directory.
- `~/.hawk/registry.json` is the central index hawk reads for all commands.
- `hawk scan` walks the filesystem and adds any directory with a `.hawk` file.

## Links

- npm: [npmjs.com/package/hawk-cli](https://www.npmjs.com/package/hawk-cli)
- GitHub: [github.com/3okash/hawk](https://github.com/3okash/hawk)

---

<p align="center">Powered by <a href="https://moksha.agency">moksha.agency</a></p>
