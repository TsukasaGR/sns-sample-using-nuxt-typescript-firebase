<template>
  <base-page-template v-if="isShow">
    <template v-slot:header-left>
      <div class="back" @click="store(false)">
        <b-icon icon="chevron-left" />
      </div>
    </template>
    <template v-slot:header-center>
      <p>目標編集: Step3</p>
    </template>
    <template v-slot:header-right>
      <b-button type="is-success" @click="store(false, true)">
        {{ publishMessage }}
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
        <b-button @click="store(true)">
          {{ updateMessage }}
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
import { updateGoal } from '~/apis/goals'
import * as types from '~/types/domainTypes'
import { isPublished } from '~/modules/domains/goal'
import { isValidate } from '~/modules/domains/scheduleForm'

@Component({
  components: {
    BasePageTemplate,
    StepBar,
    GoalsScheduleForm,
  },
})
export default class GoalsEditSchedule extends Mixins(goalsBasePage) {
  scheduleForm: types.ScheduleForm = SCHEDULE_FORM_INIT_VALUE
  goal: types.Goal | null = null

  async mounted() {
    this.startPageMounted()
    await this.loginCheck()
    this.goal = cloneDeep(this.$store.state.pages.goals.edit.goal)
    // storeから取得した目標がnull、またはobjectIDが異なる場合はstep1に移動
    if (
      !this.goal ||
      (this.goal && this.goal.objectID !== this.$route.params.id)
    ) {
      this.$router.push(`/goals/${this.$route.params.id}/edit/step1`)
      return
    }
    this.scheduleForm = getForm(this.goal.scheduleOfRetrospective)
    window.addEventListener('beforeunload', this.alertReload)
    this.endPageMounted()
  }

  destroyed() {
    window.removeEventListener('beforeunload', this.alertReload)
  }

  async store(update: boolean, goNext = false) {
    if (!this.goal) return
    if (!isValidate(this.scheduleForm)) {
      this.$buefy.toast.open('入力情報が足りません')
      return
    }
    this.goal.scheduleOfRetrospective = getSchedule(this.scheduleForm)
    this.$store.commit('pages/goals/edit/setGoal', this.goal)
    this.startPageMounted()
    if (update || goNext) {
      // 更新or下書きの場合
      if (this.isPublished || update) {
        if (!this.isPublished) await this.execUpdate(true)
        else {
          const showConfirm = await this.isChangeSchedule(this.goal)
          if (!showConfirm) {
            await this.execUpdate(true)
          } else {
            this.confirmToChangeSchedule(async () => {
              await this.execUpdate(true)
            })
          }
        }
        // 公開する場合
      } else if (goNext) {
        this.confirmToPublish(async () => {
          if (!this.goal) return
          this.goal.publishedAt = firebase.firestore.Timestamp.fromDate(
            new Date()
          )
          await this.execUpdate(false)
        })
      }
    } else {
      this.$router.push({
        name: 'goals-id-edit-step2',
        params: { id: this.goal.objectID },
      })
    }
    this.endPageMounted()
  }

  async execUpdate(update: boolean) {
    if (!this.goal) return
    try {
      this.startPageMounted()
      await updateGoal(this.goal)
      this.$store.dispatch('pages/goals/edit/initialize')
      const message = update ? '更新しました☺️' : '目標を公開しました🎉🎉🎉'
      this.$buefy.toast.open(message)
      this.endPageMounted()
      this.$router.push({
        name: 'goals-id',
        params: { id: this.goal.objectID },
      })
    } catch {
      this.failedUpdate()
    }
  }

  get isPublished(): boolean {
    return this.goal !== null && isPublished(this.goal)
  }

  get updateMessage(): string {
    return this.isPublished ? '更新' : '下書き保存'
  }

  get publishMessage(): string {
    return this.isPublished ? '更新' : '公開'
  }
}
</script>

<style lang="scss" scoped>
.footer-container {
  margin: 20px 0;
  text-align: center;
}
</style>
