import cloneDeep from 'lodash/cloneDeep'
import * as types from '~/types/domainTypes'
import {
  RECORD_SCHEDULE_INIT_VALUE,
  SCHEDULE_FORM_INIT_VALUE,
} from '~/constants/domainInits'
import { WEEK_DAYS } from '~/constants/domains/schedule'

export const getSchedule = (form: types.ScheduleForm): types.Schedule => {
  const schedule = cloneDeep(RECORD_SCHEDULE_INIT_VALUE)
  schedule.periodSpan = form.periodSpan
  schedule.hour = form.hour
  schedule.period = form.period === 'weekdays' ? 'weekly' : form.period
  switch (form.period) {
    case 'daily':
      break
    case 'weekdays':
      schedule.option = {
        weekDays: WEEK_DAYS,
      } as types.WeeklyOption
      break
    case 'weekly':
      form.weekDays.sort()
      schedule.option = {
        weekDays: form.weekDays as types.WeekDay[],
      } as types.WeeklyOption
      break
    case 'monthly':
      switch (form.optionType) {
        case '日付指定':
          schedule.option = {
            optionType: '日付指定',
            option: {
              day: form.day,
            } as types.MonthlyDayOption,
          } as types.MonthlyOption
          break
        case '曜日指定':
          schedule.option = {
            optionType: '曜日指定',
            option: {
              ordinalNumber: form.ordinalNumber,
              weekDay: form.weekDay,
            } as types.MonthlyWeekOption,
          } as types.MonthlyOption
          break
      }
  }
  return schedule
}

// スケジュールがundefinedの場合はフォームの初期値を返す
export const getForm = (
  schedule: types.Schedule | undefined
): types.ScheduleForm => {
  const form = SCHEDULE_FORM_INIT_VALUE
  if (schedule === undefined) return form
  form.periodSpan = schedule.periodSpan
  form.hour = schedule.hour
  form.period = schedule.period
  switch (schedule.period) {
    case 'daily':
      break
    case 'weekly':
      const weeklyOption: types.WeeklyOption = schedule.option as types.WeeklyOption
      // TODO: weeklyOption.weekDaysを直接ソートするとmutationエラーのため
      const weekDays = [...weeklyOption.weekDays]
      weekDays.sort()
      // JSON形式（ほぼ文字列）にして配列を比較
      if (JSON.stringify(weekDays) === JSON.stringify(WEEK_DAYS)) {
        form.period = 'weekdays'
      }
      form.weekDays = weeklyOption.weekDays
      break
    case 'monthly':
      const monthlyOption: types.MonthlyOption = schedule.option as types.MonthlyOption
      form.optionType = monthlyOption.optionType
      switch (monthlyOption.optionType) {
        case '日付指定':
          const monthlyDayOption: types.MonthlyDayOption = monthlyOption.option as types.MonthlyDayOption
          form.day = monthlyDayOption.day
          break
        case '曜日指定':
          const monthlyWeekOption: types.MonthlyWeekOption = monthlyOption.option as types.MonthlyWeekOption
          form.ordinalNumber = monthlyWeekOption.ordinalNumber
          form.weekDay = monthlyWeekOption.weekDay
          break
        default:
          break
      }
  }
  return form
}
