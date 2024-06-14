# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

This project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [4.3.0]

### Added

- Report users
  - Users can now report other users specifying a reason
  - Admins can manage reported users, check details and take actions in place
- Introduced react-email: to compose emails as react components
- Inactive web-user management options :
  - Email notification after a configured time of inactivity
  - Account deletion after a configured time of inactivity
- Optional new `@moodlenet/web-user-auto-publisher` package:
  - Engages non-publisher users to create and finalize `n` resources to automatically gain publishing permissions

### Fixed

- User card published resources count
- Various issues related to account deletion cascade relations

### Improvements

- Webapp authentication token refresh on page load
- Various UI improvements
- On dev environment configs
- `@moodlenet/openai-autofill`:
  - added generation of cc-license and creation-date metadata
  - upgrade to model `gpt-4o`

## [4.2.1]

### Improvements

- Upgraded engines: node@20, npm@10

## [4.2.0]

### Improvements

- Various UI improvements
- Package versions dependency management improvements

### Added

- Allow scalable system by [en|dis]abling workers and primaries by configuration
- openai-autofill
  - uses Tika for file text extraction
  - If newly created resource is an image, uses it as background instead of generating

### Fixed

- Ulpoading profile images when images not set yet won't apply edits
- Ulpoading collection image won't apply edits
- Reverse-reference-lists displays blank cards when entity is not readable by the user
- Login/Signup button won't show on small screens
- Create moodlenet script won't install correct versions
- fix determination of `noChanged` in `patchEntity()`

## [4.1.0]

### Improvements

- DB indexing

### Added

- clear resource search filters

### Fixed

- User can request autofill from any state
- Flaw in point system when deleting a published resource
- Cancel upload functionality
- Prevent showing blank cards in lists when entity is not readable by the user
- Issues in openai autofill procedures

## [4.0.0]

### Added

- openai-autofill package uses openai apis to categorize user resources and categorize with educational metadata
- user point system / gamification: users contributing with content, activities and sharing gain points (leaves) growing from "seed" to "tree" to "ecosystem" in the MoodleNet community

## [3.2.0]

### Added

- resource learning outcomes (blooms cognitives) features
- resource search filters
- user interests settings with default resoure filtering option
- user profilelink in admin user list
- user-customized landing page lists
- prompt user to fill interests
- profile publisher permissions un/set for admins
  - on admin's user list section
  - in profile home page

### Improvements

- query performances
- http calls
- extra validation on profile page

### Fixed

- missing checks for webapp routes
- profile page
  - backed up empty avatar and background images
  - fix errors styling

### Security

- upgraded project level dependencies (lerna, storybook, webpack)

## [3.1.1]

### Fixed

- web-user: delete cookie on any authentication incosistency
- webapp: fix too may renders issue on landing page lists
- webapp: fix plugin component key generation

### Security

- secured access to admin RPCs

## [3.1.0]

### Added

- shared data validation schemas (server+webapp)
- finalized server stateless feature
  - stores webapp compilation output in package filesystem
- pkg config to enable webapp compilation process
- webapp pending tasks management
- rpc call abort feature

### Fixed

- fixed ui resource edit flow and validation logics
- several ui fixes and improvements
- windows compatibility issues

### Security

- improved data validations (server+webapp)

## [3.0.0] - 2023-07-24

### Added

- extensible modular architecture
- oauth + openid specs implementation

[unreleased]: https://github.com/moodle/moodlenet/compare/v3.1.1...HEAD
[3.1.1]: https://github.com/moodle/moodlenet/releases/tag/v3.1.1
[3.1.0]: https://github.com/moodle/moodlenet/releases/tag/v3.1.0
[3.0.0]: https://github.com/moodle/moodlenet/releases/tag/v3.0.0
