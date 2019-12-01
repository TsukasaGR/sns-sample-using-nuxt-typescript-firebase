<template>
  <div>
    <div v-if="isNotActivity" class="text">
      アクティビティがありません
    </div>
    <div v-else class="goal-container">
      <div v-if="showGoalSummary" class="goal-schedule">
        <p v-if="numberOfRecord">
          記録
          {{ numberOfRecord }}
          回
        </p>
        <p v-if="numberOfRetrospective">
          振り返り
          {{ numberOfRetrospective }}
          回
        </p>
        <p v-if="achieveRateAverage">
          平均達成率
          {{ achieveRateAverage }}
          ％
        </p>
      </div>
      <div v-if="showGoalRemind" class="goal-remind">
        <p v-if="diffToTodayOfRecord !== null">
          次の記録まで
          <br />
          <span :class="{ 'expired-days': diffToTodayOfRecord.diff < 0 }">
            {{ displayTimeToNextScheduleOfRecord }}
          </span>
        </p>
        <p v-if="diffToTodayOfRetrospective !== null">
          次の振り返りまで
          <br />
          <span
            :class="{ 'expired-days': diffToTodayOfRetrospective.diff < 0 }"
          >
            {{ displayTimeToNextShceduleOfRetrospective }}
          </span>
        </p>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'
import * as types from '~/types/domainTypes'
import { recordsOfGoal } from '~/modules/firebase/firestore/records'
import { retrospectivesOfGoal } from '~/modules/firebase/firestore/retrospectives'
import { scheduleDatesOfGoal } from '~/modules/firebase/firestore/scheduleDates'
import { achieveRateAverage } from '~/modules/domains/retrospective'
import { undoneScheduleDates } from '~/modules/domains/scheduleDate'
import {
  displayDateFromFirestoreTimestamp,
  nextSchedule,
} from '~/modules/dayjs'

@Component
export default class ActivityItem extends Vue {
  @Prop({ type: Object, required: true }) goal!: types.Goal

  records: types.Record[] = []
  retrospectives: types.Retrospective[] = []
  scheduleDates: types.ScheduleDate[] = []
  undoneScheduleRecords: types.ScheduleDate[] = []
  undoneScheduleRetrospectives: types.ScheduleDate[] = []

  async mounted(): Promise<void> {
    await Promise.all([
      this.recordsOfGoal(),
      this.retrospectivesOfGoal(),
      this.scheduleDatesOfGoal(),
      this.undoneScheduleRecord(),
      this.undoneScheduleRetrospective(),
    ])
  }

  async recordsOfGoal(): Promise<void> {
    this.records = await recordsOfGoal(this.goal.objectID)
  }
  async retrospectivesOfGoal(): Promise<void> {
    this.retrospectives = await retrospectivesOfGoal(this.goal.objectID)
  }
  async scheduleDatesOfGoal(): Promise<void> {
    this.scheduleDates = await scheduleDatesOfGoal(this.goal.objectID)
  }

  async undoneScheduleRecord(): Promise<void> {
    this.undoneScheduleRecords = await undoneScheduleDates(this.goal, 'record')
  }

  async undoneScheduleRetrospective(): Promise<void> {
    this.undoneScheduleRetrospectives = await undoneScheduleDates(
      this.goal,
      'retrospective'
    )
  }

  get numberOfRecord(): number {
    return this.records.length
  }
  get numberOfRetrospective(): number {
    return this.retrospectives.length
  }
  get achieveRateAverage(): string {
    return achieveRateAverage(this.retrospectives)
  }
  get showGoalSummary(): boolean {
    return (
      this.numberOfRecord > 0 ||
      this.numberOfRetrospective > 0 ||
      this.achieveRateAverage !== ''
    )
  }
  get displayTimeToNextScheduleOfRecord(): string | null {
    if (!this.diffToTodayOfRecord) return null
    return `${this.diffToTodayOfRecord.diff}${this.diffToTodayOfRecord.unit}`
  }
  get displayTimeToNextShceduleOfRetrospective(): string | null {
    if (!this.diffToTodayOfRetrospective) return null
    return `${this.diffToTodayOfRetrospective.diff}${this.diffToTodayOfRetrospective.unit}`
  }
  get diffToTodayOfRecord(): types.DiffDate | null {
    return this.diffToToday('record')
  }
  get diffToTodayOfRetrospective(): types.DiffDate | null {
    return this.diffToToday('retrospective')
  }
  get displayEndAt(): string {
    return displayDateFromFirestoreTimestamp(this.goal.endAt)
  }
  get showGoalRemind(): boolean {
    return (
      this.diffToTodayOfRecord !== null ||
      this.diffToTodayOfRetrospective !== null
    )
  }
  get icon() {
    return this.goal && this.goal.icon
      ? this.goal.icon
      : 'https://firebasestorage.googleapis.com/v0/b/project-ego-staging-f9aae.appspot.com/o/no_image.png?alt=media&token=1316c5a2-b076-4bb9-9d3c-9c2cdd3b7faa'
  }

  get isNotActivity(): boolean {
    return !this.showGoalSummary && !this.showGoalRemind
  }
  // 最も古いscheduleDateの日付までの日数を求める（過去の場合はマイナス）
  diffToToday(scheduleType: types.ScheduleType): types.DiffDate | null {
    const undoneScheduleDates =
      scheduleType === 'record'
        ? this.undoneScheduleRecords
        : this.undoneScheduleRetrospectives
    return undoneScheduleDates.length > 0
      ? nextSchedule(undoneScheduleDates)
      : null
  }
}
</script>

<style lang="scss" scoped>
.goal {
  cursor: pointer;
}

.goal-container {
  padding: 0.5rem;
  width: 100%;
  background: $background-primary-color;
  border-radius: 5px;
  font-weight: 700;
  margin-top: 1rem;

  .icon-content {
    font-size: 0.5rem;
    text-align: center;
    padding-right: 0.5rem;
    width: 10%;

    .circle {
      width: 3rem;
      height: 3rem;
      margin: auto;

      img {
        width: 100%;
        height: 100%;
        border-radius: 50%;
        background: $border-color;
        object-fit: cover;
      }
    }
  }

  .goal-schedule {
    padding: 1rem 0.5rem;
    display: flex;
    justify-content: space-around;
    text-align: center;
  }

  .goal-remind {
    padding: 1rem 0.5rem;
    display: flex;
    justify-content: space-around;
    text-align: center;
    border-top: dotted 2px $border-color;
  }

  .expired-days {
    color: red;
  }
}
</style>
