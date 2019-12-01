import * as types from '~/types/domainTypes'

export const SELECT_PERIODS = [
  { en: 'daily', ja: '日ごと' },
  { en: 'weekdays', ja: '平日' },
  { en: 'weekly', ja: '週間ごと' },
  { en: 'monthly', ja: 'ヶ月ごと' },
]

export type SelectWeeksProperty = {
  num: number
  ja: string
  jaShort: string
}

export const SELECT_WEEKS: SelectWeeksProperty[] = [
  { num: 0, ja: '日曜日', jaShort: '日' },
  { num: 1, ja: '月曜日', jaShort: '月' },
  { num: 2, ja: '火曜日', jaShort: '火' },
  { num: 3, ja: '水曜日', jaShort: '水' },
  { num: 4, ja: '木曜日', jaShort: '木' },
  { num: 5, ja: '金曜日', jaShort: '金' },
  { num: 6, ja: '土曜日', jaShort: '土' },
]

export const WEEK_DAYS: types.WeekDay[] = [1, 2, 3, 4, 5]
