#!/usr/bin/env node

process.env.NODE_ENV = 'development'
await import('../packages/react-app/dist/server/-dev-server.mjs')
