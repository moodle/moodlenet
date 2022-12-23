#!/usr/bin/env node

process.env.NODE_ENV = 'development'
await import('../packages/react-app/dist/server/webpack/-dev-server.mjs')

/*
import { fork } from 'child_process'
import { resolve } from 'path'
import { fileURLToPath } from 'url'
const __dirname = fileURLToPath(new URL('.', import.meta.url))

process.env.NODE_ENV = 'development'
const cwd = resolve(__dirname, '..', 'packages', 'react-app', 'dist', 'server', 'webpack')
fork(resolve(cwd, '-dev-server.mjs'), { cwd })

 */
