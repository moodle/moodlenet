#!/usr/bin/env node
// import assert from 'assert'
// import yargs from 'yargs'
// const opts = await yargs(process.argv.slice(2))
// const argv = await opts.argv
// const { sysd } = argv
// assert(
//   typeof sysd === 'undefined' || typeof sysd === 'string' || typeof sysd === 'number',
//   '--sysd should be a string or omit for default ./system',
// )
// process.env.MOODLENET_CORE_WORKING_DIR = process.cwd()
// process.env.MOODLENET_CORE_SYSTEM_DIR = sysd ? String(sysd) : undefined
await import('../lib/main/boot.mjs')
