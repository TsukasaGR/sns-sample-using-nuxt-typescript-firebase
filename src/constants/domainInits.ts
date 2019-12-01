import * as types from '~/types/domainTypes'
import firebase from '~/plugins/firebase'
import dayjs from '~/plugins/dayjs'

export const INITIALIZE_INIT_VALUE = {
  done: false,
}

export const AUTH_INIT_VALUE: types.Auth = {
  uid: '',
  refreshToken: '',
  displayName: '',
  email: '',
  emailVerified: '',
  photoURL: '',
  isLoggedIn: false,
  user: undefined,
}

export const USER_INIT_VALUE: types.UserDraft = {
  objectID: null,
  accountName: '',
  displayName: '',
  email: '',
  icon: '',
  description: '',
  createdAt: 0,
  role: '',
  createdUser: '',
}

export const GOAL_INIT_VALUE: types.GoalDraftStep1 = {
  objectID: '',
  userId: '',
  title: '',
  icon: '',
  goalType: null,
  endAt: firebase.firestore.Timestamp.fromMillis(
    dayjs()
      .add(3, 'month')
      .valueOf()
  ),
  publishedAt: null,
  scheduleOfRecord: {
    period: 'weekly',
    periodSpan: 1,
    hour: 18,
    option: {
      weekDays: [1],
    },
    startAt: firebase.firestore.Timestamp.fromDate(new Date()),
  },
  scheduleOfRetrospective: {
    period: 'monthly',
    periodSpan: 1,
    hour: 18,
    option: {
      optionType: '曜日指定',
      option: {
        ordinalNumber: 1,
        weekDay: 1,
      },
    },
    startAt: firebase.firestore.Timestamp.fromDate(new Date()),
  },
  createdAt: 0,
}

export const GOAL_TYPES: (types.GoalType | types.GoalTypeBlank)[] = [
  null,
  '結果目標',
  '状態目標',
  '行動目標',
]

export const SCHEDULE_FORM_INIT_VALUE: types.ScheduleForm = {
  period: 'weekly',
  optionType: '日付指定',
  periodSpan: 1,
  day: 1,
  weekDay: 1,
  weekDays: [1],
  ordinalNumber: 1,
  hour: 18,
}

export const RECORD_SCHEDULE_INIT_VALUE: types.Schedule = {
  period: 'weekly',
  periodSpan: 1,
  hour: 18,
  option: {
    weekDays: [1],
  },
  startAt: firebase.firestore.Timestamp.fromDate(new Date()),
}

export const RECORD_INIT_VALUE: types.RecordDraft = {
  objectID: null,
  userId: '',
  goalId: '',
  comment: '',
  createdAt: 0,
}

export const RETROSPECTIVE_INIT_VALUE: types.RetrospectiveDraft = {
  objectID: null,
  userId: '',
  goalId: '',
  comment: '',
  achieveRate: 0,
  createdAt: 0,
}
export const TEAM_INIT_VALUE: types.TeamDraft = {
  objectID: null,
  name: '',
  members: [],
  createdAt: 0,
}
