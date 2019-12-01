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
      <AtomsButton value="変更" @click="save" />
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
          <div class="itemcontainer">
            <label for="username" class="username">ユーザー名</label>
            <input
              v-model="user.accountName"
              type="text"
              name="username"
              placeholder="ユーザー名"
              class="username"
            />
          </div>

          <div class="itemcontainer">
            <label for="name" class="name">表示名</label>
            <input
              v-model="user.displayName"
              type="text"
              name="name"
              placeholder="表示名"
              class="name"
            />
          </div>

          <div class="itemcontainer">
            <label for="description" class="description">自己紹介</label>
            <textarea
              v-model="user.description"
              name="description"
              placeholder="自己紹介"
              class="description"
            />
          </div>
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

        <div class="itemcontainer">
          <label for="name" class="name">WebhookURL</label>
          <input
            v-model="webhookUrl"
            type="text"
            name="name"
            placeholder="https://outlook.office.com/webhook/..."
            class="name"
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
import { storeOrUpdateUser } from '~/apis/users'
import AtomsUserIcon from '~/components/atoms/UserIcon.vue'
import AtomsButton from '~/components/atoms/Button.vue'
import { toDataUrlOfImage, toBlobFromBase64 } from '~/modules/imageOperation'
import { uploadStorage } from '~/modules/firebase/storage'
import { user } from '~/modules/firebase/firestore/users'
import { ToastType } from '~/types/applicationTypes'

@Component({
  components: {
    BasePageTemplate,
    AtomsUserIcon,
    AtomsButton,
  },
})
export default class PagesUsersIdEdit extends Mixins(BasePage) {
  id: string | undefined = ''
  user: types.User | null = null
  webhookUrl: string = ''
  uploadFiles: File[] = []
  // TODO: 文字数制限仮設定
  MAX_ACCOUNT_NAME: number = 10
  MAX_DISPLAY_NAME: number = 30
  MAX_DESCRIPTION: number = 1000

  async mounted() {
    this.startPageMounted()
    this.user = await user(this.$route.params.id)
    if (this.user.webhookUrl) this.webhookUrl = this.user.webhookUrl
    this.endPageMounted()
  }

  destroyed(): void {
    this.id = ''
    this.user = null
    this.uploadFiles = []
  }

  get icon() {
    return this.user
      ? this.user.icon
      : 'https://firebasestorage.googleapis.com/v0/b/woven-mapper-232901.appspot.com/o/image%2Fuser-icon1.png?alt=media&token=20949804-68fe-4892-9a81-3c02295bb4f3'
  }

  get validate(): boolean {
    const result = Boolean(
      this.user && this.user.accountName && this.user.displayName
    )
    if (!result) {
      this.toast('danger', 'アカウント名と表示名を入力して下さい')
      return false
    }
    return true
  }

  async save(): Promise<void> {
    if (!this.user || !this.validate) return
    try {
      this.startPageMounted()
      await this.uploadImage()
      const updateUser: types.User = {
        objectID: this.user.objectID,
        accountName: this.user.accountName,
        displayName: this.user.displayName,
        description: this.user.description,
        webhookUrl: this.webhookUrl !== '' ? this.webhookUrl : undefined,
        icon: this.user.icon,
        email: this.user.email,
        createdAt: this.user.createdAt,
        role: this.user.role,
        createdUser: this.user.createdUser,
      }

      await storeOrUpdateUser(updateUser)
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
      // TODO: この処理を入れることで子側のコンポーネントに即時で伝播させているがもう少しスマートに伝播させたい
      this.user = { ...this.user } as types.User
      console.log('user', this.user)
    })
  }

  async uploadImage(): Promise<void> {
    if (!this.user || !this.uploadFiles.length || !this.user.icon) return
    const blob = toBlobFromBase64(this.user.icon, this.uploadFiles[0])
    const url = await uploadStorage(blob)
    this.user.icon = url
  }

  toast(type: ToastType, message: string): void {
    // @ts-ignore
    this.$toast.open({
      duration: 5000,
      message,
      position: 'is-bottom', // TODO: PCではこれを指定したくない
      type: `is-${type}`,
    })
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
  width: 95%;
  margin: auto;
}

.itemcontainer {
  display: flex;
  justify-content: space-around;
  margin: 3rem auto;
  width: 90%;
}

label {
  display: flex;
  font-size: 0.9rem;
  font-weight: bold;
  width: 30%;
}

input {
  display: flex;
  outline: 0;
  border-top: 0;
  border-right: 0;
  border-left: 0;
  border-bottom: solid 1px #707070;
  background: transparent;
  font-size: 0.8rem;
  color: #707070;
  width: 70%;
  border-radius: 0;
}

input[type='text']:focus {
  outline: none;
  background: transparent;
}

input::placeholder {
  color: #c9c9c9;
}

textarea {
  display: flex;
  outline: 0;
  border-top: 0;
  border-right: 0;
  border-left: 0;
  border-bottom: solid 1px #707070;
  background: transparent;
  font-size: 0.8rem;
  color: #707070;
  width: 70%;
  height: 10vh;
  resize: none;
  border-radius: 0;
}

textarea:focus {
  outline: none;
}

textarea::placeholder {
  color: #c9c9c9;
}

.button-area {
  width: 100%;
  text-align: center;
}
</style>
