<template>
  <base-page-template v-if="isShow">
    <template v-slot:header-left>
      <div class="back" @click="$router.go(-1)">
        <b-icon icon="chevron-left" />
      </div>
    </template>
    <template v-slot:header-center>
      <p>振り返り詳細</p>
    </template>
    <template v-slot:header-right />
    <template v-slot:content>
      <div v-if="retrospective">
        <div v-if="isOwn" class="delete-button-container">
          <b-button type="is-danger" icon-left="close" @click="ConfirmToDelete">
            削除
          </b-button>
        </div>
        <b-field label="達成率">
          <div class="text-area">
            <span>{{ retrospective.achieveRate }}</span>
            <span>%</span>
          </div>
        </b-field>
        <b-field label="コメント">
          <!-- eslint-disable-next-line vue/no-v-html -->
          <div class="text-area" v-html="comment" />
        </b-field>
        <div v-if="retrospective.image" class="image-container">
          <img :src="retrospective.image" @click="isImageModalActive = true" />
        </div>
        <b-modal :active.sync="isImageModalActive">
          <p class="modal-image" @click="isImageModalActive = false">
            <img :src="retrospective.image" />
          </p>
        </b-modal>
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
import { deleteRetrospective } from '~/apis/retrospectives'
import { textAutoLink } from '~/modules/textOperation'

@Component({
  components: {
    BasePageTemplate,
  },
})
export default class PagesRetrospectivesId extends Mixins(BasePage) {
  db = firebase.firestore()
  retrospectiveId = ''
  retrospective: types.Retrospective | null = null
  isImageModalActive: boolean = false

  get auth(): AuthState {
    return this.$store.state.auth
  }
  get isOwn(): boolean {
    return (
      this.retrospective !== null && this.auth.uid === this.retrospective.userId
    )
  }
  // TODO: 現状retrospectiveがない場合は描画されないためエラーも表示されない
  async mounted() {
    this.startPageMounted()
    await this.loginCheck()
    this.retrospectiveId = this.$route.params.id
    const doc = await this.db
      .collection('retrospectives')
      .doc(this.retrospectiveId)
      .get()
    this.retrospective = doc.data() as types.Retrospective
    this.endPageMounted()
  }
  ConfirmToDelete() {
    this.$buefy.dialog.confirm({
      title: '振り返りの削除',
      message: '元に戻せません。削除しますか?',
      cancelText: 'キャンセル',
      confirmText: '削除',
      type: 'is-danger',
      onConfirm: () => this.deleteRetrospective(),
    })
  }
  async deleteRetrospective() {
    try {
      this.startPageMounted()
      await deleteRetrospective(this.retrospectiveId)
      this.endPageMounted()
      this.$router.push(
        `/goals/${(this.retrospective as types.Retrospective).goalId}`
      )
      this.$buefy.toast.open('振り返りを削除しました😈')
    } catch {
      this.failedUpdate()
    }
  }
  get comment(): string {
    return this.retrospective && this.retrospective.comment
      ? textAutoLink(this.retrospective.comment)
      : ''
  }
}
</script>

<style lang="scss" scoped>
.delete-button-container {
  display: flex;
  justify-content: flex-end;
  width: 90%;
  margin: auto;
}

.text-area {
  width: 95%;
  padding: 0.8rem;
  margin: auto;
  border-radius: 0.5rem;
  background-color: $background-primary-color;

  input {
    font-size: 0.9rem;
  }

  input:focus {
    outline: none;
  }
}

.image-container {
  img {
    width: 50%;
    height: auto;
    border-radius: 8px;
  }
}
.modal-image {
  text-align: center;
  img {
    height: 70vh;
    max-width: 80%;
  }
}
</style>
