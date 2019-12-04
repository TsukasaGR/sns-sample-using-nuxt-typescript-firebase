<template>
  <div v-if="isShow" class="card">
    <div class="card-content">
      <div class="media">
        <figure class="media-left">
          <p class="image is-64x64">
            <img :src="icon" />
          </p>
        </figure>
        <div class="media-content">
          <div class="content">
            <p>
              <strong>{{ user.displayName }}</strong>
              <small>@{{ user.accountName }}</small>
              <small>{{ displayTimestamp }}</small>
              <br />
              {{ comment.body }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'
import { Comment, User } from '~/types/domainTypes'
import { displayTimestamp } from '~/modules/dayjs'
import { icon } from '~/modules/domains/users'
import { user as getUser } from '~/modules/firebase/firestore/users'

@Component
export default class PresentationsTimelineItem extends Vue {
  @Prop({ type: Object, required: true }) comment!: Comment

  user: User | undefined = undefined
  noImage: string = require('~/assets/images/no_image.png')
  isShow = false

  async mounted(): Promise<void> {
    this.user = this.comment.user || (await getUser(this.comment.createdUser))
    this.isShow = true
  }

  get displayTimestamp(): string {
    return displayTimestamp(this.comment.createdAt)
  }

  get icon(): string {
    return icon(this.user)
  }
}
</script>

<style lang="scss" scoped>
.image {
  img {
    width: 4rem;
    height: 4rem;
    object-fit: cover;
  }
}
</style>
