<template>
  <div class="layouts-navigation-icon">
    <b-icon pack="fas" :icon="icon" />
    <p class="str">
      {{ message }}
    </p>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'

@Component
export default class LayoutsNavigationIcon extends Vue {
  @Prop({ type: String, required: true }) icon!: string
  @Prop({ type: String, required: false }) message!: string
}
</script>

<style lang="scss" scoped>
.layouts-navigation-icon {
  cursor: pointer;
  width: 100%;
  text-align: center;

  .str {
    font-size: 0.8rem;
  }
}
</style>
