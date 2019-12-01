<template>
  <base-page-template v-if="isShow">
    <template v-slot:header-left>
      <div class="back" @click="$router.go(-1)">
        <b-icon icon="chevron-left" />
      </div>
    </template>
    <template v-slot:header-center>
      <p>目標登録: Step1</p>
    </template>
    <template v-slot:header-right>
      <b-button type="is-success" @click="store(false, true)">
        次へ
      </b-button>
    </template>
    <template v-slot:content>
      <StepBar :step="1" />
      <div class="bg-dark">
        <GoalsBaseForm :goal="goal" :upload-files.sync="uploadFiles" />
        <div class="footer-container">
          <b-button type="is-light" @click="store(true, false)">
            下書き保存
          </b-button>
        </div>
      </div>
    </template>
  </base-page-template>
</template>

<script lang="ts">
import { Component, Mixins } from 'vue-property-decorator'
import cloneDeep from 'lodash/cloneDeep'
import goalsBasePage from '~/mixins/goalsBasePage'
import BasePageTemplate from '~/components/pages/basePageTemplate.vue'
import * as types from '~/types/domainTypes'
import StepBar from '~/components/molecules/domains/goals/stepBar.vue'
import GoalsBaseForm from '~/components/organisms/containerComponents/goals/baseForm.vue'
import { GOAL_INIT_VALUE } from '~/constants/domainInits'
import { storeGoal } from '~/apis/goals'
import { AuthState } from '~/store/auth'
import { timestampOfCurrentTime } from '~/modules/dayjs'
import { uploadImage } from '~/modules/fileUpload'
import { isPassedStep1 } from '~/modules/domains/goal'

@Component({
  components: {
    BasePageTemplate,
    StepBar,
    GoalsBaseForm,
  },
})
export default class GoalsCreateStep1 extends Mixins(goalsBasePage) {
  goal: types.GoalDraftStep1 = GOAL_INIT_VALUE as types.GoalDraftStep1
  uploadFiles: File[] = []

  async mounted() {
    this.startPageMounted()
    await this.loginCheck()
    window.addEventListener('beforeunload', this.alertReload)
    this.goal = cloneDeep(this.$store.state.pages.goals.create.goal)
    this.goal.userId = this.auth.uid
    this.goal.createdAt = timestampOfCurrentTime()
    this.uploadFiles = cloneDeep(
      this.$store.state.pages.goals.create.uploadFiles
    )
    this.endPageMounted()
  }

  destroyed() {
    window.removeEventListener('beforeunload', this.alertReload)
  }

  get auth(): AuthState {
    return this.$store.state.auth
  }

  async store(store: boolean, goNext: boolean) {
    if (!isPassedStep1(this.goal)) {
      this.$buefy.toast.open('入力情報が足りません')
      return
    }
    if (store) {
      await this.execStore()
    } else if (goNext) {
      this.$store.commit(
        'pages/goals/create/setGoal',
        this.goal as types.GoalDraft
      )
      this.$store.commit('pages/goals/create/setUploadFiles', this.uploadFiles)
      this.$router.push('/goals/create/step2')
    }
  }

  async execStore() {
    try {
      this.startPageMounted()
      let goalDraft: types.GoalDraft = this.goal as types.GoalDraft
      goalDraft = await uploadImage('goal', goalDraft, this.uploadFiles)
      if (this.$store.state.pages.goals.create.unsetScheduleOfRecord) {
        goalDraft.scheduleOfRecord = undefined
      }
      const registedGoal = await storeGoal(goalDraft)
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
.bg-dark {
  background-color: $background-primary-color;
}

.footer-container {
  margin: 20px 0;
  text-align: center;
}
</style>
