import * as types from '~/types/domainTypes'

export function achieveRateAverage(
  retrospectives: types.Retrospective[]
): string {
  if (retrospectives.length === 0) return ''

  let average = 0
  const initialValue = 0
  average =
    retrospectives.reduce((prev, current) => {
      return typeof current.achieveRate === 'number'
        ? prev + Number(current.achieveRate)
        : prev
    }, initialValue) / retrospectives.length

  return average.toFixed(1)
}
