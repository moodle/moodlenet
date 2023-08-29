# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

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

[unreleased]: https://github.com/moodle/moodlenet/compare/v3.0.0...HEAD
[3.0.0]: https://github.com/moodle/moodlenet/releases/tag/v3.0.0