<template>
  <div class="components-pages-base-page-template">
    <div class="sp-header-nav-container">
      <div class="sp-header-nav">
        <template v-if="isTypeAll">
          <slot name="default" />
        </template>
        <template v-else>
          <div class="left">
            <slot name="header-left" />
          </div>
          <div class="center">
            <slot name="header-center">
              <p>title</p>
            </slot>
          </div>
          <div class="right">
            <slot name="header-right" />
          </div>
        </template>
      </div>
    </div>
    <div class="main-content-container">
      <slot name="content">
        <p>content</p>
      </slot>
    </div>
    <div class="action-base-container">
      <slot name="action" />
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import { NavType } from '~/types/applicationTypes'

@Component
export default class LayoutsNavigationContainersSpHeaderNavsBase extends Vue {
  @Prop({ type: String, default: 'default' }) navType!: NavType

  get isTypeDefault(): boolean {
    return this.navType === 'default'
  }
  get isTypeAll(): boolean {
    return this.navType === 'all'
  }
}
</script>

<style lang="scss" scoped>
.components-pages-base-page-template {
  .sp-header-nav-container {
    z-index: 2;
    position: fixed;
    height: 56px;
    width: 100%;
    max-width: $window-max-width;
    top: 0;
    background-color: $background-primary-color;
    border-bottom: 1px solid $border-color;

    .sp-header-nav {
      width: 100%;
      height: 100%;
      padding: 0 0.5rem;
      display: flex;
      justify-content: space-between;
      align-items: center;

      .left {
        text-align: left;
        width: 30%;
        display: flex;
        justify-content: flex-start;
        align-items: center;
      }

      .center {
        text-align: center;
        font-weight: bold;
        width: 40%;
      }

      .right {
        text-align: right;
        width: 30%;
        display: flex;
        justify-content: flex-end;
        align-items: center;
      }
    }
  }

  .main-content-container {
    margin-top: $header-nav-height;
    margin-bottom: $footer-nav-height;
    min-height: $min-page-height;
    padding: 1rem;
  }

  .action-base-container {
    z-index: 3;
    position: absolute;
    width: 100%;
    max-width: $window-max-width;
    bottom: $action-container-bottom;
    display: flex;
    justify-content: flex-end;
    padding: 2rem;
  }
}
</style>
