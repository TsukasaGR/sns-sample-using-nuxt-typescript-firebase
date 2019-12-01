<template>
  <client-only>
    <div class="iconcontainer">
      <figure :class="`image is-${size}x${size}`">
        <nuxt-link v-if="url" :to="url">
          <!-- <img class="is-rounded" :src="src" alt="No Image"> -->
          <div class="usericon">
            <img class="usericon" :src="getSrc()" alt />
          </div>
        </nuxt-link>
        <!-- <img class="is-rounded" :src="src" alt="No Image" v-else> -->
        <img v-else class="usericon" :src="getSrc()" alt />
      </figure>
    </div>
  </client-only>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'

@Component
export default class AtomsUserIcon extends Vue {
  @Prop(String) src!: string
  @Prop(String) size!: string
  @Prop(String) url!: string

  getSrc() {
    return this.src
      ? this.src
      : 'https://firebasestorage.googleapis.com/v0/b/woven-mapper-232901.appspot.com/o/image%2Fuser-icon1.png?alt=media&token=20949804-68fe-4892-9a81-3c02295bb4f3'
  }
}
</script>

<style lang="scss" scoped>
.iconcontainer {
  display: flex;
  justify-content: center;
  padding-top: 3rem;
  padding-bottom: 2rem;
}
</style>
