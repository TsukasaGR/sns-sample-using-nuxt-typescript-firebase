<template>
  <div class="user-name">
    {{ value }}
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'

@Component
export default class AtomsUserName extends Vue {
  @Prop(String) value!: string
}
</script>

<style lang="scss" scoped>
.user-name {
  display: inline-block;
  font-weight: 700;
  margin-right: 20px;
}
</style>
