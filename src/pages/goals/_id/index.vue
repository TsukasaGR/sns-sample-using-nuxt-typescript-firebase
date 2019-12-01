<template>
  <base-page-template v-if="isShow">
    <template v-slot:header-left>
      <div class="back" @click="$router.go(-1)">
        <b-icon icon="chevron-left" />
      </div>
    </template>
    <template v-slot:header-center>
      <p>目標詳細</p>
    </template>
    <template v-slot:header-right />
    <template v-slot:content>
      <div class="pages-goals-id">
        <div class="info-container">
          <div class="circle">
            <img :src="icon" />
          </div>
          <div class="goals-container">
            <div class="goals-container-item">
              <b-taglist attached>
                <b-tag type="is-dark">
                  {{ goal.goalType }}
                </b-tag>
                <b-tag :type="labelClass">
                  {{ displayStatusFromGoal }}
                </b-tag>
              </b-taglist>
            </div>
            <div class="goals-container-item goal-title">
              {{ goal.title }}
            </div>
            <div v-if="goal.tags" class="goals-container-item">
              <b-taglist>
                <b-tag v-for="(tag, index) in goal.tags" :key="index">
                  {{ tag }}
                </b-tag>
              </b-taglist>
            </div>
            <div class="goals-container-item">
              <b-icon icon="flag" size="is-small" />
              完了日:
              {{ displayEndAt }}
            </div>
            <div v-if="isPublished" class="goals-container-item">
              <b-icon icon="clock-outline" size="is-small" />
              スケジュール:
              <ul class="schedule-list">
                <li>
                  <b-icon icon="pen" size="is-small" />
                  {{ displayScheduleOfRecord }}
                </li>
                <li>
                  <b-icon icon="reply" size="is-small" />
                  {{ displayScheduleOfRetrospective }}
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div v-if="isOwn" class="edit-container">
          <nuxt-link
            v-if="!isArchived"
            tag="div"
            class="edit-button"
            :to="{ name: 'goals-id-edit-step1', params: { id: goalId } }"
          >
            目標を編集する
          </nuxt-link>
          <div v-if="!isArchived" class="edit-button" @click="archiveConfirm">
            アーカイブする
          </div>
        </div>
        <TabList
          :goal="goal"
          :records="records"
          :retrospectives="retrospectives"
        />
      </div>
    </template>
  </base-page-template>
</template>

<script lang="ts">
import { Component, Mixins } from 'vue-property-decorator'
import BasePage from '~/mixins/basePage'
import BasePageTemplate from '~/components/pages/basePageTemplate.vue'
import firebase from '~/plugins/firebase'
import * as types from '~/types/domainTypes'
import { AuthState } from '~/store/auth'
import { goal } from '~/modules/firebase/firestore/goals'
import { recordsOfGoal } from '~/modules/firebase/firestore/records'
import { retrospectivesOfGoal } from '~/modules/firebase/firestore/retrospectives'
import { displayDatetimeByMMDD } from '~/modules/dayjs'
import {
  displayStatusFromGoal,
  isArchived,
  isPublished,
  displaySchedule,
} from '~/modules/domains/goal'
import TabList from '~/components/molecules/domains/recordsAndRetrospectives/tabList.vue'
import { updateGoal } from '~/apis/goals'

@Component({
  components: {
    BasePageTemplate,
    TabList,
  },
})
export default class PagesGoals extends Mixins(BasePage) {
  goalId: string = ''
  goal: types.Goal | null = null
  records: types.Record[] = []
  retrospectives: types.Retrospective[] = []

  // TODO: 現状goalがない場合は描画されないためエラーも表示されない
  async mounted(): Promise<void> {
    await this.loginCheck()
    await this.initialize()
  }

  async initialize(): Promise<void> {
    this.reset()
    this.startPageMounted()
    this.goalId = this.$route.params.id
    this.goal = await goal(this.goalId)
    this.records = await recordsOfGoal(this.goalId, 'desc')
    this.retrospectives = await retrospectivesOfGoal(this.goalId, 'desc')
    this.endPageMounted()
  }

