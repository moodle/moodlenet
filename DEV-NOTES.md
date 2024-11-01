# Dev notes

## TODO

remove all ok_ko<void> ==> ok_ko

### Next

FIXME !!! [ ] react-app app api routes under module namespace
[x] logger with current context ids
[ ] admin user roles interface
CHECK:[ ] define types as z.infer when zod schema defined (e.g. all def in types.data)
[x] file service
[x] a "system" userSession for init/migration ? (e.g. create the first admin user)
[x] add all "config changed" events
FIXME:[ ]  http primaries: 
  [ ] extract lib (cookies, access-session ... ) for all http primaries 
  [ ] use cookies "secret" 
### Done

[x] for other mods configs use other_mod.pri.getConfigs() with systemPrimary (need another contextproxy [secondary])

### Backlog

CHECKOUT:[ ] zod provides many handy stuff, including discriminateed unions .. check if/how to use them
[ ] react-app docker image
[ ] 3 phases version upgrade: 
  #1 migration by secs. prepare a consistent (usable) env for domain
  #2 processes perform module-specific operations
  #3 webapp prompts admins for user-assisted finalizations
---

## Random notes


### CHECKOUT: Method Shorthand Syntax Considered Harmful

possible runtime errors using [method-shorthand-syntax](https://www.totaltypescript.com/method-shorthand-syntax-considered-harmful)
deeply investigate on this behavior, that could actually be a feature for [interface declaration merging](https://www.typescriptlang.org/docs/handbook/declaration-merging.html) [see also](https://www.typescriptlang.org/docs/handbook/2/objects.html)

### For react-app middleware primary sesseion data gathering

consider [this](https://www.npmjs.com/package/next-extra), it provides other utils too

### nx project generation

libs (created with `nx/nodejs lib` so no `package.json`) `tsconfig.[lib|spec].json` have `"types": ["node"]` and jext.configs.ts have `testEnvironment: 'node'` ,... check
