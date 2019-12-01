<template>
  <div>
    <div class="option-container">
      <span class="label-item">周期</span>
      <div class="label-item intervel-container">
        <b-select v-model="scheduleForm.periodSpan" type="number">
          <option v-for="(span, index) in 12" :key="index" :value="span">
            {{ span }}
          </option>
        </b-select>
        <b-select v-model="scheduleForm.period">
          <option
            v-for="(period, index) in SELECT_PERIODS"
            :key="index"
            :value="period.en"
          >
            {{ period.ja }}
          </option>
        </b-select>
      </div>
    </div>
    <!-- 週間ごと start -->
    <div v-if="isWeekly" class="option-container">
      <span class="label-item">曜日</span>
      <div>
        <div v-for="(week, index) in SELECT_WEEKS" :key="index">
          <b-switch
            v-model="scheduleForm.weekDays"
            :native-value="week.num"
            type="is-success"
          />
          {{ week.ja }}
        </div>
      </div>
    </div>
    <!-- 週間ごと end -->
    <!-- ヶ月ごと start -->
    <div v-if="isMonthly" class="option-container">
      <div class="label-item">
        <b-select v-model="scheduleForm.optionType" name="period">
          <option value="日付指定" selected>
            日付指定
          </option>
          <option value="曜日指定">
            曜日指定
          </option>
        </b-select>
        <b-select
          v-if="isWeek"
          v-model="scheduleForm.ordinalNumber"
          type="number"
        >
          <option v-for="(number, index) in 5" :key="index" :value="number">
            <span>第</span>
            <span>{{ number }}</span>
          </option>
        </b-select>
      </div>
      <div v-if="isDay" class="label-item">
        毎月
        <b-select v-model="scheduleForm.day" type="number">
          <option v-for="(day, index) in 31" :key="index" :value="day">
            {{ day }}
          </option>
        </b-select>
        日
      </div>
      <div v-else-if="isWeek">
        <div v-for="(week, index) in SELECT_WEEKS" :key="index">
          <b-radio
            v-model="scheduleForm.weekDay"
            :native-value="week.num"
            name="weekDay"
            type="is-success"
          >
            {{ week.ja }}
          </b-radio>
        </div>
      </div>
    </div>
    <!-- ヶ月ごと end -->
    <div v-if="scheduleForm.period !== ''" class="option-container">
      <span class="label-item">時間</span>
      <div class="label-item">
        <b-select v-model="scheduleForm.hour" type="number">
          <option v-for="(hour, index) in 24" :key="index" :value="hour - 1">
            {{ hour - 1 }}
          </option>
        </b-select>
        <span>時</span>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'
import * as types from '~/types/domainTypes'
import { SELECT_PERIODS, SELECT_WEEKS } from '~/constants/domains/schedule'
import {
  isWeekly,
  isMonthly,
  isDay,
  isWeek,
} from '~/modules/domains/scheduleForm'

@Component({})
export default class GoalsScheduleForm extends Vue {
  @Prop({ type: Object, required: true }) scheduleForm!: types.ScheduleForm
  SELECT_PERIODS = SELECT_PERIODS
  SELECT_WEEKS = SELECT_WEEKS

  get isWeekly() {
    return isWeekly(this.scheduleForm)
  }
  get isMonthly() {
    return isMonthly(this.scheduleForm)
  }
  get isDay() {
    return isDay(this.scheduleForm)
  }
  get isWeek() {
    return isWeek(this.scheduleForm)
  }
}
</script>

<style lang="scss" scoped>
.option-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 90%;
  margin: auto;

  &:not(:last-child) {
    margin-bottom: 12px;
  }

  .label-item {
    display: flex;
    align-items: center;

    .intervel-container {
      display: flex;
      justify-content: flex-start;
    }
  }
}
</style>
