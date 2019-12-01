<template>
  <base-page-template v-if="isShow">
    <template v-slot:header-left>
      <div class="back" @click="$router.go(-1)">
        <b-icon icon="chevron-left" />
      </div>
    </template>
    <template v-slot:header-center>
      <p>振り返る</p>
    </template>
    <template v-slot:header-right>
      <b-button type="is-success" icon-left="check" @click="store">
        Done
      </b-button>
    </template>
    <template v-slot:content>
      <InputForm
        type="retrospective"
        :goal="goal"
        :draft.sync="retrospectiveDraft"
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
import { RETROSPECTIVE_INIT_VALUE } from '~/constants/domainInits'
import BasePage from '~/mixins/basePage'
import BasePageTemplate from '~/components/pages/basePageTemplate.vue'
import InputForm from '~/components/molecules/domains/recordsAndRetrospectives/inputForm.vue'
import * as types from '~/types/domainTypes'
import { goal } from '~/modules/firebase/firestore/goals'
import { recordsOfGoal } from '~/modules/firebase/firestore/records'
import {
  retrospectivesOfGoal,
  retrospectiveOfScheduleDate,
} from '~/modules/firebase/firestore/retrospectives'
import { scheduleDatesOfGoal } from '~/modules/firebase/firestore/scheduleDates'
import { timestampOfCurrentTime } from '~/modules/dayjs'
import { canCreateRetrospectivesOfScheduleDate } from '~/modules/domains/scheduleDate'
import { storeRetrospective } from '~/apis/retrospectives'
import { AuthState } from '~/store/auth'
import { uploadImage } from '~/modules/fileUpload'

@Component({
  components: {
    BasePageTemplate,
    InputForm,
  },
})
export default class PagesRetrospectivesGoalIdCreate extends Mixins(BasePage) {
  retrospectiveDraft: types.RetrospectiveDraft = { ...RETROSPECTIVE_INIT_VALUE }
  goal: types.Goal | null = null
  scheduleDates: types.ScheduleDate[] = []
  records: types.Record[] = []
  retrospectives: types.Retrospective[] = []
  outOfSchedule: boolean = false
  uploadFiles: File[] = []

  async mounted(): Promise<void> {
    this.startPageMounted()
    await this.loginCheck()
    this.retrospectiveDraft.goalId = this.$route.params.id
    await Promise.all([
      scheduleDatesOfGoal(this.retrospectiveDraft.goalId).then(
        res => (this.scheduleDates = res)
      ),
      recordsOfGoal(this.retrospectiveDraft.goalId, 'desc').then(
        res => (this.records = res)
      ),
      retrospectivesOfGoal(this.retrospectiveDraft.goalId, 'desc').then(
        res => (this.retrospectives = res)
      ),
      goal(this.retrospectiveDraft.goalId).then(res => (this.goal = res)),
    ])
    if (this.goal !== null) {
      this.retrospectiveDraft.userId = this.goal.userId
      this.retrospectiveDraft.createdAt = timestampOfCurrentTime()
      this.scheduleDates = await canCreateRetrospectivesOfScheduleDate(
        this.goal
      )
      this.outOfSchedule = !this.existsValidScheduleDates
      if (this.$route.query.id)
        this.retrospectiveDraft.scheduleDateId = this.$route.query.id as string
      this.validate()
    }
    this.endPageMounted()
  }

  destroyed(): void {
    this.retrospectiveDraft = { ...RETROSPECTIVE_INIT_VALUE }
    this.goal = null
    this.scheduleDates = []
    this.retrospectives = []
    this.outOfSchedule = false
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
      const retrospective = await retrospectiveOfScheduleDate(scheduleDateId)
      if (retrospective)
        this.$router.push(`/retrospectives/${retrospective.objectID}`)
    }
  }

  async store(): Promise<void> {
    if (
      this.retrospectiveDraft.comment === '' ||
      (!this.outOfSchedule &&
        this.retrospectiveDraft.scheduleDateId === undefined)
    ) {
      this.$buefy.toast.open('入力情報が足りません')
      return
    }
    try {
      this.startPageMounted()
      if (this.outOfSchedule) this.retrospectiveDraft.scheduleDateId = undefined
      await this.uploadImage()
      await storeRetrospective(this.retrospectiveDraft)
      this.endPageMounted()
      this.$buefy.toast.open('振り返りを登録しました😘')
      this.$router.push(`/goals/${this.retrospectiveDraft.goalId}`)
    } catch {
      this.failedUpdate()
    }
  }

  draftUpdate(draft: types.RetrospectiveDraft): void {
    this.retrospectiveDraft = { ...draft }
  }

  async uploadImage(): Promise<void> {
    if (
      !this.retrospectiveDraft ||
      !this.uploadFiles.length ||
      !this.retrospectiveDraft.image
    )
      return
    try {
      this.retrospectiveDraft = await uploadImage(
        'retrospective',
        this.retrospectiveDraft,
        this.uploadFiles
      )
    } catch {
      this.failedUpdate()
    }
  }
}
</script>

<style lang="scss" scoped>
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
