# TODO

## better dev env

### tsc --build issue

- tsc emits in src : for the moment a patch script moving compiled files from `src` to `dist`
  - <https://github.com/microsoft/TypeScript/issues/28875>
  - <https://github.com/RyanCavanaugh/project-references-demo/issues/4>

### project setup

{T} : task  
{P} : process

#### DX

- {T} npm install
- {T} npm run dev-install-backend $DIR
- {P} npm run dev-start-backend $DIR
- {P} npm run dev-start-webapp

## investigate on even better 3rd party package development env and process

Better after npm publishing

Desiderata requirements:

- Development of 3rd party packages shouldn't require cloning and using repository
- Developer would simply need to install a "real" system and develop anywhere the package
- Installing on local installed system should be fast and straightforward

## Well define packages exports

- scaffold all packages with `nodejs`, `browser` and `common` folders
- put an `index.mts` in each folder, and export it as `pkgname/<folder>`
- [ensure correct imports in folders' modules](https://miro.com/app/board/uXjVP9hENlk=/)

## Documentation

- repository setup
- how to start dev a package?
- packages' API&exports docs

## Draft Authorization System
