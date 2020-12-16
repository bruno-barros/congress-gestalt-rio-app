const dotEnvResult = require('dotenv').config()
if (dotEnvResult.error) {
  throw dotEnvResult.error
}

const isProd = process.env.NODE_ENV === 'production'

module.exports = {
  env: {
    version: '0.1.0',
    siteName: 'Evento',
    siteUrl: process.env.BASEURL,
    assetPrefix: isProd ? process.env.RELATIVE_PATH : '',
    apiUrl: process.env.API_BASEURL
  },
  experimental: {
    basePath: isProd ? process.env.RELATIVE_PATH : ''
  },
  exportTrailingSlash: !!(isProd && process.env.RELATIVE_PATH),
}
