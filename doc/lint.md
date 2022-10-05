# lint e commit

## files configuration :

.eslintrc .lintstagedrc .prettierrc.json

.husky/pre-commit --> yarn run pre-commit

packages.json scripts : "pre-commit": "lint-staged"

All this configuration files, has high priority on other configuration, and all project see this.

## Flow :

.husky/pre-commit is the hook where listen comming commit and we call script pre-commit in pakages.

like this we extend command on packges.json , then call directly : npx lint-staged

on .lintstagedrc, we filter files on stage and call eslint --fix command

lint process see .eslintrc configuration

## airbnb
 https://smartdevpreneur.com/why-use-airbnbs-eslint-config-a-review-of-airbnbs-rules-list/

## command :
disable lint on commit :
`git commit --no-verify`
