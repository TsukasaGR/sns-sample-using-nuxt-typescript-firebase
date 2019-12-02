// import * as functions from 'firebase-functions'
// import * as request from 'request-promise'
// import { Message } from 'firebase-functions/lib/providers/pubsub'
// import {
//   WEBHOOK_URL_DEPLOY,
//   FIREBASE_REGION,
//   DEPLOY_ID_TO_NUXT,
//   DEPLOY_ID_TO_FUNCTIONS,
// } from '../env'
// import * as appTypes from '../applicationTypes'
// const atob = require('atob')

// const runtimeOpts: functions.RuntimeOptions = {
//   timeoutSeconds: 540,
// }

// module.exports = functions
//   .region(FIREBASE_REGION)
//   .runWith(runtimeOpts)
//   .pubsub.topic('cloud-builds')
//   .onPublish((message: Message, context: functions.EventContext) => {
//     console.log('message:', JSON.stringify(message.toJSON()))
//     console.log('context:', JSON.stringify(context))
//     return sendToTeams(message)
//   })

// export async function sendToTeams(message: Message): Promise<void> {
//   const status = message.attributes.status as appTypes.MessageStatus

//   const data = JSON.parse(decodeURIComponent(atob(message.data)))

//   const environments = [
//     {
//       id: DEPLOY_ID_TO_NUXT,
//       name: 'Nuxt',
//     },
//     {
//       id: DEPLOY_ID_TO_FUNCTIONS,
//       name: 'functions',
//     },
//   ]

//   let environmentName = '環境未指定'
//   if (data.buildTriggerId) {
//     const targetEnv = environments.find(
//       environment => environment.id === data.buildTriggerId
//     )
//     if (targetEnv) environmentName = targetEnv.name
//   }

//   const potentialAction = []
//   const logUrl = data.logUrl || undefined

//   let title = ''
//   let text = ''
//   switch (status) {
//     case 'SUCCESS':
//     case 'FAILURE':
//       title = `デプロイ通知:env=${environmentName}, status=${status}`
//       text =
//         status === 'SUCCESS'
//           ? 'デプロイが完了しました🎉'
//           : 'デプロイが失敗しました😱😱😱😱😱'

//       if (logUrl)
//         potentialAction.push({
//           '@type': 'OpenUri',
//           name: 'ログを見る',
//           targets: [
//             {
//               os: 'default',
//               uri: logUrl,
//             },
//           ],
//         })
//       break
//     default:
//       text = `デプロイ通知:env=${environmentName}, status=${status}`
//   }

//   const uri = WEBHOOK_URL_DEPLOY
//   console.log('url:', uri)
//   const options: any = {
//     uri,
//     method: 'POST',
//     contentType: 'application/json',
//     json: {
//       '@context': 'https://schema.org/extensions',
//       '@type': 'MessageCard',
//       themeColor: '0072C6',
//       title,
//       text,
//       potentialAction,
//     },
//   }

//   await request(options).catch(err => {
//     console.log(JSON.stringify(err))
//   })
// }
