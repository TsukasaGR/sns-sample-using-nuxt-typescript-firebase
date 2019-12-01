<template>
  <nuxt-link v-if="user" tag="div" :to="url">
    <div class="todo-list">
      <div class="todo-date">
        {{ displayScheduleAt }}
      </div>
      <div class="todo-content">
        <div class="icon-content">
          <div class="circle">
            <img :src="icon" />
          </div>
        </div>

        <div class="goal-content">
          <p v-if="goal" class="goal">
            <span class="mgr">
              {{ goal.title }}
            </span>
          </p>
          <div>
            <p v-if="isRecord">
              の記録タイミングです
            </p>
            <p v-else-if="isRetrospective">
              の振り返りタイミングです
            </p>
          </div>
        </div>
      </div>
    </div>
  </nuxt-link>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'
import * as types from '~/types/domainTypes'
import { goal } from '~/modules/firebase/firestore/goals'
import { user } from '~/modules/firebase/firestore/users'
import { displayDatetimeFromFirestoreTimestamp } from '~/modules/dayjs'

@Component({})
export default class TimelineRecordItem extends Vue {
  @Prop({ type: Object, required: false }) scheduleDate!: types.ScheduleDate
  goal: types.Goal | null = null
  user: types.User | null = null

  async mounted() {
    await this.getGoal()
    await this.getUser()
  }
  async getGoal() {
    if (!this.scheduleDate.goalId) return false
    this.goal = await goal(this.scheduleDate.goalId)
  }
  async getUser() {
    if (this.goal) this.user = await user(this.goal.userId)
  }

  get url(): string {
    const domain =
      this.scheduleDate.scheduleType === 'record' ? 'records' : 'retrospectives'
    return `/${domain}/create/goal/${this.scheduleDate.goalId}?id=${this.scheduleDate.objectID}`
  }

  get displayScheduleAt() {
    return displayDatetimeFromFirestoreTimestamp(this.scheduleDate.scheduleAt)
  }

  get icon() {
    return this.goal && this.goal.icon
      ? this.goal.icon
      : 'https://firebasestorage.googleapis.com/v0/b/project-ego-staging-f9aae.appspot.com/o/no_image.png?alt=media&token=1316c5a2-b076-4bb9-9d3c-9c2cdd3b7faa'
  }

  get isRecord(): boolean {
    return this.scheduleDate.scheduleType === 'record'
  }

  get isRetrospective(): boolean {
    return this.scheduleDate.scheduleType === 'retrospective'
  }
}
</script>

<style lang="scss" scoped>
.todo-list {
  padding: 1rem;

  .todo-date {
    display: flex;
    align-items: center;
    padding-bottom: 1rem;
    color: $border-color;

    &:after {
      border-top: 1px solid;
      content: '';
      flex-grow: 1;
    }

    &:after {
      margin-left: 0.5rem;
    }
  }

  .icon-content {
    font-size: 0.5rem;
    text-align: center;
    padding-right: 0.5rem;
    width: 15%;

    .circle {
      width: 2.5rem;
      height: 2.5rem;
      margin: auto;

      img {
        width: 100%;
        height: 100%;
        border-radius: 50%;
        background: $border-color;
        object-fit: cover;
      }
    }
  }

  .todo-content {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    font-size: 0.9rem;

    .goal-content {
      display: flex;
      justify-content: center;
      align-items: center;

      .goal {
        font-weight: bold;
      }

      .mgr {
        margin-right: 0.3rem;
      }
    }
  }
}
</style>
