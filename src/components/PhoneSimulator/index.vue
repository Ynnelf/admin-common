<template>
  <div
    v-if="visible"
    class="page-wrap"
  >
    <div class="phone-wrap">
      <div class="phone-scene">
        <h1 class="title">
          {{ mainProp.title }}
        </h1>
        <div
          class="content"
          v-html="mainProp.content"
        />
        <img
          v-if="mainProp.otherImgUrl"
          :src="mainProp.otherImgUrl"
          class="other-img"
          alt=""
        >
      </div>
      <i
        class="el-icon-circle-close icon-close"
        @click="hiddenPhone"
      />
      <svg-icon
        class-name="icon-settings"
        icon-class="settings"
        @click="toPageStyleSetting"
      />
    </div>
    <div
      class="page-mask"
      @click="hiddenPhone"
      @mousewheel.prevent
    />
  </div>
</template>

<script>
export default {
  name: 'PhoneSimulator',
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    mainProp: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  data() {
    return {}
  },
  computed: {},
  created() {
    this.initStyleTag()
  },
  methods: {
    initStyleTag() {
      const oldStyle = document.getElementById('phone-css')
      if (oldStyle) {
        document.getElementsByTagName('head')[0].removeChild(oldStyle)
      }
      const styleTag = document.createElement('link')
      styleTag.id = 'phone-css'
      styleTag.rel = 'stylesheet'
      styleTag.type = 'text/css'
      styleTag.href =
        'https://zuiyouliao.oss-cn-beijing.aliyuncs.com/zx/css/phone.css'
      document.getElementsByTagName('head')[0].appendChild(styleTag)
    },
    hiddenPhone() {
      this.$emit('close')
    },
    toPageStyleSetting() {
      this.$router.push({
        path: '/article/ArticleCss',
        query: {
          timestamp: Date.now()
        }
      })
    }
  }
}
</script>
<style lang='scss' scoped>
.page-wrap {
  .page-mask {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.7);
    z-index: 999;
  }
  .phone-wrap {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate3d(-50%, -50%, 0);
    width: 400px;
    height: 820px;
    z-index: 1000;
    background-image: url('~@/assets/images/phone.png');
    background-repeat: no-repeat;
    background-size: contain;
    .phone-img {
      width: 100%;
      margin: 0 !important;
      background: transparent !important;
    }
    .phone-scene {
      position: absolute;
      top: 98px;
      left: 25px;
      right: 25px;
      bottom: 99px;
      background-color: #fff;
      overflow: scroll;
      overflow-x: hidden;
      padding: 10px;
      &::-webkit-scrollbar {
        display: none; /* Chrome Safari */
      }
    }
    .icon-close {
      position: absolute;
      top: -20px;
      right: -80px;
      font-size: 60px;
      color: #fff;
      cursor: pointer;
    }
    .icon-settings {
      position: absolute;
      bottom: 20px;
      right: -80px;
      font-size: 60px;
      color: #fff;
      cursor: pointer;
      &:hover {
        color: rgb(117, 181, 255);
      }
    }
  }
}
</style>
