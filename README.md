# Moodlenet Repo

This is the lerna multi packages repository for [moodle.net](https://moodle.net)

try Moodlenet installing [@moodlenet/ce-platform](https://www.npmjs.com/package/@moodlenet/ce-platform)

### lint and formating code

husky install

https://medium.com/angular-in-depth/husky-6-lint-prettier-eslint-and-commitlint-for-javascript-project-d7174d44735a

https://medium.com/@loclghst/set-up-eslint-prettier-and-pre-commit-hooks-using-husky-for-react-73e7a51cda26

https://dev.to/smetankajakub/how-to-integrate-husky-eslint-prettier-to-project-in-less-than-15-minutes-5gh

¸¸¸ "scripts": { "ibs": "husky install && yarn bs", "pre-commit": "lint-staged && lerna run --concurrency 1 --stream precommit --since HEAD --exclude-dependents", "prepare": "husky install", "lint": "eslint --ignore-path .gitignore --ext .js,.ts,.tsx .", "prettier": "prettier --check --ignore-path .gitignore \"**/\*.+(json|ts|tsx)\"", "prettierjs": "prettier --check --ignore-path .gitignore \"**/\*.+(js)\""


npm link ./packages/create-moodlenet/


~/repo/moodlenet $ yarn dev-install-be miofolder --clean
~/repo/moodlenet $ cd .dev-machines/miofolder
~/repo/moodlenet/dev-machines/miofolder $ yarn start-dev

1
~/repo/moodlenet $ yarn dev-webapp

### use of register : 

here I take the items define in the external component

  packages/react-app/src/webapp/ui/components/organisms/Header/MainHeader/MainHeaderHooks.mts

  const avatarMenuReg = avatarMenuItems.useRegistry()

  const xxx = avatarMenuReg.registry.entries.map<HeaderMenuItem>((el, idx) => {
    return {
      Icon:el.item.Icon,
      text: el.item.Text,
      key: el.pkgId.name + idx,
      path: el.item.Path
    }
  })

here the items to be added to the header or parent component are defined
  packages/*/src/webapp/MainComponent.tsx

ATTENTION :

registry items, can add to an already existing list, for example here the avatarmenuitem,
some are added by webApp because they are fixed, others by webUser for example the link to his profile