  reset(): void {
    this.goalId = ''
    this.goal = null
    this.records = []
    this.retrospectives = []
  }

  get auth(): AuthState {
    return this.$store.state.auth
  }

  get isOwn(): boolean {
    return this.goal !== null && this.auth.uid === this.goal.userId
  }

  get displayEndAt(): string {
    if (!this.goal) return ''
    return displayDatetimeByMMDD(this.goal.endAt)
  }

  // TODO: 【未設定の項目があります】を表示する基準を決めておく
  // 現状はperiodSpanが0の場合に未設定
  get unsetSchedule(): boolean {
    if (!this.goal) return false
    return (
      !this.goal.scheduleOfRecord ||
      !this.goal.scheduleOfRecord.hasOwnProperty('periodSpan') ||
      this.goal.scheduleOfRecord.periodSpan === 0
    )
  }

  get labelClass(): string {
    return this.isArchived ? '' : this.isPublished ? 'is-success' : ''
  }

  get isArchived(): boolean {
    return this.goal !== null && isArchived(this.goal)
  }

  get isPublished(): boolean {
    return this.goal !== null && isPublished(this.goal)
  }

  get recordExists(): boolean {
    if (!this.goal) return false
    return this.records.length !== 0
  }

  get retrospectivesExists(): boolean {
    if (!this.goal) return false
    return this.retrospectives.length !== 0
  }

  get displayStatusFromGoal() {
    return displayStatusFromGoal(this.goal as types.Goal)
  }

  get icon() {
    return this.goal && this.goal.icon
      ? this.goal.icon
      : 'https://firebasestorage.googleapis.com/v0/b/project-ego-staging-f9aae.appspot.com/o/no_image.png?alt=media&token=1316c5a2-b076-4bb9-9d3c-9c2cdd3b7faa'
  }

  get displayScheduleOfRecord(): string {
    return this.goal !== null ? displaySchedule(this.goal, 'record') : ''
  }

  get displayScheduleOfRetrospective(): string {
    return this.goal !== null ? displaySchedule(this.goal, 'retrospective') : ''
  }

  archiveConfirm() {
    this.$buefy.dialog.confirm({
      title: '目標のアーカイブ',
      message: 'アーカイブ以降は記録、振り返りが出来ません。よろしいですか？',
      cancelText: 'キャンセル',
      confirmText: 'アーカイブ',
      type: 'is-danger',
      onConfirm: () => this.archiveGoal(),
    })
  }

  async archiveGoal() {
    try {
      this.startPageMounted()
      this.goal = this.goal as types.Goal
      this.goal.archivedAt = firebase.firestore.Timestamp.fromDate(new Date())
      await updateGoal(this.goal)
      this.endPageMounted()
      this.initialize()
      this.$buefy.toast.open('目標をアーカイブしました🙏')
    } catch {
      this.failedUpdate()
    }
  }
}
</script>

<style lang="scss" scoped>
.pages-goals-id {
  font-size: 0.8rem;

  .info-container {
    display: flex;
    justify-content: flex-start;
    padding: 1rem 1.5rem;

    .circle {
      width: 4rem;
      height: 4rem;
      margin: auto;

      img {
        width: 100%;
        height: 100%;
        border-radius: 50%;
        background: $border-color;
        object-fit: contain;
      }
    }

    .goals-container {
      width: 80%;
      padding-left: 2rem;
      word-break: break-all;

      .goals-container-item {
        &:not(:last-child) {
          margin-bottom: 8px;
        }
      }

      .goal-title {
        font-size: 1rem;
        font-weight: 700;
      }

      .schedule-list {
        padding-left: 16px;
      }
    }
  }

  .edit-container {
    display: flex;
    justify-content: space-around;
    padding: 1rem 0.5rem;

    .edit-button {
      width: 40%;
      border: solid 1px $border-color;
      border-radius: 5px;
      text-align: center;
      padding: 0.5rem;
      cursor: pointer;
    }
  }

  .b-tabs {
    text-align: center;

    .text {
      font-size: 1rem;
      padding: 1rem;
    }
  }
}
</style>
