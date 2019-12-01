<template>
  <div class="atoms-description">
    {{ description }}
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'

@Component
export default class AtomsDescription extends Vue {
  @Prop(String) description!: string
}
</script>

<style lang="scss" scoped>
.atoms-description {
  word-wrap: break-word;
}
</style>
