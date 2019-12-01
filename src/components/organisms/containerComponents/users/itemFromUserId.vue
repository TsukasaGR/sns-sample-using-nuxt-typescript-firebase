<template>
  <ListProfile v-if="user && isShow" :user="user" />
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import * as types from '~/types/domainTypes'
import { user } from '~/modules/firebase/firestore/users'
import ListProfile from '~/components/molecules/domains/users/listProfile.vue'

@Component({
  components: { ListProfile },
})
export default class OrganismsContainerComponentsEgosItemFromEgoId extends Vue {
  @Prop({ type: String, required: true }) userId!: string

  user: types.User | null = null
  isShow: boolean = false

  async mounted(): Promise<void> {
    this.user = await user(this.userId)
    this.isShow = true
  }
}
</script>
