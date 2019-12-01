<template>
  <div class="card">
    <div class="card-content">
      <div class="media">
        <div class="media-left">
          <figure class="image is-48x48">
            <img :src="imageUrl(content)" alt="image" />
          </figure>
        </div>
        <div class="media-content">
          <p class="subtitle is-6">
            {{ content.displayName }}
          </p>
          <b-field label="公開中の目標">
            <template v-if="!content.goals || content.goals.length === 0">
              <p>公開中の目標はありません</p>
            </template>
            <template v-else>
              <div>
                <div
                  v-for="(goal, index2) in content.goals"
                  :key="index2"
                  class="card"
                >
                  <div class="card-content">
                    <div class="content">
                      {{ goal.title }}
                    </div>
                    <div class="content">
                      <span>期限:</span>
                      <span>
                        {{ displayDatetimeByMMDD(goal.endAt) }}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </template>
          </b-field>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'
import * as types from '~/types/domainTypes'
import { displayDatetimeByMMDD } from '~/modules/dayjs'

@Component
export default class TeamsMemberItem extends Vue {
  @Prop({ type: Object, required: false, default: [] })
  content!: types.UserWithGoals

  imageUrl(user: types.User): string {
    return user && 'icon' in user && user.icon
      ? user.icon
      : 'https://firebasestorage.googleapis.com/v0/b/woven-mapper-232901.appspot.com/o/image%2Fuser-icon1.png?alt=media&token=20949804-68fe-4892-9a81-3c02295bb4f3'
  }

  displayDatetimeByMMDD(timestamp: firebase.firestore.Timestamp): string {
    return displayDatetimeByMMDD(timestamp)
  }
}
</script>

<style lang="scss" scoped></style>
