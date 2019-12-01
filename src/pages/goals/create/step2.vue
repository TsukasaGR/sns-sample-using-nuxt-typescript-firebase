<template>
  <base-page-template v-if="isShow">
    <template v-slot:header-left>
      <div class="back" @click="store(false, false)">
        <b-icon icon="chevron-left" />
      </div>
    </template>
    <template v-slot:header-center>
      <p>目標登録: Step2</p>
    </template>
    <template v-slot:header-right>
      <b-button type="is-success" @click="store(false, true)">
        次へ
      </b-button>
    </template>
    <template v-slot:content>
      <StepBar :step="2" />
      <div v-if="goal">
        <b-field>
          <template slot="label">
            <div class="label-container">
              <span class="label-item label-title">記録タイミング</span>
              <span class="label-item label-switch">
                <span>設定しない</span>
                <b-switch v-model="unsetSchedule" type="is-success" />
              </span>
            </div>
          </template>
          <div class="schedule-container">
            <div v-if="unsetSchedule">
              記録スケジュールされません
            </div>
            <div v-else>
              <GoalsScheduleForm :schedule-form="scheduleForm" />
            </div>
          </div>
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
import { Component, Mixins, Watch } from 'vue-property-decorator'
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
export default class GoalsCreateStep2 extends Mixins(goalsBasePage) {
  scheduleForm: types.ScheduleForm = SCHEDULE_FORM_INIT_VALUE
  goal: types.GoalDraft | null = null
  unsetSchedule: boolean = false

  async mounted() {
    this.startPageMounted()
    await this.loginCheck()
    this.goal = cloneDeep(this.$store.state.pages.goals.create.goal)
    if (!this.goal || !isPassedStep1(this.goal)) {
      this.$router.push('/goals/create/step1')
      return
    }
    window.addEventListener('beforeunload', this.alertReload)
    this.scheduleForm = getForm(this.goal.scheduleOfRecord)
    this.unsetSchedule = this.$store.state.pages.goals.create.unsetScheduleOfRecord
    this.endPageMounted()
  }

  destroyed() {
    window.removeEventListener('beforeunload', this.alertReload)
  }

  @Watch('unsetSchedule')
  changeUnsetSchedule(newval: boolean): void {
    this.$store.commit('pages/goals/create/setUnsetScheduleOfRecord', newval)
  }

  async store(store: boolean, goNext: boolean) {
    if (!this.goal) return
    if (!isValidate(this.scheduleForm)) {
      this.$buefy.toast.open('入力情報が足りません')
      return
    }
    this.goal.scheduleOfRecord = getSchedule(this.scheduleForm)
    if (store) {
      await this.execStore()
    } else {
      this.$store.commit('pages/goals/create/setGoal', this.goal)
      const routeName = goNext ? '/goals/create/step3' : '/goals/create/step1'
      this.endPageMounted()
      this.$router.push(routeName)
    }
  }
  async execStore() {
    if (!this.goal) return
    try {
      this.startPageMounted()
      const goal: types.GoalDraft = await uploadImage(
        'goal',
        this.goal,
        this.$store.state.pages.goals.create.uploadFiles
      )
      if (this.$store.state.pages.goals.create.unsetScheduleOfRecord) {
        this.goal.scheduleOfRecord = undefined
      }
      const registedGoal = await storeGoal(goal)
      this.$store.dispatch('pages/goals/create/initialize')
      this.$buefy.toast.open('一時保存しました☺️')
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
.label-container {
  display: flex;
  justify-content: space-around;

  .label-item {
    display: inline-block;
    width: 100%;
  }

  .label-title {
    text-align: left;
  }

  .label-switch {
    font-weight: normal;
    font-size: 0.8rem;
    text-align: right;
    display: flex;
    justify-content: flex-end;
    align-items: center;

    span {
      display: inline-block;

      &:not(:last-child) {
        padding-right: 4px;
      }
    }
  }
}

.schedule-container {
  margin-top: 20px;
}

.footer-container {
  margin: 20px 0;
  text-align: center;
}
</style>
