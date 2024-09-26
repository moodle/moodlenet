# Dev notes

## TODO

### Next

[ ] file service

### Done

[x] for other mods configs use other_mod.pri.getConfigs() with systemPrimary (need another contextproxy [sysCall])

### Backlog

[ ] nextjs docker image

---

## Random notes

### CHECKOUT: Method Shorthand Syntax Considered Harmful

possible runtime errors using [method-shorthand-syntax](https://www.totaltypescript.com/method-shorthand-syntax-considered-harmful)
deeply investigate on this behavior, that could actually be a feature for [interface declaration merging](https://www.typescriptlang.org/docs/handbook/declaration-merging.html) [see also](https://www.typescriptlang.org/docs/handbook/2/objects.html)

### For nextjs middleware data gathering

consider [this](https://www.npmjs.com/package/next-extra), it provides other utils too

### nx project generation

libs (created with `nx/nodejs lib` so no `package.json`) `tsconfig.[lib|spec].json` have `"types": ["node"]` and jext.configs.ts have `testEnvironment: 'node'` ,... check
