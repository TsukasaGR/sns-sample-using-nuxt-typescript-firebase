import { Configuration as NuxtConfiguration } from '@nuxt/types'
import { NuxtConfigurationEnv } from '@nuxt/types/config/env'
require('dotenv').config()
const pkg = require('./package')
const environment = process.env.NODE_ENV || 'development'
const envSet = process.env as NuxtConfigurationEnv

const nuxtConfig: NuxtConfiguration = {
  mode: 'universal',
  srcDir: 'src/',

  env: envSet,

  icon: 'icon.png',

  /*
   ** Headers of the page
   */
  head: {
    title: pkg.name,
    meta: [
      { charset: 'utf-8' },
      {
        name: 'viewport',
        content:
          'width=device-width, initial-scale=1, minimum-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover',
      },
      { hid: 'description', name: 'description', content: pkg.description },
      { hid: 'og:site_name', property: 'og:site_name', content: 'Habittt' },
      { hid: 'og:type', property: 'og:type', content: 'website' },
      {
        hid: 'og:url',
        property: 'og:url',
        content: 'https://project-ego-staging-f9aae.appspot.com',
      },
      { hid: 'og:title', property: 'og:title', content: 'Habittt' },
      {
        hid: 'og:description',
        property: 'og:description',
        content: '「チーム」×「習慣」で目標をアップデートする',
      },
      {
        hid: 'og:image',
        property: 'og:image',
        content:
          'https://firebasestorage.googleapis.com/v0/b/project-ego-staging-f9aae.appspot.com/o/ogp.png?alt=media&token=1704c4ad-0f70-456a-98e4-911eed234bd7',
      },
      {
        name: 'apple-mobile-web-app-capable',
        content: 'yes',
      },
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      {
        rel: 'stylesheet',
        href: 'https://cdn.firebase.com/libs/firebaseui/3.5.2/firebaseui.css',
      },
      {
        rel: 'stylesheet',
        href:
          'https://cdn.materialdesignicons.com/2.5.94/css/materialdesignicons.min.css',
      },
      {
        rel: 'stylesheet',
        href: 'https://use.fontawesome.com/releases/v5.2.0/css/all.css',
      },
      {
        rel: 'stylesheet',
        href: 'https://fonts.googleapis.com/css?family=Noto+Sans+JP',
      },
      {
        rel: 'apple-touch-startup-image',
        href:
          'https://firebasestorage.googleapis.com/v0/b/woven-mapper-232901.appspot.com/o/logo.png?alt=media&token=6f2139d9-8ecb-4762-a04a-e893d8e7a9c9',
        media:
          '(device-width: 320px) and (device-height: 568px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)',
      },
      {
        rel: 'apple-touch-startup-image',
        href: 'splashscreens/iphone5_splash.png',
        media:
          '(device-width: 320px) and (device-height: 568px) and (-webkit-device-pixel-ratio: 2)',
      },
      {
        rel: 'apple-touch-startup-image',
        href: 'splashscreens/iphone6_splash.png',
        media:
          '(device-width: 375px) and (device-height: 667px) and (-webkit-device-pixel-ratio: 2)',
      },
      {
        rel: 'apple-touch-startup-image',
        href: 'splashscreens/iphoneplus_splash.png',
        media:
          '(device-width: 621px) and (device-height: 1104px) and (-webkit-device-pixel-ratio: 3)',
      },
      {
        rel: 'apple-touch-startup-image',
        href: 'splashscreens/iphonex_splash.png',
        media:
          '(device-width: 375px) and (device-height: 812px) and (-webkit-device-pixel-ratio: 3)',
      },
      {
        rel: 'apple-touch-startup-image',
        href: 'splashscreens/iphonexr_splash.png',
        media:
          '(device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 2)',
      },
      {
        rel: 'apple-touch-startup-image',
        href: 'splashscreens/iphonexsmax_splash.png',
        media:
          '(device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 3)',
      },
      {
        rel: 'apple-touch-startup-image',
        href: 'splashscreens/ipad_splash.png',
        media:
          '(device-width: 768px) and (device-height: 1024px) and (-webkit-device-pixel-ratio: 2)',
      },
      {
        rel: 'apple-touch-startup-image',
        href: 'splashscreens/ipadpro1_splash.png',
        media:
          '(device-width: 834px) and (device-height: 1112px) and (-webkit-device-pixel-ratio: 2)',
      },
      {
        rel: 'apple-touch-startup-image',
        href: 'splashscreens/ipadpro3_splash.png',
        media:
          '(device-width: 834px) and (device-height: 1194px) and (-webkit-device-pixel-ratio: 2)',
      },
      {
        rel: 'apple-touch-startup-image',
        href: 'splashscreens/ipadpro2_splash.png',
        media:
          '(device-width: 1024px) and (device-height: 1366px) and (-webkit-device-pixel-ratio: 2)',
      },
    ],
  },

  manifest: {
    name: 'Habittt',
    lang: 'ja',
    short_name: 'Habittt',
    title: '「チーム」×「習慣」で目標をアップデートする',
    'og:title': '「チーム」×「習慣」で目標をアップデートする',
    description: '「チーム」×「習慣」で目標をアップデートする',
    'og:description': '「チーム」×「習慣」で目標をアップデートする',
    theme_color: '#abeab6',
    background_color: '#fff',
    start_url: '/',
    orientation: 'any',
    display: 'standalone',
    icons: [
      {
        src: '/android-chrome-36x36.png',
        sizes: '36x36',
        type: 'image/png',
      },
      {
        src: '/android-chrome-48x48.png',
        sizes: '48x48',
        type: 'image/png',
      },
      {
        src: '/android-chrome-72x72.png',
        sizes: '72x72',
        type: 'image/png',
      },
      {
        src: '/android-chrome-96x96.png',
        sizes: '96x96',
        type: 'image/png',
      },
      {
        src: '/android-chrome-128x128.png',
        sizes: '128x128',
        type: 'image/png',
      },
      {
        src: '/android-chrome-144x144.png',
        sizes: '144x144',
        type: 'image/png',
      },
      {
        src: '/android-chrome-152x152.png',
        sizes: '152x152',
        type: 'image/png',
      },
      {
        src: '/android-chrome-192x192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/android-chrome-256x256.png',
        sizes: '256x256',
        type: 'image/png',
      },
      {
        src: '/android-chrome-384x384.png',
        sizes: '384x384',
        type: 'image/png',
      },
      {
        src: '/android-chrome-512x512.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  },

  /*
   ** Customize the progress-bar color
   */
  loading: { color: '#fff' },

  /*
   ** Global CSS
   */
  css: ['~/assets/styles/buefy.scss', '~/assets/styles/app.scss'],

  /*
   ** Plugins to load before mounting the App
   */
  plugins: [
    '~/plugins/compositionApi',
    '~/plugins/buefy',
    '~/plugins/firebase',
    '~/plugins/auth',
    '~/plugins/axios',
    '~/plugins/rollbar',
    { src: '~plugins/ga', mode: 'client' },
  ],

  /*
   ** Nuxt.js dev-modules
   */
  buildModules: [
    // Doc: https://github.com/nuxt-community/eslint-module
    '@nuxtjs/eslint-module',
    '@nuxt/typescript-build',
    [
      '@nuxtjs/google-analytics',
      {
        id: process.env.trackingId,
      },
    ],
  ],

  /*
   ** Nuxt.js modules
   */
  modules: ['@nuxtjs/pwa', '@nuxtjs/style-resources', 'nuxt-buefy'],

  router: {
    middleware: [],
  },

  styleResources: {
    scss: ['~/assets/styles/resources/*.scss'],
  },

  /*
   ** Build configuration
   */
  build: {
    hardSource: environment === 'development',
  },
}

module.exports = nuxtConfig
