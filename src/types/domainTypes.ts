import firebase from '~/plugins/firebase'

export type FirestoreSearchOperators =
  | '<'
  | '<='
  | '=='
  | '>='
  | '>'
  | 'array-contains'

export type FirestoreSearchCondition = {
  id: number
  field: string
  operator: FirestoreSearchOperators
  value: any
}

export type Fixme = any // 都合上anyにしているが後々修正したいものはanyでなくこちらを利用する

export type Draft<T, D extends keyof T> = {
  [K in keyof T]: K extends D ? T[K] | null : T[K]
}

type DomainTypeBase = {
  objectID: string
  createdAt: number
  createdUser?: string
  updatedAt?: number
}

type UserTypeBase = {
  userId: string
  user?: User
}

type GoalTypeBase = {
  goalId: string
  goal?: Goal
}

export type Auth = {
  uid: string
  refreshToken: string
  displayName: string
  email: string
  emailVerified: string
  photoURL: string
  isLoggedIn: boolean
  user?: User
}

export type UserRole = '' | 'admin'

export type User = DomainTypeBase & {
  accountName: string | undefined
  displayName: string | undefined
  email: string | undefined // TODO: 本人以外見えないようにしたいのでAuthに持っていきたい
  icon: string | undefined
  description: string
  webhookUrl?: string
  lastUpdateTimestampTimeline?: number
  role: UserRole
  tags?: string[]
}

export type UserDraft = Draft<User, 'objectID'>

export type UserWithGoals = User & {
  goals?: Goal[]
}

export type PublishedGoal = DomainTypeBase &
  UserTypeBase & {
    title: string
    goalType: GoalType
    icon: string
    endAt: firebase.firestore.Timestamp // TODO: 過去分詞でないのでendedのほうが良さそう
    publishedAt: firebase.firestore.Timestamp
    archivedAt?: firebase.firestore.Timestamp
    scheduleOfRecord?: Schedule
    scheduleOfRetrospective: Schedule
    tags?: string[]
  }

export type UnpublishedGoal = Draft<PublishedGoal, 'publishedAt'>

export type Goal = PublishedGoal | UnpublishedGoal

export type GoalDraft = Draft<Goal, 'objectID'>

export type GoalDraftStep1 = Draft<GoalDraft, 'goalType'>

export type GoalType = '結果目標' | '状態目標' | '行動目標'

export type GoalTypeBlank = null

export type GoalStatus = 'draft' | 'published' | 'archived'
export type DisplayGoalStatus = '下書き中' | '公開中' | 'アーカイブ済み'

export enum DisplayGoalStatuses {
  draft = '下書き中',
  published = '公開中',
  archived = 'アーカイブ済み',
}

export type Schedule = {
  period: Period
  periodSpan: number
  hour: Hour
  startAt: firebase.firestore.Timestamp
  option?: WeeklyOption | MonthlyOption
}

export type ScheduleType = 'record' | 'retrospective'

export type ScheduleDate = DomainTypeBase &
  GoalTypeBase & {
    scheduleType: ScheduleType
    scheduleAt: firebase.firestore.Timestamp
    alertedAt?: firebase.firestore.Timestamp
  }

export type ScheduleDateDraft = Draft<ScheduleDate, 'objectID'>

export type WeeklyOption = {
  weekDays: WeekDay[]
}

export type MonthlyOption = {
  optionType: MonthlyOptionType
  option: MonthlyDayOption | MonthlyWeekOption
}

export type MonthlyOptionType = '日付指定' | '曜日指定'

export type MonthlyDayOption = {
  day: number
}

export type MonthlyWeekOption = {
  ordinalNumber: number
  weekDay: WeekDay
}

export type ScheduleForm = {
  period: Period | 'weekdays'
  optionType: MonthlyOptionType
  periodSpan: number
  day: number
  ordinalNumber: number
  weekDay: WeekDay
  weekDays: WeekDay[]
  hour: Hour
}

// prettier-ignore
export type Hour = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15 | 16 | 17 | 18 | 19 | 20 | 21 | 22 | 23

export type WeekDay = 0 | 1 | 2 | 3 | 4 | 5 | 6

export type Period = 'daily' | 'weekly' | 'monthly'

export type Record = DomainTypeBase &
  UserTypeBase & {
    goalId: string
    scheduleDateId?: string
    comment: string
    image?: string
  }

export type RecordDraft = Draft<Record, 'objectID'>

export type Retrospective = DomainTypeBase &
  UserTypeBase & {
    goalId: string
    scheduleDateId?: string
    comment: string
    image?: string
    achieveRate: number
  }

export type RetrospectiveDraft = Draft<Retrospective, 'objectID'>

export type Timeline = TimelineGoal | TimelineRecord | TimelineRetrospective
export type TimelineType = 'goal' | 'record' | 'retrospective'

export type TimelineBase = {
  timelineType: TimelineType
}

export type TimelineGoal = Goal & TimelineBase
export type TimelineRecord = Record & TimelineBase
export type TimelineRetrospective = Retrospective & TimelineBase

export type Team = DomainTypeBase & {
  name: string
  members: User[]
}

export type TeamDraft = Draft<Team, 'objectID'>

export type MailForm = {
  to: string
  from: string
  subject: string
  body: string
}

export type FirestoreCollections =
  | null
  | 'users'
  | 'goals'
  | 'records'
  | 'retrospectives'
  | 'scheduleDates'
  | 'teams'

export type FirestoreDateProperty =
  | 'archivedAt'
  | 'publishedAt'
  | 'startAt'
  | 'endAt'
  | 'createdAt'
  | 'alertedAt'
  | 'scheduleAt'

export type FirestoreUserProperty = 'userId' | 'createdUser'

export type FirestoreGoalProperty = 'goalId'

export type FirestoreTable = {
  tableName: FirestoreCollections
  collection: any[]
  columns: FirestoreColumn[]
}
export type FirestoreColumn = {
  field: string
  label: string
}

export type DiffDate = {
  diff: number
  unit: '日' | '時間'
}
