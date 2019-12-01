<template>
  <base-page-template v-if="isShow">
    <template v-slot:header-left>
      <div class="back" @click="$router.go(-1)">
        <b-icon icon="chevron-left" />
      </div>
    </template>
    <template v-slot:header-center>
      <p>記録詳細</p>
    </template>
    <template v-slot:header-right />
    <template v-slot:content>
      <div v-if="record">
        <div v-if="isOwn" class="delete-button-container">
          <b-button type="is-danger" icon-left="close" @click="ConfirmToDelete">
            削除
          </b-button>
        </div>
        <b-field label="コメント">
          <!-- eslint-disable-next-line vue/no-v-html -->
          <div class="text-area" v-html="comment" />
        </b-field>
        <div v-if="record.image" class="image-container">
          <img :src="record.image" @click="isImageModalActive = true" />
        </div>
        <b-modal :active.sync="isImageModalActive">
          <p class="modal-image" @click="isImageModalActive = false">
            <img :src="record.image" />
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
import { deleteRecord } from '~/apis/records'
import { textAutoLink } from '~/modules/textOperation'

@Component({
  components: {
    BasePageTemplate,
  },
})
export default class PagesRecordsId extends Mixins(BasePage) {
  db = firebase.firestore()
  recordId = ''
  record: types.Record | null = null
  isImageModalActive: boolean = false

  get auth(): AuthState {
    return this.$store.state.auth
  }
  get isOwn(): boolean {
    return this.record !== null && this.auth.uid === this.record.userId
  }
  // TODO: 現状recordがない場合は描画されないためエラーも表示されない
  async mounted() {
    this.startPageMounted()
    await this.loginCheck()
    this.recordId = this.$route.params.id
    const doc = await this.db
      .collection('records')
      .doc(this.recordId)
      .get()
    this.record = doc.data() as types.Record
    this.endPageMounted()
  }
  ConfirmToDelete() {
    this.$buefy.dialog.confirm({
      title: '記録の削除',
      message: '元に戻せません。削除しますか?',
      cancelText: 'キャンセル',
      confirmText: '削除',
      type: 'is-danger',
      onConfirm: () => this.deleteRecord(),
    })
  }
  async deleteRecord() {
    try {
      this.startPageMounted()
      await deleteRecord(this.recordId)
      this.endPageMounted()
      this.$router.push(`/goals/${(this.record as types.Record).goalId}`)
      this.$buefy.toast.open('記録を削除しました😈')
    } catch {
      this.failedUpdate()
    }
  }
  get comment(): string {
    return this.record && this.record.comment
      ? textAutoLink(this.record.comment)
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
