<template>
  <base-page-template v-if="isShow">
    <template v-slot:header-left>
      <div class="back" @click="store(false, false)">
        <b-icon icon="chevron-left" />
      </div>
    </template>
    <template v-slot:header-center>
      <p>目標登録: Step3</p>
    </template>
    <template v-slot:header-right>
      <b-button type="is-success" @click="store(false, true)">
        公開
      </b-button>
    </template>
    <template v-slot:content>
      <StepBar :step="3" />
      <div v-if="goal">
        <b-field label="振り返りタイミング">
          <GoalsScheduleForm :schedule-form="scheduleForm" />
        </b-field>
      </div>
      <div class="footer-container">
        <b-button @click="store(true, false)">
          下書き保存
        </b-button>
      </div>
    </template>
  </base-page-template>
</template>

<script lang="ts">
import { Component, Mixins } from 'vue-property-decorator'
import firebase from 'firebase/app'
import cloneDeep from 'lodash/cloneDeep'
import goalsBasePage from '~/mixins/goalsBasePage'
import BasePageTemplate from '~/components/pages/basePageTemplate.vue'
import StepBar from '~/components/molecules/domains/goals/stepBar.vue'
import GoalsScheduleForm from '~/components/molecules/domains/scheduleForm.vue'
import { SCHEDULE_FORM_INIT_VALUE } from '~/constants/domainInits'
import { getSchedule, getForm } from '~/modules/domains/goals/goalForm'
import * as types from '~/types/domainTypes'
import { storeGoal } from '~/apis/goals'
import { uploadImage } from '~/modules/fileUpload'
import { isPassedStep1 } from '~/modules/domains/goal'
import { isValidate } from '~/modules/domains/scheduleForm'

@Component({
  components: { BasePageTemplate, StepBar, GoalsScheduleForm },
})
export default class GoalsCreateStep3 extends Mixins(goalsBasePage) {
  scheduleForm: types.ScheduleForm = SCHEDULE_FORM_INIT_VALUE
  goal: types.GoalDraft | null = null

  async mounted() {
    this.startPageMounted()
    await this.loginCheck()
    this.goal = cloneDeep(this.$store.state.pages.goals.create.goal)
    if (!this.goal || !isPassedStep1(this.goal)) {
      this.$router.push('/goals/create/step1')
      return
    }
    window.addEventListener('beforeunload', this.alertReload)
    this.scheduleForm = getForm(this.goal.scheduleOfRetrospective)
    this.endPageMounted()
  }

  destroyed() {
    window.removeEventListener('beforeunload', this.alertReload)
  }

  // 一時保存の場合はstoreがtrue,登録する場合はgoNextがtrue
  async store(store: boolean, goNext: boolean) {
    if (!this.goal) return
    if (!isValidate(this.scheduleForm)) {
      this.$buefy.toast.open('入力情報が足りません')
      return
    }
    this.goal.scheduleOfRetrospective = getSchedule(this.scheduleForm)
    if (store) {
      await this.execStore(false)
    } else if (goNext) {
      this.confirmToPublish(async () => {
        await this.execStore(true)
      })
    } else {
      this.$store.commit('pages/goals/create/setGoal', this.goal)
      this.$router.push('/goals/create/step2')
    }
  }

  async execStore(goNext) {
    if (!this.goal) return
    try {
      this.startPageMounted()
      const goalDraft: types.GoalDraft = await uploadImage(
        'goal',
        this.goal,
        this.$store.state.pages.goals.create.uploadFiles
      )
      // 公開する場合
      if (goNext)
        goalDraft.publishedAt = firebase.firestore.Timestamp.fromDate(
          new Date()
        )
      if (this.$store.state.pages.goals.create.unsetScheduleOfRecord) {
        this.goal.scheduleOfRecord = undefined
      }
      const registedGoal = await storeGoal(goalDraft)
      this.$store.dispatch('pages/goals/create/initialize')
      const message = goNext ? '目標を公開しました🎉🎉🎉' : '一時保存しました☺️'
      this.$buefy.toast.open(message)
      this.endPageMounted()
      this.$router.push({
        name: 'goals-id',
        params: { id: registedGoal.objectID },
      })
    } catch {
      this.failedUpdate()
    }
  }
}
</script>

<style lang="scss" scoped>
.footer-container {
  margin: 20px 0;
  text-align: center;
}
</style>
