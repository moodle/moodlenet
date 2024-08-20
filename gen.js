#!/usr/bin/env node

const { exec, execSync } = require('child_process')
const { readdirSync } = require('fs')
const { join } = require('path')
const tplName = process.argv[2] || 'debug'

const _bp = 'asyncapi'
const srv = join(_bp, 'srv')
const tpl = join(_bp, 'tpl', tplName)

const srvList = (readdirSync(srv))
  .filter((file) => file.endsWith('.api.yml'))
  .map((file) => ({
    file: join(srv, file),
    name: file.split('.').shift(),
  }))

// const srvMap = Object.fromEntries(srvList.map((srv) => [srv.name, srv]))
for (const srv of srvList) {
  const trgt = join(_bp, 'gen', tplName, srv.name)
  const src = srv.file
  const cmd = `npx asyncapi generate fromTemplate ${src} ${tpl} -o ${trgt} --force-write` // --watch`
  process.stdout.write(`executing: [${cmd}] ...`)
  execSync(cmd, { stdio: 'pipe' })
  process.stdout.write('done.\n')
}

