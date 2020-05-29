/*!
 * Copyright (c) 2017-Present, Okta, Inc. and/or its affiliates. All rights reserved.
 * The Okta software accompanied by this notice is provided pursuant to the Apache License, Version 2.0 (the "License.")
 *
 * You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0.
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *
 * See the License for the specific language governing permissions and limitations under the License.
 */

/** Vue apps does not support environment variables the same way Node apps do.
 */
const fs = require('fs')
const path = require('path')
const Config = require('../../../../../../.oidc.config.js')

const environmentFilesDirectory = path.join(__dirname, '../config')
const targetEnvironmentFileName = 'dev.env.js'

// Set Vue environment defaults
const env = Config({ port: 8080 }).spaConstants
env.NODE_ENV = 'development'

/**
 * Format the output file to look like a JS object
 *
 * export const environment = {
 *   NODE_ENV: '"development"',
 *   CLIENT_ID: '"{yourClientId}"',
 *   ...
 * };
 *
 */
const formatted = JSON.stringify(env, null, 2)
  .replace(/"(\w+)"\s*:/g, '$1:')
  .replace(/"(\w.*)"/g, '\'$&\'')

const output = `/* --- This file was auto-generated by scripts/prebuild.js --- */
'use strict'

const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, ${formatted})
`

fs.writeFileSync(path.join(environmentFilesDirectory, targetEnvironmentFileName), output)

process.exit(0)
