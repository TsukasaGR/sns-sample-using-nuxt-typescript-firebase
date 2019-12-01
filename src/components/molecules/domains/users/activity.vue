<template>
  <div class="activity-content">
    <div class="item">
      記録 {{ recordCount }}
      回
    </div>
    <div class="item">
      <span v-if="recordRate">
        記録率
        {{ recordRate }}％
      </span>
    </div>
    <div class="item">
      振り返り {{ retrospectiveCount }}
      回
    </div>
    <div class="item">
      <span v-if="retrospectiveRate">
        振り返り率
        {{ retrospectiveRate }}％
      </span>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import * as types from '~/types/domainTypes'

@Component({})
export default class UserActivity extends Vue {
  @Prop({ type: Array, required: true }) records!: types.Record[]
  @Prop({ type: Array, required: true }) retrospectives!: types.Retrospective[]
  @Prop({ type: Array, required: true }) scheduleDates!: types.ScheduleDate[]
  get recordCount(): number {
    return this.records.length
  }
  get retrospectiveCount(): number {
    return this.retrospectives.length
  }

  get recordRate(): number | null {
    const scheduledRecords = this.records.filter(
      record => record.scheduleDateId
    )
    return this.expiredScheduleDateCount('record') !== 0
      ? Math.floor(
          (scheduledRecords.length / this.expiredScheduleDateCount('record')) *
            100
        )
      : null
  }

  get retrospectiveRate(): number | null {
    const scheduledRetrospectives = this.records.filter(
      record => record.scheduleDateId
    )
    return this.expiredScheduleDateCount('retrospective') !== 0
      ? Math.floor(
          (scheduledRetrospectives.length /
            this.expiredScheduleDateCount('retrospective')) *
            100
        )
      : null
  }

  expiredScheduleDateCount(scheduleType: types.ScheduleType): number {
    return this.scheduleDates.filter(
      scheduleDate =>
        scheduleDate.scheduleAt.toDate() < new Date() &&
        scheduleDate.scheduleType === scheduleType
    ).length
  }
}
</script>

<style lang="scss" scoped>
.activity-content {
  padding: 1rem 0.5rem;
  display: flex;
  flex-wrap: wrap;
  text-align: center;
  font-weight: bold;
  .item {
    width: 50%;
    padding-top: 1rem;
  }
}
</style>
