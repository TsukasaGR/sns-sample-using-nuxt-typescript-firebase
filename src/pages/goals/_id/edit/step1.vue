<template>
  <base-page-template v-if="isShow">
    <template v-slot:header-left>
      <div class="back" @click="$router.go(-1)">
        <b-icon icon="chevron-left" />
      </div>
    </template>
    <template v-slot:header-center>
      <p>目標編集: Step1</p>
    </template>
    <template v-slot:header-right>
      <b-button type="is-success" @click="store(false, true)">
        次へ
      </b-button>
    </template>
    <template v-slot:content>
      <div>
        <GoalsBaseForm :goal="goal" :upload-files.sync="uploadFiles" />
        <div class="footer-container">
          <b-button @click="store(true)">
            {{ updateMessage }}
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
import GoalsBaseForm from '~/components/organisms/containerComponents/goals/baseForm.vue'
import { updateGoal } from '~/apis/goals'
import { goal } from '~/modules/firebase/firestore/goals'
import { uploadImage } from '~/modules/fileUpload'
import { isPublished } from '~/modules/domains/goal'

@Component({
  components: {
    BasePageTemplate,
    GoalsBaseForm,
  },
})
export default class GoalsEditStep1 extends Mixins(goalsBasePage) {
  goal: types.Goal | null = null
  uploadFiles: File[] = []

  async mounted() {
    this.startPageMounted()
    await this.loginCheck()
    this.goal = cloneDeep(this.$store.state.pages.goals.edit.goal)
    // storeから取得した目標がnull、またはobjectIDが異なる場合はDBから再取得
    if (
      !this.goal ||
      (this.goal && this.goal.objectID !== this.$route.params.id)
    )
      this.goal = await goal(this.$route.params.id)
    window.addEventListener('beforeunload', this.alertReload)
    this.endPageMounted()
  }

  destroyed() {
    window.removeEventListener('beforeunload', this.alertReload)
  }

  async store(update: boolean, goNext = false) {
    if (!this.goal) return
    if (this.goal.title === '' || this.goal.goalType === null) {
      this.$buefy.toast.open('入力情報が足りません')
      return
    }
    await this.execUpdate(update)
    // 次へ
    if (goNext) {
      this.$router.push({
        name: 'goals-id-edit-step2',
        params: { id: this.goal.objectID },
      })
    }
  }

  async execUpdate(update: boolean) {
    if (!this.goal) return
    try {
      this.startPageMounted()
      if (this.uploadFiles.length !== 0)
        this.goal = await uploadImage('goal', this.goal, this.uploadFiles)
      this.$store.commit('pages/goals/edit/setGoal', this.goal)
      // 更新する
      if (update) {
        const showConfirm = await this.isChangeSchedule(this.goal)
        if (!showConfirm) {
          await this.updateDetail()
        } else {
          this.confirmToChangeSchedule(async () => {
            await this.updateDetail()
          })
        }
      }
      this.endPageMounted()
    } catch {
      this.failedUpdate()
    }
  }

  async updateDetail(): Promise<void> {
    this.startPageMounted()
    const goal = this.goal as types.Goal
    await updateGoal(goal)
    this.$store.dispatch('pages/goals/edit/initialize')
    this.$buefy.toast.open('更新しました☺️')
    this.$router.push({
      name: 'goals-id',
      params: { id: goal.objectID },
    })
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
.footer-container {
  margin: 20px 0;
  text-align: center;
}
</style>
