<template>
  <base-page-template v-if="isShow">
    <template v-slot:header-left>
      <div class="back" @click="store(false, false)">
        <b-icon icon="chevron-left" />
      </div>
    </template>
    <template v-slot:header-center>
      <p>目標編集: Step2</p>
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
        <b-button @click="store(true)">
          {{ updateMessage }}
        </b-button>
      </div>
    </template>
  </base-page-template>
</template>

<script lang="ts">
import { Component, Watch, Mixins } from 'vue-property-decorator'
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
  components: { BasePageTemplate, StepBar, GoalsScheduleForm },
})
export default class GoalsEditSchedule extends Mixins(goalsBasePage) {
  scheduleForm: types.ScheduleForm = cloneDeep(SCHEDULE_FORM_INIT_VALUE)
  goal: types.Goal | null = null
  unsetSchedule: boolean = false

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
    if (this.goal.scheduleOfRecord === undefined) this.unsetSchedule = true
    this.scheduleForm = getForm(this.goal.scheduleOfRecord)
    window.addEventListener('beforeunload', this.alertReload)
    this.endPageMounted()
  }

  destroyed() {
    window.removeEventListener('beforeunload', this.alertReload)
  }

  @Watch('unsetSchedule')
  changeUnsetSchedule(newval: boolean): void {
    this.$store.commit('pages/goals/edit/setUnsetScheduleOfRecord', newval)
  }

  async store(update: boolean, goNext = false) {
    if (!this.goal) return
    if (!isValidate(this.scheduleForm)) {
      this.$buefy.toast.open('入力情報が足りません')
      return
    }
    this.startPageMounted()
    this.goal.scheduleOfRecord = this.unsetSchedule
      ? undefined
      : getSchedule(this.scheduleForm)
    this.$store.commit('pages/goals/edit/setGoal', this.goal)
    if (update) {
      const showConfirm = await this.isChangeSchedule(this.goal)
      if (!showConfirm) {
        await this.execUpdate()
      } else {
        this.confirmToChangeSchedule(async () => {
          await this.execUpdate()
        })
      }
    } else {
      const routePath = goNext ? 'goals-id-edit-step3' : 'goals-id-edit-step1'
      this.$router.push({ name: routePath, params: { id: this.goal.objectID } })
    }
    this.endPageMounted()
  }

  async execUpdate() {
    if (!this.goal) return
    this.startPageMounted()
    try {
      await updateGoal(this.goal)
      this.$store.dispatch('pages/goals/edit/initialize')
      this.$buefy.toast.open('更新しました☺️')
      this.endPageMounted()
      this.$router.push({
        name: 'goals-id',
        params: { id: this.goal.objectID },
      })
    } catch {
      this.failedUpdate()
    }
    this.endPageMounted()
  }

  get isPublished(): boolean {
    return this.goal !== null && isPublished(this.goal)
  }

  get updateMessage(): string {
    return this.isPublished ? '更新' : '下書き保存'
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
