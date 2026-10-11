import { readFileSync, appendFileSync, existsSync } from 'fs'
import { homedir } from 'os'
import { join } from 'path'
import chalk from 'chalk'

const SNIPPET = `
# hawk shell integration
function hawk() {
  if [ "$1" = "cd" ]; then
    local dir
    dir=$(command hawk _resolve-path "$2" 2>/dev/null)
    [ -n "$dir" ] && cd "$dir" || echo "hawk: project '$2' not found"
  else
    command hawk "$@"
  fi
}

# Tab completion for zsh
if [ -n "$ZSH_VERSION" ]; then
  _hawk_projects() {
    local projects
    projects=($(command hawk _completions 2>/dev/null))
    _describe 'projects' projects
  }
  compdef '_arguments "1:command:(init scan add list cd open edit status hosting dashboard landing profile sync shell-init)" "2:project:_hawk_projects"' hawk
fi

# Tab completion for bash
if [ -n "$BASH_VERSION" ]; then
  _hawk_complete() {
    local cur="\${COMP_WORDS[COMP_CWORD]}"
    local prev="\${COMP_WORDS[COMP_CWORD-1]}"
    local project_cmds="cd open edit status hosting landing"
    if echo "$project_cmds" | grep -qw "$prev"; then
      COMPREPLY=( $(compgen -W "$(command hawk _completions 2>/dev/null)" -- "$cur") )
    fi
  }
  complete -F _hawk_complete hawk
fi`

export function shellInitCommand(options: { install?: boolean } = {}): void {
  if (options.install) {
    const rcFile = process.env.SHELL?.includes('zsh')
      ? join(homedir(), '.zshrc')
      : join(homedir(), '.bashrc')

    if (!existsSync(rcFile)) {
      console.error(chalk.red(`Not found: ${rcFile}`))
      process.exit(1)
    }

    const contents = readFileSync(rcFile, 'utf-8')
    if (contents.includes('hawk shell integration')) {
      console.log(chalk.yellow(`Already installed in ${rcFile}`))
      console.log(chalk.gray('Run: source ' + rcFile))
      return
    }

    appendFileSync(rcFile, SNIPPET + '\n')
    console.log(chalk.green(`✓ Installed hawk shell integration into ${rcFile}`))
    console.log(chalk.gray(`Run: source ${rcFile}`))
    return
  }

  // Default: just print the snippet for manual eval / copy-paste
  process.stdout.write(SNIPPET + '\n')
}
