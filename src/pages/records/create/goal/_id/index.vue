<template>
  <base-page-template v-if="isShow">
    <template v-slot:header-left>
      <div class="back" @click="$router.go(-1)">
        <b-icon icon="chevron-left" />
      </div>
    </template>
    <template v-slot:header-center>
      <p>記録する</p>
    </template>
    <template v-slot:header-right>
      <b-button type="is-success" icon-left="check" @click="store">
        Done
      </b-button>
    </template>
    <template v-slot:content>
      <InputForm
        type="record"
        :goal="goal"
        :draft.sync="recordDraft"
        :schedule-dates="scheduleDates"
        :out-of-schedule.sync="outOfSchedule"
        :upload-files.sync="uploadFiles"
        :records="records"
        :retrospectives="retrospectives"
        @draft-update="draftUpdate"
      />
    </template>
  </base-page-template>
</template>

<script lang="ts">
import { Component, Mixins } from 'vue-property-decorator'
import cloneDeep from 'lodash/cloneDeep'
import { RECORD_INIT_VALUE } from '~/constants/domainInits'
import BasePage from '~/mixins/basePage'
import BasePageTemplate from '~/components/pages/basePageTemplate.vue'
import InputForm from '~/components/molecules/domains/recordsAndRetrospectives/inputForm.vue'
import * as types from '~/types/domainTypes'
import { goal } from '~/modules/firebase/firestore/goals'
import {
  recordsOfGoal,
  recordOfScheduleDate,
} from '~/modules/firebase/firestore/records'
import { retrospectivesOfGoal } from '~/modules/firebase/firestore/retrospectives'
import { scheduleDatesOfGoal } from '~/modules/firebase/firestore/scheduleDates'
import { timestampOfCurrentTime } from '~/modules/dayjs'
import { canCreateRecordsOfScheduleDate } from '~/modules/domains/scheduleDate'
import { storeRecord } from '~/apis/records'
import { AuthState } from '~/store/auth'
import { uploadImage } from '~/modules/fileUpload'

@Component({
  components: {
    BasePageTemplate,
    InputForm,
  },
})
export default class RecordCreate extends Mixins(BasePage) {
  recordDraft: types.RecordDraft = cloneDeep(RECORD_INIT_VALUE)
  goal: types.Goal | null = null
  scheduleDates: types.ScheduleDate[] = []
  records: types.Record[] = []
  retrospectives: types.Retrospective[] = []
  outOfSchedule: boolean = false
  uploadFiles: File[] = []

  async mounted(): Promise<void> {
    this.startPageMounted()
    await this.loginCheck()
    this.recordDraft.goalId = this.$route.params.id
    await Promise.all([
      scheduleDatesOfGoal(this.recordDraft.goalId).then(
        res => (this.scheduleDates = res)
      ),
      recordsOfGoal(this.recordDraft.goalId, 'desc').then(
        res => (this.records = res)
      ),
      retrospectivesOfGoal(this.recordDraft.goalId, 'desc').then(
        res => (this.retrospectives = res)
      ),
      goal(this.recordDraft.goalId).then(res => (this.goal = res)),
    ])
    if (this.goal !== null) {
      this.recordDraft.userId = this.goal.userId
      this.recordDraft.createdAt = timestampOfCurrentTime()
      this.scheduleDates = await canCreateRecordsOfScheduleDate(this.goal)
      this.outOfSchedule = !this.existsValidScheduleDates
      if (this.$route.query.id)
        this.recordDraft.scheduleDateId = this.$route.query.id as string
      this.validate()
    }
    this.endPageMounted()
  }

  get auth(): AuthState {
    return this.$store.state.auth
  }

  get isOwn(): boolean {
    return this.goal !== null && this.auth.uid === this.goal.userId
  }

  get existsValidScheduleDates(): boolean {
    return this.scheduleDates.length > 0
  }

  async validate(): Promise<void> {
    // 自分の目標でない場合はnot foundにする
    if (!this.isOwn) this.$router.push('/error') // TODO: 暫定処理なのできれいに書き直す

    // 対象のスケジュール日付が取得出来ない場合は登録済みであるとみなして詳細ページに遷移する
    const scheduleDateId = this.$route.query.id
    if (
      scheduleDateId &&
      typeof scheduleDateId === 'string' &&
      !this.scheduleDates.find(
        scheduleDate => scheduleDate.objectID === scheduleDateId
      )
    ) {
      const record = await recordOfScheduleDate(scheduleDateId)
      if (record) this.$router.push(`/records/${record.objectID}`)
    }
  }

  destroyed(): void {
    this.recordDraft = cloneDeep(RECORD_INIT_VALUE)
    this.goal = null
    this.scheduleDates = []
    this.records = []
    this.outOfSchedule = false
  }

  async store(): Promise<void> {
    if (
      (this.recordDraft.comment === '' && this.uploadFiles.length === 0) ||
      (!this.outOfSchedule && !this.recordDraft.scheduleDateId)
    ) {
      this.$buefy.toast.open('入力情報が足りません')
      return
    }
    this.startPageMounted()
    if (this.outOfSchedule) this.recordDraft.scheduleDateId = undefined
    try {
      await this.uploadImage()
      await storeRecord(this.recordDraft)
      this.$buefy.toast.open('記録を登録しました🎊')
      this.endPageMounted()
      this.$router.push(`/goals/${this.recordDraft.goalId}`)
    } catch {
      this.failedUpdate()
    }
  }

  draftUpdate(draft: types.RecordDraft): void {
    this.recordDraft = { ...draft }
  }

  async uploadImage(): Promise<void> {
    if (
      !this.recordDraft ||
      !this.uploadFiles.length ||
      !this.recordDraft.image
    )
      return
    try {
      this.recordDraft = await uploadImage(
        'record',
        this.recordDraft,
        this.uploadFiles
      )
    } catch {
      this.failedUpdate()
    }
  }
}
</script>

<style lang="scss" scoped>
// TODO: 場所を移動してしまったので使っていないが、ヘッダーボタンを整備する際に使うかもしれないので残しておく
.button-area {
  padding: 1rem;
  text-align: right;

  button:active {
    background-color: $border-color;
  }

  .send-button {
    border: solid 1px $border-color;
    background-color: $background-primary-color;
    border-radius: 0.3rem;
    font-size: 0.9rem;
  }

  button:focus {
    outline: none;
  }
}
</style>
