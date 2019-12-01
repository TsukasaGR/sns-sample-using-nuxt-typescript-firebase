import * as request from 'request-promise'
import * as env from '../../../env'
import * as types from '../../../types'
import { displayDatetimeByMMDD } from '../../dayjs'
import { expiredScheduleDates } from '../scheduleDates/scheduleDate'
import { updateAlertedAt } from '../scheduleDates/updateScheduleDate'
import getGoals from '../goals/getGoal'
import getUsers from '../users/getUsers'

export default async function handle(): Promise<void> {
  await alertHandle()
}

async function alertHandle() {
  let goals: types.Goal[] = await getGoals()
  const users: types.User[] = await getUsers()

  goals = goals.filter(
    goal => goal.publishedAt !== null && goal.archivedAt === undefined
  )

  for (const goal of goals) {
    await alertCheckOfGoal(goal, users, 'record')
  }
  for (const goal of goals) {
    await alertCheckOfGoal(goal, users, 'retrospective')
  }
}

async function alertCheckOfGoal(
  goal: types.Goal,
  users: types.User[],
  scheduleType: types.ScheduleType
) {
  const user = users.find(user => user.objectID === goal.userId)
  if (!user || !user.webhookUrl) return
  const scheduleDates = await expiredScheduleDates(goal, scheduleType)
  const alertDates = scheduleDates.filter(
    date => date.scheduleType === scheduleType && date.alertedAt === undefined
  )
  // expiredScheduleDates関数でscheduledAtの降順になってるので0番目の要素が最新
  if (alertDates.length > 0) {
    await updateAlertedAt(alertDates[0])
    await sendToTeams(user, goal, alertDates[0])
  }
}

// 目標ごとに送信
export async function sendToTeams(
  user: types.User,
  goal: types.Goal,
  scheduleDate: types.ScheduleDate
) {
  if (!user.webhookUrl) return
  const title: string = 'Habitttからのお知らせ'
  const scheduleTypeJa: string =
    scheduleDate.scheduleType === 'record' ? '記録' : '振り返り'

  // prettier-ignore
  const text:string =
    `目標【${goal.title}】の${scheduleTypeJa}(${displayDatetimeByMMDD(scheduleDate.scheduleAt)}日分)を登録しましょう！`

  const buttonMessage: string =
    scheduleDate.scheduleType === 'record' ? '記録する' : '振り返る'

  // prettier-ignore
  const buttonUrl: string =
    `${env.BASE_URL}/${scheduleDate.scheduleType}s/create/goal/${scheduleDate.goalId}?id=${scheduleDate.objectID}`

  const uri = user.webhookUrl
  const options = {
    uri,
    method: 'POST',
    contentType: 'application/json',
    json: {
      '@context': 'https://schema.org/extensions',
      '@type': 'MessageCard',
      themeColor: '0072C6',
      title,
      text,
      potentialAction: [
        {
          '@type': 'OpenUri',
          name: buttonMessage,
          targets: [
            {
              os: 'default',
              uri: buttonUrl,
            },
          ],
        },
      ],
    },
  }

  await request(options)
    .then(() => {
      console.log('OK')
    })
    .catch(err => {
      console.log(err)
    })
}
