<template>
  <base-page-template v-if="isShow">
    <template v-slot:header-left>
      <div class="back" @click="$router.go(-1)">
        <b-icon icon="chevron-left" />
      </div>
    </template>
    <template v-slot:header-center>
      <p>プロフィール編集</p>
    </template>
    <template v-slot:header-right>
      <b-button @click="save">
        Update
      </b-button>
    </template>
    <template v-slot:content>
      <section>
        <div class="icon-container">
          <img class="icon" :src="icon" @click="selectFile" />
        </div>
        <div class="change-icon">
          <a @click="selectFile">画像を変更する</a>
        </div>
        <div class="editcontainer">
          <b-field label="ユーザー名">
            <b-input
              v-model="user.accountName"
              :maxlength="MAX_ACCOUNT_NAME"
            ></b-input>
          </b-field>
          <b-field label="表示名">
            <b-input
              v-model="user.displayName"
              :maxlength="MAX_DISPLAY_NAME"
            ></b-input>
          </b-field>
          <b-field label="自己紹介">
            <b-input
              v-model="user.description"
              type="textarea"
              :maxlength="MAX_DESCRIPTION"
            ></b-input>
          </b-field>
        </div>
        <div class="upload">
          <input
            ref="file"
            type="file"
            name="file"
            class="none"
            @change="selectedFile"
          />
        </div>
      </section>
    </template>
  </base-page-template>
</template>

<script lang="ts">
import { Component, Mixins } from 'vue-property-decorator'
import BasePage from '~/mixins/basePage'
import BasePageTemplate from '~/components/pages/basePageTemplate.vue'
import * as types from '~/types/domainTypes'
import { updateUser } from '~/apis/users'
import { toDataUrlOfImage, toBlobFromBase64 } from '~/modules/imageOperation'
import { uploadStorage } from '~/modules/firebase/storage'
import { user } from '~/modules/firebase/firestore/users'
import { icon } from '~/modules/domains/users'

@Component({
  components: {
    BasePageTemplate,
  },
})
export default class PagesUsersIdEdit extends Mixins(BasePage) {
  user: types.User | undefined = undefined
  uploadFiles: File[] = []
  MAX_ACCOUNT_NAME: number = 16
  MAX_DISPLAY_NAME: number = 32
  MAX_DESCRIPTION: number = 512

  async mounted() {
    this.startPageMounted()
    this.user = await user(this.$route.params.id)
    this.endPageMounted()
  }

  destroyed(): void {
    this.user = undefined
    this.uploadFiles = []
  }

  get icon() {
    return icon(this.user)
  }

  get validate(): boolean {
    const result = Boolean(
      this.user && this.user.accountName && this.user.displayName
    )
    if (!result) {
      this.$buefy.toast.open('アカウント名と表示名を入力して下さい')
      return false
    }
    return true
  }

  async save(): Promise<void> {
    if (!this.user || !this.validate) return
    try {
      this.startPageMounted()
      await this.uploadImage()
      await updateUser(this.user)
      this.endPageMounted()
      this.$buefy.toast.open('更新しました💪')
      this.$router.push(`/users/${this.$route.params.id}/profile`)
    } catch {
      this.failedUpdate()
    }
  }

  selectFile(): void {
    const file: HTMLInputElement = this.$refs.file as HTMLInputElement
    file.click()
  }
  selectedFile(e): void {
    this.uploadFiles = e.target.files
    toDataUrlOfImage(e.target.files[0]).then(url => {
      console.log('start')
      if (!this.user) return
      this.user.icon = url
      this.user = { ...this.user } as types.User // DOMの反映のため
      console.log('user', this.user)
    })
  }

  async uploadImage(): Promise<void> {
    if (!this.user || !this.uploadFiles.length || !this.user.icon) return
    const blob = toBlobFromBase64(this.user.icon, this.uploadFiles[0])
    const url = await uploadStorage(blob)
    this.user.icon = url
  }
}
</script>

<style lang="scss" scoped>
.layouts-default {
  .content-container {
    .page-container {
      @include breakpoint() {
        max-width: 590px !important;
      }
    }
  }
}

.icon-container {
  width: 100%;
  text-align: center;
  padding-top: 1rem;
  padding-bottom: 0.5rem;

  .icon {
    width: 6rem;
    height: 6rem;
    border-radius: 50%;
    cursor: pointer;
    object-fit: cover;
  }
}

.change-icon {
  width: 100%;
  font-size: 0.9rem;
  text-align: center;
}

.editcontainer {
  width: 90%;
  margin: auto;
}
</style>
