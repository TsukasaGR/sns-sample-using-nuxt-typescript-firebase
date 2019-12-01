import Vue from 'vue'
import VueRollbar from 'vue-rollbar'
import { rollbarConfig } from '~/modules/rollbar'
Vue.use(VueRollbar, rollbarConfig)
