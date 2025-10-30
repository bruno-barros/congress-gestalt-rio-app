// const dotEnvResult = require('dotenv').config()
// if (dotEnvResult.error) {
//   throw dotEnvResult.error
// }

const isProd = process.env.NODE_ENV === 'production'

module.exports = {
  env: {
    version: '1.7.6',
    apiUrl: process.env.API_BASEURL,
    GOOGLE_OAUTH_ID: process.env.GOOGLE_OAUTH_ID,
    FACEBOOK_OAUTH_ID: process.env.FACEBOOK_OAUTH_ID,
    ONESIGNAL_ID: process.env.ONESIGNAL_ID,
    ONESIGNAL_SUBDOMAINNAME: process.env.ONESIGNAL_SUBDOMAINNAME,
    GA_ID: process.env.GA_ID,
    production: isProd,
    super_users_ids: process.env.SUPER_USERS_IDS,
    supportedLngs: 'pt',// 'en',,es
  },
  // configuração de integração do i18n com Nextjs: router.locales
  // https://nextjs.org/docs/pages/building-your-application/routing/internationalization
  i18n: {
    locales: ['pt'],// 'en',
    defaultLocale: 'pt'
  },
  images: {
    domains: ['localhost', 'congressogestaltrj.com.br', 'app.congressogestaltrj.com.br'],
  },
  trailingSlash: false,
  swcMinify: true
}
