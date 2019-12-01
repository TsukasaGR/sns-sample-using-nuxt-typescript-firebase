import { Component, Mixins } from 'vue-property-decorator'
import basePage from '~/mixins/basePage'
import * as types from '~/types/domainTypes'
import { goalOrNull } from '~/modules/firebase/firestore/goals'

@Component
export default class extends Mixins(basePage) {
  isConfirmToChangeScheduleModalActive = false
  confirmToPublish(func: () => {}) {
    this.$buefy.dialog.confirm({
      title: '目標の公開',
      message: '目標を公開してもよろしいですか？',
      cancelText: 'キャンセル',
      confirmText: '公開',
      type: 'is-primary',
      onConfirm: func,
    })
  }
  confirmToChangeSchedule(func: () => {}) {
    this.$buefy.dialog.confirm({
      title: '目標の更新',
      message:
        'スケジュールが変更されています。<br />今日起点でスケジュールが再設定されます。<br />よろしいですか？',
      cancelText: 'キャンセル',
      confirmText: '更新',
      type: 'is-primary',
      onConfirm: func,
    })
  }
  alertReload(e) {
    e.preventDefault()
    e.returnValue = 'このサイトを再読み込みしますか？'
  }
  async isChangeSchedule(after: types.Goal): Promise<boolean> {
    if (!after) return false
    const before = await goalOrNull(after.objectID)
    if (!before) return false

    return (
      JSON.stringify(before.endAt) !== JSON.stringify(after.endAt) ||
      // prettier-ignore
      JSON.stringify(before.scheduleOfRecord) !== JSON.stringify(after.scheduleOfRecord) ||
      // prettier-ignore
      JSON.stringify(before.scheduleOfRetrospective) !== JSON.stringify(after.scheduleOfRetrospective)
    )
  }
}
