// const dotEnvResult = require('dotenv').config()
// if (dotEnvResult.error) {
//   throw dotEnvResult.error
// }

const isProd = process.env.NODE_ENV === 'production'

module.exports = {
  env: {
    version: '1.4.9',
    apiUrl: process.env.API_BASEURL,
    GOOGLE_OAUTH_ID: process.env.GOOGLE_OAUTH_ID,
    FACEBOOK_OAUTH_ID: process.env.FACEBOOK_OAUTH_ID,
    ONESIGNAL_ID: process.env.ONESIGNAL_ID,
    ONESIGNAL_SUBDOMAINNAME: process.env.ONESIGNAL_SUBDOMAINNAME,
    GA_ID: process.env.GA_ID,
    production: isProd
  },
  i18n: {
    locales: ['pt', 'en'],
    defaultLocale: 'pt'
  },
  images: {
    domains: ['localhost', 'congressoabrisco.com.br', 'evento.conceito-online.com.br', 'optimole.com', 'gestalt2020.com.br'],
  },
  trailingSlash: false,
  swcMinify: true
}
