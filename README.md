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