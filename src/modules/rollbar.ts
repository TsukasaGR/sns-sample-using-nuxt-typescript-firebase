import Rollbar from 'rollbar'

export const rollbarConfig = {
  accessToken: process.env.rollbarAccessToken,
  captureUncaught: true,
  captureUnhandledRejections: true,
  enabled: true,
  environment: process.env.NODE_ENV,
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
