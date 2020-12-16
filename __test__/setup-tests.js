// optional: configure or set up a testing framework before each test
// if you delete this file, remove `setupFilesAfterEnv` from `jest.config.js`
const path = require('path');
const fs = require('fs');
let envPath = path.resolve(__dirname + './../.env')
if (fs.existsSync(path.resolve(__dirname + './../.env.test.local'))) {
  envPath = path.resolve(__dirname + './../.env.test.local')
} else if (fs.existsSync(path.resolve(__dirname + './../.env.test'))) {
  envPath = path.resolve(__dirname + './../.env.test')
}

require("dotenv").config({ path: envPath })

// used for __tests__/testing-library.js
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom/extend-expect'
