import { spawn } from 'child_process'

const projectDir = 'C:/Users/rv.teixeira/Desktop/PMOsite'
const viteJs = projectDir + '/node_modules/vite/bin/vite.js'

const child = spawn(process.execPath, [viteJs], {
  cwd: projectDir,
  stdio: 'inherit',
})

child.on('exit', (code) => process.exit(code ?? 0))
