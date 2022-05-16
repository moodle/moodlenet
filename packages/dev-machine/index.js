#!/usr/bin/env node
"use strict";

var dotenv = require('dotenv')
var { expand } = require('dotenv-expand')
var myEnv = dotenv.config()
expand(myEnv)

require("@moodlenet/bare-metal")
