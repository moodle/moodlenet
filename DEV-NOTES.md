# Dev notes

## TODO

### Next

[ ] admin user roles interface
FIXME:[ ] define types as z.infer when zod schema defined (e.g. all def in types.data)
[ ] file service
[ ] a "system" access_session for init/migration ? (e.g. create the first admin user)
[ ] add all "config changed" events

### Done

[x] for other mods configs use other_mod.pri.getConfigs() with systemPrimary (need another contextproxy [sys_call])

### Backlog

CHECKOUT:[ ] zod provides many handy stuff, including discriminateed unions .. check if/how to use them
[ ] nextjs docker image
[ ] 3 phases version upgrade: 
  #1 migration by secs. prepare a consistent (usable) env for domain
  #2 processes perform module-specific operations
  #3 webapp prompts admins for user-assisted finalizations
---

## Random notes


### CHECKOUT: Method Shorthand Syntax Considered Harmful

possible runtime errors using [method-shorthand-syntax](https://www.totaltypescript.com/method-shorthand-syntax-considered-harmful)
deeply investigate on this behavior, that could actually be a feature for [interface declaration merging](https://www.typescriptlang.org/docs/handbook/declaration-merging.html) [see also](https://www.typescriptlang.org/docs/handbook/2/objects.html)

### For nextjs middleware data gathering

consider [this](https://www.npmjs.com/package/next-extra), it provides other utils too

### nx project generation

libs (created with `nx/nodejs lib` so no `package.json`) `tsconfig.[lib|spec].json` have `"types": ["node"]` and jext.configs.ts have `testEnvironment: 'node'` ,... check
