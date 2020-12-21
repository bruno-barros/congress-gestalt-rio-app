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
    apiUrl: process.env.API_BASEURL,
    GOOGLE_OAUTH_ID: process.env.GOOGLE_OAUTH_ID,
    FACEBOOK_OAUTH_ID: process.env.FACEBOOK_OAUTH_ID
  },
  i18n: {
    locales: ['pt', 'en'],
    defaultLocale: 'pt'
  },
  experimental: {
    basePath: isProd ? process.env.RELATIVE_PATH : ''
  },
  trailingSlash: !!(isProd && process.env.RELATIVE_PATH),
}
