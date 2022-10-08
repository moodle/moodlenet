#!/usr/bin/env node

import { mkdir } from 'fs/promises'
import { resolve } from 'path'

process.env.NODE_ENV = 'development'
process.env.MOODLENET_CORE_WORKING_DIR = resolve(process.cwd(), `.dev-machines`, process.argv[2])
await mkdir(process.env.MOODLENET_CORE_WORKING_DIR, { recursive: true })
await import('../packages/core/lib/main/install.mjs')
