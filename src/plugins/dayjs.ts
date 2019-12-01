import dayjs from 'dayjs'
import * as locale from 'dayjs/locale/ja'
import relativeTime from 'dayjs/plugin/relativeTime'

dayjs.locale(locale)
dayjs.extend(relativeTime)

export default dayjs
