import cloneDeep from 'lodash/cloneDeep'
import * as types from '~/types/domainTypes'
import * as appTypes from '~/types/applicationTypes'
import { SELECT_WEEKS, WEEK_DAYS } from '~/constants/domains/schedule'

export function isDraft(goal: types.Goal): boolean {
  return !isArchived(goal) && !isPublished(goal)
}

export function isPublished(goal: types.Goal): boolean {
  return (
    goal.hasOwnProperty('publishedAt') &&
    goal.publishedAt !== null &&
    !isArchived(goal)
  )
}

export function isArchived(goal: types.Goal): boolean {
  return goal.hasOwnProperty('archivedAt') && goal.archivedAt !== null
}

export function status(goal: types.Goal): types.GoalStatus {
  return isArchived(goal)
    ? 'archived'
    : isPublished(goal)
    ? 'published'
    : 'draft'
}

export function displayStatus(goalStatus: types.GoalStatus): string {
  return types.DisplayGoalStatuses[goalStatus]
}

export function displayStatusFromGoal(goal: types.Goal): string {
  return types.DisplayGoalStatuses[status(goal)]
}

export function sortGoals(
  goals: types.Goal[],
  sortOrder: appTypes.SortOrder = 'asc'
): types.Goal[] {
  goals.sort((a, b) => {
    if (sortOrder === 'desc') {
      if (a.createdAt > b.createdAt) return -1
      if (a.createdAt < b.createdAt) return 1
      return 0
    } else {
      if (a.createdAt < b.createdAt) return -1
      if (a.createdAt > b.createdAt) return 1
      return 0
    }
  })
  return goals
}

export function isPassedStep1(
  goal: types.GoalDraft | types.GoalDraftStep1
): boolean {
  return goal.title !== '' && goal.goalType !== null
}

export function isPeriodWeekDays(
  goal: types.Goal,
  scheduleType: types.ScheduleType
): boolean {
  const schedule =
    scheduleType === 'record'
      ? cloneDeep(goal.scheduleOfRecord)
      : cloneDeep(goal.scheduleOfRetrospective)

  if (
    schedule === undefined ||
    schedule === null ||
    schedule.period !== 'weekly' ||
    schedule.option === undefined ||
    schedule.option === null
  )
    return false

  const weekDays = (schedule.option as types.WeeklyOption).weekDays
  weekDays.sort()
  return JSON.stringify(weekDays) === JSON.stringify(WEEK_DAYS)
}

export function displaySchedule(
  goal: types.Goal,
  scheduleType: types.ScheduleType
): string {
  const schedule =
    scheduleType === 'record'
      ? goal.scheduleOfRecord
      : goal.scheduleOfRetrospective

  if (schedule === undefined || schedule === null) return '未設定'

  let displaySchedule = ''

  switch (schedule.period) {
    case 'daily':
      displaySchedule += '日次'
      displaySchedule +=
        schedule.periodSpan === 1 ? '/毎日' : `/${schedule.periodSpan}日ごと`
      displaySchedule += `/${schedule.hour}時`
      break
    case 'weekly':
      displaySchedule += '週次'
      displaySchedule +=
        schedule.periodSpan === 1 ? '/毎週' : `/${schedule.periodSpan}週ごと`
      if (schedule.option !== undefined) {
        const weekDays = (schedule.option as types.WeeklyOption).weekDays
        if (isPeriodWeekDays(goal, scheduleType)) {
          displaySchedule += '/平日'
        } else {
          let displayWeekDays = ''
          for (const weekDay of weekDays) {
            displayWeekDays += displayWeekDays ? ',' : '/'
            const selectWeek = SELECT_WEEKS.find(week => week.num === weekDay)
            if (selectWeek) displayWeekDays += selectWeek.jaShort
          }
          displaySchedule += displayWeekDays
        }
      }
      displaySchedule += `/${schedule.hour}時`
      break
    case 'monthly':
      displaySchedule += '月次'
      displaySchedule +=
        schedule.periodSpan === 1 ? '/毎月' : `/${schedule.periodSpan}ヶ月ごと`
      if (schedule.option !== undefined) {
        const option = schedule.option as types.MonthlyOption
        if (option.optionType === '日付指定') {
          const optionDetail = (schedule.option as types.MonthlyOption)
            .option as types.MonthlyDayOption
          displaySchedule += `/${optionDetail.day}日`
        } else {
          const optionDetail = (schedule.option as types.MonthlyOption)
            .option as types.MonthlyWeekOption
          displaySchedule += `/第${optionDetail.ordinalNumber}`
          const selectWeek = SELECT_WEEKS.find(
            week => week.num === optionDetail.weekDay
          )
          if (selectWeek) displaySchedule += selectWeek.ja
        }
      }
      displaySchedule += `/${schedule.hour}時`
  }

  return displaySchedule
}
