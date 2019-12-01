import * as types from '~/types/domainTypes'

export function isWeekly(scheduleForm: types.ScheduleForm): boolean {
  return scheduleForm.period === 'weekly'
}
export function isMonthly(scheduleForm: types.ScheduleForm): boolean {
  return scheduleForm.period === 'monthly'
}
export function isDay(scheduleForm: types.ScheduleForm): boolean {
  return scheduleForm.optionType === '日付指定'
}
export function isWeek(scheduleForm: types.ScheduleForm): boolean {
  return scheduleForm.optionType === '曜日指定'
}
export function isValidate(scheduleForm: types.ScheduleForm): boolean {
  return !(
    scheduleForm.period === 'weekly' && scheduleForm.weekDays.length === 0
  )
}
