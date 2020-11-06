<template>
  <section>
    <transition
      name="fade-transform"
      mode="out-in"
    >
      <keep-alive :include="cachedViews">
        <router-view
          v-if="$route.meta.keepAlive"
          :key="key"
        />
      </keep-alive>
    </transition>
    <transition
      name="fade-transform"
      mode="out-in"
    >
      <router-view
        v-if="!$route.meta.keepAlive"
        :key="key"
      />
    </transition>
  </section>
</template>

<script>
export default {
  name: 'Empty',
  computed: {
    cachedViews() {
      return this.$store.state.tagsView.cachedViews
    },
    key() {
      return this.$route.fullPath
    }
  }
}
</script>
