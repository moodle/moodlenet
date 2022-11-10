#!/usr/bin/env node

process.env.NODE_ENV = 'development'
await import('../packages/react-app/lib/server/-dev-server.mjs')
