#!/usr/bin/env node

import { resolve } from 'path'

process.env.NODE_ENV = 'development'
process.env.MOODLENET_CORE_WORKING_DIR = resolve(process.cwd(), `.dev-machines`, process.argv[2])

await import('../packages/core/lib/main/boot.mjs')
