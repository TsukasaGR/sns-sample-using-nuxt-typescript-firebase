<template>
  <div class="action-container" @click="emit()">
    <b-icon :icon="icon" />
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'

@Component
export default class PresentationsActionButton extends Vue {
  @Prop({ type: String, required: false, default: 'comment' }) icon!: string

  emit(): void {
    this.$emit('button-click')
  }
}
</script>

<style lang="scss">
.action-container {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background-color: $primary-light-color;
  text-align: center;
  line-height: 60px;
  color: $background-primary-color;
  cursor: pointer;
}
</style>
