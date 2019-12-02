import Rollbar from 'rollbar'
import * as env from '~/constants/env'

export const rollbarConfig = {
  accessToken: env.ROLLBAR_ACCESS_TOKEN,
  captureUncaught: true,
  captureUnhandledRejections: true,
  enabled: true,
  environment: env.NODE_ENV,
  payload: {
    client: {
      javascript: {
        code_version: '1.0',
        source_map_enabled: true,
        guess_uncaught_frames: true,
      },
    },
  },
}

const rollbar = new Rollbar(rollbarConfig)
export default rollbar
